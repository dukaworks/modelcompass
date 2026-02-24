'use client';

import { useState } from 'react';
import { CreditCard, Plus, History, Wallet, Compass, User, Key, Heart, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { icon: User, label: '个人资料', href: '/profile' },
  { icon: Key, label: 'API Keys', href: '/keys' },
  { icon: CreditCard, label: '充值 / 账单', href: '/billing', active: true },
  { icon: Heart, label: '我的收藏', href: '/favorites' },
  { icon: Settings, label: '账号设置', href: '/settings' },
];

export default function BillingPage() {
  const [balance] = useState(125.50);
  const [activeTab, setActiveTab] = useState<'recharge' | 'history'>('recharge');
  const [selectedAmount, setSelectedAmount] = useState(100);

  const transactions = [
    { id: 1, type: 'recharge', amount: 100, date: '2024-01-20', desc: '支付宝充值' },
    { id: 2, type: 'usage', amount: -12.5, date: '2024-01-19', desc: 'GPT-4o API 调用' },
    { id: 3, type: 'usage', amount: -5.2, date: '2024-01-18', desc: 'Claude 3.5 API 调用' },
  ];

  const rechargeOptions = [50, 100, 200, 500];
  const user = { name: 'Duka', email: 'duka@example.com' };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <header className="border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">ModelCompass</a>
          <a href="/" className="text-sm text-slate-400 hover:text-cyan-400">返回首页 →</a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sticky top-24">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-medium">{user.name.charAt(0)}</div>
                <div><div className="font-medium">{user.name}</div><div className="text-sm text-slate-500">{user.email}</div></div>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a key={item.href} href={item.href} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${item.active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                      <Icon className="w-5 h-5" /><span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <a href="/logout" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" /><span>退出登录</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">账户余额</p>
                  <p className="text-4xl font-bold text-cyan-400">¥{balance.toFixed(2)}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <button onClick={() => setActiveTab('recharge')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'recharge' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                <Plus className="w-4 h-4" /><span>充值</span>
              </button>
              <button onClick={() => setActiveTab('history')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'history' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                <History className="w-4 h-4" /><span>账单记录</span>
              </button>
            </div>

            {/* Recharge Tab */}
            {activeTab === 'recharge' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">选择充值金额</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {rechargeOptions.map((amount) => (
                    <button key={amount} onClick={() => setSelectedAmount(amount)} className={`p-4 rounded-xl border transition-all ${selectedAmount === amount ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                      <p className="text-2xl font-bold">¥{amount}</p>
                      {amount >= 100 && <p className="text-sm text-green-400 mt-1">赠 ¥{Math.floor(amount * 0.1)}</p>}
                    </button>
                  ))}
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                  立即充值 ¥{selectedAmount}
                </button>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">账单记录</h2>
                <div className="space-y-3">
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'recharge' ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                          {t.type === 'recharge' ? <Plus className="w-5 h-5 text-green-400" /> : <Minus className="w-5 h-5 text-amber-400" />}
                        </div>
                        <div>
                          <p className="font-medium">{t.desc}</p>
                          <p className="text-sm text-slate-500">{t.date}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${t.amount > 0 ? 'text-green-400' : 'text-slate-300'}`}>
                        {t.amount > 0 ? '+' : ''}{t.amount}元
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
