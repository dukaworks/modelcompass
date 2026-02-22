import { Router } from 'express';
import { prisma } from '../utils/db';

const router = Router();

// GET /api/models - 获取所有模型列表
router.get('/', async (req, res) => {
  try {
    // MVP: 返回硬编码的模型数据
    const models = [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        capabilities: ['chat', 'vision', 'code'],
        pricing: { prompt: 0.0025, completion: 0.01 },
        contextLength: 128000,
        tags: ['多模态', '代码强', '通用'],
        recommendedFor: ['复杂推理', '视觉任务', '代码生成']
      },
      {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        capabilities: ['chat', 'vision', 'code'],
        pricing: { prompt: 0.003, completion: 0.015 },
        contextLength: 200000,
        tags: ['长上下文', '写作强', '安全'],
        recommendedFor: ['长文档分析', '创意写作', '安全场景']
      },
      {
        id: 'qwen-2-5-72b',
        name: 'Qwen 2.5 72B',
        provider: 'alibaba',
        capabilities: ['chat', 'code'],
        pricing: { prompt: 0.00012, completion: 0.00039 },
        contextLength: 32768,
        tags: ['中文强', '性价比', '开源'],
        recommendedFor: ['中文任务', '预算敏感', '快速响应']
      },
      {
        id: 'deepseek-v3',
        name: 'DeepSeek V3',
        provider: 'deepseek',
        capabilities: ['chat', 'code', 'reasoning'],
        pricing: { prompt: 0.00019, completion: 0.00087 },
        contextLength: 163840,
        tags: ['推理强', '代码强', '国产'],
        recommendedFor: ['数学推理', '代码生成', '复杂任务']
      }
    ];
    
    res.json({ 
      success: true, 
      data: models,
      meta: { total: models.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch models' });
  }
});

// GET /api/models/:id - 获取单个模型详情
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // MVP: 简化处理
  res.json({ 
    success: true, 
    data: { id, detail: 'Model detail coming soon' }
  });
});

export { router as modelsRouter };
