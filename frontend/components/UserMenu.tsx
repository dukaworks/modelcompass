'use client';

import { useState } from 'react';
import { User, Settings, CreditCard, Key, Heart, LogOut, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    balance: number;
  };
  onLogin: () => void;
  onLogout: () => void;
}

export default function UserMenu({ isLoggedIn, user, onLogin, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center space-x-3">
        <button 
          onClick={onLogin}
          className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          登录
        </button>
        <button 
          onClick={onLogin}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          注册
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 hover:bg-slate-800/50 rounded-lg px-3 py-2 transition-colors"
      >
        {/* 余额显示 */}
        <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700">
          <span className="text-xs text-slate-400">余额</span>
          <span className="text-sm font-medium text-cyan-400">¥{user?.balance.toFixed(2)}</span>
        </div>
        
        {/* 头像 */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
          ) : (
            user?.name.charAt(0).toUpperCase()
          )}
        </div>
        
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-xl shadow-xl shadow-black/50 z-50 overflow-hidden">
            {/* 用户信息 */}
            <div className="px-4 py-3 border-b border-slate-800">
              <div className="font-medium text-slate-100">{user?.name}</div>
              <div className="text-sm text-slate-500">{user?.email}</div>
            </div>
            
            {/* 菜单项 */}
            <div className="py-2">
              <a href="/profile" className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                <User className="w-4 h-4" />
                <span>个人中心</span>
              </a>
              <a href="/keys" className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                <Key className="w-4 h-4" />
                <span>API Keys</span>
              </a>
              <a href="/billing" className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                <CreditCard className="w-4 h-4" />
                <span>充值 / 账单</span>
              </a>
              <a href="/favorites" className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                <Heart className="w-4 h-4" />
                <span>我的收藏</span>
              </a>
              <a href="/settings" className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                <Settings className="w-4 h-4" />
                <span>设置</span>
              </a>
            </div>
            
            {/* 退出 */}
            <div className="border-t border-slate-800 py-2">
              <button 
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
