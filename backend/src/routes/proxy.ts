import { Router } from 'express';
import axios from 'axios';

const router = Router();

// POST /api/proxy/chat - 代理聊天请求
router.post('/chat', async (req, res) => {
  try {
    const { model, messages, provider = 'openrouter' } = req.body;
    
    // MVP: 仅支持 OpenRouter
    if (provider === 'openrouter') {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://modelcompass.io',
            'X-Title': 'ModelCompass'
          }
        }
      );
      
      res.json({
        success: true,
        data: response.data,
        meta: {
          provider: 'openrouter',
          model
        }
      });
    } else {
      res.status(400).json({ success: false, error: 'Provider not supported yet' });
    }
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error || 'Proxy request failed'
    });
  }
});

export { router as proxyRouter };
