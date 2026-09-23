import { after, NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { cacheAudio, getCachedAudio } from '@/lib/tts/cache';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VOICEVOX_URL = process.env.VOICEVOX_ENGINE_URL || 'http://localhost:50027';
const requestSchema = z.object({ text: z.string().trim().min(1).max(500), speaker: z.number().int().min(0).max(100).default(3) });

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: '文本需为 1 到 500 个字符' }, { status: 400 });
  try {
    const { text, speaker } = parsed.data;
    const cacheKey = createHash('sha256').update(`${speaker}:${text}`).digest('hex');
    const cached = getCachedAudio(cacheKey);
    if (cached) return audioResponse(cached, cacheKey, true);
    const signal = AbortSignal.timeout(8000);

    // Step 1: Create audio query
    const queryResponse = await fetch(
      `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`,
      { method: 'POST', signal }
    );

    if (!queryResponse.ok) {
      console.error('VOICEVOX audio_query error:', queryResponse.status);
      after(() => recordFailure('audio_query', queryResponse.status));
      return NextResponse.json(
        { error: '语音暂时不可用，你可以继续阅读课程内容。', recoverable: true },
        { status: 503 }
      );
    }

    const queryData = await queryResponse.json();

    // Step 2: Synthesize audio
    const synthesisResponse = await fetch(
      `${VOICEVOX_URL}/synthesis?speaker=${speaker}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryData),
        signal,
      }
    );

    if (!synthesisResponse.ok) {
      console.error('VOICEVOX synthesis error:', synthesisResponse.status);
      after(() => recordFailure('synthesis', synthesisResponse.status));
      return NextResponse.json(
        { error: '语音暂时不可用，你可以继续阅读课程内容。', recoverable: true },
        { status: 503 }
      );
    }

    // Return WAV audio
    const audioBuffer = await synthesisResponse.arrayBuffer();

    cacheAudio(cacheKey, audioBuffer);
    return audioResponse(audioBuffer, cacheKey, false);
  } catch (error) {
    console.error('TTS Error:', error);
    after(() => recordFailure('connection_or_timeout', null));
    return NextResponse.json(
      { error: '语音暂时不可用，你可以继续阅读课程内容。', recoverable: true },
      { status: 503 }
    );
  }
}

async function recordFailure(step: string, status: number | null) {
  try {
    const user = await getCurrentUser();
    await prisma.eventLog.create({ data: { userId: user?.id, name: 'tts_failed', payload: { step, status } } });
  } catch (error) {
    console.error('TTS event log error:', error);
  }
}

function audioResponse(bytes: ArrayBuffer, cacheKey: string, cached: boolean) {
  return new NextResponse(bytes, { headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'private, max-age=86400', 'X-TTS-Cache-Key': cacheKey, 'X-TTS-Cache': cached ? 'HIT' : 'MISS' } });
}
