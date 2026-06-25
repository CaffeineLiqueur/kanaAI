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
        'relative bg-white border-4 border-black p-5',
        'shadow-[inset_-4px_-4px_0_0_#CCCCCC,inset_4px_4px_0_0_#FFFFFF,8px_8px_0_0_rgba(0,0,0,0.3)]',
        className
      )}
    >
      <div className="font-pixel text-xs text-[#2D2D2D] leading-relaxed">
        {children}
      </div>
      {showArrow && (
        <div className="absolute bottom-2 right-3 font-pixel text-xs text-[#666666] animate-bounce">
          ▼
        </div>
      )}
    </div>
  );
}
