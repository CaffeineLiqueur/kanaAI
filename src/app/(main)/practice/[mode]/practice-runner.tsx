'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, SpeakerHigh } from '@phosphor-icons/react'
import { OrderingInput } from '@/components/ordering-input'

interface Activity { id: string; type: string; prompt: string; content: { japanese?: string; audioText?: string; options?: string[]; tokens?: string[] } }

export function PracticeRunner({ mode, ttsEnabled }: { mode: string; ttsEnabled: boolean }) {
  const [sessionId, setSessionId] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<{ attemptId: string; correct: boolean; feedback: string } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/practice-sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode }), signal: controller.signal })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || '练习准备失败'); return data })
      .then((data) => { setSessionId(data.session.id); setActivities(data.activities); setIndex(data.session.currentStep || 0); setCorrectCount(data.session.correctCount || 0) })
      .catch((reason) => { if (reason.name !== 'AbortError') setError(reason.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [mode])

  async function play(text: string) {
    try {
      const response = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, speaker: 3 }) })
      if (!response.ok) throw new Error()
      const url = URL.createObjectURL(await response.blob())
      const audio = new Audio(url)
      audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true })
      await audio.play()
    } catch { setError('语音暂时不可用，可以看文本继续答题。') }
  }

  async function submit() {
    if (!answer || !activities[index] || (activities[index].type === 'ORDERING' && answer.split('|').length !== activities[index].content.tokens?.length)) return
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/attempts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, activityId: activities[index].id, answer, idempotencyKey: crypto.randomUUID() }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '提交失败')
      setResult({ attemptId: data.attempt.id, correct: data.attempt.correct, feedback: data.attempt.feedback })
      if (!data.attempt.correct) void loadAiFeedback(data.attempt.id)
      if (data.attempt.correct) setCorrectCount((value) => value + 1)
    } catch (reason) { setError(reason instanceof Error ? reason.message : '提交失败') } finally { setLoading(false) }
  }

  async function loadAiFeedback(attemptId: string) {
    try {
      const response = await fetch('/api/ai/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attemptId }) })
      if (!response.ok) return
      const data = await response.json()
      if (data.source === 'ai' && typeof data.explanation === 'string' && typeof data.nextStep === 'string') {
        setResult((previous) => previous?.attemptId === attemptId ? { ...previous, feedback: `${data.explanation} 建议：${data.nextStep}` } : previous)
      }
    } catch { /* 固定解析已经显示，继续学习不依赖 AI。 */ }
  }

  if (loading && !activities.length && !error) return <div className="card p-8 text-center text-[var(--muted)]">正在准备练习</div>
  if (error && !activities.length) return <div className="card p-8"><p role="alert" className="text-[var(--warning)]">{error}</p><Link className="btn btn-secondary mt-6" href="/practice">返回专项列表</Link></div>
  if (index >= activities.length) return <div className="card mx-auto max-w-2xl p-10 text-center"><CheckCircle className="mx-auto" size={50} color="var(--success)" weight="fill" /><h1 className="mt-5 text-2xl font-bold">{mode === 'placement' ? '摸底完成' : '这轮练习完成了'}</h1><p className="mt-3 text-[var(--muted)]">{mode === 'placement' ? `${activities.length} 题中答对 ${correctCount} 题。${correctCount >= 4 ? '基础识读比较稳，可以从主线第一课快速建立学习记录。' : '建议先从假名和基础句型开始，循序练习。'}摸底不会自动跳课。` : '作答结果已经更新能力图谱和复习安排。'}</p><Link className="btn btn-primary mt-7" href="/today">{mode === 'placement' ? '查看第一课' : '回到今日计划'}</Link></div>
  const activity = activities[index]
  const incompleteOrder = activity.type === 'ORDERING' && answer.split('|').length !== activity.content.tokens?.length
  return <div className="mx-auto max-w-2xl"><div className="mb-6 flex items-center justify-between"><Link className="icon-button" href="/practice" aria-label="返回专项列表"><ArrowLeft size={20} /></Link><span className="text-sm font-semibold">{index + 1}/{activities.length}</span></div><div className="progress-track mb-7"><div className="progress-fill" style={{ width: `${index / activities.length * 100}%` }} /></div><section className="card min-h-[400px] p-7 sm:p-10"><p className="eyebrow">专项练习</p><h1 className="mt-4 text-2xl font-bold leading-9">{activity.prompt}</h1>{activity.type !== 'LISTENING_CHOICE' && activity.content.japanese && <p lang="ja" className="mt-8 text-3xl font-semibold">{activity.content.japanese}</p>}{ttsEnabled && (activity.content.audioText || (activity.type === 'LISTENING_CHOICE' && activity.content.japanese)) && <button className="btn btn-secondary mt-8" onClick={() => play(activity.content.audioText || activity.content.japanese!)}><SpeakerHigh size={20} />播放日语</button>}{(!ttsEnabled || error) && activity.type === 'LISTENING_CHOICE' && <p lang="ja" className="mt-3 text-sm text-[var(--muted)]">{ttsEnabled ? '语音故障时可读文本：' : '文本听力模式：'}{activity.content.audioText || activity.content.japanese}</p>}{activity.type === 'ORDERING' && activity.content.tokens ? <OrderingInput tokens={activity.content.tokens} value={answer} onChange={setAnswer} disabled={!!result} /> : activity.content.options ? <div className="mt-8 grid gap-3 sm:grid-cols-2">{activity.content.options.map((option) => <button key={option} onClick={() => setAnswer(option)} className={`min-h-14 rounded-xl border px-4 text-left ${answer === option ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)]'}`}>{option}</button>)}</div> : <label className="mt-8 block text-sm font-semibold">你的答案<input className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit() }} /></label>}{result ? <div role="status" className={`mt-7 rounded-xl p-4 text-sm ${result.correct ? 'bg-emerald-500/10 text-[var(--success)]' : 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'}`}><strong>{result.correct ? '回答正确' : '再看一眼解析'}</strong><p className="mt-1 leading-6">{result.feedback}</p></div> : error ? <p className="mt-6 text-sm text-[var(--warning)]" role="alert">{error}</p> : null}<div className="mt-8 flex justify-end">{result ? <button className="btn btn-primary" onClick={() => { setIndex(index + 1); setAnswer(''); setResult(null); setError('') }}>下一题 <ArrowRight size={18} /></button> : <button className="btn btn-primary" onClick={submit} disabled={!answer || incompleteOrder || loading}>检查答案</button>}</div></section></div>
}
