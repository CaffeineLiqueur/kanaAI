import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getReviewInterval } from '@/lib/utils'

// GET - 获取词汇进度
export async function GET() {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const vocabProgress = await prisma.vocabProgress.findMany({
    where: { userId: session.userId },
  })

  return NextResponse.json({ vocabProgress })
}

// POST - 更新词汇进度（认识/不认识）
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { wordId, correct } = await request.json()

  if (!wordId) {
    return NextResponse.json(
      { error: '缺少 wordId' },
      { status: 400 }
    )
  }

  const existing = await prisma.vocabProgress.findUnique({
    where: {
      userId_wordId: {
        userId: session.userId,
        wordId,
      },
    },
  })

  let newLevel: number
  let correctCount: number
  let wrongCount: number

  if (existing) {
    if (correct) {
      newLevel = Math.min(5, existing.level + 1)
      correctCount = existing.correctCount + 1
      wrongCount = existing.wrongCount
    } else {
      newLevel = Math.max(0, existing.level - 1)
      correctCount = existing.correctCount
      wrongCount = existing.wrongCount + 1
    }
  } else {
    newLevel = correct ? 1 : 0
    correctCount = correct ? 1 : 0
    wrongCount = correct ? 0 : 1
  }

  const intervalDays = getReviewInterval(newLevel)
  const nextReview = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000)

  const vocabProgress = await prisma.vocabProgress.upsert({
    where: {
      userId_wordId: {
        userId: session.userId,
        wordId,
      },
    },
    update: {
      level: newLevel,
      nextReview,
      correctCount,
      wrongCount,
    },
    create: {
      userId: session.userId,
      wordId,
      level: newLevel,
      nextReview,
      correctCount,
      wrongCount,
    },
  })

  return NextResponse.json({ vocabProgress })
}
