import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: '密码至少需要8位字符' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      )
    }

    // Create user with initial pet
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        pet: {
          create: {
            name: 'ハチ',
            species: 'dog',
            level: 1,
            exp: 0,
            happiness: 80,
            hunger: 20,
            evolution: 1,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    // Create session
    await createSession(user.id)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}
