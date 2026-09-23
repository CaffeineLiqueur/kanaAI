import { notFound } from 'next/navigation'
import { PageHeading } from '@/components/page-heading'
import { PracticeRunner } from './practice-runner'
import { requireOnboardedUser } from '@/lib/dal'

const titles: Record<string, string> = { kana: '假名识读', vocabulary: '词汇回忆', grammar: '语法辨析', listening: '听力辨认', reading: '阅读理解', sentence: '键盘造句', checkpoint: '综合测验', placement: '五题基础摸底' }

export default async function PracticeModePage({ params }: { params: Promise<{ mode: string }> }) {
  const [{ mode }, user] = await Promise.all([params, requireOnboardedUser()])
  if (!titles[mode]) notFound()
  return <><PageHeading eyebrow={mode === 'placement' ? '建档摸底' : '专项练习'} title={titles[mode]} description={mode === 'placement' ? '用五道题了解假名与基础句型。摸底不自动跳课，也不创建复习负担。' : '每轮最多 5 题。答案在服务端评分，结果会影响掌握度与复习时间。'} /><PracticeRunner mode={mode} ttsEnabled={user.ttsEnabled} /></>
}
