// 폼 제출 완료 후 감사 페이지
'use client'

import { useEffect } from 'react'

export default function ThanksPage() {
  useEffect(() => {
    // 전환 추적을 위한 이벤트 발송
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
        'value': 1.0,
        'currency': 'KRW'
      })
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* 성공 아이콘 */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* 메인 메시지 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            신청이 완료되었습니다!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            24시간 이내에 담당자가 연락드릴 예정입니다
          </p>

          {/* 안내 박스 */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              다음 단계 안내
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </span>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">담당자 연락</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    영업일 기준 24시간 이내에 전화 또는 카카오톡으로 연락드립니다
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </span>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">방문 일정 협의</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    고객님께 편리한 시간대에 맞춰 방문 일정을 잡아드립니다
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </span>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">전문 감정 및 매입</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    전문 감정사가 방문하여 정확한 감정 후 즉시 현금 매입합니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700">
              <strong>빠른 문의:</strong> 급하신 경우 
              <a href="tel:02-1234-5678" className="text-blue-600 font-medium ml-1">
                02-1234-5678
              </a>
              로 직접 연락주시면 더욱 빠르게 처리해드립니다
            </p>
          </div>

          {/* CTA 버튼 */}
          <div className="space-y-4">
            <a
              href="https://pf.kakao.com/_xXxXxX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <span className="mr-2">💬</span>
              카카오톡으로 문의하기
            </a>
            
            <div>
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                홈으로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}