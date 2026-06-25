'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="font-pixel text-xs text-[#2D2D2D]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'pixel-input font-pixel text-xs',
            error && 'border-[#EF4444] focus:shadow-[0_0_0_4px_#EF4444]',
            className
          )}
          {...props}
        />
        {error && (
          <span className="font-pixel text-[10px] text-[#EF4444]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

PixelInput.displayName = 'PixelInput';

export default PixelInput;
