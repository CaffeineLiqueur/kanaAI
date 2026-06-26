'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PixelDialog, PlayButton } from '@/components/ui';

// 平假名数据
const hiraganaData = [
  // あ行
  { char: 'あ', romaji: 'a', group: 'あ行' },
  { char: 'い', romaji: 'i', group: 'あ行' },
  { char: 'う', romaji: 'u', group: 'あ行' },
  { char: 'え', romaji: 'e', group: 'あ行' },
  { char: 'お', romaji: 'o', group: 'あ行' },
  // か行
  { char: 'か', romaji: 'ka', group: 'か行' },
  { char: 'き', romaji: 'ki', group: 'か行' },
  { char: 'く', romaji: 'ku', group: 'か行' },
  { char: 'け', romaji: 'ke', group: 'か行' },
  { char: 'こ', romaji: 'ko', group: 'か行' },
  // さ行
  { char: 'さ', romaji: 'sa', group: 'さ行' },
  { char: 'し', romaji: 'shi', group: 'さ行' },
  { char: 'す', romaji: 'su', group: 'さ行' },
  { char: 'せ', romaji: 'se', group: 'さ行' },
  { char: 'そ', romaji: 'so', group: 'さ行' },
  // た行
  { char: 'た', romaji: 'ta', group: 'た行' },
  { char: 'ち', romaji: 'chi', group: 'た行' },
  { char: 'つ', romaji: 'tsu', group: 'た行' },
  { char: 'て', romaji: 'te', group: 'た行' },
  { char: 'と', romaji: 'to', group: 'た行' },
  // な行
  { char: 'な', romaji: 'na', group: 'な行' },
  { char: 'に', romaji: 'ni', group: 'な行' },
  { char: 'ぬ', romaji: 'nu', group: 'な行' },
  { char: 'ね', romaji: 'ne', group: 'な行' },
  { char: 'の', romaji: 'no', group: 'な行' },
];

// 片假名数据
const katakanaData = [
  // ア行
  { char: 'ア', romaji: 'a', group: 'ア行' },
  { char: 'イ', romaji: 'i', group: 'ア行' },
  { char: 'ウ', romaji: 'u', group: 'ア行' },
  { char: 'エ', romaji: 'e', group: 'ア行' },
  { char: 'オ', romaji: 'o', group: 'ア行' },
  // カ行
  { char: 'カ', romaji: 'ka', group: 'カ行' },
  { char: 'キ', romaji: 'ki', group: 'カ行' },
  { char: 'ク', romaji: 'ku', group: 'カ行' },
  { char: 'ケ', romaji: 'ke', group: 'カ行' },
  { char: 'コ', romaji: 'ko', group: 'カ行' },
  // サ行
  { char: 'サ', romaji: 'sa', group: 'サ行' },
  { char: 'シ', romaji: 'shi', group: 'サ行' },
  { char: 'ス', romaji: 'su', group: 'サ行' },
  { char: 'セ', romaji: 'se', group: 'サ行' },
  { char: 'ソ', romaji: 'so', group: 'サ行' },
];

// 模拟学习进度
const mockProgress: Record<string, boolean> = {
  'あ': true, 'い': true, 'う': true, 'え': false, 'お': false,
  'か': true, 'き': false, 'く': false, 'け': false, 'こ': false,
};

export default function KanaPage() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<typeof hiraganaData[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentData = activeTab === 'hiragana' ? hiraganaData : katakanaData;
  const groups = [...new Set(currentData.map(k => k.group))];

  const masteredCount = currentData.filter(k => mockProgress[k.char]).length;
  const progressPercentage = Math.round((masteredCount / currentData.length) * 100);

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

  const handleQuizSubmit = () => {
    if (selectedKana && quizAnswer.toLowerCase() === selectedKana.romaji) {
      setQuizFeedback('correct');
    } else {
      setQuizFeedback('incorrect');
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
          <Link href="/dashboard">
            <PixelButton variant="ghost" size="sm">← 返回仪表板</PixelButton>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-lg text-[#2D2D2D] mb-2">假名学习</h2>
          <p className="text-[10px] text-[#666666]">
            轻松掌握日语假名，像收集图鉴一样有趣！
          </p>
        </div>

        {/* Progress Overview */}
        <PixelCard className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xs mb-2">学习进度</h3>
              <PixelProgress
                value={progressPercentage}
                label={`${masteredCount}/${currentData.length} 已掌握`}
                variant="exp"
                showLabel
              />
            </div>
            <div className="flex gap-4">
              <PixelBadge variant="exp">
                已掌握: {masteredCount}
              </PixelBadge>
              <PixelBadge variant="default">
                未学习: {currentData.length - masteredCount}
              </PixelBadge>
            </div>
          </div>
        </PixelCard>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-6">
          <PixelButton
            variant={activeTab === 'hiragana' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('hiragana')}
          >
            平仮名 ひらがな
          </PixelButton>
          <PixelButton
            variant={activeTab === 'katakana' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('katakana')}
          >
            片假名 カタカナ
          </PixelButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kana Grid */}
          <div className="lg:col-span-2">
            {groups.map((group) => (
              <div key={group} className="mb-6">
                <h3 className="text-xs mb-3 text-[#666666]">{group}</h3>
                <div className="flex flex-wrap gap-3">
                  {currentData
                    .filter(k => k.group === group)
                    .map((kana) => {
                      const isMastered = mockProgress[kana.char];
                      const isSelected = selectedKana?.char === kana.char;

                      return (
                        <button
                          key={kana.char}
                          onClick={() => handleKanaClick(kana)}
                          className={`
                            w-16 h-16 border-3 border-black flex flex-col items-center justify-center
                            transition-all duration-100
                            ${isSelected ? 'bg-[#3B82F6] text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]' : ''}
                            ${!isSelected && isMastered ? 'bg-[#4ADE80]' : ''}
                            ${!isSelected && !isMastered ? 'bg-white hover:bg-[#FFD700]' : ''}
                          `}
                        >
                          <span className="text-xl">{kana.char}</span>
                          <span className={`text-[8px] ${isSelected ? 'text-white' : 'text-[#666666]'}`}>
                            {kana.romaji}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div>
            {selectedKana ? (
              <PixelCard variant="elevated">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-white border-4 border-black mx-auto mb-4 flex items-center justify-center relative">
                    <span className="text-5xl">{selectedKana.char}</span>
                    <div className="absolute -bottom-1 -right-1">
                      <PlayButton text={selectedKana.char} size="sm" />
                    </div>
                  </div>
                  <h3 className="text-sm mb-1">{selectedKana.char}</h3>
                  <p className="text-[10px] text-[#666666]">{selectedKana.romaji}</p>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">假名</span>
                    <span className="text-xs">{selectedKana.char}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">罗马音</span>
                    <span className="text-xs">{selectedKana.romaji}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">分组</span>
                    <span className="text-xs">{selectedKana.group}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="text-[10px]">状态</span>
                    <PixelBadge variant={mockProgress[selectedKana.char] ? 'success' : 'default'}>
                      {mockProgress[selectedKana.char] ? '已掌握済み' : '未学习'}
                    </PixelBadge>
                  </div>
                </div>

                {/* Quiz Section */}
                {showQuiz ? (
                  <div className="p-4 bg-[#FFD700] border-3 border-black">
                    <h4 className="text-xs mb-3">小测验！</h4>
                    <p className="text-[10px] mb-3">「{selectedKana.char}」的罗马音是？</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-black font-pixel text-xs"
                        placeholder="输入罗马音..."
                      />
                      <PixelButton size="sm" onClick={handleQuizSubmit}>
                        回答
                      </PixelButton>
                    </div>
                    {quizFeedback && (
                      <div className={`mt-3 p-2 border-2 border-black text-[10px] ${
                        quizFeedback === 'correct' ? 'bg-[#4ADE80]' : 'bg-[#EF4444] text-white'
                      }`}>
                        {quizFeedback === 'correct'
                          ? '🎉 回答正确！すごい！（正确！太棒了！）'
                          : `❌ 回答错误。正解は「${selectedKana.romaji}」です（错误。正确答案是「${selectedKana.romaji}」）`
                        }
                      </div>
                    )}
                  </div>
                ) : (
                  <PixelButton className="w-full" onClick={handleStartQuiz}>
                    开始测验！
                  </PixelButton>
                )}
              </PixelCard>
            ) : (
              <PixelCard>
                <PixelDialog>
                  <p>请选择一个假名</p>
                  <p className="text-[#666666] text-[10px] mt-2">
                    （请选择一个假名）
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
