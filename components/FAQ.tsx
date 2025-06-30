// FAQ 컴포넌트 - 자주 묻는 질문
'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "출장 감정 서비스는 정말 무료인가요?",
      answer: "네, 출장 감정은 완전 무료입니다. 감정 후 매입을 원하지 않으시면 부담 없이 거절하실 수 있으며, 어떠한 비용도 청구되지 않습니다."
    },
    {
      question: "어떤 브랜드의 제품을 매입하나요?",
      answer: "에르메스, 샤넬, 루이비통, 구찌, 프라다, 발렌시아가, 셀린느, 디올 등 주요 명품 브랜드의 가방을 매입합니다. 그 외 브랜드도 상태에 따라 매입 가능하니 문의해주세요."
    },
    {
      question: "감정 후 바로 현금을 받을 수 있나요?",
      answer: "네, 감정 후 매입에 동의하시면 그 자리에서 현금으로 즉시 지급해드립니다. 고액의 경우 계좌이체도 가능합니다."
    },
    {
      question: "상품 상태가 좋지 않아도 매입 가능한가요?",
      answer: "사용감이 있거나 약간의 손상이 있어도 매입 가능합니다. 전문 감정사가 상품의 상태를 종합적으로 평가하여 공정한 가격을 제시해드립니다."
    },
    {
      question: "출장 가능 지역은 어디인가요?",
      answer: "현재 서울 전 지역과 경기도 일부 지역(성남, 용인, 수원 등)에서 서비스를 제공하고 있습니다. 지역은 계속 확대 중이니 문의해주세요."
    },
    {
      question: "감정 시간은 얼마나 걸리나요?",
      answer: "일반적으로 제품 1개당 10-15분 정도 소요됩니다. 여러 개의 제품을 감정하실 경우에도 최대한 신속하게 진행해드립니다."
    },
    {
      question: "개인정보는 안전하게 보호되나요?",
      answer: "고객님의 개인정보는 관련 법령에 따라 엄격하게 보호되며, 서비스 제공 목적 외에는 절대 사용되지 않습니다. 일본 본사의 개인정보보호 인증을 받은 시스템을 사용합니다."
    },
    {
      question: "정품 인증서가 없어도 매입 가능한가요?",
      answer: "네, 정품 인증서가 없어도 전문 감정사의 검증을 통해 매입 가능합니다. 다만 인증서가 있으면 더 좋은 가격을 받으실 수 있습니다."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-lg text-gray-600">
            궁금하신 점이 있으시면 언제든지 문의해주세요
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 추가 문의 안내 */}
        <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            더 궁금하신 점이 있으신가요?
          </h3>
          <p className="text-gray-600 mb-4">
            카카오톡 또는 전화로 편하게 문의해주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://pf.kakao.com/_xXxXxX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <span className="mr-2">💬</span>
              카카오톡 문의
            </a>
            <a
              href="tel:02-1234-5678"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <span className="mr-2">📞</span>
              02-1234-5678
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}