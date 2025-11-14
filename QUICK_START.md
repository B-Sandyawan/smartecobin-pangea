# RINGKASAN YANG MASIH PERLU DIISI

## 🎯 HANYA 4 LANGKAH UNTUK LIVE SYSTEM!

```
┌─────────────────────────────────────────────────────┐
│  STEP 1: BUAT SUPABASE PROJECT (2 min)             │
├─────────────────────────────────────────────────────┤
│  1. Buka https://supabase.com                      │
│  2. Login / Sign Up gratis                          │
│  3. Klik "New Project"                             │
│  4. Pilih region, beri nama (misal: SmartEcoBin)   │
│  5. Tunggu project dibuat                          │
│  6. Copy credentials (URL, Keys)                    │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 2: UPDATE .ENV FILES (1 min)                 │
├─────────────────────────────────────────────────────┤
│  Edit: .env (root)                                 │
│  ────────────────────────────────                  │
│  SUPABASE_URL=https://xxxx.supabase.co             │
│  SUPABASE_ANON_KEY=eyJhbGc...                      │
│  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...              │
│                                                     │
│  Edit: client/.env                                 │
│  ──────────────────────────────                    │
│  VITE_SUPABASE_URL=https://xxxx.supabase.co        │
│  VITE_SUPABASE_ANON_KEY=eyJhbGc...                 │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 3: SETUP DATABASE (1 min)                    │
├─────────────────────────────────────────────────────┤
│  1. Buka Supabase → SQL Editor                     │
│  2. Copy paste SUPABASE_SCHEMA.sql (entire file)   │
│  3. Klik RUN                                       │
│  ✓ Users table dibuat                              │
│  ✓ Trash bins table dibuat                         │
│  ✓ Notifications table dibuat                      │
│  ✓ 5 sample bins diinsert                          │
│  ✓ 3 sample users diinsert                         │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 4: UPDATE SAMPLE PASSWORDS (1 min)           │
├─────────────────────────────────────────────────────┤
│  1. Buka Supabase → SQL Editor                     │
│  2. Paste SQL ini:                                 │
│                                                     │
│  UPDATE users                                       │
│  SET password_hash =                               │
│  '$2b$10$N9qo8uLOickgx2ZMRZoXyejNbxb7Jdv...'     │
│  WHERE email IN                                    │
│  ('admin@example.com','ahmad@example.com',        │
│   'budi@example.com');                             │
│                                                     │
│  3. Klik RUN                                       │
│  ✓ Sekarang bisa login dengan password: password123 │
└─────────────────────────────────────────────────────┘
         ↓
         ✅ SISTEM SIAP PAKAI!
         npm run dev
```

---

## 📝 DETAIL MASING-MASING LANGKAH

### STEP 1: Supabase Setup

**Dimana dapat credentials?**
1. Buka supabase.com
2. Login (atau buat account gratis)
3. Buat project baru
4. Tunggu selesai (~2-3 menit)
5. Settings → API
6. Copy value ini:
   - **Project URL** → SUPABASE_URL
   - **anon public** key → SUPABASE_ANON_KEY
   - **service_role secret** → SUPABASE_SERVICE_ROLE_KEY

**Contoh hasil:**
```
SUPABASE_URL=https://xyzabc123456789.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhz...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhz...
```

---

### STEP 2: Update .env Files

**File 1: Root `.env`**
- Path: `c:\Users\LENOVO\Downloads\SmartEcoBin (1)\SmartEcoBin\.env`
- Update:
  ```properties
  SUPABASE_URL=<copy dari Supabase Settings>
  SUPABASE_ANON_KEY=<copy dari Supabase Settings>
  SUPABASE_SERVICE_ROLE_KEY=<copy dari Supabase Settings>
  JWT_SECRET=SmartEcoBin2025SecretKey123!@# (bisa pakai ini atau ganti)
  PORT=5000
  NODE_ENV=development
  ```

**File 2: Client `.env`**
- Path: `c:\Users\LENOVO\Downloads\SmartEcoBin (1)\SmartEcoBin\client\.env`
- Update:
  ```properties
  VITE_API_URL=http://localhost:5000
  VITE_SUPABASE_URL=<sama dengan root .env>
  VITE_SUPABASE_ANON_KEY=<sama dengan root .env>
  ```

---

### STEP 3: Run Database Schema

**Apa yang dilakukan:**
```sql
-- Membuat struktur database:
CREATE TABLE users (...)          -- Untuk authentication
CREATE TABLE trash_bins (...)     -- Untuk monitoring
CREATE TABLE notifications (...)  -- Untuk alerts

-- Membuat indexes untuk performa
CREATE INDEX idx_trash_bins_coords ON trash_bins(latitude, longitude);
-- dst...

-- Insert sample data:
INSERT INTO users VALUES (5 users)  -- admin, ahmad, budi, dll
INSERT INTO trash_bins VALUES (5 bins) -- Eco Bin A-E dengan data lengkap

-- Enable security:
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY ... -- Security policies
```

**Hasil:**
- Database siap dengan struktur lengkap
- 5 sample trash bins untuk testing
- 3 sample users untuk testing

---

### STEP 4: Update Sample Passwords

**Mengapa perlu?**
- Sample data punya password placeholder ('hashed_password_here')
- Tidak bisa login dengan sample accounts
- SQL update mengubah ke bcrypt hash dari password: `password123`

**Setelah update, bisa login dengan:**
```
Email: admin@example.com
Email: ahmad@example.com
Email: budi@example.com
Password: password123 (untuk semua)
```

---

## ❓ FREQUENTLY ASKED

### Q: Berapa banyak yang perlu saya code?
A: **0 lines!** Semua sudah ditulis. Hanya perlu:
- Copy-paste credentials
- Copy-paste SQL schema
- Run `npm run dev`

### Q: Biaya Supabase?
A: **Gratis!** Tier free sudah cukup untuk development/testing.
- 500 MB storage
- Unlimited API calls
- 50,000 monthly active users

### Q: Bagaimana cara register user baru?
A: Setelah setup, langsung bisa di UI:
1. Buka http://localhost:5173
2. Klik "Sign Up"
3. Isi form (name, email, password)
4. Klik "Create Account"
5. Auto login & redirect ke dashboard

### Q: Bisa pakai database lain (MySQL, PostgreSQL)?
A: Bisa, tapi perlu update connection strings di kode. Supabase adalah PostgreSQL managed.

### Q: Kenapa "Failed to fetch" error?
A: 1. Server tidak jalan → `npm run dev`
   2. CORS error → sudah fixed di kode
   3. Wrong API URL → check VITE_API_URL di client/.env

### Q: Apa bedanya register di UI vs sample data?
A: - **Register di UI**: Password di-hash otomatis dengan bcrypt
   - **Sample data**: Password placeholder, harus manual update

### Q: Berapa waktu setup total?
A: **~15 menit**
   - 2 min: Buat Supabase project
   - 1 min: Update .env files
   - 1 min: Run schema SQL
   - 1 min: Update passwords
   - 10 min: Testing (register, login, explore features)

---

## 🚨 JANGAN LUPA!

1. **COPY-PASTE HATI-HATI!** Jangan ada space di depan/belakang credentials
2. **TUNGGU PROJECT SELESAI** sebelum ambil credentials (~3 menit)
3. **RESTART SERVER** setelah update .env (stop & jalankan `npm run dev` lagi)
4. **HARD REFRESH BROWSER** setelah restart (Ctrl+Shift+R)

---

## ✅ CHECKLIST SEBELUM `npm run dev`

- [ ] Supabase project sudah dibuat
- [ ] SUPABASE_URL ada di `.env`
- [ ] SUPABASE_ANON_KEY ada di `.env`
- [ ] SUPABASE_SERVICE_ROLE_KEY ada di `.env`
- [ ] VITE_SUPABASE_URL ada di `client/.env`
- [ ] VITE_SUPABASE_ANON_KEY ada di `client/.env`
- [ ] Schema SQL sudah di-run di Supabase
- [ ] Sample user passwords sudah di-update
- [ ] Node.js dan npm terinstall
- [ ] Dependencies terinstall (`npm install` di root & client/)

Semua checked? **`npm run dev` dan buka http://localhost:5173!** 🚀

---

## 📞 BANTUAN CEPAT

Jika error, cek:

1. **"Cannot connect to database"**
   → Update .env credentials (copy dari Supabase Settings → API)

2. **"Failed to fetch" saat register/login**
   → Pastikan server running, check browser console (F12)

3. **"User not found" saat login sample account**
   → Run password update SQL di Supabase SQL Editor

4. **"Blank page" atau map tidak tampil**
   → Hard refresh: Ctrl+Shift+R

5. **Port 5000 sudah dipakai**
   → Ubah PORT di .env atau kill process: `Get-Process node | Stop-Process`

---

**THAT'S IT! Semuanya siap. Tinggal 4 langkah dan sistem ready to deploy! 🎉**
