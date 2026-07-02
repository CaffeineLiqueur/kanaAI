'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PixelButton, PixelBadge, PlayButton, SpeakerSelector, Logo } from '@/components/ui';
import { useTTS } from '@/lib/tts/useTTS';
import { useTTSSettings } from '@/lib/tts/TTSContext';

function extractJapaneseText(text: string): string {
  const lines = text.split('\n');
  const japaneseLines = lines.filter(line => {
    return /[぀-ゟ゠-ヿ一-龯]/.test(line) &&
      !/^[（(].*[）)]$/.test(line.trim());
  });
  return japaneseLines
    .map(line => line.replace(/[（(][^）)]*[）)]/g, '').trim())
    .filter(line => line.length > 0)
    .join('。');
}

const scenes = [
  {
    id: 'self-introduction',
    title: '自己紹介',
    descriptionCn: '练习自我介绍',
    icon: '👋',
    difficulty: 'beginner',
    vocabulary: ['名前', '出身', '仕事', '趣味'],
  },
  {
    id: 'restaurant',
    title: 'レストラン',
    descriptionCn: '在餐厅点餐',
    icon: '🍜',
    difficulty: 'beginner',
    vocabulary: ['メニュー', '注文', 'おいしい', 'お会計'],
  },
  {
    id: 'shopping',
    title: '買い物',
    descriptionCn: '在商店购物',
    icon: '🛒',
    difficulty: 'beginner',
    vocabulary: ['いくら', 'これ', '大きい', '小さい'],
  },
  {
    id: 'directions',
    title: '道案内',
    descriptionCn: '问路',
    icon: '🗺️',
    difficulty: 'intermediate',
    vocabulary: ['どこ', '右', '左', 'まっすぐ'],
  },
  {
    id: 'weather',
    title: '天気',
    descriptionCn: '谈论天气',
    icon: '☀️',
    difficulty: 'beginner',
    vocabulary: ['天気', '暑い', '寒い', '雨'],
  },
  {
    id: 'hobby',
    title: '趣味',
    descriptionCn: '谈论爱好',
    icon: '🎮',
    difficulty: 'beginner',
    vocabulary: ['趣味', '好き', 'スポーツ', '音楽'],
  },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PracticePage() {
  const [selectedScene, setSelectedScene] = useState<typeof scenes[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { play } = useTTS();
  const ttsSettings = useTTSSettings();
  const prevMessageCountRef = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ttsSettings.autoPlay || !ttsSettings.enabled) return;
    if (messages.length <= prevMessageCountRef.current) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'assistant') {
      const japaneseText = extractJapaneseText(lastMessage.content);
      if (japaneseText) play(japaneseText, ttsSettings.speaker);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, ttsSettings.autoPlay, ttsSettings.enabled, ttsSettings.speaker, play]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSceneSelect = (scene: typeof scenes[0]) => {
    setSelectedScene(scene);
    setMessages([{
      role: 'assistant',
      content: `こんにちは!${scene.title}のシーンを練習しましょう!\n你好!让我们一起练习${scene.title}的场景。\n\n簡単な日本語で話してください。分からないことは中国語で聞いてくださいね。`,
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          systemPrompt: `你是一个日语对话练习助手。当前场景:${selectedScene?.title}。用简单的日语和中文解释与用户对话,温柔地纠正错误,鼓励用户多说。`,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content || 'もう一度言ってください。',
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'エラーが発生しました。もう一度試してください。',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b-[1.5px] border-[var(--ink)] bg-[var(--paper)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <SpeakerSelector />
            <Link href="/dashboard">
              <PixelButton variant="ghost" size="sm">← 戻る</PixelButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="mb-8 fade-up">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="label-text mb-2">第 05 章 — 会話</div>
              <h1 className="heading-lg">AI 会話練習</h1>
            </div>
            <span className="label-text opacity-50">{scenes.length} シーン</span>
          </div>
          <p className="body-text opacity-70 mt-3">AI と一緒に、日本語で会話しよう。</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scene selection */}
          <div className="lg:col-span-4">
            <div className="label-text mb-3">シーンを選ぶ</div>
            <div className="flex flex-col gap-2">
              {scenes.map((scene, i) => {
                const isSelected = selectedScene?.id === scene.id;

                return (
                  <button
                    key={scene.id}
                    onClick={() => handleSceneSelect(scene)}
                    className={`p-3 border-[1.5px] text-left transition-all duration-200 fade-up ${
                      isSelected
                        ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                        : 'border-[var(--ink)] border-opacity-15 hover:border-opacity-60 bg-[var(--paper)]'
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{scene.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm font-medium">{scene.title}</div>
                        <div className={`text-[0.7rem] font-body ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                          {scene.descriptionCn}
                        </div>
                      </div>
                      <PixelBadge variant={scene.difficulty === 'beginner' ? 'success' : 'level'}>
                        {scene.difficulty === 'beginner' ? '初級' : '中級'}
                      </PixelBadge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-8">
            {selectedScene ? (
              <div className="border-[1.5px] border-[var(--ink)] flex flex-col h-[600px] bg-[var(--paper)]">
                {/* Chat header */}
                <div className="px-5 py-4 border-b-[1.5px] border-[var(--ink)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedScene.icon}</span>
                    <div>
                      <div className="font-display text-base font-medium">{selectedScene.title}</div>
                      <div className="caption-text">{selectedScene.descriptionCn}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-w-[40%] justify-end">
                    {selectedScene.vocabulary.map(word => (
                      <span key={word} className="text-[0.65rem] font-mono opacity-50 px-1.5 py-0.5 border border-[var(--ink)] border-opacity-20">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-end gap-2 fade-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {msg.role === 'assistant' && (
                        <PlayButton text={extractJapaneseText(msg.content) || msg.content} size="sm" />
                      )}
                      <div
                        className={`max-w-[80%] p-3.5 ${
                          msg.role === 'user'
                            ? 'bg-[var(--ink)] text-[var(--paper)]'
                            : 'bg-[var(--paper-warm)] border-[1.5px] border-[var(--ink)] border-opacity-15'
                        }`}
                      >
                        <div className="text-[0.85rem] font-body whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 fade-up">
                      <div className="px-4 py-3 border-[1.5px] border-[var(--ink)] border-opacity-15 bg-[var(--paper-warm)]">
                        <div className="flex items-center gap-2">
                          <span className="label-text opacity-50">考え中</span>
                          <span className="drift inline-block">...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input area */}
                <div className="border-t-[1.5px] border-[var(--ink)] p-4 bg-[var(--paper-warm)]">
                  <div className="flex gap-3 items-end">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="日本語で入力...  用日语输入..."
                      className="input-field flex-1"
                      disabled={isLoading}
                    />
                    <PixelButton onClick={handleSend} disabled={isLoading} variant="primary">
                      送信 →
                    </PixelButton>
                  </div>
                  <div className="mt-3 label-text opacity-50">ヒント: 短い文から始めよう</div>
                </div>
              </div>
            ) : (
              <div className="border-[1.5px] border-dashed border-[var(--ink)] border-opacity-30 h-[600px] flex items-center justify-center bg-[var(--paper-warm)]">
                <div className="text-center">
                  <div className="writing-vertical text-3xl opacity-30 mx-auto mb-4 inline-block">シーンを選ぶ</div>
                  <p className="caption-text">左のリストから会話シーンを選んで、始めよう。</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
