import Link from 'next/link'
import { ArrowRight, CheckCircle, LockSimple } from '@phosphor-icons/react/dist/ssr'
import { PageHeading } from '@/components/page-heading'
import { N5_COURSE, TOTAL_LESSONS, TOTAL_VOCABULARY_TARGET } from '@/content/curriculum'
import { prisma } from '@/lib/prisma'
import { requireOnboardedUser } from '@/lib/dal'

export default async function CoursePage() {
  const user = await requireOnboardedUser()
  const enrollment = await prisma.enrollment.findFirst({ where: { userId: user.id }, include: { currentLesson: { include: { unit: true } } } })
  const currentIndex = enrollment?.completedAt ? N5_COURSE.units.length : Math.max(0, N5_COURSE.units.findIndex((unit) => unit.slug === enrollment?.currentLesson?.unit.slug))
  return <>
    <PageHeading eyebrow="N5 主线" title="一条完整、可解释的学习路径" description={`${N5_COURSE.units.length} 个单元，${TOTAL_LESSONS} 节课，${TOTAL_VOCABULARY_TARGET} 个高频词。完成练习后才会推进掌握度。`} />
    <div className="grid gap-4">{N5_COURSE.units.map((unit, index) => {
      const locked = index > currentIndex
      const completed = index < currentIndex
      const lessonId = index === currentIndex ? enrollment?.currentLesson?.id : undefined
      return <article key={unit.slug} className="card grid gap-5 p-5 sm:grid-cols-[64px_1fr_auto] sm:items-center"><div className={`grid h-14 w-14 place-items-center rounded-xl text-lg font-bold ${index === currentIndex ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-strong)]'}`}>{completed ? <CheckCircle size={25} color="var(--success)" weight="fill" /> : String(index + 1).padStart(2, '0')}</div><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{unit.title}</h2>{index === currentIndex && <span className="status-pill">当前单元</span>}</div><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{unit.description}</p><p className="mt-2 text-xs text-[var(--muted)]">{unit.lessons.length} 节课 · {unit.vocabularyTarget} 词 · {unit.grammarTopics.slice(0, 3).join('、')}</p></div>{locked ? <LockSimple size={21} className="mr-3" aria-label="尚未解锁" /> : lessonId ? <Link className="btn btn-secondary" href={`/learn/${lessonId}`}>继续 <ArrowRight size={17} /></Link> : <span className="mr-3 text-sm text-[var(--muted)]">{completed ? '已完成' : '待解锁'}</span>}</article>
    })}</div>
  </>
}
