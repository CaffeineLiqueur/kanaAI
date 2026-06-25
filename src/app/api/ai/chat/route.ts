import { NextRequest, NextResponse } from 'next/server';

// 动态导入AI SDK
async function getAIModel(provider: string) {
  if (provider === 'anthropic') {
    const { anthropic } = await import('@ai-sdk/anthropic');
    return anthropic(process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022');
  } else {
    const { openai } = await import('@ai-sdk/openai');
    return openai(process.env.OPENAI_MODEL || 'gpt-4o');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt, provider } = await request.json();

    const aiProvider = provider || process.env.AI_PROVIDER || 'anthropic';
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
