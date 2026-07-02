'use client';

import { cn } from '@/lib/utils';

interface PixelProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'exp' | 'hp' | 'vermillion' | 'cobalt' | 'mustard';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function PixelProgress({
  value,
  max = 100,
  variant = 'default',
  showLabel = false,
  label,
  className,
}: PixelProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const fillVariants = {
    default: 'bg-[var(--ink)]',
    exp: 'bg-[var(--sage)]',
    hp: 'bg-[var(--vermillion)]',
    vermillion: 'bg-[var(--vermillion)]',
    cobalt: 'bg-[var(--cobalt)]',
    mustard: 'bg-[var(--mustard)]',
  };

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-baseline">
          <span className="label-text">{label}</span>
          <span className="text-[0.7rem] font-mono tabular-nums text-[var(--ink-soft)]">
            {value}<span className="opacity-40">/</span>{max}
          </span>
        </div>
      )}
      <div className="progress-track">
        <div
          className={cn('progress-fill', fillVariants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
