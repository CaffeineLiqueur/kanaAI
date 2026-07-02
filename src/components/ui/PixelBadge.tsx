'use client';

import { cn } from '@/lib/utils';

interface PixelBadgeProps {
  variant?: 'default' | 'exp' | 'level' | 'success' | 'error' | 'vermillion' | 'cobalt' | 'mustard' | 'ink';
  size?: 'sm' | 'md';
  filled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function PixelBadge({
  variant = 'default',
  size = 'sm',
  filled = false,
  children,
  className,
}: PixelBadgeProps) {
  const colorMap = {
    default: 'var(--ink)',
    exp: 'var(--sage)',
    level: 'var(--cobalt)',
    success: 'var(--sage)',
    error: 'var(--vermillion)',
    vermillion: 'var(--vermillion)',
    cobalt: 'var(--cobalt)',
    mustard: 'var(--mustard-dark)',
    ink: 'var(--ink)',
  };

  const sizes = {
    sm: 'text-[0.6rem] px-2 py-0.5',
    md: 'text-[0.7rem] px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono font-medium tracking-wider uppercase',
        'border transition-colors',
        sizes[size],
        className
      )}
      style={{
        color: colorMap[variant],
        borderColor: colorMap[variant],
        backgroundColor: filled ? colorMap[variant] : 'transparent',
      }}
    >
      <span style={{ color: filled ? 'var(--paper)' : colorMap[variant] }}>
        {children}
      </span>
    </span>
  );
}
