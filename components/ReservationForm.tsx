// ReservationForm 컴포넌트 - 간소화된 문의 폼
'use client'

import { useState, useEffect } from 'react'
import { sendGAEvent } from './GoogleAnalytics'

interface FormData {
  name: string
  email: string
  phone: string
}

export default function ReservationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set())
  const [showSuccess, setShowSuccess] = useState(false)
  
  // 실시간 유효성 검증
  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return '이름을 입력해주세요'
        if (value.length < 2) return '이름은 2자 이상이어야 합니다'
        return undefined
      
      case 'email':
        if (!value.trim()) return '이메일을 입력해주세요'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return '올바른 이메일 형식이 아닙니다'
        return undefined
      
      case 'phone':
        const cleanPhone = value.replace(/[\s-]/g, '')
        if (!cleanPhone) return '전화번호를 입력해주세요'
        if (!/^(\+82|0)\d{9,11}$/.test(cleanPhone)) {
          return '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'
        }
        return undefined
      
      default:
        return undefined
    }
  }
  
  // 폼 유효성 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}
    
    Object.keys(formData).forEach((field) => {
      const error = validateField(field as keyof FormData, formData[field as keyof FormData])
      if (error) {
        newErrors[field as keyof FormData] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // 필드 변경 처리
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
    setTouchedFields(new Set([...touchedFields, field]))
    
    // 실시간 검증
    if (touchedFields.has(field)) {
      const error = validateField(field, value)
      setErrors({ ...errors, [field]: error })
    }
  }
  
  // 전화번호 자동 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setTouchedFields(new Set(['name', 'email', 'phone']))
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // UTM 파라미터 추가
      const urlParams = new URLSearchParams(window.location.search)
      const submitData = {
        ...formData,
        utm_source: urlParams.get('utm_source') || 'direct',
        utm_medium: urlParams.get('utm_medium') || 'none',
        utm_campaign: urlParams.get('utm_campaign') || 'none'
      }
      
      // API 호출
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })
      
      if (response.ok) {
        // 성공 애니메이션 표시
        setShowSuccess(true)
        
        // GA4 전환 이벤트 전송
        sendGAEvent('form_submit', 'conversion', 'contact_form')
        sendGAEvent('lead_generated', 'conversion', 'demand_validation', 1)
        
        // GTM 데이터레이어 푸시
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'lead_form_success',
            utm_source: urlParams.get('utm_source') || 'direct'
          })
        }
        
        setTimeout(() => {
          window.location.href = '/thanks'
        }, 1500)
      } else {
        throw new Error('제출 실패')
      }
    } catch (error) {
      alert('문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="reservation" className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 max-w-2xl relative">
        <div className="text-center mb-12">
          {/* 성공 애니메이션 */}
          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
              <div className="bg-white rounded-3xl p-8 shadow-2xl animate-bounce">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900">문의가 접수되었습니다!</h3>
                <p className="text-gray-600 mt-2">빠른 시일 내에 연락드리겠습니다.</p>
              </div>
            </div>
          )}
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            명품 출장 감정 문의
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            연락처를 남겨주시면 상담원이 직접 연락드립니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="space-y-6">
            {/* 이름 입력 */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                이름 *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                    errors.name && touchedFields.has('name') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
                  placeholder="홍길동"
                />
                {formData.name && !errors.name && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.name && touchedFields.has('name') && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* 이메일 입력 */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                이메일 *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                    errors.email && touchedFields.has('email')
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
                  placeholder="example@email.com"
                />
                {formData.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && touchedFields.has('email') && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 전화번호 입력 */}
            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3">
                전화번호 *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    handleFieldChange('phone', formatted)
                  }}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                    errors.phone && touchedFields.has('phone')
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
                  placeholder="010-1234-5678"
                  maxLength={13}
                />
                {formData.phone && !errors.phone && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.phone && touchedFields.has('phone') && (
                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* 안내 메시지 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600">
                문의 내용을 확인 후 빠른 시일 내에 연락드리겠습니다.
                명품 출장 감정 서비스에 대해 자세히 안내해드립니다.
              </p>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full px-10 py-4 font-bold rounded-xl transition-all duration-200 transform
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 active:scale-100'}
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    제출 중...
                  </span>
                ) : '문의하기'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}