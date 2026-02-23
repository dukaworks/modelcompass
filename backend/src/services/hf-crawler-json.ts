import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

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
  url: string;
}

export class HuggingFaceCrawlerJson {
  private baseUrl = 'https://huggingface.co/api/models';

  async crawlLLMs(limit = 50): Promise<HuggingFaceModel[]> {
    console.log(`🕷️ 从 HuggingFace 抓取 LLM 模型 (limit: ${limit})...`);
    
    try {
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
        description: m.cardData?.description || m.cardData?.abstract,
        tags: m.tags || [],
        downloads: m.downloads || 0,
        likes: m.likes || 0,
        pipeline_tag: m.pipeline_tag,
        license: m.license,
        url: `https://huggingface.co/${m.modelId}`
      }));

      console.log(`✅ 抓取到 ${models.length} 个 HF 模型`);
      return models;
    } catch (error: any) {
      console.error('❌ HuggingFace 抓取失败:', error.message);
      return [];
    }
  }

  convertToModelFormat(hfModel: HuggingFaceModel): any {
    const provider = this.inferProvider(hfModel.modelId);
    
    return {
      modelId: `hf-${hfModel.modelId.replace(/\//g, '-')}`,
      name: hfModel.name,
      provider: provider,
      description: hfModel.description?.substring(0, 200) || `开源模型：${hfModel.modelId}`,
      capabilities: this.inferCapabilities(hfModel),
      contextLength: 4096,
      promptPrice: 0,
      completionPrice: 0,
      tags: [
        '开源',
        '免费',
        'HuggingFace',
        ...(hfModel.tags || []).slice(0, 3),
        hfModel.downloads > 100000 ? '🔥热门' : ''
      ].filter(Boolean),
      recommendedFor: ['本地部署', '隐私优先'],
      websiteUrl: hfModel.url,
      downloads: hfModel.downloads,
      likes: hfModel.likes,
      isActive: true
    };
  }

  private inferProvider(modelId: string): string {
    if (modelId.includes('meta-llama')) return 'Meta';
    if (modelId.includes('mistral')) return 'Mistral';
    if (modelId.includes('Qwen')) return '阿里';
    if (modelId.includes('deepseek')) return 'DeepSeek';
    if (modelId.includes('google')) return 'Google';
    if (modelId.includes('microsoft')) return 'Microsoft';
    return '社区';
  }

  private inferCapabilities(model: HuggingFaceModel): string[] {
    const caps = ['chat'];
    const tags = model.tags?.map(t => t.toLowerCase()) || [];
    
    if (tags.some(t => t.includes('vision'))) caps.push('vision');
    if (tags.some(t => t.includes('code'))) caps.push('code');
    
    return caps;
  }

  async run(): Promise<void> {
    console.log('🚀 启动 HuggingFace 爬虫（JSON输出模式）...\n');
    
    const hfModels = await this.crawlLLMs(30);
    
    if (hfModels.length === 0) {
      console.log('❌ 没有抓取到模型');
      return;
    }

    // 转换为魔盘格式
    const models = hfModels.map(m => this.convertToModelFormat(m));
    
    // 保存到 JSON 文件
    const outputPath = path.join(__dirname, '../../../data/hf-models.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(models, null, 2));
    
    console.log('\n📁 已保存到:', outputPath);
    console.log('\n📊 抓取结果预览:');
    console.log('═'.repeat(60));
    
    models.slice(0, 10).forEach((m, i) => {
      console.log(`${i + 1}. ${m.name}`);
      console.log(`   提供商: ${m.provider}`);
      console.log(`   下载量: ${m.downloads?.toLocaleString() || 0}`);
      console.log(`   标签: ${m.tags.slice(0, 4).join(', ')}`);
      console.log('─'.repeat(60));
    });
    
    console.log(`\n🎉 共抓取 ${models.length} 个免费模型！`);
  }
}

if (require.main === module) {
  const crawler = new HuggingFaceCrawlerJson();
  crawler.run().catch(console.error);
}
