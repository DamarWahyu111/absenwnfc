'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock, LogIn, LogOut, Smartphone } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  nfc_uid: string | null
  role: string
}

interface AttendanceRecord {
  date: string
  check_in: string | null
  check_out: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const checkRes = await fetch('/api/attendance/history?limit=1')

        if (!checkRes.ok) {
          router.push('/auth/login')
          return
        }

        const params = new URLSearchParams()
        params.set('limit', '1')

        const historyRes = await fetch('/api/attendance/history?' + params)
        const historyData = await historyRes.json()

        if (historyRes.ok && historyData.data && historyData.data.length > 0) {
          const today = new Date().toISOString().split('T')[0]
          const todayRecord = historyData.data.find((r: AttendanceRecord) => r.date === today)
          if (todayRecord) {
            setTodayAttendance(todayRecord)
          }
        }

        // Get user data from localStorage (set during login)
        const userRes = await fetch('/api/user/me')
        if (userRes.ok) {
          const userData = await userRes.json()
          if (userData.data) {
            setUser(userData.data)
            localStorage.setItem('user', JSON.stringify(userData.data)) // update localStorage juga
          }
        }
      } catch (err) {
        console.error('[v0] Dashboard fetch error:', err)
        setError('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
            <div className="h-40 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={user?.name || 'User'} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Kelola absensi dan kartu NFC Anda</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex gap-2 items-start mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* NFC Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Status Kartu NFC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.nfc_uid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Kartu Terdaftar</p>
                      <p className="text-sm text-green-700 mt-1">UID: {user.nfc_uid}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-semibold text-yellow-900">Belum Ada Kartu NFC</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Silakan daftarkan kartu NFC Anda terlebih dahulu
                  </p>
                </div>
              )}

              <Link href="/dashboard/bind-nfc">
                <Button variant="outline" className="w-full">
                  {user?.nfc_uid ? 'Ganti Kartu NFC' : 'Daftar Kartu NFC'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Today's Attendance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Absensi Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAttendance ? (
                <div className="space-y-3">
                  {todayAttendance.check_in && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Check-In</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {new Date(todayAttendance.check_in).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'Asia/Jakarta',
                        })}
                      </span>
                    </div>
                  )}

                  {todayAttendance.check_out && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Check-Out</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {new Date(todayAttendance.check_out).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'Asia/Jakarta',
                        })}
                      </span>
                    </div>
                  )}

                  {todayAttendance.check_in && !todayAttendance.check_out && (
                    <p className="text-sm text-muted-foreground text-center">
                      Sudah check-in. Tap kartu untuk check-out.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-3">Belum ada absensi hari ini</p>
                  {user?.nfc_uid && (
                    <p className="text-sm text-muted-foreground">
                      Tap kartu NFC Anda untuk check-in
                    </p>
                  )}
                </div>
              )}

              {user?.nfc_uid && (
                <Link href="/dashboard/attendance">
                  <Button className="w-full">Tap NFC untuk Absen</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Absensi Terbaru</CardTitle>
            <CardDescription>5 absensi terakhir Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/history">
              <Button variant="outline">Lihat Semua Riwayat</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
