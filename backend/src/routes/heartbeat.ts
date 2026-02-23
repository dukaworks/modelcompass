import { Router } from 'express';
import { getHeartbeat } from '../services/heartbeat';

const router = Router();

// GET /api/admin/heartbeat/status - 获取心跳状态
router.get('/status', (req, res) => {
  const heartbeat = getHeartbeat();
  const status = heartbeat.getStatus();
  
  res.json({
    success: true,
    data: {
      isRunning: true, // TODO: 从实例获取
      tasks: status,
      timestamp: new Date().toISOString()
    }
  });
});

// POST /api/admin/heartbeat/start - 启动心跳
router.post('/start', (req, res) => {
  try {
    const heartbeat = getHeartbeat();
    heartbeat.start();
    
    res.json({
      success: true,
      message: '心跳系统已启动'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/heartbeat/stop - 停止心跳
router.post('/stop', (req, res) => {
  try {
    const heartbeat = getHeartbeat();
    heartbeat.stop();
    
    res.json({
      success: true,
      message: '心跳系统已停止'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/heartbeat/trigger/:task - 手动触发任务
router.post('/trigger/:task', async (req, res) => {
  try {
    const { task } = req.params;
    const heartbeat = getHeartbeat();
    
    await heartbeat.triggerTask(task);
    
    res.json({
      success: true,
      message: `任务 ${task} 已手动触发`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as heartbeatRouter };
