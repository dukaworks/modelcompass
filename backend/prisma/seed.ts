import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始播种数据库...');

  // 清空现有数据
  await prisma.model.deleteMany();

  // 创建模型数据
  const models = [
    {
      modelId: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'openai',
      description: 'OpenAI旗舰多模态模型，支持文本、图像、音频',
      capabilities: ['chat', 'vision', 'code', 'audio'],
      contextLength: 128000,
      maxTokens: 4096,
      promptPrice: 0.0025,
      completionPrice: 0.01,
      tags: ['多模态', '代码强', '通用', 'OpenAI'],
      recommendedFor: ['复杂推理', '视觉任务', '代码生成', '多模态应用'],
      codingScore: 92,
      reasoningScore: 95,
      writingScore: 90,
      chineseScore: 85,
      speedScore: 88,
      websiteUrl: 'https://openai.com/gpt-4o',
      docsUrl: 'https://platform.openai.com/docs/models/gpt-4o'
    },
    {
      modelId: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      description: 'Anthropic最强模型，超长上下文，安全且智能',
      capabilities: ['chat', 'vision', 'code'],
      contextLength: 200000,
      maxTokens: 8192,
      promptPrice: 0.003,
      completionPrice: 0.015,
      tags: ['长上下文', '写作强', '安全', 'Anthropic'],
      recommendedFor: ['长文档分析', '创意写作', '安全场景', '学术研究'],
      codingScore: 94,
      reasoningScore: 93,
      writingScore: 96,
      chineseScore: 82,
      speedScore: 85,
      websiteUrl: 'https://www.anthropic.com/claude',
      docsUrl: 'https://docs.anthropic.com/claude/docs'
    },
    {
      modelId: 'qwen-2-5-72b',
      name: 'Qwen 2.5 72B',
      provider: 'alibaba',
      description: '阿里云通义千问，中文优化，性价比极高',
      capabilities: ['chat', 'code'],
      contextLength: 32768,
      maxTokens: 8192,
      promptPrice: 0.00012,
      completionPrice: 0.00039,
      tags: ['中文强', '性价比', '开源', '国产'],
      recommendedFor: ['中文任务', '预算敏感', '快速响应', '国内业务'],
      codingScore: 85,
      reasoningScore: 86,
      writingScore: 88,
      chineseScore: 96,
      speedScore: 90,
      websiteUrl: 'https://qwenlm.github.io/',
      docsUrl: 'https://github.com/QwenLM/Qwen2.5'
    },
    {
      modelId: 'deepseek-v3',
      name: 'DeepSeek V3',
      provider: 'deepseek',
      description: 'DeepSeek最新MoE模型，推理和代码能力突出',
      capabilities: ['chat', 'code', 'reasoning'],
      contextLength: 163840,
      maxTokens: 8192,
      promptPrice: 0.00019,
      completionPrice: 0.00087,
      tags: ['推理强', '代码强', '国产', 'MoE'],
      recommendedFor: ['数学推理', '代码生成', '复杂任务', '长上下文'],
      codingScore: 93,
      reasoningScore: 94,
      writingScore: 84,
      chineseScore: 90,
      speedScore: 87,
      websiteUrl: 'https://www.deepseek.com/',
      docsUrl: 'https://github.com/deepseek-ai/DeepSeek-V3'
    },
    {
      modelId: 'gemini-1-5-pro',
      name: 'Gemini 1.5 Pro',
      provider: 'google',
      description: 'Google Gemini，100万token超长上下文',
      capabilities: ['chat', 'vision', 'code'],
      contextLength: 1048576,
      maxTokens: 8192,
      promptPrice: 0.00125,
      completionPrice: 0.005,
      tags: ['超长上下文', '多模态', 'Google'],
      recommendedFor: ['超长文档', '视频分析', '大规模代码库'],
      codingScore: 88,
      reasoningScore: 89,
      writingScore: 86,
      chineseScore: 80,
      speedScore: 85,
      websiteUrl: 'https://deepmind.google/technologies/gemini/',
      docsUrl: 'https://ai.google.dev/gemini-api/docs'
    },
    {
      modelId: 'mistral-large',
      name: 'Mistral Large',
      provider: 'mistral',
      description: 'Mistral AI旗舰模型，欧洲最强开源商模型',
      capabilities: ['chat', 'code'],
      contextLength: 128000,
      maxTokens: 8192,
      promptPrice: 0.002,
      completionPrice: 0.006,
      tags: ['欧洲', '多语言', 'Mistral'],
      recommendedFor: ['多语言任务', '欧洲合规', '通用助手'],
      codingScore: 87,
      reasoningScore: 88,
      writingScore: 87,
      chineseScore: 75,
      speedScore: 89,
      websiteUrl: 'https://mistral.ai/',
      docsUrl: 'https://docs.mistral.ai/'
    }
  ];

  for (const model of models) {
    await prisma.model.create({ data: model });
    console.log(`✅ 创建模型: ${model.name}`);
  }

  console.log('🎉 数据库播种完成！');
}

main()
  .catch((e) => {
    console.error('❌ 播种失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
