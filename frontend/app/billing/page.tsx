'use client';

import { useState } from 'react';
import { CreditCard, Wallet, History, User, Key, Heart, Settings, LogOut, Plus, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';

const menuItems = [
  { icon: User, label: '个人资料', href: '/profile' },
  { icon: Key, label: 'API Keys', href: '/keys' },
  { icon: CreditCard, label: '充值 / 账单', href: '/billing', active: true },
  { icon: Heart, label: '我的收藏', href: '/favorites' },
  { icon: Settings, label: '账号设置', href: '/settings' },
];

const mockTransactions = [
  { id: '1', type: '充值', amount: 100, date: '2024-01-20', status: '成功' },
  { id: '2', type: '调用', amount: -2.5, date: '2024-01-19', status: '已扣费' },
  { id: '3', type: '调用', amount: -0.19, date: '2024-01-18', status: '已扣费' },
  { id: '4', type: '充值', amount: 50, date: '2024-01-15', status: '成功' },
];

export default function BillingPage() {
  const [balance, setBalance] = useState(125.50);
  const [amount, setAmount] = useState('');
  const user = { name: 'Duka', email: 'duka@example.com' };

  const handleRecharge = () => {
    const num = parseFloat(amount);
    if (num > 0) {
      setBalance(balance + num);
      setAmount('');
      alert(`充值 ¥${num} 成功！（模拟）`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sticky top-24">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                </div>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a key={item.href} href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                        item.active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}>
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <a href="/logout" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span>退出登录</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 mb-1">账户余额</p>
                  <div className="text-4xl font-bold text-cyan-400">¥{balance.toFixed(2)}</div>
                </div>
                <Wallet className="w-12 h-12 text-cyan-400/30" />
              </div>
            </div>

            {/* Recharge */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-400" />
                <span>快速充值</span>
              </h2>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="输入金额"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100"
                />
                <button
                  onClick={handleRecharge}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  充值
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                {['50', '100', '200', '500'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg text-sm transition-colors"
                  >
                    ¥{v}
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <History className="w-5 h-5 text-purple-400" />
                <span>交易记录</span>
              </h2>
              <div className="space-y-3">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === '充值' ? 'bg-green-500/20' : 'bg-slate-800'
                      }`}>
                        {tx.type === '充值' ? (
                          <Plus className="w-4 h-4 text-green-400" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{tx.type}</div>
                        <div className="text-sm text-slate-500">{tx.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${tx.amount > 0 ? 'text-green-400' : 'text-slate-300'}`}>
                        {tx.amount > 0 ? '+' : ''}¥{Math.abs(tx.amount)}
                      </div>
                      <div className="text-sm text-slate-500">{tx.status}</div>
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
