import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { publicSessionActivity, sessionActivitySchema } from '@/lib/learning/session-activities'

const schema = z.object({ mode: z.enum(['kana', 'vocabulary', 'grammar', 'listening', 'reading', 'sentence', 'checkpoint', 'placement']) })
const placementIds = ['kana-01-choice', 'kana-02-choice', 'intro-01-choice', 'intro-02-choice', 'place-01-choice']

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '练习类型错误' }, { status: 400 })
  const mode = parsed.data.mode
  const existing = await prisma.studySession.findFirst({ where: { userId: user.id, mode, lessonId: null, status: 'ACTIVE' }, orderBy: { startedAt: 'desc' } })
  if (existing) {
    const activities = sessionActivitySchema.array().parse(existing.activitySnapshot)
    const correctCount = mode === 'placement' ? await prisma.attempt.count({ where: { sessionId: existing.id, correct: true } }) : 0
    return NextResponse.json({ session: { id: existing.id, currentStep: existing.currentStep, correctCount }, activities: activities.map(publicSessionActivity) })
  }
  const enrollment = await prisma.enrollment.findFirst({ where: { userId: user.id } })
  if (!enrollment) return NextResponse.json({ error: '请先完成学习建档' }, { status: 403 })
  const completed = mode === 'placement' ? [] : await prisma.studySession.findMany({ where: { userId: user.id, status: 'COMPLETED', lessonId: { not: null } }, select: { lessonId: true } })
  const eligibleIds = [...new Set([...completed.flatMap((item) => item.lessonId ? [item.lessonId] : []), ...(enrollment.currentLessonId ? [enrollment.currentLessonId] : [])])]
  if (mode !== 'placement' && !eligibleIds.length) return NextResponse.json({ error: '先完成第一课，再开始专项练习。' }, { status: 404 })
  const where = {
    ...(mode === 'placement' ? { id: { in: placementIds } } : { lessonId: { in: eligibleIds } }),
    ...(mode === 'kana' ? { objective: { kind: 'kana' }, type: { not: 'KANA_TRACE' as const } } : {}),
    ...(mode === 'vocabulary' ? { objective: { kind: 'vocabulary' }, type: { in: ['MULTIPLE_CHOICE', 'TEXT_INPUT'] as Array<'MULTIPLE_CHOICE' | 'TEXT_INPUT'> } } : {}),
    ...(mode === 'grammar' ? { objective: { kind: 'grammar' } } : {}),
    ...(mode === 'listening' ? { type: 'LISTENING_CHOICE' as const } : {}),
    ...(mode === 'reading' ? { type: 'READING' as const } : {}),
    ...(mode === 'sentence' ? { type: { in: ['TEXT_INPUT', 'ORDERING', 'ERROR_CORRECTION'] as Array<'TEXT_INPUT' | 'ORDERING' | 'ERROR_CORRECTION'> } } : {}),
    ...(mode === 'checkpoint' ? { type: { not: 'KANA_TRACE' as const } } : {}),
  }
  const [candidates, masteries] = await Promise.all([
    prisma.activityTemplate.findMany({ where, orderBy: { order: 'asc' } }),
    prisma.objectiveMastery.findMany({ where: { userId: user.id }, select: { objectiveId: true, score: true } }),
  ])
  const scores = new Map(masteries.map((item) => [item.objectiveId, item.score]))
  const chosen = mode === 'placement'
    ? placementIds.flatMap((id) => { const activity = candidates.find((item) => item.id === id); return activity ? [activity] : [] })
    : candidates.map((activity) => ({ activity, priority: (activity.objectiveId ? scores.get(activity.objectiveId) : undefined) ?? 0.35, tie: Math.random() })).sort((a, b) => a.priority - b.priority || a.tie - b.tie).slice(0, 5).map((item) => item.activity)
  if (!chosen.length) return NextResponse.json({ error: '当前单元还没有这类练习，先完成第一课再回来。' }, { status: 404 })
  const snapshot = chosen.map((activity) => sessionActivitySchema.parse({ templateId: activity.id, objectiveId: activity.objectiveId, lessonId: activity.lessonId, type: activity.type, prompt: activity.prompt, content: activity.content, answer: activity.answer, explanation: activity.explanation }))
  const session = await prisma.studySession.create({ data: { userId: user.id, mode, activityIds: chosen.map((activity) => activity.id), activitySnapshot: snapshot, totalActivities: chosen.length } })
  return NextResponse.json({ session: { id: session.id, currentStep: 0 }, activities: snapshot.map(publicSessionActivity) }, { status: 201 })
}
