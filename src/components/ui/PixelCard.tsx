'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'plain';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PixelCard = forwardRef<HTMLDivElement, PixelCardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--paper)] border-[1.5px] border-[var(--ink)]',
      elevated: 'bg-[var(--paper)] border-[1.5px] border-[var(--ink)] riso-card',
      outlined: 'bg-transparent border-[1.5px] border-[var(--ink)]',
      plain: 'bg-transparent',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
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
