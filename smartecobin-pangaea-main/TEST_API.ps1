# Smart Trash Bin API Test Script (PowerShell)
# Run ini untuk test semua API endpoints

$API_URL = "http://127.0.0.1:5000"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Smart Trash Bin API Test" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Test 1: Create/Update Sensor Data
Write-Host "`n[1] Testing POST /api/sensor/update" -ForegroundColor Yellow
$body1 = @{
    binId = "550e8400-e29b-41d4-a716-446655440001"
    fillLevel = 45
    location = "Jalan Sudirman No. 45"
    binName = "Eco Bin A"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/api/sensor/update" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $body1 | ConvertTo-Json | Write-Host

# Test 2: Update with high fill level (should create notification)
Write-Host "`n[2] Testing POST /api/sensor/update with high fill level (85%)" -ForegroundColor Yellow
$body2 = @{
    binId = "550e8400-e29b-41d4-a716-446655440002"
    fillLevel = 85
    location = "Plaza Senayan"
    binName = "Eco Bin B"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/api/sensor/update" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $body2 | ConvertTo-Json | Write-Host

# Test 3: Get all trash bins
Write-Host "`n[3] Testing GET /api/sensor/bins" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$API_URL/api/sensor/bins" -Method GET | ConvertTo-Json | Write-Host

# Test 4: Get specific bin
Write-Host "`n[4] Testing GET /api/sensor/bin/:id" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$API_URL/api/sensor/bin/550e8400-e29b-41d4-a716-446655440001" `
    -Method GET | ConvertTo-Json | Write-Host

# Test 5: Get notifications
Write-Host "`n[5] Testing GET /api/notifications" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$API_URL/api/notifications?limit=10" -Method GET | ConvertTo-Json | Write-Host

# Test 6: Get unread count
Write-Host "`n[6] Testing GET /api/notifications/unread/count" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$API_URL/api/notifications/unread/count" -Method GET | ConvertTo-Json | Write-Host

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "Tests completed!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host @"
Instructions for manual testing:
1. Update bin fill levels multiple times to see real-time updates
2. Check Supabase dashboard to verify data is stored
3. Open http://127.0.0.1:5000/smart-monitoring in browser
4. Check browser console for real-time subscription logs
5. Test notification permissions in browser
"@ -ForegroundColor Green
