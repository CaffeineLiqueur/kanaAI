import Image from 'next/image'
import { requireUser } from '@/lib/dal'
import { redirect } from 'next/navigation'
import { OnboardingForm } from './onboarding-form'

export default async function OnboardingPage() {
  const user = await requireUser()
  if (user.onboardingCompleted) redirect('/today')
  return <main className="container grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[.65fr_1fr]"><section><Image src="/brand/wordmark.png" width={150} height={38} alt="kanaAI" priority /><p className="eyebrow mt-16">约 3 分钟</p><h1 className="page-title mt-3">先了解你，<br />再安排第一课。</h1><p className="mt-5 max-w-sm leading-7 text-[var(--muted)]">只问三个问题。以后可以在设置里随时修改。</p><Image className="mt-10 h-auto w-[120px]" src="/brand/mark.png" width={344} height={358} alt="kanaAI 猫咪伙伴" priority /></section><OnboardingForm /></main>
}
