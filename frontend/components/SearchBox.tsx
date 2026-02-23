'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Zap, Code, Terminal } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBox({ onSearch, placeholder = "搜索 393+ 个 AI 模型..." }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 模拟搜索建议
  const mockSuggestions = [
    'GPT-4o',
    'Claude 3.5',
    'DeepSeek-V3',
    'Qwen 2.5',
    'Llama 3',
    '免费模型',
    '代码生成',
    '中文优化'
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div 
          className={`
            relative flex items-center bg-slate-900/80 backdrop-blur-sm 
            border rounded-2xl transition-all duration-300
            ${isFocused 
              ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
              : 'border-slate-700 hover:border-slate-600'}
          `}
        >
          <Search className="absolute left-5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="w-full py-4 pl-14 pr-24 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            搜索
          </button>
        </div>
      </form>

      {/* 搜索建议下拉 */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-xl z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
              }}
              className="w-full px-5 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-3 text-slate-500" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
