import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.NEXTAUTH_SECRET || 'kanaai-dev-secret-change-in-production'
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: { userId: string; expiresAt: Date }) {
  return new SignJWT({ ...payload, expiresAt: payload.expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
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
