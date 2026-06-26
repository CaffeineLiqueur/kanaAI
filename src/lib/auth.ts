import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { encrypt, decrypt } from './jwt'

export { encrypt, decrypt }

const COOKIE_NAME = 'kanaai_session'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

// --- Password ---

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// --- Session Cookies ---

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value
  if (!sessionCookie) return null

  const payload = await decrypt(sessionCookie)
  if (!payload?.userId) return null

  return payload
}

// --- User helpers ---

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.userId) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  return user
}
