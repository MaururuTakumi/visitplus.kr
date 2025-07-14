// アナリティクスユーティリティ関数

// ページビューイベント
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// カスタムイベント
export const trackEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// フォーム分析用イベント
export const trackFormEvent = (
  eventName: string,
  formData: Record<string, any>
) => {
  // GA4
  trackEvent({
    action: eventName,
    category: 'form_interaction',
    label: JSON.stringify(formData),
  })
  
  // GTM DataLayer
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...formData,
    })
  }
}

// UTMパラメータ取得
export const getUTMParams = () => {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') || 'direct',
    utm_medium: params.get('utm_medium') || 'none',
    utm_campaign: params.get('utm_campaign') || 'none',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  }
}

// セッション時間計測
let sessionStartTime: number | null = null

export const startSession = () => {
  sessionStartTime = Date.now()
}

export const endSession = () => {
  if (!sessionStartTime) return
  
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)
  
  trackEvent({
    action: 'session_end',
    category: 'engagement',
    label: 'session_duration',
    value: sessionDuration,
  })
}

// スクロール深度追跡
export const trackScrollDepth = () => {
  let maxScroll = 0
  
  const handleScroll = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    
    if (scrollPercentage > maxScroll) {
      maxScroll = scrollPercentage
      
      // 25%, 50%, 75%, 100%でイベント送信
      if ([25, 50, 75, 100].includes(scrollPercentage)) {
        trackEvent({
          action: 'scroll_depth',
          category: 'engagement',
          label: `${scrollPercentage}%`,
          value: scrollPercentage,
        })
      }
    }
  }
  
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }
}