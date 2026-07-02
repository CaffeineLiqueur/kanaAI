import type { Metadata } from "next";
import "./globals.css";
import "./pixel-theme.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "kanaAI — 学日语,从零开始",
  description: "AI 老师详细讲解,像素宠物陪伴学习,零基础也能轻松入门。",
  icons: {
    icon: "/img/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="h-full">
      <body className="min-h-full flex flex-col paper-bg font-body text-[var(--ink)]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
