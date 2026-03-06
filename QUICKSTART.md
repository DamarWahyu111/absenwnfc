# Quick Start Guide - NFC Attendance System

## 5 Langkah Setup Cepat

### Step 1: Setup Supabase Database

1. Buka [supabase.com](https://supabase.com) dan login
2. Buka project Anda: `zwqwhkfnuuoeayvwnghs`
3. Pergi ke **SQL Editor**
4. Klik **New Query**
5. Copy-paste seluruh isi dari file `/scripts/setup-database.sql`
6. Klik **Run**

Database Anda sekarang sudah siap!

### Step 2: Buat File .env.local

Di root project, buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zwqwhkfnuuoeayvwnghs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hplerZGOBlSBfKhC-RBWig_Z-vkF2nV
JWT_SECRET=your-secret-key-change-in-production
```

### Step 3: Install Dependencies

```bash
npm install
```

atau jika menggunakan pnpm:

```bash
pnpm install
```

### Step 4: Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Step 5: Buat Akun & Mulai

1. Buka `http://localhost:3000`
2. Klik **Daftar** atau pergi ke `/auth/register`
3. Isi form dan buat akun baru
4. Setelah login, pergi ke **Dashboard**
5. Daftar kartu NFC Anda di **Bind NFC**
6. Mulai absensi dengan tap NFC

---

## Default Admin Account

Untuk membuat admin account, Anda perlu akses langsung ke Supabase:

1. Buka Supabase Console
2. Pergi ke **SQL Editor**
3. Jalankan query ini:

```sql
-- Buat admin user dengan password: admin123
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', '[PASSWORD_HASH]', 'admin');
```

Untuk hash password, gunakan online tool atau generate dari login pertama kemudian update via Supabase.

---

## Testing Flow

### Test 1: User Registration & Login
1. Buka `/auth/register`
2. Isi dengan data random
3. Klik **Daftar**
4. Akan redirect ke dashboard
5. Logout dan coba login lagi

### Test 2: NFC Binding (Memerlukan Device Android)
1. Login di Android Chrome
2. Pergi ke `/dashboard/bind-nfc`
3. Tap kartu NFC ke perangkat
4. Kartu akan ter-register

### Test 3: Attendance Recording
1. Pergi ke `/dashboard/attendance`
2. Tap kartu NFC (check-in)
3. Tap lagi (check-out)
4. Lihat waktu di `/dashboard/history`

---

## Features Overview

### 👤 User Features
- ✅ Register & Login
- ✅ NFC Card Binding
- ✅ Check-in/Check-out
- ✅ View Attendance History
- ✅ View Today's Status

### 🔧 Admin Features
- ✅ View All Users
- ✅ View All Attendance Records
- ✅ Filter by Date Range
- ✅ Search Users

### 🔒 Security
- ✅ JWT Token Authentication
- ✅ Protected Routes
- ✅ Password Hashing
- ✅ Unique NFC per User

---

## Project Structure

```
.
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/                       # Auth pages
│   ├── dashboard/                  # User pages
│   ├── admin/                      # Admin pages
│   └── api/                        # API routes
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── auth.ts                     # Auth utilities
│   ├── types.ts                    # Types definition
│   └── nfc.ts                      # NFC utilities
├── components/
│   └── dashboard-header.tsx        # Header component
├── middleware.ts                   # Route protection
├── scripts/
│   └── setup-database.sql          # Database schema
└── SETUP.md                        # Full setup guide
```

---

## Troubleshooting

### "NFC tidak didukung"
- Device harus Android 7.0+
- Browser harus Chrome terbaru
- Aktifkan NFC di pengaturan perangkat

### "Kartu sudah terdaftar"
- Setiap kartu NFC hanya bisa 1 akun
- Hubungi admin untuk reset

### "Database connection error"
- Periksa `NEXT_PUBLIC_SUPABASE_URL` benar
- Periksa `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar
- Pastikan SQL script sudah dijalankan di Supabase

### "Login gagal"
- Periksa email & password benar
- Pastikan akun sudah registrasi

---

## Useful Links

- 📚 Full Setup Guide: [SETUP.md](./SETUP.md)
- 🗄️ Database Schema: [scripts/setup-database.sql](./scripts/setup-database.sql)
- 🔐 Supabase Console: https://supabase.com
- 📖 Next.js Docs: https://nextjs.org
- 💾 Supabase Docs: https://supabase.com/docs

---

## Next Steps

1. ✅ Setup Supabase (Step 1)
2. ✅ Create .env.local (Step 2)
3. ✅ Install dependencies (Step 3)
4. ✅ Run dev server (Step 4)
5. ✅ Create account & test (Step 5)
6. 📦 Deploy to Vercel (optional)
7. 🚀 Go live!

---

Selamat! Sistem absensi NFC Anda sudah siap digunakan! 🎉
