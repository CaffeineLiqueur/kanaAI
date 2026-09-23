'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { dailyGoalMinutes: number; theme: string; fontScale: string; kanaHints: boolean; ttsEnabled: boolean; companionName: string }

export function SettingsForm(initial: Props) {
  const router = useRouter()
  const [settings, setSettings] = useState(initial)
  const [status, setStatus] = useState('')
  async function save() {
    setStatus('保存中')
    try {
      const response = await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      if (!response.ok) throw new Error('保存失败')
      setStatus('已保存')
      const theme = settings.theme === 'system' ? '' : settings.theme
      if (theme) document.documentElement.dataset.theme = theme
      else delete document.documentElement.dataset.theme
      window.dispatchEvent(new Event('kanaai-theme-change'))
      document.documentElement.dataset.fontScale = settings.fontScale
      router.refresh()
    } catch { setStatus('保存失败，请稍后重试') }
  }
  return <div className="grid gap-6 lg:grid-cols-2">
    <section className="card p-6"><h2 className="section-title">学习计划</h2><label className="mt-6 block text-sm font-semibold" htmlFor="daily-goal">每日目标</label><select id="daily-goal" className="mt-2 h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3" value={settings.dailyGoalMinutes} onChange={(event) => setSettings({ ...settings, dailyGoalMinutes: Number(event.target.value) })}><option value={10}>10 分钟</option><option value={15}>15 分钟</option><option value={20}>20 分钟</option><option value={30}>30 分钟</option></select><label className="mt-5 block text-sm font-semibold" htmlFor="companion-name">伙伴名字</label><input id="companion-name" maxLength={12} className="mt-2 h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3" value={settings.companionName} onChange={(event) => setSettings({ ...settings, companionName: event.target.value })} /></section>
    <section className="card p-6"><h2 className="section-title">显示与声音</h2><label className="mt-6 block text-sm font-semibold" htmlFor="theme">主题</label><select id="theme" className="mt-2 h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3" value={settings.theme} onChange={(event) => setSettings({ ...settings, theme: event.target.value })}><option value="system">跟随系统</option><option value="light">浅色</option><option value="dark">深色</option></select><label className="mt-5 block text-sm font-semibold" htmlFor="font-scale">字体大小</label><select id="font-scale" className="mt-2 h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3" value={settings.fontScale} onChange={(event) => setSettings({ ...settings, fontScale: event.target.value })}><option value="standard">标准</option><option value="large">大字体</option></select><label className="mt-6 flex items-center justify-between gap-4"><span><strong className="block text-sm">显示假名辅助</strong><span className="mt-1 block text-xs text-[var(--muted)]">课程示例显示假名读音</span></span><input type="checkbox" className="h-5 w-5 accent-[var(--accent)]" checked={settings.kanaHints} onChange={(event) => setSettings({ ...settings, kanaHints: event.target.checked })} /></label><label className="mt-5 flex items-center justify-between gap-4"><span><strong className="block text-sm">听力播放</strong><span className="mt-1 block text-xs text-[var(--muted)]">允许课程请求 TTS 音频</span></span><input type="checkbox" className="h-5 w-5 accent-[var(--accent)]" checked={settings.ttsEnabled} onChange={(event) => setSettings({ ...settings, ttsEnabled: event.target.checked })} /></label></section>
    <div className="lg:col-span-2 flex items-center justify-end gap-4"><span className="text-sm text-[var(--muted)]" aria-live="polite">{status}</span><button className="btn btn-primary" onClick={save}>保存设置</button></div>
  </div>
}
