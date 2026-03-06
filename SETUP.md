# NFC Attendance System - Setup Guide

## Persiapan Awal

### 1. Konfigurasi Environment Variables

Buat file `.env.local` di root project dengan konten berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zwqwhkfnuuoeayvwnghs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hplerZGOBlSBfKhC-RBWig_Z-vkF2nV

# JWT Secret (change this to a random string for production)
JWT_SECRET=your-super-secret-key-change-in-production
```

### 2. Setup Database Supabase

Buka Supabase SQL Editor dan jalankan script yang ada di `/scripts/setup-database.sql`:

```sql
-- Copy semua isi dari scripts/setup-database.sql
-- Paste ke Supabase SQL Editor
-- Klik "Run"
```

Atau langsung di Supabase Console:
1. Login ke [supabase.com](https://supabase.com)
2. Buka project Anda
3. Pergi ke SQL Editor
4. Klik "New Query"
5. Copy-paste isi dari `scripts/setup-database.sql`
6. Klik "Run"

### 3. Install Dependencies

```bash
npm install
# atau
pnpm install
```

### 4. Jalankan Development Server

```bash
npm run dev
# atau
pnpm dev
```

Akses aplikasi di `http://localhost:3000`

## Struktur Project

```
app/
├── page.tsx                          # Home page
├── auth/
│   ├── register/page.tsx            # Registration page
│   ├── login/page.tsx               # Login page
│   └── reset-password/page.tsx       # Password reset
├── dashboard/
│   ├── page.tsx                     # User dashboard
│   ├── attendance/page.tsx          # Tap NFC untuk absen
│   ├── bind-nfc/page.tsx            # Daftar kartu NFC
│   └── history/page.tsx             # Riwayat absensi
├── admin/
│   ├── users/page.tsx               # Kelola pengguna
│   └── attendance/page.tsx          # Riwayat absensi semua
└── api/
    ├── auth/
    │   ├── register/route.ts
    │   ├── login/route.ts
    │   └── logout/route.ts
    ├── nfc/
    │   └── bind/route.ts
    ├── attendance/
    │   ├── tap/route.ts
    │   └── history/route.ts
    ├── user/
    │   └── me/route.ts
    └── admin/
        ├── users/route.ts
        └── attendance/route.ts

lib/
├── supabase.ts                      # Supabase client
├── auth.ts                          # Auth utilities
├── nfc.ts                           # NFC utilities
└── types.ts                         # TypeScript types

middleware.ts                         # Route protection middleware

scripts/
└── setup-database.sql               # Database setup script
```

## Cara Penggunaan

### 1. Registrasi Pengguna

- Buka `/auth/register`
- Isi form dengan nama, email, dan password
- Klik "Daftar"

### 2. Login

- Buka `/auth/login`
- Masukkan email dan password
- Klik "Login"

### 3. Daftar Kartu NFC

- Pergi ke `/dashboard/bind-nfc`
- Klik "Mulai Baca NFC"
- Tap kartu NFC Anda ke belakang perangkat Android
- Klik "Simpan Kartu NFC"

### 4. Absensi dengan NFC

- Pergi ke `/dashboard/attendance`
- Klik "Mulai Tap NFC"
- Tap kartu NFC untuk check-in (pertama kali)
- Tap kartu NFC lagi untuk check-out

### 5. Lihat Riwayat Absensi

- Pergi ke `/dashboard/history`
- Lihat daftar absensi Anda dengan waktu check-in dan check-out

### 6. Admin Panel

- Admin dapat login dengan akun yang sudah dibuat admin role
- Pergi ke `/admin/users` untuk melihat semua pengguna
- Pergi ke `/admin/attendance` untuk melihat riwayat absensi semua pengguna

## NFC Compatibility

- **Device**: Android 7.0+
- **Browser**: Chrome (latest version)
- **Feature**: NFC capability
- **Card Type**: NFC Type 2 cards (ISO/IEC 14443 Type A)

## Database Schema

### users table
```sql
id (UUID)                  # Unique user ID
name (VARCHAR)            # User name
email (VARCHAR)           # User email (unique)
password (VARCHAR)        # Hashed password
nfc_uid (VARCHAR)         # NFC card UID (unique, nullable)
program_id (UUID)         # Program reference
role (VARCHAR)            # 'user' or 'admin'
created_at (TIMESTAMP)    # Registration timestamp
```

### attendance table
```sql
id (UUID)                 # Unique record ID
user_id (UUID)           # User reference
date (DATE)              # Attendance date
check_in (TIMESTAMP)     # Check-in time
check_out (TIMESTAMP)    # Check-out time (nullable)
created_at (TIMESTAMP)   # Record creation timestamp
```

### programs table
```sql
id (UUID)                # Unique program ID
name (VARCHAR)           # Program name
created_at (TIMESTAMP)   # Creation timestamp
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### NFC
- `POST /api/nfc/bind` - Bind NFC card to user

### Attendance
- `POST /api/attendance/tap` - Record attendance tap
- `GET /api/attendance/history` - Get user attendance history

### User
- `GET /api/user/me` - Get current user data

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/attendance` - Get all attendance records (admin only)

## Troubleshooting

### NFC tidak terbaca
1. Pastikan perangkat mendukung NFC
2. Aktifkan NFC di pengaturan perangkat
3. Gunakan Chrome browser terbaru
4. Coba restart aplikasi

### Login gagal
1. Periksa email dan password
2. Pastikan akun sudah terdaftar
3. Periksa koneksi internet

### Kartu NFC sudah terdaftar
- Setiap kartu NFC hanya bisa terikat ke satu akun
- Jika kartu sudah terdaftar ke akun lain, hubungi admin

## Deployment

Untuk deployment ke Vercel:

1. Push code ke GitHub repository
2. Buka vercel.com dan connect repository
3. Tambahkan environment variables di Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `JWT_SECRET`
4. Klik "Deploy"

## Security Notes

1. **Password**: Selalu gunakan password yang kuat
2. **JWT Secret**: Ganti `JWT_SECRET` dengan string random yang panjang untuk production
3. **HTTPS**: Selalu gunakan HTTPS di production
4. **CORS**: Pastikan CORS configuration sesuai untuk Supabase

## Support

Untuk bantuan lebih lanjut, hubungi developer atau buka issue di repository.
