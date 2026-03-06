import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'
import { ApiResponse, AuthResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, programId } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Nama, email, dan password diperlukan' } as ApiResponse,
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password minimal 6 karakter' } as ApiResponse,
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email sudah terdaftar' } as ApiResponse,
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Insert user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          program_id: programId || null,
          role: 'user',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[v0] Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Gagal membuat akun' } as ApiResponse,
        { status: 500 }
      )
    }

    // Create JWT token
    const token = await createToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    // Set cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Akun berhasil dibuat',
        data: {
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            nfc_uid: newUser.nfc_uid,
            program_id: newUser.program_id,
            role: newUser.role,
            created_at: newUser.created_at,
          },
        } as AuthResponse,
      } as ApiResponse<AuthResponse>,
      { status: 201 }
    )

    // Set auth cookie
    await setAuthCookie(token)

    return response
  } catch (error) {
    console.error('[v0] Register error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' } as ApiResponse,
      { status: 500 }
    )
  }
}
