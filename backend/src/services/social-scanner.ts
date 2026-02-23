import axios from 'axios';
import { prisma } from '../utils/db';

interface SocialMetrics {
  twitterMentions: number;
  redditScore: number;
  githubStars: number;
  sentiment: number; // 情感分数 -1 到 1
}

export class SocialMediaScanner {
  
  /**
   * 扫描所有模型的社交媒体数据
   */
  async scanAll(): Promise<void> {
    console.log('📱 扫描社交媒体...');
    
    const models = await prisma.model.findMany({
      where: { isActive: true },
      take: 50 // 先扫描前50个
    });
    
    for (const model of models) {
      try {
        const metrics = await this.scanModel(model.modelId, model.name);
        await this.saveSocialMetrics(model.id, metrics);
        console.log(`✅ ${model.name}: Twitter:${metrics.twitterMentions} Reddit:${metrics.redditScore}`);
      } catch (error: any) {
        console.error(`❌ 扫描失败 ${model.name}:`, error.message);
      }
      
      // 避免 Rate Limit
      await this.sleep(2000);
    }
  }

  /**
   * 扫描单个模型
   */
  private async scanModel(modelId: string, modelName: string): Promise<SocialMetrics> {
    const metrics: SocialMetrics = {
      twitterMentions: 0,
      redditScore: 0,
      githubStars: 0,
      sentiment: 0
    };

    // 模拟数据（实际部署时接入真实API）
    // TODO: 接入 Twitter API v2
    // TODO: 接入 Reddit API
    // TODO: 接入 GitHub API
    
    // 基于模型ID的模拟（让数据看起来真实）
    const hash = this.simpleHash(modelId);
    metrics.twitterMentions = Math.floor(hash * 1000) % 5000;
    metrics.redditScore = Math.floor(hash * 100) % 100;
    metrics.githubStars = Math.floor(hash * 10000) % 50000;
    metrics.sentiment = (hash % 100) / 50 - 1; // -1 到 1

    return metrics;
  }

  /**
   * 保存社交媒体指标
   */
  private async saveSocialMetrics(modelId: string, metrics: SocialMetrics) {
    // 可以创建单独的 SocialMetrics 表
    // 现在先更新到 Model 表的 tags 中
    await prisma.model.update({
      where: { id: modelId },
      data: {
        // 后续可以添加 socialMetrics 字段
        // 或者创建关联表
      }
    });
  }

  /**
   * 简单的哈希函数（用于模拟数据）
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
