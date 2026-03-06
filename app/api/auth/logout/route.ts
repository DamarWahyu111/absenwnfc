import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'
import { ApiResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    await clearAuthCookie()

    return NextResponse.json(
      {
        success: true,
        message: 'Logout berhasil',
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' } as ApiResponse,
      { status: 500 }
    )
  }
}
