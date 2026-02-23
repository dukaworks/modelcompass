#!/bin/sh
# ModelCompass 后端启动脚本
# 同时启动 API 服务和心跳任务

# 数据库迁移
echo "🔄 执行数据库迁移..."
npx prisma migrate deploy

# 种子数据
echo "🌱 加载种子数据..."
npm run db:seed

# 启动心跳任务（后台）
echo "💓 启动心跳任务..."
nohup npx tsx src/heartbeat-runner.ts start > /tmp/heartbeat.log 2>&1 &

# 启动 API 服务（前台）
echo "🚀 启动 API 服务..."
npm run dev
