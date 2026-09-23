import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  dailyGoalMinutes: z.number().int().min(10).max(30).optional(),
  theme: z.enum(['system', 'light', 'dark']).optional(),
  fontScale: z.enum(['standard', 'large']).optional(),
  kanaHints: z.boolean().optional(),
  ttsEnabled: z.boolean().optional(),
  companionName: z.string().trim().min(1).max(12).optional(),
})

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: '设置格式错误' }, { status: 400 })
  const { companionName, ...settings } = parsed.data
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: settings }),
    ...(companionName ? [prisma.companion.upsert({ where: { userId: user.id }, update: { name: companionName }, create: { userId: user.id, name: companionName } })] : []),
  ])
  return NextResponse.json({ ok: true })
}
