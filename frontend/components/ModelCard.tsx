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
}

export default function ModelCard({ model }: ModelCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return '免费';
    return `$${price}/1K tokens`;
  };

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      openai: 'bg-green-100 text-green-800',
      anthropic: 'bg-orange-100 text-orange-800',
      alibaba: 'bg-red-100 text-red-800',
      deepseek: 'bg-blue-100 text-blue-800'
    };
    return colors[provider] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{model.name}</h3>
          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getProviderColor(model.provider)}`}>
            {model.provider}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">上下文</span>
          <span className="font-medium">{(model.contextLength / 1000).toFixed(0)}K</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">输入</span>
          <span className="font-medium">{formatPrice(model.pricing.prompt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">输出</span>
          <span className="font-medium">{formatPrice(model.pricing.completion)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {model.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <button className="w-full mt-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition text-sm font-medium">
        查看详情
      </button>
    </div>
  );
}
