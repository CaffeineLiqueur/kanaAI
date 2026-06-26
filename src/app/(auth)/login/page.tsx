'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelInput, PixelDialog } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: 实现登录逻辑
    setTimeout(() => setIsLoading(false), 1000);
  };

  // 开发模式：跳过登录
  const handleDevBypass = () => {
    const devUser = {
      id: 'dev-user-001',
      name: '开发者',
      email: 'dev@kanaai.local',
      isDev: true,
    };
    localStorage.setItem('kanaai_user', JSON.stringify(devUser));
    router.push('/dashboard');
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
          <p className="text-[10px] text-[#666666] mt-2">登录后继续学习</p>
        </div>

        {/* Login Form */}
        <PixelCard variant="elevated">
          <PixelDialog className="mb-6">
            <p>欢迎回来！</p>
            <p className="text-[#666666] text-[10px] mt-1">继续你的日语学习之旅吧</p>
          </PixelDialog>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PixelInput
              label="邮箱"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PixelInput
              label="密码"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-[10px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border-2 border-black" />
                <span>记住登录状态</span>
              </label>
              <a href="#" className="text-[#3B82F6] hover:underline">
                忘记密码？
              </a>
            </div>

            <PixelButton
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </PixelButton>
          </form>

          {/* 开发模式跳过登录 */}
          <div className="mt-4 pt-4 border-t-2 border-dashed border-[#CCCCCC]">
            <PixelButton
              variant="ghost"
              className="w-full"
              onClick={handleDevBypass}
            >
              🚀 开发模式 - 跳过登录
            </PixelButton>
            <p className="text-[10px] text-[#999999] text-center mt-2">
              仅用于开发测试
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-[#666666]">
              还没有账号？{' '}
              <Link href="/register" className="text-[#3B82F6] hover:underline">
                免费注册
              </Link>
            </p>
          </div>
        </PixelCard>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[10px] text-[#666666] hover:text-[#2D2D2D]">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
