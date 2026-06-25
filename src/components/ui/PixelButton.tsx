'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'pixel-button transition-all duration-100 font-pixel';

    const variants = {
      primary: 'bg-[#FF1C1C] hover:bg-[#E01818] text-white',
      secondary: 'bg-[#3B82F6] hover:bg-[#2563EB] text-white',
      accent: 'bg-[#FFD700] hover:bg-[#E6C200] text-[#2D2D2D]',
      ghost: 'bg-transparent border-2 border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white shadow-none',
    };

    const sizes = {
      sm: 'text-[10px] px-3 py-2',
      md: 'text-xs px-5 py-3',
      lg: 'text-sm px-8 py-4',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
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
