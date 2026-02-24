'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Star, 
  Zap,
  Globe,
  ChevronDown,
  Compass,
  Github
} from 'lucide-react';

// 模拟模型数据
const mockModels = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', rating: 4.9, calls: 125000, tags: ['多模态', '通用', '最强'], price: 2.5, image: '🎨' },
  { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', provider: 'anthropic', rating: 4.8, calls: 98000, tags: ['长上下文', '写作', '安全'], price: 3.0, image: '📝' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'deepseek', rating: 4.7, calls: 87000, tags: ['推理', '代码', '国产'], price: 0.19, image: '🧠' },
  { id: 'qwen-2.5', name: 'Qwen 2.5-72B', provider: 'alibaba', rating: 4.6, calls: 76000, tags: ['中文', '开源', '免费'], price: 0.12, image: '🇨🇳' },
  { id: 'gemini-1.5', name: 'Gemini 1.5 Pro', provider: 'google', rating: 4.5, calls: 65000, tags: ['长上下文', '多模态'], price: 1.25, image: '🔍' },
  { id: 'llama-3', name: 'Llama 3 70B', provider: 'meta', rating: 4.5, calls: 54000, tags: ['开源', '免费', '本地'], price: 0, image: '🦙' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'mistral', rating: 4.4, calls: 43000, tags: ['欧洲', '多语言'], price: 2.0, image: '🇪🇺' },
  { id: 'yi-34b', name: 'Yi-34B', provider: '01-ai', rating: 4.3, calls: 32000, tags: ['中文', '开源'], price: 0.15, image: '🔢' },
];

const categories = [
  { name: '全部', count: 393 },
  { name: '聊天', count: 156 },
  { name: '代码', count: 89 },
  { name: '多模态', count: 67 },
  { name: '免费', count: 45 },
  { name: '中文', count: 78 },
];

const sortOptions = [
  { label: '热度', value: 'popular' },
  { label: '评分', value: 'rating' },
  { label: '价格', value: 'price' },
  { label: '最新', value: 'newest' },
];

export default function MarketPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = mockModels.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.tags.some(tag => tag.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ModelCompass
            </span>
          </a>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/api-service" className="text-sm text-slate-400 hover:text-cyan-400">申请API</a>
            <a href="/market" className="text-sm text-cyan-400 font-medium">模型市场</a>
            <a href="/chat" className="text-sm text-slate-400 hover:text-cyan-400">AI匹配模型</a>
            <a href="/docs" className="text-sm text-slate-400 hover:text-cyan-400">文档</a>
            <a href="https://github.com/dukaworks/modelcompass" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400">
              <Github className="w-5 h-5" />
            </a>
            <a href="/login" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg">
              注册
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Search */}
      <section className="py-12 border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">模型市场</h1>
          <p className="text-slate-400 mb-8">发现 393+ 个经过验证的 AI 模型</p>
          
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索模型名称、能力标签..."
              className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sticky top-24">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="font-medium">筛选</span>
              </div>
              
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === cat.name
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-slate-600">{cat.count}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-sm text-slate-500 mb-3">价格区间</p>
                <div className="flex items-center space-x-2">
                  <input type="range" className="flex-1" min="0" max="10" step="0.1" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>免费</span>
                  <span>¥10/千tokens</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400 text-sm">
                共 <span className="text-cyan-400 font-medium">{filteredModels.length}</span> 个模型
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">排序:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Model Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredModels.map((model) => (
                <div key={model.id} className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all hover:-translate-y-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                        {model.image}
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">{model.name}</h3>
                        <p className="text-sm text-slate-500">{model.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{model.rating}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{model.calls.toLocaleString()} 调用</span>
                    </span>
                    <span className="text-cyan-400 font-medium">
                      {model.price === 0 ? '免费' : `¥${model.price}/M`}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-2">
                    <a
                      href={`/chat?model=${model.id}`}
                      className="flex-1 py-2 bg-cyan-500/10 text-cyan-400 text-sm font-medium rounded-lg text-center hover:bg-cyan-500/20 transition-colors"
                    >
                      免费测试
                    </a>
                    <a
                      href={`/api-service`}
                      className="flex-1 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg text-center hover:bg-slate-700 transition-colors"
                    >
                      API 接入
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
