#!/bin/bash
# kanaAI 开发环境一键启动
# 用法: bash scripts/dev.sh

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

step() { echo -e "${CYAN}▶ $1${NC}"; }
ok() { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}! $1${NC}"; }
err() { echo -e "${RED}✗ $1${NC}"; }

# 项目根目录
cd "$(dirname "$0")/.."
ROOT=$(pwd)

# ===== 1. 检查 Docker =====
step "检查 Docker 状态..."
if ! command -v docker &> /dev/null; then
  err "未安装 Docker，请先安装 Docker Desktop"
  exit 1
fi

if ! docker info &> /dev/null 2>&1; then
  err "Docker 未运行，正在尝试启动 Docker Desktop..."
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows: 启动 Docker Desktop
    "C:/Program Files/Docker/Docker/Docker Desktop.exe" &> /dev/null &
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    open -a Docker
  else
    sudo systemctl start docker
  fi

  echo -n "等待 Docker 启动"
  for i in {1..30}; do
    sleep 2
    if docker info &> /dev/null 2>&1; then
      echo
      ok "Docker 已启动"
      break
    fi
    echo -n "."
  done

  if ! docker info &> /dev/null 2>&1; then
    err "Docker 启动超时，请手动启动 Docker Desktop 后重试"
    exit 1
  fi
fi
ok "Docker 运行中"

# ===== 2. 启动 PostgreSQL =====
step "检查 PostgreSQL 容器..."
CONTAINER_NAME="kanaai-postgres"
POSTGRES_PORT=5433
DB_USER="kanaai"
DB_PASSWORD="test123"
DB_NAME="kanaai"

# 检查现有容器状态
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  STATE=$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME")
  if [ "$STATE" != "running" ]; then
    step "启动已存在的容器..."
    docker start "$CONTAINER_NAME" > /dev/null
    ok "容器已启动"
  else
    ok "容器已在运行"
  fi
else
  step "创建新的 PostgreSQL 容器..."
  docker run -d \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB="$DB_NAME" \
    -p ${POSTGRES_PORT}:5432 \
    postgres:16-alpine > /dev/null
  ok "容器已创建"
fi

# 等待 PostgreSQL 就绪
step "等待 PostgreSQL 就绪..."
for i in {1..15}; do
  if docker exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" &> /dev/null; then
    ok "PostgreSQL 已就绪 (端口 $POSTGRES_PORT)"
    break
  fi
  sleep 1
  echo -n "."
done

if ! docker exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" &> /dev/null; then
  err "PostgreSQL 启动超时"
  exit 1
fi

# ===== 3. 检查迁移 =====
step "检查数据库迁移..."
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations 2>/dev/null | grep -v migration_lock)" ]; then
  warn "未发现迁移文件,执行 init 迁移..."
  npx prisma migrate dev --name init
else
  ok "迁移文件已存在"
fi

# ===== 4. 检查种子数据 =====
step "检查种子数据..."
USER_EXISTS=$(docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM \"User\";" 2>/dev/null || echo "0")
if [ "$USER_EXISTS" = "0" ]; then
  warn "未发现测试用户,运行 seed..."
  npx tsx prisma/seed.ts
else
  ok "种子数据已存在 ($USER_EXISTS 个用户)"
fi

# ===== 5. 启动 Next.js =====
step "启动 Next.js 开发服务器..."
echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  kanaAI 已就绪:${NC}"
echo -e "${GREEN}    数据库: postgresql://kanaai:***@localhost:${POSTGRES_PORT}/${DB_NAME}${NC}"
echo -e "${GREEN}    应用:   http://localhost:3000${NC}"
echo -e "${GREEN}    测试账号: dev@kanaai.local / dev12345678${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

npm run dev
