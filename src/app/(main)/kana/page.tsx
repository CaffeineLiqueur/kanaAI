'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, Logo } from '@/components/ui';
import { PlayButton } from '@/components/ui';

const hiraganaData = [
  { char: 'あ', romaji: 'a', group: 'あ行' },
  { char: 'い', romaji: 'i', group: 'あ行' },
  { char: 'う', romaji: 'u', group: 'あ行' },
  { char: 'え', romaji: 'e', group: 'あ行' },
  { char: 'お', romaji: 'o', group: 'あ行' },
  { char: 'か', romaji: 'ka', group: 'か行' },
  { char: 'き', romaji: 'ki', group: 'か行' },
  { char: 'く', romaji: 'ku', group: 'か行' },
  { char: 'け', romaji: 'ke', group: 'か行' },
  { char: 'こ', romaji: 'ko', group: 'か行' },
  { char: 'さ', romaji: 'sa', group: 'さ行' },
  { char: 'し', romaji: 'shi', group: 'さ行' },
  { char: 'す', romaji: 'su', group: 'さ行' },
  { char: 'せ', romaji: 'se', group: 'さ行' },
  { char: 'そ', romaji: 'so', group: 'さ行' },
  { char: 'た', romaji: 'ta', group: 'た行' },
  { char: 'ち', romaji: 'chi', group: 'た行' },
  { char: 'つ', romaji: 'tsu', group: 'た行' },
  { char: 'て', romaji: 'te', group: 'た行' },
  { char: 'と', romaji: 'to', group: 'た行' },
  { char: 'な', romaji: 'na', group: 'な行' },
  { char: 'に', romaji: 'ni', group: 'な行' },
  { char: 'ぬ', romaji: 'nu', group: 'な行' },
  { char: 'ね', romaji: 'ne', group: 'な行' },
  { char: 'の', romaji: 'no', group: 'な行' },
];

const katakanaData = [
  { char: 'ア', romaji: 'a', group: 'ア行' },
  { char: 'イ', romaji: 'i', group: 'ア行' },
  { char: 'ウ', romaji: 'u', group: 'ア行' },
  { char: 'エ', romaji: 'e', group: 'ア行' },
  { char: 'オ', romaji: 'o', group: 'ア行' },
  { char: 'カ', romaji: 'ka', group: 'カ行' },
  { char: 'キ', romaji: 'ki', group: 'カ行' },
  { char: 'ク', romaji: 'ku', group: 'カ行' },
  { char: 'ケ', romaji: 'ke', group: 'カ行' },
  { char: 'コ', romaji: 'ko', group: 'カ行' },
  { char: 'サ', romaji: 'sa', group: 'サ行' },
  { char: 'シ', romaji: 'shi', group: 'サ行' },
  { char: 'ス', romaji: 'su', group: 'サ行' },
  { char: 'セ', romaji: 'se', group: 'サ行' },
  { char: 'ソ', romaji: 'so', group: 'サ行' },
];

export default function KanaPage() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<typeof hiraganaData[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  const currentData = activeTab === 'hiragana' ? hiraganaData : katakanaData;
  const groups = [...new Set(currentData.map(k => k.group))];

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch('/api/progress?module=kana');
        if (res.ok) {
          const data = await res.json();
          const progressMap: Record<string, boolean> = {};
          data.progress.forEach((p: { itemId: string; mastered: boolean }) => {
            progressMap[p.itemId] = p.mastered;
          });
          setProgress(progressMap);
        }
      } catch {}
    }
    loadProgress();
  }, []);

  const masteredCount = currentData.filter(k => progress[k.char]).length;

  const handleKanaClick = (kana: typeof hiraganaData[0]) => {
    setSelectedKana(kana);
    setShowQuiz(false);
    setQuizFeedback(null);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setQuizAnswer('');
    setQuizFeedback(null);
  };

  const handleQuizSubmit = async () => {
    if (!selectedKana) return;
    const isCorrect = quizAnswer.toLowerCase() === selectedKana.romaji;
    setQuizFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module: 'kana',
            itemId: selectedKana.char,
            mastered: true,
          }),
        });
        setProgress(prev => ({ ...prev, [selectedKana.char]: true }));
      } catch {}
    }
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b-[1.5px] border-[var(--ink)] bg-[var(--paper)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <Link href="/dashboard">
            <PixelButton variant="ghost" size="sm">← 戻る</PixelButton>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Title */}
        <section className="mb-10 fade-up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-7">
              <div className="label-text mb-2">第 01 章</div>
              <h1 className="heading-lg mb-2">
                仮名<span style={{ color: 'var(--vermillion)' }}> · </span>
                <span className="writing-vertical text-[1.2rem] inline-block align-middle opacity-60">五十音</span>
              </h1>
              <p className="body-text opacity-70">日本語の土台 — 五十音を一つずつマスターしよう。</p>
            </div>
            <div className="md:col-span-5">
              <PixelCard>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="label-text" style={{ color: 'var(--vermillion)' }}>習得</span>
                    <span className="font-mono text-[0.85rem] tabular-nums">
                      {masteredCount}<span className="opacity-40">/</span>{currentData.length}
                    </span>
                  </div>
                  <PixelProgress
                    value={masteredCount}
                    max={currentData.length}
                    variant="vermillion"
                  />
                </div>
              </PixelCard>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-8 flex items-center gap-6 border-b-[1.5px] border-[var(--ink)]">
          <button
            onClick={() => setActiveTab('hiragana')}
            className={`py-3 -mb-[1.5px] border-b-[2px] transition-colors font-display ${
              activeTab === 'hiragana'
                ? 'border-[var(--vermillion)] text-[var(--ink)]'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <span className="text-[0.7rem] block opacity-60 mb-0.5">No. 01</span>
            <span className="text-base font-medium">平仮名 · Hiragana</span>
          </button>
          <button
            onClick={() => setActiveTab('katakana')}
            className={`py-3 -mb-[1.5px] border-b-[2px] transition-colors font-display ${
              activeTab === 'katakana'
                ? 'border-[var(--cobalt)] text-[var(--ink)]'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <span className="text-[0.7rem] block opacity-60 mb-0.5">No. 02</span>
            <span className="text-base font-medium">片仮名 · Katakana</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kana grid */}
          <div className="lg:col-span-7">
            {groups.map((group, gi) => (
              <div key={group} className="mb-8 fade-up" style={{ animationDelay: `${gi * 60}ms` }}>
                <div className="flex items-baseline gap-3 mb-3">
                  <h3 className="font-display text-sm font-medium">{group}</h3>
                  <span className="h-[1px] flex-1 bg-[var(--ink)] opacity-15"></span>
                  <span className="label-text opacity-40">{group}行</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {currentData
                    .filter(k => k.group === group)
                    .map((kana) => {
                      const isMastered = progress[kana.char];
                      const isSelected = selectedKana?.char === kana.char;

                      return (
                        <button
                          key={kana.char}
                          onClick={() => handleKanaClick(kana)}
                          className={`aspect-square border-[1.5px] flex flex-col items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                              : isMastered
                              ? 'border-[var(--sage)] bg-[var(--sage)] bg-opacity-10 text-[var(--ink)]'
                              : 'border-[var(--ink)] border-opacity-15 hover:border-opacity-60 bg-[var(--paper)] text-[var(--ink)]'
                          }`}
                        >
                          <span className="font-display text-2xl font-medium">{kana.char}</span>
                          <span className={`text-[0.6rem] font-mono mt-0.5 ${isSelected ? 'opacity-80' : 'opacity-50'}`}>
                            {kana.romaji}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-5">
            {selectedKana ? (
              <div className="sticky top-8">
                <PixelCard className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 halftone-cobalt w-32 h-32 opacity-20 pointer-events-none"></div>

                  <div className="relative">
                    <div className="label-text mb-2">{selectedKana.group}</div>

                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="font-display text-7xl font-medium">{selectedKana.char}</span>
                      <div className="flex flex-col">
                        <span className="font-mono text-xl">{selectedKana.romaji}</span>
                        <span className="caption-text">romaji</span>
                      </div>
                      <div className="ml-auto">
                        <PlayButton text={selectedKana.char} size="md" />
                      </div>
                    </div>

                    <div className="divider-line mb-5"></div>

                    <dl className="space-y-3 mb-6">
                      <div className="flex justify-between items-baseline">
                        <dt className="label-text opacity-60">仮名</dt>
                        <dd className="font-display text-base">{selectedKana.char}</dd>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <dt className="label-text opacity-60">ローマ字</dt>
                        <dd className="font-mono text-base">{selectedKana.romaji}</dd>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <dt className="label-text opacity-60">行</dt>
                        <dd className="font-body text-base">{selectedKana.group}</dd>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <dt className="label-text opacity-60">状態</dt>
                        <dd>
                          {progress[selectedKana.char] ? (
                            <PixelBadge variant="success" filled>習得済</PixelBadge>
                          ) : (
                            <PixelBadge variant="default">未学習</PixelBadge>
                          )}
                        </dd>
                      </div>
                    </dl>

                    {showQuiz ? (
                      <div className="border-t-[1.5px] border-[var(--ink)] pt-5">
                        <div className="label-text mb-2" style={{ color: 'var(--vermillion)' }}>小テスト</div>
                        <p className="body-text mb-3">「{selectedKana.char}」のローマ字は?</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={quizAnswer}
                            onChange={(e) => setQuizAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuizSubmit()}
                            className="input-field flex-1"
                            placeholder="入力..."
                            autoFocus
                          />
                          <PixelButton onClick={handleQuizSubmit} size="sm">回答</PixelButton>
                        </div>
                        {quizFeedback && (
                          <div className={`mt-3 p-3 text-[0.85rem] font-body border-l-[3px] ${
                            quizFeedback === 'correct'
                              ? 'border-[var(--sage)] bg-[var(--sage)] bg-opacity-10'
                              : 'border-[var(--vermillion)] bg-[var(--vermillion)] bg-opacity-10'
                          }`}>
                            {quizFeedback === 'correct'
                              ? '✓ 正解 — すごい!'
                              : `× 不正解 — 正解は「${selectedKana.romaji}」`}
                          </div>
                        )}
                      </div>
                    ) : (
                      <PixelButton onClick={handleStartQuiz} variant="primary" className="w-full">
                        小テストを始める
                      </PixelButton>
                    )}
                  </div>
                </PixelCard>
              </div>
            ) : (
              <PixelCard>
                <div className="text-center py-8">
                  <div className="writing-vertical text-3xl opacity-30 mx-auto mb-4 inline-block">仮名を選ぶ</div>
                  <p className="caption-text">左の表から文字をクリックして、詳細を確認しよう。</p>
                </div>
              </PixelCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
