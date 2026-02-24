'use client';

import { useState } from 'react';
import { 
  Key, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertCircle,
  Compass,
  User,
  CreditCard,
  Heart,
  Settings,
  LogOut
} from 'lucide-react';

const menuItems = [
  { icon: User, label: '个人资料', href: '/profile' },
  { icon: Key, label: 'API Keys', href: '/keys', active: true },
  { icon: CreditCard, label: '充值 / 账单', href: '/billing' },
  { icon: Heart, label: '我的收藏', href: '/favorites' },
  { icon: Settings, label: '账号设置', href: '/settings' },
];

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: '开发环境',
      key: 'sk-mc-xxxxxxxxxxxxxxxxxxxx',
      createdAt: '2024-01-20',
      lastUsed: '2小时前',
      status: 'active'
    },
    {
      id: '2',
      name: '生产环境',
      key: 'sk-mc-yyyyyyyyyyyyyyyyyyyy',
      createdAt: '2024-01-15',
      lastUsed: '5分钟前',
      status: 'active'
    }
  ]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: 'sk-mc-' + Math.random().toString(36).substring(2, 22),
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '从未',
      status: 'active'
    };
    
    setKeys([...keys, newKey]);
    setNewKeyName('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  const user = {
    name: 'Duka',
    email: 'duka@example.com',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ModelCompass
            </span>
          </a>
          <a href="/" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
            返回首页 →
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 sticky top-24">
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
                    <a
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                        ${item.active 
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <a
                  href="/logout"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>退出登录</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-semibold">API Keys</h1>
                  <p className="text-sm text-slate-400 mt-1">管理您的 API 访问密钥</p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>创建新密钥</span>
                </button>
              </div>

              {/* Create Key Form */}
              {isCreating && (
                <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <label className="block text-sm text-slate-400 mb-2">密钥名称</label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="例如：开发环境"
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                      onClick={handleCreateKey}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                    >
                      创建
                    </button>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-200">
                  <p className="font-medium mb-1">安全提醒</p>
                  <p className="text-amber-200/80">您的 API Keys 具有完全访问权限。请勿在客户端代码或公共仓库中暴露密钥。</p>
                </div>
              </div>

              {/* Keys List */}
              <div className="space-y-3">
                {keys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Key className="w-5 h-5 text-cyan-400" />
                        <span className="font-medium">{apiKey.name}</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          {apiKey.status === 'active' ? '生效中' : '已撤销'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(apiKey.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <code className="flex-1 px-3 py-2 bg-slate-900 rounded-lg text-sm font-mono text-slate-300">
                        {showKey === apiKey.id ? apiKey.key : apiKey.key.replace(/./g, '•')}
                      </code>
                      <button
                        onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      >
                        {showKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(apiKey.key, apiKey.id)}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      >
                        {copied === apiKey.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      <span>创建于 {apiKey.createdAt}</span>
                      <span>最后使用 {apiKey.lastUsed}</span>
                    </div>
                  </div>
                ))}
              </div>

              {keys.length === 0 && (
                <div className="text-center py-12">
                  <Key className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">暂无 API Keys</p>
                  <p className="text-sm text-slate-500 mt-1">创建您的第一个密钥开始使用</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
