# ⚠️ TODO: 认证系统待办

## 当前状态（模拟实现）

**位置**: `/login` 页面 GitHub 登录按钮
**当前实现**: 点击后设置 localStorage 模拟登录
**状态**: 已标记"模拟模式"

## 需要改回的事项

### 1. GitHub OAuth 集成
```typescript
// 当前（模拟）:
onClick={() => {
  localStorage.setItem('isLoggedIn', 'true');
  ...
}}

// 改回（真实）:
onClick={() => {
  window.location.href = 'https://github.com/login/oauth/authorize?client_id=xxx&redirect_uri=...';
}}
```

**参考实现**:
- NextAuth.js (推荐)
- 或自建 OAuth 流程

### 2. JWT 认证
- 当前: localStorage 存储登录状态
- 改回: HTTP-Only Cookie + JWT
- 参考: `js-cookie` + `jsonwebtoken`

### 3. 后端用户系统
- 用户表 (Prisma schema)
- OAuth 回调处理
- Token 刷新机制

### 4. 安全加固
- CSRF 保护
- 登录频率限制
- 异常登录检测

## 计划时间
- **Phase 1**: 接入 NextAuth.js (2天)
- **Phase 2**: 后端用户系统 (3天)
- **Phase 3**: 安全加固 (2天)

## 负责人
- 待定

---
**创建时间**: 2025-01-22  
**创建者**: 小龙虾 🦞
