'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'

interface Card { id: string; objective: { title: string; description: string; lesson: { title: string; fallbackContent: unknown } } }
const ratings = [{ key: 'AGAIN', label: 'Again', hint: '忘记了' }, { key: 'HARD', label: 'Hard', hint: '费力想起' }, { key: 'GOOD', label: 'Good', hint: '正常答出' }, { key: 'EASY', label: 'Easy', hint: '很轻松' }]

export function ReviewSession() {
  const [cards, setCards] = useState<Card[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetch('/api/reviews').then((value) => value.json()).then((data) => setCards(data.cards || [])).finally(() => setLoading(false)) }, [])
  const card = cards[index]
  async function rate(rating: string) {
    if (!card) return
    setLoading(true)
    const response = await fetch(`/api/reviews/${card.id}/rate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating, idempotencyKey: crypto.randomUUID() }) })
    if (response.ok) { setIndex((value) => value + 1); setRevealed(false) }
    setLoading(false)
  }
  if (loading && !card) return <div className="card p-8 text-center text-[var(--muted)]">正在准备复习卡</div>
  if (!card) return <div className="card p-8 text-center"><CheckCircle className="mx-auto" size={48} color="var(--success)" weight="fill" /><h1 className="mt-5 text-2xl font-bold">本轮复习完成</h1><p className="mt-3 text-[var(--muted)]">今天到期的卡片已经处理完毕。</p><Link className="btn btn-primary mt-7" href="/today">回到今日计划</Link></div>
  return <div className="mx-auto max-w-2xl"><div className="mb-6 flex items-center justify-between"><Link className="icon-button" href="/review" aria-label="退出复习"><ArrowLeft size={20} /></Link><span className="text-sm font-semibold">{index + 1}/{cards.length}</span></div><section className="card min-h-[430px] p-7 sm:p-10"><p className="eyebrow">{card.objective.lesson.title}</p><h1 className="mt-8 text-center text-3xl font-bold">{card.objective.title}</h1><p className="mx-auto mt-5 max-w-lg text-center text-lg leading-8 text-[var(--muted)]">{revealed ? card.objective.description : '先在心里说出这个目标的规则和一个例子。'}</p>{!revealed ? <button className="btn btn-primary mx-auto mt-14 flex" onClick={() => setRevealed(true)}>显示答案</button> : <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">{ratings.map((item) => <button key={item.key} className="min-h-20 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 hover:border-[var(--accent)]" onClick={() => rate(item.key)} disabled={loading}><strong className="block">{item.label}</strong><span className="mt-1 block text-xs text-[var(--muted)]">{item.hint}</span></button>)}</div>}</section></div>
}
