'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { 
  Compass, 
  Database, 
  Brain, 
  Zap, 
  ChevronRight,
  Github,
  Twitter,
  Sparkles,
  Terminal,
  Globe,
  Cpu
} from 'lucide-react';
import ModelCard from '@/components/ModelCard';
import RecommendForm from '@/components/RecommendForm';

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

// 渐变文字组件
const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

// 发光按钮组件
const GlowButton = ({ 
  children, 
  variant = 'primary',
  onClick 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
      ${variant === 'primary' 
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50' 
        : 'bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10'}
    `}
  >
    {children}
  </button>
);

// 特性卡片组件
const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="group relative p-8 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
    {/* 发光边框效果 */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center mb-6 group-hover:from-cyan-500/30 group-hover:to-purple-600/30 transition-all">
        <Icon className="w-7 h-7 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-100 mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecommend, setShowRecommend] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models');
      const data = await res.json();
      if (data.success) {
        setModels(data.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        
        {/* 网格线 */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* 动态光晕 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ModelCompass
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors">特性</a>
            <a href="#models" className="text-slate-400 hover:text-cyan-400 transition-colors">模型库</a>
            <a href="/admin" className="text-slate-400 hover:text-cyan-400 transition-colors">管理后台</a>
            <a 
              href="https://github.com/dukaworks/modelcompass" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/50 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">已收录 393+ 个 AI 模型</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in">
              在 AI 模型的
              <br />
              <GradientText className="font-extrabold">星辰大海</GradientText>中
              <br />
              为你导航
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              ModelCompass 帮你找到最适合的大模型，基于场景智能推荐，
              让每一次 API 调用都物超所值
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <GlowButton onClick={() => setShowRecommend(!showRecommend)}>
                <Brain className="w-5 h-5 inline mr-2" />
                智能选型
              </GlowButton>
              <GlowButton variant="secondary">
                <Terminal className="w-5 h-5 inline mr-2" />
                查看 API 文档
              </GlowButton>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">393+</div>
                <div className="text-sm text-slate-500">收录模型</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">60+</div>
                <div className="text-sm text-slate-500">提供商</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">24/7</div>
                <div className="text-sm text-slate-500">实时更新</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText>核心特性</GradientText>
            </h2>
            <p className="text-slate-400 text-lg">全方位的模型评估与推荐系统</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Database}
              title="模型画像库"
              description="详细的性能数据、能力标签、性价比分析，帮你全面了解每个模型的特点"
            />
            <FeatureCard
              icon={Brain}
              title="智能推荐"
              description="基于场景自动匹配最优模型组合，无需繁琐的对比测试"
            />
            <FeatureCard
              icon={Globe}
              title="统一 API"
              description="一个接口调用全球顶级模型，简化开发流程，降低接入成本"
            />
          </div>
        </div>
      </section>

      {/* Recommend Section */}
      {showRecommend && (
        <section className="relative z-10 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <RecommendForm />
          </div>
        </section>
      )}

      {/* Models Section */}
      <section id="models" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                <GradientText>热门模型</GradientText>
              </h2>
              <p className="text-slate-400">精选高性能大语言模型</p>
            </div>
            <a 
              href="/models" 
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>查看全部</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-slate-400">加载中...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {models.map((model, index) => (
                <div 
                  key={model.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ModelCard model={model} darkMode />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-slate-900/80 to-indigo-950/80 border border-slate-800 backdrop-blur-sm overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <Cpu className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                准备好探索 AI 模型世界了吗？
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                加入 ModelCompass，让模型选择变得简单高效
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GlowButton>
                  <Zap className="w-5 h-5 inline mr-2" />
                  立即开始
                </GlowButton>
                <GlowButton variant="secondary">
                  <Github className="w-5 h-5 inline mr-2" />
                  查看源码
                </GlowButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Compass className="w-6 h-6 text-cyan-400" />
              <span className="font-semibold text-slate-300">ModelCompass</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-500">
              <a href="https://github.com/dukaworks/modelcompass" className="hover:text-cyan-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-slate-600 text-sm">
            © 2024 ModelCompass. Made with 🦞 by Duka & 小龙虾
          </div>
        </div>
      </footer>
    </main>
  );
}
