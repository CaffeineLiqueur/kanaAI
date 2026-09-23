import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarCheck, Headphones, Path, Repeat } from '@phosphor-icons/react/dist/ssr'

const features = [
  { icon: CalendarCheck, title: '今天只做该做的', text: '到期复习、新课和可选练习被整理成 10 到 15 分钟的清单。' },
  { icon: Path, title: '一条清楚的 N5 路径', text: '12 个单元从假名和发音出发，走到生活场景与综合模拟。' },
  { icon: Repeat, title: '练过才算掌握', text: '掌握度来自答题证据，FSRS 会在合适的时间把内容带回来。' },
  { icon: Headphones, title: 'AI 可用，但不依赖 AI', text: '解释和变体可以动态生成，失败时固定课程仍能完整继续。' },
]

export default function HomeView() {
  return <main>
    <header className="container flex h-20 items-center justify-between">
      <Link href="/" aria-label="kanaAI 首页"><Image src="/brand/wordmark.png" width={145} height={36} alt="kanaAI" priority /></Link>
      <nav className="flex items-center gap-2" aria-label="账户导航"><Link className="btn btn-quiet" href="/login">登录</Link><Link className="btn btn-primary" href="/register">免费开始</Link></nav>
    </header>
    <section className="container grid min-h-[650px] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[1.08fr_.92fr]">
      <div className="max-w-[690px]">
        <p className="eyebrow mb-5">零基础到 N5</p>
        <h1 className="text-[clamp(3.1rem,7vw,6.7rem)] font-[780] leading-[.96] tracking-[-.075em]">每天 15 分钟，<br /><span className="text-[var(--accent)]">真正学会</span>日语。</h1>
        <p className="mt-7 max-w-[590px] text-lg leading-8 text-[var(--muted)]">不是功能拼盘，也不是无尽打卡。kanaAI 为你安排今天最值得学的内容，让课程、练习和复习形成一个闭环。</p>
        <div className="mt-9 flex flex-wrap items-center gap-3"><Link className="btn btn-primary px-5" href="/register">建立我的学习计划 <ArrowRight size={18} weight="bold" /></Link><Link className="btn btn-secondary" href="#path">查看学习路径</Link></div>
        <p className="mt-4 text-sm text-[var(--muted)]">3 分钟完成建档，不需要信用卡</p>
      </div>
      <div className="relative mx-auto w-full max-w-[500px]">
        <div className="card relative overflow-hidden p-7 shadow-[var(--shadow)]">
          <div className="mb-10 flex items-center justify-between"><span className="eyebrow">今日计划</span><span className="status-pill">约 13 分钟</span></div>
          <div className="space-y-3">
            <div className="rounded-xl bg-[var(--accent)] p-5 text-white"><p className="text-sm">下一步</p><p className="mt-1 text-xl font-bold">认识第一组假名</p><p className="mt-4 text-sm">目标预告 · 示例 · 练习 · 回忆 · 小结</p></div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] p-4"><div><p className="font-semibold">到期复习</p><p className="mt-1 text-sm text-[var(--muted)]">8 张卡片</p></div><Repeat size={24} /></div>
            <div className="flex items-center justify-between rounded-xl border border-dashed border-[var(--border)] p-4 text-[var(--muted)]"><div><p className="font-semibold text-[var(--text)]">听力热身</p><p className="mt-1 text-sm">可选 · 4 分钟</p></div><Headphones size={24} /></div>
          </div>
        </div>
        <Image className="absolute -bottom-6 -right-3 h-auto w-24 drop-shadow-xl sm:-bottom-12 sm:-right-5 sm:w-[154px]" src="/brand/mark.png" width={154} height={160} alt="kanaAI 猫咪伙伴" priority />
      </div>
    </section>
    <section id="path" className="border-y border-[var(--border)] bg-[var(--surface)] py-24"><div className="container">
      <p className="eyebrow">学习闭环</p>
      <div className="mt-4 grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><h2 className="page-title">每天知道下一步，<br />每周看见自己进步。</h2><p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">系统先处理快要遗忘的知识，再开放新课。答错会得到明确反馈，答对会改变掌握度和复习时间，而不是让你手动点一个“已掌握”。</p></div>
      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text }) => <article key={title} className="bg-[var(--surface)] p-6"><Icon size={28} color="var(--accent)" weight="duotone" /><h3 className="mt-7 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></article>)}</div>
    </div></section>
    <section className="container py-24 text-center"><Image className="mx-auto h-auto" src="/brand/mark.png" width={96} height={100} alt="" /><h2 className="mx-auto mt-6 max-w-2xl page-title">今天开始，先把第一步学扎实。</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-[var(--muted)]">选择目标和每天可投入的时间，kanaAI 会生成你的第一份计划。</p><Link className="btn btn-primary mt-8" href="/register">免费开始学习 <ArrowRight size={18} /></Link></section>
    <footer className="border-t border-[var(--border)] py-8"><div className="container flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--muted)]"><Image src="/brand/wordmark.png" width={116} height={29} alt="kanaAI" /><span>为中文母语的日语学习者设计</span></div></footer>
  </main>
}
