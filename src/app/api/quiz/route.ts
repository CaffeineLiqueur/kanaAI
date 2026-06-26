import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - 获取测验历史
export async function GET() {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const quizResults = await prisma.quizResult.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({ quizResults })
}

// POST - 保存测验结果
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { type, score, total, details } = await request.json()

  if (!type || score === undefined || !total) {
    return NextResponse.json(
      { error: '缺少必要参数' },
      { status: 400 }
    )
  }

  const quizResult = await prisma.quizResult.create({
    data: {
      userId: session.userId,
      type,
      score,
      total,
      details: details ?? {},
    },
  })

  return NextResponse.json({ quizResult }, { status: 201 })
}
