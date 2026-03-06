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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '30')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get attendance history
    const { data: records, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', payload.userId)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[v0] Attendance history error:', error)
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data' } as ApiResponse,
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: records,
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Attendance history error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' } as ApiResponse,
      { status: 500 }
    )
  }
}
