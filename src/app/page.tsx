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
      title: '假名学习',
      subtitle: '五十音图',
      color: 'var(--vermillion)',
      progress: kanaMastered,
      total: 46,
    },
    {
      href: '/vocabulary',
      icon: '📖',
      title: '词汇',
      subtitle: '基础单词',
      color: 'var(--cobalt)',
      progress: vocabMastered,
      total: 11,
    },
    {
      href: '/grammar',
      icon: '📝',
      title: '语法',
      subtitle: '入门语法',
      color: 'var(--mustard-dark)',
      progress: grammarMastered,
      total: 5,
    },
    {
      href: '/practice',
      icon: '💬',
      title: 'AI 对话',
      subtitle: '场景练习',
      color: 'var(--sage)',
      progress: null,
      total: null,
    },
    {
      href: '/quiz',
      icon: '✨',
      title: '测验',
      subtitle: '巩固所学',
      color: 'var(--ink)',
      progress: null,
      total: null,
    },
    {
      href: '/pet',
      icon: '🐾',
      title: '我的宠物',
      subtitle: pet ? `${pet.name} Lv.${pet.level}` : '陪伴学习',
      color: 'var(--vermillion)',
      progress: null,
      total: null,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="label-text">加载中…</div>
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
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-[0.85rem] font-body hidden sm:inline">{user.name}</span>
                <Link href="/dashboard">
                  <PixelButton variant="primary" size="sm">进入学习</PixelButton>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <PixelButton variant="ghost" size="sm">登录</PixelButton>
                </Link>
                <Link href="/register">
                  <PixelButton variant="primary" size="sm">注册</PixelButton>
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
                    欢迎回来,<br />
                    <span className="riso-shift-red">{user.name}</span>
                  </>
                ) : (
                  <>
                    从零开始<br />
                    <span style={{ color: 'var(--vermillion)' }}>学日语</span>的旅程
                  </>
                )}
              </h1>

              <p className="body-text max-w-md opacity-75 mb-6">
                {user
                  ? '今天也向前迈一步,和你的宠物一起学新词。'
                  : 'AI 老师详细讲解,像素宠物陪伴学习,零基础也能轻松入门。'}
              </p>

              {!user && (
                <div className="flex gap-3">
                  <Link href="/register">
                    <PixelButton variant="primary">免费开始 →</PixelButton>
                  </Link>
                  <Link href="/login">
                    <PixelButton variant="secondary">已有账号</PixelButton>
                  </Link>
                </div>
              )}
            </div>

            {/* Pet / Stamp decoration */}
            <div className="md:col-span-4 relative h-32 md:h-40">
              {pet ? (
                <div className="absolute inset-0 flex flex-col items-end justify-end">
                  <div className="text-right">
                    <div className="label-text mb-1 opacity-50">今日伙伴</div>
                    <div className="font-display text-3xl">{pet.name}</div>
                    <div className="caption-text">Lv. {pet.level}</div>
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
                <div className="label-text mb-1" style={{ color: 'var(--vermillion)' }}>假名</div>
                <div className="font-display text-2xl tabular-nums">{kanaMastered}<span className="text-[0.8rem] opacity-50">/46</span></div>
              </div>
              <div className="bg-[var(--paper)] p-4">
                <div className="label-text mb-1" style={{ color: 'var(--cobalt)' }}>词汇</div>
                <div className="font-display text-2xl tabular-nums">{vocabMastered}<span className="text-[0.8rem] opacity-50">/11</span></div>
              </div>
              <div className="bg-[var(--paper)] p-4">
                <div className="label-text mb-1" style={{ color: 'var(--mustard-dark)' }}>语法</div>
                <div className="font-display text-2xl tabular-nums">{grammarMastered}<span className="text-[0.8rem] opacity-50">/5</span></div>
              </div>
            </div>
          )}
        </section>

        {/* Section Title */}
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="heading-md">学习模块</h2>
            <span className="label-text opacity-50">— 目录</span>
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
                        label="进度"
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
              <span className="caption-text">© 2026 — 每天进步一点点</span>
            </div>
            <div className="flex gap-4 caption-text">
              <span>中文</span>
              <span>·</span>
              <span>日本語</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
