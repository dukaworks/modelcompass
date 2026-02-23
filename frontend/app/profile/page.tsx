'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  Activity,
  Edit3,
  Key,
  Heart,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { icon: User, label: '个人资料', href: '/profile', active: true },
  { icon: Key, label: 'API Keys', href: '/keys' },
  { icon: CreditCard, label: '充值 / 账单', href: '/billing' },
  { icon: Heart, label: '我的收藏', href: '/favorites' },
  { icon: Settings, label: '账号设置', href: '/settings' },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  // 模拟用户数据
  const user = {
    name: 'Duka',
    email: 'duka@example.com',
    avatar: null,
    joinDate: '2024-01-15',
    balance: 125.50,
    totalCalls: 15420,
    favoriteModels: 12,
    apiKeys: 3,
  };

  const stats = [
    { label: '账户余额', value: `¥${user.balance}`, color: 'text-cyan-400', icon: CreditCard },
    { label: '总调用次数', value: user.totalCalls.toLocaleString(), color: 'text-purple-400', icon: Activity },
    { label: '收藏模型', value: user.favoriteModels, color: 'text-pink-400', icon: Heart },
    { label: 'API Keys', value: user.apiKeys, color: 'text-green-400', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ModelCompass
            </span>
          </a>
          <a href="/" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
            返回首页 →
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 sticky top-24">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                        ${item.active 
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <a
                  href="/logout"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>退出登录</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Profile Info */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">个人资料</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? '保存' : '编辑'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-medium text-white">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-medium">{user.name}</div>
                    <div className="text-slate-400">{user.email}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <label className="text-sm text-slate-500">用户名</label>
                    <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800/50 rounded-lg">
                      <User className="w-4 h-4 text-slate-500" />
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-slate-500">邮箱</label>
                    <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800/50 rounded-lg">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-slate-500">注册时间</label>
                    <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800/50 rounded-lg">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>{user.joinDate}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-slate-500">账户状态</label>
                    <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-green-400">正常</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">最近活动</h2>
              <div className="space-y-3">
                {[
                  { action: '调用 API', model: 'GPT-4o', time: '2分钟前', cost: '¥0.05' },
                  { action: '收藏模型', model: 'Claude 3.5 Sonnet', time: '1小时前', cost: null },
                  { action: '充值', model: null, time: '2小时前', cost: '+¥100.00' },
                  { action: '生成 API Key', model: null, time: '1天前', cost: null },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.action}</div>
                        {item.model && <div className="text-xs text-slate-500">{item.model}</div>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">{item.time}</div>
                      {item.cost && (
                        <div className={`text-sm ${item.cost.startsWith('+') ? 'text-green-400' : 'text-slate-300'}`}>
                          {item.cost}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
