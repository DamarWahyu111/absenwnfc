'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2, Smartphone, Users } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  nfc_uid: string | null
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchUsers = async (pageNum: number = 0, searchTerm: string = '') => {
    try {
      const params = new URLSearchParams()
      params.set('limit', '20')
      params.set('offset', String(pageNum * 20))
      if (searchTerm) params.set('search', searchTerm)

      const res = await fetch('/api/admin/users?' + params)

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push('/auth/login')
        } else {
          setError('Gagal memuat data pengguna')
        }
        return
      }

      const data = await res.json()

      if (pageNum === 0) {
        setUsers(data.data?.users || [])
        setTotal(data.data?.total || 0)
      } else {
        setUsers((prev) => [...prev, ...(data.data?.users || [])])
      }

      setHasMore((data.data?.users || []).length === 20)
    } catch (err) {
      console.error('[v0] Users fetch error:', err)
      setError('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(0, search)
  }, [router])

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    setPage(0)
    setUsers([])
    setLoading(true)
    fetchUsers(0, searchTerm)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchUsers(nextPage, search)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Admin" isAdmin={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kelola Pengguna</h1>
          <p className="text-muted-foreground">Total: {total} pengguna terdaftar</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex gap-2 items-start mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cari Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="search"
              placeholder="Cari berdasarkan nama atau email..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada pengguna ditemukan</p>
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
                    <th className="text-left py-3 px-4 font-semibold text-sm">NFC Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Terdaftar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4 text-sm">
                        {user.nfc_uid ? (
                          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full w-fit text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="font-medium">Terdaftar</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full w-fit text-xs">
                            <Smartphone className="w-3 h-3" />
                            <span className="font-medium">Belum Terdaftar</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
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
          <Link href="/admin/attendance">
            <Button>Lihat Riwayat Absensi</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
