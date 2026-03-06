'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function BindNFCPage() {
  const router = useRouter()
  const [reading, setReading] = useState(false)
  const [binding, setBinding] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [nfcUid, setNfcUid] = useState('')

  const handleReadNFC = async () => {
    if (!('NDEFReader' in window)) {
      setError('NFC tidak didukung pada perangkat ini. Gunakan Android Chrome.')
      return
    }

    setReading(true)
    setError('')

    try {
      const ndef = new (window as any).NDEFReader()
      await ndef.scan()

      ndef.onreading = (event: any) => {
        const uid = event.serialNumber
        console.log('[v0] NFC UID read:', uid)
        setNfcUid(uid)
        setReading(false)
      }

      ndef.onreadingerror = () => {
        setError('Gagal membaca kartu NFC. Coba lagi.')
        setReading(false)
      }
    } catch (err) {
      console.error('[v0] NFC read error:', err)
      if ((err as any).name === 'NotAllowedError') {
        setError('Izin NFC ditolak. Aktifkan NFC di pengaturan Android.')
      } else {
        setError('Gagal membaca NFC. Pastikan NFC aktif dan coba lagi.')
      }
      setReading(false)
    }
  }

  const handleBindNFC = async () => {
    if (!nfcUid) {
      setError('Silakan baca kartu NFC terlebih dahulu')
      return
    }

    setBinding(true)
    setError('')

    try {
      const res = await fetch('/api/nfc/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nfc_uid: nfcUid }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal mengikat kartu NFC')
        setBinding(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError('Terjadi kesalahan saat mengikat kartu NFC')
      console.error('[v0] Bind NFC error:', err)
      setBinding(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <h2 className="text-2xl font-bold">Kartu NFC Berhasil Didaftar!</h2>
              <p className="text-sm text-muted-foreground text-center">
                Anda sekarang dapat menggunakan kartu ini untuk absensi. Anda akan dialihkan ke
                dashboard...
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Daftar Kartu NFC</h1>
          <p className="text-muted-foreground">
            Hubungkan kartu NFC Anda untuk sistem absensi
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex gap-2 items-start mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Baca Kartu NFC
            </CardTitle>
            <CardDescription>
              Gunakan perangkat Android dengan NFC untuk membaca kartu Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Persyaratan:</strong> Android 7.0+ dengan NFC dan Chrome browser
              </p>
            </div>

            {nfcUid ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Kartu Terdeteksi</p>
                    <p className="text-sm text-green-700 mt-1">UID: {nfcUid}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Tap kartu NFC Anda ke belakang telepon</p>
                <Button
                  onClick={handleReadNFC}
                  disabled={reading}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {reading ? 'Menunggu kartu NFC...' : 'Mulai Baca NFC'}
                </Button>
              </div>
            )}

            {nfcUid && (
              <div className="flex gap-3">
                <Button
                  onClick={handleBindNFC}
                  disabled={binding}
                  size="lg"
                  className="flex-1"
                >
                  {binding ? 'Menyimpan...' : 'Simpan Kartu NFC'}
                </Button>
                <Button
                  onClick={() => {
                    setNfcUid('')
                    setError('')
                  }}
                  variant="outline"
                  size="lg"
                >
                  Baca Ulang
                </Button>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Kembali
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
