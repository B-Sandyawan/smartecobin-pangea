#!/bin/bash
# Smart Trash Bin API Test Script
# Run ini dari terminal untuk test semua API endpoints

API_URL="http://127.0.0.1:5000"

echo "========================================="
echo "Smart Trash Bin API Test"
echo "========================================="

# Test 1: Create/Update Sensor Data
echo -e "\n[1] Testing POST /api/sensor/update"
curl -X POST "$API_URL/api/sensor/update" \
  -H "Content-Type: application/json" \
  -d '{
    "binId": "550e8400-e29b-41d4-a716-446655440001",
    "fillLevel": 45,
    "location": "Jalan Sudirman No. 45",
    "binName": "Eco Bin A"
  }'

# Test 2: Update with high fill level (should create notification)
echo -e "\n\n[2] Testing POST /api/sensor/update with high fill level (85%)"
curl -X POST "$API_URL/api/sensor/update" \
  -H "Content-Type: application/json" \
  -d '{
    "binId": "550e8400-e29b-41d4-a716-446655440002",
    "fillLevel": 85,
    "location": "Plaza Senayan",
    "binName": "Eco Bin B"
  }'

# Test 3: Get all trash bins
echo -e "\n\n[3] Testing GET /api/sensor/bins"
curl -X GET "$API_URL/api/sensor/bins"

# Test 4: Get specific bin
echo -e "\n\n[4] Testing GET /api/sensor/bin/:id"
curl -X GET "$API_URL/api/sensor/bin/550e8400-e29b-41d4-a716-446655440001"

# Test 5: Get notifications
echo -e "\n\n[5] Testing GET /api/notifications"
curl -X GET "$API_URL/api/notifications?limit=10"

# Test 6: Get unread count
echo -e "\n\n[6] Testing GET /api/notifications/unread/count"
curl -X GET "$API_URL/api/notifications/unread/count"

echo -e "\n\n========================================="
echo "Tests completed!"
echo "========================================="

# Instructions for manual testing:
# 1. Update bin fill levels multiple times to see real-time updates
# 2. Check Supabase dashboard to verify data is stored
# 3. Open http://127.0.0.1:5000/smart-monitoring in browser
# 4. Check browser console for real-time subscription logs
# 5. Test notification permissions in browser
