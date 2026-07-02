'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] hover:bg-[var(--vermillion)] hover:border-[var(--vermillion)]',
      secondary: 'bg-transparent text-[var(--ink)] border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]',
      accent: 'bg-[var(--vermillion)] text-[var(--paper)] border-[var(--vermillion)] hover:bg-[var(--vermillion-dark)] hover:border-[var(--vermillion-dark)]',
      ghost: 'bg-transparent text-[var(--ink)] border-transparent hover:text-[var(--vermillion)]',
    };

    const sizes = {
      sm: 'text-[0.7rem] px-3 py-1.5',
      md: 'text-[0.85rem] px-5 py-2.5',
      lg: 'text-[1rem] px-7 py-3.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-display font-medium tracking-wider',
          'border-[1.5px] transition-all duration-200 ease-out',
          'active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PixelButton.displayName = 'PixelButton';

export default PixelButton;
