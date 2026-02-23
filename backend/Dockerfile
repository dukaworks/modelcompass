FROM node:20-alpine

WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache openssl

# 复制 package 文件
COPY package*.json ./
RUN npm ci

# 复制 Prisma schema
COPY prisma ./prisma/
RUN npx prisma generate

# 复制源代码
COPY . .

# 构建
RUN npm run build

EXPOSE 3001

# 启动命令（包含迁移和种子）
CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed && npm start"]
