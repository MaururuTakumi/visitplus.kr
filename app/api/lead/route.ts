// Edge API Route - Supabase リード保存
import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Edge Runtime 設定
export const runtime = 'edge'

// CORS ヘッダー
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
    // JSON データ 파싱
    const data = await request.json()
    
    // 필수 필드 추출
    const { name, phone, utm_source, utm_medium, utm_campaign } = data
    
    // 유효성 검증
    if (!name || !phone) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    // IP 주소와 User Agent 추출
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'
    
    // Supabase에 데이터 저장 (설정된 경우에만)
    let submission = null
    if (isSupabaseConfigured()) {
      const { data: dbData, error } = await supabase
        .from('form_submissions')
        .insert([
          {
            name,
            phone,
            utm_source: utm_source || 'direct',
            utm_medium: utm_medium || 'none',
            utm_campaign: utm_campaign || 'none',
            ip_address,
            user_agent
          }
        ])
        .select()
        .single()
      
      if (error) {
        console.error('Supabase error:', error)
        // Supabase 에러는 로그만 남기고 계속 진행
        console.log('Supabase 설정 확인 필요')
      } else {
        submission = dbData
      }
    } else {
      console.log('Supabase가 설정되지 않음 - 로컬 로그로 기록')
      console.log('Lead data:', { name, phone, utm_source, utm_medium, utm_campaign })
    }
    
    // 선택적: 이메일 알림 (Resend API) - 현재 비활성화 (email 필드 없음)
    /*
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
                <li>IP: ${ip_address}</li>
              </ul>
              <p><a href="https://supabase.com/dashboard/project/_/editor/form_submissions">Supabase에서 확인</a></p>
            `
          })
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // 이메일 전송 실패는 전체 프로세스를 중단시키지 않음
      }
    }
    */
    
    // 성공 응답
    return NextResponse.json(
      {
        success: true,
        message: '문의가 접수되었습니다',
        id: submission?.id || 'local-' + Date.now()
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