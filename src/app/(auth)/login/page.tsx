'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PixelButton, PixelInput, PixelBadge } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'ログインに失敗しました');
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'dev@kanaai.local', password: 'dev12345678' }),
      });

      if (response.ok) {
        router.push('/dashboard');
        return;
      }

      const regResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '開発者',
          email: 'dev@kanaai.local',
          password: 'dev12345678',
        }),
      });

      if (regResponse.ok) router.push('/dashboard');
    } catch {
      setError('開発者ログインに失敗');
    }
  };

  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-12 fade-up">
          <Link href="/" className="inline-block">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-display text-4xl font-medium tracking-tight">kana</span>
              <span className="font-display text-4xl font-medium tracking-tight" style={{ color: 'var(--vermillion)' }}>AI</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[var(--ink)] opacity-30"></span>
            <span className="label-text">ログイン</span>
          </div>
        </div>

        {/* Form */}
        <div className="fade-up" style={{ animationDelay: '120ms' }}>
          <h1 className="heading-lg mb-2">おかえりなさい</h1>
          <p className="body-text opacity-70 mb-8">今日も日本語を学ぼう。</p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-[0.75rem] font-mono opacity-60 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 border-[1.5px] border-[var(--ink)] accent-[var(--vermillion)]" />
                <span className="uppercase tracking-wider">ログイン状態を保持</span>
              </label>
              <a href="#" className="text-[0.75rem] font-mono opacity-50 hover:opacity-100 transition-opacity">
                パスワードを忘れた?
              </a>
            </div>

            {error && (
              <div className="p-3 border-l-[3px] border-[var(--vermillion)] bg-[var(--vermillion)] bg-opacity-5 text-[0.8rem] font-body">
                {error}
              </div>
            )}

            <PixelButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? 'ログイン中…' : 'ログイン →'}
            </PixelButton>
          </form>

          {/* Dev bypass */}
          <div className="mt-8 pt-6 border-t-[1px] border-[var(--ink)] border-opacity-15">
            <button
              onClick={handleDevBypass}
              className="w-full text-left p-4 border-[1.5px] border-dashed border-[var(--ink)] border-opacity-30 hover:border-opacity-80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="label-text mb-1" style={{ color: 'var(--cobalt)' }}>開発モード</div>
                  <div className="font-display text-sm">開発者ログインをスキップ</div>
                </div>
                <span className="text-[1.2rem]">→</span>
              </div>
            </button>
          </div>

          {/* Register link */}
          <div className="mt-8 text-center">
            <p className="caption-text">
              アカウントをお持ちでない方は{' '}
              <Link href="/register" className="font-mono underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--vermillion)' }}>
                新規登録
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-between caption-text">
          <span>© 2026 kanaAI</span>
          <Link href="/" className="hover:opacity-100 opacity-60">← ホーム</Link>
        </div>
      </div>
    </div>
  );
}
