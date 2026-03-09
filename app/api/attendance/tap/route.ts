import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ApiResponse } from '@/lib/types'

// Store last tap time per NFC UID to prevent double tap
const lastTapTime = new Map<string, number>()
const TAP_DELAY_MS = 3000 // 3 seconds

export async function POST(request: NextRequest) {
  try {
    const { nfc_uid } = await request.json()

    if (!nfc_uid) {
      return NextResponse.json(
        { success: false, error: 'NFC UID diperlukan' } as ApiResponse,
        { status: 400 }
      )
    }

    // Check double tap prevention
    const now = Date.now()
    const lastTap = lastTapTime.get(nfc_uid) || 0

    if (now - lastTap < TAP_DELAY_MS) {
      return NextResponse.json(
        {
          success: false,
          error: `Tunggu ${Math.ceil((TAP_DELAY_MS - (now - lastTap)) / 1000)} detik sebelum tap lagi`,
        } as ApiResponse,
        { status: 429 }
      )
    }

    // Update last tap time
    lastTapTime.set(nfc_uid, now)

    // Find user by NFC UID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('nfc_uid', nfc_uid)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Kartu NFC tidak ditemukan' } as ApiResponse,
        { status: 404 }
      )
    }

    // Get today's date
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })

    // Check if attendance record exists for today
    const { data: existingAttendance } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    let status = 'checked_in'
    let attendanceRecord

    if (!existingAttendance) {
      const { data, error } = await supabase
        .from('attendance')
        .insert([
          {
            user_id: user.id,
            date: today,
            check_in: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().replace('Z', ''),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('[v0] Attendance insert error:', error)
        return NextResponse.json(
          { success: false, error: 'Gagal mencatat absensi' } as ApiResponse,
          { status: 500 }
        )
      }

      attendanceRecord = data
    } else if (existingAttendance.check_in && !existingAttendance.check_out) {
      const { data, error } = await supabase
        .from('attendance')
        .update({
          check_out: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().replace('Z', ''),
        })
        .eq('id', existingAttendance.id)
        .select()
        .single()

      if (error) {
        console.error('[v0] Attendance update error:', error)
        return NextResponse.json(
          { success: false, error: 'Gagal mencatat absensi' } as ApiResponse,
          { status: 500 }
        )
      }

      status = 'checked_out'
      attendanceRecord = data
    } else {
      // Already checked out, cannot check in/out again
      return NextResponse.json(
        {
          success: false,
          error: 'Anda sudah check-out hari ini. Silakan check-in besok.',
        } as ApiResponse,
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: status === 'checked_in' ? 'Check-in berhasil' : 'Check-out berhasil',
        data: {
          status,
          checkInTime: attendanceRecord.check_in,
          checkOutTime: attendanceRecord.check_out,
        },
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Attendance tap error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' } as ApiResponse,
      { status: 500 }
    )
  }
}
