import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { ApiResponse } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      )
    }

    // Get user data
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, nfc_uid, role, program_id, created_at')
      .eq('id', payload.userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' } as ApiResponse,
      { status: 500 }
    )
  }
}
