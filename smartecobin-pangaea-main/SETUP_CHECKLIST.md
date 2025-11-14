# CHECKLIST: Yang Masih Perlu Diisi/Dikerjakan

## 🔴 WAJIB DIISI (Critical) - Agar Aplikasi Bisa Jalan

### 1. **Supabase Credentials** ⭐⭐⭐
**File**: `.env` (di root folder)

Apa yang perlu diisi:
```properties
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cara mendapatkan:**
1. Buka https://supabase.com
2. Login atau buat account gratis
3. Buat project baru
4. Klik Settings → API
5. Copy:
   - `Project URL` → paste ke `SUPABASE_URL`
   - `anon public` → paste ke `SUPABASE_ANON_KEY`
   - `service_role secret` → paste ke `SUPABASE_SERVICE_ROLE_KEY`

**Contoh:**
```properties
SUPABASE_URL=https://xyzabc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhz...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhz...
```

---

### 2. **Database Schema Setup** ⭐⭐⭐
**File**: `SUPABASE_SCHEMA.sql`

Apa yang perlu dilakukan:
1. Buka Supabase Dashboard
2. Masuk ke project yang baru dibuat
3. Klik **SQL Editor** (di sidebar kiri)
4. Klik tombol **+ New Query**
5. Copy seluruh isi file `SUPABASE_SCHEMA.sql`
6. Paste ke SQL Editor
7. Klik **Run** (tombol play icon)

**Apa yang akan terjadi:**
- Tabel `users` dibuat
- Tabel `trash_bins` dibuat dengan field lengkap (latitude, longitude, battery_level, dll)
- Tabel `notifications` dibuat
- 5 sample trash bins diinsert
- 3 sample users diinsert
- Indexes dan RLS policies dibuat

---

### 3. **Update Sample User Passwords** ⭐⭐
**File**: Supabase SQL Editor (manual update)

Masalah:
- Sample data users punya `password_hash = 'hashed_password_here'` (placeholder)
- Tidak bisa login dengan sample accounts

Solusi - Run SQL ini di Supabase:
```sql
-- Update sample users dengan bcrypt hash dari 'password123'
-- Hash: $2b$10$N9qo8uLOickgx2ZMRZoXyejNbxb7Jdv4oXk0f6qECbAL9Yfm2bZLa (password: 'password123')

UPDATE users 
SET password_hash = '$2b$10$N9qo8uLOickgx2ZMRZoXyejNbxb7Jdv4oXk0f6qECbAL9Yfm2bZLa'
WHERE email IN ('admin@example.com', 'ahmad@example.com', 'budi@example.com');
```

Setelah ini, semua sample users bisa login dengan:
- **Email**: admin@example.com, ahmad@example.com, atau budi@example.com
- **Password**: password123

---

### 4. **Environment Variables Frontend** 
**File**: `client/.env`

Cek apakah sudah ada:
```properties
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Jika belum ada atau masih placeholder, update dengan credentials Supabase yang sama.

---

## 🟡 HIGHLY RECOMMENDED (Important) - Untuk Better Experience

### 5. **Test Data untuk Monitoring** ⭐⭐
**Optional tapi sangat helpful**

Kode sudah ada 5 sample trash bins, tapi untuk test lebih realistic, Anda bisa:
1. Add lebih banyak bins dengan berbagai fill levels
2. Add beberapa test notifications
3. Add coordinates yang lebih akurat sesuai lokasi sebenarnya

Run di Supabase SQL Editor:
```sql
-- Add more test bins dengan berbagai fill levels
INSERT INTO trash_bins (name, location, latitude, longitude, fill_level, status, capacity)
VALUES
  ('Eco Bin F', 'Grand Indonesia', -6.1955, 106.8217, 15, 'normal', 120),
  ('Eco Bin G', 'Kota Tua', -6.1356, 106.8089, 95, 'full', 100),
  ('Eco Bin H', 'SCBD', -6.2164, 106.8201, 50, 'normal', 150);
```

---

### 6. **CORS Setup Verification**
**File**: `server/index.ts` (sudah ditambahkan)

Status: ✅ Sudah ditambahkan CORS headers

---

## 🟢 OPTIONAL (Nice to Have) - Untuk Polish & Enhancement

### 7. **Image Upload untuk Bins**
**Status**: Not yet implemented

Jika ingin add image gallery di bin details:
- Install `multer` untuk file upload
- Buat endpoint `POST /api/bins/:id/upload-image`
- Store images di Supabase Storage atau local

---

### 8. **Real-time Subscriptions**
**Status**: Basic implementation ada, bisa di-enhance

Untuk real-time updates tanpa polling:
- Sudah ada Supabase client
- Bisa implement `supabase.on('*', ...)` di SmartMonitoring
- Update bins list otomatis tanpa refresh button

---

### 9. **Service Worker & Offline Support**
**Status**: Not yet implemented

- Add manifest.json untuk PWA
- Create service worker untuk offline mode
- Allow browser notifications dengan background sync

---

### 10. **Admin Dashboard**
**Status**: Basic pages ada, admin-specific features missing

Bisa tambahkan:
- User management page (CRUD users)
- Bins management page
- Analytics/reports
- Settings page

---

## 📋 QUICK SETUP SUMMARY (5 Minutes)

```bash
# 1. Update .env dengan Supabase credentials
# Edit: c:\Users\LENOVO\Downloads\SmartEcoBin (1)\SmartEcoBin\.env
#   SUPABASE_URL=...
#   SUPABASE_ANON_KEY=...
#   SUPABASE_SERVICE_ROLE_KEY=...

# 2. Update client/.env
# Edit: c:\Users\LENOVO\Downloads\SmartEcoBin (1)\SmartEcoBin\client\.env
#   VITE_SUPABASE_URL=...
#   VITE_SUPABASE_ANON_KEY=...

# 3. Setup Database Schema
# - Buka Supabase SQL Editor
# - Copy paste SUPABASE_SCHEMA.sql
# - Klik Run

# 4. Update Sample User Passwords
# - Run UPDATE users SQL di Supabase

# 5. Start server
npm run dev

# 6. Test di browser
# http://localhost:5173
```

---

## 🧪 TESTING CREDENTIALS (Setelah setup)

Setelah update password, gunakan untuk test:

**Login:**
- Email: `budi@example.com`
- Password: `password123`
- Role: Public user

**Atau login sebagai:**
- Email: `ahmad@example.com`
- Password: `password123`
- Role: Officer

**Atau register account baru:**
- Nama: `Your Name`
- Email: `your@email.com`
- Password: `password123`
- Role: Auto set ke "public"

---

## ✅ BEFORE YOU RUN `npm run dev`

Checklist:

- [ ] `.env` file sudah diupdate dengan SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- [ ] `client/.env` sudah diupdate dengan VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- [ ] Database schema sudah di-run di Supabase SQL Editor
- [ ] Sample user passwords sudah di-update dengan bcrypt hash
- [ ] Buka http://localhost:5173 setelah `npm run dev`

---

## 🚀 SETELAH SEMUANYA SIAP

```bash
# Stop server jika ada
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Jalankan
cd "c:\Users\LENOVO\Downloads\SmartEcoBin (1)\SmartEcoBin"
npm run dev

# Buka browser
# http://localhost:5173
```

---

## 📞 JIKA MASIH ADA ERROR

### Error: "Supabase URL or Key missing"
→ Check `.env` file, pastikan credentials ada dan benar (copy-paste hati-hati, jangan ada space)

### Error: "Cannot find module 'bcrypt'"
→ `npm install` di root folder sudah berjalan (harus berjalan)

### Error: "Login failed" saat test
→ Sample data password belum di-hash, gunakan account baru (register di app)

### Error: "Map tidak tampil"
→ Check browser console, hard refresh (Ctrl+Shift+R)

### Error: "Failed to fetch" saat register/login
→ Pastikan server running (`npm run dev` berjalan), check CORS headers di server

---

## 📚 REFERENCE FILES

- **Schema**: `SUPABASE_SCHEMA.sql` - Database structure dan sample data
- **Backend**: `server/routes/auth.ts` - Register, login, profile endpoints
- **Backend**: `server/routes/bins.ts` - Bins list, details, search endpoints
- **Frontend**: `client/src/pages/LoginPage.tsx` - Register & login form
- **Frontend**: `client/src/pages/SmartMonitoring.tsx` - Dashboard dengan map & search
- **Frontend**: `client/src/pages/BinDetails.tsx` - Detail page untuk setiap bin
- **Docs**: `IMPLEMENTATION_GUIDE.md` - Dokumentasi lengkap
- **Docs**: `TESTING_GUIDE.md` - Cara test semua fitur

---

## ⚡ SIMPLE STEPS

1. **Dapatkan Supabase credentials** (2 min)
2. **Update `.env` files** (1 min)
3. **Jalankan schema SQL** di Supabase (1 min)
4. **Update sample passwords** (1 min)
5. **Jalankan `npm run dev`** (1 min)
6. **Buka http://localhost:5173 di browser** (1 min)
7. **Test dengan register akun baru atau login** (5 min)

**Total: 12 menit dan sistem sudah siap pakai! 🚀**
