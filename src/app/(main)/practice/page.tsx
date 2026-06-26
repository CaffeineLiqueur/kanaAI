'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelDialog, PixelBadge, PlayButton, SpeakerSelector } from '@/components/ui';
import { useTTS } from '@/lib/tts/useTTS';
import { useTTSSettings } from '@/lib/tts/TTSContext';

// Extract Japanese text from mixed JP/CN response
function extractJapaneseText(text: string): string {
  const lines = text.split('\n');
  const japaneseLines = lines.filter(line => {
    // Match lines containing hiragana, katakana, or common kanji
    return /[぀-ゟ゠-ヿ一-龯]/.test(line) &&
      // Exclude lines that are purely Chinese explanations (parenthesized)
      !/^[（(].*[）)]$/.test(line.trim());
  });
  // Remove parenthesized Chinese translations
  return japaneseLines
    .map(line => line.replace(/[（(][^）)]*[）)]/g, '').trim())
    .filter(line => line.length > 0)
    .join('。');
}

// 对话场景
const scenes = [
  {
    id: 'self-introduction',
    title: '自己紹介',
    description: '自己紹介を練習しよう！',
    descriptionCn: '练习自我介绍！',
    icon: '👋',
    difficulty: 'beginner',
    vocabulary: ['名前', '出身', '仕事', '趣味'],
  },
  {
    id: 'restaurant',
    title: 'レストラン',
    description: 'レストランで注文しよう！',
    descriptionCn: '在餐厅点餐！',
    icon: '🍜',
    difficulty: 'beginner',
    vocabulary: ['メニュー', '注文', 'おいしい', 'お会計'],
  },
  {
    id: 'shopping',
    title: '買い物',
    description: 'お店で買い物しよう！',
    descriptionCn: '在商店购物！',
    icon: '🛒',
    difficulty: 'beginner',
    vocabulary: ['いくら', 'これ', '大きい', '小さい'],
  },
  {
    id: 'directions',
    title: '道案内',
    description: '道を聞こう！',
    descriptionCn: '问路！',
    icon: '🗺️',
    difficulty: 'intermediate',
    vocabulary: ['どこ', '右', '左', 'まっすぐ'],
  },
  {
    id: 'weather',
    title: '天気',
    description: '天気について話そう！',
    descriptionCn: '谈论天气！',
    icon: '☀️',
    difficulty: 'beginner',
    vocabulary: ['天気', '暑い', '寒い', '雨'],
  },
  {
    id: 'hobby',
    title: '趣味',
    description: '趣味について話そう！',
    descriptionCn: '谈论爱好！',
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
  const { play, isPlaying } = useTTS();
  const ttsSettings = useTTSSettings();
  const prevMessageCountRef = useRef(0);

  // Auto-play when new assistant message arrives
  useEffect(() => {
    if (!ttsSettings.autoPlay || !ttsSettings.enabled) return;
    if (messages.length <= prevMessageCountRef.current) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'assistant') {
      const japaneseText = extractJapaneseText(lastMessage.content);
      if (japaneseText) {
        play(japaneseText, ttsSettings.speaker);
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, ttsSettings.autoPlay, ttsSettings.enabled, ttsSettings.speaker, play]);

  const handleSceneSelect = (scene: typeof scenes[0]) => {
    setSelectedScene(scene);
    setMessages([{
      role: 'assistant',
      content: `こんにちは！${scene.title}のシーンを練習しましょう！\n\n你好！让我们练习${scene.title}的场景吧！\n\n簡単な日本語で話してください。わからないことは中国語で聞いてくださいね。\n（请用简单的日语说话。不懂的地方可以用中文问我。）`,
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
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: `你是一个日语对话练习助手。
当前场景：${selectedScene?.title}
要求：
1. 用简单的日语和用户对话
2. 如果用户说错了，温柔地纠正并解释
3. 给出常用的表达方式
4. 适当放慢对话节奏
5. 鼓励用户多说
6. 每次回复都包含日语和中文解释`,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content || 'すみません、もう一度言ってください。（对不起，请再说一次。）',
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'エラーが発生しました。もう一度試してください。（发生错误，请重试。）',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E1] pixel-grid">
      {/* Header */}
      <header className="border-b-4 border-black bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF1C1C] border-3 border-black flex items-center justify-center">
                <span className="text-white text-lg">あ</span>
              </div>
              <h1 className="text-sm text-[#2D2D2D]">kanaAI</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2 relative">
            <Link href="/dashboard">
              <PixelButton variant="ghost" size="sm">← 返回仪表板</PixelButton>
            </Link>
            <SpeakerSelector />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg text-[#2D2D2D] mb-2">AI对话练习</h2>
          <p className="text-[10px] text-[#666666]">
            和AI用日语对话吧！可以选择不同场景练习。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scene Selection */}
          <div>
            <h3 className="text-xs mb-4">选择场景</h3>
            <div className="flex flex-col gap-3">
              {scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => handleSceneSelect(scene)}
                  className={`
                    p-4 border-3 border-black text-left transition-all
                    ${selectedScene?.id === scene.id
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-white hover:bg-[#FFD700]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{scene.icon}</span>
                    <div>
                      <div className="text-xs">{scene.title}</div>
                      <div className={`text-[10px] ${selectedScene?.id === scene.id ? 'text-white' : 'text-[#666666]'}`}>
                        {scene.descriptionCn}
                      </div>
                    </div>
                    <PixelBadge
                      variant={scene.difficulty === 'beginner' ? 'success' : 'level'}
                      size="sm"
                      className="ml-auto"
                    >
                      {scene.difficulty === 'beginner' ? '初级' : '中级'}
                    </PixelBadge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedScene ? (
              <PixelCard variant="elevated">
                {/* Scene Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b-3 border-black">
                  <span className="text-2xl">{selectedScene.icon}</span>
                  <div>
                    <h3 className="text-xs">{selectedScene.title}</h3>
                    <p className="text-[10px] text-[#666666]">{selectedScene.descriptionCn}</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    {selectedScene.vocabulary.map((word) => (
                      <PixelBadge key={word} variant="default" size="sm">{word}</PixelBadge>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto mb-4 p-4 bg-white border-2 border-black">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div className="flex items-end gap-2">
                        {msg.role === 'assistant' && (
                          <PlayButton
                            text={extractJapaneseText(msg.content) || msg.content}
                            size="sm"
                          />
                        )}
                        <div
                          className={`inline-block max-w-[80%] p-3 border-2 border-black ${
                            msg.role === 'user'
                              ? 'bg-[#3B82F6] text-white'
                              : 'bg-[#F5F0E1]'
                          }`}
                        >
                          <div className="text-xs whitespace-pre-wrap">{msg.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="text-left">
                      <div className="inline-block p-3 border-2 border-black bg-[#F5F0E1]">
                        <div className="text-xs">思考中...（思考中...）</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="请用日语输入...（请用日语输入...）"
                    className="flex-1 px-4 py-3 border-3 border-black font-pixel text-xs"
                    disabled={isLoading}
                  />
                  <PixelButton onClick={handleSend} disabled={isLoading}>
                    发送
                  </PixelButton>
                </div>

                {/* Tips */}
                <div className="mt-4 p-3 bg-[#FFD700] border-2 border-black">
                  <p className="text-[10px]">
                    💡 ヒント：簡単な文から始めてみましょう！
                    （提示：从简单的句子开始吧！）
                  </p>
                </div>
              </PixelCard>
            ) : (
              <PixelCard>
                <PixelDialog>
                  <p>请选择一个场景开始对话！</p>
                  <p className="text-[#666666] text-[10px] mt-2">
                    （选择一个场景开始对话吧！）
                  </p>
                </PixelDialog>
              </PixelCard>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-[10px] text-[#666666]">
            © 2024 kanaAI - 每天进步一点点！
          </p>
        </div>
      </footer>
    </div>
  );
}
