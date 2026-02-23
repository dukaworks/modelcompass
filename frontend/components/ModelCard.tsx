interface Model {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  pricing: { prompt: number; completion: number };
  contextLength: number;
  tags: string[];
  recommendedFor: string[];
}

interface ModelCardProps {
  model: Model;
  darkMode?: boolean;
}

export default function ModelCard({ model, darkMode = true }: ModelCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return '免费';
    return `$${price}/1K`;
  };

  const getProviderGradient = (provider: string) => {
    const gradients: Record<string, string> = {
      openai: 'from-green-500/20 to-emerald-600/20 text-green-400',
      anthropic: 'from-orange-500/20 to-red-600/20 text-orange-400',
      alibaba: 'from-red-500/20 to-pink-600/20 text-red-400',
      deepseek: 'from-blue-500/20 to-cyan-600/20 text-blue-400',
      google: 'from-blue-500/20 to-indigo-600/20 text-blue-400',
      meta: 'from-blue-500/20 to-purple-600/20 text-blue-400',
      qwen: 'from-purple-500/20 to-pink-600/20 text-purple-400',
    };
    return gradients[provider] || 'from-slate-500/20 to-slate-600/20 text-slate-400';
  };

  if (!darkMode) {
    // 浅色模式（保持原有样式）
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        {/* 浅色模式代码... */}
      </div>
    );
  }

  // 深色科技风
  return (
    <div className="group relative p-6 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* 发光边框效果 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        {/* 标题和提供商 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
              {model.name}
            </h3>
            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 bg-gradient-to-r ${getProviderGradient(model.provider)}`}>
              {model.provider}
            </span>
          </div>
        </div>

        {/* 价格信息 */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">上下文</span>
            <span className="font-medium text-slate-300">
              {(model.contextLength / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">输入</span>
            <span className="font-medium text-cyan-400">
              {formatPrice(model.pricing.prompt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">输出</span>
            <span className="font-medium text-purple-400">
              {formatPrice(model.pricing.completion)}
            </span>
          </div>
        </div>

        {/* 标签 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {model.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 按钮 */}
        <button className="w-full mt-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300 text-sm font-medium">
          查看详情
        </button>
      </div>
    </div>
  );
}
