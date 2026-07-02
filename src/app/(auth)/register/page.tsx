'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PixelButton, PixelInput, Logo } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '登録に失敗しました');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('ネットワークエラー');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevBypass = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '開発者',
          email: 'dev@kanaai.local',
          password: 'dev12345678',
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
        return;
      }

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'dev@kanaai.local', password: 'dev12345678' }),
      });

      if (loginResponse.ok) router.push('/dashboard');
    } catch {
      setError('開発者登録に失敗');
    }
  };

  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-12 fade-up">
          <Link href="/" className="inline-block">
            <Logo size="lg" variant="wordmark" href="" className="mb-3" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[var(--ink)] opacity-30"></span>
            <span className="label-text">新規登録</span>
          </div>
        </div>

        <div className="fade-up" style={{ animationDelay: '120ms' }}>
          <h1 className="heading-lg mb-2">はじめまして</h1>
          <p className="body-text opacity-70 mb-8">アカウントを作成して、日本語学習を始めよう。</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <PixelInput
              label="ニックネーム"
              type="text"
              placeholder="お名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <PixelInput
              label="メール"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PixelInput
              label="パスワード"
              type="password"
              placeholder="8 文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

            <PixelInput
              label="パスワード (確認)"
              type="password"
              placeholder="もう一度入力"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!!confirmPassword && password !== confirmPassword ? 'パスワードが一致しません' : undefined}
            />

            <label className="flex items-start gap-2 text-[0.75rem] font-body opacity-70 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 border-[1.5px] border-[var(--ink)] accent-[var(--vermillion)]" required />
              <span>
                <Link href="#" className="underline underline-offset-2">利用規約</Link>
                {' '}と{' '}
                <Link href="#" className="underline underline-offset-2">プライバシーポリシー</Link>
                {' '}に同意します
              </span>
            </label>

            {error && (
              <div className="p-3 border-l-[3px] border-[var(--vermillion)] bg-[var(--vermillion)] bg-opacity-5 text-[0.8rem] font-body">
                {error}
              </div>
            )}

            <PixelButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading || (!!confirmPassword && password !== confirmPassword)}
            >
              {isLoading ? '登録中…' : '登録する →'}
            </PixelButton>
          </form>

          <div className="mt-8 pt-6 border-t-[1px] border-[var(--ink)] border-opacity-15">
            <button
              onClick={handleDevBypass}
              className="w-full text-left p-4 border-[1.5px] border-dashed border-[var(--ink)] border-opacity-30 hover:border-opacity-80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="label-text mb-1" style={{ color: 'var(--cobalt)' }}>開発モード</div>
                  <div className="font-display text-sm">開発者として登録をスキップ</div>
                </div>
                <span className="text-[1.2rem]">→</span>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="caption-text">
              すでにアカウントをお持ちですか?{' '}
              <Link href="/login" className="font-mono underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--vermillion)' }}>
                ログイン
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between caption-text">
          <span>© 2026 kanaAI</span>
          <Link href="/" className="hover:opacity-100 opacity-60">← ホーム</Link>
        </div>
      </div>
    </div>
  );
}
