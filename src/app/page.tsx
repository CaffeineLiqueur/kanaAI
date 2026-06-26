'use client';

import { useState } from 'react';
import { PixelButton, PixelCard, PixelDialog } from '@/components/ui';
import Link from 'next/link';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

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
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <PixelButton variant="ghost" size="sm">登录</PixelButton>
            </Link>
            <Link href="/register">
              <PixelButton size="sm">注册</PixelButton>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Dialog */}
        {showWelcome && (
          <div className="mb-12">
            <PixelDialog>
              <p className="mb-4">
                欢迎来到 kanaAI！
              </p>
              <p className="mb-4">
                这是一个专为零基础学习者打造的日语学习应用。
                AI 老师会陪伴你，还有可爱的像素宠物和你一起成长！
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="mt-4 font-pixel text-[10px] text-[#3B82F6] hover:underline"
              >
                关闭 ×
              </button>
            </PixelDialog>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl text-[#2D2D2D] mb-6 leading-relaxed">
            零基础也能
            <span className="text-[#FF1C1C]">轻松</span>
            学日语！
          </h2>
          <p className="text-xs text-[#666666] mb-8 max-w-md mx-auto leading-relaxed">
            AI 老师随时解答你的问题，像素宠物陪你一起学习，
            让日语学习变得像玩游戏一样有趣！
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <PixelButton size="lg">免费开始学习</PixelButton>
            </Link>
            <Link href="/login">
              <PixelButton variant="secondary" size="lg">我已有账号</PixelButton>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Feature 1: Kana Learning */}
          <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFD700] border-3 border-black flex items-center justify-center shrink-0">
                <span className="text-lg">あ</span>
              </div>
              <div>
                <h3 className="text-xs mb-2">假名学习</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  平假名、片假名轻松掌握，像收集图鉴一样有趣！
                </p>
              </div>
            </div>
          </PixelCard>

          {/* Feature 2: Vocabulary */}
          <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#4ADE80] border-3 border-black flex items-center justify-center shrink-0">
                <span className="text-lg">📖</span>
              </div>
              <div>
                <h3 className="text-xs mb-2">单词记忆</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  基础词汇高效记忆，智能复习对抗遗忘曲线！
                </p>
              </div>
            </div>
          </PixelCard>

          {/* Feature 3: Grammar */}
          <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#3B82F6] border-3 border-black flex items-center justify-center shrink-0">
                <span className="text-lg">📝</span>
              </div>
              <div>
                <h3 className="text-xs mb-2">语法入门</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  AI 用通俗易懂的方式讲解语法，对比中文差异！
                </p>
              </div>
            </div>
          </PixelCard>

          {/* Feature 4: AI Chat */}
          <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#A78BFA] border-3 border-black flex items-center justify-center shrink-0">
                <span className="text-lg">💬</span>
              </div>
              <div>
                <h3 className="text-xs mb-2">AI 对话练习</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  多种场景模拟对话，实时纠错，轻松开口说日语！
                </p>
              </div>
            </div>
          </PixelCard>

          {/* Feature 5: Quiz */}
          <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F59E0B] border-3 border-black flex items-center justify-center shrink-0">
                <span className="text-lg">✨</span>
              </div>
              <div>
                <h3 className="text-xs mb-2">智能测验</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  AI 根据你的进度出题，自动识别薄弱环节！
                </p>
              </div>
            </div>
          </PixelCard>

          {/* Feature 6: Pet System */}
          <PixelCard className="hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#EC4899] border-3 border-black flex items-center justify-center shrink-0">
                <span className="text-lg">🐾</span>
              </div>
              <div>
                <h3 className="text-xs mb-2">像素宠物</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  领养可爱宠物，学习获得经验，陪伴你一起成长！
                </p>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* Pet Preview Section */}
        <div className="text-center mb-16">
          <h3 className="text-sm text-[#2D2D2D] mb-6">选择你的学习伙伴</h3>
          <div className="flex justify-center gap-8">
            {/* Dog */}
            <PixelCard padding="sm" className="w-32">
              <div className="w-20 h-20 mx-auto bg-[#FFD700] border-2 border-black mb-3 flex items-center justify-center">
                <span className="text-3xl">🐕</span>
              </div>
              <p className="text-[10px]">柴犬</p>
              <p className="text-[10px] text-[#666666]">活泼可爱</p>
            </PixelCard>

            {/* Cat */}
            <PixelCard padding="sm" className="w-32">
              <div className="w-20 h-20 mx-auto bg-[#FFD700] border-2 border-black mb-3 flex items-center justify-center">
                <span className="text-3xl">🐱</span>
              </div>
              <p className="text-[10px]">猫咪</p>
              <p className="text-[10px] text-[#666666]">优雅傲娇</p>
            </PixelCard>

            {/* Rabbit */}
            <PixelCard padding="sm" className="w-32">
              <div className="w-20 h-20 mx-auto bg-[#FFD700] border-2 border-black mb-3 flex items-center justify-center">
                <span className="text-3xl">🐰</span>
              </div>
              <p className="text-[10px]">兔子</p>
              <p className="text-[10px] text-[#666666]">软萌治愈</p>
            </PixelCard>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <PixelCard variant="elevated" className="inline-block px-12 py-8">
            <h3 className="text-sm text-[#2D2D2D] mb-4">
              准备好了吗？
            </h3>
            <p className="text-[10px] text-[#666666] mb-6">
              免费注册，开始你的日语学习之旅！
            </p>
            <Link href="/register">
              <PixelButton size="lg" variant="accent">
                立即免费注册
              </PixelButton>
            </Link>
          </PixelCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-[10px] text-[#666666]">
            © 2026 kanaAI - 让日语学习变得有趣！
          </p>
        </div>
      </footer>
    </div>
  );
}
