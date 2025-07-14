import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase設定チェック
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co'
}

// フォームデータの型定義
export type FormSubmission = {
  id?: string
  name: string
  email: string
  phone: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  created_at?: string
  ip_address?: string
  user_agent?: string
}