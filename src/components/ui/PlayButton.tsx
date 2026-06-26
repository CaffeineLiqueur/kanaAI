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
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !settings.enabled}
      title={label || '音声を再生（播放语音）'}
      className={cn(
        'border-2 border-black flex items-center justify-center transition-all duration-100',
        'hover:bg-[#FFD700] active:translate-y-[1px]',
        isPlaying ? 'bg-[#3B82F6] text-white animate-pulse' : 'bg-white',
        isLoading ? 'opacity-50 cursor-wait' : '',
        !settings.enabled ? 'opacity-30 cursor-not-allowed' : '',
        error ? 'bg-[#EF4444] text-white' : '',
        sizes[size],
        className
      )}
    >
      {isLoading ? '⏳' : isPlaying ? '🔊' : '🔈'}
    </button>
  );
}
