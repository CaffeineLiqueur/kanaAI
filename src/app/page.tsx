'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge } from '@/components/ui';

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
      subtitle: '平假名 · 片假名',
      color: '#FFD700',
      progress: kanaMastered,
      total: 46,
    },
    {
      href: '/vocabulary',
      icon: '📖',
      title: '单词本',
      subtitle: '基础词汇',
      color: '#4ADE80',
      progress: vocabMastered,
      total: 11,
    },
    {
      href: '/grammar',
      icon: '📝',
      title: '语法入门',
      subtitle: '基础语法',
      color: '#3B82F6',
      progress: grammarMastered,
      total: 5,
    },
    {
      href: '/practice',
      icon: '💬',
      title: 'AI 对话',
      subtitle: '场景练习',
      color: '#A78BFA',
      progress: null,
      total: null,
    },
    {
      href: '/quiz',
      icon: '✨',
      title: '智能测验',
      subtitle: '测试水平',
      color: '#F59E0B',
      progress: null,
      total: null,
    },
    {
      href: '/pet',
      icon: '🐾',
      title: '我的宠物',
      subtitle: pet ? `${pet.name} Lv.${pet.level}` : '培养伙伴',
      color: '#EC4899',
      progress: null,
      total: null,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E1] pixel-grid flex items-center justify-center">
        <div className="text-xs text-[#666666]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E1] pixel-grid">
      {/* Header */}
      <header className="border-b-4 border-black bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF1C1C] border-3 border-black flex items-center justify-center">
              <span className="text-white text-lg">あ</span>
            </div>
            <h1 className="text-sm text-[#2D2D2D]">kanaAI</h1>
          </div>
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-[10px] text-[#666666]">{user.name}</span>
                <Link href="/dashboard">
                  <PixelButton size="sm">Dashboard</PixelButton>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <PixelButton variant="ghost" size="sm">登录</PixelButton>
                </Link>
                <Link href="/register">
                  <PixelButton size="sm">注册</PixelButton>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome / Pet Section */}
        {user && pet && (
          <div className="mb-8">
            <PixelCard>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#FFD700] border-3 border-black flex items-center justify-center shrink-0">
                  <span className="text-3xl">
                    {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐰'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">{pet.name}</span>
                    <PixelBadge variant="level" size="sm">Lv.{pet.level}</PixelBadge>
                  </div>
                  <PixelProgress value={pet.happiness} label="心情" variant="default" showLabel />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#666666]">欢迎回来，{user.name}！</p>
                  <p className="text-[10px] text-[#666666]">今天也要加油哦 💪</p>
                </div>
              </div>
            </PixelCard>
          </div>
        )}

        {/* Guest Welcome */}
        {!user && (
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-[#FF1C1C] border-4 border-black mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-3xl">あ</span>
            </div>
            <h2 className="text-lg text-[#2D2D2D] mb-2">kanaAI</h2>
            <p className="text-[10px] text-[#666666] mb-4">AI 驱动的日语学习应用</p>
            <div className="flex justify-center gap-3">
              <Link href="/register">
                <PixelButton>免费注册</PixelButton>
              </Link>
              <Link href="/login">
                <PixelButton variant="secondary">登录</PixelButton>
              </Link>
            </div>
          </div>
        )}

        {/* Module Grid */}
        <h2 className="text-xs mb-4 text-[#2D2D2D]">学习模块</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Link key={mod.href} href={user ? mod.href : '/login'}>
              <PixelCard className="hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform cursor-pointer h-full">
                <div className="flex flex-col items-center text-center py-2">
                  <div
                    className="w-14 h-14 border-3 border-black flex items-center justify-center mb-3"
                    style={{ backgroundColor: mod.color }}
                  >
                    <span className="text-2xl">{mod.icon}</span>
                  </div>
                  <h3 className="text-xs mb-1">{mod.title}</h3>
                  <p className="text-[10px] text-[#666666]">{mod.subtitle}</p>
                  {mod.progress !== null && mod.total !== null && (
                    <div className="w-full mt-3">
                      <PixelProgress
                        value={mod.progress}
                        max={mod.total}
                        variant="exp"
                      />
                      <p className="text-[8px] text-[#999999] mt-1">
                        {mod.progress}/{mod.total}
                      </p>
                    </div>
                  )}
                </div>
              </PixelCard>
            </Link>
          ))}
        </div>

        {/* Quick Stats for logged in users */}
        {user && (
          <div className="mt-8">
            <h2 className="text-xs mb-4 text-[#2D2D2D]">学习统计</h2>
            <div className="grid grid-cols-3 gap-4">
              <PixelCard padding="sm">
                <div className="text-center">
                  <div className="text-lg text-[#FFD700]">{kanaMastered}</div>
                  <div className="text-[10px] text-[#666666]">假名已掌握</div>
                </div>
              </PixelCard>
              <PixelCard padding="sm">
                <div className="text-center">
                  <div className="text-lg text-[#4ADE80]">{vocabMastered}</div>
                  <div className="text-[10px] text-[#666666]">词汇已掌握</div>
                </div>
              </PixelCard>
              <PixelCard padding="sm">
                <div className="text-center">
                  <div className="text-lg text-[#3B82F6]">{grammarMastered}</div>
                  <div className="text-[10px] text-[#666666]">语法已掌握</div>
                </div>
              </PixelCard>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-[10px] text-[#666666]">
            © 2026 kanaAI - 每天进步一点点！
          </p>
        </div>
      </footer>
    </div>
  );
}
