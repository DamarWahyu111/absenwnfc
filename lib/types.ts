export interface User {
  id: string
  name: string
  email: string
  nfc_uid: string | null
  program_id: string | null
  role: 'user' | 'admin'
  created_at: string
}

export interface Program {
  id: string
  name: string
  created_at: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  date: string
  check_in: string | null
  check_out: string | null
  created_at: string
}

export interface AttendanceStatus {
  date: string
  hasCheckedIn: boolean
  hasCheckedOut: boolean
  checkInTime: string | null
  checkOutTime: string | null
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface AuthResponse {
  token: string
  user: User
}
