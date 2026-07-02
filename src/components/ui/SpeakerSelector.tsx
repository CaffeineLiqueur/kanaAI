'use client';

import { useState, useEffect, useRef } from 'react';
import { useTTSSettings } from '@/lib/tts/TTSContext';

interface Speaker {
  name: string;
  uuid: string;
  styles: { id: number; name: string }[];
}

const DEFAULT_SPEAKERS: Speaker[] = [
  { name: 'ずんだもん', uuid: 'default', styles: [{ id: 3, name: 'ノーマル' }] },
  { name: '四国めたん', uuid: 'default', styles: [{ id: 2, name: 'ノーマル' }] },
  { name: '春日部つむぎ', uuid: 'default', styles: [{ id: 8, name: 'ノーマル' }] },
];

export default function SpeakerSelector({ className }: { className?: string }) {
  const { speaker, setSpeaker, enabled, setEnabled, autoPlay, setAutoPlay } = useTTSSettings();
  const [speakers, setSpeakers] = useState<Speaker[]>(DEFAULT_SPEAKERS);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/tts/speakers')
      .then((res) => res.ok ? res.json() : DEFAULT_SPEAKERS)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSpeakers(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const allStyles = speakers.flatMap((s) =>
    s.styles.map((style) => ({
      id: style.id,
      label: `${s.name} - ${style.name}`,
    }))
  );

  const currentLabel = allStyles.find((s) => s.id === speaker)?.label || `Speaker ${speaker}`;

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="inline-flex items-center gap-2 px-3 py-1.5 border-[1.5px] border-[var(--ink)] bg-transparent hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors text-[0.7rem] font-mono tracking-wider"
      >
        <span>{enabled ? '🔊' : '🔇'}</span>
        <span className="uppercase">Voice</span>
      </button>

      {showSettings && (
        <div className="absolute right-0 top-full mt-2 p-5 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] z-50 min-w-[280px] fade-up">
          <h4 className="text-[0.85rem] font-display font-medium mb-4 tracking-wide">语音设置</h4>

          <div className="flex items-center justify-between mb-3 py-2 border-b border-[var(--ink)] border-opacity-15">
            <span className="label-text">启用语音</span>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-3 py-1 text-[0.7rem] font-mono tracking-wider border-[1.5px] border-[var(--ink)] transition-colors ${
                enabled ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-transparent text-[var(--ink)]'
              }`}
            >
              {enabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between mb-3 py-2 border-b border-[var(--ink)] border-opacity-15">
            <span className="label-text">AI 自动播放</span>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1 text-[0.7rem] font-mono tracking-wider border-[1.5px] border-[var(--ink)] transition-colors ${
                autoPlay ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-transparent text-[var(--ink)]'
              }`}
            >
              {autoPlay ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="mb-2 pt-2">
            <span className="label-text block mb-2">语音角色</span>
            <select
              value={speaker}
              onChange={(e) => setSpeaker(Number(e.target.value))}
              className="w-full px-3 py-2 border-[1.5px] border-[var(--ink)] font-body text-[0.85rem] bg-[var(--paper)] focus:outline-none focus:border-[var(--vermillion)]"
              disabled={loading}
            >
              {loading ? (
                <option>加载中...</option>
              ) : (
                allStyles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="text-[0.65rem] text-[var(--ink-soft)] opacity-50 font-mono mt-3">
            {currentLabel}
          </div>
        </div>
      )}
    </div>
  );
}
