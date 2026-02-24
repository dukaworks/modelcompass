'use client';

import { useState, useEffect } from 'react';
import { Compass, Menu, X, ChevronDown } from 'lucide-react';

// 检查登录状态
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setUser({
          name: localStorage.getItem('userName') || 'User',
          email: localStorage.getItem('userEmail') || 'user@example.com',
          balance: parseFloat(localStorage.getItem('userBalance') || '125.50'),
        });
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return { isLoggedIn, user };
};

interface HeaderProps {
  activePage?: string;
}

export default function Header({ activePage = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  const navItems = [
    { href: '/api-service', label: '申请API', id: 'api-service' },
    { href: '/market', label: '模型广场', id: 'market' },
    { href: '/chat', label: 'AI匹配', id: 'chat', highlight: true },
    { href: '/docs', label: '文档', id: 'docs' },
  ];

  const userMenuItems = [
    { href: '/profile', label: '个人中心' },
    { href: '/keys', label: 'API Keys' },
    { href: '/billing', label: '充值/账单' },
    { href: '/favorites', label: '我的收藏' },
    { href: '/settings', label: '设置' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userBalance');
    window.location.href = '/';
  };

  return (
    <header className="border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a0f]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            ModelCompass
          </span>
        </a>

        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                item.highlight
                  ? 'relative bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-600/30'
                  : activePage === item.id
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50'
              }`}
            >
              {item.label}
              {item.highlight && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </a>
          ))}

          {isLoggedIn ? (
            <div className="relative ml-2">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg hover:border-cyan-500/30 transition-all"
              >
                <div className="hidden sm:flex items-center space-x-2 px-2 py-1 bg-slate-800 rounded-full">
                  <span className="text-xs text-slate-400">余额</span>
                  <span className="text-sm font-medium text-cyan-400">¥{user?.balance?.toFixed(2)}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="font-medium text-slate-100">{user?.name}</p>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {userMenuItems.map((item) => (
                        <a key={item.href} href={item.href} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                          {item.label}
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-slate-800 py-1">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                        退出登录
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <a href="/login" className="ml-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              登录
            </a>
          )}
        </nav>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-cyan-400 transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/60 bg-[#0a0a0f]/95">
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <a key={item.id} href={item.href} className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                item.highlight ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30' : activePage === item.id ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50'
              }`}>
                {item.label}
              </a>
            ))}
            
            {isLoggedIn ? (
              <>
                <div className="border-t border-slate-800 my-2" />
                {userMenuItems.map((item) => (
                  <a key={item.href} href={item.href} className="block px-4 py-3 text-base text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                    {item.label}
                  </a>
                ))}
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-base text-red-400 hover:bg-slate-800 transition-colors">
                  退出登录
                </button>
              </>
            ) : (
              <a href="/login" className="block px-4 py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center font-medium rounded-lg">
                登录
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
