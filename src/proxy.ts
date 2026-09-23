import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/jwt'

const protectedRoutes = ['/today', '/course', '/review', '/practice', '/progress', '/companion', '/settings', '/learn', '/onboarding', '/dashboard', '/kana', '/vocabulary', '/grammar', '/quiz', '/pet']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const protectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`))
  const authRoute = path === '/login' || path === '/register'
  if (!protectedRoute && !authRoute) return NextResponse.next()
  const session = await decrypt(request.cookies.get('kanaai_session')?.value)
  if (protectedRoute && !session?.userId) return NextResponse.redirect(new URL('/login', request.url))
  if (authRoute && session?.userId) return NextResponse.redirect(new URL('/today', request.url))
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'] }
