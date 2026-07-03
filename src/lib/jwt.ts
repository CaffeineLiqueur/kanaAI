import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.NEXTAUTH_SECRET || 'kanaai-dev-secret-change-in-production'
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(
  payload: { userId: string; expiresAt: Date },
  remember: boolean = true,
) {
  // JWT expiry mirrors the cookie's lifetime so a session-cookie session
  // can't be resurrected by pasting the JWT back in after the browser closes.
  const exp = remember ? '30d' : '1d'
  return new SignJWT({ ...payload, expiresAt: payload.expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as { userId: string; expiresAt: string }
  } catch {
    return null
  }
}
