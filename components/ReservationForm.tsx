// ReservationForm 컴포넌트 - 방문 매입 신청 폼
'use client'

import { useState } from 'react'

interface FormData {
  name: string
  phone: string
  category: string
  area: string
  images: File[]
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

  // 브랜드 카테고리
  const categories = [
    '에르메스 가방',
    '샤넬 가방',
    '루이비통 가방',
    '구찌 가방',
    '프라다 가방',
    '발렌시아가 가방',
    '셀린느 가방',
    '디올 가방',
    '기타 명품 가방'
  ]

  // 지역 옵션
  const areas = [
    '서울 강남구',
    '서울 서초구',
    '서울 송파구',
    '서울 강동구',
    '서울 용산구',
    '서울 마포구',
    '서울 기타 지역',
    '경기도 성남시',
    '경기도 용인시',
    '경기도 수원시',
    '경기도 기타 지역'
  ]

  // 폼 유효성 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요'
    } else if (!/^(\+82|0)\d{9,11}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다'
    }
    
    if (!formData.category) {
      newErrors.category = '브랜드를 선택해주세요'
    }
    
    if (!formData.area) {
      newErrors.area = '지역을 선택해주세요'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 이미지 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
      return isValid
    })
    
    setFormData({ ...formData, images: validFiles })
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
        // 성공시 감사 페이지로 이동
        window.location.href = '/thanks'
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
    <section id="reservation" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            무료 출장 감정 신청
          </h2>
          <p className="text-lg text-gray-600">
            아래 정보를 입력하시면 24시간 이내에 연락드립니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이름 입력 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="홍길동"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* 전화번호 입력 */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              전화번호 *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="010-1234-5678"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* 브랜드 선택 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              브랜드 선택 *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">브랜드를 선택하세요</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* 지역 선택 */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
              지역 선택 *
            </label>
            <select
              id="area"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">지역을 선택하세요</option>
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              상품 사진 (선택사항)
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              최대 10MB, JPG/PNG 형식 지원
            </p>
          </div>

          {/* 개인정보 동의 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              제출하신 정보는 출장 감정 서비스 제공을 위해서만 사용되며, 
              관련 법령에 따라 안전하게 보호됩니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 text-white font-semibold rounded-lg transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? '제출 중...' : '무료 출장 감정 신청하기'}
          </button>
        </form>
      </div>
    </section>
  )
}