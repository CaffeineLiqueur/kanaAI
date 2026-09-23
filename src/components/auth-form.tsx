'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const register = mode === 'register'
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('')
    if (register && password !== confirmPassword) { setError('两次输入的密码不一致'); return }
    setLoading(true)
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(register ? { name, email, password } : { email, password, remember }) })
      const data = await response.json()
      if (!response.ok) { setError(data.error || '操作失败，请稍后重试'); return }
      router.push(register ? '/onboarding' : '/today'); router.refresh()
    } catch { setError('网络连接失败，请稍后重试') } finally { setLoading(false) }
  }
  const inputClass = 'mt-2 h-12 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-4'
  return <main className="container grid min-h-screen items-center gap-12 py-10 lg:grid-cols-[1fr_440px]"><section className="hidden lg:block"><Link href="/"><Image src="/brand/wordmark.png" width={152} height={38} alt="kanaAI" priority /></Link><h1 className="mt-20 max-w-2xl text-6xl font-bold leading-[1.02] tracking-[-.065em]">每天一小步，<br /><span className="text-[var(--accent)]">持续看得见。</span></h1><p className="mt-6 max-w-lg text-lg leading-8 text-[var(--muted)]">今天计划、课程练习和间隔复习会自动接续，不需要自己拼凑学习材料。</p></section><section className="card p-7 sm:p-9"><Link className="lg:hidden" href="/"><Image src="/brand/wordmark.png" width={128} height={32} alt="kanaAI" /></Link><p className="eyebrow mt-10 lg:mt-0">{register ? '创建账户' : '欢迎回来'}</p><h1 className="mt-3 text-3xl font-bold tracking-[-.045em]">{register ? '开始你的 N5 路径' : '继续今天的计划'}</h1><form className="mt-8 space-y-5" onSubmit={submit}>{register && <label className="block text-sm font-semibold">昵称<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label>}<label className="block text-sm font-semibold">邮箱<input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label className="block text-sm font-semibold">密码<input className={inputClass} type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={register ? 'new-password' : 'current-password'} required /></label>{register && <label className="block text-sm font-semibold">确认密码<input className={inputClass} type="password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required /></label>}{!register && <label className="flex items-center gap-2 text-sm text-[var(--muted)]"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />在这台设备保持登录</label>}{error && <p className="rounded-lg bg-[var(--accent-soft)] p-3 text-sm text-[var(--accent-strong)]" role="alert">{error}</p>}<button className="btn btn-primary w-full" disabled={loading}>{loading ? '请稍候' : register ? '创建账户' : '登录'}</button></form><p className="mt-6 text-center text-sm text-[var(--muted)]">{register ? '已有账户？' : '还没有账户？'} <Link className="font-semibold text-[var(--accent-strong)]" href={register ? '/login' : '/register'}>{register ? '去登录' : '免费注册'}</Link></p></section></main>
}
