'use client';

import { cn } from '@/lib/utils';

interface PixelDialogProps {
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
}

export default function PixelDialog({
  children,
  showArrow = true,
  className,
}: PixelDialogProps) {
  return (
    <div
      className={cn(
        'relative bg-[var(--paper)] border-[1.5px] border-[var(--ink)] p-5',
        className
      )}
    >
      <div className="font-body text-[0.95rem] text-[var(--ink)] leading-relaxed">
        {children}
      </div>
      {showArrow && (
        <div
          className="absolute bottom-2.5 right-3 text-[0.8rem] drift"
          style={{ color: 'var(--vermillion)' }}
        >
          ▼
        </div>
      )}
    </div>
  );
}
