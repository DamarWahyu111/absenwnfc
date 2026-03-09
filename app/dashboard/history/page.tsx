'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Calendar, Clock, LogIn, LogOut } from 'lucide-react'
import Link from 'next/link'

interface AttendanceRecord {
  id: string
  date: string
  check_in: string | null
  check_out: string | null
}

export default function HistoryPage() {
  const router = useRouter()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchHistory = async (pageNum: number = 0) => {
    try {
      const params = new URLSearchParams()
      params.set('limit', '30')
      params.set('offset', String(pageNum * 30))

      const res = await fetch('/api/attendance/history?' + params)

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login')
        } else {
          setError('Gagal memuat riwayat absensi')
        }
        return
      }

      const data = await res.json()

      if (pageNum === 0) {
        setRecords(data.data || [])
      } else {
        setRecords((prev) => [...prev, ...(data.data || [])])
      }

      setHasMore((data.data || []).length === 30)
    } catch (err) {
      console.error('[v0] History fetch error:', err)
      setError('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory(0)
  }, [router])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchHistory(nextPage)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '-'
    
    useEffect(() => {
      if (records.length > 0) {
        console.log('check_in raw:', JSON.stringify(records[0].check_in))
      }
    }, [records])

    const normalized = timeStr.endsWith('Z') ? timeStr : timeStr.replace(' ', 'T')
      ? timeStr
      : timeStr + 'Z'

    return new Date(timeStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    })
  }

  const calculateDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return '-'

    const inTime = new Date(checkIn).getTime()
    const outTime = new Date(checkOut).getTime()
    const diffMs = outTime - inTime

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Riwayat Absensi</h1>
          <p className="text-muted-foreground">Data check-in dan check-out Anda</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex gap-2 items-start mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Belum ada data absensi</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {records.map((record) => (
                <Card key={record.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                          Tanggal
                        </p>
                        <p className="text-sm font-medium">{formatDate(record.date)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                          <LogIn className="w-3 h-3 inline mr-1" />
                          Check-In
                        </p>
                        <p className="text-sm font-medium">{formatTime(record.check_in)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                          <LogOut className="w-3 h-3 inline mr-1" />
                          Check-Out
                        </p>
                        <p className="text-sm font-medium">{formatTime(record.check_out)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Durasi
                        </p>
                        <p className="text-sm font-medium">
                          {calculateDuration(record.check_in, record.check_out)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button onClick={handleLoadMore} variant="outline">
                  Muat Lebih Banyak
                </Button>
              </div>
            )}
          </>
        )}

        <div className="mt-6">
          <Link href="/dashboard">
            <Button variant="outline">Kembali ke Dashboard</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
