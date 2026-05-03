# Elpis CI/CD 配置包

本目录包含完整的 CI/CD 配置文件，可以直接应用到项目中。

## 📁 目录结构

```
publish/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml          # 主 CI/CD 流水线
│       └── pr-check.yml       # PR 自动检查
├── Dockerfile                 # 生产环境镜像
├── Dockerfile.dev            # 开发环境镜像
├── docker-compose.yml        # 生产环境编排
├── docker-compose.dev.yml    # 开发环境编排
├── .dockerignore             # Docker 忽略文件
├── .env.example              # 环境变量模板
├── deploy.sh                 # 自动化部署脚本
├── DEPLOYMENT.md             # 详细部署文档
├── CICD-QUICKSTART.md        # 快速开始指南
├── CICD-SUMMARY.md           # 配置总结
└── README.md                 # 本文件
```

## 🚀 快速使用

### 1. 复制文件到项目根目录

```bash
# 复制所有文件到项目根目录
cp -r publish/.github ../
cp publish/Dockerfile ../
cp publish/Dockerfile.dev ../
cp publish/docker-compose.yml ../
cp publish/docker-compose.dev.yml ../
cp publish/.dockerignore ../
cp publish/.env.example ../
cp publish/deploy.sh ../

# 或者使用 PowerShell（Windows）
Copy-Item -Path "publish\.github" -Destination ".." -Recurse -Force
Copy-Item -Path "publish\Dockerfile" -Destination ".." -Force
Copy-Item -Path "publish\Dockerfile.dev" -Destination ".." -Force
Copy-Item -Path "publish\docker-compose.yml" -Destination ".." -Force
Copy-Item -Path "publish\docker-compose.dev.yml" -Destination ".." -Force
Copy-Item -Path "publish\.dockerignore" -Destination ".." -Force
Copy-Item -Path "publish\.env.example" -Destination ".." -Force
Copy-Item -Path "publish\deploy.sh" -Destination ".." -Force
```

### 2. 配置 package.json

在项目的 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "build:prod": "node app/webpack/prod.js",
    "build:dev": "node app/webpack/dev.js",
    "start": "node index.js",
    "dev": "nodemon index.js",
    "docker:build": "docker build -t elpis-tencent .",
    "docker:run": "docker-compose up -d",
    "docker:stop": "docker-compose down",
    "docker:logs": "docker-compose logs -f elpis-app"
  }
}
```

### 3. 配置 GitHub Secrets

在 GitHub 仓库设置中添加：

```
Settings → Secrets and variables → Actions → New repository secret
```

必需的 Secrets：
- `DOCKER_USERNAME` - Docker Hub 用户名
- `DOCKER_PASSWORD` - Docker Hub 密码/Token
- `SERVER_HOST` - 服务器 IP
- `SERVER_USER` - SSH 用户名
- `SERVER_SSH_KEY` - SSH 私钥

### 4. 本地测试

```bash
# 复制环境变量
cp .env.example .env

# 启动服务
npm run docker:run

# 查看日志
npm run docker:logs
```

## 📚 文档说明

### CICD-QUICKSTART.md
快速开始指南，包含：
- 5 分钟快速配置
- GitHub Secrets 配置步骤
- 服务器初始化命令
- 常用操作命令

### DEPLOYMENT.md
完整部署文档（380 行），包含：
- 详细的部署流程
- 服务器环境配置
- Nginx 反向代理配置
- 故障排查指南
- 监控和维护建议

### CICD-SUMMARY.md
配置总结，包含：
- 所有文件清单
- CI/CD 流程说明
- 配置检查清单
- 常见问题解答

## 🔄 CI/CD 流程

```
推送代码到 main/master
    ↓
GitHub Actions 自动触发
    ↓
代码检查 (ESLint)
    ↓
单元测试
    ↓
构建 Docker 镜像
    ↓
推送到 Docker Hub
    ↓
SSH 连接服务器
    ↓
自动部署
    ↓
健康检查
    ↓
完成 ✅
```

## 🎯 功能特性

### GitHub Actions
- ✅ 自动代码检查（ESLint）
- ✅ 自动单元测试
- ✅ PR 自动检查和评论
- ✅ 自动构建 Docker 镜像
- ✅ 自动部署到服务器
- ✅ 健康检查和通知

### Docker 配置
- ✅ 多阶段构建优化镜像大小
- ✅ 非 root 用户运行
- ✅ 健康检查配置
- ✅ 开发和生产环境分离
- ✅ MySQL 数据库集成

### 部署脚本
- ✅ 自动备份数据库
- ✅ 一键部署
- ✅ 健康检查
- ✅ 自动回滚功能
- ✅ 清理旧镜像

## 🛠️ 自定义配置

### 修改端口

编辑 `docker-compose.yml`：

```yaml
services:
  elpis-app:
    ports:
      - "8001:7001"  # 改为 8001 端口
```

### 修改数据库配置

编辑 `.env` 文件：

```bash
DB_HOST=mysql
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

### 修改 Docker 镜像名称

编辑 `.github/workflows/ci-cd.yml`：

```yaml
env:
  DOCKER_IMAGE_NAME: your-image-name
```

## 📞 支持

如有问题，请查看：
1. CICD-QUICKSTART.md - 快速开始
2. DEPLOYMENT.md - 详细文档
3. CICD-SUMMARY.md - 配置总结

或提交 Issue 到项目仓库。

## 📄 许可

ISC License
