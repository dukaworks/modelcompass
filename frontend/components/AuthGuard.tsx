'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

// 模拟登录状态检查
const checkAuth = () => {
  // TODO: 实际项目中这里检查 localStorage/cookie/token
  if (typeof window !== 'undefined') {
    // 暂时从 URL 参数判断（演示用）
    const params = new URLSearchParams(window.location.search);
    return params.get('demo') === 'loggedin' || localStorage.getItem('isLoggedIn') === 'true';
  }
  return false;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = checkAuth();
    setIsLoggedIn(auth);
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">需要登录</h2>
          <p className="text-slate-400 mb-6">
            此功能需要登录后才能使用。登录后即可获得 API Key，开始使用我们的服务。
          </p>
          <div className="space-y-3">
            <a
              href="/login"
              className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              <span>立即登录</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/"
              className="block w-full py-3 text-slate-400 hover:text-slate-300 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
