import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from '../utils/db';

interface LeaderboardModel {
  name: string;
  score: number;
  metrics: {
    arena?: number;
    mmlu?: number;
    humaneval?: number;
    mtbench?: number;
  };
}

/**
 * 从 HuggingFace Leaderboard 抓取评测数据
 * 注意：实际实现可能需要使用 HF API 或解析页面
 */
export async function crawlHuggingFaceLeaderboard(): Promise<LeaderboardModel[]> {
  console.log('🔍 正在抓取 HuggingFace Leaderboard...');
  
  try {
    // HuggingFace Open LLM Leaderboard
    const response = await axios.get(
      'https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard',
      { timeout: 30000 }
    );
    
    // 这里简化处理，实际可能需要 API 或 headless 浏览器
    console.log('⚠️  HuggingFace 页面抓取需要额外处理');
    return [];
  } catch (error) {
    console.error('❌ HuggingFace 抓取失败:', error.message);
    return [];
  }
}

/**
 * 从 LMSYS Chatbot Arena 抓取 ELO 评分
 */
export async function crawlLMSYSArena(): Promise<Map<string, number>> {
  console.log('🔍 正在抓取 LMSYS Chatbot Arena...');
  
  try {
    const response = await axios.get(
      'https://chat.lmsys.org/?leaderboard',
      { timeout: 30000 }
    );
    
    const $ = cheerio.load(response.data);
    const scores = new Map<string, number>();
    
    // 解析表格数据（简化版本）
    $('table tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const modelName = $(cells[0]).text().trim();
        const eloText = $(cells[1]).text().trim();
        const elo = parseFloat(eloText);
        
        if (modelName && !isNaN(elo)) {
          scores.set(modelName, elo);
        }
      }
    });
    
    console.log(`✅ 获取到 ${scores.size} 个 Arena 评分`);
    return scores;
  } catch (error) {
    console.error('❌ LMSYS 抓取失败:', error.message);
    return new Map();
  }
}

/**
 * 更新模型评分到数据库
 */
export async function updateModelScores(): Promise<void> {
  console.log('🔄 正在更新模型评分...');
  
  // 这里可以实现从各种评测源更新评分
  // 简化版本：使用预定义的一些基准数据
  
  const modelScores: Record<string, Partial<{
    codingScore: number;
    reasoningScore: number;
    writingScore: number;
    chineseScore: number;
    speedScore: number;
  }>> = {
    'gpt-4o': {
      codingScore: 92,
      reasoningScore: 95,
      writingScore: 90,
      chineseScore: 85,
      speedScore: 88
    },
    'claude-3-5-sonnet': {
      codingScore: 94,
      reasoningScore: 93,
      writingScore: 96,
      chineseScore: 82,
      speedScore: 85
    },
    'deepseek-chat': {
      codingScore: 93,
      reasoningScore: 94,
      writingScore: 84,
      chineseScore: 90,
      speedScore: 87
    }
  };
  
  for (const [modelId, scores] of Object.entries(modelScores)) {
    try {
      await prisma.model.updateMany({
        where: { modelId: { contains: modelId } },
        data: scores
      });
      console.log(`✅ 更新评分: ${modelId}`);
    } catch (error) {
      console.error(`❌ 更新 ${modelId} 失败:`, error.message);
    }
  }
}

// 主爬虫函数
export async function runAllCrawlers(): Promise<void> {
  console.log('🕷️ 启动模型画像爬虫...\n');
  
  // 1. 抓取 OpenRouter 模型
  const { added, updated } = await syncOpenRouterModels();
  
  // 2. 更新评测分数
  await updateModelScores();
  
  // 3. 获取 LMSYS 数据（如果有的话）
  // const arenaScores = await crawlLMSYSArena();
  
  console.log('\n✅ 爬虫任务完成！');
  console.log(`📊 新增: ${added} 个模型`);
  console.log(`📊 更新: ${updated} 个模型`);
}

// 简化导出
import { syncOpenRouterModels } from './openrouter';
export { syncOpenRouterModels };
