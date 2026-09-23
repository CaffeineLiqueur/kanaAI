import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getTodayPlan } from '@/lib/learning/today'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  return NextResponse.json({ plan: await getTodayPlan(user.id, user.dailyGoalMinutes) })
}
