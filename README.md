# NFC Attendance System

Sistem absensi berbasis NFC yang modern, aman, dan dapat digunakan untuk mencatat kehadiran dengan teknologi kartu NFC dan Android Chrome.

## 🚀 Quick Start (5 Menit)

### 1. Setup Supabase Database
```bash
# Buka https://supabase.com dan login
# Buka project: zwqwhkfnuuoeayvwnghs
# Pergi ke SQL Editor > New Query
# Copy-paste isi dari: /scripts/setup-database.sql
# Klik Run
```

### 2. Konfigurasi Environment
```bash
# Buat file .env.local di root project:
echo "NEXT_PUBLIC_SUPABASE_URL=https://zwqwhkfnuuoeayvwnghs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hplerZGOBlSBfKhC-RBWig_Z-vkF2nV
JWT_SECRET=your-secret-key" > .env.local
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Akses Aplikasi
```
http://localhost:3000
```

### 5. Daftar & Mulai
- Klik **Daftar** untuk membuat akun
- Login dengan akun Anda
- Daftar kartu NFC di **Dashboard > Bind NFC**
- Mulai absensi dengan tap NFC

---

## 📋 Fitur Utama

### 👤 User Features
- ✅ Register & Login
- ✅ Daftar Kartu NFC
- ✅ Check-in/Check-out dengan NFC
- ✅ Lihat Riwayat Absensi
- ✅ Status Absensi Hari Ini

### 🔧 Admin Features
- ✅ Kelola Pengguna
- ✅ Lihat Semua Riwayat Absensi
- ✅ Filter berdasarkan Tanggal
- ✅ Search Pengguna

### 🔐 Security
- ✅ Password Hashing (SHA-256)
- ✅ JWT Authentication (7 hari)
- ✅ Protected Routes
- ✅ Role-based Access Control
- ✅ 1 NFC Card = 1 Account

---

## 📁 Project Structure

```
.
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/                       # Login & Register
│   ├── dashboard/                  # User dashboard
│   ├── admin/                      # Admin dashboard
│   └── api/                        # API endpoints
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── auth.ts                     # Auth utilities
│   ├── nfc.ts                      # NFC utilities
│   └── types.ts                    # Types
├── components/
│   └── dashboard-header.tsx        # Header component
├── scripts/
│   └── setup-database.sql          # Database schema
├── middleware.ts                   # Route protection
├── QUICKSTART.md                   # Quick start (5 langkah)
├── SETUP.md                        # Setup guide lengkap
├── API.md                          # API documentation
├── IMPLEMENTATION.md               # Project overview
└── README.md                       # File ini
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT + bcrypt
- **NFC**: Web NFC API
- **Icons**: Lucide React

---

## 📱 Syarat Perangkat

### Desktop
- Chrome/Edge browser terbaru
- Untuk testing only

### Android (Diperlukan untuk NFC)
- Android 7.0+
- Chrome browser terbaru
- NFC hardware
- NFC-enabled card

### iOS
- Limited support (hanya web view)
- Tidak mendukung Web NFC API

---

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/user/me` - User data

### NFC
- `POST /api/nfc/bind` - Daftar kartu NFC

### Attendance
- `POST /api/attendance/tap` - Tap NFC
- `GET /api/attendance/history` - Riwayat

### Admin
- `GET /api/admin/users` - Kelola users
- `GET /api/admin/attendance` - Riwayat semua

Lihat [API.md](./API.md) untuk dokumentasi lengkap.

---

## 📚 Dokumentasi

1. **[QUICKSTART.md](./QUICKSTART.md)** - 5 langkah setup cepat ⭐
2. **[SETUP.md](./SETUP.md)** - Setup guide lengkap dengan troubleshooting
3. **[API.md](./API.md)** - Dokumentasi API lengkap
4. **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Project overview & technical details

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# 1. Push ke GitHub
git push

# 2. Pergi ke vercel.com dan connect repo
# 3. Add environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - JWT_SECRET (gunakan value yang lebih aman)

# 4. Deploy!
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_public_...
JWT_SECRET=change-me-in-production
```

---

## 🧪 Testing

### Test Checklist
- ✅ Register akun baru
- ✅ Login & logout
- ✅ Daftar kartu NFC (Android required)
- ✅ Check-in/check-out
- ✅ Lihat riwayat
- ✅ Admin dashboard
- ✅ Filter & search

### Test Accounts
Buat sendiri via `/auth/register`

### Admin Account
Silakan hubungi developer untuk create admin account.

---

## ❓ FAQ

**Q: Bisakah menggunakan di iPhone?**  
A: Terbatas, hanya untuk view. NFC hanya tersedia di Android Chrome.

**Q: Kartu NFC apa yang bisa digunakan?**  
A: NFC Type 2 cards (ISO/IEC 14443 Type A) - standard RFID/NFC cards.

**Q: Bagaimana jika lupa password?**  
A: Fitur password reset belum diimplementasi. Hubungi admin untuk reset.

**Q: Satu kartu NFC bisa digunakan beberapa akun?**  
A: Tidak. 1 kartu = 1 akun (unique constraint).

**Q: Berapa maksimal users?**  
A: Supabase free tier: unlimited. Berbayar: sesuai plan.

---

## 🐛 Troubleshooting

### NFC Tidak Terbaca
1. Pastikan Android 7.0+
2. Aktifkan NFC di pengaturan
3. Gunakan Chrome terbaru
4. Restart aplikasi

### Database Error
1. Periksa environment variables
2. Pastikan SQL script sudah dijalankan
3. Cek koneksi Supabase

### Login Gagal
1. Periksa email & password
2. Pastikan akun sudah registrasi
3. Clear cookies dan coba lagi

Lihat [SETUP.md](./SETUP.md) untuk troubleshooting lengkap.

---

## 📊 Database

### Tables
- `programs` - Program/magang
- `users` - User accounts
- `attendance` - Attendance records

### Schema Details
Lihat `/scripts/setup-database.sql` untuk SQL schema lengkap.

---

## 🔐 Security Notes

1. **Jangan share environment variables**
2. **Change JWT_SECRET untuk production**
3. **Gunakan HTTPS di production**
4. **Enable Supabase RLS jika needed**
5. **Regular backup database**

---

## 📞 Support

### Resources
- 📖 [Next.js Docs](https://nextjs.org)
- 📖 [Supabase Docs](https://supabase.com/docs)
- 📖 [Web NFC API](https://web.dev/nfc/)

### Help
1. Baca dokumentasi (start dengan QUICKSTART.md)
2. Check browser console untuk error
3. Verify environment variables
4. Periksa Supabase logs
5. Hubungi developer

---

## 📄 License

Private project untuk internal use.

---

## 👨‍💻 Author

Built with ❤️ for NFC Attendance System

---

## ✅ Status

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: March 5, 2026

---

Selamat menggunakan! 🎉
