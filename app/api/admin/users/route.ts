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

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - admin access required' } as ApiResponse,
        { status: 403 }
      )
    }

    // Get query parameters for pagination and search
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''

    let query = supabase
      .from('users')
      .select('id, name, email, nfc_uid, role, created_at')
      .order('created_at', { ascending: false })

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Get total count
    const { count } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })

    // Get paginated results
    const { data: users, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error('[v0] Admin users error:', error)
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data' } as ApiResponse,
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          users,
          total: count,
          limit,
          offset,
        },
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Admin users error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' } as ApiResponse,
      { status: 500 }
    )
  }
}
