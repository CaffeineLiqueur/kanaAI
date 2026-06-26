'use client';

import { useState, useEffect } from 'react';
import { useTTSSettings } from '@/lib/tts/TTSContext';

interface Speaker {
  name: string;
  uuid: string;
  styles: { id: number; name: string }[];
}

// Default speakers when engine is unavailable
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

  useEffect(() => {
    fetch('/api/tts/speakers')
      .then((res) => res.ok ? res.json() : DEFAULT_SPEAKERS)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSpeakers(data);
        }
      })
      .catch(() => {
        // Use defaults
      })
      .finally(() => setLoading(false));
  }, []);

  // Flatten all styles for the selector
  const allStyles = speakers.flatMap((s) =>
    s.styles.map((style) => ({
      id: style.id,
      label: `${s.name} - ${style.name}`,
    }))
  );

  const currentLabel = allStyles.find((s) => s.id === speaker)?.label || `Speaker ${speaker}`;

  return (
    <div className={className}>
      {/* Toggle button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white hover:bg-[#FFD700] transition-all font-pixel text-[10px]"
      >
        <span>{enabled ? '🔊' : '🔇'}</span>
        <span>语音设置</span>
      </button>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="absolute right-0 top-full mt-2 p-4 border-3 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] z-50 min-w-[250px]">
          <h4 className="text-xs mb-3 font-pixel">🔊 语音设置</h4>

          {/* Enable/Disable */}
          <div className="flex items-center justify-between mb-3 p-2 bg-[#F5F0E1] border-2 border-black">
            <span className="text-[10px] font-pixel">启用语音</span>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-3 py-1 border-2 border-black text-[10px] font-pixel transition-colors ${
                enabled ? 'bg-[#4ADE80]' : 'bg-white'
              }`}
            >
              {enabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Auto-play */}
          <div className="flex items-center justify-between mb-3 p-2 bg-[#F5F0E1] border-2 border-black">
            <span className="text-[10px] font-pixel">AI自动播放</span>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1 border-2 border-black text-[10px] font-pixel transition-colors ${
                autoPlay ? 'bg-[#4ADE80]' : 'bg-white'
              }`}
            >
              {autoPlay ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Speaker selection */}
          <div className="mb-2">
            <span className="text-[10px] font-pixel block mb-2">语音角色</span>
            <select
              value={speaker}
              onChange={(e) => setSpeaker(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-black font-pixel text-[10px] bg-white"
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

          <div className="text-[8px] text-[#999] font-pixel mt-2">
            当前: {currentLabel}
          </div>
        </div>
      )}
    </div>
  );
}
