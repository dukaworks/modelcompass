import { PrismaClient } from '@prisma/client';
import { OpenRouterCrawler } from './crawler';
import { HuggingFaceCrawler } from './hf-crawler';
import { SocialMediaScanner } from './social-scanner';
import { BenchmarkCrawler } from './benchmark-crawler';

interface HeartbeatTask {
  name: string;
  interval: number; // 毫秒
  lastRun?: Date;
  isRunning: boolean;
  execute: () => Promise<void>;
}

export class ModelHeartbeat {
  private prisma: PrismaClient;
  private tasks: Map<string, HeartbeatTask> = new Map();
  private intervalId?: NodeJS.Timeout;
  
  // 爬虫实例
  private openRouterCrawler: OpenRouterCrawler;
  private hfCrawler: HuggingFaceCrawler;
  private socialScanner: SocialMediaScanner;
  private benchmarkCrawler: BenchmarkCrawler;

  constructor() {
    this.prisma = new PrismaClient();
    this.openRouterCrawler = new OpenRouterCrawler();
    this.hfCrawler = new HuggingFaceCrawler();
    this.socialScanner = new SocialMediaScanner();
    this.benchmarkCrawler = new BenchmarkCrawler();
    
    this.initTasks();
  }

  private initTasks() {
    // 任务1: OpenRouter 价格监控 (每1小时)
    this.tasks.set('crawl-openrouter', {
      name: 'crawl-openrouter',
      interval: 60 * 60 * 1000, // 1小时
      isRunning: false,
      execute: async () => {
        console.log('🕷️ [心跳] 抓取 OpenRouter...');
        await this.openRouterCrawler.run();
        await this.logHeartbeat('crawl-openrouter', 'success');
      }
    });

    // 任务2: HuggingFace 热门模型 (每6小时)
    this.tasks.set('crawl-huggingface', {
      name: 'crawl-huggingface',
      interval: 6 * 60 * 60 * 1000, // 6小时
      isRunning: false,
      execute: async () => {
        console.log('🕷️ [心跳] 抓取 HuggingFace...');
        await this.hfCrawler.run();
        await this.logHeartbeat('crawl-huggingface', 'success');
      }
    });

    // 任务3: 社交媒体扫描 (每12小时)
    this.tasks.set('scan-social', {
      name: 'scan-social',
      interval: 12 * 60 * 60 * 1000, // 12小时
      isRunning: false,
      execute: async () => {
        console.log('📱 [心跳] 扫描社交媒体...');
        await this.socialScanner.scanAll();
        await this.logHeartbeat('scan-social', 'success');
      }
    });

    // 任务4: Benchmark更新 (每24小时)
    this.tasks.set('crawl-benchmarks', {
      name: 'crawl-benchmarks',
      interval: 24 * 60 * 60 * 1000, // 24小时
      isRunning: false,
      execute: async () => {
        console.log('📊 [心跳] 抓取 Benchmarks...');
        await this.benchmarkCrawler.run();
        await this.logHeartbeat('crawl-benchmarks', 'success');
      }
    });
  }

  /**
   * 开始心跳
   */
  start(interval: number = 60000) {
    console.log('💓 启动 ModelCompass 心跳系统...');
    console.log(`⏰ 检查间隔: ${interval / 1000}秒`);
    
    this.intervalId = setInterval(() => {
      this.checkAndRunTasks();
    }, interval);
    
    // 立即执行一次检查
    this.checkAndRunTasks();
  }

  /**
   * 停止心跳
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('🛑 心跳系统已停止');
    }
  }

  /**
   * 检查并运行到期的任务
   */
  private async checkAndRunTasks() {
    const now = new Date();
    
    for (const [name, task] of this.tasks) {
      if (task.isRunning) {
        console.log(`⏳ [心跳] ${name} 正在运行中，跳过`);
        continue;
      }
      
      if (!task.lastRun || now.getTime() - task.lastRun.getTime() >= task.interval) {
        console.log(`🚀 [心跳] 启动任务: ${name}`);
        task.isRunning = true;
        
        try {
          await task.execute();
          task.lastRun = new Date();
        } catch (error: any) {
          console.error(`❌ [心跳] ${name} 失败:`, error.message);
          await this.logHeartbeat(name, 'failed', error.message);
        } finally {
          task.isRunning = false;
        }
      }
    }
  }

  /**
   * 记录心跳日志
   */
  private async logHeartbeat(taskName: string, status: string, error?: string) {
    try {
      await this.prisma.heartbeatLog.create({
        data: {
          taskName,
          status,
          error,
          timestamp: new Date()
        }
      });
    } catch (e) {
      console.error('记录心跳日志失败:', e);
    }
  }

  /**
   * 手动触发任务
   */
  async triggerTask(taskName: string) {
    const task = this.tasks.get(taskName);
    if (!task) {
      throw new Error(`未知任务: ${taskName}`);
    }
    
    if (task.isRunning) {
      throw new Error(`任务 ${taskName} 正在运行中`);
    }
    
    task.isRunning = true;
    try {
      await task.execute();
      task.lastRun = new Date();
    } finally {
      task.isRunning = false;
    }
  }

  /**
   * 获取任务状态
   */
  getStatus() {
    const status: any = {};
    for (const [name, task] of this.tasks) {
      status[name] = {
        isRunning: task.isRunning,
        lastRun: task.lastRun,
        interval: task.interval,
        nextRun: task.lastRun 
          ? new Date(task.lastRun.getTime() + task.interval)
          : 'pending'
      };
    }
    return status;
  }
}

// 单例模式
let heartbeatInstance: ModelHeartbeat | null = null;

export function getHeartbeat(): ModelHeartbeat {
  if (!heartbeatInstance) {
    heartbeatInstance = new ModelHeartbeat();
  }
  return heartbeatInstance;
}
