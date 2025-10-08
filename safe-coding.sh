#!/usr/bin/env bash
# safe-coding.sh - 安全的AI编码辅助脚本

# 配置
BASE_BRANCH=""
TMP_BRANCH_PREFIX="ai-edit"

# 颜色和样式
BOLD=$(tput bold)
NORMAL=$(tput sgr0)
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)

# 工具函数
error_exit() {
    echo "${RED}Error: $1${NORMAL}" >&2
    exit 1
}

info() {
    echo "${BLUE}Info: $1${NORMAL}"
}

success() {
    echo "${GREEN}Success: $1${NORMAL}"
}

warning() {
    echo "${YELLOW}Warning: $1${NORMAL}"
}

# 检查是否在Git仓库
check_git_repo() {
    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        error_exit "当前目录不是Git仓库"
    fi
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
}

# 检查是否有未提交的更改
check_uncommitted_changes() {
    if ! git diff-index --quiet HEAD --; then
        error_exit "当前有未提交的更改，请先提交或 stash"
    fi
}

# 创建临时分支
create_temp_branch() {
    local timestamp=$(date +%Y%m%d%H%M%S)
    local branch_name="${TMP_BRANCH_PREFIX}-${timestamp}"
    
    git checkout "$BASE_BRANCH" || error_exit "切换到主分支失败"
    git pull --rebase origin "$BASE_BRANCH" || error_exit "拉取最新代码失败"
    git checkout -b "$branch_name" || error_exit "创建临时分支失败"
    
    success "已创建并切换到临时分支: ${BOLD}$branch_name${NORMAL}"
    echo "你现在可以安全地进行修改了"
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
        exit 0
    fi
    
    git checkout "$BASE_BRANCH" || error_exit "切换到主分支失败"
    git branch -D "$current_branch" || error_exit "删除临时分支失败"
    
    success "已回退到修改前状态，当前位于主分支: $BASE_BRANCH"
    exit 0
}

# 提交修改
commit_changes() {
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [[ ! "$current_branch" =~ ^${TMP_BRANCH_PREFIX}- ]]; then
        error_exit "当前不在临时分支，无法提交"
    fi
    
    if git diff-index --quiet HEAD --; then
        warning "当前分支没有任何修改，无需提交"
        read -p "是否删除此空分支并返回主分支? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            git checkout "$BASE_BRANCH"
            git branch -D "$current_branch"
            success "已删除空分支并返回主分支"
        fi
        exit 0
    fi
    
    read -p "请输入提交信息: " commit_msg
    
    git add -A
    git commit -m "$commit_msg" || error_exit "提交失败"
    
    git checkout "$BASE_BRANCH" || error_exit "切换到主分支失败"
    git merge --no-ff "$current_branch" -m "Merge branch '$current_branch': $commit_msg" || error_exit "合并失败"
    
    read -p "是否推送到远程仓库? (y/n): " push_confirm
    if [ "$push_confirm" = "y" ]; then
        git push origin "$BASE_BRANCH" || error_exit "推送失败"
    fi
    
    git branch -d "$current_branch" || error_exit "删除临时分支失败"
    
    success "已成功提交修改并返回主分支"
    exit 0
}

# 主函数
main() {
    check_git_repo
    detect_base_branch
    
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    
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
    
    read -p "请输入选项 (1/2/3): " choice
    
    case $choice in
        1)
            commit_changes
            ;;
        2)
            revert_changes
            ;;
        3)
            info "继续在临时分支开发: $current_branch"
            exit 0
            ;;
        *)
            error_exit "无效选项"
            ;;
    esac
}

main "$@"