'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Star, 
  Zap,
  MessageSquare,
  Cpu,
  DollarSign,
  ChevronRight,
  Compass,
  Sparkles,
  Flame,
  Clock,
  Database,
  Code,
  Image as ImageIcon,
  Mic
} from 'lucide-react';
import Header from '@/components/Header';

// 模型分类（左侧栏）
const categories = [
  { id: 'all', name: '模型广场', icon: Compass, count: 393 },
  { 
    id: 'experience', 
    name: '体验中心', 
    icon: Sparkles,
    children: [
      { id: 'chat', name: '文本对话', icon: MessageSquare, count: 156 },
      { id: 'image', name: '图像生成', icon: ImageIcon, count: 67 },
      { id: 'voice', name: '语音合成', icon: Mic, count: 23 },
    ]
  },
  { id: 'finetune', name: '模型微调', icon: Cpu, count: 45 },
  { id: 'batch', name: '批量推理', icon: Database, count: 32 },
];

// 模型数据（增强版）
const mockModels = [
  { 
    id: 'gpt-4o', 
    fullName: 'openai/gpt-4o-2024-08-06',
    displayName: 'GPT-4o', 
    provider: 'OpenAI',
    type: 'chat',
    tags: ['对话', '多模态', '128K', '最强'],
    params: 'Unknown',
    context: 128000,
    pricing: { input: 2.5, output: 10 },
    rating: 4.9,
    calls: 125000,
    isNew: false,
    isHot: true,
    description: 'OpenAI 最新旗舰模型，支持文本、图像、音频多模态输入，在复杂推理和创意写作方面表现卓越。',
  },
  { 
    id: 'claude-3.5', 
    fullName: 'anthropic/claude-3.5-sonnet',
    displayName: 'Claude 3.5 Sonnet', 
    provider: 'Anthropic',
    type: 'chat',
    tags: ['对话', '写作', '200K', '安全'],
    params: 'Unknown',
    context: 200000,
    pricing: { input: 3, output: 15 },
    rating: 4.8,
    calls: 98000,
    isNew: false,
    isHot: true,
    description: 'Anthropic 最强模型，超长上下文窗口，特别适合长文档分析和创意写作任务。',
  },
  { 
    id: 'deepseek-v3', 
    fullName: 'deepseek-ai/deepseek-v3',
    displayName: 'DeepSeek-V3', 
    provider: 'DeepSeek',
    type: 'chat',
    tags: ['对话', '代码', '64K', '国产'],
    params: '671B',
    context: 64000,
    pricing: { input: 0.19, output: 0.65 },
    rating: 4.7,
    calls: 87000,
    isNew: true,
    isHot: true,
    description: '幻方量化出品，MoE架构，数学推理和代码能力突出，性价比极高的国产模型。',
  },
  { 
    id: 'qwen-2.5-72b', 
    fullName: 'qwen/qwen-2.5-72b-instruct',
    displayName: 'Qwen2.5-72B-Instruct', 
    provider: '阿里云',
    type: 'chat',
    tags: ['对话', '中文', '开源', '32K'],
    params: '72B',
    context: 32768,
    pricing: { input: 0.12, output: 0.39 },
    rating: 4.6,
    calls: 76000,
    isNew: false,
    isHot: false,
    description: '阿里通义千问，中文理解能力最强，开源可商用，适合中文场景应用。',
  },
  { 
    id: 'gemini-1.5', 
    fullName: 'google/gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro', 
    provider: 'Google',
    type: 'chat',
    tags: ['对话', '多模态', '1M', '长文'],
    params: 'Unknown',
    context: 1048576,
    pricing: { input: 1.25, output: 5 },
    rating: 4.5,
    calls: 65000,
    isNew: false,
    isHot: true,
    description: 'Google 旗舰模型，100万token超长上下文，视频理解能力领先。',
  },
  { 
    id: 'llama-3.1-405b', 
    fullName: 'meta/llama-3.1-405b-instruct',
    displayName: 'Llama 3.1 405B', 
    provider: 'Meta',
    type: 'chat',
    tags: ['对话', '开源', '405B', '128K'],
    params: '405B',
    context: 128000,
    pricing: { input: 0, output: 0 },
    rating: 4.5,
    calls: 54000,
    isNew: true,
    isHot: false,
    description: 'Meta 最强开源模型，405B参数，性能接近GPT-4，完全免费可商用。',
  },
  { 
    id: 'kimi-k2', 
    fullName: 'moonshot/kimi-k2',
    displayName: 'Kimi K2', 
    provider: 'Moonshot',
    type: 'chat',
    tags: ['对话', '长文', '200K', '国产'],
    params: 'Unknown',
    context: 200000,
    pricing: { input: 0.5, output: 2 },
    rating: 4.4,
    calls: 43000,
    isNew: true,
    isHot: true,
    description: '月之暗面出品，超长上下文处理专家，适合长篇文档总结和分析。',
  },
  { 
    id: 'mistral-large', 
    fullName: 'mistral/mistral-large-2402',
    displayName: 'Mistral Large', 
    provider: 'Mistral AI',
    type: 'chat',
    tags: ['对话', '欧洲', '32K', '多语言'],
    params: 'Unknown',
    context: 32768,
    pricing: { input: 2, output: 6 },
    rating: 4.3,
    calls: 32000,
    isNew: false,
    isHot: false,
    description: '欧洲最强模型，Mistral AI出品，多语言能力突出，代码生成优秀。',
  },
  { 
    id: 'yi-34b', 
    fullName: '01-ai/yi-34b-chat',
    displayName: 'Yi-34B-Chat', 
    provider: '零一万物',
    type: 'chat',
    tags: ['对话', '中文', '开源', '4K'],
    params: '34B',
    context: 4096,
    pricing: { input: 0.15, output: 0.4 },
    rating: 4.2,
    calls: 28000,
    isNew: false,
    isHot: false,
    description: '李开复零一万物出品，34B参数小而精，适合私有化部署。',
  },
];

// 排序选项
const sortOptions = [
  { label: '热度最高', value: 'hot', icon: Flame },
  { label: '评分最高', value: 'rating', icon: Star },
  { label: '价格最低', value: 'price', icon: DollarSign },
  { label: '最新发布', value: 'newest', icon: Clock },
];

// 获取图标颜色
const getTagColor = (tag: string) => {
  if (tag.includes('对话') || tag.includes('Chat')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (tag.includes('多模态') || tag.includes('Vision')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  if (tag.includes('代码') || tag.includes('Code')) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (tag.includes('中文') || tag.includes('CN')) return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (tag.includes('开源') || tag.includes('Open')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (tag.includes('最强') || tag.includes('Hot')) return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  return 'bg-slate-700/50 text-slate-400 border-slate-600/50';
};

export default function MarketPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 筛选模型
  const filteredModels = mockModels.filter(model => {
    if (activeSubCategory) {
      if (activeSubCategory === 'chat' && model.type !== 'chat') return false;
      if (activeSubCategory === 'image' && model.type !== 'image') return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        model.displayName.toLowerCase().includes(query) ||
        model.provider.toLowerCase().includes(query) ||
        model.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // 排序
  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === 'hot') return b.calls - a.calls;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.pricing.input - b.pricing.input;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <Header activePage="market" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl hover:border-cyan-500/30 transition-colors"
            >
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-slate-300">展开筛选器</span>
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="请输入模型名称，如 GPT-4、DeepSeek、Qwen..."
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">价格区间</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500">¥0</span>
                    <input type="range" min="0" max="20" className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    <span className="text-sm text-slate-500">¥20/M</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">上下文长度</label>
                  <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm">
                    <option>全部</option>
                    <option>4K以内</option>
                    <option>4K-32K</option>
                    <option>32K-128K</option>
                    <option>128K以上</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">特殊筛选</label>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                      免费模型
                    </button>
                    <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                      开源可商用
                    </button>
                    <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                      国产模型
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl sticky top-24 overflow-hidden">
              {/* Categories */}
              <div className="p-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  
                  return (
                    <div key={cat.id}>
                      <button
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setActiveSubCategory(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 ${
                          isActive && !cat.children
                            ? 'bg-cyan-500/10 text-cyan-400'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span>{cat.name}</span>
                        </div>
                        {cat.count && <span className="text-xs text-slate-500">{cat.count}</span>}
                      </button>
                      
                      {/* Sub-categories */}
                      {cat.children && isActive && (
                        <div className="ml-6 space-y-1">
                          {cat.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isSubActive = activeSubCategory === child.id;
                            return (
                              <button
                                key={child.id}
                                onClick={() => setActiveSubCategory(child.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isSubActive
                                    ? 'bg-cyan-500/10 text-cyan-400'
                                    : 'text-slate-400 hover:bg-slate-800/50'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <ChildIcon className="w-4 h-4" />
                                  <span>{child.name}</span>
                                </div>
                                <span className="text-xs text-slate-500">{child.count}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />

              {/* User Account */}
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  账户管理
                </p>
                <a href="/profile" className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xs text-white font-medium">
                    D
                  </div>
                  <span>个人中心</span>
                </a>
                <a href="/keys" className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                  <Code className="w-4 h-4 text-slate-500" />
                  <span>API密钥</span>
                </a>
                <a href="/billing" className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <span>余额充值</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-slate-100">
                  {activeSubCategory 
                    ? categories.find(c => c.id === activeCategory)?.children?.find(c => c.id === activeSubCategory)?.name
                    : categories.find(c => c.id === activeCategory)?.name
                  }
                </h1>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full">
                  {sortedModels.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">排序:</span>
                <div className="flex items-center space-x-1 bg-slate-900/80 border border-slate-700 rounded-lg p-1">
                  {sortOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                          isActive
                            ? 'bg-cyan-500 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Model Grid - 参考硅基流动风格 */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedModels.map((model) => (
                <div 
                  key={model.id} 
                  className="group relative bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5"
                >
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex space-x-1">
                    {model.isNew && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                    {model.isHot && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-medium rounded-full">
                        🔥 Hot
                      </span>
                    )}
                  </div>

                  {/* Header */}
                  <div className="flex items-start space-x-3 mb-3 pr-16">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      {model.provider.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
                        {model.displayName}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">{model.provider}</p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <p className="text-xs text-slate-600 mb-3 font-mono truncate">
                    {model.fullName}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {model.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {model.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`px-2 py-0.5 text-xs rounded border ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Specs Bar */}
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-800">
                    <span className="flex items-center space-x-1">
                      <Database className="w-3.5 h-3.5" />
                      <span>{model.params}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{(model.context / 1000).toFixed(0)}K</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5" />
                      <span>{model.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{(model.calls / 1000).toFixed(1)}k</span>
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-lg font-bold text-cyan-400">
                        ¥{model.pricing.input}
                      </span>
                      <span className="text-xs text-slate-500">/ 百万 tokens</span>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`/chat?model=${model.id}`}
                        className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-sm rounded-lg hover:bg-cyan-500/20 transition-colors"
                      >
                        体验
                      </a>
                      <a
                        href="/api-service"
                        className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        API
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedModels.length === 0 && (
              <div className="text-center py-16">
                <Database className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">暂无符合条件的模型</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
