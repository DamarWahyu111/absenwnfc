import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { ApiResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - no token' } as ApiResponse,
        { status: 401 }
      )
    }

    // Verify token
    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - invalid token' } as ApiResponse,
        { status: 401 }
      )
    }

    const { nfc_uid } = await request.json()

    if (!nfc_uid) {
      return NextResponse.json(
        { success: false, error: 'NFC UID diperlukan' } as ApiResponse,
        { status: 400 }
      )
    }

    // Check if NFC UID already used by another user
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('nfc_uid', nfc_uid)
      .single()

    if (existingUser && existingUser.id !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Kartu NFC sudah terdaftar ke akun lain' } as ApiResponse,
        { status: 409 }
      )
    }

    // Update user with NFC UID
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ nfc_uid })
      .eq('id', payload.userId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan kartu NFC' } as ApiResponse,
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Kartu NFC berhasil terdaftar',
        data: {
          nfc_uid: updatedUser.nfc_uid,
        },
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] NFC bind error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' } as ApiResponse,
      { status: 500 }
    )
  }
}
