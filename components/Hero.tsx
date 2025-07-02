// Hero 컴포넌트 - 메인 비주얼 및 핵심 가치 제안
'use client'

import { useEffect, useState } from 'react'
import { sendGAEvent } from './GoogleAnalytics'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-purple-100/30 to-pink-100/30 blur-3xl animate-pulse" />
      </div>

      <div className="container relative mx-auto px-4 max-w-6xl">
        {/* 신뢰 뱃지 */}
        <div className={`flex justify-center mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            일본 No.1 리유스 기업 • 100만건+ 거래 실적
          </div>
        </div>

        {/* 메인 헤드라인 */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              명품 출장 감정
            </span>
            <span className="block mt-3 text-5xl md:text-6xl lg:text-8xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
              즉시 현금 매입
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-medium transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            에르메스, 샤넬, 루이비통 등 명품 가방을
            <br className="hidden md:block" />
            <span className="text-2xl md:text-3xl font-bold text-blue-600">집에서 편하게</span> 감정받고 <span className="text-2xl md:text-3xl font-bold text-purple-600">즉시 현금</span>으로
          </p>
          
          {/* 가격 강조 */}
          <div className={`flex justify-center items-center gap-4 mb-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-bounce">
              최고가 보장
            </div>
            <div className="text-2xl">+</div>
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-bounce delay-100">
              수수료 0원
            </div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className={`flex flex-col sm:flex-row justify-center gap-4 mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a
            href="#reservation"
            onClick={() => sendGAEvent('cta_click', 'engagement', 'hero_main_cta')}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 ease-out bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              무료 출장 감정 신청하기
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
          
          <a
            href="tel:02-1234-5678"
            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            전화 상담하기
          </a>
        </div>

        {/* 특징 카드 - 개선된 디자인 */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              ),
              gradient: 'from-blue-500 to-cyan-500',
              title: '편리한 출장 서비스',
              description: '전문 감정사가 직접 방문하여 편안하게 감정받으실 수 있습니다',
              badge: '서울/경기 전지역'
            },
            {
              icon: (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              ),
              gradient: 'from-green-500 to-emerald-500',
              title: '즉시 현금 지급',
              description: '감정 후 매입 결정시 그 자리에서 현금으로 즉시 지급합니다',
              badge: '최고가 보장'
            },
            {
              icon: (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ),
              gradient: 'from-purple-500 to-pink-500',
              title: '투명한 감정 과정',
              description: '일본 최대 리유스 기업의 노하우로 정확하고 공정한 감정을 약속합니다',
              badge: '15년+ 전문성'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden delay-${index * 200}`}
            >
              {/* 배경 그라데이션 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* 뱃지 */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}>
                  {feature.badge}
                </span>
              </div>
              
              {/* 아이콘 */}
              <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* 내용 */}
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              
              {/* 호버 효과 화살표 */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}