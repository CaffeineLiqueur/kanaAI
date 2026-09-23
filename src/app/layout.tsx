import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
export const metadata: Metadata = { title: { default: 'kanaAI | 每天 15 分钟学会日语', template: '%s | kanaAI' }, description: '为成人零基础学习者设计的 N5 日语学习路径。', icons: { icon: '/brand/mark.png', apple: '/brand/mark.png' } }
export const viewport: Viewport = { colorScheme: 'light dark', themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f6f7f8' }, { media: '(prefers-color-scheme: dark)', color: '#111317' }] }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning className={geist.variable}><body><Providers>{children}</Providers></body></html>
}
