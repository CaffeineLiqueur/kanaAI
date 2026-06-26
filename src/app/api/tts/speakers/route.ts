import { NextResponse } from 'next/server';

const VOICEVOX_URL = process.env.VOICEVOX_ENGINE_URL || 'http://localhost:50027';

export async function GET() {
  try {
    const response = await fetch(`${VOICEVOX_URL}/speakers`);

    if (!response.ok) {
      return NextResponse.json(
        { error: '音声一覧を取得できません。（无法获取语音列表。）' },
        { status: 503 }
      );
    }

    const speakers = await response.json();

    // Simplify the response for frontend
    const simplified = speakers.map((speaker: {
      name: string;
      styles: { id: number; name: string }[];
      speaker_uuid: string;
    }) => ({
      name: speaker.name,
      uuid: speaker.speaker_uuid,
      styles: speaker.styles.map((style) => ({
        id: style.id,
        name: style.name,
      })),
    }));

    return NextResponse.json(simplified);
  } catch (error) {
    console.error('Speakers fetch error:', error);
    return NextResponse.json(
      { error: '音声サービスに接続できません。（无法连接语音服务。）' },
      { status: 503 }
    );
  }
}
