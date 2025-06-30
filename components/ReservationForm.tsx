// ReservationForm 컴포넌트 - 방문 매입 신청 폼
'use client'

import { useState, useEffect } from 'react'

interface FormData {
  name: string
  phone: string
  category: string
  area: string
  images: File[]
}

interface FormStep {
  id: number
  title: string
  fields: (keyof FormData)[]
}

export default function ReservationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    category: '',
    area: '',
    images: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set())
  const [showSuccess, setShowSuccess] = useState(false)
  
  // 폼 단계 정의
  const formSteps: FormStep[] = [
    { id: 1, title: '연락처 정보', fields: ['name', 'phone'] },
    { id: 2, title: '제품 정보', fields: ['category', 'area'] },
    { id: 3, title: '사진 업로드', fields: ['images'] }
  ]
  
  const totalSteps = formSteps.length
  const completedFields = Object.entries(formData).filter(
    ([key, value]) => key !== 'images' ? value !== '' : (value as File[]).length > 0
  ).length
  const progress = (completedFields / 5) * 100

  // 브랜드 카테고리 (인기도 순)
  const categories = [
    { value: '에르메스 가방', label: '에르메스', popular: true },
    { value: '샤넬 가방', label: '샤넬', popular: true },
    { value: '루이비통 가방', label: '루이비통', popular: true },
    { value: '구찌 가방', label: '구찌', popular: false },
    { value: '프라다 가방', label: '프라다', popular: false },
    { value: '발렌시아가 가방', label: '발렌시아가', popular: false },
    { value: '셀린느 가방', label: '셀린느', popular: false },
    { value: '디올 가방', label: '디올', popular: false },
    { value: '기타 명품 가방', label: '기타 브랜드', popular: false }
  ]

  // 지역 옵션 (그룹화)
  const areaGroups = {
    '서울특별시': [
      { value: '서울 강남구', label: '강남구', popular: true },
      { value: '서울 서초구', label: '서초구', popular: true },
      { value: '서울 송파구', label: '송파구', popular: true },
      { value: '서울 강동구', label: '강동구', popular: false },
      { value: '서울 용산구', label: '용산구', popular: false },
      { value: '서울 마포구', label: '마포구', popular: false },
      { value: '서울 기타 지역', label: '기타 지역', popular: false }
    ],
    '경기도': [
      { value: '경기도 성남시', label: '성남시', popular: true },
      { value: '경기도 용인시', label: '용인시', popular: false },
      { value: '경기도 수원시', label: '수원시', popular: false },
      { value: '경기도 기타 지역', label: '기타 지역', popular: false }
    ]
  }

  // 실시간 유효성 검증
  const validateField = (field: keyof FormData, value: any): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return '이름을 입력해주세요'
        if (value.length < 2) return '이름은 2자 이상이어야 합니다'
        return undefined
      
      case 'phone':
        const cleanPhone = value.replace(/[\s-]/g, '')
        if (!cleanPhone) return '전화번호를 입력해주세요'
        if (!/^(\+82|0)\d{9,11}$/.test(cleanPhone)) {
          return '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'
        }
        return undefined
      
      case 'category':
        if (!value) return '브랜드를 선택해주세요'
        return undefined
      
      case 'area':
        if (!value) return '지역을 선택해주세요'
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
        newErrors[field as keyof FormData] = error as any
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // 필드 변경 처리
  const handleFieldChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value })
    setTouchedFields(new Set([...touchedFields, field]))
    
    // 실시간 검증
    if (touchedFields.has(field)) {
      const error = validateField(field, value)
      setErrors({ ...errors, [field]: error as any })
    }
  }
  
  // 전화번호 자동 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  // 이미지 처리 (드래그 앤 드롭 지원)
  const [isDragging, setIsDragging] = useState(false)
  const [imagePreview, setImagePreview] = useState<string[]>([])
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processImages(files)
  }
  
  const processImages = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
      if (!isValid && file.size > 10 * 1024 * 1024) {
        alert(`${file.name}은(는) 10MB를 초과합니다.`)
      }
      return isValid
    })
    
    // 미리보기 생성
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
    
    setFormData({ ...formData, images: [...formData.images, ...validFiles] })
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    processImages(files)
  }
  
  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
    setImagePreview(newPreviews)
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // FormData 생성
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('phone', formData.phone)
      submitData.append('category', formData.category)
      submitData.append('area', formData.area)
      
      // 이미지 추가
      formData.images.forEach((image, index) => {
        submitData.append(`image${index}`, image)
      })
      
      // UTM 파라미터 추가
      const urlParams = new URLSearchParams(window.location.search)
      submitData.append('utm_source', urlParams.get('utm_source') || 'direct')
      submitData.append('utm_medium', urlParams.get('utm_medium') || 'none')
      submitData.append('utm_campaign', urlParams.get('utm_campaign') || 'none')
      
      // API 호출
      const response = await fetch('/api/lead', {
        method: 'POST',
        body: submitData
      })
      
      if (response.ok) {
        // 성공 애니메이션 표시
        setShowSuccess(true)
        setTimeout(() => {
          window.location.href = '/thanks'
        }, 1500)
      } else {
        throw new Error('제출 실패')
      }
    } catch (error) {
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
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
      
      <div className="container mx-auto px-4 max-w-4xl relative">
        <div className="text-center mb-12">
          {/* 성공 애니메이션 */}
          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
              <div className="bg-white rounded-3xl p-8 shadow-2xl animate-bounce">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900">신청이 완료되었습니다!</h3>
                <p className="text-gray-600 mt-2">잠시만 기다려주세요...</p>
              </div>
            </div>
          )}
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            무료 출장 감정 신청
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            아래 정보를 입력하시면 24시간 내에 연락드립니다
          </p>
          
          {/* 프로그레스 바 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                입력 진행율: {Math.round(progress)}%
              </span>
              <span className="text-sm text-gray-500">
                {completedFields}/5 항목 완료
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* 단계 표시 */}
          <div className="flex justify-center items-center gap-4 mb-8">
            {formSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                    ${currentStep === step.id ? 'bg-blue-600 text-white scale-110' : 
                      currentStep > step.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                  `}
                >
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                {index < formSteps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Step 1: 연락처 정보 */}
          <div className={`space-y-6 ${currentStep !== 1 ? 'hidden' : ''}`}>
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
                <p className="mt-2 text-sm text-red-600 animate-slide-up">{errors.name}</p>
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
                <p className="mt-2 text-sm text-red-600 animate-slide-up">{errors.phone}</p>
              )}
            </div>
            
            {/* 다음 버튼 */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (formData.name && formData.phone && !errors.name && !errors.phone) {
                    setCurrentStep(2)
                  } else {
                    setTouchedFields(new Set(['name', 'phone']))
                    validateForm()
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                다음 단계 →
              </button>
            </div>
          </div>

          {/* Step 2: 제품 정보 */}
          <div className={`space-y-6 ${currentStep !== 2 ? 'hidden' : ''}`}>
            {/* 브랜드 선택 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                브랜드 선택 *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleFieldChange('category', cat.value)}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-200 text-center
                      ${formData.category === cat.value 
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
                    `}
                  >
                    {cat.popular && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        인기
                      </span>
                    )}
                    <span className={`font-medium ${
                      formData.category === cat.value ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
              {errors.category && touchedFields.has('category') && (
                <p className="mt-2 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* 지역 선택 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                지역 선택 *
              </label>
              {Object.entries(areaGroups).map(([region, areas]) => (
                <div key={region} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{region}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {areas.map((area) => (
                      <button
                        key={area.value}
                        type="button"
                        onClick={() => handleFieldChange('area', area.value)}
                        className={`
                          relative p-3 rounded-lg border-2 transition-all duration-200 text-sm
                          ${formData.area === area.value 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        {area.popular && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                        <span className={`${
                          formData.area === area.value ? 'text-blue-600 font-medium' : 'text-gray-700'
                        }`}>
                          {area.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {errors.area && touchedFields.has('area') && (
                <p className="mt-2 text-sm text-red-600">{errors.area}</p>
              )}
            </div>

            {/* 버튼 그룹 */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={() => {
                  if (formData.category && formData.area) {
                    setCurrentStep(3)
                  } else {
                    setTouchedFields(new Set([...touchedFields, 'category', 'area']))
                    validateForm()
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                다음 단계 →
              </button>
            </div>
          </div>

          {/* Step 3: 사진 업로드 */}
          <div className={`space-y-6 ${currentStep !== 3 ? 'hidden' : ''}`}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                상품 사진 (선택사항)
              </label>
              
              {/* 드래그 앤 드롭 영역 */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'}
                `}
              >
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <p className="text-gray-600 mb-2">
                  클릭하거나 파일을 드래그하여 업로드하세요
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG 형식 (최대 10MB)
                </p>
              </div>

              {/* 이미지 미리보기 */}
              {imagePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`상품 이미지 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 개인정보 동의 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">📌 개인정보 처리 안내</h4>
              <p className="text-sm text-gray-600">
                제출하신 정보는 출장 감정 서비스 제공을 위해서만 사용되며, 
                관련 법령에 따라 안전하게 보호됩니다.
              </p>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                ← 이전
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-10 py-4 font-bold rounded-xl transition-all duration-200 transform
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 active:scale-100'}
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    제출 중...
                  </span>
                ) : '무료 출장 감정 신청하기 🚀'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}