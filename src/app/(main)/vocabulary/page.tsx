'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PixelDialog } from '@/components/ui';

// 词汇数据
const vocabularyData = [
  // 数字
  { id: '1', kanji: '一', hiragana: 'いち', romaji: 'ichi', meaning: '一', category: '数字', example: '一つください', exampleMeaning: '请给我一个' },
  { id: '2', kanji: '二', hiragana: 'に', romaji: 'ni', meaning: '二', category: '数字', example: '二人で行きます', exampleMeaning: '两个人去' },
  { id: '3', kanji: '三', hiragana: 'さん', romaji: 'san', meaning: '三', category: '数字', example: '三時に会いましょう', exampleMeaning: '三点见面吧' },
  // 问候
  { id: '4', kanji: 'こんにちは', hiragana: 'こんにちは', romaji: 'konnichiwa', meaning: '你好', category: '挨拶', example: 'こんにちは、元気ですか？', exampleMeaning: '你好，你好吗？' },
  { id: '5', kanji: 'ありがとう', hiragana: 'ありがとう', romaji: 'arigatou', meaning: '谢谢', category: '挨拶', example: 'ありがとうございます', exampleMeaning: '非常感谢' },
  { id: '6', kanji: 'すみません', hiragana: 'すみません', romaji: 'sumimasen', meaning: '对不起/打扰了', category: '挨拶', example: 'すみません、道を教えてください', exampleMeaning: '不好意思，请告诉我路' },
  // 食物
  { id: '7', kanji: '水', hiragana: 'みず', romaji: 'mizu', meaning: '水', category: '食べ物', example: '水をください', exampleMeaning: '请给我水' },
  { id: '8', kanji: 'ご飯', hiragana: 'ごはん', romaji: 'gohan', meaning: '饭', category: '食べ物', example: 'ご飯を食べます', exampleMeaning: '吃饭' },
  { id: '9', kanji: '魚', hiragana: 'さかな', romaji: 'sakana', meaning: '鱼', category: '食べ物', example: '魚が好きです', exampleMeaning: '喜欢鱼' },
  // 家庭
  { id: '10', kanji: 'お父さん', hiragana: 'おとうさん', romaji: 'otousan', meaning: '爸爸', category: '家族', example: 'お父さんは会社員です', exampleMeaning: '爸爸是公司职员' },
  { id: '11', kanji: 'お母さん', hiragana: 'おかあさん', romaji: 'okaasan', meaning: '妈妈', category: '家族', example: 'お母さんは先生です', exampleMeaning: '妈妈是老师' },
];

// 模拟学习进度
const mockProgress: Record<string, { level: number; nextReview: Date }> = {
  '1': { level: 3, nextReview: new Date() },
  '2': { level: 2, nextReview: new Date() },
  '4': { level: 4, nextReview: new Date() },
  '5': { level: 5, nextReview: new Date() },
};

export default function VocabularyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<typeof vocabularyData[0] | null>(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const categories = [...new Set(vocabularyData.map(w => w.category))];

  const filteredWords = selectedCategory
    ? vocabularyData.filter(w => w.category === selectedCategory)
    : vocabularyData;

  const masteredCount = vocabularyData.filter(w => mockProgress[w.id]?.level >= 4).length;

  const handleWordClick = (word: typeof vocabularyData[0]) => {
    setSelectedWord(word);
    setShowMeaning(false);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnow = () => {
    // TODO: 更新进度
    setShowMeaning(true);
  };

  const handleDontKnow = () => {
    setShowMeaning(true);
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
          <Link href="/dashboard">
            <PixelButton variant="ghost" size="sm">← 返回仪表板</PixelButton>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg text-[#2D2D2D] mb-2">单词本</h2>
          <p className="text-[10px] text-[#666666]">
            高效记忆基础单词，翻转卡片轻松学习！
          </p>
        </div>

        {/* Progress Overview */}
        <PixelCard className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xs mb-2">学习进度</h3>
              <PixelProgress
                value={masteredCount}
                max={vocabularyData.length}
                label={`${masteredCount}/${vocabularyData.length} 已掌握`}
                variant="exp"
                showLabel
              />
            </div>
            <div className="flex gap-4">
              <PixelBadge variant="exp">已掌握: {masteredCount}</PixelBadge>
              <PixelBadge variant="default">未学习: {vocabularyData.length - masteredCount}</PixelBadge>
            </div>
          </div>
        </PixelCard>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <PixelButton
            variant={selectedCategory === null ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            全部
          </PixelButton>
          {categories.map(cat => (
            <PixelButton
              key={cat}
              variant={selectedCategory === cat ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </PixelButton>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Word List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredWords.map((word) => {
                const progress = mockProgress[word.id];
                const isMastered = progress?.level >= 4;

                return (
                  <button
                    key={word.id}
                    onClick={() => handleWordClick(word)}
                    className={`
                      p-4 border-3 border-black text-left transition-all
                      ${selectedWord?.id === word.id ? 'bg-[#3B82F6] text-white' : ''}
                      ${!selectedWord || selectedWord.id !== word.id
                        ? isMastered ? 'bg-[#4ADE80]' : 'bg-white hover:bg-[#FFD700]'
                        : ''
                      }
                    `}
                  >
                    <div className="text-lg mb-1">{word.kanji}</div>
                    <div className={`text-[10px] ${selectedWord?.id === word.id ? 'text-white' : 'text-[#666666]'}`}>
                      {word.hiragana}
                    </div>
                    <div className={`text-[10px] ${selectedWord?.id === word.id ? 'text-white' : 'text-[#999999]'}`}>
                      {word.romaji}
                    </div>
                    {progress && (
                      <div className="mt-2">
                        <PixelProgress value={progress.level} max={5} variant="exp" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Word Detail */}
          <div>
            {selectedWord ? (
              <PixelCard variant="elevated">
                {/* Flashcard */}
                <div
                  className={`
                    relative min-h-[200px] border-4 border-black mb-6 cursor-pointer
                    transition-transform duration-500
                    ${isFlipped ? 'bg-[#3B82F6] text-white' : 'bg-white'}
                  `}
                  onClick={handleFlip}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    {!isFlipped ? (
                      <>
                        <div className="text-4xl mb-4">{selectedWord.kanji}</div>
                        <div className="text-sm">{selectedWord.hiragana}</div>
                        <div className="text-xs text-[#666666]">{selectedWord.romaji}</div>
                        <div className="absolute bottom-2 right-2 text-[10px] text-[#999999]">
                          点击翻转
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl mb-2">{selectedWord.meaning}</div>
                        <div className="text-xs">{selectedWord.kanji}</div>
                        <div className="absolute bottom-2 right-2 text-[10px]">
                          点击返回
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <PixelButton
                    variant="ghost"
                    className="flex-1"
                    onClick={handleDontKnow}
                  >
                    ❓ 不认识
                  </PixelButton>
                  <PixelButton
                    variant="accent"
                    className="flex-1"
                    onClick={handleKnow}
                  >
                    ✅ 认识
                  </PixelButton>
                </div>

                {/* Word Details */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">汉字</span>
                    <span className="text-xs">{selectedWord.kanji}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">平假名</span>
                    <span className="text-xs">{selectedWord.hiragana}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">罗马音</span>
                    <span className="text-xs">{selectedWord.romaji}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">意思</span>
                    <span className="text-xs">{selectedWord.meaning}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">分类</span>
                    <span className="text-xs">{selectedWord.category}</span>
                  </div>
                  <div className="p-3 bg-[#FFD700] border-2 border-black">
                    <p className="text-[10px] mb-1">📝 例句</p>
                    <p className="text-xs">{selectedWord.example}</p>
                    <p className="text-[10px] text-[#666666] mt-1">{selectedWord.exampleMeaning}</p>
                  </div>
                </div>
              </PixelCard>
            ) : (
              <PixelCard>
                <PixelDialog>
                  <p>请选择一个单词</p>
                  <p className="text-[#666666] text-[10px] mt-2">
                    （请选择一个单词）
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
