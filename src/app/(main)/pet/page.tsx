'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PixelDialog } from '@/components/ui';
import { getExpForLevel, getEvolutionStage } from '@/lib/utils';

type PetSpecies = 'dog' | 'cat' | 'rabbit';

interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  level: number;
  exp: number;
  happiness: number;
  hunger: number;
  evolution: 1 | 2 | 3;
  accessories: string[];
}

const petEmojis: Record<PetSpecies, Record<number, string>> = {
  dog: { 1: '🐕', 2: '🦮', 3: '🐕‍🦺' },
  cat: { 1: '🐱', 2: '🐈', 3: '🐈‍⬛' },
  rabbit: { 1: '🐰', 2: '🐇', 3: '🐇' },
};

const stateEmojis = {
  idle: '😊',
  happy: '😄',
  eating: '🍖',
  sleeping: '😴',
  studying: '📚',
};

export default function PetPage() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [state, setState] = useState<'idle' | 'happy' | 'eating' | 'sleeping' | 'studying'>('idle');
  const [showMessage, setShowMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Load pet from API
  useEffect(() => {
    async function loadPet() {
      try {
        const res = await fetch('/api/pet');
        if (res.ok) {
          const data = await res.json();
          setPet(data.pet);
        }
      } catch {
        // Failed to load
      } finally {
        setLoading(false);
      }
    }
    loadPet();
  }, []);

  // Update evolution when level changes
  useEffect(() => {
    if (!pet) return;
    const newEvolution = getEvolutionStage(pet.level);
    if (newEvolution !== pet.evolution) {
      setPet(prev => prev ? ({ ...prev, evolution: newEvolution as 1 | 2 | 3 }) : prev);
      setShowMessage(`🎉 ${pet.name}进化了！阶段${newEvolution}！`);
      setTimeout(() => setShowMessage(''), 3000);
    }
  }, [pet?.level]);

  const updatePet = async (action: string, data?: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/pet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });

      if (res.ok) {
        const result = await res.json();
        setPet(result.pet);
        return result.pet;
      }
    } catch {
      // Failed to update
    }
    return null;
  };

  const handleFeed = async () => {
    if (!pet) return;
    setState('eating');
    await updatePet('feed');
    setShowMessage('🍖 好吃！谢谢！');
    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, 2000);
  };

  const handlePet = async () => {
    if (!pet) return;
    setState('happy');
    await updatePet('pet');
    setShowMessage('❤️ 好痒！好开心！');
    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, 2000);
  };

  const handleStudy = async () => {
    if (!pet) return;
    setState('studying');
    const updatedPet = await updatePet('study', { expGain: 20 });

    if (updatedPet) {
      if (updatedPet.level > pet.level) {
        setShowMessage(`🎊 等级アップ！Lv.${updatedPet.level}！`);
      } else {
        setShowMessage('📚 +20 EXP！努力了！');
      }
    }

    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, 2000);
  };

  const handleSleep = async () => {
    if (!pet) return;
    setState('sleeping');
    await updatePet('sleep');
    setShowMessage('💤 晚安...');
    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E1] pixel-grid flex items-center justify-center">
        <div className="text-xs text-[#666666]">加载中...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#F5F0E1] pixel-grid flex items-center justify-center">
        <PixelCard>
          <p className="text-xs">宠物数据加载失败</p>
          <Link href="/dashboard">
            <PixelButton className="mt-4">返回仪表板</PixelButton>
          </Link>
        </PixelCard>
      </div>
    );
  }

  const expToNext = getExpForLevel(pet.level);
  const evolutionName = pet.evolution === 1 ? '幼年期' : pet.evolution === 2 ? '成长期' : '成年期';

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
          <h2 className="text-lg text-[#2D2D2D] mb-2">宠物ルーム</h2>
          <p className="text-[10px] text-[#666666]">
            {pet.name}和你的宠物一起度过时光吧！学习获得经验值！
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
                  {pet.species === 'dog' ? '柴犬' : pet.species === 'cat' ? '猫咪' : '兔子'}
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
                label="经验值"
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
                label="饱腹度"
                showLabel
              />
            </div>

            {/* Accessories */}
            <div className="p-3 bg-white border-2 border-black">
              <p className="text-[10px] mb-2">🎨 装饰品</p>
              <div className="flex gap-2">
                {pet.accessories.length > 0 ? (
                  pet.accessories.map((acc, i) => (
                    <PixelBadge key={i} variant="default">{acc}</PixelBadge>
                  ))
                ) : (
                  <span className="text-[10px] text-[#666666]">还没有装饰品</span>
                )}
              </div>
            </div>
          </PixelCard>

          {/* Actions & Info */}
          <div className="flex flex-col gap-6">
            {/* Action Buttons */}
            <PixelCard>
              <h3 className="text-xs mb-4">操作</h3>
              <div className="grid grid-cols-2 gap-3">
                <PixelButton
                  variant="accent"
                  onClick={handleFeed}
                  disabled={state !== 'idle'}
                >
                  🍖 喂食
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  onClick={handlePet}
                  disabled={state !== 'idle'}
                >
                  🤗 摸摸
                </PixelButton>
                <PixelButton
                  variant="primary"
                  onClick={handleStudy}
                  disabled={state !== 'idle'}
                >
                  📚 一起学习
                </PixelButton>
                <PixelButton
                  variant="ghost"
                  onClick={handleSleep}
                  disabled={state !== 'idle'}
                >
                  💤 睡觉
                </PixelButton>
              </div>
            </PixelCard>

            {/* Pet Info */}
            <PixelCard>
              <h3 className="text-xs mb-4">宠物信息</h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">名字</span>
                  <span className="text-xs">{pet.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">种类</span>
                  <span className="text-xs">
                    {pet.species === 'dog' ? '柴犬' : pet.species === 'cat' ? '猫咪' : '兔子'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">等级</span>
                  <span className="text-xs">{pet.level}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">进化阶段</span>
                  <span className="text-xs">{evolutionName}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                  <span className="text-[10px]">距离下次进化</span>
                  <span className="text-xs">
                    {pet.evolution === 1 ? `Lv.${11 - pet.level} 级` :
                     pet.evolution === 2 ? `Lv.${26 - pet.level} 级` :
                     'MAX'}
                  </span>
                </div>
              </div>
            </PixelCard>

            {/* Evolution Guide */}
            <PixelCard>
              <h3 className="text-xs mb-4">进化指南</h3>
              <div className="flex flex-col gap-3">
                <div className={`p-3 border-2 border-black ${pet.evolution >= 1 ? 'bg-[#4ADE80]' : 'bg-white'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px]">Stage 1: 幼年期</span>
                    <span className="text-[10px]">Lv.1-10</span>
                  </div>
                </div>
                <div className={`p-3 border-2 border-black ${pet.evolution >= 2 ? 'bg-[#4ADE80]' : 'bg-white'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px]">Stage 2: 成长期</span>
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
            <p className="text-xs mb-2">💡 养宠物小技巧</p>
            <p className="text-[10px] text-[#666666]">
              • 每天学习获得经验值！<br />
              • 喂食保持饱腹度！<br />
              • 摸摸提升幸福感！<br />
              • 一起学习升级！
            </p>
          </PixelDialog>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-[10px] text-[#666666]">
            © 2026 kanaAI - 每天进步一点点！
          </p>
        </div>
      </footer>
    </div>
  );
}
