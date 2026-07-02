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
      <div className="flex flex-col gap-2 w-full">
        {label && <label className="input-label">{label}</label>}
        <input
          ref={ref}
          className={cn('input-field', error && 'border-[var(--vermillion)]', className)}
          {...props}
        />
        {error && (
          <p className="text-[0.7rem] text-[var(--vermillion)] font-body">{error}</p>
        )}
      </div>
    );
  }
);

PixelInput.displayName = 'PixelInput';

export default PixelInput;
