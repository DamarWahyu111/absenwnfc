'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

interface AttendanceRecord {
  id: string
  date: string
  check_in: string | null
  check_out: string | null
  users: {
    id: string
    name: string
    email: string
  }
}

export default function AdminAttendancePage() {
  const router = useRouter()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchRecords = async (pageNum: number = 0) => {
    try {
      const params = new URLSearchParams()
      params.set('limit', '30')
      params.set('offset', String(pageNum * 30))
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)

      const res = await fetch('/api/admin/attendance?' + params)

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push('/auth/login')
        } else {
          setError('Gagal memuat data absensi')
        }
        return
      }

      const data = await res.json()

      if (pageNum === 0) {
        setRecords(data.data?.records || [])
        setTotal(data.data?.total || 0)
      } else {
        setRecords((prev) => [...prev, ...(data.data?.records || [])])
      }

      setHasMore((data.data?.records || []).length === 30)
    } catch (err) {
      console.error('[v0] Attendance fetch error:', err)
      setError('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords(0)
  }, [router])

  const handleFilter = () => {
    setPage(0)
    setRecords([])
    setLoading(true)
    fetchRecords(0)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchRecords(nextPage)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '-'
    return new Date(timeStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Admin" isAdmin={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Riwayat Absensi</h1>
          <p className="text-muted-foreground">Total: {total} catatan absensi</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex gap-2 items-start mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Dari Tanggal</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sampai Tanggal</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button onClick={handleFilter} className="w-full">
                  Terapkan Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada data absensi</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Nama</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Tanggal</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Check-In</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Check-Out</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const hasCheckOut = !!record.check_out
                    const statusLabel = hasCheckOut ? 'Complete' : 'Pending'
                    const statusColor = hasCheckOut ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'

                    return (
                      <tr key={record.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium">{record.users.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{record.users.email}</td>
                        <td className="py-3 px-4 text-sm">{formatDate(record.date)}</td>
                        <td className="py-3 px-4 text-sm">{formatTime(record.check_in)}</td>
                        <td className="py-3 px-4 text-sm">{formatTime(record.check_out)}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
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
          <Link href="/admin/users">
            <Button variant="outline">Kembali ke Kelola Pengguna</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
