'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PixelDialog } from '@/components/ui';
import { getExpForLevel, getEvolutionStage } from '@/lib/utils';

// 宠物类型
type PetSpecies = 'dog' | 'cat' | 'rabbit';

interface Pet {
  name: string;
  species: PetSpecies;
  level: number;
  exp: number;
  happiness: number;
  hunger: number;
  evolution: 1 | 2 | 3;
  accessories: string[];
}

// 初始宠物数据
const initialPet: Pet = {
  name: 'ハチ',
  species: 'dog',
  level: 8,
  exp: 350,
  happiness: 85,
  hunger: 30,
  evolution: 1,
  accessories: [],
};

// 宠物表情
const petEmojis: Record<PetSpecies, Record<number, string>> = {
  dog: { 1: '🐕', 2: '🦮', 3: '🐕‍🦺' },
  cat: { 1: '🐱', 2: '🐈', 3: '🐈‍⬛' },
  rabbit: { 1: '🐰', 2: '🐇', 3: '🐇' },
};

// 宠物状态
const stateEmojis = {
  idle: '😊',
  happy: '😄',
  eating: '🍖',
  sleeping: '😴',
  studying: '📚',
};

export default function PetPage() {
  const [pet, setPet] = useState<Pet>(initialPet);
  const [state, setState] = useState<'idle' | 'happy' | 'eating' | 'sleeping' | 'studying'>('idle');
  const [showMessage, setShowMessage] = useState('');
  const [coins, setCoins] = useState(150);

  // 更新进化阶段
  useEffect(() => {
    const newEvolution = getEvolutionStage(pet.level);
    if (newEvolution !== pet.evolution) {
      setPet(prev => ({ ...prev, evolution: newEvolution as 1 | 2 | 3 }));
      setShowMessage(`🎉 ${pet.name}が進化しました！ステージ${newEvolution}に！`);
      setTimeout(() => setShowMessage(''), 3000);
    }
  }, [pet.level]);

  // 喂食
  const handleFeed = () => {
    if (coins < 10) {
      setShowMessage('💰 コインが足りません！（金币不足！）');
      setTimeout(() => setShowMessage(''), 2000);
      return;
    }

    setState('eating');
    setCoins(prev => prev - 10);
    setPet(prev => ({
      ...prev,
      hunger: Math.max(0, prev.hunger - 20),
      happiness: Math.min(100, prev.happiness + 10),
    }));

    setShowMessage('🍖 おいしい！ありがとう！（好吃！谢谢！）');
    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, 2000);
  };

  // 摸摸
  const handlePet = () => {
    setState('happy');
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
    }));

    setShowMessage('❤️ くすぐったい！嬉しい！（好痒！好开心！）');
    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, 2000);
  };

  // 学习
  const handleStudy = () => {
    setState('studying');
    const expGain = 20;
    const newExp = pet.exp + expGain;
    const expToNext = getExpForLevel(pet.level);

    if (newExp >= expToNext) {
      setPet(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: newExp - expToNext,
      }));
      setShowMessage(`🎊 レベルアップ！Lv.${pet.level + 1}に！`);
    } else {
      setPet(prev => ({
        ...prev,
        exp: newExp,
      }));
      setShowMessage(`📚 +${expGain} EXP！頑張った！（努力了！）`);
    }

    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, 2000);
  };

  // 睡觉
  const handleSleep = () => {
    setState('sleeping');
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 10),
    }));

    setShowMessage('💤 おやすみ...（晚安...）');
    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, 3000);
  };

  const expToNext = getExpForLevel(pet.level);
  const evolutionName = pet.evolution === 1 ? '幼年期' : pet.evolution === 2 ? '成長期' : '成年期';

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
          <div className="flex items-center gap-4">
            <PixelBadge variant="exp">💰 {coins} コイン</PixelBadge>
            <Link href="/dashboard">
              <PixelButton variant="ghost" size="sm">← ダッシュボード</PixelButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg text-[#2D2D2D] mb-2">ペットルーム</h2>
          <p className="text-[10px] text-[#666666]">
            {pet.name}と一緒に過ごそう！学習して_EXP_をあげよう！
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Display */}
          <PixelCard variant="elevated">
            {/* Pet Name & Level */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm">{pet.name}</h3>
                <p className="text-[10px] text-[#666666]">
                  {pet.species === 'dog' ? '柴犬' : pet.species === 'cat' ? '猫' : '兎'}
                  {' - '}
                  {evolutionName}
                </p>
              </div>
              <div className="flex gap-2">
                <PixelBadge variant="level">Lv.{pet.level}</PixelBadge>
                <PixelBadge variant="exp">Stage {pet.evolution}</PixelBadge>
              </div>
            </div>

            {/* Pet Sprite Area */}
            <div className="relative bg-[#87CEEB] border-4 border-black p-8 mb-4 min-h-[300px] flex items-center justify-center">
              {/* Background elements */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#90EE90] border-t-4 border-black" />
              <div className="absolute bottom-20 left-8 text-2xl">🌳</div>
              <div className="absolute bottom-20 right-8 text-2xl">🏠</div>

              {/* Pet */}
              <div className={`
                relative z-10 text-8xl transition-transform duration-300
                ${state === 'happy' ? 'animate-bounce' : ''}
                ${state === 'eating' ? 'animate-pulse' : ''}
                ${state === 'sleeping' ? 'opacity-70' : ''}
              `}>
                {petEmojis[pet.species][pet.evolution]}
                <div className="absolute -top-4 -right-4 text-2xl">
                  {stateEmojis[state]}
                </div>
              </div>

              {/* Message Bubble */}
              {showMessage && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white border-3 border-black p-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] z-20">
                  <p className="text-xs whitespace-nowrap">{showMessage}</p>
                </div>
              )}
            </div>

            {/* Status Bars */}
            <div className="flex flex-col gap-3 mb-4">
              <PixelProgress
                value={pet.exp}
                max={expToNext}
                label="経験値"
                variant="exp"
                showLabel
              />
              <PixelProgress
                value={pet.happiness}
                label="幸福度"
                variant="default"
                showLabel
              />
              <PixelProgress
                value={100 - pet.hunger}
                label="満腹度"
                showLabel
              />
            </div>

            {/* Accessories */}
            <div className="p-3 bg-white border-2 border-black">
              <p className="text-[10px] mb-2">🎨 アクセサリー</p>
              <div className="flex gap-2">
                {pet.accessories.length > 0 ? (
                  pet.accessories.map((acc, i) => (
                    <PixelBadge key={i} variant="default">{acc}</PixelBadge>
                  ))
                ) : (
                  <span className="text-[10px] text-[#666666]">まだアクセサリーがありません（还没有饰品）</span>
                )}
              </div>
            </div>
          </PixelCard>

          {/* Actions & Info */}
          <div className="flex flex-col gap-6">
            {/* Action Buttons */}
            <PixelCard>
              <h3 className="text-xs mb-4">アクション</h3>
              <div className="grid grid-cols-2 gap-3">
                <PixelButton
                  variant="accent"
                  onClick={handleFeed}
                  disabled={state !== 'idle'}
                >
                  🍖 餌やり (10コイン)
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  onClick={handlePet}
                  disabled={state !== 'idle'}
                >
                  🤗 なでる
                </PixelButton>
                <PixelButton
                  variant="primary"
                  onClick={handleStudy}
                  disabled={state !== 'idle'}
                >
                  📚 一緒に勉強
                </PixelButton>
                <PixelButton
                  variant="ghost"
                  onClick={handleSleep}
                  disabled={state !== 'idle'}
                >
                  💤 おやすみ
                </PixelButton>
              </div>
            </PixelCard>

            {/* Pet Info */}
            <PixelCard>
              <h3 className="text-xs mb-4">ペット情報</h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">名前</span>
                  <span className="text-xs">{pet.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">種類</span>
                  <span className="text-xs">
                    {pet.species === 'dog' ? '柴犬' : pet.species === 'cat' ? '猫' : '兎'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">レベル</span>
                  <span className="text-xs">{pet.level}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">進化段階</span>
                  <span className="text-xs">{evolutionName}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">次の進化まで</span>
                  <span className="text-xs">
                    {pet.evolution === 1 ? `Lv.${11 - pet.level} remaining` :
                     pet.evolution === 2 ? `Lv.${26 - pet.level} remaining` :
                     'MAX'}
                  </span>
                </div>
              </div>
            </PixelCard>

            {/* Evolution Guide */}
            <PixelCard>
              <h3 className="text-xs mb-4">進化ガイド</h3>
              <div className="flex flex-col gap-3">
                <div className={`p-3 border-2 border-black ${pet.evolution >= 1 ? 'bg-[#4ADE80]' : 'bg-white'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px]">Stage 1: 幼年期</span>
                    <span className="text-[10px]">Lv.1-10</span>
                  </div>
                </div>
                <div className={`p-3 border-2 border-black ${pet.evolution >= 2 ? 'bg-[#4ADE80]' : 'bg-white'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px]">Stage 2: 成長期</span>
                    <span className="text-[10px]">Lv.11-25</span>
                  </div>
                </div>
                <div className={`p-3 border-2 border-black ${pet.evolution >= 3 ? 'bg-[#4ADE80]' : 'bg-white'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px]">Stage 3: 成年期</span>
                    <span className="text-[10px]">Lv.26+</span>
                  </div>
                </div>
              </div>
            </PixelCard>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8">
          <PixelDialog>
            <p className="text-xs mb-2">💡 ペットを育てるコツ</p>
            <p className="text-[10px] text-[#666666]">
              • 毎日学習して経験値をあげよう！（每天学习获得经验值！）<br />
              • 餌やりで満腹度をキープ！（喂食保持饱腹度！）<br />
              • なでると幸福度が上がる！（摸摸提升幸福感！）<br />
              • 一緒に勉強してレベルアップ！（一起学习升级！）
            </p>
          </PixelDialog>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-[10px] text-[#666666]">
            © 2024 kanaAI - 毎日少しずつ、上手になれる！
          </p>
        </div>
      </footer>
    </div>
  );
}
