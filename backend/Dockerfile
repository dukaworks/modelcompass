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

# 开发模式不构建，生产模式需要构建
# RUN npm run build

EXPOSE 3001

# 默认开发命令（docker-compose 会覆盖）
CMD ["npm", "run", "dev"]
