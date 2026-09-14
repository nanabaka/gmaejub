import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "겜줍 (GameJub) - 놓치면 사라지는 이번 주 0원 게임 줍줍 트래커",
  description:
    "스팀(Steam), 에픽게임즈(Epic Games), GOG 정기·게릴라 100% 무료 배포 실시간 올인원 레이더. 기간 한정 무료 게임을 라이브러리에 영구 소장하세요!",
  keywords: [
    "무료 게임",
    "에픽게임즈 무료",
    "스팀 무료 배포",
    "GOG 무료",
    "0원 게임",
    "게임 줍기",
    "겜줍",
    "GameJub",
    "PC 무료 게임",
  ],
  authors: [{ name: "GameJub Team" }],
  openGraph: {
    title: "겜줍 (GameJub) - 놓치면 사라지는 이번 주 0원 게임 줍줍 트래커",
    description:
      "스팀, 에픽게임즈, GOG 100% 무료 배포 실시간 올인원 레이더. 지금 0원에 내 라이브러리에 영구 소장하세요!",
    url: "https://gamejub.com",
    siteName: "겜줍 (GameJub)",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "겜줍 (GameJub) - 이번 주 0원 무료 게임 트래커",
    description:
      "스팀, 에픽게임즈, GOG 100% 무료 배포 실시간 올인원 레이더.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isAdSenseEnabled = Boolean(adClientId && !adClientId.includes('XXXXX'));
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {isAdSenseEnabled && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
            onLoad={() => {
              window.__adsenseScriptLoaded = true;
            }}
          />
        )}
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen antialiased selection:bg-gray-200 selection:text-gray-900">
        {children}
      </body>
    </html>
  );
}
