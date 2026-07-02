'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge } from '@/components/ui';
import { getExpForLevel } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  level: number;
  exp: number;
  happiness: number;
  hunger: number;
  evolution: number;
}

interface ProgressItem {
  id: string;
  module: string;
  itemId: string;
  mastered: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);

        const petRes = await fetch('/api/pet');
        if (petRes.ok) {
          const petData = await petRes.json();
          setPet(petData.pet);
        }

        const progressRes = await fetch('/api/progress');
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData.progress);
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="label-text">読み込み中…</div>
      </div>
    );
  }

  const kanaProgress = progress.filter(p => p.module === 'kana');
  const kanaMastered = kanaProgress.filter(p => p.mastered).length;
  const vocabProgress = progress.filter(p => p.module === 'vocabulary');
  const vocabMastered = vocabProgress.filter(p => p.mastered).length;
  const grammarProgress = progress.filter(p => p.module === 'grammar');
  const grammarMastered = grammarProgress.filter(p => p.mastered).length;

  const totalMastered = kanaMastered + vocabMastered + grammarMastered;
  const userLevel = Math.max(1, Math.floor(totalMastered / 10) + 1);
  const expToNext = getExpForLevel(userLevel);
  const userExp = (totalMastered % 10) * 50;

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b-[1.5px] border-[var(--ink)] bg-[var(--paper)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-medium tracking-tight">kana</span>
            <span className="font-display text-2xl font-medium tracking-tight" style={{ color: 'var(--vermillion)' }}>AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <PixelBadge variant="ink" filled>LV. {String(userLevel).padStart(2, '0')}</PixelBadge>
            <div className="flex items-center gap-2">
              <span className="text-[0.85rem] font-body">{user.name}</span>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-full border-[1.5px] border-[var(--ink)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
                title="ログアウト"
              >
                <span className="text-[0.85rem]">↗</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Greeting */}
        <section className="mb-12 fade-up">
          <div className="label-text mb-2">本日 — TODAY</div>
          <h1 className="heading-lg mb-2">
            こんにちは、<span style={{ color: 'var(--vermillion)' }}>{user.name}</span>さん
          </h1>
          <p className="body-text opacity-70">今日も相棒と一緒に、日本語を学びましょう。</p>
        </section>

        {/* Main grid: User stats + Pet */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* User stats */}
          <div className="lg:col-span-5 fade-up" style={{ animationDelay: '100ms' }}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="label-text">学習状況</h2>
              <span className="caption-text">STATS</span>
            </div>
            <PixelCard>
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-display text-[0.8rem] opacity-60">EXPERIENCE</span>
                    <span className="font-mono text-[0.85rem] tabular-nums">
                      {userExp}<span className="opacity-40"> / </span>{expToNext}
                    </span>
                  </div>
                  <PixelProgress value={userExp} max={expToNext} variant="vermillion" />
                </div>

                <div className="divider-line"></div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="label-text" style={{ color: 'var(--vermillion)' }}>仮名</div>
                    <div className="font-display text-2xl tabular-nums">{kanaMastered}</div>
                  </div>
                  <div>
                    <div className="label-text" style={{ color: 'var(--cobalt)' }}>語彙</div>
                    <div className="font-display text-2xl tabular-nums">{vocabMastered}</div>
                  </div>
                  <div>
                    <div className="label-text" style={{ color: 'var(--mustard-dark)' }}>文法</div>
                    <div className="font-display text-2xl tabular-nums">{grammarMastered}</div>
                  </div>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Pet */}
          <div className="lg:col-span-7 fade-up" style={{ animationDelay: '180ms' }}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="label-text">相棒</h2>
              <Link href="/pet" className="caption-text hover:opacity-100">詳細 →</Link>
            </div>
            {pet ? (
              <PixelCard className="relative overflow-hidden">
                <div className="absolute top-4 right-4 halftone-ink w-20 h-20 opacity-20"></div>

                <div className="flex items-center gap-6 relative">
                  <div className="shrink-0 w-28 h-28 border-[1.5px] border-[var(--ink)] flex items-center justify-center bg-[var(--paper-warm)]">
                    <span className="text-6xl drift">
                      {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐰'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-display text-2xl font-medium">{pet.name}</h3>
                      <span className="label-text">Lv. {pet.level}</span>
                    </div>
                    <div className="caption-text mb-4">
                      Stage {pet.evolution} · {pet.species === 'dog' ? '柴犬' : pet.species === 'cat' ? '猫' : '兎'}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="label-text" style={{ color: 'var(--cobalt)' }}>経験値</span>
                          <span className="text-[0.7rem] font-mono tabular-nums opacity-60">
                            {pet.exp} <span className="opacity-50">/</span> {getExpForLevel(pet.level)}
                          </span>
                        </div>
                        <PixelProgress value={pet.exp} max={getExpForLevel(pet.level)} variant="cobalt" />
                      </div>
                      <div>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="label-text" style={{ color: 'var(--vermillion)' }}>幸福度</span>
                          <span className="text-[0.7rem] font-mono tabular-nums opacity-60">{pet.happiness}%</span>
                        </div>
                        <PixelProgress value={pet.happiness} max={100} variant="vermillion" />
                      </div>
                    </div>
                  </div>
                </div>
              </PixelCard>
            ) : (
              <PixelCard>
                <p className="caption-text">相棒を読み込み中…</p>
              </PixelCard>
            )}
          </div>
        </section>

        {/* Modules section title */}
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="heading-md">学習を続ける</h2>
            <span className="label-text opacity-50">— MODULES</span>
          </div>
          <div className="divider-thick"></div>
        </section>

        {/* Modules grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Link href="/kana" className="fade-up" style={{ animationDelay: '240ms' }}>
            <PixelCard className="hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display text-3xl" style={{ color: 'var(--vermillion)' }}>あ</span>
                  <span className="label-text opacity-50">01</span>
                </div>
                <h3 className="font-display text-base font-medium mb-1">仮名</h3>
                <p className="caption-text mb-3">平仮名 · 片仮名</p>
                <div className="mt-auto">
                  <PixelProgress value={kanaMastered} max={46} variant="vermillion" showLabel label="進捗" />
                </div>
              </div>
            </PixelCard>
          </Link>

          <Link href="/vocabulary" className="fade-up" style={{ animationDelay: '300ms' }}>
            <PixelCard className="hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display text-3xl" style={{ color: 'var(--cobalt)' }}>言</span>
                  <span className="label-text opacity-50">02</span>
                </div>
                <h3 className="font-display text-base font-medium mb-1">語彙</h3>
                <p className="caption-text mb-3">単語 · Vocabulary</p>
                <div className="mt-auto">
                  <PixelProgress value={vocabMastered} max={11} variant="cobalt" showLabel label="進捗" />
                </div>
              </div>
            </PixelCard>
          </Link>

          <Link href="/grammar" className="fade-up" style={{ animationDelay: '360ms' }}>
            <PixelCard className="hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display text-3xl" style={{ color: 'var(--mustard-dark)' }}>文</span>
                  <span className="label-text opacity-50">03</span>
                </div>
                <h3 className="font-display text-base font-medium mb-1">文法</h3>
                <p className="caption-text mb-3">基礎 · Grammar</p>
                <div className="mt-auto">
                  <PixelProgress value={grammarMastered} max={5} variant="mustard" showLabel label="進捗" />
                </div>
              </div>
            </PixelCard>
          </Link>

          <Link href="/practice" className="fade-up" style={{ animationDelay: '420ms' }}>
            <PixelCard className="hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display text-3xl" style={{ color: 'var(--sage)' }}>話</span>
                  <span className="label-text opacity-50">04</span>
                </div>
                <h3 className="font-display text-base font-medium mb-1">AI 会話</h3>
                <p className="caption-text mb-3">実践 · Practice</p>
                <p className="caption-text mt-auto opacity-50">6 シーン</p>
              </div>
            </PixelCard>
          </Link>

          <Link href="/quiz" className="fade-up" style={{ animationDelay: '480ms' }}>
            <PixelCard className="hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display text-3xl" style={{ color: 'var(--ink)' }}>試</span>
                  <span className="label-text opacity-50">05</span>
                </div>
                <h3 className="font-display text-base font-medium mb-1">試験</h3>
                <p className="caption-text mb-3">確認 · Quiz</p>
                <p className="caption-text mt-auto opacity-50">総合テスト</p>
              </div>
            </PixelCard>
          </Link>

          <Link href="/pet" className="fade-up" style={{ animationDelay: '540ms' }}>
            <PixelCard className="hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display text-3xl" style={{ color: 'var(--vermillion)' }}>
                    {pet ? (pet.species === 'dog' ? '犬' : pet.species === 'cat' ? '猫' : '兎') : '宝'}
                  </span>
                  <span className="label-text opacity-50">06</span>
                </div>
                <h3 className="font-display text-base font-medium mb-1">相棒</h3>
                <p className="caption-text mb-3">ペット · Pet</p>
                <p className="caption-text mt-auto opacity-50">
                  {pet ? `${pet.name} · Lv.${pet.level}` : '—'}
                </p>
              </div>
            </PixelCard>
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-6 border-t-[1.5px] border-[var(--ink)] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm">kanaAI</span>
            <span className="h-[12px] w-[1.5px] bg-[var(--ink)] opacity-30"></span>
            <span className="caption-text">© 2026</span>
          </div>
          <div className="caption-text opacity-50">東京 — 日本語</div>
        </footer>
      </main>
    </div>
  );
}
