// Edge API Route - HubSpot 리드 생성 및 S3 이미지 업로드
import { NextRequest, NextResponse } from 'next/server'

// Edge Runtime 설정
export const runtime = 'edge'

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// OPTIONS 요청 처리
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

// POST 요청 처리
export async function POST(request: NextRequest) {
  try {
    // FormData 파싱
    const formData = await request.formData()
    
    // 필수 필드 추출
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const category = formData.get('category') as string
    const area = formData.get('area') as string
    
    // UTM 파라미터
    const utm_source = formData.get('utm_source') as string || 'direct'
    const utm_medium = formData.get('utm_medium') as string || 'none'
    const utm_campaign = formData.get('utm_campaign') as string || 'none'
    
    // 유효성 검증
    if (!name || !phone || !category || !area) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    // 이미지 처리 (S3 업로드 시뮬레이션)
    const imageUrls: string[] = []
    const imageFiles: File[] = []
    
    // FormData에서 이미지 파일 추출
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        imageFiles.push(value)
      }
    }
    
    // S3 Presigned URL 생성 및 업로드 (실제 구현시 AWS SDK 사용)
    for (const file of imageFiles) {
      // 실제로는 AWS S3 SDK를 사용하여 presigned URL 생성 및 업로드
      // 여기서는 시뮬레이션
      const simulatedUrl = `https://s3.ap-northeast-2.amazonaws.com/visitplus-kr/${Date.now()}-${file.name}`
      imageUrls.push(simulatedUrl)
    }
    
    // HubSpot API 요청 준비
    const hubspotApiKey = process.env.HUBSPOT_API_KEY
    
    if (!hubspotApiKey) {
      console.error('HubSpot API key not configured')
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500, headers: corsHeaders }
      )
    }
    
    // HubSpot Contact 생성 데이터
    const contactData = {
      properties: {
        firstname: name,
        phone: phone,
        // 커스텀 필드들 (HubSpot에서 미리 생성 필요)
        product_category: category,
        service_area: area,
        product_images: imageUrls.join(', '),
        utm_source: utm_source,
        utm_medium: utm_medium,
        utm_campaign: utm_campaign,
        lead_source: 'Korea LP',
        submission_date: new Date().toISOString()
      }
    }
    
    // HubSpot API 호출
    const hubspotResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hubspotApiKey}`
        },
        body: JSON.stringify(contactData)
      }
    )
    
    if (!hubspotResponse.ok) {
      const errorData = await hubspotResponse.text()
      console.error('HubSpot API error:', errorData)
      throw new Error('HubSpot API 오류')
    }
    
    const hubspotResult = await hubspotResponse.json()
    
    // Resend 이메일 발송 (환경변수 설정시)
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (resendApiKey) {
      try {
        // 고객 확인 이메일 발송
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'VisitPlus Korea <noreply@visitplus.kr>',
            to: 'customer@example.com', // 실제로는 고객 이메일 주소
            subject: '[VisitPlus] 출장 감정 신청이 접수되었습니다',
            html: `
              <h2>안녕하세요 ${name}님,</h2>
              <p>VisitPlus 출장 감정 서비스를 신청해주셔서 감사합니다.</p>
              <p>24시간 이내에 담당자가 ${phone}로 연락드릴 예정입니다.</p>
              <br>
              <p><strong>신청 정보:</strong></p>
              <ul>
                <li>브랜드: ${category}</li>
                <li>지역: ${area}</li>
                <li>신청일시: ${new Date().toLocaleString('ko-KR')}</li>
              </ul>
              <br>
              <p>문의사항이 있으시면 02-1234-5678로 연락주세요.</p>
              <p>감사합니다.</p>
            `
          })
        })
        
        // 내부 알림 이메일 발송
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'VisitPlus System <system@visitplus.kr>',
            to: 'sales@visitplus.kr',
            subject: `[신규 리드] ${name} - ${category}`,
            html: `
              <h2>새로운 출장 감정 신청</h2>
              <p><strong>고객 정보:</strong></p>
              <ul>
                <li>이름: ${name}</li>
                <li>전화: ${phone}</li>
                <li>브랜드: ${category}</li>
                <li>지역: ${area}</li>
                <li>이미지: ${imageUrls.length}개</li>
                <li>UTM Source: ${utm_source}</li>
                <li>UTM Medium: ${utm_medium}</li>
                <li>UTM Campaign: ${utm_campaign}</li>
              </ul>
              <p>HubSpot ID: ${hubspotResult.id}</p>
            `
          })
        })
      } catch (emailError) {
        // 이메일 전송 실패는 전체 프로세스를 중단시키지 않음
        console.error('Email sending error:', emailError)
      }
    }
    
    // 성공 응답
    return NextResponse.json(
      {
        success: true,
        message: '신청이 완료되었습니다',
        leadId: hubspotResult.id
      },
      { status: 200, headers: corsHeaders }
    )
    
  } catch (error) {
    // 에러 로깅 (Sentry 연동시)
    console.error('Lead submission error:', error)
    
    // 에러 응답
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다' },
      { status: 500, headers: corsHeaders }
    )
  }
}