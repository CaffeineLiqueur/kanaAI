import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const cards = await prisma.reviewCard.findMany({ where: { userId: user.id, due: { lte: new Date() } }, include: { objective: { include: { lesson: true } } }, orderBy: { due: 'asc' }, take: 20 })
  return NextResponse.json({ cards, remaining: cards.length })
}
