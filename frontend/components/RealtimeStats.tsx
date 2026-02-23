'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Users, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsData {
  todayCalls: number;
  activeUsers: number;
  onlineModels: number;
  topModels: { name: string; count: number; percent: number; trend: 'up' | 'down' }[];
}

export default function RealtimeStats() {
  const [stats, setStats] = useState<StatsData>({
    todayCalls: 12847,
    activeUsers: 1234,
    onlineModels: 393,
    topModels: [
      { name: 'GPT-4o', count: 5847, percent: 45, trend: 'up' },
      { name: 'Claude 3.5 Sonnet', count: 4156, percent: 32, trend: 'up' },
      { name: 'DeepSeek-V3', count: 2334, percent: 18, trend: 'down' },
      { name: 'Qwen 2.5-72B', count: 656, percent: 5, trend: 'up' },
    ]
  });

  // 模拟实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayCalls: prev.todayCalls + Math.floor(Math.random() * 10),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + '万';
    return num.toLocaleString();
  };

  return (
    <div className="relative bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-100">实时数据</h3>
        </div>
        <div className="flex items-center space-x-1 text-sm text-slate-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center justify-center space-x-1 text-cyan-400 mb-1">
            <Zap className="w-4 h-4" />
            <ArrowUpRight className="w-3 h-3" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{formatNumber(stats.todayCalls)}</div>
          <div className="text-sm text-slate-500">今日调用</div>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center justify-center space-x-1 text-purple-400 mb-1">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{formatNumber(stats.activeUsers)}</div>
          <div className="text-sm text-slate-500">活跃用户</div>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center justify-center space-x-1 text-green-400 mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.onlineModels}</div>
          <div className="text-sm text-slate-500">在线模型</div>
        </div>
      </div>

      {/* 热门模型排行 */}
      <div>
        <h4 className="text-sm font-medium text-slate-400 mb-4">🔥 模型调用排行</h4>
        <div className="space-y-3">
          {stats.topModels.map((model, index) => (
            <div key={model.name} className="flex items-center space-x-3">
              <span className="w-5 text-sm text-slate-500 font-mono">{index + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{model.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">{formatNumber(model.count)}</span>
                    {model.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                </div>
                {/* 进度条 */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${model.percent}%` }}
                  />
                </div>
              </div>
              <span className="w-10 text-right text-sm text-slate-500">{model.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
