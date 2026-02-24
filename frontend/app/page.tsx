'use client';

import { useState, useEffect } from 'react';
import { 
  Compass, 
  Database, 
  Brain, 
  Zap, 
  ChevronRight,
  Sparkles,
  Globe,
  Cpu,
  Search,
  TrendingUp,
  Terminal
} from 'lucide-react';
import ModelCard from '@/components/ModelCard';
import SearchBox from '@/components/SearchBox';
import RealtimeStats from '@/components/RealtimeStats';
import DeveloperSection from '@/components/DeveloperSection';
import UserMenu from '@/components/UserMenu';

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

const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

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
      relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
      ${variant === 'primary' 
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50' 
        : 'bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400'}
    `}
  >
    {children}
  </button>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="group relative p-6 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-purple-600/30 transition-all">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const QuickFilter = ({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) => (
  <button className={`
    flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all
    ${active 
      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
      : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-slate-300'}
  `}>
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  // 模拟登录状态（后续接真实登录）
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'Duka',
    email: 'duka@example.com',
    balance: 125.50
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models?limit=8');
      const data = await res.json();
      if (data.success) {
        setModels(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    console.log('搜索:', query);
    // TODO: 实现搜索跳转
  };

  const handleLogin = () => {
    // 模拟登录
    setIsLoggedIn(true);
    window.location.href = '/login';
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] text-slate-100 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ModelCompass
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/api-service" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">申请API</a>
            <a href="/market" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">模型市场</a>
            <a href="/chat" className="text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors">AI匹配</a>
            <a href="/docs" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">文档</a>
            <UserMenu 
              isLoggedIn={isLoggedIn} 
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">已收录 393+ 个 AI 模型</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 leading-tight">
            在 AI 模型的<GradientText>星辰大海</GradientText>中
            <br />为你指点迷津
          </h1>
          <p className="text-lg text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            智能推荐、价格对比、性能评测，自动帮你匹配最适合的大模型
          </p>

          {/* Search Box */}
          <div className="mb-6">
            <SearchBox onSearch={handleSearch} />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <QuickFilter icon={Zap} label="⚡ 免费模型" />
            <QuickFilter icon={TrendingUp} label="🔥 热门" active />
            <QuickFilter icon={Sparkles} label="✨ 最新" />
            <QuickFilter icon={Terminal} label="👨‍💻 代码专用" />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">393+</div>
              <div className="text-xs text-slate-500">收录模型</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">60+</div>
              <div className="text-xs text-slate-500">提供商</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">24/7</div>
              <div className="text-xs text-slate-500">实时更新</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              <GradientText>核心特性</GradientText>
            </h2>
            <p className="text-slate-400">全方位的模型评估与推荐系统</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Database}
              title="模型画像库"
              description="社区共建的模型百科全书，众包评测与Wiki互动"
            />
            <FeatureCard
              icon={Brain}
              title="智能推荐"
              description="基于场景自动匹配最优模型组合"
            />
            <FeatureCard
              icon={Globe}
              title="统一 API"
              description="一个接口调用全球顶级模型"
            />
          </div>
        </div>
      </section>

      {/* Realtime Stats */}
      <section className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <RealtimeStats />
            <DeveloperSection />
          </div>
        </div>
      </section>

      {/* Popular Models */}
      <section id="models" className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                <GradientText>热门模型</GradientText>
              </h2>
              <p className="text-sm text-slate-400">社区调用最多的模型</p>
            </div>
            <a href="/models" className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm">
              <span>查看全部</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} darkMode />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-indigo-950/80 border border-slate-800 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            
            <Cpu className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">准备好探索 AI 模型世界了吗？</h2>
            <p className="text-slate-400 mb-6">加入 ModelCompass，让模型选择变得简单高效</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <GlowButton>
                <Zap className="w-4 h-4 inline mr-2" />
                立即开始
              </GlowButton>
              <GlowButton variant="secondary">
                查看文档
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="font-medium text-slate-300">ModelCompass</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <a href="https://github.com/dukaworks/modelcompass" className="hover:text-cyan-400 transition-colors">
                GitHub
              </a>
              <span className="text-slate-700">|</span>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Twitter
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-slate-600 text-sm">
            © 2024 ModelCompass. Made with 🦞 by Duka & 小龙虾
          </div>
        </div>
      </footer>
    </main>
  );
}
