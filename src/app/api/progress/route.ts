import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const [masteries, enrollment, streak] = await Promise.all([
    prisma.objectiveMastery.findMany({ where: { userId: user.id }, include: { objective: { include: { lesson: { include: { unit: true } } } } } }),
    prisma.enrollment.findFirst({ where: { userId: user.id }, include: { currentLesson: { include: { unit: true } } } }),
    prisma.streak.findUnique({ where: { userId: user.id } }),
  ])
  return NextResponse.json({ masteries, currentUnit: enrollment?.currentLesson?.unit || null, weakObjectives: masteries.filter((item) => item.score < .65).sort((a, b) => a.score - b.score).slice(0, 8), streak })
}
