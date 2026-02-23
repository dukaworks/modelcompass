import { Router } from 'express';
import { syncOpenRouterModels } from '../crawler/openrouter';
import { updateModelScores } from '../crawler/index';

const router = Router();

// POST /api/admin/crawler - 触发爬虫（需要鉴权）
router.post('/crawler', async (req, res) => {
  try {
    // TODO: 添加鉴权检查
    const { source = 'openrouter' } = req.body;
    
    console.log(`🕷️  触发爬虫: ${source}`);
    
    let result;
    
    if (source === 'openrouter') {
      result = await syncOpenRouterModels();
      await updateModelScores();
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Unknown source' 
      });
    }
    
    res.json({
      success: true,
      data: {
        source,
        added: result.added,
        updated: result.updated,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Crawler error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/admin/stats - 获取统计数据
router.get('/stats', async (req, res) => {
  try {
    const modelCount = await prisma.model.count();
    const activeCount = await prisma.model.count({ where: { isActive: true } });
    
    res.json({
      success: true,
      data: {
        totalModels: modelCount,
        activeModels: activeCount,
        providers: await prisma.model.groupBy({
          by: ['provider'],
          _count: { id: true }
        })
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as adminRouter };

// 需要导入 prisma
import { prisma } from '../utils/db';
