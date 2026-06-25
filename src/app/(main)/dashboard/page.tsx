'use client';

import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PixelDialog } from '@/components/ui';

// 模拟数据 - 实际应从API获取
const mockUser = {
  name: '学习者',
  level: 5,
  exp: 350,
  expToNext: 500,
  streak: 7,
};

const mockPet = {
  name: '小柴',
  species: 'dog',
  level: 8,
  happiness: 85,
  hunger: 30,
};

const dailyGoals = [
  { id: 1, name: '学习5个假名', completed: true, exp: 50 },
  { id: 2, name: '复习10个单词', completed: true, exp: 50 },
  { id: 3, name: '学习1个语法点', completed: false, exp: 30 },
  { id: 4, name: 'AI对话练习', completed: false, exp: 40 },
];

export default function DashboardPage() {
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
            <PixelBadge variant="level">Lv.{mockUser.level}</PixelBadge>
            <PixelBadge variant="exp">🔥 连续{mockUser.streak}天</PixelBadge>
            <div className="w-10 h-10 bg-[#FFD700] border-3 border-black rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <PixelDialog>
            <p>欢迎回来，{mockUser.name}！</p>
            <p className="text-[#666666] text-[10px] mt-2">
              今天也来学习日语吧，你的宠物在等你哦！
            </p>
          </PixelDialog>
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
                  <span className="text-[10px]">{mockUser.level}</span>
                </div>
                <PixelProgress
                  value={mockUser.exp}
                  max={mockUser.expToNext}
                  variant="exp"
                />
                <div className="text-[10px] text-right mt-1 text-[#666666]">
                  {mockUser.exp}/{mockUser.expToNext} EXP
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#FFD700] border-2 border-black">
                <span className="text-[10px]">连续学习</span>
                <span className="text-xs font-bold">{mockUser.streak}天 🔥</span>
              </div>
            </div>
          </PixelCard>

          {/* Pet Card */}
          <PixelCard className="lg:col-span-2">
            <div className="flex items-center gap-6">
              {/* Pet Sprite */}
              <div className="w-32 h-32 bg-[#FFD700] border-4 border-black flex items-center justify-center shrink-0">
                <span className="text-6xl">
                  {mockPet.species === 'dog' ? '🐕' : mockPet.species === 'cat' ? '🐱' : '🐰'}
                </span>
              </div>

              {/* Pet Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm">{mockPet.name}</h3>
                  <PixelBadge variant="level">Lv.{mockPet.level}</PixelBadge>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <PixelProgress
                    value={mockPet.happiness}
                    label="心情"
                    variant="exp"
                    showLabel
                  />
                  <PixelProgress
                    value={100 - mockPet.hunger}
                    label="饱腹"
                    showLabel
                  />
                </div>

                <div className="flex gap-2">
                  <PixelButton size="sm" variant="accent">
                    🍖 喂食
                  </PixelButton>
                  <PixelButton size="sm" variant="secondary">
                    🤗 摸摸
                  </PixelButton>
                  <Link href="/pet">
                    <PixelButton size="sm">
                      查看宠物
                    </PixelButton>
                  </Link>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* Daily Goals */}
        <PixelCard className="mb-8">
          <h2 className="text-xs mb-4">今日目标</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dailyGoals.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center gap-3 p-3 border-2 border-black ${
                  goal.completed ? 'bg-[#4ADE80]' : 'bg-white'
                }`}
              >
                <div className={`w-6 h-6 border-2 border-black flex items-center justify-center ${
                  goal.completed ? 'bg-white' : 'bg-transparent'
                }`}>
                  {goal.completed && <span>✓</span>}
                </div>
                <span className="text-[10px] flex-1">{goal.name}</span>
                <PixelBadge variant="exp" size="sm">+{goal.exp} EXP</PixelBadge>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-[10px] text-[#666666]">
              已完成 {dailyGoals.filter(g => g.completed).length}/{dailyGoals.length}
            </span>
          </div>
        </PixelCard>

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
              <PixelProgress value={45} label="进度" showLabel />
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
              <PixelProgress value={30} label="进度" variant="exp" showLabel />
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
              <PixelProgress value={15} label="进度" variant="default" showLabel />
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
                最高分: 85
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
                {mockPet.name} - Lv.{mockPet.level}
              </div>
            </PixelCard>
          </Link>
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
