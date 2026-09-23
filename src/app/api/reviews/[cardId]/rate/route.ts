import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { scheduleReview } from '@/lib/learning/fsrs'
import { studyDate } from '@/lib/learning/today'

const schema = z.object({ rating: z.enum(['AGAIN', 'HARD', 'GOOD', 'EASY']), idempotencyKey: z.string().min(8).max(100) })

export async function POST(request: NextRequest, context: { params: Promise<{ cardId: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: '评分参数错误' }, { status: 400 })
  const existing = await prisma.reviewLog.findUnique({ where: { idempotencyKey: parsed.data.idempotencyKey }, include: { card: true } })
  if (existing) return existing.card.userId === user.id ? NextResponse.json({ card: existing.card, duplicate: true }) : NextResponse.json({ error: '幂等键冲突' }, { status: 409 })
  const { cardId } = await context.params
  const card = await prisma.reviewCard.findFirst({ where: { id: cardId, userId: user.id } })
  if (!card) return NextResponse.json({ error: '复习卡不存在' }, { status: 404 })
  const now = new Date()
  if (card.due > now) return NextResponse.json({ error: '这张卡片尚未到期' }, { status: 409 })
  const next = scheduleReview(card, parsed.data.rating, now)
  try {
  const updated = await prisma.$transaction(async (tx) => {
    const claimed = await tx.reviewCard.updateMany({ where: { id: card.id, userId: user.id, due: card.due }, data: { due: next.card.due, state: next.card.state, stability: next.card.stability, difficulty: next.card.difficulty, elapsedDays: next.card.elapsed_days, scheduledDays: next.card.scheduled_days, learningSteps: next.card.learning_steps, reps: next.card.reps, lapses: next.card.lapses, lastReview: next.card.last_review } })
    if (claimed.count !== 1) throw new Error('CARD_ALREADY_RATED')
    const nextCard = await tx.reviewCard.findUniqueOrThrow({ where: { id: card.id } })
    const log = await tx.reviewLog.create({ data: { idempotencyKey: parsed.data.idempotencyKey, cardId: card.id, rating: parsed.data.rating, state: next.log.state, due: next.log.due, stability: next.log.stability, difficulty: next.log.difficulty, elapsedDays: next.log.elapsed_days, scheduledDays: next.log.scheduled_days, reviewedAt: now } })
    const reward = await tx.rewardLedger.createMany({ data: [{ userId: user.id, idempotencyKey: `review:${log.id}`, reason: '完成复习', exp: 2 }], skipDuplicates: true })
    if (reward.count) {
      const companion = await tx.companion.upsert({ where: { userId: user.id }, update: { exp: { increment: 2 } }, create: { userId: user.id, exp: 2 } })
      await tx.companion.update({ where: { id: companion.id }, data: { level: Math.floor(companion.exp / 100) + 1 } })
    }
    const { date } = studyDate(now)
    const localStart = new Date(date.getTime() - 8 * 3600000)
    const streak = await tx.streak.findUnique({ where: { userId: user.id } })
    const elapsed = streak?.lastStudyDate ? Math.round((date.getTime() - streak.lastStudyDate.getTime()) / 86400000) : 999
    const current = elapsed === 0 ? streak?.current || 1 : elapsed === 1 ? (streak?.current || 0) + 1 : 1
    await tx.streak.upsert({ where: { userId: user.id }, update: { current, longest: Math.max(streak?.longest || 0, current), lastStudyDate: date }, create: { userId: user.id, current, longest: current, lastStudyDate: date } })
    const [ratedToday, remaining] = await Promise.all([
      tx.reviewLog.count({ where: { card: { userId: user.id }, reviewedAt: { gte: localStart } } }),
      tx.reviewCard.count({ where: { userId: user.id, due: { lte: now } } }),
    ])
    if (ratedToday >= 20 || remaining === 0) await tx.dailyPlanItem.updateMany({ where: { userId: user.id, planDate: date, kind: 'REVIEW', status: { in: ['PENDING', 'ACTIVE'] } }, data: { status: 'COMPLETED', completedAt: now } })
    await tx.eventLog.create({ data: { userId: user.id, name: 'review_rated', payload: { cardId, rating: parsed.data.rating } } })
    return nextCard
  })
  return NextResponse.json({ card: updated })
  } catch (error) {
    if (error instanceof Error && error.message === 'CARD_ALREADY_RATED') return NextResponse.json({ error: '这张卡片刚刚已评分，请刷新队列' }, { status: 409 })
    throw error
  }
}
