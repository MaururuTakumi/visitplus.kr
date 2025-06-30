// Hero 컴포넌트 - 메인 비주얼 및 핵심 가치 제안
'use client'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 메인 헤드라인 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            명품 출장 감정
            <span className="text-blue-600 block mt-2">즉시 현금 매입</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            에르메스, 샤넬, 루이비통 등 명품 가방을 
            <br className="hidden md:block" />
            집에서 편하게 감정받고 즉시 현금으로 판매하세요
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex justify-center gap-4 mb-16">
          <a
            href="#reservation"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            무료 출장 감정 신청하기
          </a>
        </div>

        {/* 특징 카드 */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-3">편리한 출장 서비스</h3>
            <p className="text-gray-600">
              전문 감정사가 직접 방문하여 편안하게 감정받으실 수 있습니다
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-3">즉시 현금 지급</h3>
            <p className="text-gray-600">
              감정 후 매입 결정시 그 자리에서 현금으로 즉시 지급합니다
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-3">투명한 감정 과정</h3>
            <p className="text-gray-600">
              일본 최대 리유스 기업의 노하우로 정확하고 공정한 감정을 약속합니다
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}