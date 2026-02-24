'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  DollarSign, 
  Database,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Ban,
  Check
} from 'lucide-react';
import Header from '@/components/Header';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  apiCalls: number;
  status: 'active' | 'suspended';
  joinDate: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalApiCalls: number;
  modelsCount: number;
  onlineModels: number;
}

interface LogEntry {
  id: string;
  type: 'crawl' | 'api' | 'error' | 'user';
  message: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'models'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟数据加载
  useEffect(() => {
    // 模拟统计数据
    setStats({
      totalUsers: 156,
      activeUsers: 142,
      totalRevenue: 25890.50,
      totalApiCalls: 12567890,
      modelsCount: 394,
      onlineModels: 380
    });

    // 模拟用户数据
    setUsers([
      { id: '1', name: '张三', email: 'zhangsan@example.com', balance: 125.50, apiCalls: 15234, status: 'active', joinDate: '2024-01-15' },
      { id: '2', name: '李四', email: 'lisi@example.com', balance: 89.00, apiCalls: 8932, status: 'active', joinDate: '2024-01-20' },
      { id: '3', name: '王五', email: 'wangwu@example.com', balance: 0, apiCalls: 123, status: 'suspended', joinDate: '2024-02-01' },
      { id: '4', name: '赵六', email: 'zhaoliu@example.com', balance: 567.80, apiCalls: 45678, status: 'active', joinDate: '2023-12-10' },
      { id: '5', name: '钱七', email: 'qianqi@example.com', balance: 23.40, apiCalls: 3456, status: 'active', joinDate: '2024-02-15' },
    ]);

    // 模拟日志数据
    setLogs([
      { id: '1', type: 'crawl', message: 'OpenRouter 爬虫完成：更新 338 个模型', timestamp: '2026-02-24 20:14:44', status: 'success' },
      { id: '2', type: 'crawl', message: 'HuggingFace 爬虫完成：新增 100 个模型', timestamp: '2026-02-24 20:15:25', status: 'success' },
      { id: '3', type: 'api', message: 'API 调用量突增：每分钟 5000 次', timestamp: '2026-02-24 19:30:00', status: 'warning' },
      { id: '4', type: 'user', message: '新用户注册：user@example.com', timestamp: '2026-02-24 18:45:12', status: 'success' },
      { id: '5', type: 'error', message: '数据库连接超时', timestamp: '2026-02-24 17:20:33', status: 'error' },
    ]);

    setLoading(false);
  }, []);

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  const handleTriggerCrawl = async (source: string) => {
    try {
      const res = await fetch('/api/admin/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source })
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert('触发失败');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">管理后台</h1>
            <p className="text-slate-400">系统监控和用户管理</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => handleTriggerCrawl('openrouter')}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>更新 OpenRouter</span>
            </button>
            <button 
              onClick={() => handleTriggerCrawl('huggingface')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>更新 HuggingFace</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-900/60 border border-slate-800 rounded-xl p-1 mb-8">
          {[
            { id: 'overview', label: '概览', icon: Activity },
            { id: 'users', label: '用户管理', icon: Users },
            { id: 'logs', label: '系统日志', icon: Database },
            { id: 'models', label: '模型审核', icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="text-xs text-slate-400">+12 本月</span>
                </div>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-slate-400">总用户数</div>
                <div className="mt-2 text-xs text-green-400">{stats.activeUsers} 活跃用户</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs text-slate-400">+¥3,240 本月</span>
                </div>
                <div className="text-3xl font-bold">¥{stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-slate-400">总收入</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-xs text-slate-400">实时</span>
                </div>
                <div className="text-3xl font-bold">{(stats.totalApiCalls / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-slate-400">API 调用总数</div>
              </div>
            </div>

            {/* Model Stats */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">模型状态</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold">{stats.modelsCount}</div>
                  <div className="text-sm text-slate-400">收录模型</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-400">{stats.onlineModels}</div>
                  <div className="text-sm text-slate-400">在线可用</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-400">{stats.modelsCount - stats.onlineModels}</div>
                  <div className="text-sm text-slate-400">暂时离线</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold">60+</div>
                  <div className="text-sm text-slate-400">提供商</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">最近活动</h3>
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-green-400' :
                      log.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm">{log.message}</div>
                      <div className="text-xs text-slate-500">{log.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">用户管理</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="搜索用户..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                    <th className="pb-3 pl-4">用户</th>
                    <th className="pb-3">余额</th>
                    <th className="pb-3">API调用</th>
                    <th className="pb-3">状态</th>
                    <th className="pb-3">注册时间</th>
                    <th className="pb-3 pr-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800/50 last:border-0">
                      <td className="py-4 pl-4">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </td>
                      <td className="py-4">¥{user.balance.toFixed(2)}</td>
                      <td className="py-4">{user.apiCalls.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.status === 'active' ? '正常' : '已禁用'}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400">{user.joinDate}</td>
                      <td className="py-4 pr-4">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'active'
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-green-400 hover:bg-green-500/10'
                          }`}
                          title={user.status === 'active' ? '禁用用户' : '启用用户'}
                        >
                          {user.status === 'active' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">系统日志</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors">
                  全部
                </button>
                <button className="px-3 py-1.5 bg-slate-800/50 text-slate-400 text-sm rounded-lg hover:bg-slate-800 transition-colors">
                  成功
                </button>
                <button className="px-3 py-1.5 bg-slate-800/50 text-slate-400 text-sm rounded-lg hover:bg-slate-800 transition-colors">
                  错误
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    log.status === 'success' ? 'bg-green-500/20' :
                    log.status === 'warning' ? 'bg-amber-500/20' : 'bg-red-500/20'
                  }`}>
                    {log.status === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                     log.status === 'warning' ? <AlertCircle className="w-5 h-5 text-amber-400" /> :
                     <AlertCircle className="w-5 h-5 text-red-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{log.message}</div>
                    <div className="text-sm text-slate-500 flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                      <span className="px-2 py-0.5 bg-slate-700 rounded text-xs">{log.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Models Tab */}
        {activeTab === 'models' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">模型审核</h3>
            <p className="text-slate-400 mb-4">待审核的新抓取模型将显示在这里</p>
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-400">所有模型已审核通过</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
