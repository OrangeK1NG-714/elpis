# Docker 部署完整指南

## 🐳 使用 Docker 的三种部署方式

---

## 📋 方案对比

| 方案 | 需要服务器 | 成本 | 难度 | 推荐度 |
|------|-----------|------|------|--------|
| **Railway + Docker** | ❌ | 🆓 | ⭐ | ⭐⭐⭐⭐⭐ |
| **Render + Docker** | ❌ | 🆓 | ⭐ | ⭐⭐⭐⭐ |
| **Fly.io + Docker** | ❌ | 🆓 | ⭐⭐ | ⭐⭐⭐⭐ |
| **自购服务器 + Docker** | ✅ | 💰 | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 🚀 方案 1: Railway + Docker（最推荐）

### 为什么选择 Railway？
- ✅ 自动识别 Dockerfile
- ✅ 零配置部署
- ✅ 免费 MySQL 数据库
- ✅ 自动 HTTPS
- ✅ 每月 $5 免费额度

### 部署步骤

#### 步骤 1: 准备项目

你的项目已经有 `Dockerfile`，可以直接使用！

```dockerfile
# publish/Dockerfile 已经准备好
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app .
EXPOSE 7001
CMD ["node", "index.js"]
```

#### 步骤 2: 部署到 Railway

**方式 A: 通过 Web 界面（推荐新手）**

```bash
1. 访问 https://railway.app
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 选择你的 elpis-tencent 仓库
6. Railway 自动检测 Dockerfile 并开始构建 🐳
7. 等待构建完成（约 2-5 分钟）
```

**方式 B: 使用 Railway CLI**

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 部署（Railway 会自动使用 Dockerfile）
railway up

# 查看日志
railway logs
```

#### 步骤 3: 添加 MySQL 数据库

```bash
# 在 Railway 项目页面
1. 点击 "New"
2. 选择 "Database"
3. 选择 "Add MySQL"
4. Railway 自动创建 MySQL 容器
5. 自动注入环境变量：
   - MYSQLHOST
   - MYSQLPORT
   - MYSQLUSER
   - MYSQLPASSWORD
   - MYSQLDATABASE
```

#### 步骤 4: 配置环境变量

在 Railway 项目设置中添加：

```bash
NODE_ENV=production
_ENV=prod
PORT=7001

# 数据库配置（使用 Railway 提供的变量）
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
DB_DATABASE=${{MYSQLDATABASE}}

JWT_SECRET=your_jwt_secret_key
```

#### 步骤 5: 获取访问地址

```bash
1. 在 Railway 项目中点击你的服务
2. 点击 "Settings" → "Domains"
3. 点击 "Generate Domain"
4. 获得免费域名：https://elpis-tencent.up.railway.app
```

#### 步骤 6: 自动部署

```bash
# 每次推送代码到 GitHub，Railway 自动：
1. 检测代码变更
2. 使用 Dockerfile 构建新镜像
3. 运行新容器
4. 零停机部署

# 你只需要：
git add .
git commit -m "feat: 更新功能"
git push origin main
```

---

## 🎨 方案 2: Render + Docker

### 特点
- ✅ 完全免费
- ✅ 支持 Docker
- ⚠️ 免费版会休眠（15分钟无访问）

### 部署步骤

#### 1. 创建 render.yaml

已经在 `publish/render.yaml` 中准备好：

```yaml
services:
  - type: web
    name: elpis-tencent
    env: docker
    dockerfilePath: ./Dockerfile
    healthCheckPath: /health
```

#### 2. 部署

```bash
1. 访问 https://render.com
2. 用 GitHub 账号登录
3. 点击 "New +" → "Web Service"
4. 选择你的 GitHub 仓库
5. Render 自动检测 render.yaml 和 Dockerfile
6. 点击 "Create Web Service"
```

#### 3. 添加数据库

```bash
1. 点击 "New +" → "PostgreSQL" 或使用外部 MySQL
2. 在 Web Service 环境变量中配置数据库连接
```

---

## ✈️ 方案 3: Fly.io + Docker

### 特点
- ✅ 免费额度充足
- ✅ 全球部署
- ✅ 完整 Docker 支持

### 部署步骤

#### 1. 安装 Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# macOS/Linux
curl -L https://fly.io/install.sh | sh
```

#### 2. 登录并初始化

```bash
# 登录
fly auth login

# 初始化（自动检测 Dockerfile）
fly launch

# Fly 会询问：
? Choose an app name: elpis-tencent
? Choose a region: Hong Kong (hkg)
? Would you like to set up a PostgreSQL database? Yes
? Would you like to deploy now? Yes
```

#### 3. 部署和管理

```bash
# 部署
fly deploy

# 查看状态
fly status

# 查看日志
fly logs

# 打开应用
fly open

# 扩展资源
fly scale vm shared-cpu-1x

# 查看资源使用
fly dashboard
```

---

## 🔄 方案 4: GitHub Actions + Docker + Railway

### 完整自动化 CI/CD

已经在 `publish/.github/workflows/docker-railway.yml` 中准备好：

```yaml
name: Docker CI/CD to Railway

on:
  push:
    branches: [main, master]

jobs:
  test:
    # 运行测试
  
  build:
    # 构建 Docker 镜像并推送到 Docker Hub
  
  deploy:
    # 自动部署到 Railway
```

#### 配置步骤

1. **获取 Railway Token**

```bash
# 使用 Railway CLI
railway login
railway whoami

# 或在 Railway 网站
Settings → Tokens → Create Token
```

2. **配置 GitHub Secrets**

```bash
# 在 GitHub 仓库设置中添加：
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password
RAILWAY_TOKEN=your_railway_token
```

3. **推送代码触发部署**

```bash
git add .
git commit -m "feat: 配置自动部署"
git push origin main

# GitHub Actions 自动执行：
# ✅ 代码检查
# ✅ 运行测试
# ✅ 构建 Docker 镜像
# ✅ 推送到 Docker Hub
# ✅ 部署到 Railway
```

---

## 💰 成本对比

### Railway
- **免费额度**: $5/月
- **超出后**: 按使用量计费
- **适合**: 个人项目、作品集
- **数据库**: 包含免费 MySQL

### Render
- **免费额度**: 完全免费
- **限制**: 15分钟无访问会休眠
- **适合**: 演示项目
- **数据库**: PostgreSQL 免费

### Fly.io
- **免费额度**: 3个共享 CPU VM
- **超出后**: 按使用量计费
- **适合**: 全球部署
- **数据库**: 需要额外配置

### 自购服务器
- **成本**: ¥50-200/月
- **优势**: 完全控制
- **劣势**: 需要维护
- **适合**: 企业应用

---

## 🎯 推荐方案

### 对于作品集项目（你的情况）

**推荐：Railway + Docker**

```bash
# 3 步完成部署
1. 推送代码到 GitHub
2. 在 Railway 连接仓库
3. Railway 自动使用 Dockerfile 构建和部署

# 完全免费，零维护！
```

### 对于企业项目

**推荐：自购服务器 + Docker Compose**

使用 `publish/docker-compose.yml` 和 `publish/deploy.sh`

---

## 📊 Docker 部署流程图

### Railway 自动部署流程

```
推送代码到 GitHub
    ↓
Railway 检测到变更
    ↓
读取 Dockerfile
    ↓
构建 Docker 镜像
    ↓
运行容器
    ↓
自动配置域名和 HTTPS
    ↓
完成！✅
```

### GitHub Actions + Railway 流程

```
推送代码到 GitHub
    ↓
GitHub Actions 触发
    ↓
运行测试
    ↓
构建 Docker 镜像
    ↓
推送到 Docker Hub
    ↓
通知 Railway 部署
    ↓
Railway 拉取镜像并运行
    ↓
完成！✅
```

---

## 🛠️ 本地 Docker 测试

### 使用 Docker Compose

```bash
# 复制环境变量
cp .env.example .env

# 启动服务（包含 MySQL）
docker-compose up -d

# 查看日志
docker-compose logs -f elpis-app

# 查看容器状态
docker-compose ps

# 停止服务
docker-compose down
```

### 单独使用 Docker

```bash
# 构建镜像
docker build -t elpis-tencent .

# 运行容器
docker run -d \
  -p 7001:7001 \
  -e NODE_ENV=production \
  -e DB_HOST=your_db_host \
  --name elpis-app \
  elpis-tencent

# 查看日志
docker logs -f elpis-app

# 停止容器
docker stop elpis-app
```

---

## 🔍 常见问题

### Q1: Railway 会自动使用我的 Dockerfile 吗？

**A:** 是的！Railway 会自动检测项目根目录的 Dockerfile 并使用它构建镜像。

### Q2: 我需要配置 docker-compose.yml 吗？

**A:** 不需要。Railway 会单独运行你的应用容器和数据库容器，并自动连接它们。

### Q3: 如何查看 Docker 容器日志？

**A:** 
- Railway: 在项目页面点击 "View Logs"
- Render: 在服务页面查看 "Logs"
- Fly.io: 运行 `fly logs`

### Q4: 免费额度够用吗？

**A:** 对于作品集项目完全够用：
- Railway: $5/月 ≈ 500小时运行时间
- Render: 完全免费但会休眠
- Fly.io: 3个 VM 免费

### Q5: 如何更新部署？

**A:** 推送代码到 GitHub，平台会自动重新构建和部署。

---

## 📚 相关文件

- `Dockerfile` - 生产环境镜像
- `Dockerfile.dev` - 开发环境镜像
- `docker-compose.yml` - 本地开发编排
- `railway.json` - Railway 配置
- `render.yaml` - Render 配置
- `.github/workflows/docker-railway.yml` - 自动化部署

---

## 🎉 总结

**使用 Docker 不一定需要购买服务器！**

推荐方案：
1. **Railway + Docker**（最简单，免费）
2. **Render + Docker**（完全免费）
3. **Fly.io + Docker**（全球部署）

你的 Dockerfile 已经准备好，选择一个平台，3 步完成部署！🚀
