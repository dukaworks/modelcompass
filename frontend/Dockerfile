FROM node:20-alpine

WORKDIR /app

# 复制前端依赖
COPY package.json ./
RUN npm install

# 复制源码
COPY . .

# 构建 Next.js
RUN npm run build

EXPOSE 3000

# 启动 Next.js
CMD ["npm", "start"]
