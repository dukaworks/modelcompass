'use client';

import { useState } from 'react';
import { 
  Zap, 
  Globe, 
  Shield, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Terminal,
  Copy,
  Check,
  Compass
} from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

const pricingPlans = [
  {
    name: '免费体验',
    price: '¥0',
    description: '适合个人开发者体验',
    features: [
      '每月 1000 次免费调用',
      '接入 20+ 开源模型',
      '基础技术支持',
      '社区支持',
    ],
    cta: '免费开始',
    popular: false,
  },
  {
    name: '开发者版',
    price: '¥99',
    period: '/月',
    description: '适合中小项目',
    features: [
      '每月 50,000 次调用',
      '接入全部 393+ 模型',
      '优先技术支持',
      'API 调用分析',
      '自定义模型路由',
    ],
    cta: '立即升级',
    popular: true,
  },
  {
    name: '企业版',
    price: '定制',
    description: '适合大型企业',
    features: [
      '无限次调用',
      '私有化部署选项',
      '7x24 专属支持',
      'SLA 保障',
      '定制模型接入',
      '团队管理功能',
    ],
    cta: '联系我们',
    popular: false,
  },
];

const codeExample = `// 一个接口，调用全球模型
const response = await fetch('https://api.modelcompass.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o',  // 随时切换模型
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`;

function ApiServicePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <a href="/api-service" className="text-sm text-cyan-400 font-medium">申请API</a>
            <a href="/market" className="text-sm text-slate-400 hover:text-cyan-400">模型市场</a>
            <a href="/chat" className="text-sm text-slate-400 hover:text-cyan-400">AI匹配模型</a>
            <a href="/docs" className="text-sm text-slate-400 hover:text-cyan-400">文档</a>
            <a href="/login" className="text-sm text-slate-400 hover:text-cyan-400">登录</a>
            <a href="/login" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg">
              注册
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">一站式 AI API 服务</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            一个接口，调用
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              全球模型
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            标准化 API 接口，无需对接多个供应商。一次接入，无限模型。
          </p>

          {/* Code Block */}
          <div className="relative max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-xl p-6 text-left mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '已复制' : '复制'}</span>
              </button>
            </div>
            <pre className="text-sm text-slate-300 overflow-x-auto">
              <code>{codeExample}</code>
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/login" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              免费获取 API Key
            </a>
            <a href="/docs" className="px-8 py-4 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition-all">
              查看文档
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                <Globe className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-semibold mb-2">全球模型</h3>
              <p className="text-sm text-slate-400">接入 OpenAI、Anthropic、Google 等 60+ 供应商</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">高可用</h3>
              <p className="text-sm text-slate-400">99.9% SLA 保证，自动故障转移</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                <Clock className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="font-semibold mb-2">低延迟</h3>
              <p className="text-sm text-slate-400">全球节点部署，就近接入</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <Terminal className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">标准化</h3>
              <p className="text-sm text-slate-400">OpenAI 兼容接口，零成本迁移</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">简单透明的定价</h2>
            <p className="text-slate-400">按量计费，无隐藏费用</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border transition-all ${
                  plan.popular
                    ? 'border-cyan-500/50 bg-cyan-500/5'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium rounded-full">
                    最受欢迎
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-slate-500">{plan.period}</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/login"
                  className={`block w-full py-3 text-center font-medium rounded-xl transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-slate-400 mb-8">免费注册，立即获得 API Key，开始调用全球模型</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/login" className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              <span>免费开始</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-600 text-sm">
          © 2024 ModelCompass. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// 包装一层登录检查
export default function ApiServicePageWithAuth() {
  return (
    <AuthGuard>
      <ApiServicePage />
    </AuthGuard>
  );
}
