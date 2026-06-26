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
        // Fetch user
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch pet
        const petRes = await fetch('/api/pet');
        if (petRes.ok) {
          const petData = await petRes.json();
          setPet(petData.pet);
        }

        // Fetch progress
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
      <div className="min-h-screen bg-[#F5F0E1] pixel-grid flex items-center justify-center">
        <div className="text-xs text-[#666666]">加载中...</div>
      </div>
    );
  }

  // Calculate progress stats
  const kanaProgress = progress.filter(p => p.module === 'kana');
  const kanaMastered = kanaProgress.filter(p => p.mastered).length;
  const vocabProgress = progress.filter(p => p.module === 'vocabulary');
  const vocabMastered = vocabProgress.filter(p => p.mastered).length;
  const grammarProgress = progress.filter(p => p.module === 'grammar');
  const grammarMastered = grammarProgress.filter(p => p.mastered).length;

  const totalMastered = kanaMastered + vocabMastered + grammarMastered;
  const userLevel = Math.max(1, Math.floor(totalMastered / 10) + 1);
  const userExp = (totalMastered % 10) * 50;
  const expToNext = 500;

  return (
    <div className="min-h-screen bg-[#F5F0E1] pixel-grid">
      {/* Header */}
      <header className="border-b-4 border-black bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF1C1C] border-3 border-black flex items-center justify-center">
              <span className="text-white text-lg">あ</span>
            </div>
            <h1 className="text-sm text-[#2D2D2D]">kanaAI</h1>
          </div>
          <div className="flex items-center gap-4">
            <PixelBadge variant="level">Lv.{userLevel}</PixelBadge>
            <div className="flex items-center gap-2">
              <span className="text-[10px]">{user.name}</span>
              <button
                onClick={handleLogout}
                className="w-10 h-10 bg-[#FFD700] border-3 border-black rounded-full flex items-center justify-center hover:bg-[#FFC800]"
              >
                <span className="text-sm">👤</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <PixelCard>
            <p className="text-xs">欢迎回来，{user.name}！</p>
            <p className="text-[#666666] text-[10px] mt-2">
              今天也来学习日语吧，你的宠物在等你哦！
            </p>
          </PixelCard>
        </div>

        {/* User Stats & Pet Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Stats */}
          <PixelCard>
            <h2 className="text-xs mb-4">学习状态</h2>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px]">等级</span>
                  <span className="text-[10px]">{userLevel}</span>
                </div>
                <PixelProgress
                  value={userExp}
                  max={expToNext}
                  variant="exp"
                />
                <div className="text-[10px] text-right mt-1 text-[#666666]">
                  {userExp}/{expToNext} EXP
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#FFD700] border-2 border-black">
                <span className="text-[10px]">已掌握</span>
                <span className="text-xs font-bold">{totalMastered} 项</span>
              </div>
            </div>
          </PixelCard>

          {/* Pet Card */}
          <PixelCard className="lg:col-span-2">
            {pet ? (
              <div className="flex items-center gap-6">
                {/* Pet Sprite */}
                <div className="w-32 h-32 bg-[#FFD700] border-4 border-black flex items-center justify-center shrink-0">
                  <span className="text-6xl">
                    {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐰'}
                  </span>
                </div>

                {/* Pet Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm">{pet.name}</h3>
                    <PixelBadge variant="level">Lv.{pet.level}</PixelBadge>
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    <PixelProgress
                      value={pet.exp}
                      max={getExpForLevel(pet.level)}
                      label="经验"
                      variant="exp"
                      showLabel
                    />
                    <PixelProgress
                      value={pet.happiness}
                      label="心情"
                      variant="default"
                      showLabel
                    />
                    <PixelProgress
                      value={100 - pet.hunger}
                      label="饱腹"
                      showLabel
                    />
                  </div>

                  <div className="flex gap-2">
                    <Link href="/pet">
                      <PixelButton size="sm" variant="accent">
                        查看宠物
                      </PixelButton>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[10px] text-[#666666]">加载宠物信息中...</p>
              </div>
            )}
          </PixelCard>
        </div>

        {/* Learning Modules Grid */}
        <h2 className="text-xs mb-4">学习模块</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kana Module */}
          <Link href="/kana">
            <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#FFD700] border-3 border-black flex items-center justify-center">
                  <span className="text-lg">あ</span>
                </div>
                <div>
                  <h3 className="text-xs">假名学习</h3>
                  <p className="text-[10px] text-[#666666]">平假名 · 片假名</p>
                </div>
              </div>
              <PixelProgress
                value={kanaMastered}
                max={46}
                label="进度"
                showLabel
              />
            </PixelCard>
          </Link>

          {/* Vocabulary Module */}
          <Link href="/vocabulary">
            <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#4ADE80] border-3 border-black flex items-center justify-center">
                  <span className="text-lg">📖</span>
                </div>
                <div>
                  <h3 className="text-xs">单词本</h3>
                  <p className="text-[10px] text-[#666666]">基础词汇</p>
                </div>
              </div>
              <PixelProgress
                value={vocabMastered}
                max={11}
                label="进度"
                variant="exp"
                showLabel
              />
            </PixelCard>
          </Link>

          {/* Grammar Module */}
          <Link href="/grammar">
            <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#3B82F6] border-3 border-black flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
                <div>
                  <h3 className="text-xs">语法入门</h3>
                  <p className="text-[10px] text-[#666666]">基础语法</p>
                </div>
              </div>
              <PixelProgress
                value={grammarMastered}
                max={5}
                label="进度"
                variant="default"
                showLabel
              />
            </PixelCard>
          </Link>

          {/* AI Chat Module */}
          <Link href="/practice">
            <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#A78BFA] border-3 border-black flex items-center justify-center">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <h3 className="text-xs">AI 对话练习</h3>
                  <p className="text-[10px] text-[#666666]">场景对话</p>
                </div>
              </div>
              <div className="text-[10px] text-[#666666]">
                6个场景可供练习
              </div>
            </PixelCard>
          </Link>

          {/* Quiz Module */}
          <Link href="/quiz">
            <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#F59E0B] border-3 border-black flex items-center justify-center">
                  <span className="text-lg">✨</span>
                </div>
                <div>
                  <h3 className="text-xs">智能测验</h3>
                  <p className="text-[10px] text-[#666666]">AI 出题</p>
                </div>
              </div>
              <div className="text-[10px] text-[#666666]">
                测试你的日语水平
              </div>
            </PixelCard>
          </Link>

          {/* Pet Module */}
          <Link href="/pet">
            <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform cursor-pointer h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#EC4899] border-3 border-black flex items-center justify-center">
                  <span className="text-lg">🐾</span>
                </div>
                <div>
                  <h3 className="text-xs">我的宠物</h3>
                  <p className="text-[10px] text-[#666666]">培养伙伴</p>
                </div>
              </div>
              <div className="text-[10px] text-[#666666]">
                {pet ? `${pet.name} - Lv.${pet.level}` : '加载中...'}
              </div>
            </PixelCard>
          </Link>
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
