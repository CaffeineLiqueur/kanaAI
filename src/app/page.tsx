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
              <PixelButton variant="ghost" size="sm">ログイン</PixelButton>
            </Link>
            <Link href="/register">
              <PixelButton size="sm">新規登録</PixelButton>
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
                ようこそ！kanaAIへ！
              </p>
              <p className="mb-4">
                これは日本語を学ぶためのアプリです。
                AIとペットと一緒に、楽しく日本語を学びましょう！
              </p>
              <p className="text-[#666666] text-[10px]">
                （欢迎来到kanaAI！这是一个学习日语的应用。让我们和AI还有宠物一起快乐地学习日语吧！）
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="mt-4 font-pixel text-[10px] text-[#3B82F6] hover:underline"
              >
                閉じる ×
              </button>
            </PixelDialog>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl text-[#2D2D2D] mb-6 leading-relaxed">
            日本語を
            <span className="text-[#FF1C1C]">楽しく</span>
            学ぼう！
          </h2>
          <p className="text-xs text-[#666666] mb-8 max-w-md mx-auto leading-relaxed">
            AIがあなたの質問に答えてくれます。
            像素風のペットと一緒に、毎日楽しく学習しましょう！
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <PixelButton size="lg">今すぐ始める</PixelButton>
            </Link>
            <Link href="/login">
              <PixelButton variant="secondary" size="lg">ログイン</PixelButton>
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
                <h3 className="text-xs mb-2">仮名学習</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  平仮名と片仮名を楽しく学ぼう！
                  図鑑のように_collecting_しよう！
                </p>
                <p className="text-[10px] text-[#999999] mt-2">
                  （学习平假名和片假名！像图鉴一样收集吧！）
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
                <h3 className="text-xs mb-2">単語帳</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  基本的な単語を効率よく覚えよう！
                  エビングハウスの忘却曲線で復習！
                </p>
                <p className="text-[10px] text-[#999999] mt-2">
                  （高效记忆基础单词！艾宾浩斯遗忘曲线复习！）
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
                <h3 className="text-xs mb-2">文法入門</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  AIが基本文法をわかりやすく説明！
                  中国語との違いも比較！
                </p>
                <p className="text-[10px] text-[#999999] mt-2">
                  （AI用易懂的方式解释基础语法！对比中文差异！）
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
                <h3 className="text-xs mb-2">AI会話練習</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  AIと日本語で会話しよう！
                  シチュエーション別に練習！
                </p>
                <p className="text-[10px] text-[#999999] mt-2">
                  （和AI用日语对话吧！分场景练习！）
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
                <h3 className="text-xs mb-2">スマートテスト</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  AIが学習進度に合わせて問題生成！
                  苦手分野を自動で特定！
                </p>
                <p className="text-[10px] text-[#999999] mt-2">
                  （AI根据学习进度生成题目！自动识别薄弱环节！）
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
                <h3 className="text-xs mb-2">ペットシステム</h3>
                <p className="text-[10px] text-[#666666] leading-relaxed">
                  像素風ペットと一緒に学習！
                  レベルアップで進化！
                </p>
                <p className="text-[10px] text-[#999999] mt-2">
                  （和像素风宠物一起学习！升级进化！）
                </p>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* Pet Preview Section */}
        <div className="text-center mb-16">
          <h3 className="text-sm text-[#2D2D2D] mb-6">ペットに会おう！</h3>
          <div className="flex justify-center gap-8">
            {/* Dog */}
            <PixelCard padding="sm" className="w-32">
              <div className="w-20 h-20 mx-auto bg-[#FFD700] border-2 border-black mb-3 flex items-center justify-center">
                <span className="text-3xl">🐕</span>
              </div>
              <p className="text-[10px]">柴犬</p>
              <p className="text-[10px] text-[#666666]">しばいぬ</p>
            </PixelCard>

            {/* Cat */}
            <PixelCard padding="sm" className="w-32">
              <div className="w-20 h-20 mx-auto bg-[#FFD700] border-2 border-black mb-3 flex items-center justify-center">
                <span className="text-3xl">🐱</span>
              </div>
              <p className="text-[10px]">猫</p>
              <p className="text-[10px] text-[#666666]">ねこ</p>
            </PixelCard>

            {/* Rabbit */}
            <PixelCard padding="sm" className="w-32">
              <div className="w-20 h-20 mx-auto bg-[#FFD700] border-2 border-black mb-3 flex items-center justify-center">
                <span className="text-3xl">🐰</span>
              </div>
              <p className="text-[10px]">兎</p>
              <p className="text-[10px] text-[#666666]">うさぎ</p>
            </PixelCard>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <PixelCard variant="elevated" className="inline-block px-12 py-8">
            <h3 className="text-sm text-[#2D2D2D] mb-4">
              さあ、始めよう！
            </h3>
            <p className="text-[10px] text-[#666666] mb-6">
              （来吧，开始吧！）
            </p>
            <Link href="/register">
              <PixelButton size="lg" variant="accent">
                無料で始める
              </PixelButton>
            </Link>
          </PixelCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-[10px] text-[#666666]">
            © 2024 kanaAI - 日本語を楽しく学ぼう！
          </p>
        </div>
      </footer>
    </div>
  );
}
