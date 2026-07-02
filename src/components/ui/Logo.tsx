'use client';

import Link from 'next/link';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'mark' | 'wordmark' | 'combined';
  className?: string;
}

const sizes = {
  sm: { mark: 'w-7 h-7', wordmark: 'w-20', combined: 'gap-2' },
  md: { mark: 'w-9 h-9', wordmark: 'w-28', combined: 'gap-2' },
  lg: { mark: 'w-14 h-14', wordmark: 'w-40', combined: 'gap-3' },
  xl: { mark: 'w-16 h-16 md:w-20 md:h-20', wordmark: 'w-56', combined: 'gap-3' },
  '2xl': { mark: 'w-48 h-48 md:w-64 md:h-64', wordmark: 'w-72', combined: 'gap-4' },
};

export default function Logo({
  href = '/',
  size = 'md',
  variant = 'combined',
  className = '',
}: LogoProps) {
  const sizeClass = sizes[size];

  // combined: 小猫 + kanaAI 文字 logo (header 用)
  if (variant === 'combined') {
    const content = (
      <span className={`flex items-center ${sizeClass.combined} ${className}`}>
        <img
          src="/brand/mark.png"
          alt=""
          className={sizeClass.mark}
        />
        <img
          src="/brand/wordmark.png"
          alt="kanaAI"
          className={sizeClass.wordmark}
        />
      </span>
    );
    return href ? <Link href={href}>{content}</Link> : content;
  }

  // mark: 只显示小猫 (hero 大图用)
  if (variant === 'mark') {
    const content = (
      <img
        src="/brand/mark.png"
        alt="kanaAI"
        className={`${sizeClass.mark} ${className}`}
      />
    );
    return href ? <Link href={href}>{content}</Link> : content;
  }

  // wordmark: 只显示 kanaAI 文字 logo
  const content = (
    <img
      src="/brand/wordmark.png"
      alt="kanaAI"
      className={`${sizeClass.wordmark} ${className}`}
    />
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
