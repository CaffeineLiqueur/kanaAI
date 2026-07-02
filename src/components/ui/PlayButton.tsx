'use client';

import { cn } from '@/lib/utils';
import { useTTS } from '@/lib/tts/useTTS';
import { useTTSSettings } from '@/lib/tts/TTSContext';

interface PlayButtonProps {
  text: string;
  speaker?: number;
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
}

export default function PlayButton({
  text,
  speaker,
  size = 'sm',
  className,
  label,
}: PlayButtonProps) {
  const { play, isPlaying, isLoading, error } = useTTS();
  const settings = useTTSSettings();

  const handleClick = () => {
    if (isPlaying || isLoading) return;
    play(text, speaker ?? settings.speaker);
  };

  const sizes = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !settings.enabled}
      title={label || '音声を再生（播放语音）'}
      className={cn(
        'inline-flex items-center justify-center rounded-full border-[1.5px] transition-all duration-200',
        'hover:bg-[var(--vermillion)] hover:border-[var(--vermillion)] hover:text-[var(--paper)]',
        isPlaying ? 'bg-[var(--vermillion)] border-[var(--vermillion)] text-[var(--paper)]' : 'border-[var(--ink)] text-[var(--ink)]',
        isLoading ? 'opacity-50 cursor-wait' : '',
        !settings.enabled ? 'opacity-30 cursor-not-allowed' : '',
        error ? 'border-[var(--vermillion)] text-[var(--vermillion)]' : '',
        sizes[size],
        className
      )}
    >
      <span className="text-[0.9em]">
        {isLoading ? '⏳' : isPlaying ? '🔊' : '▶'}
      </span>
    </button>
  );
}
