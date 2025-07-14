// 루트 레이아웃 - SEO 메타 태그 및 전역 설정
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import Analytics from '@/components/Analytics'

// 폰트 설정
const inter = Inter({ subsets: ['latin'] })

// SEO 메타데이터 (Lighthouse 점수 90+ 목표)
export const metadata: Metadata = {
  metadataBase: new URL('https://visitplus.kr'),
  title: {
    default: 'VisitPlus | 명품 출장 감정·즉시 매입 서비스',
    template: '%s | VisitPlus'
  },
  description: '에르메스, 샤넬, 루이비통 등 명품 가방을 집에서 편하게 감정받고 즉시 현금으로 판매하세요. 일본 최대 리유스 기업의 전문 서비스.',
  keywords: ['명품매입', '명품감정', '에르메스매입', '샤넬매입', '루이비통매입', '출장매입', '즉시현금', '중고명품'],
  authors: [{ name: 'VisitPlus Korea' }],
  creator: 'VisitPlus',
  publisher: 'VisitPlus Korea',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph 태그
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://visitplus.kr',
    siteName: 'VisitPlus Korea',
    title: '명품 출장 감정·즉시 매입 | VisitPlus',
    description: '집에서 편하게 명품 가방 감정받고 즉시 현금 매입! 일본 15년 노하우의 전문 서비스',
    images: [
      {
        url: '/og/hero.png',
        width: 1200,
        height: 630,
        alt: 'VisitPlus 명품 출장 매입 서비스',
      }
    ],
  },
  // Twitter 카드
  twitter: {
    card: 'summary_large_image',
    title: '명품 출장 감정·즉시 매입 | VisitPlus',
    description: '집에서 편하게 명품 가방 감정받고 즉시 현금 매입!',
    images: ['/og/hero.png'],
  },
  // 추가 메타 태그
  other: {
    'naver-site-verification': 'NAVER_VERIFICATION_CODE',
    'google-site-verification': 'GOOGLE_VERIFICATION_CODE',
  },
  // 로봇 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// 구조화된 데이터 (JSON-LD)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VisitPlus Korea',
  url: 'https://visitplus.kr',
  logo: 'https://visitplus.kr/logo.png',
  description: '일본 최대 리유스 기업 VisitPlus의 한국 명품 출장 매입 서비스',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+82-2-1234-5678',
    contactType: 'customer service',
    areaServed: 'KR',
    availableLanguage: ['Korean']
  },
  sameAs: [
    'https://www.instagram.com/visitplus_kr',
    'https://pf.kakao.com/_xXxXxX'
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* 성능 최적화를 위한 리소스 힌트 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* 뷰포트 및 테마 색상 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        
        {/* Naver Analytics */}
        <script
          type="text/javascript"
          src="//wcs.naver.net/wcslog.js"
          async
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if(!wcs_add) var wcs_add = {};
              wcs_add["wa"] = "NAVER_ANALYTICS_ID";
              if(window.wcs) {
                wcs_do();
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Analytics */}
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        
        {/* Vercel Analytics */}
        <Analytics />
        
        {children}
      </body>
    </html>
  )
}