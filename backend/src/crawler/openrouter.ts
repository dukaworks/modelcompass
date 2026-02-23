import axios from 'axios';
import { prisma } from '../utils/db';

interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  architecture?: {
    modality: string;
    tokenizer?: string;
  };
  top_provider?: {
    context_length?: number;
    max_completion_tokens?: number;
  };
}

/**
 * 从 OpenRouter API 抓取模型数据
 */
export async function crawlOpenRouter(): Promise<OpenRouterModel[]> {
  console.log('🔍 正在抓取 OpenRouter 模型数据...');
  
  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      timeout: 30000
    });
    
    const models = response.data.data || [];
    console.log(`✅ 获取到 ${models.length} 个模型`);
    
    return models;
  } catch (error) {
    console.error('❌ OpenRouter 抓取失败:', error.message);
    return [];
  }
}

/**
 * 解析模型提供商
 */
function parseProvider(modelId: string): string {
  const providerMap: Record<string, string> = {
    'anthropic': 'anthropic',
    'openai': 'openai',
    'google': 'google',
    'meta-llama': 'meta',
    'mistralai': 'mistral',
    'qwen': 'alibaba',
    'deepseek': 'deepseek',
    'nousresearch': 'nous',
    'microsoft': 'microsoft',
    'cohere': 'cohere',
    'perplexity': 'perplexity',
    'gryphe': 'gryphe',
    'sao10k': 'sao10k',
    'neversleep': 'neversleep',
    'undi95': 'undi95',
    'openrouter': 'openrouter'
  };
  
  const prefix = modelId.split('/')[0];
  return providerMap[prefix] || prefix;
}

/**
 * 推断模型能力
 */
function inferCapabilities(model: OpenRouterModel): string[] {
  const caps: string[] = ['chat'];
  const desc = (model.description || '').toLowerCase();
  const modality = model.architecture?.modality || '';
  
  // 视觉能力
  if (modality.includes('image') || desc.includes('vision') || desc.includes('multimodal')) {
    caps.push('vision');
  }
  
  // 代码能力
  if (desc.includes('code') || desc.includes('coding') || model.id.includes('coder')) {
    caps.push('code');
  }
  
  // 推理能力
  if (desc.includes('reasoning') || model.id.includes('reasoning') || desc.includes('math')) {
    caps.push('reasoning');
  }
  
  return caps;
}

/**
 * 生成模型标签
 */
function generateTags(model: OpenRouterModel, provider: string): string[] {
  const tags: string[] = [];
  const desc = (model.description || '').toLowerCase();
  
  // 提供商标签
  const providerTags: Record<string, string> = {
    'anthropic': 'Anthropic',
    'openai': 'OpenAI',
    'google': 'Google',
    'meta': 'Meta',
    'mistral': 'Mistral',
    'alibaba': '阿里',
    'deepseek': 'DeepSeek'
  };
  
  if (providerTags[provider]) {
    tags.push(providerTags[provider]);
  }
  
  // 能力标签
  if (desc.includes('free') || model.pricing?.prompt === 0) {
    tags.push('免费');
  }
  if (model.context_length > 100000) {
    tags.push('长上下文');
  }
  if (desc.includes('fast') || desc.includes('quick')) {
    tags.push('快速');
  }
  if (model.id.includes('instruct')) {
    tags.push('指令微调');
  }
  
  return tags;
}

/**
 * 同步 OpenRouter 模型到数据库
 */
export async function syncOpenRouterModels(): Promise<{ added: number; updated: number }> {
  const models = await crawlOpenRouter();
  let added = 0;
  let updated = 0;
  
  for (const model of models) {
    try {
      const modelId = model.id;
      const provider = parseProvider(modelId);
      
      // 准备数据
      const data = {
        modelId: modelId,
        name: model.name || modelId.split('/').pop() || modelId,
        provider: provider,
        description: model.description?.substring(0, 500) || null,
        capabilities: inferCapabilities(model),
        contextLength: model.context_length || model.top_provider?.context_length || 4096,
        maxTokens: model.top_provider?.max_completion_tokens || null,
        promptPrice: model.pricing?.prompt || 0,
        completionPrice: model.pricing?.completion || 0,
        tags: generateTags(model, provider),
        recommendedFor: ['通用任务'],
        websiteUrl: `https://openrouter.ai/models/${modelId}`,
        docsUrl: null,
        isActive: true
      };
      
      // 检查是否已存在
      const existing = await prisma.model.findUnique({
        where: { modelId }
      });
      
      if (existing) {
        // 更新价格等动态数据
        await prisma.model.update({
          where: { modelId },
          data: {
            promptPrice: data.promptPrice,
            completionPrice: data.completionPrice,
            contextLength: data.contextLength,
            updatedAt: new Date()
          }
        });
        updated++;
      } else {
        // 创建新模型
        await prisma.model.create({ data });
        added++;
      }
    } catch (error) {
      console.error(`❌ 处理模型 ${model.id} 失败:`, error.message);
    }
  }
  
  console.log(`\n📊 同步完成：新增 ${added} 个，更新 ${updated} 个`);
  return { added, updated };
}

// 如果直接运行此文件
if (require.main === module) {
  syncOpenRouterModels()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
