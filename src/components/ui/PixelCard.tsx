'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PixelCard = forwardRef<HTMLDivElement, PixelCardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'bg-[#F5F0E1] border-4 border-black';

    const variants = {
      default: 'shadow-[8px_8px_0_0_rgba(0,0,0,0.2)]',
      elevated: 'shadow-[12px_12px_0_0_rgba(0,0,0,0.25)]',
      outlined: 'shadow-none',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PixelCard.displayName = 'PixelCard';

export default PixelCard;
