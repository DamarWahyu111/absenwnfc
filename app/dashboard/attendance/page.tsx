'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, LogIn, LogOut, Smartphone } from 'lucide-react'
import Link from 'next/link'

interface AttendanceResponse {
  status: 'checked_in' | 'checked_out'
  checkInTime: string
  checkOutTime: string | null
}

export default function AttendancePage() {
  const [tapping, setTapping] = useState(false)
  const [lastStatus, setLastStatus] = useState<AttendanceResponse | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleTapNFC = async () => {
    if (!('NDEFReader' in window)) {
      setError('NFC tidak didukung pada perangkat ini. Gunakan Android Chrome.')
      return
    }

    setTapping(true)
    setError('')
    setSuccess(false)

    try {
      const ndef = new (window as any).NDEFReader()
      await ndef.scan()

      ndef.onreading = async (event: any) => {
        const nfcUid = event.serialNumber
        console.log('[v0] NFC UID read for attendance:', nfcUid)

        // Send tap to server
        try {
          const res = await fetch('/api/attendance/tap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nfc_uid: nfcUid }),
          })

          const data = await res.json()

          if (!res.ok) {
            setError(data.error || 'Gagal mencatat absensi')
            setTapping(false)
            return
          }

          setLastStatus(data.data)
          setSuccess(true)
          setTapping(false)

          // Auto clear success message after 3 seconds
          setTimeout(() => {
            setSuccess(false)
            setLastStatus(null)
          }, 3000)
        } catch (err) {
          console.error('[v0] Attendance tap error:', err)
          setError('Terjadi kesalahan saat mencatat absensi')
          setTapping(false)
        }
      }

      ndef.onreadingerror = () => {
        setError('Gagal membaca kartu NFC. Coba lagi.')
        setTapping(false)
      }
    } catch (err) {
      console.error('[v0] NFC read error:', err)
      if ((err as any).name === 'NotAllowedError') {
        setError('Izin NFC ditolak. Aktifkan NFC di pengaturan Android.')
      } else {
        setError('Gagal membaca NFC. Pastikan NFC aktif dan coba lagi.')
      }
      setTapping(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tap untuk Absen</h1>
          <p className="text-muted-foreground">Tap kartu NFC Anda untuk check-in atau check-out</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex gap-2 items-start mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && lastStatus && (
          <div
            className={`${
              lastStatus.status === 'checked_in'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-green-50 border-green-200 text-green-800'
            } border px-4 py-3 rounded-md flex gap-2 items-start mb-6`}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              {lastStatus.status === 'checked_in' ? (
                <>
                  <p className="font-semibold">Check-In Berhasil!</p>
                  <p className="mt-1">
                    Waktu:{' '}
                    {new Date(lastStatus.checkInTime).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Check-Out Berhasil!</p>
                  <p className="mt-1">
                    Waktu:{' '}
                    {lastStatus.checkOutTime
                      ? new Date(lastStatus.checkOutTime).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : '-'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Baca Kartu NFC
            </CardTitle>
            <CardDescription>Tap kartu Anda ke belakang telepon untuk absensi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              {lastStatus?.status === 'checked_in' ? (
                <LogOut className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              ) : (
                <LogIn className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              )}
              <p className="text-muted-foreground mb-4">
                {lastStatus?.status === 'checked_in'
                  ? 'Tap kartu untuk check-out'
                  : 'Tap kartu NFC Anda ke belakang telepon'}
              </p>
              <Button
                onClick={handleTapNFC}
                disabled={tapping}
                size="lg"
                className="w-full sm:w-auto"
              >
                {tapping ? 'Menunggu kartu NFC...' : 'Mulai Tap NFC'}
              </Button>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Kembali ke Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/history">
                <Button variant="outline" className="w-full">
                  Lihat Riwayat Absensi
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
