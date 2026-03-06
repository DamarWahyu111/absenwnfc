'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, QrCode, Users, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is logged in by trying to fetch a protected endpoint
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/attendance/history?limit=1')
        setIsLoggedIn(res.ok)
      } catch {
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="font-bold text-lg">NFC Attendance System</div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/auth/login">
                <Button>Logout</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Selamat Datang!</h1>
            <p className="text-xl text-muted-foreground">Silakan lanjutkan ke dashboard Anda</p>
          </div>

          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Buka Dashboard
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-lg text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            NFC Attendance System
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Sistem Absensi NFC
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Teknologi modern untuk mencatat kehadiran dengan cepat dan akurat menggunakan kartu
              NFC
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="px-8">
                Mulai Sekarang
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="px-8">
                Masuk Akun
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Cepat & Akurat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Pencatatan absensi instan dengan teknologi NFC terkini
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle className="text-white">Multi User</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Support untuk puluhan hingga ratusan pengguna sekaligus
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <QrCode className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle className="text-white">Kartu NFC</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Setiap pengguna dapat mengikat kartu NFC pribadi mereka
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Smartphone className="w-8 h-8 text-orange-500 mb-2" />
              <CardTitle className="text-white">Mobile Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Kompatibel dengan Android dan iOS untuk kemudahan akses
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="py-12 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Cara Kerja</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Daftar Akun</h3>
              <p className="text-slate-300">
                Buat akun baru dengan email dan password Anda
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ikat Kartu NFC</h3>
              <p className="text-slate-300">
                Ikatkan kartu NFC Anda ke akun untuk mulai mengabsen
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Mulai Absen</h3>
              <p className="text-slate-300">
                Tap kartu NFC untuk check-in dan check-out setiap hari
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center border-t border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-4">Siap Memulai?</h2>
          <p className="text-slate-300 mb-8">
            Bergabunglah dengan sistem absensi NFC dan tingkatkan efisiensi Anda
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="px-8">
              Daftar Sekarang
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 NFC Attendance System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
