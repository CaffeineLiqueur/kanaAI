import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  learningGoal: z.enum(['travel', 'practical-n5', 'work', 'hobby']),
  dailyGoalMinutes: z.coerce.number().int().min(10).max(30),
  experienceLevel: z.enum(['zero', 'some', 'placement']),
})

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: '建档信息不完整' }, { status: 400 })

  const course = await prisma.course.findUnique({ where: { slug: 'n5-foundation' } })
  if (!course) return NextResponse.json({ error: '课程尚未初始化，请先运行数据库种子' }, { status: 503 })
  const firstLesson = await prisma.lesson.findFirst({ where: { unit: { courseId: course.id } }, orderBy: [{ unit: { order: 'asc' } }, { order: 'asc' }] })
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { ...parsed.data, onboardingCompleted: true } }),
    prisma.enrollment.upsert({ where: { userId_courseId: { userId: user.id, courseId: course.id } }, update: {}, create: { userId: user.id, courseId: course.id, currentLessonId: firstLesson?.id } }),
    prisma.eventLog.create({ data: { userId: user.id, name: 'onboarding_completed', payload: parsed.data } }),
  ])
  return NextResponse.json({ ok: true })
}
