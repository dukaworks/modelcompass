import { Router } from 'express';
import { ModelCrawler } from '../services/crawler';

const router = Router();

// POST /api/admin/crawl - 手动触发爬虫
router.post('/crawl', async (req, res) => {
  try {
    const { dryRun = false } = req.body;
    
    const crawler = new ModelCrawler();
    
    if (dryRun) {
      // 只抓取不保存
      const models = await crawler.crawlFromOpenRouter();
      res.json({
        success: true,
        message: '爬虫测试完成（未保存到数据库）',
        data: { count: models.length, models: models.slice(0, 5) }
      });
    } else {
      await crawler.run();
      res.json({
        success: true,
        message: '爬虫任务完成',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error: any) {
    console.error('Crawl error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/admin/stats - 统计数据
router.get('/stats', async (req, res) => {
  try {
    const { prisma } = await import('../utils/db');
    
    const totalModels = await prisma.model.count();
    const activeModels = await prisma.model.count({ where: { isActive: true } });
    const providers = await prisma.model.groupBy({
      by: ['provider'],
      _count: { modelId: true }
    });
    
    res.json({
      success: true,
      data: {
        totalModels,
        activeModels,
        providers: providers.map(p => ({
          name: p.provider,
          count: p._count.modelId
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as adminRouter };
