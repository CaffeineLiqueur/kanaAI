import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import HomeView from './home-view'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const user = await getCurrentUser()
  if (user) {
    redirect(user.onboardingCompleted ? '/today' : '/onboarding')
  }

  return <HomeView />
}
