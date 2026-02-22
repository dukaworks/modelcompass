'use client';

import { useState, useEffect } from 'react';
import { Compass, Zap, Database, Brain, ChevronRight } from 'lucide-react';
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
        setModels(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-8 h-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">ModelCompass</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">模型库</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">智能推荐</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">API文档</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              在AI模型的海洋中
              <br />
              为你导航
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              ModelCompass帮你找到最适合的大模型，基于场景智能推荐，
              <br />
              让每一次API调用都物超所值
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowRecommend(!showRecommend)}
                className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center"
              >
                <Brain className="w-5 h-5 mr-2" />
                智能选型
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                浏览模型库
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">模型画像库</h3>
              <p className="text-gray-600">详细的性能数据、能力标签、性价比分析</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">智能推荐</h3>
              <p className="text-gray-600">基于场景自动匹配最优模型组合</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">统一API</h3>
              <p className="text-gray-600">一个接口调用全球顶级模型</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommend Form */}
      {showRecommend && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <RecommendForm />
          </div>
        </section>
      )}

      {/* Models Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">热门模型</h2>
            <a href="#" className="text-primary-600 hover:text-primary-700 flex items-center">
              查看全部 <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {loading ? (
            <div className="text-center py-12">加载中...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 ModelCompass. Made with 🦞 by Duka & 小龙虾</p>
        </div>
      </footer>
    </main>
  );
}
