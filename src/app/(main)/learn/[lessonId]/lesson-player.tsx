'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, SpeakerHigh, XCircle } from '@phosphor-icons/react'
import type { publicSessionActivity } from '@/lib/learning/session-activities'
import { TracePad } from './trace-pad'
import { OrderingInput } from '@/components/ordering-input'

interface LessonContent { objectiveCode: string; explanation: string; examples: Array<{ japanese: string; chinese: string; reading: string }>; commonMistake?: string }
type Activity = ReturnType<typeof publicSessionActivity>
type Result = { correct: boolean; feedback: string }
const stages = ['目标', '理解', '练习', '回忆', '小结']

export function LessonPlayer({ lessonId, title, summary, content, activities: initialActivities, kanaHints, ttsEnabled }: { lessonId: string; title: string; summary: string; content: LessonContent; activities: Activity[]; kanaHints: boolean; ttsEnabled: boolean }) {
  const [stage, setStage] = useState(0)
  const [sessionId, setSessionId] = useState('')
  const [activities, setActivities] = useState(initialActivities)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, Result>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ttsError, setTtsError] = useState('')
  const [shownContent, setShownContent] = useState(content)
  const [aiSource, setAiSource] = useState(false)

  async function loadAiExamples() {
    try {
      const response = await fetch('/api/ai/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonId, variant: 'examples' }) })
      if (!response.ok) return
      const data = await response.json()
      if (data.source === 'ai' && data.content?.objectiveCode === content.objectiveCode && Array.isArray(data.content.examples)) {
        setShownContent(data.content)
        setAiSource(true)
      }
    } catch { /* 固定内容已可用，AI 故障不阻断课程。 */ }
  }

  async function begin() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/study-sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonId }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '课程准备失败')
      setSessionId(data.session.id)
      setActivities(data.activities)
      setResults(Object.fromEntries(data.attempts.map((attempt: { activityTemplateId: string; correct: boolean; feedback: string }) => [attempt.activityTemplateId, { correct: attempt.correct, feedback: attempt.feedback }])))
      setStage(data.session.currentStep > 0 ? 2 : 1)
      void loadAiExamples()
    } catch (reason) { setError(reason instanceof Error ? reason.message : '课程准备失败') }
    finally { setLoading(false) }
  }

  async function submit(activity: Activity) {
    if (!sessionId || !answers[activity.id] || loading) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/attempts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, activityId: activity.id, answer: answers[activity.id], idempotencyKey: crypto.randomUUID() }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '提交失败，请重试')
      setResults((previous) => ({ ...previous, [activity.id]: { correct: data.attempt.correct, feedback: data.attempt.feedback } }))
      if (!data.attempt.correct) void loadAiFeedback(activity.id, data.attempt.id)
    } catch (reason) { setError(reason instanceof Error ? reason.message : '提交失败，请重试') }
    finally { setLoading(false) }
  }

  async function loadAiFeedback(activityId: string, attemptId: string) {
    try {
      const response = await fetch('/api/ai/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attemptId }) })
      if (!response.ok) return
      const data = await response.json()
      if (data.source === 'ai' && typeof data.explanation === 'string' && typeof data.nextStep === 'string') {
        setResults((previous) => ({ ...previous, [activityId]: { ...previous[activityId], feedback: `${data.explanation} 建议：${data.nextStep}` } }))
      }
    } catch { /* 固定解析已经显示，继续学习不依赖 AI。 */ }
  }

  async function speak(text: string) {
    setTtsError('')
    try {
      const response = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, speaker: 3 }) })
      if (!response.ok) throw new Error()
      const url = URL.createObjectURL(await response.blob())
      const audio = new Audio(url)
      audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true })
      await audio.play()
    } catch { setTtsError('语音暂时不可用，不影响继续学习。') }
  }

  async function completeLesson() {
    if (!sessionId || loading) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/study-sessions/${sessionId}/complete`, { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '结课失败，请重试')
      setStage(4)
    } catch (reason) { setError(reason instanceof Error ? reason.message : '结课失败，请重试') }
    finally { setLoading(false) }
  }

  const practiceComplete = activities.length > 0 && activities.every((activity) => results[activity.id])
  return <div className="mx-auto max-w-3xl">
    <div className="mb-6 flex items-center justify-between"><Link href="/today" className="icon-button" aria-label="返回今日"><ArrowLeft size={20} /></Link><span className="text-sm font-semibold">{stage + 1}/{stages.length}</span></div>
    <div className="mb-8 flex gap-2" aria-label={`课程进度：${stages[stage]}`}>{stages.map((item, index) => <div key={item} className="flex-1"><div className={`h-1.5 rounded-full ${index <= stage ? 'bg-[var(--accent)]' : 'bg-[var(--surface-strong)]'}`} /><span className="mt-2 hidden text-center text-xs text-[var(--muted)] sm:block">{item}</span></div>)}</div>

    {stage === 0 && <section className="card p-7 sm:p-10"><p className="eyebrow">本课目标</p><h1 className="page-title mt-3">{title}</h1><p className="mt-4 text-lg leading-8 text-[var(--muted)]">{summary}</p><div className="mt-10 rounded-xl bg-[var(--accent-soft)] p-5"><p className="text-sm font-semibold text-[var(--accent-strong)]">完成后你可以</p><p className="mt-2 leading-7">{content.explanation}</p></div>{error && <p role="alert" className="mt-5 text-sm text-[var(--warning)]">{error}</p>}<button className="btn btn-primary mt-8" onClick={begin} disabled={loading}>{loading ? '正在准备' : '开始学习'} <ArrowRight size={18} /></button></section>}

    {stage === 1 && <section className="card p-7 sm:p-10"><p className="eyebrow">先理解 {aiSource && <span className="ml-2 normal-case text-[var(--accent-strong)]">AI 补充</span>}</p><h1 className="mt-3 text-2xl font-bold">从例子里看规律</h1><p className="mt-4 leading-8 text-[var(--muted)]">{shownContent.explanation}</p><div className="mt-8 space-y-3">{shownContent.examples.map((example) => <article key={example.japanese} className="rounded-xl border border-[var(--border)] p-5"><div className="flex items-start justify-between gap-4"><div><p lang="ja" className="text-xl font-semibold">{example.japanese}</p>{kanaHints && <p lang="ja" className="mt-2 text-sm text-[var(--muted)]">{example.reading}</p>}<p className="mt-3">{example.chinese}</p></div>{ttsEnabled && <button className="icon-button shrink-0" onClick={() => speak(example.japanese)} aria-label={`播放 ${example.japanese}`}><SpeakerHigh size={20} /></button>}</div></article>)}</div>{shownContent.commonMistake && <p className="mt-5 rounded-xl bg-[var(--surface-strong)] p-4 text-sm leading-6">常见误区：{shownContent.commonMistake}</p>}{ttsError && <p className="mt-4 text-sm text-[var(--warning)]" role="status">{ttsError}</p>}<button className="btn btn-primary mt-8" onClick={() => setStage(2)}>去练习 <ArrowRight size={18} /></button></section>}

    {stage === 2 && <section className="space-y-4"><div><p className="eyebrow">引导练习</p><h1 className="mt-3 text-2xl font-bold">现在轮到你</h1></div>{activities.map((activity) => <article key={activity.id} className="card p-6"><p className="font-semibold">{activity.prompt}</p>{activity.type !== 'LISTENING_CHOICE' && activity.content.japanese && <p lang="ja" className="mt-4 text-2xl">{activity.content.japanese}</p>}{ttsEnabled && (activity.content.audioText || (activity.type === 'LISTENING_CHOICE' && activity.content.japanese)) && <button className="btn btn-secondary mt-4" onClick={() => speak(activity.content.audioText || activity.content.japanese!)}><SpeakerHigh size={18} />播放日语</button>}{(!ttsEnabled || ttsError) && activity.type === 'LISTENING_CHOICE' && <p lang="ja" className="mt-3 text-sm text-[var(--muted)]">{ttsEnabled ? '语音故障时可读文本：' : '文本听力模式：'}{activity.content.audioText || activity.content.japanese}</p>}
      {activity.type === 'KANA_TRACE' && activity.content.traceCharacter ? <><TracePad character={activity.content.traceCharacter} onDraw={() => setAnswers((previous) => ({ ...previous, [activity.id]: '描摹完成' }))} /><p className="mt-3 text-sm text-[var(--muted)]">沿着笔顺描摹。描摹不自动评分，识读题才会更新掌握度。</p></> : activity.type === 'ORDERING' && activity.content.tokens ? <OrderingInput tokens={activity.content.tokens} value={answers[activity.id] || ''} onChange={(value) => setAnswers((previous) => ({ ...previous, [activity.id]: value }))} disabled={!!results[activity.id]} /> : activity.content.options ? <div className="mt-5 grid gap-2 sm:grid-cols-2">{activity.content.options.map((option) => <button type="button" disabled={!!results[activity.id]} onClick={() => setAnswers((previous) => ({ ...previous, [activity.id]: option }))} key={option} className={`min-h-12 rounded-[10px] border px-4 text-left ${answers[activity.id] === option ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)]'}`}>{option}</button>)}</div> : <label className="mt-5 block text-sm font-semibold">你的答案<input className="mt-2 h-12 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-4" disabled={!!results[activity.id]} value={answers[activity.id] || ''} onChange={(event) => setAnswers((previous) => ({ ...previous, [activity.id]: event.target.value }))} placeholder="输入答案" /></label>}
      {results[activity.id] ? <div role="status" className={`mt-4 flex gap-3 rounded-lg p-4 text-sm ${results[activity.id].correct ? 'bg-emerald-500/10 text-[var(--success)]' : 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'}`}>{results[activity.id].correct ? <CheckCircle size={20} weight="fill" /> : <XCircle size={20} weight="fill" />}<p>{results[activity.id].feedback}</p></div> : <button className="btn btn-secondary mt-4" disabled={!answers[activity.id] || loading || (activity.type === 'ORDERING' && (answers[activity.id] || '').split('|').length !== activity.content.tokens?.length)} onClick={() => submit(activity)}>{activity.type === 'KANA_TRACE' ? '记录描摹' : '检查答案'}</button>}</article>)}
      {ttsError && <p role="status" className="text-sm text-[var(--warning)]">{ttsError}</p>}{error && <p role="alert" className="text-sm text-[var(--warning)]">{error}</p>}<button className="btn btn-primary" disabled={!practiceComplete} onClick={() => setStage(3)}>主动回忆 <ArrowRight size={18} /></button></section>}

    {stage === 3 && <section className="card p-7 text-center sm:p-10"><p className="eyebrow">主动回忆</p><h1 className="mt-4 text-2xl font-bold">不看例句，你还记得什么？</h1><p className="mx-auto mt-4 max-w-lg leading-7 text-[var(--muted)]">用自己的话说出今天的规则，再想一个能使用它的场景。想不完整也没关系，回忆这个动作本身就在巩固记忆。</p><textarea className="mt-7 min-h-32 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4" placeholder="写下你的回忆，可选" />{error && <p role="alert" className="mt-4 text-sm text-[var(--warning)]">{error}</p>}<button className="btn btn-primary mt-5" onClick={completeLesson} disabled={loading}>{loading ? '正在保存' : '完成回忆'} <ArrowRight size={18} /></button></section>}

    {stage === 4 && <section className="card p-7 text-center sm:p-10"><CheckCircle className="mx-auto" size={48} color="var(--success)" weight="fill" /><p className="eyebrow mt-6">课程完成</p><h1 className="mt-3 text-3xl font-bold">今天向前走了一步</h1><p className="mx-auto mt-4 max-w-lg leading-7 text-[var(--muted)]">练习结果已经更新掌握度，并为相关目标创建了复习卡。需要时，它会在今日计划里再次出现。</p><Link className="btn btn-primary mt-8" href="/today">回到今日计划</Link></section>}
  </div>
}
