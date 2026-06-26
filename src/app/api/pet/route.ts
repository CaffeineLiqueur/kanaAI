import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - 获取当前用户的宠物
export async function GET() {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const pet = await prisma.pet.findUnique({
    where: { userId: session.userId },
  })

  if (!pet) {
    return NextResponse.json({ error: '宠物不存在' }, { status: 404 })
  }

  return NextResponse.json({ pet })
}

// PUT - 更新宠物状态
export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const body = await request.json()
  const { action, ...data } = body

  const pet = await prisma.pet.findUnique({
    where: { userId: session.userId },
  })

  if (!pet) {
    return NextResponse.json({ error: '宠物不存在' }, { status: 404 })
  }

  let updateData: Record<string, unknown> = {}

  switch (action) {
    case 'feed':
      updateData = {
        hunger: Math.max(0, pet.hunger - 20),
        happiness: Math.min(100, pet.happiness + 10),
      }
      break
    case 'pet':
      updateData = {
        happiness: Math.min(100, pet.happiness + 15),
      }
      break
    case 'study':
      const expGain = data.expGain || 20
      const newExp = pet.exp + expGain
      const expToNext = Math.floor(100 * Math.pow(1.5, pet.level - 1))

      if (newExp >= expToNext) {
        const newLevel = pet.level + 1
        let newEvolution = pet.evolution
        if (newLevel >= 26) newEvolution = 3
        else if (newLevel >= 11) newEvolution = 2

        updateData = {
          level: newLevel,
          exp: newExp - expToNext,
          evolution: newEvolution,
        }
      } else {
        updateData = {
          exp: newExp,
        }
      }
      break
    case 'sleep':
      updateData = {
        hunger: Math.min(100, pet.hunger + 10),
      }
      break
    default:
      // Direct field update
      updateData = data
  }

  const updatedPet = await prisma.pet.update({
    where: { userId: session.userId },
    data: updateData,
  })

  return NextResponse.json({ pet: updatedPet })
}
