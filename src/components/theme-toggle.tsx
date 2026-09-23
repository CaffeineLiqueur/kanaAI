'use client'

import { Moon, Sun } from '@phosphor-icons/react'
import { useEffect, useSyncExternalStore } from 'react'

const eventName = 'kanaai-theme-change'

function subscribe(callback: () => void) {
  const preference = window.matchMedia('(prefers-color-scheme: dark)')
  window.addEventListener(eventName, callback)
  preference.addEventListener('change', callback)
  return () => { window.removeEventListener(eventName, callback); preference.removeEventListener('change', callback) }
}

function isDark() {
  const theme = document.documentElement.dataset.theme
  return theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

export function ThemeToggle({ initialTheme }: { initialTheme: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)
  useEffect(() => {
    if (initialTheme === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = initialTheme
    window.dispatchEvent(new Event(eventName))
  }, [initialTheme])
  async function toggle() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    window.dispatchEvent(new Event(eventName))
    try { await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme: next }) }) } catch { /* 下次页面加载时以服务端保存值为准。 */ }
  }
  return <button className="icon-button" onClick={toggle} aria-label={dark ? '切换到浅色主题' : '切换到深色主题'}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
}
