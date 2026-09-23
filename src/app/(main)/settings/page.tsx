import { PageHeading } from '@/components/page-heading'
import { requireOnboardedUser } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const user = await requireOnboardedUser()
  const companion = await prisma.companion.findUnique({ where: { userId: user.id } })
  return <><PageHeading eyebrow="设置" title="按你的节奏学习" description="每日目标会影响计划长度，不改变课程完整度。" /><SettingsForm dailyGoalMinutes={user.dailyGoalMinutes} theme={user.theme} fontScale={user.fontScale} kanaHints={user.kanaHints} ttsEnabled={user.ttsEnabled} companionName={companion?.name || '小卡'} /></>
}
