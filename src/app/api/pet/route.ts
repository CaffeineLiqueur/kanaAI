import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const companion = await prisma.companion.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } })
  return NextResponse.json({ companion })
}
