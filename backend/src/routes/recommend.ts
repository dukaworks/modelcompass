import { Router } from 'express';

const router = Router();

// POST /api/recommend - 智能推荐模型
router.post('/', (req, res) => {
  const { scenario, requirements = {} } = req.body;
  
  // MVP: 简单的规则匹配
  const recommendations: Record<string, any[]> = {
    '代码生成': [
      { model: 'claude-3-5-sonnet', reason: '代码能力最强', score: 95 },
      { model: 'gpt-4o', reason: '多模态支持，综合能力强', score: 92 },
      { model: 'deepseek-v3', reason: '性价比极高', score: 88 }
    ],
    '中文任务': [
      { model: 'qwen-2-5-72b', reason: '中文原生优化', score: 94 },
      { model: 'deepseek-v3', reason: '中文理解优秀', score: 90 }
    ],
    '长文档分析': [
      { model: 'claude-3-5-sonnet', reason: '200K上下文', score: 96 },
      { model: 'gemini-1-5-pro', reason: '100万token上下文', score: 94 }
    ],
    '预算敏感': [
      { model: 'qwen-2-5-72b', reason: '价格低，质量高', score: 93 },
      { model: 'gemma-2-9b', reason: '免费可用', score: 85 }
    ],
    '通用助手': [
      { model: 'gpt-4o', reason: '综合能力最强', score: 95 },
      { model: 'claude-3-5-sonnet', reason: '安全且智能', score: 93 }
    ]
  };
  
  const results = recommendations[scenario] || recommendations['通用助手'];
  
  res.json({
    success: true,
    data: {
      scenario,
      recommendations: results,
      note: 'MVP版本：基于规则的简单推荐，未来将升级为AI智能匹配'
    }
  });
});

export { router as recommendRouter };
