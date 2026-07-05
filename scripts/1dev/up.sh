#!/bin/bash
set -e

echo "🚀 Starting development environment..."

# 檢查 docker 是否存在
if ! command -v docker &> /dev/null
then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# 載入環境變數
if [ -f .env.dev ]; then
    echo "📦 Loading development environment variables..."
    export $(grep -v '^#' .env | xargs)
fi

# 啟動 docker compose
echo "🐳 Starting containers..."
docker compose -f docker-compose.1dev.yml up --build -d

echo ""
echo "✅ Development environment started!"
echo "Frontend: http://localhost:4200"
echo "Backend:  http://localhost:5000"