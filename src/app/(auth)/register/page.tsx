'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelInput, PixelDialog } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    setIsLoading(true);
    // TODO: 实现注册逻辑
    setTimeout(() => setIsLoading(false), 1000);
  };

  // 开发模式：跳过注册
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
          <p className="text-[10px] text-[#666666] mt-2">创建账号，开始学习</p>
        </div>

        {/* Register Form */}
        <PixelCard variant="elevated">
          <PixelDialog className="mb-6">
            <p>你好！欢迎加入！</p>
            <p className="text-[#666666] text-[10px] mt-1">一起开始日语学习之旅吧</p>
          </PixelDialog>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PixelInput
              label="昵称"
              type="text"
              placeholder="给自己起个名字吧"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              placeholder="至少8位字符"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

            <PixelInput
              label="确认密码"
              type="password"
              placeholder="再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!!confirmPassword && password !== confirmPassword ? '两次输入的密码不一致' : undefined}
            />

            <div className="flex items-start gap-2 text-[10px]">
              <input type="checkbox" className="w-4 h-4 border-2 border-black mt-1" required />
              <span>
                我已阅读并同意{' '}
                <a href="#" className="text-[#3B82F6] hover:underline">用户协议</a>
                {' '}和{' '}
                <a href="#" className="text-[#3B82F6] hover:underline">隐私政策</a>
              </span>
            </div>

            <PixelButton
              type="submit"
              className="w-full"
              disabled={isLoading || (!!confirmPassword && password !== confirmPassword)}
            >
              {isLoading ? '注册中...' : '免费注册'}
            </PixelButton>
          </form>

          {/* 开发模式跳过注册 */}
          <div className="mt-4 pt-4 border-t-2 border-dashed border-[#CCCCCC]">
            <PixelButton
              variant="ghost"
              className="w-full"
              onClick={handleDevBypass}
            >
              🚀 开发模式 - 跳过注册
            </PixelButton>
            <p className="text-[10px] text-[#999999] text-center mt-2">
              仅用于开发测试
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-[#666666]">
              已有账号？{' '}
              <Link href="/login" className="text-[#3B82F6] hover:underline">
                立即登录
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
