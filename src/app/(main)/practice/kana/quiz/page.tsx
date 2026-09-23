import { PageHeading } from '@/components/page-heading'
import { PracticeRunner } from '../../[mode]/practice-runner'
import { requireOnboardedUser } from '@/lib/dal'

export default async function KanaQuizPage() {
  const user = await requireOnboardedUser()
  return <><PageHeading eyebrow="专项练习" title="假名识读" description="从已学的假名中抽取 5 题。笔顺描摹不会替你标记掌握，识读结果才会进入能力图谱。" /><PracticeRunner mode="kana" ttsEnabled={user.ttsEnabled} /></>
}
