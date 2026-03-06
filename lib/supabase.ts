import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      programs: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          password: string
          nfc_uid: string | null
          program_id: string | null
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password: string
          nfc_uid?: string | null
          program_id?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password?: string
          nfc_uid?: string | null
          program_id?: string | null
          role?: string
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          date: string
          check_in: string | null
          check_out: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
        }
      }
    }
  }
}
