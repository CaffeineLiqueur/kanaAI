import type { Metadata } from "next";
import "./globals.css";
import "./pixel-theme.css";

export const metadata: Metadata = {
  title: "kanaAI - AI日语学习",
  description: "宝可梦风格的AI日语学习应用，像素宠物陪伴",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F5F0E1] font-pixel">
        {children}
      </body>
    </html>
  );
}
