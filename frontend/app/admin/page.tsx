'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Play, 
  Pause, 
  RefreshCw, 
  Terminal,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TaskStatus {
  name: string;
  isRunning: boolean;
  lastRun?: string;
  interval: number;
  nextRun: string;
}

interface Stats {
  totalModels: number;
  activeModels: number;
  providers: { name: string; count: number }[];
}

export default function AdminPage() {
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'logs'>('overview');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // 获取任务状态
      const tasksRes = await fetch('/api/admin/heartbeat/status');
      const tasksData = await tasksRes.json();
      if (tasksData.success) {
        const taskList = Object.entries(tasksData.data.tasks).map(([name, info]: [string, any]) => ({
          name,
          ...info
        }));
        setTasks(taskList);
      }

      // 获取统计
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerTask = async (taskName: string) => {
    try {
      const res = await fetch(`/api/admin/heartbeat/trigger/${taskName}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        addLog(`✅ 手动触发任务: ${taskName}`);
        fetchData();
      } else {
        addLog(`❌ 触发失败: ${data.error}`);
      }
    } catch (error: any) {
      addLog(`❌ 错误: ${error.message}`);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100));
  };

  const formatDuration = (ms: number) => {
    if (ms < 60000) return `${Math.floor(ms / 1000)}秒`;
    if (ms < 3600000) return `${Math.floor(ms / 60000)}分钟`;
    return `${Math.floor(ms / 3600000)}小时`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p>加载管理面板...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">管理后台</h1>
          </div>
          <a href="/" className="text-gray-600 hover:text-gray-900">
            返回首页 →
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'overview'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            总览
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'tasks'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            定时任务
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'logs'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Terminal className="w-4 h-4 inline mr-2" />
            运行日志
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总模型数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalModels || 0}</p>
                </div>
                <Database className="w-12 h-12 text-primary-100" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">活跃模型</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.activeModels || 0}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-100" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">定时任务</p>
                  <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
                </div>
                <Clock className="w-12 h-12 text-blue-100" />
              </div>
            </div>

            {/* Providers */}
            <div className="md:col-span-3 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">提供商分布</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats?.providers.map((provider) => (
                  <div key={provider.name} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">{provider.name}</p>
                    <p className="text-xl font-semibold">{provider.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">定时任务状态</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <div key={task.name} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {task.isRunning ? (
                      <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{task.name}</p>
                      <p className="text-sm text-gray-500">
                        间隔: {formatDuration(task.interval)} | 
                        下次运行: {task.nextRun}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerTask(task.name)}
                    disabled={task.isRunning}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Play className="w-4 h-4 inline mr-1" />
                    立即执行
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-gray-900 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Terminal className="w-5 h-5 mr-2" />
                运行日志
              </h3>
              <button
                onClick={() => setLogs([])}
                className="text-sm text-gray-400 hover:text-white"
              >
                清空日志
              </button>
            </div>
            <div className="p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500">暂无日志...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log.includes('❌') ? (
                      <span className="text-red-400">{log}</span>
                    ) : log.includes('✅') ? (
                      <span className="text-green-400">{log}</span>
                    ) : (
                      <span className="text-gray-300">{log}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
