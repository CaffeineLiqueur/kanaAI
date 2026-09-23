'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check } from '@phosphor-icons/react'

const goals = [{ value: 'practical-n5', label: '系统通过 N5', note: '推荐，兼顾实用和考试' }, { value: 'travel', label: '旅行沟通', note: '优先生活场景' }, { value: 'work', label: '工作准备', note: '先打牢通用基础' }, { value: 'hobby', label: '兴趣学习', note: '节奏更轻松' }]

export function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('practical-n5')
  const [minutes, setMinutes] = useState(15)
  const [level, setLevel] = useState('zero')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function finish() {
    setLoading(true); setError('')
    const response = await fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ learningGoal: goal, dailyGoalMinutes: minutes, experienceLevel: level }) })
    const data = await response.json()
    if (!response.ok) { setError(data.error || '保存失败，请重试'); setLoading(false); return }
    router.push(level === 'placement' ? '/practice/placement' : '/today'); router.refresh()
  }
  return <div className="card p-6 sm:p-9">
    <div className="mb-8 flex gap-2" aria-label={`建档进度，第 ${step} 步，共 3 步`}>{[1,2,3].map((item) => <span key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-[var(--accent)]' : 'bg-[var(--surface-strong)]'}`} />)}</div>
    {step === 1 && <fieldset><legend className="text-2xl font-bold tracking-[-.035em]">你最想用日语做什么？</legend><p className="mt-2 text-sm text-[var(--muted)]">这会影响场景和练习推荐，不会限制课程内容。</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{goals.map((item) => <button type="button" onClick={() => setGoal(item.value)} key={item.value} className={`min-h-24 rounded-xl border p-4 text-left ${goal === item.value ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)]'}`}><span className="flex items-center justify-between font-semibold">{item.label}{goal === item.value && <Check size={18} color="var(--accent)" />}</span><span className="mt-2 block text-sm text-[var(--muted)]">{item.note}</span></button>)}</div></fieldset>}
    {step === 2 && <fieldset><legend className="text-2xl font-bold tracking-[-.035em]">每天留多少时间？</legend><p className="mt-2 text-sm text-[var(--muted)]">计划会尽量在这个时间内结束。</p><div className="mt-7 grid grid-cols-3 gap-3">{[10,15,20].map((value) => <button type="button" key={value} onClick={() => setMinutes(value)} className={`min-h-24 rounded-xl border text-xl font-bold ${minutes === value ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]' : 'border-[var(--border)]'}`}>{value}<span className="ml-1 text-sm font-normal">分钟</span></button>)}</div></fieldset>}
    {step === 3 && <fieldset><legend className="text-2xl font-bold tracking-[-.035em]">你现在的基础是？</legend><p className="mt-2 text-sm text-[var(--muted)]">零基础会直接从假名开始；有基础可以先做短摸底。</p><div className="mt-6 space-y-3">{[{ value:'zero',label:'零基础',note:'从五个元音和字形开始'},{ value:'some',label:'学过一点',note:'从主线开始，用作答证明已会内容'},{ value:'placement',label:'先做 5 分钟摸底',note:'了解假名和基础句型，不自动跳课'}].map((item) => <button type="button" key={item.value} onClick={() => setLevel(item.value)} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left ${level === item.value ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)]'}`}><span><strong className="block">{item.label}</strong><span className="mt-1 block text-sm text-[var(--muted)]">{item.note}</span></span>{level === item.value && <Check size={19} color="var(--accent)" />}</button>)}</div></fieldset>}
    {error && <p className="mt-5 rounded-lg bg-[var(--accent-soft)] p-3 text-sm text-[var(--accent-strong)]" role="alert">{error}</p>}
    <div className="mt-8 flex justify-between"><button className="btn btn-quiet" type="button" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>上一步</button>{step < 3 ? <button className="btn btn-primary" type="button" onClick={() => setStep(step + 1)}>下一步 <ArrowRight size={17} /></button> : <button className="btn btn-primary" type="button" onClick={finish} disabled={loading}>{loading ? '正在生成计划' : '开始第一课'} <ArrowRight size={17} /></button>}</div>
  </div>
}
