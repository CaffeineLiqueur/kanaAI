'use client';

import { ReactNode } from 'react';
import { TTSProvider } from '@/lib/tts/TTSContext';

export default function Providers({ children }: { children: ReactNode }) {
  return <TTSProvider>{children}</TTSProvider>;
}
