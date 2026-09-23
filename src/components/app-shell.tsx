'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { BookOpen, CalendarCheck, ChartDonut, Compass, Gear, PawPrint, Repeat, SignOut } from '@phosphor-icons/react'
import { ThemeToggle } from './theme-toggle'

const navigation = [
  { href: '/today', label: '今日', icon: CalendarCheck },
  { href: '/course', label: '课程', icon: BookOpen },
  { href: '/review', label: '复习', icon: Repeat },
  { href: '/practice', label: '专项', icon: Compass },
  { href: '/progress', label: '进度', icon: ChartDonut },
  { href: '/companion', label: '伙伴', icon: PawPrint },
  { href: '/settings', label: '设置', icon: Gear },
]

export function AppShell({ children, userName, theme, fontScale }: { children: React.ReactNode; userName: string; theme: string; fontScale: string }) {
  const pathname = usePathname()
  useEffect(() => { document.documentElement.dataset.fontScale = fontScale }, [fontScale])
  return <div className="min-h-screen lg:grid lg:grid-cols-[236px_1fr]">
    <aside className="desktop-only fixed inset-y-0 left-0 z-30 flex w-[236px] flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4">
      <Link className="px-2 py-4" href="/today"><Image src="/brand/wordmark.png" width={128} height={32} alt="kanaAI" priority /></Link>
      <nav className="mt-7 space-y-1" aria-label="主要导航">{navigation.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-semibold transition-colors ${active ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)]' : 'text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text)]'}`}><Icon size={21} weight={active ? 'fill' : 'regular'} />{label}</Link>
      })}</nav>
      <div className="mt-auto border-t border-[var(--border)] pt-4">
        <div className="mb-3 flex items-center justify-between px-2"><div><p className="text-sm font-semibold">{userName}</p><p className="text-xs text-[var(--muted)]">N5 学习中</p></div><ThemeToggle initialTheme={theme} /></div>
        <form action="/api/auth/logout" method="post"><button className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface-strong)]"><SignOut size={19} />退出登录</button></form>
      </div>
    </aside>
    <div className="lg:col-start-2">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] px-5 backdrop-blur lg:hidden"><Image src="/brand/wordmark.png" width={112} height={28} alt="kanaAI" /><ThemeToggle initialTheme={theme} /></header>
      <main className="mx-auto w-full max-w-[1260px] px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pb-12 lg:pt-12">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-7 border-t border-[var(--border)] bg-[var(--surface)] px-1 pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="移动导航">{navigation.map(({ href, label, icon: Icon }) => { const active = pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active ? 'text-[var(--accent-strong)]' : 'text-[var(--muted)]'}`}><Icon size={22} weight={active ? 'fill' : 'regular'} />{label}</Link> })}</nav>
    </div>
  </div>
}
