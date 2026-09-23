import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET

if (!secretKey || secretKey.length < 32) {
  throw new Error('SESSION_SECRET must be set and contain at least 32 characters')
}

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
