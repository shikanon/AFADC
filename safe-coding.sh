#!/usr/bin/env bash
# safe-coding.sh - 安全的AI编码辅助脚本（本地分支管理版）

# 配置
BASE_BRANCH=""
TMP_BRANCH_PREFIX="ai-edit"
LOG_FILE=".safe-coding.log"  # 操作日志文件

# 颜色和样式
BOLD=$(tput bold)
NORMAL=$(tput sgr0)
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)

# 工具函数
error_exit() {
    log "错误: $1"
    echo "${RED}Error: $1${NORMAL}" >&2
    exit 1
}

info() {
    log "信息: $1"
    echo "${BLUE}Info: $1${NORMAL}"
}

success() {
    log "成功: $1"
    echo "${GREEN}Success: $1${NORMAL}"
}

warning() {
    log "警告: $1"
    echo "${YELLOW}Warning: $1${NORMAL}"
}

# 日志记录函数
log() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $1" >> "$LOG_FILE"
}

# 显示使用帮助
show_help() {
    echo "${BOLD}安全编码辅助脚本使用说明${NORMAL}"
    echo "用于管理AI辅助编码时的本地分支操作，确保代码修改安全可控"
    echo
    echo "使用方法: $0 [选项]"
    echo "选项:"
    echo "  help    显示此帮助信息"
    echo
    echo "主要功能:"
    echo "  1. 自动检测主分支（main或master）"
    echo "  2. 在非临时分支时，创建新的临时分支供AI修改"
    echo "  3. 在临时分支时，可选择提交修改、回退修改或继续开发"
    echo "  4. 所有操作会记录到日志文件: $LOG_FILE"
    echo
    echo "操作流程:"
    echo "  1. 首次运行脚本: 自动创建临时分支"
    echo "  2. 在临时分支进行AI辅助修改"
    echo "  3. 再次运行脚本: 选择提交或回退"
    echo "  4. 提交后会将修改合并到主分支并删除临时分支"
    exit 0
}

# 检查是否在Git仓库
check_git_repo() {
    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        error_exit "当前目录不是Git仓库"
    fi
    log "已确认在Git仓库中操作"
}

# 确定主分支
detect_base_branch() {
    if git show-ref --verify --quiet refs/heads/main; then
        BASE_BRANCH="main"
    elif git show-ref --verify --quiet refs/heads/master; then
        BASE_BRANCH="master"
    else
        # 尝试使用默认分支
        BASE_BRANCH=$(git remote show origin | awk '/HEAD branch/ {print $3}')
        if [ -z "$BASE_BRANCH" ]; then
            error_exit "无法检测主分支，请手动设置"
        fi
    fi
    info "检测到主分支: $BASE_BRANCH"
    log "主分支确定为: $BASE_BRANCH"
}

# 检查是否有未提交的更改
check_uncommitted_changes() {
    if ! git diff-index --quiet HEAD --; then
        error_exit "当前有未提交的更改，请先提交或 stash"
    fi
    log "检查未提交更改: 无未提交更改"
}

# 创建临时分支
create_temp_branch() {
    local timestamp=$(date +%Y%m%d%H%M%S)
    local branch_name="${TMP_BRANCH_PREFIX}-${timestamp}"
    
    git checkout "$BASE_BRANCH" || error_exit "切换到主分支失败"
    git pull --rebase origin "$BASE_BRANCH" || error_exit "拉取最新代码失败"
    git checkout -b "$branch_name" || error_exit "创建临时分支失败"
    
    success "已创建并切换到临时分支: ${BOLD}$branch_name${NORMAL}"
    log "创建临时分支: $branch_name"
    echo "你现在可以安全地进行AI辅助修改了"
    echo "完成后，再次运行此脚本选择提交或回退"
    
    exit 0
}

# 回退修改
revert_changes() {
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [[ ! "$current_branch" =~ ^${TMP_BRANCH_PREFIX}- ]]; then
        error_exit "当前不在临时分支，无法回退"
    fi
    
    warning "确定要放弃当前分支的所有修改吗？这将无法恢复！"
    read -p "输入 'yes' 确认回退: " confirm
    if [ "$confirm" != "yes" ]; then
        info "已取消回退操作"
        log "用户取消回退操作，分支: $current_branch"
        exit 0
    fi
    
    git checkout "$BASE_BRANCH" || error_exit "切换到主分支失败"
    git branch -D "$current_branch" || error_exit "删除临时分支失败"
    
    success "已回退到修改前状态，当前位于主分支: $BASE_BRANCH"
    log "已回退修改，已删除临时分支: $current_branch"
    exit 0
}

# 提交修改
commit_changes() {
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [[ ! "$current_branch" =~ ^${TMP_BRANCH_PREFIX}- ]]; then
        error_exit "当前不在临时分支，无法提交"
    fi
    
    # 检查临时分支是否有变更
    if git diff --quiet && git diff --cached --quiet; then
        warning "临时分支「$current_branch」没有任何变更（包括暂存区），谨慎操作"
        read -p "是否删除分支并返回主分支? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            git checkout "$BASE_BRANCH"
            git branch -D "$current_branch"
            success "已删除空分支并返回主分支"
            log "删除空临时分支: $current_branch"
        else
            log "保留空临时分支: $current_branch"
        fi
        exit 0
    fi
    
    # 步骤1：确保临时分支的所有变更已提交（允许用户有多次自主提交）
    if ! git diff-index --quiet HEAD --; then
        echo "检测到临时分支有未提交的变更，需要先提交"
        read -p "请输入本次提交信息（用于临时分支）: " temp_commit_msg
        git add -A
        git commit -m "[$current_branch] $temp_commit_msg" || error_exit "临时分支提交失败"
        log "临时分支提交: $current_branch，信息: $temp_commit_msg"
    fi
    
    # 步骤2：同步主分支最新状态到临时分支
    info "开始同步主分支「$BASE_BRANCH」的最新状态到临时分支..."
    git checkout "$BASE_BRANCH" || error_exit "切换到主分支失败"
    # 用户无需push，这里仅确保基于本地主分支最新状态同步
    git checkout "$current_branch" || error_exit "切换回临时分支失败"
    git merge "$BASE_BRANCH" -m "Merge base branch '$BASE_BRANCH' into '$current_branch'"
    
    # 处理合并冲突
    if [ $? -ne 0 ]; then
        warning "合并主分支时发现冲突！请手动解决冲突后执行以下命令："
        echo "  1. 解决冲突后：git add <冲突文件>"
        echo "  2. 完成合并：git commit -m '解决主分支合并冲突'"
        echo "  3. 再次运行本脚本选择「提交修改」完成合并"
        log "临时分支 $current_branch 与主分支 $BASE_BRANCH 合并冲突，需手动解决"
        exit 1
    fi
    log "已将主分支 $BASE_BRANCH 最新状态同步到临时分支 $current_branch"
    
    # 步骤3：将临时分支合并到主分支
    read -p "请输入合并到主分支的提交信息: " final_commit_msg
    git checkout "$BASE_BRANCH" || error_exit "切换到主分支失败"
    git merge --no-ff "$current_branch" -m "$final_commit_msg" || error_exit "合并到主分支失败"
    log "将临时分支 $current_branch 合并到主分支 $BASE_BRANCH，信息: $final_commit_msg"
    
    # 步骤4：删除临时分支
    git branch -d "$current_branch" || error_exit "删除临时分支失败"
    log "已删除临时分支: $current_branch"
    
    success "所有修改已成功合并到主分支「$BASE_BRANCH」"
    echo "提示: 主分支当前包含临时分支的所有变更（包括你的自主提交）"
    exit 0
}

# 主函数
main() {
    # 检查是否需要显示帮助
    if [ "$1" = "help" ]; then
        show_help
    fi
    
    check_git_repo
    detect_base_branch
    
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    log "当前分支: $current_branch"
    
    # 如果当前不在临时分支，创建新的临时分支
    if [[ ! "$current_branch" =~ ^${TMP_BRANCH_PREFIX}- ]]; then
        check_uncommitted_changes
        create_temp_branch
    fi
    
    # 如果当前在临时分支，显示操作菜单
    echo "${BOLD}你当前在临时分支: $current_branch${NORMAL}"
    echo "请选择操作:"
    echo "1) ${GREEN}提交修改${NORMAL} - 将更改合并到主分支"
    echo "2) ${RED}回退修改${NORMAL} - 放弃所有更改，返回主分支"
    echo "3) ${YELLOW}继续开发${NORMAL} - 保持当前状态不变"
    echo "4) ${BLUE}显示帮助${NORMAL} - 查看使用说明"
    
    read -p "请输入选项 (1/2/3/4): " choice
    
    case $choice in
        1)
            commit_changes
            ;;
        2)
            revert_changes
            ;;
        3)
            info "继续在临时分支开发: $current_branch"
            log "用户选择继续在临时分支开发: $current_branch"
            exit 0
            ;;
        4)
            show_help
            ;;
        *)
            error_exit "无效选项"
            ;;
    esac
}

main "$@"