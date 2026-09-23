import Link from 'next/link'
import { ArrowRight, Brain, Clock } from '@phosphor-icons/react/dist/ssr'
import { PageHeading } from '@/components/page-heading'
import { requireOnboardedUser } from '@/lib/dal'
import { prisma } from '@/lib/prisma'

export default async function ReviewPage() {
  const user = await requireOnboardedUser()
  const now = new Date()
  const [due, upcoming] = await Promise.all([
    prisma.reviewCard.count({ where: { userId: user.id, due: { lte: now } } }),
    prisma.reviewCard.count({ where: { userId: user.id, due: { gt: now } } }),
  ])
  return <><PageHeading eyebrow="复习" title="在忘记之前，刚好再见一次" description="每次选择 Again、Hard、Good 或 Easy，都会调整下一次出现时间。" />
    <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><article className="card p-7"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Brain size={26} weight="duotone" /></div><p className="mt-8 text-sm text-[var(--muted)]">本轮最多复习</p><p className="mt-1 text-5xl font-bold tracking-[-.06em]">{Math.min(due, 20)}</p><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{due > 20 ? `还有 ${due - 20} 张待复习；本轮先处理 20 张，余下可稍后继续。` : '预计不超过 8 分钟。'}</p><Link className={`btn mt-8 ${due ? 'btn-primary' : 'btn-secondary'}`} href={due ? '/review/session' : '/practice'}>{due ? '开始复习' : '没有到期卡片'} <ArrowRight size={18} /></Link></article><article className="card p-7"><Clock size={26} color="var(--accent)" /><h2 className="mt-7 section-title">接下来</h2><p className="mt-3 text-3xl font-bold">{upcoming}</p><p className="mt-2 text-sm text-[var(--muted)]">张卡片已安排在未来复习</p></article></section>
    <aside className="mt-6 rounded-xl border border-[var(--border)] p-5 text-sm leading-6 text-[var(--muted)]"><strong className="text-[var(--text)]">怎么评分：</strong> 完全想不起来选 Again，费力想起选 Hard，正常答出选 Good，不假思索选 Easy。</aside>
  </>
}
