'use client';

import { cn } from '@/lib/utils';

interface PixelBadgeProps {
  variant?: 'default' | 'exp' | 'level' | 'success' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export default function PixelBadge({
  variant = 'default',
  size = 'sm',
  children,
  className,
}: PixelBadgeProps) {
  const baseStyles = 'font-pixel inline-flex items-center border-3 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]';

  const variants = {
    default: 'bg-[#F5F0E1] text-[#2D2D2D]',
    exp: 'bg-[#FFD700] text-[#2D2D2D]',
    level: 'bg-[#3B82F6] text-white',
    success: 'bg-[#4ADE80] text-[#2D2D2D]',
    error: 'bg-[#EF4444] text-white',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-1',
    md: 'text-xs px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
