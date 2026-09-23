import { AppShell } from '@/components/app-shell'
import { requireOnboardedUser } from '@/lib/dal'

export const dynamic = 'force-dynamic'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await requireOnboardedUser()
  return <AppShell userName={user.name || '学习者'} theme={user.theme} fontScale={user.fontScale}>{children}</AppShell>
}
