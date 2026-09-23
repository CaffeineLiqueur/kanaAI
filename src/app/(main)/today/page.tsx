import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Clock, Headphones, Repeat } from '@phosphor-icons/react/dist/ssr'
import { PageHeading } from '@/components/page-heading'
import { requireOnboardedUser } from '@/lib/dal'
import { getTodayPlan } from '@/lib/learning/today'
import { prisma } from '@/lib/prisma'

export default async function TodayPage() {
  const user = await requireOnboardedUser()
  const [plan, companion, streak] = await Promise.all([
    getTodayPlan(user.id, user.dailyGoalMinutes),
    prisma.companion.findUnique({ where: { userId: user.id } }),
    prisma.streak.findUnique({ where: { userId: user.id } }),
  ])
  const primary = plan.tasks.find((task) => task.required && task.status !== 'COMPLETED')
  return <>
    <PageHeading eyebrow="今日" title={`${user.name || '你好'}，今天学这一点就够了`} description="先完成到期复习，再继续一小节新内容。计划会根据你的练习结果自动调整。" action={<span className="status-pill"><Clock size={16} />约 {plan.estimatedMinutes} 分钟</span>} />
    {primary ? <section className="grid gap-5 lg:grid-cols-[1.5fr_.7fr]">
      <article className="rounded-xl bg-[var(--accent)] p-7 text-white lg:p-9"><div className="flex items-center justify-between"><span className="text-sm font-semibold">下一步</span><span className="rounded-full bg-white/15 px-3 py-1 text-xs">必做</span></div><h2 className="mt-8 text-3xl font-bold tracking-[-.04em]">{primary.title}</h2><p className="mt-3 max-w-xl leading-7">{primary.description}</p><Link className="btn mt-8 bg-white text-[var(--accent-ink)]" href={primary.href}>继续学习 <ArrowRight size={18} weight="bold" /></Link></article>
      <article className="card flex min-h-64 flex-col items-center justify-center p-6 text-center"><Image className="h-auto w-[114px]" src="/brand/mark.png" width={344} height={358} alt={`${companion?.name || '小卡'}，你的学习伙伴`} priority /><h2 className="mt-3 font-bold">{companion?.name || '小卡'} 在等你</h2><p className="mt-1 text-sm text-[var(--muted)]">连续学习 {streak?.current || 0} 天 · Lv.{companion?.level || 1}</p></article>
    </section> : <section className="card p-8"><CheckCircle size={32} color="var(--success)" /><h2 className="mt-5 text-xl font-bold">今天的必做任务完成了</h2><p className="mt-2 text-[var(--muted)]">可以做一次可选练习，或者放心休息。</p></section>}
    <section className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 className="section-title">计划清单</h2><span className="text-sm text-[var(--muted)]">{plan.completedCount}/{plan.totalCount} 完成</span></div><div className="card divide-y divide-[var(--border)]">{plan.tasks.map((task) => <Link key={task.id} href={task.href} className="flex min-h-20 items-center gap-4 px-5 transition-colors hover:bg-[var(--surface-strong)]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent-strong)]">{task.kind === 'REVIEW' ? <Repeat size={20} /> : task.kind === 'PRACTICE' ? <Headphones size={20} /> : <ArrowRight size={20} />}</span><span className="min-w-0 flex-1"><span className="font-semibold">{task.title}</span><span className="mt-1 block text-sm text-[var(--muted)]">{task.required ? '必做' : '可选'} · {task.estimatedMinutes} 分钟</span></span><ArrowRight size={18} className="text-[var(--muted)]" /></Link>)}</div></section>
  </>
}
