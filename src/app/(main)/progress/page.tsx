import { CalendarDots, ChartLineUp, Target } from '@phosphor-icons/react/dist/ssr'
import { PageHeading } from '@/components/page-heading'
import { requireOnboardedUser } from '@/lib/dal'
import { studyDate } from '@/lib/learning/today'
import { prisma } from '@/lib/prisma'

export default async function ProgressPage() {
  const user = await requireOnboardedUser()
  const now = new Date()
  const weekStart = new Date(now.getTime() - 7 * 86400000)
  const [masteries, completedLessons, recentSessions, recentReviews, recentAttempts, streak] = await Promise.all([
    prisma.objectiveMastery.findMany({ where: { userId: user.id }, include: { objective: true } }),
    prisma.studySession.count({ where: { userId: user.id, status: 'COMPLETED', lessonId: { not: null } } }),
    prisma.studySession.findMany({ where: { userId: user.id, status: 'COMPLETED', completedAt: { gte: weekStart } }, select: { lessonId: true, completedAt: true } }),
    prisma.reviewLog.findMany({ where: { card: { userId: user.id }, reviewedAt: { gte: weekStart } }, select: { reviewedAt: true } }),
    prisma.attempt.findMany({ where: { userId: user.id, session: { mode: { not: 'placement' } }, createdAt: { gte: weekStart } }, select: { correct: true } }),
    prisma.streak.findUnique({ where: { userId: user.id } }),
  ])
  const average = masteries.length ? Math.round(masteries.reduce((sum, item) => sum + item.score, 0) / masteries.length * 100) : 0
  const weak = masteries.filter((item) => item.score < .65).sort((a, b) => a.score - b.score).slice(0, 5)
  const weeklyLessons = recentSessions.filter((item) => item.lessonId).length
  const weeklyAccuracy = recentAttempts.length ? Math.round(recentAttempts.filter((item) => item.correct).length / recentAttempts.length * 100) : null
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getTime() - (6 - index) * 86400000)
    const key = studyDate(date).day
    const lessons = recentSessions.filter((item) => item.lessonId && item.completedAt && studyDate(item.completedAt).day === key).length
    const reviews = recentReviews.filter((item) => studyDate(item.reviewedAt).day === key).length
    return { key, label: `${Number(key.slice(5, 7))}/${Number(key.slice(8, 10))}`, lessons, reviews }
  })
  return <><PageHeading eyebrow="进度" title="看能力变化，不只看打卡次数" description="掌握度由作答证据累计。低于 65% 的目标会优先进入练习和复习。" />
    <section className="grid gap-4 sm:grid-cols-3"><article className="card p-5"><ChartLineUp size={24} color="var(--accent)" /><p className="mt-5 text-3xl font-bold">{average}%</p><p className="mt-1 text-sm text-[var(--muted)]">平均掌握度</p></article><article className="card p-5"><Target size={24} color="var(--accent)" /><p className="mt-5 text-3xl font-bold">{completedLessons}</p><p className="mt-1 text-sm text-[var(--muted)]">完成课程</p></article><article className="card p-5"><CalendarDots size={24} color="var(--accent)" /><p className="mt-5 text-3xl font-bold">{streak?.current || 0} 天</p><p className="mt-1 text-sm text-[var(--muted)]">当前连续学习</p></article></section>
    <section className="mt-8"><h2 className="section-title mb-4">最近 7 天</h2><div className="card p-5 sm:p-6"><p className="text-sm leading-6 text-[var(--muted)]">完成 {weeklyLessons} 节课，复习 {recentReviews.length} 张卡，{weeklyAccuracy === null ? '尚无作答记录' : `作答正确率 ${weeklyAccuracy}%`}。</p><div className="mt-5 grid grid-cols-7 gap-2" aria-label="七天学习日历">{days.map((day) => <div key={day.key} className={`min-w-0 rounded-xl border p-2 text-center sm:p-3 ${day.lessons || day.reviews ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)]'}`}><p className="text-xs text-[var(--muted)]">{day.label}</p><p className="mt-2 text-sm font-bold">{day.lessons + day.reviews}</p><p className="mt-1 hidden text-xs text-[var(--muted)] sm:block">{day.lessons} 课 · {day.reviews} 复习</p><span className="sr-only">{day.lessons} 节课，{day.reviews} 张复习卡</span></div>)}</div></div></section>
    <section className="mt-8"><h2 className="section-title mb-4">薄弱项</h2><div className="card divide-y divide-[var(--border)]">{weak.length ? weak.map((item) => <div key={item.id} className="flex items-center gap-4 p-5"><div className="min-w-0 flex-1"><p className="font-semibold">{item.objective.title}</p><p className="mt-1 text-sm text-[var(--muted)]">{item.objective.description}</p></div><span className="font-bold text-[var(--warning)]">{Math.round(item.score * 100)}%</span></div>) : <p className="p-6 text-[var(--muted)]">完成第一课后，这里会出现你的能力图谱与薄弱目标。</p>}</div></section>
  </>
}
