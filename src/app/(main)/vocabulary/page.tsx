'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PlayButton } from '@/components/ui';

const vocabularyData = [
  { id: '1', kanji: '一', hiragana: 'いち', romaji: 'ichi', meaning: '一', category: '数字', example: '一つください', exampleMeaning: '请给我一个' },
  { id: '2', kanji: '二', hiragana: 'に', romaji: 'ni', meaning: '二', category: '数字', example: '二人で行きます', exampleMeaning: '两个人去' },
  { id: '3', kanji: '三', hiragana: 'さん', romaji: 'san', meaning: '三', category: '数字', example: '三時に会いましょう', exampleMeaning: '三点见面吧' },
  { id: '4', kanji: 'こんにちは', hiragana: 'こんにちは', romaji: 'konnichiwa', meaning: '你好', category: '挨拶', example: 'こんにちは、元気ですか？', exampleMeaning: '你好，你好吗？' },
  { id: '5', kanji: 'ありがとう', hiragana: 'ありがとう', romaji: 'arigatou', meaning: '谢谢', category: '挨拶', example: 'ありがとうございます', exampleMeaning: '非常感谢' },
  { id: '6', kanji: 'すみません', hiragana: 'すみません', romaji: 'sumimasen', meaning: '对不起', category: '挨拶', example: 'すみません、道を教えてください', exampleMeaning: '不好意思，请告诉我路' },
  { id: '7', kanji: '水', hiragana: 'みず', romaji: 'mizu', meaning: '水', category: '食べ物', example: '水をください', exampleMeaning: '请给我水' },
  { id: '8', kanji: 'ご飯', hiragana: 'ごはん', romaji: 'gohan', meaning: '饭', category: '食べ物', example: 'ご飯を食べます', exampleMeaning: '吃饭' },
  { id: '9', kanji: '魚', hiragana: 'さかな', romaji: 'sakana', meaning: '鱼', category: '食べ物', example: '魚が好きです', exampleMeaning: '喜欢鱼' },
  { id: '10', kanji: 'お父さん', hiragana: 'おとうさん', romaji: 'otousan', meaning: '爸爸', category: '家族', example: 'お父さんは会社員です', exampleMeaning: '爸爸是公司职员' },
  { id: '11', kanji: 'お母さん', hiragana: 'おかあさん', romaji: 'okaasan', meaning: '妈妈', category: '家族', example: 'お母さんは先生です', exampleMeaning: '妈妈是老师' },
];

interface VocabProgressItem {
  wordId: string;
  level: number;
  correctCount: number;
  wrongCount: number;
}

export default function VocabularyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<typeof vocabularyData[0] | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabProgress, setVocabProgress] = useState<Record<string, VocabProgressItem>>({});

  const categories = ['', ...Array.from(new Set(vocabularyData.map(w => w.category)))];

  const filteredWords = selectedCategory
    ? vocabularyData.filter(w => w.category === selectedCategory)
    : vocabularyData;

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch('/api/vocab-progress');
        if (res.ok) {
          const data = await res.json();
          const progressMap: Record<string, VocabProgressItem> = {};
          data.vocabProgress.forEach((p: VocabProgressItem) => {
            progressMap[p.wordId] = p;
          });
          setVocabProgress(progressMap);
        }
      } catch {}
    }
    loadProgress();
  }, []);

  const masteredCount = vocabularyData.filter(w => (vocabProgress[w.id]?.level ?? 0) >= 4).length;

  const handleWordClick = (word: typeof vocabularyData[0]) => {
    setSelectedWord(word);
    setIsFlipped(false);
  };

  const handleKnow = async () => {
    if (!selectedWord) return;
    setIsFlipped(true);
    try {
      const res = await fetch('/api/vocab-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId: selectedWord.id, correct: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setVocabProgress(prev => ({ ...prev, [selectedWord.id]: data.vocabProgress }));
      }
    } catch {}
  };

  const handleDontKnow = async () => {
    if (!selectedWord) return;
    setIsFlipped(true);
    try {
      const res = await fetch('/api/vocab-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId: selectedWord.id, correct: false }),
      });
      if (res.ok) {
        const data = await res.json();
        setVocabProgress(prev => ({ ...prev, [selectedWord.id]: data.vocabProgress }));
      }
    } catch {}
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
              <div className="label-text mb-2">第 02 章</div>
              <h1 className="heading-lg mb-2">
                語彙<span style={{ color: 'var(--cobalt)' }}> · </span>
                <span className="writing-vertical text-[1.2rem] inline-block align-middle opacity-60">単語</span>
              </h1>
              <p className="body-text opacity-70">カード形式で効率的に。基本単語を一つずつ覚えよう。</p>
            </div>
            <div className="md:col-span-5">
              <PixelCard>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="label-text" style={{ color: 'var(--cobalt)' }}>習得</span>
                    <span className="font-mono text-[0.85rem] tabular-nums">
                      {masteredCount}<span className="opacity-40">/</span>{vocabularyData.length}
                    </span>
                  </div>
                  <PixelProgress value={masteredCount} max={vocabularyData.length} variant="cobalt" />
                </div>
              </PixelCard>
            </div>
          </div>
        </section>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat || 'all'}
              onClick={() => setSelectedCategory(cat || null)}
              className={`px-4 py-1.5 text-[0.8rem] font-mono tracking-wider border-[1.5px] transition-colors ${
                (cat === '' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                  : 'border-[var(--ink)] border-opacity-30 hover:border-opacity-100 text-[var(--ink)]'
              }`}
            >
              {cat || '全部'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Word list */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredWords.map((word, i) => {
                const progress = vocabProgress[word.id];
                const isMastered = (progress?.level ?? 0) >= 4;
                const isSelected = selectedWord?.id === word.id;

                return (
                  <button
                    key={word.id}
                    onClick={() => handleWordClick(word)}
                    className={`p-4 border-[1.5px] text-left transition-all duration-200 fade-up ${
                      isSelected
                        ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                        : isMastered
                        ? 'border-[var(--cobalt)] bg-[var(--cobalt)] bg-opacity-10'
                        : 'border-[var(--ink)] border-opacity-15 hover:border-opacity-60 bg-[var(--paper)]'
                    }`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="font-display text-2xl font-medium mb-1">{word.kanji}</div>
                    <div className={`text-[0.7rem] font-mono ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                      {word.hiragana} · {word.romaji}
                    </div>
                    {progress && progress.level > 0 && (
                      <div className="mt-2 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(level => (
                          <div
                            key={level}
                            className={`h-1 flex-1 ${
                              level <= progress.level
                                ? isSelected ? 'bg-[var(--paper)]' : 'bg-[var(--cobalt)]'
                                : isSelected ? 'bg-[var(--paper)] bg-opacity-20' : 'bg-[var(--ink)] bg-opacity-10'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Word detail */}
          <div className="lg:col-span-5">
            {selectedWord ? (
              <div className="sticky top-8">
                <PixelCard className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 halftone-mustard w-32 h-32 opacity-20 pointer-events-none"></div>

                  <div className="relative">
                    <div className="label-text mb-3">{selectedWord.category}</div>

                    {/* Flashcard */}
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="border-[1.5px] border-[var(--ink)] min-h-[180px] flex flex-col items-center justify-center p-6 cursor-pointer mb-5 bg-[var(--paper-warm)]"
                    >
                      {!isFlipped ? (
                        <>
                          <div className="font-display text-5xl font-medium mb-2">{selectedWord.kanji}</div>
                          <div className="font-body text-base">{selectedWord.hiragana}</div>
                          <div className="font-mono text-[0.8rem] opacity-50 mt-1">{selectedWord.romaji}</div>
                          <div className="caption-text mt-3">クリックで意味を表示 →</div>
                        </>
                      ) : (
                        <>
                          <div className="label-text mb-2" style={{ color: 'var(--vermillion)' }}>意味</div>
                          <div className="font-display text-3xl font-medium">{selectedWord.meaning}</div>
                          <div className="font-body text-base mt-2 opacity-70">{selectedWord.kanji} · {selectedWord.hiragana}</div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2 mb-5">
                      <PixelButton onClick={handleDontKnow} variant="secondary" className="flex-1">
                        わからない
                      </PixelButton>
                      <PixelButton onClick={handleKnow} variant="primary" className="flex-1">
                        わかる
                      </PixelButton>
                    </div>

                    <div className="divider-line mb-4"></div>

                    <dl className="space-y-3">
                      <div className="flex justify-between items-center">
                        <dt className="label-text opacity-60">漢字</dt>
                        <dd className="flex items-center gap-2">
                          <span className="font-display text-base">{selectedWord.kanji}</span>
                          <PlayButton text={selectedWord.hiragana} size="sm" />
                        </dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="label-text opacity-60">読み方</dt>
                        <dd className="font-body text-base">{selectedWord.hiragana}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="label-text opacity-60">意味</dt>
                        <dd className="font-display text-base">{selectedWord.meaning}</dd>
                      </div>
                    </dl>

                    <div className="mt-5 p-4 border-l-[3px] border-[var(--cobalt)] bg-[var(--cobalt)] bg-opacity-5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="label-text" style={{ color: 'var(--cobalt)' }}>例文</span>
                        <PlayButton text={selectedWord.example} size="sm" />
                      </div>
                      <p className="font-body text-sm mb-1">{selectedWord.example}</p>
                      <p className="caption-text">{selectedWord.exampleMeaning}</p>
                    </div>
                  </div>
                </PixelCard>
              </div>
            ) : (
              <PixelCard>
                <div className="text-center py-8">
                  <div className="writing-vertical text-3xl opacity-30 mx-auto mb-4 inline-block">単語を選ぶ</div>
                  <p className="caption-text">左のリストから単語をクリックして、学習しよう。</p>
                </div>
              </PixelCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
