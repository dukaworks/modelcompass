# 🎨 ModelCompass 前端架构思路

**版本**: 0.1.0 MVP  
**框架**: Next.js 14 + Tailwind CSS + TypeScript

---

## 📐 技术选型理由

### 为什么选 Next.js 14？

| 优势 | 说明 |
|------|------|
| **App Router** | 现代化路由，支持 Layout、Loading、Error 页面 |
| **SSR/SSG** | 模型数据可静态生成，SEO 友好 |
| **API Routes** | 可选，目前只用于前端，后端分离 |
| **Image Optimization** | 自动图片优化，提升性能 |
| **Vercel 一键部署** | 与后端 Railway 完美配合 |

### 为什么选 Tailwind CSS？

- **快速开发** - 无需写 CSS 文件，class 即样式
- **设计系统** - 内置颜色、间距、字体规范
- **响应式** - 移动端优先，`md:` `lg:` 前缀搞定适配
- **Tree Shaking** - 生产环境只打包用到的样式

### 为什么分离前后端？

```
前端 (Vercel) ←→ 后端 (Railway)
     3000           3001
```

- ✅ 独立部署，互不影响
- ✅ 前端可静态托管，加载更快
- ✅ 后端专注 API，可水平扩展
- ✅ 未来支持多端（小程序、App）共用一套 API

---

## 🗺️ 页面结构设计

### 当前 MVP 页面

```
/
├── /                    # 首页 - 模型展示
│   ├── Hero 区域        # 品牌介绍 + CTA
│   ├── 特性介绍         # 3个核心功能卡片
│   ├── 智能选型表单     # 场景推荐
│   └── 模型列表         # Grid 卡片展示
│
├── /admin               # 管理后台
│   ├── 总览 Tab         # 统计数据看板
│   ├── 任务 Tab         # 心跳任务控制
│   └── 日志 Tab         # 实时日志查看
│
└── /api (optional)      # 预留 Next.js API 路由
```

### 未来扩展页面

```
├── /models              # 模型库完整列表
│   ├── 筛选栏           # 提供商、能力、价格区间
│   ├── 排序选项         # 下载量、评分、价格
│   └── 分页/无限滚动
│
├── /models/[id]         # 模型详情页
│   ├── 基础信息         # 名称、提供商、描述
│   ├── 能力雷达图       # 代码/推理/写作/中文
│   ├── 价格对比         # 各供应商价格
│   ├── 评测数据         # MMLU/HumanEval 等
│   └── 用户评价         # 社区反馈
│
├── /compare             # 模型对比
│   └── 多选对比表格     # 并排显示多个模型
│
├── /recommend           # 智能推荐流程
│   ├── 场景选择         # 代码/写作/聊天...
│   ├── 需求问卷         # 预算/延迟/质量要求
│   └── 推荐结果         # 多维度排序推荐
│
├── /wiki                # 社区 Wiki
│   ├── 模型词条         # 众包编辑
│   ├── 使用案例         # 最佳实践
│   └── 讨论区           # 用户交流
│
└── /user                # 用户中心（未来）
    ├── 我的收藏
    ├── 历史记录
    └── API Key 管理
```

---

## 🧩 组件规划

### 当前组件

```
frontend/components/
├── ModelCard.tsx        # 模型卡片
│   ├── 名称 + 提供商标签
│   ├── 能力图标
│   ├── 价格显示
│   └── 上下文长度
│
└── RecommendForm.tsx    # 推荐表单
    ├── 场景选择卡片
    ├── 提交按钮
    └── 推荐结果列表
```

### 未来组件

```
frontend/components/
├── ui/                  # 基础 UI 组件
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   └── Tabs.tsx
│
├── models/
│   ├── ModelCard.tsx         # 现有
│   ├── ModelList.tsx         # 列表容器
│   ├── ModelFilter.tsx       # 筛选栏
│   ├── ModelDetail.tsx       # 详情展示
│   ├── ModelCompare.tsx      # 对比表格
│   └── CapabilityRadar.tsx   # 能力雷达图
│
├── charts/
│   ├── PriceChart.tsx        # 价格趋势
│   ├── BenchmarkChart.tsx    # 评测分数
│   └── UsageStats.tsx        # 使用统计
│
├── admin/
│   ├── TaskList.tsx          # 任务列表
│   ├── LogViewer.tsx         # 日志查看器
│   ├── StatCard.tsx          # 统计卡片
│   └── ProviderDistribution.tsx # 提供商分布
│
└── layout/
    ├── Header.tsx            # 导航头
    ├── Footer.tsx            # 页脚
    └── Sidebar.tsx           # 侧边栏（管理后台）
```

---

## 🎯 状态管理策略

### 当前方案：React Hooks

```typescript
// 简单状态用 useState
const [models, setModels] = useState<Model[]>([]);
const [loading, setLoading] = useState(true);

// 副作用用 useEffect
useEffect(() => {
  fetchModels();
  const interval = setInterval(fetchModels, 5000);
  return () => clearInterval(interval);
}, []);
```

**为什么不用 Redux/Zustand？**
- MVP 阶段数据流简单
- 组件层级不深，props 传递足够
- 减少依赖，降低复杂度

### 未来考虑

| 场景 | 方案 |
|------|------|
| 用户登录状态 | Context API 或 Zustand |
| 模型数据缓存 | React Query / SWR |
| 全局主题设置 | Context API |
| 复杂表单状态 | React Hook Form |

---

## 🔄 数据流设计

### 当前数据流

```
用户操作 → 前端组件 → fetch API → 后端服务 → 数据库
                ↓
            更新 UI (useState)
```

**示例：加载模型列表**
```typescript
// 1. 组件挂载
useEffect(() => fetchModels(), []);

// 2. 调用 API
const res = await fetch('/api/models');
const data = await res.json();

// 3. 更新状态
setModels(data.data);

// 4. UI 自动渲染
{models.map(m => <ModelCard model={m} />)}
```

### 实时数据（管理后台）

```
定时轮询: 每 5 秒请求一次 /api/admin/heartbeat/status

优势:
- 实现简单
- 无需 WebSocket 服务器
- 适合低频更新场景

未来优化:
- Server-Sent Events (SSE)
- WebSocket (高频实时场景)
```

---

## 📱 响应式设计

### 断点策略

```css
/* Tailwind 默认断点 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 小桌面 */
xl: 1280px  /* 大桌面 */
```

### 布局适配

**首页模型列表**
```jsx
// 手机: 1列, 平板: 2列, 桌面: 4列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

**管理后台**
```jsx
// 侧边栏: 桌面显示, 手机隐藏
<aside className="hidden lg:block w-64">

// 内容区: 全宽, 桌面有左边距
<main className="flex-1 lg:ml-64">
```

---

## 🚀 性能优化策略

### 当前

- ✅ **组件懒加载** - Next.js 自动代码分割
- ✅ **图片优化** - Next.js Image 组件
- ✅ **字体优化** - 系统字体优先

### 未来

- [ ] **虚拟列表** - 模型多时只渲染可见区域
- [ ] **数据缓存** - React Query 缓存 API 结果
- [ ] **预加载** - 鼠标悬停预加载详情页
- [ ] **骨架屏** - Loading 状态优化体验
- [ ] **Service Worker** - 离线访问能力

---

## 🎨 设计系统

### 颜色规范

```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',  // 主色
    600: '#0284c7',
    700: '#0369a1',
  }
}
```

### 字体规范

```css
/* 中文优先 */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", 
             "PingFang SC", "Hiragino Sans GB", 
             "Microsoft YaHei", sans-serif;
```

### 间距规范

- **基础单位**: 4px (Tailwind 默认)
- **卡片间距**: 24px (gap-6)
- **页面边距**: 16px 移动端, 24px 桌面端

---

## 📦 目录结构规范

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── admin/
│   │   └── page.tsx       # 管理后台
│   ├── models/
│   │   └── page.tsx       # 模型列表
│   └── api/               # 可选 API 路由
│
├── components/            # React 组件
│   ├── ui/               # 基础 UI
│   ├── models/           # 模型相关
│   ├── charts/           # 图表组件
│   └── layout/           # 布局组件
│
├── lib/                   # 工具函数
│   ├── utils.ts
│   └── api.ts            # API 封装
│
├── hooks/                 # 自定义 Hooks
│   └── useModels.ts
│
├── types/                 # TypeScript 类型
│   └── model.ts
│
├── styles/               # 全局样式
│   └── globals.css
│
└── public/               # 静态资源
    └── images/
```

---

## 🎯 MVP 到 Production 路线图

### Phase 1: MVP (当前)
- ✅ 首页展示
- ✅ 管理后台基础功能
- ✅ Docker 本地运行

### Phase 2: 功能完善
- [ ] 模型详情页
- [ ] 筛选排序功能
- [ ] 搜索结果页

### Phase 3: 高级功能
- [ ] 模型对比
- [ ] 智能推荐流程
- [ ] 用户系统

### Phase 4: 社区
- [ ] Wiki 系统
- [ ] 用户评论
- [ ] 社交分享

---

## 💡 开发原则

1. **渐进增强** - 先跑通基础功能，再优化细节
2. **移动优先** - 设计从移动端开始，向桌面扩展
3. **组件复用** - 提取通用组件，避免重复代码
4. **类型安全** - TypeScript 严格模式，减少运行时错误
5. **性能意识** - 图片懒加载、代码分割、缓存策略

---

**Last Updated**: 2025-01-21  
**Author**: 小龙虾 🦞
