# 🚀 ModelCompass 部署指南

## 方案：Railway（后端+数据库）+ Vercel（前端）

---

## 1️⃣ 部署后端到 Railway

### 步骤：

1. **登录 Railway**（免费额度足够）
   ```bash
   # 访问 https://railway.app 用 GitHub 登录
   ```

2. **创建项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择 `dukaworks/modelcompass`

3. **添加 PostgreSQL 数据库**
   - 点击 "New" → "Database" → "Add PostgreSQL"
   - Railway 会自动注入 `DATABASE_URL` 环境变量

4. **配置环境变量**
   ```
   PORT=3001
   NODE_ENV=production
   OPENROUTER_API_KEY=your_openrouter_key
   ```

5. **部署**
   - Railway 会自动检测 `railway.json` 配置
   - 自动执行：构建 → 数据库迁移 → 种子数据 → 启动

### 验证部署：
```bash
curl https://your-app.up.railway.app/health
# 应返回: {"status":"ok"}
```

---

## 2️⃣ 部署前端到 Vercel

### 步骤：

1. **登录 Vercel**（免费）
   ```bash
   # 访问 https://vercel.com 用 GitHub 登录
   ```

2. **导入项目**
   - 点击 "Add New Project"
   - 导入 `dukaworks/modelcompass`
   - **重要**：设置根目录为 `frontend`

3. **配置环境变量**
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
   ```

4. **部署**
   - Vercel 自动检测 Next.js 项目
   - 自动构建并部署

---

## 3️⃣ 更新 API 代理配置

前端部署后，更新 `frontend/next.config.js`：

```javascript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-railway-app.up.railway.app/api/:path*'
      }
    ];
  }
};
```

---

## 📁 部署文件说明

| 文件 | 用途 |
|-----|------|
| `railway.json` | Railway 部署配置（构建+启动命令） |
| `vercel.json` | Vercel 部署配置（路由+构建设置） |
| `backend/Procfile` | Railway 进程定义（备用） |

---

## 🔧 本地开发数据库

```bash
# 使用 Docker 启动 PostgreSQL
docker run -d \
  --name modelcompass-db \
  -e POSTGRES_USER=modelcompass \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=modelcompass \
  -p 5432:5432 \
  postgres:15

# 更新 .env
DATABASE_URL="postgresql://modelcompass:password@localhost:5432/modelcompass?schema=public"

# 初始化数据库
cd backend
npx prisma migrate dev --name init
npm run db:seed
```

---

## 📊 免费额度

| 服务 | 免费额度 |
|-----|---------|
| Railway | $5/月（含 PostgreSQL） |
| Vercel | Hobby 免费版 |
| OpenRouter | 按需付费（可用免费模型） |

---

## 🚨 故障排查

### Railway 部署失败
```bash
# 查看日志
railway logs

# 手动运行迁移
railway run npx prisma migrate deploy
```

### 数据库连接失败
- 检查 `DATABASE_URL` 是否正确注入
- 确认 PostgreSQL 服务已启动

### API 请求 404
- 确认 `NEXT_PUBLIC_API_URL` 指向正确
- 检查 Railway 服务是否运行

---

## 🎉 部署完成！

访问你的 Vercel 域名即可看到 ModelCompass 在线运行！
