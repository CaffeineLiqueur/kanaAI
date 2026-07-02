import type { Metadata } from "next";
import "./globals.css";
import "./pixel-theme.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "kanaAI — 日本語を学ぶ",
  description: "AI を活用した日本語学習プラットフォーム。像素ペットと一緒に、ゼロから日本語を学ぼう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col paper-bg font-body text-[var(--ink)]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
