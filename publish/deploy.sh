#!/bin/bash

# Elpis 快速部署脚本
# 用途：在服务器上快速部署或更新应用

set -e

echo "🚀 开始部署 Elpis 应用..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="/opt/elpis-tencent"
BACKUP_DIR="/opt/elpis-backups"

# 检查是否为 root 或有 sudo 权限
if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then 
    echo -e "${RED}❌ 需要 root 权限或 sudo 权限${NC}"
    exit 1
fi

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
backup_database() {
    echo -e "${YELLOW}📦 备份数据库...${NC}"
    BACKUP_FILE="$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if docker-compose exec -T mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} elpis_db > $BACKUP_FILE 2>/dev/null; then
        echo -e "${GREEN}✅ 数据库备份成功: $BACKUP_FILE${NC}"
    else
        echo -e "${YELLOW}⚠️  数据库备份失败或数据库不存在${NC}"
    fi
}

# 拉取最新代码
update_code() {
    echo -e "${YELLOW}📥 拉取最新代码...${NC}"
    cd $PROJECT_DIR
    
    # 保存本地修改
    git stash
    
    # 拉取最新代码
    git pull origin main
    
    echo -e "${GREEN}✅ 代码更新完成${NC}"
}

# 拉取最新镜像
pull_images() {
    echo -e "${YELLOW}🐳 拉取最新 Docker 镜像...${NC}"
    cd $PROJECT_DIR
    docker-compose pull
    echo -e "${GREEN}✅ 镜像拉取完成${NC}"
}

# 停止服务
stop_services() {
    echo -e "${YELLOW}🛑 停止现有服务...${NC}"
    cd $PROJECT_DIR
    docker-compose down
    echo -e "${GREEN}✅ 服务已停止${NC}"
}

# 启动服务
start_services() {
    echo -e "${YELLOW}🚀 启动服务...${NC}"
    cd $PROJECT_DIR
    docker-compose up -d
    echo -e "${GREEN}✅ 服务已启动${NC}"
}

# 清理旧镜像
cleanup() {
    echo -e "${YELLOW}🧹 清理未使用的镜像...${NC}"
    docker image prune -f
    echo -e "${GREEN}✅ 清理完成${NC}"
}

# 健康检查
health_check() {
    echo -e "${YELLOW}🏥 执行健康检查...${NC}"
    sleep 10
    
    MAX_RETRIES=30
    RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if curl -f http://localhost:7001/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ 应用健康检查通过${NC}"
            return 0
        fi
        
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo -e "${YELLOW}⏳ 等待应用启动... ($RETRY_COUNT/$MAX_RETRIES)${NC}"
        sleep 2
    done
    
    echo -e "${RED}❌ 健康检查失败${NC}"
    return 1
}

# 显示服务状态
show_status() {
    echo -e "${YELLOW}📊 服务状态:${NC}"
    cd $PROJECT_DIR
    docker-compose ps
    
    echo -e "\n${YELLOW}📝 最近日志:${NC}"
    docker-compose logs --tail=20 elpis-app
}

# 回滚
rollback() {
    echo -e "${RED}🔄 开始回滚...${NC}"
    cd $PROJECT_DIR
    
    # 回滚代码
    git reset --hard HEAD~1
    
    # 重启服务
    docker-compose down
    docker-compose up -d
    
    echo -e "${GREEN}✅ 回滚完成${NC}"
}

# 主流程
main() {
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}  Elpis 自动化部署脚本${NC}"
    echo -e "${GREEN}================================${NC}"
    
    # 检查项目目录
    if [ ! -d "$PROJECT_DIR" ]; then
        echo -e "${RED}❌ 项目目录不存在: $PROJECT_DIR${NC}"
        exit 1
    fi
    
    # 备份数据库
    backup_database
    
    # 更新代码
    update_code
    
    # 拉取镜像
    pull_images
    
    # 停止服务
    stop_services
    
    # 启动服务
    start_services
    
    # 健康检查
    if health_check; then
        # 清理
        cleanup
        
        # 显示状态
        show_status
        
        echo -e "\n${GREEN}🎉 部署成功！${NC}"
        echo -e "${GREEN}访问地址: http://localhost:7001${NC}"
    else
        echo -e "${RED}❌ 部署失败，是否回滚？(y/n)${NC}"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            rollback
        fi
        exit 1
    fi
}

# 执行主流程
main
