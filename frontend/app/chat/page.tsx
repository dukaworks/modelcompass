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
  Compass,
  Code,
  Image as ImageIcon,
  Mic,
  Settings,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  recommendations?: ModelRecommendation[];
  codeBlocks?: CodeBlock[];
}

interface CodeBlock {
  language: string;
  code: string;
}

interface ModelRecommendation {
  id: string;
  name: string;
  provider: string;
  description: string;
  score: number;
  price: number;
  tags: string[];
  capabilities: string[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// 提取代码块
const extractCodeBlocks = (content: string): { text: string; blocks: CodeBlock[] } => {
  const blocks: CodeBlock[] = [];
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  let lastIndex = 0;
  let text = '';
  
  while ((match = codeRegex.exec(content)) !== null) {
    text += content.slice(lastIndex, match.index);
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    });
    text += `[CODE_BLOCK_${blocks.length - 1}]`;
    lastIndex = match.index + match[0].length;
  }
  text += content.slice(lastIndex);
  
  return { text, blocks };
};

// 模拟AI响应
const generateAIResponse = async (userMessage: string): Promise<string> => {
  // 这里后续对接真实AI API（Qwen-1.8B或其他）
  const responses = [
    `基于您的需求「${userMessage}」，我分析出以下关键点：\n\n1. **场景分析**：这属于${userMessage.includes('代码') ? '代码生成' : userMessage.includes('中文') ? '中文处理' : '通用对话'}场景\n2. **性能需求**：需要${userMessage.includes('大量') ? '高并发处理能力' : '稳定的响应速度'}\n3. **成本考量**：建议选择性价比较高的模型`,
    
    `理解您的需求！针对「${userMessage}」，我推荐以下模型：\n\n- **主要推荐**：适合核心任务处理\n- **备选方案**：性价比更高的选择\n- **高端选项**：预算充足时的最佳选择`,
    
    `分析完成！您的需求「${userMessage}」匹配以下模型特征：\n\n\`\`\`json\n{\n  "scene": "${userMessage.includes('文档') ? 'document_processing' : 'general_chat'}",\n  "language": "${userMessage.includes('中文') ? 'zh' : 'multilingual'}",\n  "complexity": "${userMessage.length > 20 ? 'high' : 'medium'}"\n}\n\`\`\`

推荐模型已为您准备好！`
  ];
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  return responses[Math.floor(Math.random() * responses.length)];
};

// 生成模型推荐
const generateRecommendations = (userMessage: string): ModelRecommendation[] => {
  const allModels: ModelRecommendation[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      description: '最新旗舰模型，多模态能力强，适合复杂任务',
      score: 95,
      price: 2.5,
      tags: ['多模态', '最强', '通用'],
      capabilities: ['chat', 'vision', 'code', 'analysis']
    },
    {
      id: 'deepseek-v3',
      name: 'DeepSeek-V3',
      provider: 'DeepSeek',
      description: '671B参数MoE架构，推理和代码能力突出，性价比极高',
      score: 92,
      price: 0.19,
      tags: ['国产', 'MoE', '推理强'],
      capabilities: ['chat', 'code', 'math', 'analysis']
    },
    {
      id: 'qwen-2.5-72b',
      name: 'Qwen2.5-72B',
      provider: '阿里云',
      description: '中文理解能力最强，开源可商用，适合中文场景',
      score: 89,
      price: 0.12,
      tags: ['中文', '开源', '免费商用'],
      capabilities: ['chat', 'chinese', 'analysis']
    },
    {
      id: 'claude-3.5',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      description: '200K超长上下文，写作和文档分析能力强',
      score: 91,
      price: 3.0,
      tags: ['长上下文', '写作', '安全'],
      capabilities: ['chat', 'writing', 'analysis', 'long-context']
    },
    {
      id: 'llama-3.1-405b',
      name: 'Llama 3.1 405B',
      provider: 'Meta',
      description: '405B参数开源最强，完全免费可商用',
      score: 88,
      price: 0,
      tags: ['开源', '免费', '405B'],
      capabilities: ['chat', 'code', 'analysis']
    }
  ];
  
  // 根据用户需求智能排序
  let sorted = [...allModels];
  
  if (userMessage.includes('中文') || userMessage.includes('中文')) {
    sorted = sorted.sort((a, b) => 
      (a.tags.includes('中文') ? -1 : 0) - (b.tags.includes('中文') ? -1 : 0)
    );
  }
  
  if (userMessage.includes('代码') || userMessage.includes('编程')) {
    sorted = sorted.sort((a, b) => 
      (a.capabilities.includes('code') ? -1 : 0) - (b.capabilities.includes('code') ? -1 : 0)
    );
  }
  
  if (userMessage.includes('便宜') || userMessage.includes('免费') || userMessage.includes('性价比')) {
    sorted = sorted.sort((a, b) => a.price - b.price);
  }
  
  return sorted.slice(0, 3);
};

const quickPrompts = [
  { icon: Code, text: "帮我写一个Python爬虫程序" },
  { icon: ImageIcon, text: "分析这张图表数据并生成报告" },
  { icon: Mic, text: "翻译这篇英文论文成中文" },
  { icon: Sparkles, text: "为我创作一首现代诗" },
  { icon: Zap, text: "处理大量中文法律文档" },
];

// 代码块组件
const CodeBlockComponent = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="my-3 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// 消息内容组件（支持代码高亮）
const MessageContent = ({ content, codeBlocks }: { content: string; codeBlocks?: CodeBlock[] }) => {
  if (!codeBlocks || codeBlocks.length === 0) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }
  
  const parts = content.split(/(\[CODE_BLOCK_\d+\])/);
  
  return (
    <div>
      {parts.map((part, index) => {
        const match = part.match(/\[CODE_BLOCK_(\d+)\]/);
        if (match) {
          const blockIndex = parseInt(match[1]);
          const block = codeBlocks[blockIndex];
          return <CodeBlockComponent key={index} code={block.code} language={block.language} />;
        }
        return part ? <span key={index} className="whitespace-pre-wrap">{part}</span> : null;
      })}
    </div>
  );
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'default',
      title: '新对话',
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: '你好！我是 ModelCompass AI 助手 🤖\n\n告诉我你的使用场景，例如：\n• 我需要处理大量中文法律文档\n• 帮我写一个Python爬虫程序\n• 分析数据并生成报告\n\n我会为你推荐最适合的 AI 模型！',
          timestamp: new Date(),
        }
      ],
      createdAt: new Date(),
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState('default');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

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
      timestamp: new Date(),
    };

    // 更新对话
    const updatedConversations = conversations.map(c => 
      c.id === activeConversationId 
        ? { ...c, messages: [...c.messages, userMessage] }
        : c
    );
    setConversations(updatedConversations);
    setInput('');
    setIsLoading(true);

    try {
      // 生成AI响应
      const aiContent = await generateAIResponse(input);
      const { text, blocks } = extractCodeBlocks(aiContent);
      const recommendations = generateRecommendations(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        recommendations,
        codeBlocks: blocks,
      };

      setConversations(prev => prev.map(c => 
        c.id === activeConversationId 
          ? { ...c, messages: [...c.messages, assistantMessage] }
          : c
      ));
    } catch (error) {
      console.error('AI响应错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (text: string) => {
    setInput(text);
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: '你好！我是 ModelCompass AI 助手 🤖\n\n告诉我你的使用场景，我会为你推荐最适合的 AI 模型！',
          timestamp: new Date(),
        }
      ],
      createdAt: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const deleteConversation = (id: string) => {
    if (conversations.length === 1) return;
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (activeConversationId === id) {
      setActiveConversationId(filtered[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex">
      {/* Sidebar - OpenUI风格 */}
      <aside className={`${showSidebar ? 'w-64' : 'w-0'} border-r border-slate-800/60 bg-slate-900/30 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">新对话</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                activeConversationId === conv.id
                  ? 'bg-cyan-500/10 border border-cyan-500/20'
                  : 'hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-300 truncate">{conv.title}</span>
              </div>
              {conversations.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-slate-800/60">
          <p className="text-xs text-slate-500 mb-2 px-1">快速场景</p>
          <div className="space-y-1">
            {quickPrompts.slice(0, 3).map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 text-xs text-slate-400 hover:text-slate-300 transition-colors text-left"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{prompt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="p-3 border-t border-slate-800/60">
          <button className="flex items-center space-x-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
            <Settings className="w-4 h-4" />
            <span>设置</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-slate-800/60 flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-slate-100">AI 模型匹配助手</h1>
          </div>
          <a href="/" className="flex items-center space-x-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
            <Compass className="w-4 h-4" />
            <span>返回首页</span>
          </a>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 ml-3' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-600 mr-3'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>

                  {/* Content */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-cyan-500/10 border border-cyan-500/20 text-slate-100'
                      : 'bg-slate-800/80 border border-slate-700 text-slate-200'
                  }`}>
                    <MessageContent content={message.content} codeBlocks={message.codeBlocks} />
                    
                    {/* Timestamp */}
                    <div className="text-xs text-slate-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>

                    {/* Recommendations */}
                    {message.recommendations && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-slate-400 mb-3">🎯 为您推荐以下模型：</p>
                        {message.recommendations.map((model, idx) => (
                          <div
                            key={model.id}
                            className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/30 transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-slate-100">{idx + 1}. {model.name}</h3>
                                <p className="text-xs text-slate-500">{model.provider}</p>
                              </div>
                              <div className="flex items-center space-x-1 text-amber-400">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span className="text-sm font-medium">{model.score}</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">{model.description}</p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {model.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-cyan-400 font-medium">
                                ¥{model.price}/M tokens
                              </span>
                              <div className="flex space-x-2">
                                <a
                                  href={`/market?model=${model.id}`}
                                  className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs rounded-lg hover:bg-cyan-500/20 transition-colors"
                                >
                                  查看详情
                                </a>
                                <a
                                  href="/api-service"
                                  className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs rounded-lg hover:bg-slate-600 transition-colors"
                                >
                                  API接入
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="text-center pt-2">
                          <a href="/market" className="inline-flex items-center space-x-1 text-sm text-cyan-400 hover:text-cyan-300">
                            <span>浏览全部模型</span>
                            <ChevronRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {message.role === 'assistant' && !message.isStreaming && (
                      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-700/50">
                        <button className="p-1 text-slate-500 hover:text-cyan-400 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-500 hover:text-cyan-400 transition-colors">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-500 hover:text-green-400 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-500 hover:text-red-400 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
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
                  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
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
        </div>

        {/* Input Area - OpenUI风格 */}
        <div className="border-t border-slate-800/60 p-4">
          <div className="max-w-3xl mx-auto">
            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-full text-xs text-slate-400 hover:text-slate-300 transition-all"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{prompt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Input */}
            <div className="relative flex items-end space-x-2 bg-slate-800/80 border border-slate-700 rounded-2xl p-2 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
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
                className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              AI 助手使用免费轻量级模型，仅用于场景理解和模型推荐
              <span className="mx-2 text-slate-700">|</span>
              <a href="/api-service" className="text-cyan-400 hover:underline">升级专业版</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
