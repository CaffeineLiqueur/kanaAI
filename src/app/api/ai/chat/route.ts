import { NextRequest, NextResponse } from 'next/server';
import { aiConfig } from '@/lib/ai/config';

// 动态导入AI SDK
async function getAIModel(provider: string) {
  if (provider === 'anthropic') {
    const { createAnthropic } = await import('@ai-sdk/anthropic');
    const anthropic = createAnthropic({
      baseURL: aiConfig.anthropic.baseURL,
    });
    return anthropic(aiConfig.anthropic.model);
  } else {
    const { createOpenAI } = await import('@ai-sdk/openai');
    const openai = createOpenAI({
      baseURL: aiConfig.openai.baseURL,
    });
    return openai(aiConfig.openai.model);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt, provider } = await request.json();

    const aiProvider = provider || aiConfig.provider;
    const model = await getAIModel(aiProvider);

    const { streamText } = await import('ai');

    const result = streamText({
      model,
      system: systemPrompt || '你是一位耐心的日语老师，正在教一个零基础的中国学生。请用中文回答。',
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'AIサービスに接続できません。' },
      { status: 500 }
    );
  }
}
