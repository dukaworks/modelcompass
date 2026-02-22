import { Router } from 'express';
import { prisma } from '../utils/db';

const router = Router();

// GET /api/models - 获取所有模型列表
router.get('/', async (req, res) => {
  try {
    const { provider, capability } = req.query;
    
    const where: any = { isActive: true };
    
    if (provider) {
      where.provider = provider as string;
    }
    
    if (capability) {
      where.capabilities = {
        has: capability as string
      };
    }
    
    const models = await prisma.model.findMany({
      where,
      orderBy: { usageCount: 'desc' }
    });
    
    res.json({ 
      success: true, 
      data: models,
      meta: { total: models.length }
    });
  } catch (error) {
    console.error('Fetch models error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch models' });
  }
});

// GET /api/models/:id - 获取单个模型详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const model = await prisma.model.findUnique({
      where: { modelId: id }
    });
    
    if (!model) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }
    
    res.json({ 
      success: true, 
      data: model
    });
  } catch (error) {
    console.error('Fetch model error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch model' });
  }
});

// GET /api/models/providers - 获取所有提供商
router.get('/meta/providers', async (req, res) => {
  try {
    const providers = await prisma.model.groupBy({
      by: ['provider'],
      where: { isActive: true }
    });
    
    res.json({
      success: true,
      data: providers.map(p => p.provider)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch providers' });
  }
});

export { router as modelsRouter };
