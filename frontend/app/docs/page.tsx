'use client';

import { Book, Search, ArrowRight, Zap, Shield, Code, MessageSquare, CreditCard, HelpCircle, Mail } from 'lucide-react';
import Header from '@/components/Header';

const docSections = [
  {
    icon: Zap,
    title: '快速开始',
    desc: '5分钟上手 ModelCompass',
    href: '#quickstart',
    items: ['创建账户', '获取API Key', '发起第一次调用']
  },
  {
    icon: Code,
    title: 'API文档',
    desc: '完整的接口参考',
    href: '#api',
    items: ['认证方式', '模型列表', '聊天接口', '错误码']
  },
  {
    icon: MessageSquare,
    title: '模型指南',
    desc: '选择适合你的AI模型',
    href: '#models',
    items: ['模型对比', '定价说明', '上下文长度', '推荐场景']
  },
  {
    icon: CreditCard,
    title: '计费说明',
    desc: '透明的定价体系',
    href: '#pricing',
    items: ['按量计费', '充值方式', '余额查询', '发票申请']
  },
  {
    icon: Shield,
    title: '安全与隐私',
    desc: '数据安全保护措施',
    href: '#security',
    items: ['数据加密', '隐私政策', '合规认证', '最佳实践']
  },
  {
    icon: HelpCircle,
    title: '常见问题',
    desc: '解答你的疑惑',
    href: '#faq',
    items: ['接入问题', '性能优化', '故障排查', '联系支持']
  },
];

const quickLinks = [
  { title: 'API参考', href: '#api', desc: 'OpenAPI 兼容' },
  { title: 'SDK下载', href: '#sdk', desc: 'Python/JS/Go' },
  { title: '示例代码', href: '#examples', desc: '复制即用' },
  { title: '状态监控', href: '#status', desc: '服务健康度' },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <Header activePage="docs" />

      {/* Hero */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              帮助中心
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            从快速上手指南到详细API文档，帮助你快速集成和使用 ModelCompass
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="搜索文档..."
              className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">{link.title}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-slate-500">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Main Docs Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{section.desc}</p>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item}>
                      <a href={section.href} className="text-sm text-slate-300 hover:text-cyan-400 transition-colors flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Contact */}
        <div className="mt-12 p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl text-center">
          <h2 className="text-xl font-semibold mb-2">还有问题？</h2>
          <p className="text-slate-400 mb-4">我们的团队随时准备帮助你</p>
          <a href="mailto:chenzhy.bj@gmail.com" className="inline-flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors">
            <Mail className="w-5 h-5" />
            <span>联系支持</span>
          </a>
        </div>
      </div>
    </div>
  );
}
