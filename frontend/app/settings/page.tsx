'use client';

import { useState } from 'react';
import { Settings, User, Key, CreditCard, Heart, LogOut, Bell, Shield, Save, Check } from 'lucide-react';
import Header from '@/components/Header';

const menuItems = [
  { icon: User, label: '个人资料', href: '/profile' },
  { icon: Key, label: 'API Keys', href: '/keys' },
  { icon: CreditCard, label: '充值 / 账单', href: '/billing' },
  { icon: Heart, label: '我的收藏', href: '/favorites' },
  { icon: Settings, label: '账号设置', href: '/settings', active: true },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    username: 'Duka',
    email: 'duka@example.com',
    notifications: true,
    marketingEmails: false,
    twoFactor: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const user = { name: 'Duka', email: 'duka@example.com' };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
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

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6">账号信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">用户名</label>
                  <input type="text" value={settings.username} onChange={(e) => setSettings({...settings, username: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">邮箱</label>
                  <input type="email" value={settings.email} disabled className="w-full px-4 py-3 bg-slate-800/30 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Bell className="w-5 h-5 text-purple-400" />
                <span>通知设置</span>
              </h2>
              {['notifications', 'marketingEmails'].map((key) => (
                <div key={key} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{key === 'notifications' ? '启用通知' : '营销邮件'}</div>
                    <div className="text-sm text-slate-500">{key === 'notifications' ? '接收重要更新' : '接收优惠信息'}</div>
                  </div>
                  <button onClick={() => setSettings({...settings, [key]: !settings[key as keyof typeof settings]})} className={`w-12 h-6 rounded-full transition-colors relative ${settings[key as keyof typeof settings] ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[key as keyof typeof settings] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>安全设置</span>
              </h2>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">两步验证</div>
                  <div className="text-sm text-slate-500">增强账户安全性</div>
                </div>
                <button onClick={() => setSettings({...settings, twoFactor: !settings.twoFactor})} className={`w-12 h-6 rounded-full transition-colors relative ${settings.twoFactor ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.twoFactor ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <button className="text-cyan-400 hover:underline text-sm">修改密码</button>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleSave} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl transition-all">
                {saved ? <><Check className="w-4 h-4" /><span>已保存</span></> : <><Save className="w-4 h-4" /><span>保存设置</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
