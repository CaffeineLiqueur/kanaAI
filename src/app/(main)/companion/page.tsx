import Image from 'next/image'
import { Sparkle, TrendUp } from '@phosphor-icons/react/dist/ssr'
import { PageHeading } from '@/components/page-heading'
import { requireOnboardedUser } from '@/lib/dal'
import { prisma } from '@/lib/prisma'

export default async function CompanionPage() {
  const user = await requireOnboardedUser()
  const companion = await prisma.companion.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } })
  const [rewards, streak] = await Promise.all([
    prisma.rewardLedger.findMany({ where: { userId: user.id }, take: 8, orderBy: { createdAt: 'desc' } }),
    prisma.streak.findUnique({ where: { userId: user.id } }),
  ])
  const levelStart = (companion.level - 1) * 100
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  const learnedToday = rewards.some((reward) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(reward.createdAt) === today)
  const mood = learnedToday ? '为你庆祝' : '陪你慢慢来'
  const growth = companion.level >= 10 ? '默契伙伴' : companion.level >= 4 ? '一起成长' : '初识伙伴'
  return <><PageHeading eyebrow="学习伙伴" title={`${companion.name} 会记得你的每一步`} description="经验只来自服务端确认的课程、复习和测验完成事件，不需要喂食，也不会因为休息惩罚你。" />
    <section className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><article className="card flex min-h-[360px] flex-col items-center justify-center p-8 text-center"><Image className="h-auto w-[190px]" src="/brand/mark.png" width={344} height={358} alt={`${companion.name} 的当前状态`} priority /><span className="status-pill mt-3"><Sparkle size={15} />今天状态：{mood}</span><h2 className="mt-4 text-2xl font-bold">{companion.name} · Lv.{companion.level}</h2><p className="mt-2 text-sm text-[var(--muted)]">{growth} · 连续学习 {streak?.current || 0} 天</p><div className="progress-track mt-5 w-full max-w-xs"><div className="progress-fill" style={{ width: `${Math.min(100, companion.exp - levelStart)}%` }} /></div><p className="mt-2 text-xs text-[var(--muted)]">{companion.exp - levelStart}/100 经验</p></article><article className="card p-6"><div className="flex items-center gap-3"><TrendUp size={24} color="var(--accent)" /><h2 className="section-title">成长记录</h2></div><div className="mt-5 divide-y divide-[var(--border)]">{rewards.length ? rewards.map((reward) => <div key={reward.id} className="flex items-center justify-between py-4"><div><p className="font-semibold">{reward.reason}</p><p className="mt-1 text-xs text-[var(--muted)]">{reward.createdAt.toLocaleDateString('zh-CN')}</p></div><span className="font-bold text-[var(--accent-strong)]">+{reward.exp} XP</span></div>) : <p className="py-8 text-[var(--muted)]">完成一节课后，第一条成长记录会出现在这里。</p>}</div></article></section>
  </>
}
