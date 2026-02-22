'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const scenarios = [
  { id: 'code', name: '代码生成', desc: '写代码、Debug、代码审查' },
  { id: 'chinese', name: '中文任务', desc: '中文写作、翻译、对话' },
  { id: 'longdoc', name: '长文档分析', desc: '论文、报告、书籍分析' },
  { id: 'budget', name: '预算敏感', desc: '追求性价比，控制成本' },
  { id: 'general', name: '通用助手', desc: '日常问答、多用途' }
];

export default function RecommendForm() {
  const [selectedScenario, setSelectedScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRecommend = async () => {
    if (!selectedScenario) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenario: scenarios.find(s => s.id === selectedScenario)?.name 
        })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error('Recommend error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">🎯 智能选型</h3>
      <p className="text-gray-600 mb-6">告诉我们你的使用场景，我们推荐最适合的模型</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario.id)}
            className={`p-4 rounded-xl border-2 text-left transition ${
              selectedScenario === scenario.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <div className="font-semibold text-gray-900">{scenario.name}</div>
            <div className="text-sm text-gray-500 mt-1">{scenario.desc}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handleRecommend}
        disabled={!selectedScenario || loading}
        className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            分析中...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            获取推荐
          </>
        )}
      </button>

      {result && (
        <div className="mt-8 border-t pt-6">
          <h4 className="font-semibold text-lg mb-4">推荐结果</h4>
          <div className="space-y-3">
            {result.recommendations.map((rec: any, index: number) => (
              <div
                key={rec.model}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-semibold">{rec.model}</div>
                    <div className="text-sm text-gray-500">{rec.reason}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${rec.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{rec.score}分</span>
                </div>
              </div>
            ))}
          </div>
          {result.note && (
            <p className="text-sm text-gray-500 mt-4">{result.note}</p>
          )}
        </div>
      )}
    </div>
  );
}
