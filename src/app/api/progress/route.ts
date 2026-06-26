import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getReviewInterval } from '@/lib/utils'

// GET - 获取学习进度
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const module = searchParams.get('module') // kana / vocabulary / grammar

  const where: { userId: string; module?: string } = {
    userId: session.userId,
  }
  if (module) {
    where.module = module
  }

  const progress = await prisma.progress.findMany({ where })

  return NextResponse.json({ progress })
}

// POST - 更新学习进度
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { module, itemId, mastered } = await request.json()

  if (!module || !itemId) {
    return NextResponse.json(
      { error: '缺少必要参数' },
      { status: 400 }
    )
  }

  // Calculate next review time using Ebbinghaus intervals
  const existing = await prisma.progress.findUnique({
    where: {
      userId_module_itemId: {
        userId: session.userId,
        module,
        itemId,
      },
    },
  })

  const reviewLevel = mastered ? (existing?.mastered ? 1 : 0) : 0
  const intervalDays = getReviewInterval(reviewLevel)
  const reviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000)

  const progress = await prisma.progress.upsert({
    where: {
      userId_module_itemId: {
        userId: session.userId,
        module,
        itemId,
      },
    },
    update: {
      mastered: mastered ?? undefined,
      reviewAt,
    },
    create: {
      userId: session.userId,
      module,
      itemId,
      mastered: mastered ?? false,
      reviewAt,
    },
  })

  return NextResponse.json({ progress })
}
