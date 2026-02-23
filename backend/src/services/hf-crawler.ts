import axios from 'axios';
import { prisma } from '../utils/db';

interface HuggingFaceModel {
  id: string;
  modelId: string;
  name: string;
  description?: string;
  tags: string[];
  downloads: number;
  likes: number;
  pipeline_tag?: string;
  license?: string;
  language?: string[];
  url: string;
}

export class HuggingFaceCrawler {
  private baseUrl = 'https://huggingface.co/api/models';

  /**
   * 抓取 LLM 模型列表
   */
  async crawlLLMs(limit = 100): Promise<HuggingFaceModel[]> {
    console.log(`🕷️ 从 HuggingFace 抓取 LLM 模型 (limit: ${limit})...`);
    
    try {
      // HF API 支持筛选 text-generation 任务
      const response = await axios.get(this.baseUrl, {
        params: {
          filter: 'text-generation',
          sort: 'downloads',
          direction: -1,
          limit: limit
        },
        timeout: 30000
      });

      const models: HuggingFaceModel[] = response.data.map((m: any) => ({
        id: m._id,
        modelId: m.modelId,
        name: m.modelId.split('/').pop(),
        description: this.extractDescription(m.cardData),
        tags: m.tags || [],
        downloads: m.downloads || 0,
        likes: m.likes || 0,
        pipeline_tag: m.pipeline_tag,
        license: m.license,
        language: m.cardData?.language || m.tags?.filter((t: string) => 
          ['zh', 'en', 'multilingual', 'chinese'].includes(t)
        ),
        url: `https://huggingface.co/${m.modelId}`
      }));

      console.log(`✅ 抓取到 ${models.length} 个 HF 模型`);
      return models;
    } catch (error: any) {
      console.error('❌ HuggingFace 抓取失败:', error.message);
      return [];
    }
  }

  /**
   * 抓取特定模型详情
   */
  async crawlModelDetail(modelId: string): Promise<Partial<HuggingFaceModel>> {
    try {
      const response = await axios.get(`${this.baseUrl}/${modelId}`, {
        timeout: 10000
      });

      const m = response.data;
      return {
        description: this.extractDescription(m.cardData),
        tags: m.tags || [],
        downloads: m.downloads || 0,
        likes: m.likes || 0,
        license: m.license,
        language: m.cardData?.language
      };
    } catch (error: any) {
      console.error(`❌ 抓取详情失败 ${modelId}:`, error.message);
      return {};
    }
  }

  /**
   * 提取描述
   */
  private extractDescription(cardData: any): string | undefined {
    if (!cardData) return undefined;
    
    const desc = cardData.description || 
                 cardData.abstract || 
                 cardData.model_summary ||
                 (typeof cardData === 'string' ? cardData : undefined);
    
    return desc?.substring(0, 500);
  }

  /**
   * 转换为魔盘 Model 格式
   */
  convertToModel(hfModel: HuggingFaceModel): any {
    const provider = this.inferProvider(hfModel.modelId);
    
    return {
      modelId: `hf-${hfModel.modelId.replace(/\//g, '-')}`,
      name: hfModel.name,
      provider: provider,
      description: hfModel.description || `HuggingFace 模型：${hfModel.modelId}`,
      capabilities: this.inferCapabilities(hfModel),
      contextLength: this.inferContextLength(hfModel),
      promptPrice: 0,  // HF 免费使用
      completionPrice: 0,
      tags: [
        ...hfModel.tags?.slice(0, 5) || [],
        '开源',
        '免费',
        'HuggingFace',
        hfModel.downloads > 100000 ? '热门' : '',
        hfModel.likes > 500 ? '高分' : ''
      ].filter(Boolean),
      recommendedFor: this.inferRecommendations(hfModel),
      websiteUrl: hfModel.url,
      docsUrl: `${hfModel.url}#model-card`,
      isActive: true
    };
  }

  private inferProvider(modelId: string): string {
    if (modelId.includes('meta-llama')) return 'meta';
    if (modelId.includes('mistral')) return 'mistral';
    if (modelId.includes('Qwen')) return 'alibaba';
    if (modelId.includes('deepseek')) return 'deepseek';
    if (modelId.includes('google')) return 'google';
    if (modelId.includes('microsoft')) return 'microsoft';
    return 'community';
  }

  private inferCapabilities(model: HuggingFaceModel): string[] {
    const caps = ['chat'];
    const tags = model.tags?.map(t => t.toLowerCase()) || [];
    
    if (tags.some(t => t.includes('vision') || t.includes('image'))) caps.push('vision');
    if (tags.some(t => t.includes('code') || t.includes('programming'))) caps.push('code');
    if (model.pipeline_tag === 'text-generation') caps.push('generation');
    
    return caps;
  }

  private inferContextLength(model: HuggingFaceModel): number {
    const tags = model.tags?.join(' ') || '';
    
    if (tags.includes('32k') || tags.includes('32768')) return 32768;
    if (tags.includes('128k') || tags.includes('131072')) return 131072;
    if (tags.includes('4k') || tags.includes('4096')) return 4096;
    if (tags.includes('8k') || tags.includes('8192')) return 8192;
    
    return 4096;
  }

  private inferRecommendations(model: HuggingFaceModel): string[] {
    const recs = ['本地部署', '隐私优先'];
    const tags = model.tags?.map(t => t.toLowerCase()) || [];
    
    if (model.downloads > 1000000) recs.push('社区热门');
    if (tags.some(t => t.includes('chinese') || t.includes('zh'))) recs.push('中文支持');
    if (model.license === 'apache-2.0' || model.license === 'mit') recs.push('商业友好');
    
    return recs;
  }

  /**
   * 运行完整抓取
   */
  async run(): Promise<void> {
    console.log('🚀 启动 HuggingFace 爬虫...');
    
    const models = await this.crawlLLMs(100);
    
    for (const hfModel of models.slice(0, 50)) {
      try {
        const modelData = this.convertToModel(hfModel);
        
        await prisma.model.upsert({
          where: { modelId: modelData.modelId },
          update: modelData,
          create: modelData
        });
        
        console.log(`✅ 已保存: ${modelData.name}`);
      } catch (error: any) {
        console.error(`❌ 保存失败 ${hfModel.modelId}:`, error.message);
      }
    }
    
    console.log('\n🎉 HuggingFace 爬虫完成！');
  }
}

if (require.main === module) {
  const crawler = new HuggingFaceCrawler();
  crawler.run().catch(console.error);
}
