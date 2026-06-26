import { NextRequest, NextResponse } from 'next/server';

const VOICEVOX_URL = process.env.VOICEVOX_ENGINE_URL || 'http://localhost:50027';

export async function POST(request: NextRequest) {
  try {
    const { text, speaker = 3 } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'テキストが必要です。（需要提供文本。）' },
        { status: 400 }
      );
    }

    // Step 1: Create audio query
    const queryResponse = await fetch(
      `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`,
      { method: 'POST' }
    );

    if (!queryResponse.ok) {
      console.error('VOICEVOX audio_query error:', queryResponse.status);
      return NextResponse.json(
        { error: '音声合成エンジンに接続できません。（无法连接语音合成引擎。）' },
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
      }
    );

    if (!synthesisResponse.ok) {
      console.error('VOICEVOX synthesis error:', synthesisResponse.status);
      return NextResponse.json(
        { error: '音声合成に失敗しました。（语音合成失败。）' },
        { status: 500 }
      );
    }

    // Return WAV audio
    const audioBuffer = await synthesisResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: '音声サービスに接続できません。（无法连接语音服务。）' },
      { status: 503 }
    );
  }
}
