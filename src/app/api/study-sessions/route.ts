import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { publicSessionActivity, sessionActivitySchema } from '@/lib/learning/session-activities'

const schema = z.object({ lessonId: z.string().min(1) })

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: '课程参数错误' }, { status: 400 })
  const lesson = await prisma.lesson.findUnique({ where: { id: parsed.data.lessonId }, include: { unit: true, activities: { orderBy: { order: 'asc' } }, contentVersions: { orderBy: { version: 'desc' }, take: 1 } } })
  if (!lesson) return NextResponse.json({ error: '课程不存在' }, { status: 404 })
  const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId: lesson.unit.courseId } } })
  if (!enrollment || enrollment.currentLessonId !== lesson.id) return NextResponse.json({ error: '请按主线顺序解锁课程' }, { status: 403 })
  const existing = await prisma.studySession.findFirst({ where: { userId: user.id, lessonId: lesson.id, status: 'ACTIVE' }, orderBy: { startedAt: 'desc' } })
  const snapshot = existing ? sessionActivitySchema.array().parse(existing.activitySnapshot) : lesson.activities.map((activity) => sessionActivitySchema.parse({ templateId: activity.id, objectiveId: activity.objectiveId, lessonId: activity.lessonId, type: activity.type, prompt: activity.prompt, content: activity.content, answer: activity.answer, explanation: activity.explanation }))
  const session = existing || await prisma.studySession.create({ data: { userId: user.id, lessonId: lesson.id, contentVersionId: lesson.contentVersions[0]?.id, activityIds: snapshot.map((activity) => activity.templateId), activitySnapshot: snapshot, totalActivities: snapshot.length } })
  if (!existing) await prisma.eventLog.create({ data: { userId: user.id, name: 'plan_started', payload: { lessonId: lesson.id, sessionId: session.id } } })
  const attempts = await prisma.attempt.findMany({ where: { sessionId: session.id }, select: { activityTemplateId: true, correct: true, feedback: true } })
  return NextResponse.json({ session: { id: session.id, currentStep: session.currentStep }, activities: snapshot.map(publicSessionActivity), attempts })
}
