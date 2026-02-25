# 🎯 竞品调研报告 - ModelCompass 参考项目

> 调研时间: 2026-02-25
> 调研工具: GitHub API

---

## 🏆 核心竞品（直接竞争）

### 1. OpenRouter (商业产品)
- **GitHub**: 未开源，但API开放
- **定位**: AI模型统一路由与API聚合
- **特点**: 
  - 支持100+模型提供商
  - 按Token计费
  - 开源格式兼容
- **对标**: 我们直接对标OpenRouter，但专注中文开发者市场

### 2. LiteLLM ⭐36.8k (强烈推荐参考)
- **GitHub**: https://github.com/BerriAI/litellm
- **定位**: Python SDK + Proxy Server (AI Gateway)
- **核心功能**:
  - 调用100+ LLM APIs (OpenAI格式)
  - 成本追踪 (cost tracking)
  - 负载均衡 (load balancing)
  - Guardrails + 日志
- **参考价值**: 
  - ✅ 技术架构可借鉴
  - ✅ SDK设计理念
  - ✅ 统一接口封装方式

### 3. One-Hub / One-API ⭐2.6k (国产最强)
- **GitHub**: https://github.com/MartialBE/one-hub
- **原项目**: songquanpeng/one-api (已删库)
- **定位**: OpenAI接口管理 & 分发系统
- **核心功能**:
  - 多模型渠道管理
  - 用户分组计费
  - 额度管理
  - 支持非OpenAI模型的函数调用
- **参考价值**:
  - ✅ 国产市场的验证
  - ✅ 渠道管理设计
  - ✅ 计费系统架构

---

## 📊 价格对比类（功能参考）

### 4. LLM Price Compass ⭐224
- **GitHub**: https://github.com/arc53/llm-price-compass
- **定位**: GPU基准测试 + Token成本对比
- **特点**:
  - GPU云服务商对比
  - 价格/性能比分析
- **参考**: 价格展示UI设计

### 5. AI Pricing ⭐16
- **GitHub**: https://github.com/WiegerWolf/ai-pricing
- **定位**: 交互式模型价格对比工具
- **参考**: 前端交互体验

### 6. OpenRouter Models Compare ⭐5
- **GitHub**: https://github.com/lollipopkit/or-models-compare
- **定位**: OpenRouter模型展示，自动每日更新
- **特点**:
  - 静态网页
  - 价格和上下文对比
- **参考**: 简单有效的展示方案

---

## 🧠 智能路由类（技术参考）

### 7. LLMProxy ⭐22
- **GitHub**: https://github.com/obirler/LLMProxy
- **定位**: 智能大模型后端路由代理服务
- **参考**: 路由算法设计

### 8. RobinLLM ⭐9
- **GitHub**: https://github.com/akumaburn/RobinLLM
- **定位**: 爬取OpenRouter免费模型，性能测试，自动路由
- **特点**:
  - Java服务
  - 持续性能测试
  - OpenAI兼容API
- **参考**: 自动化测试和路由策略

### 9. Intelligent LLM Router ⭐2
- **GitHub**: https://github.com/Hamzakhan7473/Intelligent-LLM-Router
- **定位**: 根据提示词分类，动态路由到最适合的模型
- **参考**: 智能匹配算法（类似我们的AI匹配）

---

## 🏢 平台型产品（完整生态）

### 10. FastGPT ⭐27k (国内最强RAG)
- **GitHub**: https://github.com/labring/FastGPT
- **定位**: 基于LLM的知识库平台
- **核心功能**:
  - RAG检索
  - 可视化AI工作流编排
  - 知识库问答系统
- **参考**:
  - ✅ 国内开源项目的成功模式
  - ✅ 商业化路径
  - ✅ 社区运营方式

### 11. Langfuse ⭐22k
- **GitHub**: https://github.com/langfuse/langfuse
- **定位**: LLM工程平台 (可观测性、评估、提示词管理)
- **参考**: 企业级功能设计

---

## 💡 关键洞察

### 市场空白
| 方向 | 现有产品 | 空白机会 |
|------|----------|----------|
| 国际通用 | OpenRouter, LiteLLM | 已被占据 |
| **中文开发者** | **One-API(已删库)** | **✅ 机会巨大** |
| **中文场景优化** | **无专门产品** | **✅ 我们的定位** |
| 企业级 | Portkey, Langfuse | 高门槛 |

### 我们的差异化优势
```
1. 中文开发者优先 ✅
   - 国内模型收录更全 (DeepSeek, Qwen, ChatGLM)
   - 中文场景推荐算法 (法律/写作/编程)

2. 价格透明 + 省钱导向 ✅
   - 免费模型筛选 (学生和开发者刚需)
   - 成本对比工具

3. AI智能匹配 ✅
   - 不只是路由，是"帮你选"
   - 场景理解 → 模型推荐

4. 开源 + 社区驱动 ✅
   - 国内开发者社区
   - 共建评测数据集
```

---

## 🎯 推荐参考架构

### 必学项目
1. **LiteLLM** - 学习技术架构和SDK设计
2. **One-Hub** - 学习国产市场的渠道管理和计费
3. **OpenRouter Models Compare** - 学习简洁的前端展示

### 可借鉴功能
- **LiteLLM**: 统一接口封装、成本追踪
- **One-Hub**: 用户分组、额度管理
- **Langfuse**: 可观测性、调用分析
- **FastGPT**: 社区运营、商业化

---

## 🚀 下一步建议

### 短期（本周）
1. 深入研究 LiteLLM 的 SDK 设计
2. 分析 One-Hub 的计费系统架构
3. 参考 OpenRouter Models Compare 简化前端

### 中期（本月）
1. 确定是否复用 LiteLLM 作为后端（节省开发成本）
2. 设计差异化功能：中文场景推荐算法
3. 规划开源策略和社区运营（参考FastGPT）

### 长期（下月）
1. 对标Portkey的企业级功能
2. 构建国内开发者社区
3. 商业化路径验证

---

**结论**: 
- 技术层面：LiteLLM和One-Hub是最强参考
- 市场层面：中文开发者市场有明确空白
- 产品层面：AI智能匹配是核心差异化

---

*调研者: 小龙虾 🦞*
*日期: 2026-02-25*
