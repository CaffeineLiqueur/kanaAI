import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateMastery } from '@/lib/learning/mastery'
import { sessionActivitySchema } from '@/lib/learning/session-activities'

const schema = z.object({ sessionId: z.string(), activityId: z.string(), answer: z.union([z.string(), z.array(z.string())]), idempotencyKey: z.string().min(8).max(100) })

function normalize(value: string | string[]) { return Array.isArray(value) ? value.map((item) => item.trim()).join('|') : value.trim() }

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: '作答参数错误' }, { status: 400 })
  const duplicate = await prisma.attempt.findUnique({ where: { idempotencyKey: parsed.data.idempotencyKey } })
  if (duplicate) return duplicate.userId === user.id ? NextResponse.json({ attempt: duplicate, duplicate: true }) : NextResponse.json({ error: '幂等键冲突' }, { status: 409 })
  const session = await prisma.studySession.findFirst({ where: { id: parsed.data.sessionId, userId: user.id } })
  if (!session) return NextResponse.json({ error: '活动不存在或无权限' }, { status: 404 })
  const activity = sessionActivitySchema.array().parse(session.activitySnapshot).find((item) => item.templateId === parsed.data.activityId)
  if (!activity || !session.activityIds.includes(activity.templateId) || (session.lessonId && activity.lessonId !== session.lessonId)) return NextResponse.json({ error: '活动不存在或无权限' }, { status: 404 })
  if (session.status !== 'ACTIVE') return NextResponse.json({ error: '本轮课程已经完成' }, { status: 409 })
  const answerRule = activity.answer
  const submitted = normalize(parsed.data.answer).toLocaleLowerCase()
  const accepted = [answerRule.value, ...(answerRule.accepted || [])].map((value) => normalize(value).toLocaleLowerCase())
  const trace = activity.type === 'KANA_TRACE'
  const diagnostic = session.mode === 'placement'
  const correct = trace ? submitted === '描摹完成' : accepted.includes(submitted)

  try {
  const result = await prisma.$transaction(async (tx) => {
    const mastery = !trace && !diagnostic && activity.objectiveId ? await tx.objectiveMastery.findUnique({ where: { userId_objectiveId: { userId: user.id, objectiveId: activity.objectiveId } } }) : null
    const nextScore = trace || diagnostic ? null : calculateMastery({ previousScore: mastery?.score || 0, attempts: mastery?.attempts || 0, correct })
    const attempt = await tx.attempt.create({ data: { idempotencyKey: parsed.data.idempotencyKey, userId: user.id, sessionId: session.id, activityTemplateId: activity.templateId, objectiveId: activity.objectiveId, answer: parsed.data.answer, correct, score: trace ? 0 : correct ? 1 : 0, errorType: correct ? null : 'incorrect_recall', feedback: trace ? '描摹已记录。笔画暂不自动评分，继续做识读题来证明掌握。' : correct ? '回答正确。继续保持主动回忆。' : activity.explanation } })
    if (!trace && !diagnostic && activity.objectiveId && nextScore !== null) {
      await tx.objectiveMastery.upsert({ where: { userId_objectiveId: { userId: user.id, objectiveId: activity.objectiveId } }, update: { score: nextScore, attempts: { increment: 1 }, correctStreak: correct ? { increment: 1 } : 0, lastPracticedAt: new Date() }, create: { userId: user.id, objectiveId: activity.objectiveId, score: nextScore, attempts: 1, correctStreak: correct ? 1 : 0, lastPracticedAt: new Date() } })
      await tx.reviewCard.upsert({ where: { userId_objectiveId: { userId: user.id, objectiveId: activity.objectiveId } }, update: {}, create: { userId: user.id, objectiveId: activity.objectiveId } })
    }
    const attemptCount = await tx.attempt.count({ where: { sessionId: session.id } })
    const answeredAll = attemptCount >= session.totalActivities
    const completed = answeredAll && !session.lessonId
    const claimed = completed
      ? await tx.studySession.updateMany({ where: { id: session.id, status: 'ACTIVE' }, data: { currentStep: attemptCount, status: 'COMPLETED', completedAt: new Date() } })
      : await tx.studySession.updateMany({ where: { id: session.id, status: 'ACTIVE' }, data: { currentStep: attemptCount } })
    if (claimed.count !== 1) throw new Error('SESSION_ALREADY_COMPLETED')
    if (completed) {
      const rewardExp = session.mode === 'checkpoint' ? 10 : 0
      const reward = rewardExp ? await tx.rewardLedger.createMany({ data: [{ userId: user.id, idempotencyKey: `checkpoint:${session.id}`, reason: '完成综合测验', exp: rewardExp }], skipDuplicates: true }) : { count: 0 }
      if (reward.count === 1) {
        const companion = await tx.companion.upsert({ where: { userId: user.id }, update: { exp: { increment: rewardExp } }, create: { userId: user.id, exp: rewardExp } })
        await tx.companion.update({ where: { id: companion.id }, data: { level: Math.floor(companion.exp / 100) + 1 } })
      }
      if (!diagnostic) {
        const studyDay = new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())}T00:00:00.000Z`)
        const streak = await tx.streak.findUnique({ where: { userId: user.id } })
        const elapsed = streak?.lastStudyDate ? Math.round((studyDay.getTime() - streak.lastStudyDate.getTime()) / 86400000) : 999
        const current = elapsed === 0 ? streak?.current || 1 : elapsed === 1 ? (streak?.current || 0) + 1 : 1
        await tx.streak.upsert({ where: { userId: user.id }, update: { current, longest: Math.max(streak?.longest || 0, current), lastStudyDate: studyDay }, create: { userId: user.id, current, longest: current, lastStudyDate: studyDay } })
      }
      await tx.eventLog.create({ data: { userId: user.id, name: diagnostic ? 'placement_completed' : 'practice_completed', payload: { sessionId: session.id, mode: session.mode } } })
    }
    await tx.eventLog.create({ data: { userId: user.id, name: 'activity_answered', payload: { activityId: activity.templateId, correct, scored: !trace && !diagnostic, diagnostic } } })
    return { attempt, answeredAll, completed, masteryScore: nextScore }
  })
  return NextResponse.json(result, { status: 201 })
  } catch (error) {
    const existing = await prisma.attempt.findFirst({ where: { sessionId: session.id, activityTemplateId: activity.templateId } })
    if (existing) return NextResponse.json({ attempt: existing, duplicate: true })
    if (error instanceof Error && error.message === 'SESSION_ALREADY_COMPLETED') return NextResponse.json({ error: '本轮课程已经完成' }, { status: 409 })
    throw error
  }
}
