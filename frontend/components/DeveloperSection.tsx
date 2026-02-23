'use client';

import { useState } from 'react';
import { Terminal, Copy, Check, ChevronRight } from 'lucide-react';

const codeExamples = {
  curl: `curl https://api.modelcompass.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "temperature": 0.7
  }'`,
  python: `import requests

response = requests.post(
    "https://api.modelcompass.ai/v1/chat/completions",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "model": "gpt-4o",
        "messages": [{"role": "user", "content": "Hello!"}],
        "temperature": 0.7
    }
)

print(response.json())`,
  javascript: `const response = await fetch('https://api.modelcompass.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello!' }],
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data);`
};

type Language = 'curl' | 'python' | 'javascript';

export default function DeveloperSection() {
  const [activeLang, setActiveLang] = useState<Language>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900/80 to-indigo-950/80 border border-slate-800 rounded-2xl p-8 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative">
        {/* 标题 */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
            <Terminal className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">开发者快速接入</h3>
            <p className="text-slate-400">一行代码调用全球模型</p>
          </div>
        </div>

        {/* 语言切换 */}
        <div className="flex space-x-2 mb-4">
          {(['curl', 'python', 'javascript'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeLang === lang
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-transparent hover:bg-slate-700/50'}
              `}
            >
              {lang === 'curl' && 'cURL'}
              {lang === 'python' && 'Python'}
              {lang === 'javascript' && 'JavaScript'}
            </button>
          ))}
        </div>

        {/* 代码块 */}
        <div className="relative bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-sm transition-colors flex items-center space-x-1 z-10"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>复制</span>
              </>
            )}
          </button>

          {/* 代码 */}
          <pre className="p-5 text-sm text-slate-300 overflow-x-auto font-mono leading-relaxed">
            <code>{codeExamples[activeLang]}</code>
          </pre>
        </div>

        {/* 底部按钮 */}
        <div className="flex flex-wrap gap-4 mt-6">
          <a
            href="/docs"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors"
          >
            <span>查看完整文档</span>
            <ChevronRight className="w-4 h-4" />
          </a>
          <a
            href="/playground"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700"
          >
            <span>在线测试</span>
          </a>
        </div>
      </div>
    </div>
  );
}
