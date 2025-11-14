# Smart Trash Bin Monitoring System

Sistem monitoring tempat sampah pintar (Smart Eco Bin) dengan fitur real-time notification menggunakan Supabase dan React + Express TypeScript.

## 📋 Fitur Utama

- ✅ **Real-time Monitoring**: Monitor semua tempat sampah secara real-time
- ✅ **Automatic Notifications**: Notifikasi otomatis ketika sampah penuh (>= 80%)
- ✅ **Browser Notifications**: Push notification ke browser user
- ✅ **Live Subscriptions**: Real-time updates menggunakan Supabase subscriptions
- ✅ **Responsive Design**: Tampilan responsif untuk semua device
- ✅ **Status Indicators**: Indikator status dengan color coding (green/yellow/red)
- ✅ **Statistics Dashboard**: Dashboard dengan statistik monitoring
- ✅ **Notification Management**: Mark as read, delete, mark all as read

## 🚀 Quick Start

### 1. Setup Supabase

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Copy file `SUPABASE_SCHEMA.sql` ke SQL Editor Supabase
4. Jalankan script untuk membuat tables dan policies
5. Ambil credentials dari Settings > API:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Setup Environment Variables

**File: `.env` (root)**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=development
PORT=5000
```

**File: `client/.env`**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install Dependencies

```bash
cd SmartEcoBin
npm install @supabase/supabase-js
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://127.0.0.1:5000`

## 📁 Struktur File

### Backend
```
server/
├── lib/
│   └── supabase.ts              # Supabase client initialization
├── routes/
│   ├── sensor.ts                # Sensor data API endpoints
│   └── notifications.ts         # Notifications API endpoints
└── index.ts                     # Main server file (updated)
```

### Frontend
```
client/src/
├── lib/
│   └── supabase.ts              # Supabase client initialization
├── components/
│   ├── BinCard.tsx              # Individual trash bin card
│   └── NotificationList.tsx     # Notifications list component
└── pages/
    └── SmartMonitoring.tsx      # Dashboard monitoring page
```

## 🔌 API Endpoints

### Sensor Endpoints

**POST /api/sensor/update**
- Terima data dari sensor
- Request body:
```json
{
  "binId": "uuid",
  "fillLevel": 85,
  "location": "Jalan Sudirman",
  "binName": "Bin A"
}
```

**GET /api/sensor/bins**
- Get semua trash bins

**GET /api/sensor/bin/:id**
- Get trash bin spesifik

### Notifications Endpoints

**GET /api/notifications**
- Get semua notifications
- Query params: `limit=50`, `read=true|false`

**GET /api/notifications/unread/count**
- Get jumlah unread notifications

**POST /api/notifications/:id/mark-read**
- Mark notification as read

**POST /api/notifications/mark-all-read**
- Mark semua notifications as read

**DELETE /api/notifications/:id**
- Delete notification

## 🗄️ Database Schema

### trash_bins Table
```sql
- id (UUID): Primary key
- name (TEXT): Nama tempat sampah
- location (TEXT): Lokasi
- fill_level (INTEGER 0-100): Tingkat penuh sampah
- status (TEXT): normal, warning, atau full
- last_updated (TIMESTAMP): Last update time
- created_at (TIMESTAMP): Created time
```

### notifications Table
```sql
- id (UUID): Primary key
- bin_id (UUID FK): Reference ke trash_bins
- message (TEXT): Pesan notifikasi
- type (TEXT): info, warning, atau critical
- read (BOOLEAN): Status baca
- created_at (TIMESTAMP): Created time
```

## 🎨 Color Coding

- 🟢 **Green (Normal)**: Fill level < 60%
- 🟡 **Yellow (Warning)**: Fill level 60-79%
- 🔴 **Red (Full)**: Fill level >= 80%

## 🔄 Real-time Features

### Supabase Subscriptions
- Subscribe ke `trash_bins` table untuk update fill level
- Subscribe ke `notifications` table untuk alert baru
- Auto refresh data ketika ada perubahan

### Browser Notifications
- Request permission saat user buka halaman
- Auto send notification popup ketika alert kritis
- Tag notifications untuk prevent duplicate

## 📱 Usage Example

### Mengirim data dari sensor:
```bash
curl -X POST http://127.0.0.1:5000/api/sensor/update \
  -H "Content-Type: application/json" \
  -d '{
    "binId": "550e8400-e29b-41d4-a716-446655440000",
    "fillLevel": 85,
    "location": "Jalan Sudirman No. 45",
    "binName": "Trash Bin A"
  }'
```

### Mendapatkan daftar tempat sampah:
```bash
curl http://127.0.0.1:5000/api/sensor/bins
```

### Mendapatkan notifikasi:
```bash
curl http://127.0.0.1:5000/api/notifications?limit=20
```

## 🛠️ Development

### Stack Technologies
- **Backend**: Express.js, TypeScript, Supabase JS Client
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Supabase JS Client
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Notifications**: Browser Notification API

### Key Features Implemented
1. ✅ REST API untuk sensor dan notifications
2. ✅ Supabase real-time subscriptions
3. ✅ Automatic notification creation (>= 80%)
4. ✅ Real-time UI updates
5. ✅ Browser push notifications
6. ✅ Responsive dashboard
7. ✅ Statistics aggregation
8. ✅ Loading & empty states

## 📊 Dashboard Components

### SmartMonitoring.tsx
Main dashboard dengan:
- Statistics cards (Total bins, Normal, Warning, Full)
- Trash bins grid dengan real-time updates
- Notifications sidebar
- Polling mechanism (30s untuk bins, 10s untuk notifications)
- Supabase subscriptions

### BinCard.tsx
Card individual untuk setiap tempat sampah:
- Fill level progress bar
- Status indicator dengan icon
- Location info
- Last update time

### NotificationList.tsx
List notifikasi dengan:
- Type-based color coding
- Mark as read / mark all read
- Delete notification
- Time formatting
- Empty state

## 🔔 Notification Types

- **INFO** (Blue): Informasi umum
- **WARNING** (Yellow): Peringatan caution
- **CRITICAL** (Red): Alert penting (sampah penuh)

## 🚨 Error Handling

- Try-catch blocks di semua endpoint
- Validation untuk input data
- Proper HTTP status codes
- Error messages dalam JSON response
- Console logging untuk debugging

## 📈 Performance

- Index pada frequently queried columns
- Efficient real-time subscriptions
- Polling dengan interval yang reasonable
- Optimistic UI updates
- Lazy loading notifications

## 🔐 Security

- RLS (Row Level Security) policies di Supabase
- Service role key untuk backend (sensitive operations)
- Anon key untuk frontend (limited access)
- Input validation di backend

## 🐛 Troubleshooting

### Supabase connection error
- Verify SUPABASE_URL dan SUPABASE_ANON_KEY di .env
- Check Supabase project status
- Verify API keys di Supabase dashboard

### Real-time subscriptions not working
- Check RLS policies are enabled
- Verify table names in subscriptions
- Check browser console for errors

### Notifications not triggering
- Ensure fill_level >= 80% untuk trigger
- Check notifications table di Supabase
- Verify browser notification permission

## 📝 Next Steps

- [ ] Add sensor simulator untuk testing
- [ ] Add historical data analytics
- [ ] Add email notifications
- [ ] Add SMS alerts
- [ ] Add mobile app
- [ ] Add prediction model
- [ ] Add maintenance scheduling

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)

## 📄 License

MIT License

## 👥 Support

Untuk bantuan atau pertanyaan, silakan buka issue di repository.
