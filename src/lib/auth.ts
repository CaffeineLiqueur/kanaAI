import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { encrypt, decrypt } from './jwt'

export { encrypt, decrypt }

const COOKIE_NAME = 'kanaai_session'
// "Remember me": persistent cookie kept across browser restarts.
const REMEMBER_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
// No "remember me": session cookie — dies when the browser closes.
// JWT itself is still bounded (see jwt.ts) so a stolen cookie can't live forever.
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24h JWT lifetime cap

// --- Password ---

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// --- Session Cookies ---

export async function createSession(userId: string, remember: boolean = true) {
  const maxAgeMs = remember ? REMEMBER_MAX_AGE_MS : SESSION_MAX_AGE_MS
  const expiresAt = new Date(Date.now() + maxAgeMs)
  const session = await encrypt({ userId, expiresAt }, remember)
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // If remember is true → persistent cookie with expires.
    // If false → omit expires so the cookie is a session cookie (cleared on browser close).
    ...(remember ? { expires: expiresAt } : {}),
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
