# API 接口文档

## 📋 目录

- [API 接口文档](#api-接口文档)
  - [📋 目录](#-目录)
  - [基础信息](#基础信息)
  - [1. 认证模块](#1-认证模块)
    - [1.1 用户注册](#11-用户注册)
    - [1.2 用户登录](#12-用户登录)
    - [1.3 获取当前用户信息](#13-获取当前用户信息)
  - [2. 用户管理模块](#2-用户管理模块)
    - [2.1 获取用户列表](#21-获取用户列表)
    - [2.2 创建用户](#22-创建用户)
    - [2.3 更新当前用户信息](#23-更新当前用户信息)
    - [2.4 删除用户](#24-删除用户)
  - [3. 项目管理模块](#3-项目管理模块)
    - [3.1 获取项目列表](#31-获取项目列表)
    - [3.2 创建项目](#32-创建项目)
    - [3.3 获取项目详情](#33-获取项目详情)
    - [3.4 更新项目](#34-更新项目)
    - [3.5 删除项目](#35-删除项目)
  - [4. 场景管理模块](#4-场景管理模块)
    - [4.1 获取场景列表](#41-获取场景列表)
  - [5. 章节管理](#5-章节管理)
    - [5.1 获取章节列表](#51-获取章节列表)
    - [5.2 创建章节](#52-创建章节)
    - [5.3 更新章节](#53-更新章节)
    - [5.4 删除章节](#54-删除章节)
    - [5.5 拆分章节为分镜](#55-拆分章节为分镜)
  - [6. 分镜管理](#6-分镜管理)
    - [6.1 获取分镜列表](#61-获取分镜列表)
    - [6.2 更新分镜](#62-更新分镜)
    - [6.3 生成分镜图片](#63-生成分镜图片)
    - [6.4 生成分镜关键帧](#64-生成分镜关键帧)
    - [6.5 生成分镜视频](#65-生成分镜视频)
  - [7. 角色管理模块](#7-角色管理模块)
    - [7.1 获取角色列表](#71-获取角色列表)
    - [7.2 获取角色详情](#72-获取角色详情)
    - [7.3 创建角色](#73-创建角色)
    - [7.4 更新角色](#74-更新角色)
    - [7.5 删除角色](#75-删除角色)
    - [7.6 将角色立绘导入素材库](#76-将角色立绘导入素材库)
  - [8. 素材管理模块](#8-素材管理模块)
    - [8.1 获取素材列表](#81-获取素材列表)
    - [8.2 创建素材](#82-创建素材)
    - [8.3 更新素材](#83-更新素材)
    - [8.4 删除素材](#84-删除素材)
  - [9. 任务管理模块](#9-任务管理模块)
    - [9.1 获取任务列表](#91-获取任务列表)
    - [9.2 获取任务详情](#92-获取任务详情)
    - [9.3 创建自定义任务](#93-创建自定义任务)
    - [9.4 重试任务](#94-重试任务)
    - [9.5 创建文生图任务](#95-创建文生图任务)
    - [9.6 批量生成角色立绘](#96-批量生成角色立绘)
  - [10. 存储管理模块](#10-存储管理模块)
    - [10.1 上传文件](#101-上传文件)
    - [10.2 获取预签名URL](#102-获取预签名url)
  - [11. AI生成模块](#11-ai生成模块)
    - [11.1 文生图](#111-文生图)
    - [11.2 图生图](#112-图生图)
    - [11.3 文生视频](#113-文生视频)
    - [11.4 图生视频](#114-图生视频)
  - [12. AI代理模块](#12-ai代理模块)
    - [12.1 运行工作流](#121-运行工作流)
    - [12.2 批量生成角色](#122-批量生成角色)
  - [13. 通知模块](#13-通知模块)
    - [13.1 获取通知列表](#131-获取通知列表)
    - [13.2 标记通知已读](#132-标记通知已读)
  - [14. 套餐管理模块](#14-套餐管理模块)
    - [14.1 获取套餐列表](#141-获取套餐列表)
    - [14.2 创建套餐](#142-创建套餐)
    - [14.3 获取套餐详情](#143-获取套餐详情)
    - [14.4 更新套餐](#144-更新套餐)
    - [14.5 删除套餐](#145-删除套餐)
    - [14.6 订阅套餐](#146-订阅套餐)
  - [15. 支付模块](#15-支付模块)
    - [15.1 创建微信支付订单](#151-创建微信支付订单)
    - [15.2 查询支付状态](#152-查询支付状态)
    - [15.3 微信支付回调](#153-微信支付回调)
  - [16. 设置模块](#16-设置模块)
    - [16.1 获取API密钥列表](#161-获取api密钥列表)
    - [16.2 创建API密钥](#162-创建api密钥)
    - [16.3 更新API密钥](#163-更新api密钥)
    - [16.4 删除API密钥](#164-删除api密钥)
  - [17. 语音合成模块](#17-语音合成模块)
    - [17.1 获取音色列表](#171-获取音色列表)
    - [17.2 文本转语音](#172-文本转语音)
  - [数据模型](#数据模型)
    - [UserRead](#userread)
    - [ProjectRead](#projectread)
    - [ChapterRead](#chapterread)
    - [CharacterRead](#characterread)
    - [AssetRead](#assetread)
    - [TaskRead](#taskread)
  - [错误处理](#错误处理)
    - [错误响应格式](#错误响应格式)
    - [HTTP状态码](#http状态码)
    - [常见错误示例](#常见错误示例)
  - [附录](#附录)
    - [项目类型 (ProjectType)](#项目类型-projecttype)
    - [项目状态 (ProjectStatus)](#项目状态-projectstatus)
    - [素材类型 (AssetType)](#素材类型-assettype)
    - [素材子类型 (AssetSubType)](#素材子类型-assetsubtype)
    - [创建方式 (CreationMethod)](#创建方式-creationmethod)
    - [任务状态 (TaskStatus)](#任务状态-taskstatus)

---

## 基础信息

- **Base URL**: `/api`
- **认证方式**: Bearer Token
  - 通过 `Authorization: Bearer <token>` header 传递
  - Token 通过登录/注册接口获取
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

---

## 1. 认证模块

路径前缀: `/api/auth`

### 1.1 用户注册

创建新的组织和管理员账号。

**请求**

```http
POST /api/auth/register
Content-Type: application/json
```

**请求体**

```json
{
  "email": "admin@example.com",
  "password": "password123",
  "organization_name": "我的公司",
  "display_name": "张三"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址,必须是有效格式 |
| password | string | 是 | 密码,至少6位 |
| organization_name | string | 是 | 组织名称,至少2个字符 |
| display_name | string | 否 | 显示名称,默认为邮箱前缀 |

**curl 示例**

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "organization_name": "我的公司",
    "display_name": "张三"
  }'
```

**响应** (200)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "org1_admin",
    "display_name": "张三",
    "email": "admin@example.com",
    "phone": null,
    "role": "admin",
    "organization_id": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**错误码**

- `400`: 邮箱已被注册 / 组织名称为空 / 密码少于6位

---

### 1.2 用户登录

使用用户名/邮箱/手机号登录。

**请求**

```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded
```

**请求体** (OAuth2PasswordRequestForm)

```
username=admin@example.com&password=password123
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名/邮箱/手机号 |
| password | string | 是 | 密码 |

**curl 示例**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=password123"
```

**响应** (200)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "org1_admin",
    "display_name": "张三",
    "email": "admin@example.com",
    "phone": null,
    "role": "admin",
    "organization_id": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**错误码**

- `400`: 账号不能为空 / 用户名或密码错误

---

### 1.3 获取当前用户信息

获取当前登录用户的详细信息。

**请求**

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**curl 示例**

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
{
  "id": 1,
  "username": "org1_admin",
  "display_name": "张三",
  "email": "admin@example.com",
  "phone": null,
  "role": "admin",
  "organization_id": 1,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**错误码**

- `401`: 未认证或 token 无效

---

## 2. 用户管理模块

路径前缀: `/api/users`

所有接口均需要认证。

### 2.1 获取用户列表

获取组织内的用户列表(仅管理员)。

**请求**

```http
GET /api/users?page=1&size=20
Authorization: Bearer <token>
```

**查询参数**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | integer | 否 | 1 | 页码,最小为1 |
| size | integer | 否 | 20 | 每页数量,范围1-100 |

**curl 示例**

```bash
curl -X GET "http://localhost:8000/api/users?page=1&size=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
[
  {
    "id": 1,
    "username": "org1_admin",
    "display_name": "张三",
    "email": "admin@example.com",
    "phone": null,
    "role": "admin",
    "organization_id": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**错误码**

- `401`: 未认证
- `403`: 无管理员权限

---

### 2.2 创建用户

创建新用户(仅管理员)。

**请求**

```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "username": "user001",
  "display_name": "李四",
  "email": "lisi@example.com",
  "phone": "13800138000",
  "role": "editor",
  "password": "password123"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| display_name | string | 否 | 显示名称 |
| email | string | 否 | 邮箱地址 |
| phone | string | 否 | 手机号,至少6位数字 |
| role | string | 是 | 角色,默认"editor" |
| password | string | 是 | 密码 |

**curl 示例**

```bash
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user001",
    "display_name": "李四",
    "email": "lisi@example.com",
    "phone": "13800138000",
    "role": "editor",
    "password": "password123"
  }'
```

**响应** (201)

```json
{
  "id": 2,
  "username": "user001",
  "display_name": "李四",
  "email": "lisi@example.com",
  "phone": "13800138000",
  "role": "editor",
  "organization_id": 1,
  "is_active": true,
  "created_at": "2024-01-02T00:00:00Z"
}
```

**错误码**

- `400`: 邮箱已被占用 / 手机号已被占用 / 手机号格式不正确
- `403`: 无管理员权限

---

### 2.3 更新当前用户信息

更新当前登录用户的个人信息。

**请求**

```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "display_name": "张三丰",
  "email": "zhangsan@example.com",
  "phone": "13900139000"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| display_name | string | 否 | 显示名称,最多150字符 |
| email | string | 否 | 邮箱地址 |
| phone | string | 否 | 手机号,至少6位数字 |

**响应** (200)

```json
{
  "id": 1,
  "username": "org1_admin",
  "display_name": "张三丰",
  "email": "zhangsan@example.com",
  "phone": "13900139000",
  "role": "admin",
  "organization_id": 1,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**错误码**

- `400`: 请至少填写一项更新内容 / 邮箱已被占用 / 手机号已被占用

---

### 2.4 删除用户

删除指定用户(仅管理员)。

**请求**

```http
DELETE /api/users/{user_id}
Authorization: Bearer <token>
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| user_id | integer | 用户ID |

**响应** (204)

无内容

**错误码**

- `403`: 无管理员权限
- `404`: 用户不存在

---

## 3. 项目管理模块

路径前缀: `/api/projects`

### 3.1 获取项目列表

获取组织内的所有项目。

**请求**

```http
GET /api/projects?page=1&size=20&search=测试
Authorization: Bearer <token>
```

**查询参数**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | integer | 否 | 1 | 页码,最小为1 |
| size | integer | 否 | 20 | 每页数量,范围1-100 |
| search | string | 否 | - | 搜索关键词,模糊匹配项目名称 |

**curl 示例**

```bash
# 获取第一页,每页20条
curl -X GET "http://localhost:8000/api/projects?page=1&size=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 搜索项目
curl -X GET "http://localhost:8000/api/projects?search=测试" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
[
  {
    "id": 1,
    "name": "测试项目",
    "project_type": "static_comic",
    "status": "draft",
    "description": "项目描述",
    "cover_image": "http://localhost:8000/assets/project_cover.png",
    "video_scale": "16:9",
    "video_resolution": "720p",
    "prompt": "创作一部温馨治愈的静态漫画,画风清新简洁,色调以柔和的暖色为主",
    "organization_id": 1,
    "created_by_id": 1,
    "created_by": {
      "id": 1,
      "username": "testuser",
      "display_name": "测试用户"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 项目ID |
| name | string | 项目名称 |
| project_type | string | 项目类型 |
| status | string | 项目状态 |
| description | string | 项目描述 |
| cover_image | string | 封面图片URL |
| video_scale | string | 视频比例(如16:9) |
| video_resolution | string | 视频分辨率(如720p) |
| prompt | string | 项目创作提示词,用于指导整体风格和创作方向 |
| organization_id | integer | 组织ID |
| created_by_id | integer | 创建人ID |
| created_by | object | 创建人信息,包含id、username、display_name |
| created_at | string | 创建时间(ISO 8601格式) |

---

### 3.2 创建项目

创建新项目。

**请求**

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "name": "我的第一个项目",
  "project_type": "static_comic",
  "status": "draft",
  "description": "项目描述",
  "cover_image": "http://localhost:8000/assets/project_cover.png",
  "video_scale": "16:9",
  "video_resolution": "1080p",
  "prompt": "创作一部温馨治愈的静态漫画,画风清新简洁,色调以柔和的暖色为主"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 项目名称 |
| project_type | string | 是 | 项目类型: `static_comic`(静态漫) / `dynamic_comic`(动态漫) |
| status | string | 否 | 项目状态,默认`draft` |
| description | string | 否 | 项目描述 |
| cover_image | string | 否 | 封面图片URL |
| video_scale | string | 否 | 视频比例,如: `16:9`, `4:3` |
| video_resolution | string | 否 | 视频分辨率,如: `720p`, `1080p`, `4K` |
| prompt | string | 否 | 项目创作提示词,用于指导整体风格和创作方向 |

**项目状态枚举**

- `draft`: 草稿
- `progress`: 进行中
- `completed`: 已完成
- `failed`: 失败

**curl 示例**

```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "我的第一个项目",
    "project_type": "static_comic",
    "status": "draft",
    "description": "项目描述",
    "video_scale": "16:9",
    "video_resolution": "1080p",
    "prompt": "创作一部温馨治愈的静态漫画,画风清新简洁,色调以柔和的暖色为主"
  }'
```

**说明**

- `cover_image` 会自动设置为默认封面图
  - 如果配置了 `API_BASE_URL` 环境变量,使用配置的域名(如 `https://api.yourdomain.com/assets/project_cover.png`)
  - 否则使用请求的基础URL(如 `http://localhost:8000/assets/project_cover.png`)
- 默认封面图文件位于服务器的 `/assets/project_cover.png` 路径
- 配置示例: `.env` 文件中添加 `API_BASE_URL=https://api.yourdomain.com`

**响应** (201)

```json
{
  "id": 1,
  "name": "我的第一个项目",
  "project_type": "static_comic",
  "status": "draft",
  "description": "项目描述",
  "cover_image": "http://localhost:8000/assets/project_cover.png",
  "video_scale": "16:9",
  "video_resolution": "1080p",
  "prompt": "创作一部温馨治愈的静态漫画,画风清新简洁,色调以柔和的暖色为主",
  "organization_id": 1,
  "created_by_id": 1,
  "created_by": {
    "id": 1,
    "username": "testuser",
    "display_name": "测试用户"
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 3.3 获取项目详情

获取指定项目的详细信息。

**请求**

```http
GET /api/projects/{project_id}
Authorization: Bearer <token>
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| project_id | integer | 项目ID |

**curl 示例**

```bash
curl -X GET http://localhost:8000/api/projects/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
{
  "id": 1,
  "name": "我的第一个项目",
  "project_type": "static_comic",
  "status": "draft",
  "description": null,
  "cover_image": "http://localhost:8000/assets/project_cover.png",
  "video_scale": null,
  "video_resolution": null,
  "prompt": "创作一部温馨治愈的静态漫画,画风清新简洁,色调以柔和的暖色为主",
  "organization_id": 1,
  "created_by_id": 1,
  "created_by": {
    "id": 1,
    "username": "testuser",
    "display_name": "测试用户"
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

**错误码**

- `404`: 项目不存在

---

### 3.4 更新项目

更新项目信息。

**请求**

```http
PATCH /api/projects/{project_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| project_id | integer | 项目ID |

**请求体**

```json
{
  "name": "更新后的项目名称",
  "status": "progress",
  "description": "更新后的项目描述",
  "cover_image": "http://localhost:8000/assets/new_cover.png",
  "video_scale": "4:3",
  "prompt": "更新后的创作提示词,风格更加成熟稳重"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 项目名称 |
| status | string | 否 | 项目状态 |
| description | string | 否 | 项目描述 |
| cover_image | string | 否 | 封面图片URL |
| video_scale | string | 否 | 视频比例 |
| video_resolution | string | 否 | 视频分辨率 |
| prompt | string | 否 | 项目创作提示词 |

**curl 示例**

```bash
curl -X PATCH http://localhost:8000/api/projects/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "更新后的项目名称",
    "status": "progress",
    "description": "更新后的项目描述",
    "cover_image": "http://localhost:8000/assets/new_cover.png",
    "video_scale": "4:3",
    "prompt": "更新后的创作提示词,风格更加成熟稳重"
  }'
```

**响应** (200)

返回更新后的完整项目对象。

**错误码**

- `404`: 项目不存在

---

### 3.5 删除项目

删除指定项目及其所有关联数据(章节、分镜等)。

**请求**

```http
DELETE /api/projects/{project_id}
Authorization: Bearer <token>
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| project_id | integer | 项目ID |

**curl 示例**

```bash
curl -X DELETE http://localhost:8000/api/projects/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (204)

无内容

**错误码**

- `404`: 项目不存在

---

## 4. 场景管理模块

路径前缀: `/api/projects/{project_id}/scenes`

### 4.1 获取场景列表

按创建时间升序获取指定项目下的全部场景。

**请求**

```http
GET /api/projects/{project_id}/scenes
Authorization: Bearer <token>
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| project_id | integer | 项目ID |

**curl 示例**

```bash
curl -X GET http://localhost:8000/api/projects/1/scenes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
[
  {
    "id": 1,
    "project_id": 1,
    "name": "黎明街景",
    "description": "静态漫项目的首个场景,展现东方初升的暖色光线。",
    "prompt": "生成一幅黎明时分的城市街景,氛围温暖且充满希望",
    "image_url": "http://localhost:8000/static/uploads/scene_1.png",
    "created_by": {
      "id": 1,
      "username": "testuser",
      "display_name": "测试用户"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 场景ID |
| project_id | integer | 所属项目ID |
| name | string | 场景名称 |
| description | string | 场景描述,可为空 |
| prompt | string | 场景生成提示词 |
| image_url | string | 场景图像地址,可能为空 |
| created_by | object | 创建人信息,包含 `id`、`username`、`display_name` |
| created_at | string | 记录创建时间(ISO 8601格式) |

**错误码**

- `404`: 项目不存在或无权限访问

---

## 5. 章节管理

路径前缀: `/api/projects/{project_id}/chapters`

### 5.1 获取章节列表

获取项目的所有章节。

**请求**

```http
GET /api/projects/{project_id}/chapters
Authorization: Bearer <token>
```

**curl 示例**

```bash
curl -X GET http://localhost:8000/api/projects/1/chapters \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
[
  {
    "id": 1,
    "name": "第一章",
    "script_content": "剧本内容...",
    "order_index": 0,
    "project_id": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "storyboards": []
  }
]
```

---

### 5.2 创建章节

为项目创建新章节。

**请求**

```http
POST /api/projects/{project_id}/chapters
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "name": "第一章",
  "script_content": "这是第一章的剧本内容...",
  "order_index": 0
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 章节名称 |
| script_content | string | 否 | 剧本内容 |
| order_index | integer | 否 | 排序索引,默认0 |

**curl 示例**

```bash
curl -X POST http://localhost:8000/api/projects/1/chapters \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "第一章",
    "script_content": "这是第一章的剧本内容...",
    "order_index": 0
  }'
```

**响应** (201)

```json
{
  "id": 1,
  "name": "第一章",
  "script_content": "这是第一章的剧本内容...",
  "order_index": 0,
  "project_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "storyboards": []
}
```

---

### 5.3 更新章节

更新章节信息。

**请求**

```http
PATCH /api/projects/{project_id}/chapters/{chapter_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| project_id | integer | 项目ID |
| chapter_id | integer | 章节ID |

**请求体**

```json
{
  "name": "更新后的章节名",
  "script_content": "更新后的剧本内容",
  "order_index": 1
}
```

**curl 示例**

```bash
curl -X PATCH http://localhost:8000/api/projects/1/chapters/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "更新后的章节名",
    "script_content": "更新后的剧本内容",
    "order_index": 1
  }'
```

**响应** (200)

返回更新后的完整章节对象。

**错误码**

- `404`: 章节不存在

---

### 5.4 删除章节

删除指定章节及其所有分镜。

**请求**

```http
DELETE /api/projects/{project_id}/chapters/{chapter_id}
Authorization: Bearer <token>
```

**curl 示例**

```bash
curl -X DELETE http://localhost:8000/api/projects/1/chapters/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (204)

无内容

---

### 5.5 拆分章节为分镜

使用AI将章节剧本自动拆分为多个分镜。

**请求**

```http
POST /api/projects/{project_id}/chapters/{chapter_id}/split
Authorization: Bearer <token>
```

**curl 示例**

```bash
curl -X POST http://localhost:8000/api/projects/1/chapters/1/split \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
[
  {
    "id": 1,
    "chapter_id": 1,
    "order_index": 0,
    "dialogue": "角色对话内容",
    "scene_description": "场景描述",
    "image_url": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

## 6. 分镜管理

路径前缀: `/api/projects/{project_id}/chapters/{chapter_id}/storyboards`

### 6.1 获取分镜列表

获取章节的所有分镜。

**请求**

```http
GET /api/projects/{project_id}/chapters/{chapter_id}/storyboards
Authorization: Bearer <token>
```

**响应** (200)

```json
[
  {
    "id": 1,
    "chapter_id": 1,
    "order_index": 0,
    "dialogue": "角色对话内容",
    "scene_description": "场景描述",
    "image_url": "https://example.com/storyboard1.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 6.2 更新分镜

更新分镜信息。

**请求**

```http
PATCH /api/projects/{project_id}/chapters/{chapter_id}/storyboards/{storyboard_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "dialogue": "更新后的对话",
  "scene_description": "更新后的场景描述",
  "image_url": "https://example.com/new_image.jpg",
  "order_index": 1
}
```

**响应** (200)

返回更新后的完整分镜对象。

---

### 6.3 生成分镜图片

为项目所有分镜异步生成图片。

**请求**

```http
POST /api/projects/{project_id}/storyboards:generate-images
Authorization: Bearer <token>
```

**响应** (200)

```json
{
  "id": 1,
  "task_type": "generate_storyboard_images",
  "status": "queued",
  "payload": {
    "project_id": 1
  },
  "progress": 0,
  "result": null,
  "error_message": null,
  "retry_token": null,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 6.4 生成分镜关键帧

为项目所有分镜异步生成关键帧。

**请求**

```http
POST /api/projects/{project_id}/storyboards:generate-keyframes
Authorization: Bearer <token>
```

**响应** (200)

返回任务对象(格式同上)。

---

### 6.5 生成分镜视频

为项目所有分镜异步生成视频。

**请求**

```http
POST /api/projects/{project_id}/storyboards:generate-videos
Authorization: Bearer <token>
```

**响应** (200)

返回任务对象(格式同上)。

---

## 7. 角色管理模块

路径前缀: `/api/projects/{project_id}/characters`

### 7.1 获取角色列表

获取项目的所有角色。

**请求**

```http
GET /api/projects/{project_id}/characters?page=1&size=100
Authorization: Bearer <token>
```

**查询参数**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | integer | 否 | 1 | 页码 |
| size | integer | 否 | 100 | 每页数量,范围1-1000 |

**curl 示例**

```bash
curl -X GET "http://localhost:8000/api/projects/1/characters?page=1&size=100" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
{
  "items": [
    {
      "id": 1,
      "project_id": 1,
      "display_name": "李白",
      "description": "主角,诗人",
      "portraits": [
        {
          "src": "https://example.com/portrait1.jpg",
          "alt": "正面照"
        }
      ],
      "voice_preset": "zh_male_libai_voice",
      "voice_speed": 1.0,
      "voice_script": "床前明月光,疑是地上霜",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

---

### 7.2 获取角色详情

获取单个角色的详细信息。

**请求**

```http
GET /api/projects/{project_id}/characters/{character_id}
Authorization: Bearer <token>
```

**curl 示例**

```bash
curl -X GET http://localhost:8000/api/projects/1/characters/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (200)

```json
{
  "id": 1,
  "project_id": 1,
  "display_name": "李白",
  "description": "主角,诗人",
  "portraits": [
    {
      "src": "https://example.com/portrait1.jpg",
      "alt": "正面照"
    }
  ],
  "voice_preset": "zh_male_libai_voice",
  "voice_speed": 1.0,
  "voice_script": "床前明月光,疑是地上霜",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### 7.3 创建角色

为项目创建新角色。

**请求**

```http
POST /api/projects/{project_id}/characters
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "project_id": 1,
  "display_name": "李白",
  "description": "主角,诗人",
  "prompt": "古代文人,身穿白色长袍,手持折扇,气质儒雅,面容清秀,长发飘逸",
  "portraits": [
    {
      "src": "https://example.com/portrait_front.jpg",
      "alt": "正面"
    },
    {
      "src": "https://example.com/portrait_side.jpg",
      "alt": "侧面"
    },
    {
      "src": "https://example.com/portrait_45.jpg",
      "alt": "45度侧面"
    }
  ],
  "voice_preset": "zh_male_libai_voice",
  "voice_speed": 1.0,
  "voice_script": "床前明月光,疑是地上霜"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| project_id | integer | 是 | 项目ID,必须与URL中的project_id一致 |
| display_name | string | 是 | 角色显示名称,1-255字符 |
| description | string | 否 | 角色设定描述 |
| prompt | string | 否 | 角色生成提示词,用于AI生成角色立绘,描述角色外观、服饰、气质等特征 |
| portraits | array | 否 | 角色立绘列表,建议提供3张:正面、侧面、45度侧面,默认空数组 |
| voice_preset | string | 否 | 音色名称,最多255字符 |
| voice_speed | float | 否 | 语速,范围0.5-2.0,默认1.0 |
| voice_script | string | 否 | 试读文本 |

**PortraitItem 结构**

每个角色建议提供3张立绘图片,分别对应不同角度:

```json
{
  "src": "string (图片URL)",
  "alt": "string (图片描述: '正面' | '侧面' | '45度侧面')"
}
```

**立绘说明:**
- **正面**: 角色正面视角的立绘图片
- **侧面**: 角色侧面90度视角的立绘图片
- **45度侧面**: 角色45度角视角的立绘图片
- 3张立绘用于不同场景下的角色展示和动画制作

**curl 示例**

```bash
curl -X POST http://localhost:8000/api/projects/1/characters \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "display_name": "李白",
    "description": "主角,诗人",
    "prompt": "古代文人,身穿白色长袍,手持折扇,气质儒雅,面容清秀,长发飘逸",
    "portraits": [
      {
        "src": "https://example.com/portrait_front.jpg",
        "alt": "正面"
      },
      {
        "src": "https://example.com/portrait_side.jpg",
        "alt": "侧面"
      },
      {
        "src": "https://example.com/portrait_45.jpg",
        "alt": "45度侧面"
      }
    ],
    "voice_preset": "zh_male_libai_voice",
    "voice_speed": 1.0,
    "voice_script": "床前明月光,疑是地上霜"
  }'
```

**响应** (201)

返回创建的完整角色对象。

**错误码**

- `400`: Project ID mismatch (请求体中的project_id与URL不匹配)
- `404`: 项目不存在

---

### 7.4 更新角色

更新角色信息。

**请求**

```http
PATCH /api/projects/{project_id}/characters/{character_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

所有字段都是可选的,只更新提供的字段。

```json
{
  "display_name": "李白(更新)",
  "description": "更新后的角色描述",
  "prompt": "古代文人,身穿白色长袍,手持折扇,气质儒雅,面容清秀,长发飘逸,威严庄重",
  "portraits": [
    {
      "src": "http://localhost:8000/assets/character_libai_front_v2.jpg",
      "alt": "正面"
    },
    {
      "src": "http://localhost:8000/assets/character_libai_side_v2.jpg",
      "alt": "侧面"
    },
    {
      "src": "http://localhost:8000/assets/character_libai_45_v2.jpg",
      "alt": "45度侧面"
    }
  ],
  "voice_preset": "zh_male_libai_voice_v2",
  "voice_speed": 1.2,
  "voice_script": "举杯邀明月,对影成三人"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| display_name | string | 否 | 角色显示名称,1-255字符 |
| description | string | 否 | 角色设定描述 |
| prompt | string | 否 | 角色生成提示词,用于AI生成角色立绘 |
| portraits | array | 否 | 角色立绘列表 |
| voice_preset | string | 否 | 音色名称,最多255字符 |
| voice_speed | float | 否 | 语速,范围0.5-2.0 |
| voice_script | string | 否 | 试读文本 |

**curl 示例**

```bash
curl -X PATCH http://localhost:8000/api/projects/1/characters/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "李白(更新)",
    "description": "更新后的角色描述",
    "prompt": "古代文人,身穿白色长袍,手持折扇,气质儒雅,面容清秀,长发飘逸,威严庄重",
    "portraits": [
      {
        "src": "http://localhost:8000/assets/character_libai_front_v2.jpg",
        "alt": "正面"
      },
      {
        "src": "http://localhost:8000/assets/character_libai_side_v2.jpg",
        "alt": "侧面"
      },
      {
        "src": "http://localhost:8000/assets/character_libai_45_v2.jpg",
        "alt": "45度侧面"
      }
    ],
    "voice_preset": "zh_male_libai_voice_v2",
    "voice_speed": 1.2,
    "voice_script": "举杯邀明月,对影成三人"
  }'
```

**响应** (200)

返回更新后的完整角色对象。

---

### 7.5 删除角色

删除指定角色。

**请求**

```http
DELETE /api/projects/{project_id}/characters/{character_id}
Authorization: Bearer <token>
```

**curl 示例**

```bash
curl -X DELETE http://localhost:8000/api/projects/1/characters/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (204)

无内容

**错误码**

- `404`: 角色不存在

---

### 7.6 将角色立绘导入素材库

导入角色配置中的立绘,并在素材库中生成对应的素材记录。

**请求**

```http
POST /api/projects/{project_id}/characters/{character_id}/import-portraits
Authorization: Bearer <token>
```

**curl 示例**

```bash
curl -X POST http://localhost:8000/api/projects/1/characters/1/import-portraits \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应** (201)

```json
[
  {
    "id": 12,
    "name": "角色立绘-正面",
    "asset_type": "image",
    "asset_sub_type": "character_portrait",
    "object_key": "org1/characters/portrait-front.png",
    "url": "https://oss.example.com/org1/characters/portrait-front.png",
    "size": 102400,
    "metadata": {
      "character_id": 8,
      "index": 1
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**错误码**

- `400`: 角色立绘数量不足 3 张
- `404`: 项目或角色不存在

---

## 8. 素材管理模块

路径前缀: `/api/assets`

### 8.1 获取素材列表

获取组织的所有素材。

**请求**

```http
GET /api/assets?asset_type=IMAGE&search=角色&page=1&size=20
Authorization: Bearer <token>
```

**curl 示例**

```bash
# 获取所有素材
curl -X GET "http://localhost:8000/api/assets" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 带过滤条件的请求
curl -X GET "http://localhost:8000/api/assets?asset_type=IMAGE&search=角色&page=1&size=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**查询参数**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| asset_type | string | 否 | - | 素材类型过滤 |
| search | string | 否 | - | 搜索关键词,模糊匹配素材名称 |
| page | integer | 否 | 1 | 页码 |
| size | integer | 否 | 20 | 每页数量,范围1-100 |

**素材类型枚举 (AssetType)**

- `IMAGE`: 图片
- `AUDIO`: 音频
- `VIDEO`: 视频

**响应** (200)

```json
[
  {
    "id": 1,
    "organization_id": 1,
    "name": "角色立绘_李白",
    "description": "李白角色正面立绘",
    "asset_type": "IMAGE",
    "sub_type": "character_ip",
    "creation_method": "GENERATED",
    "tags": ["角色", "李白"],
    "file_url": "https://example.com/asset1.jpg",
    "object_key": "1/abc123.jpg",
    "uploaded_by_id": 3,
    "uploaded_by": {
      "id": 3,
      "username": "admin_user",
      "display_name": "项目管理员"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**素材子类型枚举 (AssetSubType)**

- `character_ip`: 角色IP
- `scene`: 场景
- `bgm`: 背景音乐
- `voice_clone`: 语音克隆
- `video_effect`: 视频特效
- `project_config`: 项目配置

**创建方式枚举 (CreationMethod)**

- `UPLOAD`: 上传
- `GENERATED`: AI生成

---

### 8.2 创建素材

创建新素材记录。

**请求**

```http
POST /api/assets
Authorization: Bearer <token>
Content-Type: application/json
```

**curl 示例**

```bash
curl -X POST "http://localhost:8000/api/assets" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新素材",
    "description": "素材描述",
    "asset_type": "IMAGE",
    "sub_type": "scene",
    "creation_method": "UPLOAD",
    "tags": ["场景", "城市"],
    "file_url": "https://example.com/asset.jpg",
    "object_key": "1/upload123.jpg"
  }'
```

**请求体**

```json
{
  "name": "新素材",
  "description": "素材描述",
  "asset_type": "IMAGE",
  "sub_type": "scene",
  "creation_method": "UPLOAD",
  "tags": ["场景", "城市"],
  "file_url": "https://example.com/asset.jpg",
  "object_key": "1/upload123.jpg"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 素材名称 |
| description | string | 否 | 素材描述 |
| asset_type | string | 是 | 素材类型 |
| sub_type | string | 是 | 素材子类型 |
| creation_method | string | 是 | 创建方式 |
| tags | array | 否 | 标签列表 |
| file_url | string | 否 | 文件访问URL |
| object_key | string | 否 | OSS对象键 |

**响应** (201)

返回创建的完整素材对象。

---

### 8.3 更新素材

更新素材信息。

**请求**

```http
PATCH /api/assets/{asset_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**curl 示例**

```bash
curl -X PATCH "http://localhost:8000/api/assets/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "更新后的素材名称",
    "description": "更新后的描述",
    "tags": ["新标签1", "新标签2"]
  }'
```

**请求体**

```json
{
  "name": "更新后的素材名称",
  "description": "更新后的描述",
  "tags": ["新标签1", "新标签2"]
}
```

**响应** (200)

返回更新后的完整素材对象。

---

### 8.4 删除素材

删除素材记录及OSS上的文件。

**请求**

```http
DELETE /api/assets/{asset_id}
Authorization: Bearer <token>
```

**curl 示例**

```bash
curl -X DELETE "http://localhost:8000/api/assets/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**响应** (204)

无内容

**说明**

- 删除素材时会同时删除OSS上对应的文件
- 如果OSS未配置或删除失败,只记录警告日志,不影响数据库记录删除

---

## 9. 任务管理模块

路径前缀: `/api/tasks`

### 9.1 获取任务列表

获取组织的任务列表。

**请求**

```http
GET /api/tasks?status=running&limit=50
Authorization: Bearer <token>
```

**查询参数**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| status | string | 否 | - | 任务状态过滤 |
| limit | integer | 否 | 50 | 限制数量,范围1-200 |

**任务状态枚举 (TaskStatus)**

- `queued`: 排队中
- `running`: 运行中
- `completed`: 已完成
- `failed`: 失败

**响应** (200)

```json
[
  {
    "id": 1,
    "task_type": "text_to_image",
    "status": "completed",
    "payload": {
      "prompt": "一个美丽的风景",
      "size": "2K"
    },
    "progress": 100,
    "result": {
      "image_url": "https://example.com/generated.jpg",
      "asset_id": 123
    },
    "error_message": null,
    "retry_token": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 9.2 获取任务详情

获取单个任务的详细信息。

**请求**

```http
GET /api/tasks/{task_id}
Authorization: Bearer <token>
```

**响应** (200)

返回完整的任务对象(格式同上)。

---

### 9.3 创建自定义任务

创建自定义任务。

**请求**

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "task_type": "custom_task",
  "payload": {
    "custom_field": "value"
  }
}
```

**响应** (201)

返回创建的任务对象。

---

### 9.4 重试任务

重置任务状态并重新执行。

**请求**

```http
POST /api/tasks/{task_id}/retry
Authorization: Bearer <token>
```

**响应** (200)

返回重置后的任务对象。

---

### 9.5 创建文生图任务

创建文本生成图片任务。

**请求**

```http
POST /api/tasks/text-to-image
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "prompt": "一个美丽的古代城市,夕阳西下,水墨画风格",
  "size": "2K",
  "asset_name": "古城夕阳",
  "asset_description": "水墨风格的古城夕阳场景",
  "sub_type": "scene",
  "tags": ["场景", "古城", "水墨"]
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|------|------|
| prompt | string | 是 | - | 图片生成提示词,至少1个字符 |
| size | string | 否 | "2K" | 生成尺寸,如: 1K/2K/4K 或 2560x1440 |
| asset_name | string | 否 | "AI生成图片" | 素材名称 |
| asset_description | string | 否 | null | 素材描述 |
| sub_type | string | 否 | "scene" | 素材子类型 |
| tags | array | 否 | [] | 标签列表 |

**功能说明**

该接口会:
1. 创建任务记录并保存到数据库
2. 异步调用Seedream API生成图片
3. 下载生成的图片并上传到OSS
4. 在素材管理中心创建素材记录
5. 更新任务状态和结果

可以通过 `GET /api/tasks/{task_id}` 查询任务进度和状态。

**响应** (201)

```json
{
  "id": 1,
  "task_type": "text_to_image",
  "status": "queued",
  "payload": {
    "prompt": "一个美丽的古代城市,夕阳西下,水墨画风格",
    "size": "2K",
    "asset_name": "古城夕阳",
    "asset_description": "水墨风格的古城夕阳场景",
    "sub_type": "scene",
    "tags": ["场景", "古城", "水墨"]
  },
  "progress": 0,
  "result": null,
  "error_message": null,
  "retry_token": null,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 9.6 批量生成角色立绘

为角色生成3张不同角度的立绘图片。

**请求**

```http
POST /api/tasks/generate-character-images
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "character_id": 1,
  "prompt": "一个英俊的古代剑客,穿着白色长袍,长发飘逸",
  "size": "2K"
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|------|------|
| character_id | integer | 是 | - | 角色ID |
| prompt | string | 是 | - | 角色描述/提示词,至少1个字符 |
| size | string | 否 | "2K" | 生成尺寸,如: 1K/2K/4K 或 2560x1440 |

**功能说明**

该接口会:
1. 创建任务记录并保存到数据库
2. 异步调用Seedream API生成3张不同角度的图片(正脸、侧脸、45度侧脸)
3. 下载生成的图片并上传到OSS
4. 更新角色的portraits字段,**不添加到素材库**
5. 更新任务状态和结果

**响应** (201)

返回创建的任务对象(格式同上)。

---

## 10. 存储管理模块

路径前缀: `/api/storage`

### 10.1 上传文件

上传文件到OSS,仅负责生成对象存储记录,不会写入数据库。

**请求**

```http
POST /api/storage/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求体**

使用 `multipart/form-data` 格式:

```
file: <binary file data>
```

**示例**

```bash
curl -X POST http://localhost:8000/api/storage/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/image.png"
```

**响应** (200)

```json
{
  "file_id": "1/abc123def456.jpg",
  "object_key": "1/abc123def456.jpg",
  "file_url": "https://your-oss-domain.com/1/abc123def456.jpg",
  "filename": "my_image.jpg",
  "size": 1024000,
  "content_type": "image/jpeg",
  "uploaded_by": 1
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| file_id | string | 文件ID(等同于object_key) |
| object_key | string | OSS对象键 |
| file_url | string | 文件访问URL |
| filename | string | 原始文件名 |
| size | integer | 文件大小(字节) |
| content_type | string | 文件MIME类型 |
| uploaded_by | integer | 上传者用户ID |

**错误码**

- `400`: OSS未配置
- `500`: 上传文件到OSS失败

---

### 10.2 获取预签名URL

生成素材访问URL。当前实现基于公共域名/Endpoint 直接返回可访问链接,`expires_at` 恒为 `null`。

**请求**

```http
GET /api/storage/presign?object_key=1/abc123.jpg
Authorization: Bearer <token>
```

**示例**

```bash
curl -G http://localhost:8000/api/storage/presign \
  -H "Authorization: Bearer <token>" \
  --data-urlencode "object_key=uploads/1/abc123.jpg"
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| object_key | string | 是 | OSS对象键 |

**权限验证**

系统会验证object_key的访问权限:
1. 检查object_key是否包含当前组织ID
2. 或检查是否为已注册的素材且属于当前组织

**响应** (200)

```json
{
  "url": "https://your-oss-domain.com/1/abc123.jpg",
  "method": "GET",
  "expires_at": null,
  "signed_headers": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| url | string | 可访问的素材URL |
| method | string | HTTP方法 |
| expires_at | string / null | 过期时间,当前返回 `null` |
| signed_headers | object | 附带请求头(当前为空对象) |

**错误码**

- `400`: OSS未配置
- `404`: 素材不存在或无权限访问
- `500`: 生成访问URL失败

---

## 11. AI生成模块

路径前缀: `/api/ai`

### 11.1 文生图

文本生成图片(同步接口)。

**请求**

```http
POST /api/ai/text-to-image
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "prompt": "一个美丽的风景,蓝天白云",
  "size": "2K",
  "sequential_image_generation": "disabled",
  "response_format": "url",
  "watermark": false,
  "download": true,
  "scene_name": "风景1",
  "save_dir": "/custom/path"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| prompt | string | 是 | 提示词 |
| size | string | 否 | 尺寸,如: 2K 或 2048x2048 |
| sequential_image_generation | string | 否 | Seedream顺序生成设置,通常为"disabled" |
| response_format | string | 否 | 响应格式,默认"url" |
| watermark | boolean | 否 | 是否添加水印 |
| download | boolean | 否 | 是否强制下载 |
| scene_name | string | 否 | 场景名称(保存时使用) |
| save_dir | string | 否 | 保存目录(可选) |

**响应** (200)

```json
{
  "url": "https://example.com/generated.jpg",
  "size": "2048x2048",
  "output_tokens": 1024,
  "saved_path": "/path/to/saved/image.jpg",
  "raw": {
    "seedream_response": "..."
  }
}
```

**错误码**

- `400`: 参数错误 / 引用图片下载失败
- `502`: AI服务错误
- `503`: AI服务配置错误

---

### 11.2 图生图

基于参考图生成新图片。

**请求**

```http
POST /api/ai/image-to-image
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "prompt": "将这个场景改为夜晚",
  "reference_image_url": "https://example.com/ref.jpg",
  "reference_image_path": null,
  "size": "2K",
  "sequential_image_generation": "disabled",
  "response_format": "url",
  "download": true,
  "scene_name": "夜景",
  "save_dir": null
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| prompt | string | 是 | 提示词 |
| reference_image_url | string | 条件 | 参考图片的公开URL |
| reference_image_path | string | 条件 | 参考图片的服务器路径 |
| size | string | 否 | 尺寸 |
| sequential_image_generation | string | 否 | 顺序生成设置 |
| response_format | string | 否 | 响应格式 |
| download | boolean | 否 | 是否下载 |
| scene_name | string | 否 | 场景名称 |
| save_dir | string | 否 | 保存目录 |

**注意**: `reference_image_url` 和 `reference_image_path` 必须至少提供一个。

**响应** (200)

格式同文生图接口。

---

### 11.3 文生视频

文本生成视频(异步接口)。

**请求**

```http
POST /api/ai/text-to-video
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "prompt": "一个人在海边散步",
  "duration": 5,
  "resolution": "720p",
  "ratio": "16:9",
  "model": null,
  "seed": null,
  "extra_directives": [],
  "wait_for_result": false,
  "poll_interval": 5,
  "timeout": 300
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| prompt | string | 是 | - | 提示词 |
| duration | integer | 否 | 5 | 视频时长(秒),范围1-60 |
| resolution | string | 否 | "720p" | 分辨率 |
| ratio | string | 否 | "16:9" | 宽高比 |
| model | string | 否 | null | 模型ID |
| seed | integer | 否 | null | 随机种子 |
| extra_directives | array | 否 | null | 额外指令 |
| wait_for_result | boolean | 否 | false | 是否等待完成 |
| poll_interval | integer | 否 | null | 轮询间隔(秒),范围1-120 |
| timeout | integer | 否 | null | 超时时间(秒),范围10-3600 |

**响应** (200)

```json
{
  "task_id": "video_task_123",
  "status": "processing",
  "model": "text-to-video-v1",
  "video_url": null,
  "resolution": "720p",
  "duration": 5,
  "ratio": "16:9",
  "frames_per_second": 24,
  "usage": {
    "credits": 100
  },
  "raw": null
}
```

---

### 11.4 图生视频

基于首尾帧生成视频。

**请求**

```http
POST /api/ai/image-to-video
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "first_frame_url": "https://example.com/first.jpg",
  "last_frame_url": "https://example.com/last.jpg",
  "prompt": "平滑过渡",
  "duration": 8,
  "ratio": "adaptive",
  "model": null,
  "seed": null,
  "extra_directives": [],
  "wait_for_result": false,
  "poll_interval": 5,
  "timeout": 300
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| first_frame_url | string | 是 | - | 首帧图片URL |
| last_frame_url | string | 否 | null | 尾帧图片URL,默认等于首帧 |
| prompt | string | 是 | - | 提示词 |
| duration | integer | 否 | 8 | 视频时长(秒),范围1-60 |
| ratio | string | 否 | "adaptive" | 宽高比 |
| model | string | 否 | null | 模型ID |
| seed | integer | 否 | null | 随机种子 |
| extra_directives | array | 否 | null | 额外指令 |
| wait_for_result | boolean | 否 | false | 是否等待完成 |
| poll_interval | integer | 否 | null | 轮询间隔(秒) |
| timeout | integer | 否 | null | 超时时间(秒) |

**响应** (200)

格式同文生视频接口。

---

## 12. AI代理模块

路径前缀: `/api/agents`

### 12.1 运行工作流

执行Coze AI工作流。

**请求**

```http
POST /api/agents/workflow/run
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "input": "生成一个科幻故事的角色设定",
  "style": "sci-fi",
  "workflow_id": "custom_workflow_123",
  "parameters": {
    "custom_param": "value"
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input | string | 是 | 用户输入 |
| style | string | 否 | 样式指令 |
| workflow_id | string | 否 | 工作流ID,默认使用配置的工作流 |
| parameters | object | 否 | 额外参数 |

**响应** (200)

```json
{
  "workflow_id": "custom_workflow_123",
  "events": [
    {
      "event": "message",
      "data": "生成的内容...",
      "id": "event_1"
    }
  ]
}
```

**错误码**

- `502`: Coze服务错误
- `503`: Coze服务配置错误

---

### 12.2 批量生成角色

使用AI批量生成角色信息。

**请求**

```http
POST /api/agents/generate-characters
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "role_info": "一个古装剧,需要3个主要角色:皇帝、皇后、将军",
  "project_id": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| role_info | string | 是 | 角色信息描述 |
| project_id | integer | 是 | 项目ID |

**curl示例**

```bash
curl -X POST http://your-domain.com/api/agents/generate-characters \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role_info": "一个古装剧,需要3个主要角色:皇帝、皇后、将军",
    "project_id": 1
  }'
```

**功能说明**

该接口会:
1. 调用Coze工作流处理角色信息
2. 解析返回的角色数据
3. 转换为前端期望的格式

**Coze返回格式**:
```json
{
  "role": "角色名称",
  "role_content": "角色设定描述",
  "voice_demo": "试读文本",
  "voice_speed": "1.1"
}
```

**前端期望格式**:
```json
{
  "name": "角色名称",
  "displayName": "角色名称",
  "description": "角色设定",
  "roleType": "主角/配角",
  "voicePreset": "音色名称",
  "voiceSpeed": 1.1,
  "voiceScript": "试读文本",
  "portraits": []
}
```

**响应** (200)

```json
{
  "success": true,
  "characters": [
    {
      "name": "皇帝",
      "displayName": "皇帝",
      "description": "威严的皇帝,统治天下",
      "roleType": "主角",
      "voicePreset": "",
      "voiceSpeed": 1.0,
      "voiceScript": "朕即天下",
      "portraits": []
    }
  ],
  "project_id": 1,
  "events_count": 3
}
```

**错误码**

- `500`: 生成角色失败
- `502`: Coze服务错误
- `503`: Coze服务配置错误

---

## 13. 通知模块

路径前缀: `/api/notifications`

### 13.1 获取通知列表

获取组织的所有通知。

**请求**

```http
GET /api/notifications
Authorization: Bearer <token>
```

**响应** (200)

```json
[
  {
    "id": 1,
    "organization_id": 1,
    "title": "任务完成",
    "message": "文生图任务已完成",
    "type": "info",
    "is_read": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 13.2 标记通知已读

将通知标记为已读。

**请求**

```http
PATCH /api/notifications/{notification_id}:read
Authorization: Bearer <token>
```

**响应** (200)

返回更新后的通知对象。

**错误码**

- `404`: 通知不存在

---

## 14. 套餐管理模块

路径前缀: `/api/plans`

### 14.1 获取套餐列表

获取所有可用套餐。

**请求**

```http
GET /api/plans
```

**响应** (200)

```json
[
  {
    "id": 1,
    "name": "基础套餐",
    "description": "适合个人创作者",
    "features": "[\"100分镜/月\", \"10GB存储\"]",
    "price": 9900,
    "duration_days": 30,
    "plan_type": "basic",
    "max_storyboards": 100,
    "storage_gb": 10,
    "is_active": 1,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 14.2 创建套餐

创建新套餐(仅管理员)。

**请求**

```http
POST /api/plans
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "name": "专业套餐",
  "description": "适合专业团队",
  "features": "[\"无限分镜\", \"100GB存储\", \"优先支持\"]",
  "price": 29900,
  "duration_days": 30,
  "plan_type": "pro",
  "max_storyboards": null,
  "storage_gb": 100,
  "is_active": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 套餐名称 |
| description | string | 否 | 套餐描述 |
| features | string | 否 | 功能列表(JSON字符串) |
| price | integer | 是 | 价格(分) |
| duration_days | integer | 是 | 有效期(天) |
| plan_type | string | 否 | 套餐类型: basic/pro/enterprise |
| max_storyboards | integer | 否 | 每月最大分镜数,null表示无限 |
| storage_gb | integer | 否 | 存储空间(GB),默认10 |
| is_active | integer | 否 | 是否启用,默认1 |

**响应** (201)

返回创建的套餐对象。

---

### 14.3 获取套餐详情

获取单个套餐信息。

**请求**

```http
GET /api/plans/{plan_id}
```

**响应** (200)

返回完整的套餐对象。

**错误码**

- `404`: 套餐不存在

---

### 14.4 更新套餐

更新套餐信息(仅管理员)。

**请求**

```http
PATCH /api/plans/{plan_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

所有字段都是可选的。

```json
{
  "name": "更新后的套餐名称",
  "price": 19900,
  "is_active": 0
}
```

**响应** (200)

返回更新后的套餐对象。

---

### 14.5 删除套餐

删除套餐(仅管理员)。

**请求**

```http
DELETE /api/plans/{plan_id}
Authorization: Bearer <token>
```

**响应** (204)

无内容

---

### 14.6 订阅套餐

为组织订阅套餐。

**请求**

```http
POST /api/plans/subscribe?plan_id=1
Authorization: Bearer <token>
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_id | integer | 是 | 套餐ID |

**响应** (201)

```json
{
  "id": 1,
  "organization_id": 1,
  "plan_id": 1,
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**错误码**

- `404`: 套餐不存在

---

## 15. 支付模块

路径前缀: `/api/payments`

### 15.1 创建微信支付订单

创建微信Native支付订单。

**请求**

```http
POST /api/payments/wechat/create
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "plan_type": "basic",
  "amount": 9900
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_type | string | 是 | 套餐类型: basic/pro/enterprise |
| amount | integer | 是 | 金额(分) |

**响应** (200)

```json
{
  "order_id": "ORDER_ABC123DEF456",
  "qrcode_url": "weixin://wxpay/bizpayurl?pr=xyz123",
  "wechat_request_summary": {
    "url": "https://api.mch.weixin.qq.com/v3/pay/transactions/native",
    "method": "POST",
    "headers": {},
    "body": {},
    "response": {},
    "code_url": "weixin://wxpay/bizpayurl?pr=xyz123"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| order_id | string | 订单ID |
| qrcode_url | string | 微信支付二维码URL |
| wechat_request_summary | object | 微信请求详情(调试用) |

**说明**

- 使用微信支付v3 API
- 支持Native支付方式(扫码支付)
- 订单号格式: `ORDER_{16位随机字符}`

---

### 15.2 查询支付状态

查询订单支付状态。

**请求**

```http
GET /api/payments/wechat/status/{order_id}
Authorization: Bearer <token>
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| order_id | string | 订单ID |

**响应** (200)

```json
{
  "order_id": "ORDER_ABC123DEF456",
  "status": "pending"
}
```

**订单状态枚举**

- `pending`: 待支付
- `paid`: 已支付
- `failed`: 支付失败
- `expired`: 已过期

**错误码**

- `403`: 无权访问此订单
- `404`: 订单不存在

---

### 15.3 微信支付回调

接收微信支付回调通知(Webhook)。

**请求**

```http
POST /api/payments/wechat/callback
Content-Type: application/json
```

**说明**

- 该接口由微信支付服务器调用
- 需要验证微信签名(当前为占位实现)
- 正式环境需完整实现签名验证逻辑

**响应** (200)

```json
{
  "code": "SUCCESS",
  "message": "OK"
}
```

---

## 16. 设置模块

路径前缀: `/api/settings/api-keys`

所有接口均需要管理员权限。

### 16.1 获取API密钥列表

获取组织的所有API密钥。

**请求**

```http
GET /api/settings/api-keys
Authorization: Bearer <token>
```

**响应** (200)

```json
[
  {
    "id": 1,
    "name": "Seedream API Key",
    "masked_value": "sk-****xyz",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**说明**

- API密钥在数据库中加密存储
- 返回时显示为脱敏格式

---

### 16.2 创建API密钥

创建新的API密钥。

**请求**

```http
POST /api/settings/api-keys
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "name": "Seedream API Key",
  "value": "sk-abc123xyz789"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 密钥名称 |
| value | string | 是 | 密钥值 |

**响应** (201)

```json
{
  "id": 1,
  "name": "Seedream API Key",
  "masked_value": "sk-****xyz",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 16.3 更新API密钥

更新API密钥。

**请求**

```http
PATCH /api/settings/api-keys/{key_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "name": "新名称",
  "value": "sk-new-value-123"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 密钥名称 |
| value | string | 否 | 密钥值 |

**响应** (200)

返回更新后的密钥对象。

---

### 16.4 删除API密钥

删除API密钥。

**请求**

```http
DELETE /api/settings/api-keys/{key_id}
Authorization: Bearer <token>
```

**响应** (204)

无内容

**错误码**

- `404`: API密钥不存在

---

## 17. 语音合成模块

路径前缀: `/api/tts`

### 17.1 获取音色列表

获取当前可用的音色选项,支持多条件筛选。

**请求**

```http
GET /api/tts/voices?scene_category=通用场景&gender=女
Authorization: Bearer <token>
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| scene_category | string | 否 | 场景分类,例如 `通用场景` |
| gender | string | 否 | 性别筛选, `女` 或 `男` |
| support_language | string | 否 | 支持语种,例如 `中文` |
| is_support_mix | integer | 否 | 是否支持 MIX 音色, `0` 或 `1` |

**响应** (200)

```json
[
  {
    "name": "zh_female_xiaoxiao",
    "voice_type": "standard",
    "locale": "中文",
    "description": "标准女声,适用于旁白",
    "scene_category": "通用场景",
    "support_language": "中文",
    "gender": "女",
    "is_support_mix": true,
    "core_feature": "情感丰富",
    "remarks": null
  }
]
```

**curl 示例**

```bash
# 获取所有音色
curl -X GET "http://localhost:8000/api/tts/voices" \
  -H "Authorization: Bearer <token>"

# 筛选通用场景的女声
curl -X GET "http://localhost:8000/api/tts/voices?scene_category=通用场景&gender=女" \
  -H "Authorization: Bearer <token>"

# 筛选支持中文且支持MIX的音色
curl -X GET "http://localhost:8000/api/tts/voices?support_language=中文&is_support_mix=1" \
  -H "Authorization: Bearer <token>"
```

---

### 17.2 文本转语音

使用火山语音服务将文本转换为语音。

**请求**

```http
POST /api/tts/synthesize
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**

```json
{
  "text": "欢迎使用 AI 漫剧平台",
  "voice_type": "zh_female_xiaoxiao",
  "emotion": "happy",
  "speed": 1.0,
  "volume": 1.0,
  "sample_rate": 24000,
  "audio_format": "mp3",
  "wait_for_result": true,
  "download_audio": true
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| text | string | 是 | 待合成的文本内容 |
| voice_type | string | 否 | 指定音色,默认使用系统配置 |
| emotion | string | 否 | 情感效果,如 `happy`、`sad` |
| speed | float | 否 | 语速,默认 1.0,范围 0.5-2.0 |
| volume | float | 否 | 音量,默认 1.0,范围 0.0-2.0 |
| sample_rate | integer | 否 | 采样率,默认 24000 |
| audio_format | string | 否 | 输出格式,如 `mp3` / `wav` |
| wait_for_result | boolean | 否 | 是否等待任务完成后返回结果,默认 true |
| poll_interval | float | 否 | 轮询间隔秒数,默认使用系统配置 |
| timeout | float | 否 | 超时时间秒数,默认使用系统配置 |
| download_audio | boolean | 否 | 是否返回 Base64 音频内容,默认 false |
| extra_parameters | object | 否 | 透传给 TTS 服务的额外参数 |

**响应** (200)

```json
{
  "task_id": "tts-20240101-abcdef",
  "status": "succeeded",
  "audio_url": "https://oss.example.com/org1/tts/tts-20240101-abcdef.mp3",
  "audio_content_base64": "UklGRjIAAABXQVZFZm10IBAAAAABAAEA..."
}
```

**错误码**

- `502`: 合成任务失败或服务异常
- `504`: 合成超时

**curl 示例**

```bash
# 基本文本转语音（使用默认音色）
curl -X POST "http://localhost:8000/api/tts/synthesize" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "欢迎使用AI漫剧平台"
  }'

# 指定音色和情感
curl -X POST "http://localhost:8000/api/tts/synthesize" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "今天天气真好",
    "voice_type": "zh_female_vv_uranus_bigtts",
    "emotion": "happy",
    "speed": 1.2,
    "volume": 1.0
  }'

# 完整参数示例（包含Base64音频内容）
curl -X POST "http://localhost:8000/api/tts/synthesize" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "这是一段测试语音",
    "voice_type": "zh_male_dayi_saturn_bigtts",
    "emotion": "neutral",
    "speed": 1.0,
    "volume": 1.0,
    "sample_rate": 24000,
    "audio_format": "mp3",
    "wait_for_result": true,
    "download_audio": true
  }'
```

---

## 数据模型

### UserRead

```json
{
  "id": 1,
  "username": "string",
  "display_name": "string",
  "email": "string",
  "phone": "string",
  "role": "string",
  "organization_id": 1,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### ProjectRead

```json
{
  "id": 1,
  "name": "string",
  "project_type": "static_comic|dynamic_comic",
  "status": "draft|progress|completed|failed",
  "description": "string|null",
  "cover_image": "string|null",
  "video_scale": "string|null",
  "video_resolution": "string|null",
  "organization_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "chapters": []
}
```

### ChapterRead

```json
{
  "id": 1,
  "name": "string",
  "script_content": "string",
  "order_index": 0,
  "project_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "storyboards": []
}
```

### CharacterRead

```json
{
  "id": 1,
  "project_id": 1,
  "display_name": "string",
  "description": "string",
  "portraits": [
    {
      "src": "string",
      "alt": "string"
    }
  ],
  "voice_preset": "string",
  "voice_speed": 1.0,
  "voice_script": "string",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### AssetRead

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "asset_type": "IMAGE|AUDIO|VIDEO",
  "sub_type": "character_ip|scene|bgm|voice_clone|video_effect|project_config",
  "creation_method": "UPLOAD|GENERATED",
  "tags": [],
  "file_url": "string",
  "object_key": "string",
  "uploaded_by_id": 3,
  "uploaded_by": {
    "id": 3,
    "username": "admin_user",
    "display_name": "项目管理员"
  },
  "organization_id": 1,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### TaskRead

```json
{
  "id": 1,
  "task_type": "string",
  "status": "queued|running|completed|failed",
  "payload": {},
  "progress": 0,
  "result": {},
  "error_message": "string",
  "retry_token": "string",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## 错误处理

### 错误响应格式

所有接口在发生错误时返回统一格式:

```json
{
  "detail": "错误描述信息"
}
```

### HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 204 | 删除成功(无内容) |
| 400 | 请求参数错误 |
| 401 | 未认证或token无效 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 502 | 外部服务错误(如AI服务) |
| 503 | 服务配置错误(如OSS/AI服务未配置) |

### 常见错误示例

**认证错误 (401)**

```json
{
  "detail": "Could not validate credentials"
}
```

**权限错误 (403)**

```json
{
  "detail": "需要管理员权限"
}
```

**资源不存在 (404)**

```json
{
  "detail": "Project not found"
}
```

**参数错误 (400)**

```json
{
  "detail": "邮箱已被注册"
}
```

**服务配置错误 (503)**

```json
{
  "detail": "OSS未配置,请联系管理员"
}
```

---

## 附录

### 项目类型 (ProjectType)

- `static_comic`: 静态漫
- `dynamic_comic`: 动态漫

### 项目状态 (ProjectStatus)

- `draft`: 草稿
- `progress`: 进行中
- `completed`: 已完成
- `failed`: 失败

### 素材类型 (AssetType)

- `IMAGE`: 图片
- `AUDIO`: 音频
- `VIDEO`: 视频

### 素材子类型 (AssetSubType)

- `character_ip`: 角色IP
- `scene`: 场景
- `bgm`: 背景音乐
- `voice_clone`: 语音克隆
- `video_effect`: 视频特效
- `project_config`: 项目配置

### 创建方式 (CreationMethod)

- `UPLOAD`: 上传
- `GENERATED`: AI生成

### 任务状态 (TaskStatus)

- `queued`: 排队中
- `running`: 运行中
- `completed`: 已完成
- `failed`: 失败

---

**文档版本**: 1.0
**最后更新**: 2024-01-01
**API版本**: v1
