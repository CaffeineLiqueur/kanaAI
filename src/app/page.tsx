'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress } from '@/components/ui';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Pet {
  name: string;
  species: string;
  level: number;
  happiness: number;
}

interface ProgressItem {
  module: string;
  itemId: string;
  mastered: boolean;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);

          const [petRes, progressRes] = await Promise.all([
            fetch('/api/pet'),
            fetch('/api/progress'),
          ]);

          if (petRes.ok) {
            const petData = await petRes.json();
            setPet(petData.pet);
          }
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            setProgress(progressData.progress);
          }
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const kanaMastered = progress.filter(p => p.module === 'kana' && p.mastered).length;
  const vocabMastered = progress.filter(p => p.module === 'vocabulary' && p.mastered).length;
  const grammarMastered = progress.filter(p => p.module === 'grammar' && p.mastered).length;

  const modules = [
    {
      href: '/kana',
      icon: 'あ',
      jpTitle: '仮名',
      title: '假名',
      subtitle: 'Hiragana · Katakana',
      color: 'var(--vermillion)',
      progress: kanaMastered,
      total: 46,
    },
    {
      href: '/vocabulary',
      icon: '言',
      jpTitle: '語彙',
      title: '词汇',
      subtitle: 'Vocabulary',
      color: 'var(--cobalt)',
      progress: vocabMastered,
      total: 11,
    },
    {
      href: '/grammar',
      icon: '文',
      jpTitle: '文法',
      title: '语法',
      subtitle: 'Grammar',
      color: 'var(--mustard-dark)',
      progress: grammarMastered,
      total: 5,
    },
    {
      href: '/practice',
      icon: '話',
      jpTitle: '会話',
      title: 'AI 对话',
      subtitle: 'AI Practice',
      color: 'var(--sage)',
      progress: null,
      total: null,
    },
    {
      href: '/quiz',
      icon: '試',
      jpTitle: '試験',
      title: '测验',
      subtitle: 'Quiz',
      color: 'var(--ink)',
      progress: null,
      total: null,
    },
    {
      href: '/pet',
      icon: pet ? (pet.species === 'dog' ? '犬' : pet.species === 'cat' ? '猫' : '兎') : '宝',
      jpTitle: '相棒',
      title: '我的宠物',
      subtitle: pet ? `${pet.name} Lv.${pet.level}` : 'Pet Partner',
      color: 'var(--vermillion)',
      progress: null,
      total: null,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="label-text">読み込み中…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b-[1.5px] border-[var(--ink)] bg-[var(--paper)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-medium tracking-tight">kana</span>
            <span className="font-display text-2xl font-medium tracking-tight" style={{ color: 'var(--vermillion)' }}>AI</span>
            <span className="writing-vertical text-[0.65rem] opacity-50 ml-1">日本語</span>
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-[0.8rem] font-body hidden sm:inline">{user.name}</span>
                <Link href="/dashboard">
                  <PixelButton variant="primary" size="sm">Dashboard</PixelButton>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <PixelButton variant="ghost" size="sm">ログイン</PixelButton>
                </Link>
                <Link href="/register">
                  <PixelButton variant="primary" size="sm">登録</PixelButton>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero / Welcome Section */}
        <section className="mb-16 fade-up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="label-text">EST. 2026</span>
                <span className="h-[1px] w-12 bg-[var(--ink)] opacity-30"></span>
                <span className="label-text" style={{ color: 'var(--vermillion)' }}>VOL. 01</span>
              </div>

              <h1 className="heading-xl mb-6">
                {user ? (
                  <>
                    おかえり、<br/>
                    <span className="riso-shift-red">{user.name}</span>さん
                  </>
                ) : (
                  <>
                    ゼロから始める<br/>
                    <span style={{ color: 'var(--vermillion)' }}>日本語</span>の旅
                  </>
                )}
              </h1>

              <p className="body-text max-w-md opacity-75 mb-6">
                {user
                  ? '今日も一歩前進。相棒と一緒に、新しい言葉を覚えよう。'
                  : 'AI 先生の丁寧な解説と、ピクセルペットとの毎日の学習で、日本語を自然に身につける。'}
              </p>

              {!user && (
                <div className="flex gap-3">
                  <Link href="/register">
                    <PixelButton variant="primary">無料で始める →</PixelButton>
                  </Link>
                  <Link href="/login">
                    <PixelButton variant="secondary">ログイン</PixelButton>
                  </Link>
                </div>
              )}
            </div>

            {/* Pet / Stamp decoration */}
            <div className="md:col-span-4 relative h-32 md:h-40">
              {pet ? (
                <div className="absolute inset-0 flex flex-col items-end justify-end">
                  <div className="text-right">
                    <div className="label-text mb-1">今日の相棒</div>
                    <div className="font-display text-3xl">{pet.name}</div>
                    <div className="caption-text">Lv. {pet.level} · {pet.species === 'dog' ? '柴犬' : pet.species === 'cat' ? '猫' : '兎'}</div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-end">
                  <div className="kanji-stamp drift">学</div>
                </div>
              )}
            </div>
          </div>

          {/* Stats line */}
          {user && (
            <div className="mt-10 grid grid-cols-3 gap-px bg-[var(--ink)] bg-opacity-15 border-[1.5px] border-[var(--ink)]">
              <div className="bg-[var(--paper)] p-4">
                <div className="label-text mb-1" style={{ color: 'var(--vermillion)' }}>仮名</div>
                <div className="font-display text-2xl tabular-nums">{kanaMastered}<span className="text-[0.8rem] opacity-50">/46</span></div>
              </div>
              <div className="bg-[var(--paper)] p-4">
                <div className="label-text mb-1" style={{ color: 'var(--cobalt)' }}>語彙</div>
                <div className="font-display text-2xl tabular-nums">{vocabMastered}<span className="text-[0.8rem] opacity-50">/11</span></div>
              </div>
              <div className="bg-[var(--paper)] p-4">
                <div className="label-text mb-1" style={{ color: 'var(--mustard-dark)' }}>文法</div>
                <div className="font-display text-2xl tabular-nums">{grammarMastered}<span className="text-[0.8rem] opacity-50">/5</span></div>
              </div>
            </div>
          )}
        </section>

        {/* Section Title */}
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="heading-md">学習モジュール</h2>
            <span className="label-text opacity-50">— 目次</span>
          </div>
          <div className="divider-thick"></div>
        </section>

        {/* Module Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <Link key={mod.href} href={user ? mod.href : '/login'} className="block fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <PixelCard className="h-full hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="font-display text-3xl font-medium"
                      style={{ color: mod.color }}
                    >
                      {mod.icon}
                    </span>
                    <span className="label-text opacity-50">No. 0{i + 1}</span>
                  </div>

                  <div className="mb-3">
                    <div className="writing-vertical absolute hidden"></div>
                    <div className="font-display text-[0.7rem] opacity-50 mb-0.5">{mod.jpTitle}</div>
                    <h3 className="font-display text-lg font-medium leading-tight mb-1">{mod.title}</h3>
                    <p className="caption-text">{mod.subtitle}</p>
                  </div>

                  {mod.progress !== null && mod.total !== null && (
                    <div className="mt-auto pt-3">
                      <PixelProgress
                        value={mod.progress}
                        max={mod.total}
                        variant="vermillion"
                        showLabel
                        label="進捗"
                      />
                    </div>
                  )}
                </div>
              </PixelCard>
            </Link>
          ))}
        </section>

        {/* Footer decoration */}
        <section className="mt-20 pt-8 border-t-[1.5px] border-[var(--ink)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm">kanaAI</span>
              <span className="h-[12px] w-[1.5px] bg-[var(--ink)]"></span>
              <span className="caption-text">© 2026 — 毎日少しずつ</span>
            </div>
            <div className="flex gap-4 caption-text">
              <span>Tokyo</span>
              <span>·</span>
              <span>日本語</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
