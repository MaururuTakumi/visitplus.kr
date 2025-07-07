// 메인 랜딩 페이지
import Hero from '@/components/Hero'
import TrustBadges from '@/components/TrustBadges'
import ReservationForm from '@/components/ReservationForm'
import FAQ from '@/components/FAQ'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 헤더 네비게이션 */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">VisitPlus</h1>
              <span className="ml-2 text-sm text-gray-600">명품 출장 매입</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#reservation" className="text-gray-700 hover:text-blue-600 transition-colors">
                감정 신청
              </a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">
                자주 묻는 질문
              </a>
            </nav>
            {/* 모바일 CTA */}
            <a
              href="#reservation"
              className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              문의하기
            </a>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="pt-16"> {/* 고정 헤더 높이만큼 패딩 */}
        <Hero />
        <TrustBadges />
        <ReservationForm />
        <FAQ />
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* 회사 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">VisitPlus Korea</h3>
              <p className="text-gray-400 text-sm">
                명품 출장 감정 전문 서비스
                <br />
                명품 출장 감정 및 즉시 매입
              </p>
            </div>
            
            {/* 연락처 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">연락처</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>문의: 상단 문의 양식을 이용해주세요</p>
                <p>영업시간: 평일 10:00 - 19:00</p>
                <p>연락처: 문의 제출 후 연락드립니다</p>
              </div>
            </div>
            
            {/* 법적 고지 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">고객 안내</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>사업자등록번호: 123-45-67890</p>
                <p>대표: 하야시 타쿠미</p>
                <p>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 VisitPlus Korea. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}