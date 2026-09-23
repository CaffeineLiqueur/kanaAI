import { PageHeading } from '@/components/page-heading'
import { KanaChart } from './kana-chart'
import Link from 'next/link'
import { requireOnboardedUser } from '@/lib/dal'
export default async function KanaPracticePage() { const user = await requireOnboardedUser(); return <><PageHeading eyebrow="专项练习" title="完整假名表与笔顺" description="从清音到浊音、半浊音和拗音，点击字形查看本地笔顺。" action={<Link className="btn btn-primary" href="/practice/kana/quiz">开始识读练习</Link>} /><KanaChart ttsEnabled={user.ttsEnabled} /></> }
