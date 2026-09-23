#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ ! -f .env ]; then
  echo "缺少 .env，请先复制 .env.example 并配置数据库和会话密钥。" >&2
  exit 1
fi
echo "启动开发服务器。此脚本不会创建、迁移或重置数据库。"
npm run dev
