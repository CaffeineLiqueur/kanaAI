'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TTSContextValue {
  autoPlay: boolean;
  setAutoPlay: (value: boolean) => void;
  speaker: number;
  setSpeaker: (value: number) => void;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

const TTSContext = createContext<TTSContextValue | null>(null);

const STORAGE_KEY = 'kanaai_tts';

function loadSettings() {
  if (typeof window === 'undefined') return { autoPlay: true, speaker: 3, enabled: true };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        autoPlay: parsed.autoPlay ?? true,
        speaker: parsed.speaker ?? 3,
        enabled: parsed.enabled ?? true,
      };
    }
  } catch {
    // ignore
  }
  return { autoPlay: true, speaker: 3, enabled: true };
}

export function TTSProvider({ children }: { children: ReactNode }) {
  const [autoPlay, setAutoPlayState] = useState(true);
  const [speaker, setSpeakerState] = useState(3);
  const [enabled, setEnabledState] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const settings = loadSettings();
    setAutoPlayState(settings.autoPlay);
    setSpeakerState(settings.speaker);
    setEnabledState(settings.enabled);
    setMounted(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ autoPlay, speaker, enabled })
    );
  }, [autoPlay, speaker, enabled, mounted]);

  const setAutoPlay = (value: boolean) => setAutoPlayState(value);
  const setSpeaker = (value: number) => setSpeakerState(value);
  const setEnabled = (value: boolean) => setEnabledState(value);

  return (
    <TTSContext.Provider
      value={{ autoPlay, setAutoPlay, speaker, setSpeaker, enabled, setEnabled }}
    >
      {children}
    </TTSContext.Provider>
  );
}

export function useTTSSettings() {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTSSettings must be used within a TTSProvider');
  }
  return context;
}
