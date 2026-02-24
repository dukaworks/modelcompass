'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ExternalLink, User, Key, CreditCard, Settings, LogOut } from 'lucide-react';
import Header from '@/components/Header';

const menuItems = [
  { icon: User, label: '个人资料', href: '/profile' },
  { icon: Key, label: 'API Keys', href: '/keys' },
  { icon: CreditCard, label: '充值 / 账单', href: '/billing' },
  { icon: Heart, label: '我的收藏', href: '/favorites', active: true },
  { icon: Settings, label: '账号设置', href: '/settings' },
];

const mockFavorites = [
  { id: '1', name: 'GPT-4o', provider: 'OpenAI', tags: ['多模态', '最强'], price: 2.5 },
  { id: '2', name: 'DeepSeek-V3', provider: 'DeepSeek', tags: ['国产', 'MoE'], price: 0.19 },
  { id: '3', name: 'Claude 3.5', provider: 'Anthropic', tags: ['长上下文', '写作'], price: 3.0 },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!loggedIn) {
      router.push('/login');
      return;
    }
    setIsLoggedIn(true);
    setUser({
      name: localStorage.getItem('userName') || 'User',
      email: localStorage.getItem('userEmail') || 'user@example.com',
    });
  }, [router]);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <div className="lg:col-span-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h1 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Heart className="w-6 h-6 text-pink-400" />
                <span>我的收藏 ({favorites.length})</span>
              </h1>

              {favorites.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {favorites.map((model) => (
                    <div key={model.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-slate-100">{model.name}</h3>
                          <p className="text-sm text-slate-500">{model.provider}</p>
                        </div>
                        <button onClick={() => removeFavorite(model.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {model.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-medium">¥{model.price}/M</span>
                        <a href={`/market?model=${model.id}`} className="flex items-center space-x-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                          <span>查看</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">暂无收藏</p>
                  <a href="/market" className="text-cyan-400 hover:underline mt-2 inline-block">去发现模型</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
