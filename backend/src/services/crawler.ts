import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from '../utils/db';

interface ModelData {
  modelId: string;
  name: string;
  provider: string;
  description?: string;
  capabilities: string[];
  contextLength?: number;
  promptPrice?: number;
  completionPrice?: number;
  tags: string[];
  websiteUrl?: string;
  docsUrl?: string;
}

export class ModelCrawler {
  private openRouterKey: string;

  constructor() {
    this.openRouterKey = process.env.OPENROUTER_API_KEY || '';
  }

  /**
   * 从 OpenRouter 抓取最新模型列表和价格
   */
  async crawlFromOpenRouter(): Promise<ModelData[]> {
    console.log('🕷️ 从 OpenRouter 抓取模型数据...');
    
    try {
      const response = await axios.get('https://openrouter.ai/api/v1/models', {
        headers: this.openRouterKey ? {
          'Authorization': `Bearer ${this.openRouterKey}`
        } : {}
      });

      const models: ModelData[] = response.data.data
        .filter((m: any) => m.pricing && m.pricing.prompt !== undefined)
        .map((m: any) => ({
          modelId: m.id,
          name: m.name || m.id,
          provider: m.id.split('/')[0] || 'unknown',
          description: m.description?.substring(0, 500),
          capabilities: this.extractCapabilities(m),
          contextLength: m.context_length,
          promptPrice: parseFloat(m.pricing?.prompt) || 0,
          completionPrice: parseFloat(m.pricing?.completion) || 0,
          tags: this.extractTags(m),
          websiteUrl: `https://openrouter.ai/models/${m.id}`,
          docsUrl: m.id.startsWith('openai') 
            ? 'https://platform.openai.com/docs/models'
            : m.id.startsWith('anthropic')
            ? 'https://docs.anthropic.com/claude/docs'
            : undefined
        }));

      console.log(`✅ 抓取到 ${models.length} 个模型`);
      return models;
    } catch (error: any) {
      console.error('❌ OpenRouter 抓取失败:', error.message);
      return [];
    }
  }

  /**
   * 从 HuggingFace 抓取模型信息
   */
  async crawlFromHuggingFace(modelName: string): Promise<Partial<ModelData>> {
    console.log(`🕷️ 从 HuggingFace 抓取 ${modelName}...`);
    
    try {
      // 调用 HuggingFace API
      const response = await axios.get(`https://huggingface.co/api/models/${modelName}`, {
        timeout: 10000
      });

      const data = response.data;
      
      return {
        description: data.cardData?.description || data.description,
        tags: [
          ...data.tags || [],
          data.pipeline_tag
        ].filter(Boolean),
        websiteUrl: `https://huggingface.co/${modelName}`
      };
    } catch (error: any) {
      console.error(`❌ HuggingFace 抓取失败 ${modelName}:`, error.message);
      return {};
    }
  }

  /**
   * 提取模型能力标签
   */
  private extractCapabilities(model: any): string[] {
    const caps: string[] = ['chat'];
    
    if (model.description?.toLowerCase().includes('vision') || 
        model.id.includes('vision') ||
        model.architecture?.input_modalities?.includes('image')) {
      caps.push('vision');
    }
    
    if (model.description?.toLowerCase().includes('code') ||
        model.id.includes('coder') ||
        model.id.includes('code')) {
      caps.push('code');
    }

    if (model.id.includes(' reasoning') ||
        model.description?.toLowerCase().includes('reason')) {
      caps.push('reasoning');
    }

    return caps;
  }

  /**
   * 提取标签
   */
  private extractTags(model: any): string[] {
    const tags: string[] = [];
    
    // 从提供商判断
    const provider = model.id.split('/')[0];
    const providerMap: Record<string, string> = {
      'openai': 'OpenAI',
      'anthropic': 'Anthropic',
      'google': 'Google',
      'meta-llama': 'Meta',
      'mistralai': 'Mistral',
      'qwen': '阿里',
      'deepseek': '深度求索'
    };
    
    if (providerMap[provider]) {
      tags.push(providerMap[provider]);
    }

    // 从描述提取
    const desc = (model.description || '').toLowerCase();
    if (desc.includes('free')) tags.push('免费');
    if (desc.includes('multilingual') || desc.includes('中文')) tags.push('多语言');
    if (model.context_length > 100000) tags.push('长上下文');
    if (desc.includes('fast') || model.pricing?.prompt < 0.0001) tags.push('快速');

    return tags;
  }

  /**
   * 批量更新数据库
   */
  async updateDatabase(models: ModelData[]): Promise<void> {
    console.log('💾 更新数据库...');
    
    let created = 0;
    let updated = 0;

    for (const model of models) {
      try {
        const existing = await prisma.model.findUnique({
          where: { modelId: model.modelId }
        });

        if (existing) {
          await prisma.model.update({
            where: { modelId: model.modelId },
            data: {
              ...model,
              updatedAt: new Date()
            }
          });
          updated++;
        } else {
          await prisma.model.create({ data: model });
          created++;
        }
      } catch (error: any) {
        console.error(`❌ 保存失败 ${model.modelId}:`, error.message);
      }
    }

    console.log(`✅ 数据库更新完成：新增 ${created} 个，更新 ${updated} 个`);
  }

  /**
   * 运行完整爬虫任务
   */
  async run(): Promise<void> {
    console.log('🚀 启动 ModelCompass 爬虫...');
    console.log(`⏰ ${new Date().toLocaleString()}`);
    console.log('');

    // 1. 从 OpenRouter 抓取
    const openRouterModels = await this.crawlFromOpenRouter();
    
    if (openRouterModels.length > 0) {
      // 2. 更新数据库
      await this.updateDatabase(openRouterModels);
      
      // 3. 可以在这里扩展：抓取 HuggingFace 补充信息
      // for (const model of openRouterModels.slice(0, 5)) {
      //   const hfData = await this.crawlFromHuggingFace(model.name);
      //   // 合并数据...
      // }
    }

    console.log('');
    console.log('🎉 爬虫任务完成！');
  }
}

// 如果直接运行此文件
if (require.main === module) {
  const crawler = new ModelCrawler();
  crawler.run().catch(console.error);
}
