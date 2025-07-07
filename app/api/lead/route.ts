// Edge API Route - Google Sheets/HubSpot 리드 생성
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
    // JSON 데이터 파싱
    const data = await request.json()
    
    // 필수 필드 추출
    const { name, email, phone, utm_source, utm_medium, utm_campaign } = data
    
    // 유효성 검증
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    // Google Sheets에 데이터 전송
    const googleSheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    
    if (googleSheetsWebhookUrl) {
      try {
        const sheetsResponse = await fetch(googleSheetsWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            utm_source: utm_source || 'direct',
            utm_medium: utm_medium || 'none',
            utm_campaign: utm_campaign || 'none'
          })
        })
        
        if (!sheetsResponse.ok) {
          console.error('Google Sheets API error:', await sheetsResponse.text())
        }
      } catch (sheetsError) {
        console.error('Google Sheets submission error:', sheetsError)
        // Google Sheets 실패는 전체 프로세스를 중단시키지 않음
      }
    }
    
    // HubSpot API (옵션)
    const hubspotApiKey = process.env.HUBSPOT_API_KEY
    
    if (hubspotApiKey && hubspotApiKey !== 'dummy_hubspot_api_key_for_development') {
      try {
        const contactData = {
          properties: {
            firstname: name,
            email: email,
            phone: phone,
            utm_source: utm_source || 'direct',
            utm_medium: utm_medium || 'none',
            utm_campaign: utm_campaign || 'none',
            lead_source: 'Korea LP - Demand Validation',
            submission_date: new Date().toISOString()
          }
        }
        
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
          console.error('HubSpot API error:', await hubspotResponse.text())
        }
      } catch (hubspotError) {
        console.error('HubSpot submission error:', hubspotError)
      }
    }
    
    // Resend 이메일 발송 (옵션)
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (resendApiKey && email) {
      try {
        // 고객 확인 이메일
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'VisitPlus Korea <noreply@visitplus.kr>',
            to: email,
            subject: '[VisitPlus] 문의가 접수되었습니다',
            html: `
              <h2>안녕하세요 ${name}님,</h2>
              <p>VisitPlus 명품 출장 감정 서비스에 관심을 가져주셔서 감사합니다.</p>
              <p>빠른 시일 내에 ${phone}로 연락드려 자세한 안내를 드리겠습니다.</p>
              <br>
              <p>문의사항이 있으시면 언제든 연락주세요.</p>
              <p>감사합니다.</p>
            `
          })
        })
        
        // 내부 알림 이메일
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'VisitPlus System <system@visitplus.kr>',
            to: 'sales@visitplus.kr',
            subject: `[신규 문의] ${name}`,
            html: `
              <h2>새로운 문의</h2>
              <p><strong>고객 정보:</strong></p>
              <ul>
                <li>이름: ${name}</li>
                <li>이메일: ${email}</li>
                <li>전화: ${phone}</li>
                <li>UTM Source: ${utm_source || 'direct'}</li>
                <li>UTM Medium: ${utm_medium || 'none'}</li>
                <li>UTM Campaign: ${utm_campaign || 'none'}</li>
                <li>신청일시: ${new Date().toLocaleString('ko-KR')}</li>
              </ul>
            `
          })
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }
    
    // 성공 응답
    return NextResponse.json(
      {
        success: true,
        message: '문의가 접수되었습니다'
      },
      { status: 200, headers: corsHeaders }
    )
    
  } catch (error) {
    console.error('Lead submission error:', error)
    
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다' },
      { status: 500, headers: corsHeaders }
    )
  }
}