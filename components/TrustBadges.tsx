// TrustBadges 컴포넌트 - 신뢰 지표 표시
'use client'

export default function TrustBadges() {
  const badges = [
    {
      metric: "15년+",
      label: "일본 리유스 업계 경력",
      description: "2009년 설립 이래 축적된 노하우"
    },
    {
      metric: "100만+",
      label: "누적 거래 건수",
      description: "일본 전역에서 신뢰받는 서비스"
    },
    {
      metric: "98%",
      label: "고객 만족도",
      description: "투명하고 공정한 감정으로 높은 만족도"
    },
    {
      metric: "24시간",
      label: "신속한 대응",
      description: "문의 후 24시간 이내 출장 일정 확정"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 섹션 타이틀 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            일본 최대 리유스 기업이 한국에 왔습니다
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            VisitPlus는 일본에서 15년간 쌓아온 신뢰와 전문성을 바탕으로 
            한국 고객님께 최고의 명품 매입 서비스를 제공합니다
          </p>
        </div>

        {/* 신뢰 지표 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {badge.metric}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {badge.label}
              </h3>
              <p className="text-sm text-gray-600">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* 인증 배지 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-2xl mb-2">🏢</div>
              <p className="text-sm text-gray-600">일본 고물영업 허가</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-sm text-gray-600">개인정보보호 인증</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🌐</div>
              <p className="text-sm text-gray-600">한국 사업자 등록</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🤝</div>
              <p className="text-sm text-gray-600">현지 파트너사 제휴</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}