import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import HomeView from './home-view'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Server-side: a logged-in user should land on the dashboard,
  // not on the marketing homepage. Unauthenticated visitors see the
  // marketing page and the homepage hydrates with their data when
  // available (the cookie tells us who's who before any client JS).
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }

  return <HomeView initialUser={null} />
}
