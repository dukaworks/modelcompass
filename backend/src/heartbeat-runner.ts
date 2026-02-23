/**
 * ModelCompass 心跳服务启动器
 * 
 * 用法:
 *   npm run heartbeat:start  - 启动心跳
 *   npm run heartbeat:stop   - 停止心跳
 *   npm run heartbeat:status - 查看状态
 */

import { getHeartbeat } from './services/heartbeat';

const command = process.argv[2];

const heartbeat = getHeartbeat();

switch (command) {
  case 'start':
    console.log('🚀 启动 ModelCompass 心跳服务...');
    heartbeat.start();
    
    // 保持进程运行
    process.on('SIGINT', () => {
      console.log('\n👋 接收到停止信号...');
      heartbeat.stop();
      process.exit(0);
    });
    
    // 每小时报告一次状态
    setInterval(() => {
      const status = heartbeat.getStatus();
      console.log('\n📊 [状态报告]', new Date().toLocaleString());
      console.table(status);
    }, 60 * 60 * 1000);
    
    break;
    
  case 'status':
    const status = heartbeat.getStatus();
    console.log('💓 心跳服务状态:');
    console.table(status);
    process.exit(0);
    break;
    
  case 'trigger':
    const taskName = process.argv[3];
    if (!taskName) {
      console.error('❌ 请指定任务名: npm run heartbeat:trigger -- crawl-openrouter');
      process.exit(1);
    }
    
    console.log(`🚀 手动触发任务: ${taskName}`);
    heartbeat.triggerTask(taskName)
      .then(() => {
        console.log('✅ 任务完成');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ 任务失败:', error.message);
        process.exit(1);
      });
    break;
    
  default:
    console.log('🦞 ModelCompass Heartbeat Service');
    console.log('');
    console.log('用法:');
    console.log('  npm run heartbeat:start              启动心跳服务');
    console.log('  npm run heartbeat:status             查看任务状态');
    console.log('  npm run heartbeat:trigger <task>     手动触发任务');
    console.log('');
    console.log('可触发任务:');
    console.log('  - crawl-openrouter    抓取 OpenRouter (每小时)');
    console.log('  - crawl-huggingface   抓取 HuggingFace (每6小时)');
    console.log('  - scan-social         扫描社交媒体 (每12小时)');
    console.log('  - crawl-benchmarks    抓取 Benchmarks (每24小时)');
    process.exit(0);
}
