'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ExternalLink, 
  Heart, 
  Share2, 
  Code,
  Zap,
  Database,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import Header from '@/components/Header';

interface Model {
  id: string;
  modelId: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  contextLength: number;
  promptPrice: number;
  completionPrice: number;
  tags: string[];
  websiteUrl?: string;
  docsUrl?: string;
  isActive: boolean;
  usageCount: number;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
}

const capabilityLabels: Record<string, { label: string; color: string }> = {
  'chat': { label: '对话', color: 'bg-blue-500/20 text-blue-400' },
  'vision': { label: '视觉', color: 'bg-purple-500/20 text-purple-400' },
  'code': { label: '代码', color: 'bg-green-500/20 text-green-400' },
  'reasoning': { label: '推理', color: 'bg-amber-500/20 text-amber-400' },
  'generation': { label: '生成', color: 'bg-pink-500/20 text-pink-400' },
};

export default function ModelDetailPage() {
  const params = useParams();
  const modelId = params.id as string;
  
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchModel();
  }, [modelId]);

  const fetchModel = async () => {
    try {
      const res = await fetch(`/api/models/${modelId}`);
      const data = await res.json();
      if (data.success) {
        setModel(data.data);
      } else {
        setError('模型未找到');
      }
    } catch (err) {
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{error || '模型未找到'}</h1>
          <p className="text-slate-400 mb-6">该模型可能已被移除或不存在</p>
          <a href="/market" className="text-cyan-400 hover:underline">返回模型广场 →</a>
        </div>
      </div>
    );
  }

  const codeExample = `curl https://api.modelcompass.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model.modelId}",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
          <a href="/market" className="hover:text-cyan-400 transition-colors">模型广场</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-300">{model.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl font-bold text-cyan-400">
                    {model.provider.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-100">{model.name}</h1>
                    <p className="text-slate-400">{model.provider}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-lg transition-colors ${isFavorite ? 'text-pink-400 bg-pink-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-400' : ''}`} />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed mb-4">{model.description}</p>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {model.capabilities.map(cap => {
                  const capInfo = capabilityLabels[cap] || { label: cap, color: 'bg-slate-700 text-slate-300' };
                  return (
                    <span key={cap} className={`px-3 py-1 rounded-full text-xs font-medium ${capInfo.color}`}>
                      {capInfo.label}
                    </span>
                  );
                })}
                {model.tags.slice(0, 5).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center space-x-4 text-sm">
                <span className={`flex items-center space-x-1 ${model.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  {model.isActive ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{model.isActive ? '服务正常' : '暂不可用'}</span>
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">ID: {model.modelId}</span>
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <span>快速接入</span>
                </h3>
                <button
                  onClick={() => handleCopy(codeExample)}
                  className="flex items-center space-x-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '已复制' : '复制代码'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto text-sm text-slate-300 font-mono">
                {codeExample}
              </pre>
            </div>

            {/* Documentation */}
            {model.docsUrl && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">官方文档</h3>
                <a 
                  href={model.docsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-cyan-400 hover:underline"
                >
                  <span>查看官方 API 文档</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Pricing */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">定价</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">输入</span>
                  <span className="text-xl font-bold text-cyan-400">${model.promptPrice.toExponential(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">输出</span>
                  <span className="text-xl font-bold text-cyan-400">${model.completionPrice.toExponential(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-700/50 text-sm text-slate-500">
                  每 1M tokens
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">统计</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{model.usageCount.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">总调用次数</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{model.ratingAvg.toFixed(1)}</div>
                    <div className="text-sm text-slate-400">评分 ({model.ratingCount})</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Database className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{(model.contextLength / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-slate-400">上下文长度</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a 
                href="/api-service" 
                className="block w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                申请 API 接入
              </a>
              {model.websiteUrl && (
                <a 
                  href={model.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-slate-800 border border-slate-700 text-slate-300 text-center font-medium rounded-xl hover:border-slate-600 transition-all"
                >
                  访问提供商官网
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Similar Models */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">相似模型推荐</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {['gpt-4o', 'claude-3.5-sonnet', 'deepseek-chat'].map((id) => (
              <a 
                key={id}
                href={`/models/${id}`}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                    {id.charAt(0).toUpperCase()}
                  </div>
                  <div className="font-medium">{id}</div>
                </div>
                <p className="text-sm text-slate-400">点击查看详情 →</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
