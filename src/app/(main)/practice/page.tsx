import Link from 'next/link'
import { BookOpenText, Brain, Headphones, Keyboard, ListChecks, PencilLine, TextAa } from '@phosphor-icons/react/dist/ssr'
import { PageHeading } from '@/components/page-heading'

const modes = [
  { key: 'kana', title: '假名', text: '识读、听辨与描摹', icon: PencilLine, minutes: 6 },
  { key: 'vocabulary', title: '词汇', text: '意义、读音与主动回忆', icon: TextAa, minutes: 8 },
  { key: 'grammar', title: '语法', text: '选择、排序与改错', icon: Brain, minutes: 10 },
  { key: 'listening', title: '听力', text: '短句听辨与场景理解', icon: Headphones, minutes: 7 },
  { key: 'reading', title: '阅读', text: '通知、菜单与短文', icon: BookOpenText, minutes: 10 },
  { key: 'sentence', title: '键盘造句', text: '输入、排序与重组', icon: Keyboard, minutes: 8 },
  { key: 'checkpoint', title: '综合测验', text: '覆盖当前已学目标', icon: ListChecks, minutes: 15 },
]

export default function PracticePage() {
  return <><PageHeading eyebrow="专项练习" title="针对一个能力，集中练一小轮" description="练习会优先抽取薄弱目标，不提供手动标记掌握。每次结果都会进入能力图谱。" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{modes.map(({ key, title, text, icon: Icon, minutes }) => <Link key={key} href={`/practice/${key}`} className="card group min-h-44 p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Icon size={24} weight="duotone" /></span><span className="status-pill">{minutes} 分钟</span></div><h2 className="mt-7 font-bold">{title}</h2><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Link>)}</div></>
}
