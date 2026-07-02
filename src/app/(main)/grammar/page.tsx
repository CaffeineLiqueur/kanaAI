'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PlayButton } from '@/components/ui';

const grammarData = [
  {
    id: '1', title: 'は (wa)', titleCn: '主题标记助词', level: 'N5',
    explanation: '「は」用于标记句子的主题，表示"关于..."。',
    examples: [
      { jp: '私は学生です。', cn: '我是学生。', romaji: 'Watashi wa gakusei desu.' },
      { jp: 'これは本です。', cn: '这是书。', romaji: 'Kore wa hon desu.' },
      { jp: '東京は大きいです。', cn: '东京很大。', romaji: 'Toukyou wa ookii desu.' },
    ],
    tips: '「は」读作"wa"，但作为助词时读作"wa"。',
    category: '助詞',
  },
  {
    id: '2', title: 'が (ga)', titleCn: '主语标记助词', level: 'N5',
    explanation: '「が」用于标记句子的主语，特别用于新信息或强调。',
    examples: [
      { jp: '猫がいます。', cn: '有猫。', romaji: 'Neko ga imasu.' },
      { jp: '誰が来ましたか？', cn: '谁来了？', romaji: 'Dare ga kimashita ka?' },
      { jp: '水がほしいです。', cn: '想要水。', romaji: 'Mizu ga hoshii desu.' },
    ],
    tips: '「が」常用于存在动词（いる/ある）和愿望表达（ほしい/たい）。',
    category: '助詞',
  },
  {
    id: '3', title: 'を (wo)', titleCn: '宾语标记助词', level: 'N5',
    explanation: '「を」用于标记动作的对象（宾语）。',
    examples: [
      { jp: 'ご飯を食べます。', cn: '吃饭。', romaji: 'Gohan wo tabemasu.' },
      { jp: '本を読みます。', cn: '读书。', romaji: 'Hon wo yomimasu.' },
      { jp: '音楽を聞きます。', cn: '听音乐。', romaji: 'Ongaku wo kikimasu.' },
    ],
    tips: '「を」读作"o"，但写作"wo"。',
    category: '助詞',
  },
  {
    id: '4', title: 'に (ni)', titleCn: '时间/地点标记', level: 'N5',
    explanation: '「に」用于标记时间点、目的地、存在的地点。',
    examples: [
      { jp: '7時に起きます。', cn: '7点起床。', romaji: 'Shichi-ji ni okimasu.' },
      { jp: '学校に行きます。', cn: '去学校。', romaji: 'Gakkou ni ikimasu.' },
      { jp: '机の上にあります。', cn: '在桌子上。', romaji: 'Tsukue no ue ni arimasu.' },
    ],
    tips: '「に」表示"在..."或"到..."。',
    category: '助詞',
  },
  {
    id: '5', title: 'で (de)', titleCn: '场所/手段标记', level: 'N5',
    explanation: '「で」用于标记动作发生的场所、使用的手段或材料。',
    examples: [
      { jp: '食堂で食べます。', cn: '在食堂吃。', romaji: 'Shokudou de tabemasu.' },
      { jp: 'バスで行きます。', cn: '坐公交去。', romaji: 'Basu de ikimasu.' },
      { jp: '日本語で話します。', cn: '用日语说。', romaji: 'Nihongo de hanashimasu.' },
    ],
    tips: '「で」表示"在...（做）"或"用...（做）"。',
    category: '助詞',
  },
];

export default function GrammarPage() {
  const [selectedGrammar, setSelectedGrammar] = useState<typeof grammarData[0] | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [masteredItems, setMasteredItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch('/api/progress?module=grammar');
        if (res.ok) {
          const data = await res.json();
          const mastered = new Set<string>(
            data.progress
              .filter((p: { mastered: boolean }) => p.mastered)
              .map((p: { itemId: string }) => p.itemId)
          );
          setMasteredItems(mastered);
        }
      } catch {}
    }
    loadProgress();
  }, []);

  const markAsMastered = async (grammarId: string) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'grammar',
          itemId: grammarId,
          mastered: true,
        }),
      });
      setMasteredItems(prev => new Set([...prev, grammarId]));
    } catch {}
  };

  const handleGrammarClick = (grammar: typeof grammarData[0]) => {
    setSelectedGrammar(grammar);
    setShowExplanation(false);
    setCurrentExample(0);
  };

  const handleNextExample = () => {
    if (selectedGrammar && currentExample < selectedGrammar.examples.length - 1) {
      setCurrentExample(prev => prev + 1);
    }
  };

  const handlePrevExample = () => {
    if (currentExample > 0) {
      setCurrentExample(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b-[1.5px] border-[var(--ink)] bg-[var(--paper)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-medium tracking-tight">kana</span>
            <span className="font-display text-2xl font-medium tracking-tight" style={{ color: 'var(--vermillion)' }}>AI</span>
          </Link>
          <Link href="/dashboard">
            <PixelButton variant="ghost" size="sm">← 戻る</PixelButton>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="mb-10 fade-up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-7">
              <div className="label-text mb-2">第 03 章</div>
              <h1 className="heading-lg mb-2">
                文法<span style={{ color: 'var(--mustard-dark)' }}> · </span>
                <span className="writing-vertical text-[1.2rem] inline-block align-middle opacity-60">助詞</span>
              </h1>
              <p className="body-text opacity-70">日本語の骨格 — 基本助詞をマスターしよう。</p>
            </div>
            <div className="md:col-span-5">
              <PixelCard>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="label-text" style={{ color: 'var(--mustard-dark)' }}>習得</span>
                    <span className="font-mono text-[0.85rem] tabular-nums">
                      {masteredItems.size}<span className="opacity-40">/</span>{grammarData.length}
                    </span>
                  </div>
                  <PixelProgress value={masteredItems.size} max={grammarData.length} variant="mustard" />
                </div>
              </PixelCard>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Grammar list */}
          <div className="lg:col-span-4">
            <div className="label-text mb-3">目次</div>
            <div className="flex flex-col gap-2">
              {grammarData.map((grammar, i) => {
                const isSelected = selectedGrammar?.id === grammar.id;
                const isMastered = masteredItems.has(grammar.id);

                return (
                  <button
                    key={grammar.id}
                    onClick={() => handleGrammarClick(grammar)}
                    className={`p-4 border-[1.5px] text-left transition-all duration-200 fade-up ${
                      isSelected
                        ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                        : 'border-[var(--ink)] border-opacity-15 hover:border-opacity-60 bg-[var(--paper)]'
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-base font-medium truncate">
                          {grammar.title}
                        </div>
                        <div className={`text-[0.75rem] font-body ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                          {grammar.titleCn}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isMastered && (
                          <span className={isSelected ? 'text-[var(--paper)]' : ''} style={{ color: isSelected ? undefined : 'var(--sage)' }}>✓</span>
                        )}
                        <span className={`label-text ${isSelected ? 'opacity-80' : 'opacity-50'}`}>
                          {grammar.level}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grammar detail */}
          <div className="lg:col-span-8">
            {selectedGrammar ? (
              <PixelCard className="relative overflow-hidden">
                <div className="absolute top-0 right-0 halftone-red w-40 h-40 opacity-15 pointer-events-none"></div>

                <div className="relative">
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="label-text" style={{ color: 'var(--mustard-dark)' }}>助詞 — 第 {selectedGrammar.id} 課</div>
                    <PixelBadge variant="mustard">{selectedGrammar.level}</PixelBadge>
                  </div>

                  <h2 className="font-display text-4xl font-medium mb-2">{selectedGrammar.title}</h2>
                  <p className="body-text opacity-70 mb-6">{selectedGrammar.titleCn}</p>

                  <div className="divider-line mb-5"></div>

                  {/* Explanation */}
                  <div className="mb-6">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between p-4 border-[1.5px] border-[var(--ink)] hover:bg-[var(--paper-warm)] transition-colors">
                        <span className="font-display text-sm">解説 · 解释</span>
                        <span className="font-mono text-[0.8rem] opacity-60">
                          {showExplanation ? '− 閉じる' : '+ 開く'}
                        </span>
                      </div>
                    </button>
                    {showExplanation && (
                      <div className="p-4 border-[1.5px] border-t-0 border-[var(--ink)] bg-[var(--paper-warm)] fade-up">
                        <p className="body-text">{selectedGrammar.explanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Examples */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-3">
                      <h3 className="label-text">例文 · 例句</h3>
                      <span className="h-[1px] flex-1 bg-[var(--ink)] opacity-15"></span>
                    </div>
                    <div className="border-[1.5px] border-[var(--ink)] p-5">
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="font-display text-2xl">
                            {selectedGrammar.examples[currentExample].jp}
                          </span>
                          <PlayButton text={selectedGrammar.examples[currentExample].jp} size="sm" />
                        </div>
                        <div className="font-mono text-[0.75rem] opacity-50 mb-1">
                          {selectedGrammar.examples[currentExample].romaji}
                        </div>
                        <div className="font-body text-sm">
                          {selectedGrammar.examples[currentExample].cn}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-[1px] border-[var(--ink)] border-opacity-15">
                        <PixelButton size="sm" variant="ghost" onClick={handlePrevExample} disabled={currentExample === 0}>
                          ← 前へ
                        </PixelButton>
                        <span className="font-mono text-[0.7rem] opacity-50 tracking-wider">
                          {String(currentExample + 1).padStart(2, '0')} / {String(selectedGrammar.examples.length).padStart(2, '0')}
                        </span>
                        <PixelButton size="sm" variant="ghost" onClick={handleNextExample} disabled={currentExample === selectedGrammar.examples.length - 1}>
                          次へ →
                        </PixelButton>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="mb-6 p-4 border-l-[3px] border-[var(--mustard)] bg-[var(--mustard)] bg-opacity-5">
                    <div className="label-text mb-1" style={{ color: 'var(--mustard-dark)' }}>要点 · TIPS</div>
                    <p className="body-text">{selectedGrammar.tips}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {masteredItems.has(selectedGrammar.id) ? (
                      <div className="flex-1 py-3 text-center border-[1.5px] border-[var(--sage)] text-[var(--sage)] font-display">
                        ✓ 習得済 — 已掌握
                      </div>
                    ) : (
                      <PixelButton
                        className="flex-1"
                        variant="primary"
                        onClick={() => markAsMastered(selectedGrammar.id)}
                      >
                        ✓ 習得済みにする
                      </PixelButton>
                    )}
                    <Link href="/practice" className="flex-1">
                      <PixelButton className="w-full" variant="secondary">
                        会話で練習 →
                      </PixelButton>
                    </Link>
                  </div>
                </div>
              </PixelCard>
            ) : (
              <PixelCard>
                <div className="text-center py-12">
                  <div className="writing-vertical text-3xl opacity-30 mx-auto mb-4 inline-block">文法を選ぶ</div>
                  <p className="caption-text">左のリストから文法ポイントを選んで、詳しく学ぼう。</p>
                </div>
              </PixelCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
