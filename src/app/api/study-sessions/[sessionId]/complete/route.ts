import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { studyDate } from '@/lib/learning/today'
import { prisma } from '@/lib/prisma'

export async function POST(_request: Request, context: { params: Promise<{ sessionId: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const { sessionId } = await context.params
  const session = await prisma.studySession.findFirst({ where: { id: sessionId, userId: user.id }, include: { lesson: { include: { unit: true } } } })
  if (!session?.lesson) return NextResponse.json({ error: '课程会话不存在' }, { status: 404 })
  if (session.status === 'COMPLETED') return NextResponse.json({ completed: true, duplicate: true })
  if (session.status !== 'ACTIVE' || session.totalActivities < 1) return NextResponse.json({ error: '课程会话不可完成' }, { status: 409 })
  const now = new Date()
  try {
    const result = await prisma.$transaction(async (tx) => {
      const claimed = await tx.studySession.updateMany({ where: { id: session.id, userId: user.id, status: 'ACTIVE', currentStep: { gte: session.totalActivities } }, data: { status: 'COMPLETED', completedAt: now } })
      if (claimed.count !== 1) throw new Error('LESSON_NOT_READY')

      const lessons = await tx.lesson.findMany({ where: { unit: { courseId: session.lesson!.unit.courseId } }, select: { id: true, order: true, unit: { select: { order: true } } } })
      lessons.sort((a, b) => a.unit.order - b.unit.order || a.order - b.order)
      const nextLesson = lessons[lessons.findIndex((item) => item.id === session.lessonId) + 1]
      const advanced = await tx.enrollment.updateMany({ where: { userId: user.id, courseId: session.lesson!.unit.courseId, currentLessonId: session.lessonId }, data: { currentLessonId: nextLesson?.id || null, completedAt: nextLesson ? null : now } })
      if (advanced.count !== 1) throw new Error('LESSON_ALREADY_ADVANCED')

      const rewardExp = session.lesson!.xpReward
      const reward = await tx.rewardLedger.createMany({ data: [{ userId: user.id, idempotencyKey: `lesson:${session.id}`, reason: '完成课程', exp: rewardExp }], skipDuplicates: true })
      if (reward.count === 1) {
        const companion = await tx.companion.upsert({ where: { userId: user.id }, update: { exp: { increment: rewardExp } }, create: { userId: user.id, exp: rewardExp } })
        await tx.companion.update({ where: { id: companion.id }, data: { level: Math.floor(companion.exp / 100) + 1 } })
      }
      await tx.dailyPlanItem.updateMany({ where: { userId: user.id, lessonId: session.lessonId, status: { in: ['PENDING', 'ACTIVE'] } }, data: { status: 'COMPLETED', completedAt: now } })
      if (!nextLesson || nextLesson.unit.order !== session.lesson!.unit.order) await tx.eventLog.create({ data: { userId: user.id, name: 'unit_completed', payload: { unitId: session.lesson!.unit.id } } })

      const { date } = studyDate(now)
      const streak = await tx.streak.findUnique({ where: { userId: user.id } })
      const elapsed = streak?.lastStudyDate ? Math.round((date.getTime() - streak.lastStudyDate.getTime()) / 86400000) : 999
      const current = elapsed === 0 ? streak?.current || 1 : elapsed === 1 ? (streak?.current || 0) + 1 : 1
      await tx.streak.upsert({ where: { userId: user.id }, update: { current, longest: Math.max(streak?.longest || 0, current), lastStudyDate: date }, create: { userId: user.id, current, longest: current, lastStudyDate: date } })
      await tx.eventLog.create({ data: { userId: user.id, name: 'lesson_completed', payload: { lessonId: session.lessonId, sessionId: session.id } } })
      return { completed: true, nextLessonId: nextLesson?.id || null, rewardExp }
    })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'LESSON_NOT_READY') return NextResponse.json({ error: '请先完成本课所有练习' }, { status: 409 })
    if (error instanceof Error && error.message === 'LESSON_ALREADY_ADVANCED') return NextResponse.json({ error: '该课程进度已推进，请刷新页面' }, { status: 409 })
    const latest = await prisma.studySession.findUnique({ where: { id: session.id }, select: { status: true } })
    if (latest?.status === 'COMPLETED') return NextResponse.json({ completed: true, duplicate: true })
    throw error
  }
}
