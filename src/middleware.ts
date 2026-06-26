import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/jwt'

const protectedRoutes = [
  '/dashboard',
  '/kana',
  '/vocabulary',
  '/grammar',
  '/quiz',
  '/pet',
  '/practice',
]

const publicRoutes = ['/login', '/register', '/']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Only check page routes, not API or static assets
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.includes('.')
  ) {
    return NextResponse.next()
  }

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(route + '/')
  )
  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith(route + '/')
  )

  // Decrypt session from cookie
  const cookie = req.cookies.get('kanaai_session')?.value
  const session = await decrypt(cookie)

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect authenticated users away from auth pages
  if (
    (path === '/login' || path === '/register') &&
    session?.userId
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
