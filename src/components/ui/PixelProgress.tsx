'use client';

import { cn } from '@/lib/utils';

interface PixelProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'exp' | 'hp';
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
    default: 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]',
    exp: 'bg-gradient-to-r from-[#4ADE80] to-[#22C55E]',
    hp: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]',
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="font-pixel text-[10px] text-[#2D2D2D]">
            {label}
          </span>
          <span className="font-pixel text-[10px] text-[#666666]">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="pixel-progress">
        <div
          className={cn('pixel-progress-fill', fillVariants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
