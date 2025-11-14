# SmartEcoBin - Testing Guide

## 🚀 STEP-BY-STEP TESTING

### Step 1: Start the Development Server ✅
```bash
npm run dev
```

Tunggu sampai melihat:
```
✓ Server running on http://127.0.0.1:5000
✓ Client running on http://localhost:5173
```

Atau buka di browser:
- http://localhost:5173 (Frontend)
- http://localhost:5000/api/bins (Backend API test)

---

### Step 2: Register New Account 📝

1. Buka http://localhost:5173
2. Klik **"Sign Up"** link di bawah form
3. Isi form:
   - **Full Name**: John Doe
   - **Email**: john@example.com
   - **Phone** (optional): +62812345678
   - **Password**: password123
4. Klik **"Create Account"**
5. Harus redirect ke **Role Selection** page

**Expected**: Token tersimpan di localStorage, redirect ke role selection.

---

### Step 3: Select Role 👤

Pilih salah satu:
- **Public User** → Untuk view bins (general public)
- **Officer** → Untuk manage dan monitor bins
- **Admin** → Full access

Untuk testing, pilih **"Officer"** untuk akses semua fitur.

---

### Step 4: Smart Monitoring Dashboard 📊

Setelah select role, harus tampil:

#### Statistics Cards (Top Row):
- 🔵 **Total Bins**: 5 (atau sesuai sample data)
- 🟢 **Normal**: 2
- 🟡 **Warning**: 2
- 🔴 **Full**: 1
- 🟣 **Alerts**: number of unread

#### Controls:
- 🔍 **Search Box**: Cari "Eco" atau "Jalan" → filter hasil
- **View Toggle**: List / Map
- **Filter Buttons**: Normal / Warning / Full
- **Nearby Button**: Find bins near your location
- **Refresh Button**: Refresh data

#### List View:
- 5 bins ditampilkan dengan card
- Click card → buka **Bin Details** page
- Setiap card menunjukkan: name, location, fill%, status

---

### Step 5: Test Search & Filter 🔍

1. **Search Test**:
   - Type "Eco" di search box → harus filter ke bin yang name-nya mengandung "Eco"
   - Type "Simpang" → harus tidak ada hasil (tidak ada bin dengan nama itu)
   - Clear search → show all bins kembali

2. **Filter Test**:
   - Klik **"Warning"** button → hanya tampil warning bins (Eco Bin B, Eco Bin E)
   - Klik **"Full"** button → hanya tampil full bins (Eco Bin C)
   - Klik **"Normal"** button → hanya tampil normal bins
   - Klik button lagi untuk clear filter

**Expected**: Filter bekerja dengan responsive update

---

### Step 6: Test Map View 🗺️

1. Klik **"Map"** button untuk toggle ke map view
2. **Leaflet Map** harus tampil dengan:
   - Tile layer (OpenStreetMap)
   - 5 marker dengan warna berbeda (green=normal, orange=warning, red=full)
   - Default center pada Jakarta

3. **Interact with Map**:
   - Zoom in/out dengan mouse wheel
   - Drag untuk pan
   - Click marker → popup dengan bin name, location, fill%, "View Details" button

4. Klik **"List"** button untuk kembali ke list view

**Expected**: Map render properly, markers clickable

---

### Step 7: Test Nearby Search 📍

1. Klik **"Nearby"** button
2. Browser akan request location permission → **Allow**
3. Map akan center ke user location dengan blue marker
4. Nearby bins (dalam radius 5km) akan di-fetch dan ditampilkan
5. List/Map view akan update dengan distance information

**If geolocation denied**:
- Prompt akan muncul "Unable to get location..."
- Di Chrome DevTools, bisa override location via Settings

**Expected**: Map center ke user location, bins filtered by distance

---

### Step 8: Test Bin Details Page 📋

1. Click salah satu bin card → open **BinDetails** page
2. Page harus menampilkan:

#### Header:
- 🔙 Back button
- Bin name (e.g., "Eco Bin C")
- Location dengan MapPin icon
- Status badge (green/yellow/red)

#### Map:
- 🗺️ Leaflet map dengan bin marker
- Center pada bin coordinates

#### Statistics Cards:
- **Fill Level**: Progress bar + percentage
- **Battery**: Progress bar + percentage + Sensor ID
- **Last Updated**: Timestamp

#### Collection Schedule:
- Last Collection: date & time
- Next Collection: date & time (green card)

#### Field Officer:
- Name, email, phone
- Contact Officer button (clickable)

#### Recent Alerts:
- List of last 5 notifications
- Color-coded by type (critical=red, warning=yellow, info=blue)

#### Notes:
- Deskripsi singkat tentang bin

**Expected**: Semua info terload dengan proper styling

---

### Step 9: Login/Logout Test 🔐

#### Login dengan Existing Account:

1. Logout: Klik profile page, klik logout
2. Harus redirect ke login page
3. Toggle ke **Sign In**
4. Test account:
   - Email: budi@example.com
   - Password: password123 (atau gunakan email/password yang baru didaftar)

**⚠️ NOTE**: Sample data password belum di-hash dengan bcrypt. 
Untuk login sample accounts, update password di Supabase:

```sql
UPDATE users 
SET password_hash = '$2b$10$...'  -- bcrypt hash of 'password123'
WHERE email = 'budi@example.com';
```

Atau gunakan account yang baru di-register.

#### Login Flow:
1. Click "Sign In" if on Register form
2. Input email & password
3. Klik **"Sign In"**
4. Harus show loading state
5. Jika berhasil → token di localStorage, redirect ke monitoring
6. Jika error → alert "Invalid email or password"

**Expected**: Token management bekerja, localStorage punya `token` key

---

### Step 10: Test Responsive Design 📱

1. Open DevTools (F12)
2. Click device toolbar (toggle device)
3. Test various screen sizes:
   - Mobile (375px): Cards stack vertical, bottom nav sticky
   - Tablet (768px): 2 columns layout
   - Desktop (1024px+): Full 3+ column layout

#### Elements to check:
- Navigation buttons responsive
- Search box tidak overflow
- Map container responsive
- Cards readability pada mobile

**Expected**: Proper responsive layout tanpa horizontal scroll

---

## 🧪 ADVANCED TESTING

### Test API Directly

Gunakan curl atau Postman untuk test API:

#### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Test User",
    "email": "test@example.com",
    "role": "public"
  }
}
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 3. Get Profile
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. List Bins
```bash
curl http://localhost:5000/api/bins
curl http://localhost:5000/api/bins?search=Eco
curl http://localhost:5000/api/bins?status=warning
```

#### 5. Get Bin Details
```bash
curl http://localhost:5000/api/bins/550e8400-e29b-41d4-a716-446655440001
```

#### 6. Search Nearby
```bash
curl "http://localhost:5000/api/bins/search/nearby?latitude=-6.2088&longitude=106.8456&radius=5"
```

---

## ✅ TESTING CHECKLIST

- [ ] Register dengan email & password baru → token tersimpan
- [ ] Login dengan email & password → berhasil
- [ ] Logout → token dihapus, redirect ke login
- [ ] Dashboard menampilkan 5 bins dengan data
- [ ] Search filter bekerja → hasil ter-filter
- [ ] Status filter bekerja → hanya tampil status tertentu
- [ ] List view → setiap bin clickable
- [ ] Map view → marker tampil, clickable dengan popup
- [ ] Nearby search → geolocation request, map center update
- [ ] Bin details → semua info terload & terformat
- [ ] Back button → kembali ke monitoring
- [ ] Responsive design → mobile, tablet, desktop OK
- [ ] API endpoints respond → curl test sukses
- [ ] Token di localStorage → check DevTools > Application > LocalStorage
- [ ] Error handling → wrong password → error message
- [ ] Loading states → show spinner while loading
- [ ] No errors di browser console (F12)
- [ ] No errors di server terminal

---

## 🎬 DEMO SCRIPT (3 MINUTES)

1. **0:00-0:30** - Open app, Register account
2. **0:30-1:00** - Select role (Officer), show dashboard
3. **1:00-1:30** - Search for "Eco" bins, filter by status
4. **1:30-2:00** - Toggle map view, show interactive map
5. **2:00-2:30** - Click bin → show details page, features
6. **2:30-3:00** - Click nearby → show geolocation, filtered results

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Login page tidak muncul
**Fix**: Buka browser DevTools, clear localStorage, refresh page
```javascript
localStorage.clear();
location.reload();
```

### Issue: Bins tidak tampil
**Fix**: 
1. Check server console untuk error
2. Check network tab untuk /api/bins response
3. Pastikan SUPABASE credentials di .env valid

### Issue: Map blank
**Fix**:
1. Hard refresh: Ctrl+Shift+R
2. Check browser console untuk Leaflet errors
3. Pastikan npm install react-leaflet sudah run

### Issue: Geolocation not working
**Fix**:
1. HTTPS required untuk production (localhost OK untuk dev)
2. Check browser permissions setting
3. Try different browser (Chrome, Firefox)

### Issue: Token error 401
**Fix**:
1. Token expired → logout & login ulang
2. Token tidak disimpan → check localStorage
3. Token format salah → harus "Bearer {token}"

---

## 📊 PERFORMANCE TIPS

### For Better Performance:
1. Reduce data fetch interval (currently 30s) jika ingin faster updates
2. Implement pagination untuk bins list jika > 100 bins
3. Optimize images dengan compression
4. Enable service worker untuk offline support

### Monitoring:
- DevTools Network tab → check API response times
- DevTools Performance tab → check render times
- Server logs → check database query times

---

## 🎯 SUCCESS CRITERIA

✅ **Minimal**: 
- Register & login works
- Dashboard shows bins
- Can view bin details

✅ **Good**:
- All above + search/filter/map works
- Responsive design OK
- No console errors

✅ **Excellent**:
- All above + nearby search, geolocation, proper error handling
- Smooth animations & transitions
- Accessible (keyboard navigation, screen reader friendly)

---

Selamat Testing! 🚀
