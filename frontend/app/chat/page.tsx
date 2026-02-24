'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Lightbulb,
  ChevronRight,
  Star,
  Zap,
  Compass
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: ModelRecommendation[];
}

interface ModelRecommendation {
  id: string;
  name: string;
  provider: string;
  reason: string;
  score: number;
  price: number;
}

const initialRecommendations: ModelRecommendation[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', reason: '通用能力最强，适合复杂任务', score: 95, price: 2.5 },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'deepseek', reason: '推理能力强，性价比高', score: 92, price: 0.19 },
  { id: 'qwen-2.5', name: 'Qwen 2.5-72B', provider: 'alibaba', reason: '中文理解优秀', score: 89, price: 0.12 },
];

const quickPrompts = [
  "我需要处理大量中文法律文档",
  "帮我写一个Python爬虫程序",
  "分析这张图表数据并生成报告",
  "翻译这篇英文论文成中文",
  "为我创作一首现代诗",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是 ModelCompass AI 助手 🤖\n\n告诉我你的使用场景，例如：\n• 我需要处理大量中文法律文档\n• 帮我写一个Python爬虫程序\n• 分析数据并生成报告\n\n我会为你推荐最适合的 AI 模型！',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 模拟AI思考并推荐
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `理解您的需求了！基于「${input}」，我为您推荐以下模型：`,
        recommendations: initialRecommendations,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/60 backdrop-blur-md flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ModelCompass
            </span>
          </a>
          <div className="flex items-center space-x-4">
            <a href="/api-service" className="text-sm text-slate-400 hover:text-cyan-400 hidden sm:block">申请API</a>
            <a href="/market" className="text-sm text-slate-400 hover:text-cyan-400 hidden sm:block">模型市场</a>
            <a href="/login" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg">
              登录
            </a>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/60 hidden lg:flex flex-col bg-slate-900/30">
          <div className="p-4 border-b border-slate-800/60">
            <div className="flex items-center space-x-2 text-slate-400">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm">快速场景</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="w-full text-left p-3 rounded-lg bg-slate-800/50 text-sm text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-800/60">
            <div className="text-xs text-slate-500 text-center">
              💡 免费使用轻量级模型体验
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 ml-3' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-600 mr-3'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>

                  {/* Content */}
                  <div className={`rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-cyan-500/10 border border-cyan-500/20 text-slate-100'
                      : 'bg-slate-800/80 border border-slate-700 text-slate-200'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Recommendations */}
                    {message.recommendations && (
                      <div className="mt-4 space-y-3">
                        {message.recommendations.map((model) => (
                          <div key={model.id} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-slate-100">{model.name}</span>
                                <span className="text-xs text-slate-500">{model.provider}</span>
                                <div className="flex items-center space-x-1 text-amber-400">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span className="text-sm">{model.score}</span>
                                </div>
                              </div>
                              <span className="text-cyan-400 font-medium">¥{model.price}/M</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">{model.reason}</p>
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-cyan-500/10 text-cyan-400 text-sm rounded-lg hover:bg-cyan-500/20 transition-colors flex items-center justify-center space-x-1">
                                <Zap className="w-4 h-4" />
                                <span>在线测试</span>
                              </button>
                              <button className="flex-1 py-2 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors">
                                查看详情
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="text-center">
                          <a href="/market" className="inline-flex items-center space-x-1 text-sm text-cyan-400 hover:text-cyan-300">
                            <span>查看更多模型</span>
                            <ChevronRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-row">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mr-3">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-slate-400">正在分析您的需求...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800/60 p-4 bg-slate-900/30">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-end space-x-2 bg-slate-800/80 border border-slate-700 rounded-2xl p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="描述您的使用场景，例如：我需要处理大量中文法律文档..."
                  className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 resize-none outline-none min-h-[44px] max-h-32 py-2 px-3"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">
                AI 助手使用免费轻量级模型，仅用于场景理解和模型推荐
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
