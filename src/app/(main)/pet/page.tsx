'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, Logo } from '@/components/ui';
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

export default function PetPage() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [state, setState] = useState<'idle' | 'happy' | 'eating' | 'sleeping' | 'studying'>('idle');
  const [showMessage, setShowMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPet() {
      try {
        const res = await fetch('/api/pet');
        if (res.ok) {
          const data = await res.json();
          setPet(data.pet);
        }
      } catch {}
      setLoading(false);
    }
    loadPet();
  }, []);

  useEffect(() => {
    if (!pet) return;
    const newEvolution = getEvolutionStage(pet.level);
    if (newEvolution !== pet.evolution) {
      setPet(prev => prev ? ({ ...prev, evolution: newEvolution as 1 | 2 | 3 }) : prev);
      setShowMessage(`✨ 進化!  Stage ${newEvolution} へ`);
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
    } catch {}
    return null;
  };

  const handleAction = async (action: 'feed' | 'pet' | 'study' | 'sleep', displayState: typeof state, message: string) => {
    setState(displayState);
    setShowMessage(message);
    await updatePet(action);
    setTimeout(() => {
      setState('idle');
      setShowMessage('');
    }, action === 'sleep' ? 3000 : 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="label-text">読み込み中…</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="body-text opacity-70 mb-6">相棒のデータが見つかりません。</p>
          <Link href="/dashboard">
            <PixelButton variant="primary">ダッシュボードへ</PixelButton>
          </Link>
        </div>
      </div>
    );
  }

  const expToNext = getExpForLevel(pet.level);
  const evolutionName = pet.evolution === 1 ? '幼年期' : pet.evolution === 2 ? '成长期' : '成年期';

  return (
    <div className="min-h-screen relative z-10">
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
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="label-text mb-2">第 06 章 — 相棒</div>
              <h1 className="heading-lg">ペットルーム</h1>
            </div>
            <div className="text-right">
              <div className="label-text opacity-50">進化</div>
              <div className="font-mono text-2xl">
                Stage <span style={{ color: 'var(--vermillion)' }}>{pet.evolution}</span><span className="opacity-30">/3</span>
              </div>
            </div>
          </div>
          <p className="body-text opacity-70">一緒に学ぶたびに成長する、あなたの相棒。</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pet Display */}
          <div className="lg:col-span-7">
            <PixelCard className="relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 halftone-mustard w-40 h-40 opacity-20 pointer-events-none"></div>

              <div className="relative">
                {/* Pet header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="label-text mb-1" style={{ color: 'var(--vermillion)' }}>名前</div>
                    <h2 className="font-display text-3xl font-medium">{pet.name}</h2>
                    <div className="caption-text mt-1">
                      {pet.species === 'dog' ? '柴犬' : pet.species === 'cat' ? '猫' : '兎'} · {evolutionName}
                    </div>
                  </div>
                  <PixelBadge variant="vermillion" filled>LV. {pet.level}</PixelBadge>
                </div>

                <div className="divider-line mb-6"></div>

                {/* Pet sprite area */}
                <div className="relative aspect-square max-w-[280px] mx-auto border-[1.5px] border-[var(--ink)] bg-[var(--paper-warm)] mb-6 flex items-center justify-center">
                  <span
                    className={`text-[8rem] transition-all duration-500 ${
                      state === 'happy' ? 'drift' : ''
                    } ${state === 'sleeping' ? 'opacity-60' : ''}`}
                  >
                    {petEmojis[pet.species][pet.evolution]}
                  </span>
                  {showMessage && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full bg-[var(--ink)] text-[var(--paper)] px-4 py-2 text-[0.8rem] font-display whitespace-nowrap fade-up">
                      {showMessage}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="label-text" style={{ color: 'var(--cobalt)' }}>経験値 EXP</span>
                      <span className="font-mono text-[0.7rem] tabular-nums opacity-60">
                        {pet.exp}<span className="opacity-50">/</span>{expToNext}
                      </span>
                    </div>
                    <PixelProgress value={pet.exp} max={expToNext} variant="cobalt" />
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="label-text" style={{ color: 'var(--vermillion)' }}>幸福度</span>
                      <span className="font-mono text-[0.7rem] tabular-nums opacity-60">{pet.happiness}%</span>
                    </div>
                    <PixelProgress value={pet.happiness} max={100} variant="vermillion" />
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="label-text" style={{ color: 'var(--mustard-dark)' }}>満腹度</span>
                      <span className="font-mono text-[0.7rem] tabular-nums opacity-60">{100 - pet.hunger}%</span>
                    </div>
                    <PixelProgress value={100 - pet.hunger} max={100} variant="mustard" />
                  </div>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Actions & Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Action buttons */}
            <div>
              <div className="label-text mb-3">アクション</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction('feed', 'eating', '🍖 美味しい!')}
                  disabled={state !== 'idle'}
                  className="p-4 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--mustard)] hover:bg-opacity-20 transition-colors disabled:opacity-40 text-left"
                >
                  <div className="text-2xl mb-1">🍖</div>
                  <div className="font-display text-sm">食事</div>
                  <div className="caption-text">満腹度 UP</div>
                </button>

                <button
                  onClick={() => handleAction('pet', 'happy', '✨ 嬉しい!')}
                  disabled={state !== 'idle'}
                  className="p-4 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--vermillion)] hover:bg-opacity-20 transition-colors disabled:opacity-40 text-left"
                >
                  <div className="text-2xl mb-1">🤗</div>
                  <div className="font-display text-sm">なでる</div>
                  <div className="caption-text">幸福度 UP</div>
                </button>

                <button
                  onClick={() => handleAction('study', 'studying', '📚 勉強中…')}
                  disabled={state !== 'idle'}
                  className="p-4 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--cobalt)] hover:bg-opacity-20 transition-colors disabled:opacity-40 text-left"
                >
                  <div className="text-2xl mb-1">📚</div>
                  <div className="font-display text-sm">学習</div>
                  <div className="caption-text">経験値 +20</div>
                </button>

                <button
                  onClick={() => handleAction('sleep', 'sleeping', '💤 おやすみ…')}
                  disabled={state !== 'idle'}
                  className="p-4 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--ink)] hover:bg-opacity-10 transition-colors disabled:opacity-40 text-left"
                >
                  <div className="text-2xl mb-1">💤</div>
                  <div className="font-display text-sm">睡眠</div>
                  <div className="caption-text">回復</div>
                </button>
              </div>
            </div>

            {/* Info card */}
            <PixelCard>
              <div className="label-text mb-4" style={{ color: 'var(--vermillion)' }}>プロフィール</div>
              <dl className="space-y-3">
                <div className="flex justify-between items-baseline pb-2 border-b-[1px] border-[var(--ink)] border-opacity-15">
                  <dt className="label-text opacity-60">名前</dt>
                  <dd className="font-display text-base">{pet.name}</dd>
                </div>
                <div className="flex justify-between items-baseline pb-2 border-b-[1px] border-[var(--ink)] border-opacity-15">
                  <dt className="label-text opacity-60">種類</dt>
                  <dd className="font-body text-base">{pet.species === 'dog' ? '柴犬' : pet.species === 'cat' ? '猫' : '兎'}</dd>
                </div>
                <div className="flex justify-between items-baseline pb-2 border-b-[1px] border-[var(--ink)] border-opacity-15">
                  <dt className="label-text opacity-60">レベル</dt>
                  <dd className="font-mono text-base tabular-nums">{pet.level}</dd>
                </div>
                <div className="flex justify-between items-baseline pb-2 border-b-[1px] border-[var(--ink)] border-opacity-15">
                  <dt className="label-text opacity-60">進化</dt>
                  <dd className="font-body text-base">{evolutionName}</dd>
                </div>
                <div className="flex justify-between items-baseline">
                  <dt className="label-text opacity-60">次へ</dt>
                  <dd className="font-body text-sm opacity-70">
                    {pet.evolution === 1 ? `Lv.${11 - pet.level}` : pet.evolution === 2 ? `Lv.${26 - pet.level}` : 'MAX'}
                  </dd>
                </div>
              </dl>
            </PixelCard>
          </div>
        </div>
      </main>
    </div>
  );
}
