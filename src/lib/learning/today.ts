import 'server-only'
import { prisma } from '@/lib/prisma'
import { buildDailyPlan } from './planner'
import type { DailyPlan, DailyPlanTask } from './types'

export function studyDate(date = new Date()) {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
  return { day, date: new Date(`${day}T00:00:00.000Z`) }
}

function fromRows(day: string, rows: Array<{ status: DailyPlanTask['status']; snapshot: unknown }>): DailyPlan {
  const tasks = rows.map((row) => ({ ...(row.snapshot as DailyPlanTask), status: row.status }))
  const required = tasks.filter((task) => task.required)
  return {
    date: day,
    tasks,
    estimatedMinutes: required.reduce((sum, task) => sum + task.estimatedMinutes, 0),
    completedCount: required.filter((task) => task.status === 'COMPLETED').length,
    totalCount: required.length,
  }
}

export async function getTodayPlan(userId: string, goalMinutes: number) {
  const now = new Date()
  const { day, date } = studyDate(now)
  const existing = await prisma.dailyPlanItem.findMany({ where: { userId, planDate: date }, orderBy: { order: 'asc' } })
  if (existing.length) return fromRows(day, existing)
  const [reviewCards, enrollment, recentAttempts] = await Promise.all([
    prisma.reviewCard.findMany({ where: { userId, due: { lte: now } }, include: { objective: true }, orderBy: { due: 'asc' }, take: 50 }),
    prisma.enrollment.findFirst({ where: { userId, completedAt: null }, include: { currentLesson: true } }),
    prisma.attempt.findMany({ where: { userId, session: { mode: { not: 'placement' } }, createdAt: { gte: new Date(now.getTime() - 7 * 86400000) } }, select: { correct: true }, take: 50, orderBy: { createdAt: 'desc' } }),
  ])
  const recentAccuracy = recentAttempts.length ? recentAttempts.filter((attempt) => attempt.correct).length / recentAttempts.length : 1
  const plan = buildDailyPlan({
    date: day,
    goalMinutes,
    dueReviews: reviewCards.map((card) => ({ id: card.id, title: card.objective.title })),
    nextLesson: enrollment?.currentLesson ? { id: enrollment.currentLesson.id, title: enrollment.currentLesson.title, durationMinutes: enrollment.currentLesson.durationMinutes } : undefined,
    recentAccuracy,
  })
  await prisma.dailyPlanItem.createMany({
    data: plan.tasks.map((task, index) => ({
      userId,
      planDate: date,
      kind: task.kind,
      order: index + 1,
      estimatedMinutes: task.estimatedMinutes,
      referenceKey: task.id,
      lessonId: task.kind === 'LESSON' ? task.id : null,
      snapshot: { ...task },
    })),
    skipDuplicates: true,
  })
  const saved = await prisma.dailyPlanItem.findMany({ where: { userId, planDate: date }, orderBy: { order: 'asc' } })
  return fromRows(day, saved)
}
