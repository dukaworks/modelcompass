import { syncOpenRouterModels } from './openrouter';
import { updateModelScores } from './index';

async function main() {
  console.log('🕷️  ModelCompass 模型画像爬虫\n');
  
  try {
    // 同步 OpenRouter 模型
    const { added, updated } = await syncOpenRouterModels();
    
    // 更新评测分数
    await updateModelScores();
    
    console.log('\n✅ 爬虫任务完成！');
    console.log(`📊 新增: ${added} 个模型`);
    console.log(`📊 更新: ${updated} 个模型`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 爬虫失败:', error);
    process.exit(1);
  }
}

main();
