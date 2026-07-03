import { NextRequest, NextResponse } from 'next/server';
import { aiConfig } from '@/lib/ai/config';

// 动态导入AI SDK
async function getAIModel(provider: string) {
  if (provider === 'anthropic') {
    const { createAnthropic } = await import('@ai-sdk/anthropic');

    // 火山方舟 /api/coding 端点要求路径 /v1/messages,
    // 但 .env 里的 baseURL 是 /api/coding（不带 /v1）,
    // SDK 默认拼 /messages,所以这里在传给 SDK 之前补上 /v1。
    // 真正的 Anthropic（baseURL 已是 .../v1）则不动。
    const rawBaseURL = aiConfig.anthropic.baseURL || '';
    const adjustedBaseURL = /\/v\d+$/.test(rawBaseURL)
      ? rawBaseURL
      : `${rawBaseURL}/v1`;

    // 火山方舟的 thinking content block 不带 signature 字段,
    // 但 @ai-sdk/anthropic 严格校验它;这里拦截响应,给缺失的
    // signature 补一个 stub,让 SDK 解析通过。
    const rewriteFetch: typeof fetch = async (input, init) => {
      const res = await fetch(input, init);
      if (!res.ok || !res.headers.get('content-type')?.includes('json')) {
        return res;
      }
      try {
        const body = await res.clone().json();
        if (Array.isArray(body?.content)) {
          for (const block of body.content) {
            if (block && block.type === 'thinking' && !block.signature) {
              block.signature = 'stub-signature-volcengine-ark';
            }
          }
          return new Response(JSON.stringify(body), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        }
      } catch {
        // ignore parse errors, fall through to original response
      }
      return res;
    };

    const anthropic = createAnthropic({
      baseURL: adjustedBaseURL,
      apiKey: aiConfig.anthropic.apiKey,
      fetch: rewriteFetch,
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

    const { generateText } = await import('ai');

    const result = await generateText({
      model,
      system: systemPrompt || '你是一位耐心的日语老师，正在教一个零基础的中国学生。请用中文回答。',
      messages,
    });

    return NextResponse.json({ content: result.text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'AIサービスに接続できません。' },
      { status: 500 }
    );
  }
}
