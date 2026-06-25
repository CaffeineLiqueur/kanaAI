'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelInput, PixelDialog } from '@/components/ui';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    setIsLoading(true);
    // TODO: 实现注册逻辑
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E1] pixel-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FF1C1C] border-4 border-black mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">あ</span>
          </div>
          <h1 className="text-lg text-[#2D2D2D]">kanaAI</h1>
          <p className="text-[10px] text-[#666666] mt-2">新しいアカウントを作成しよう！</p>
        </div>

        {/* Register Form */}
        <PixelCard variant="elevated">
          <PixelDialog className="mb-6">
            <p>はじめまして！</p>
            <p className="text-[#666666] text-[10px] mt-1">（初次见面！）</p>
          </PixelDialog>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PixelInput
              label="名前"
              type="text"
              placeholder="あなたの名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <PixelInput
              label="メールアドレス"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PixelInput
              label="パスワード"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

            <PixelInput
              label="パスワード（確認）"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={confirmPassword && password !== confirmPassword ? 'パスワードが一致しません' : undefined}
            />

            <div className="flex items-start gap-2 text-[10px]">
              <input type="checkbox" className="w-4 h-4 border-2 border-black mt-1" required />
              <span>
                <a href="#" className="text-[#3B82F6] hover:underline">利用規約</a>
                と
                <a href="#" className="text-[#3B82F6] hover:underline">プライバシーポリシー</a>
                に同意します
              </span>
            </div>

            <PixelButton
              type="submit"
              className="w-full"
              disabled={isLoading || (!!confirmPassword && password !== confirmPassword)}
            >
              {isLoading ? '読み込み中...' : '新規登録'}
            </PixelButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-[#666666]">
              すでにアカウントをお持ちですか？{' '}
              <Link href="/login" className="text-[#3B82F6] hover:underline">
                ログイン
              </Link>
            </p>
          </div>
        </PixelCard>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[10px] text-[#666666] hover:text-[#2D2D2D]">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
