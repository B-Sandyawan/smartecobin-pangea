# Registration Error: "Failed to create user" - Troubleshooting Guide

## The Problem
When you try to register a new user, you get:
```
Error: "Failed to create user"
Details: "Could not find the 'name' column of 'users' in the schema cache"
```

## Root Cause
The `users` table in your Supabase database is either:
1. **Not created** — The SQL schema was never deployed
2. **Missing columns** — The `name` column doesn't exist
3. **Wrong structure** — The table has a different schema than expected

## Solution: Deploy the Database Schema

### Quick Fix (2 minutes)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Sign in and select your project: `qsikmiewoeaxgqohymjl`

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Schema SQL**
   - Open the file `SCHEMA_QUICK_FIX.sql` in your project
   - Copy all the code
   - Paste it into the Supabase SQL Editor
   - Click "Run" (Ctrl+Enter)

4. **Verify Tables Created**
   - Click "Table Editor" in the left sidebar
   - You should see:
     - ✅ `users` (with columns: id, name, email, password_hash, phone, role, etc.)
     - ✅ `trash_bins`
     - ✅ `notifications`

5. **Test Registration Again**
   - Go back to http://127.0.0.1:5000
   - Try registering a new account
   - It should work now! ✅

---

## Step-by-Step Screenshots

### Step 1: Go to Supabase Dashboard
```
https://supabase.com → Sign In → Select your project
```

### Step 2: Click SQL Editor
In the left sidebar, find "SQL Editor" and click it.

### Step 3: New Query
Click the "New Query" button (top right of the SQL panel).

### Step 4: Paste Schema
Copy the SQL from `SCHEMA_QUICK_FIX.sql` and paste it into the editor.

### Step 5: Run
Press Ctrl+Enter or click the "Run" button (bottom right).

---

## What If You Get Errors?

### Error: "table users already exists"
This is fine! It means you already have a users table. The `CREATE TABLE IF NOT EXISTS` will skip it.
The issue is probably that the table is missing columns.

**Fix:**
- Delete the old table (click Table Editor → select users → Delete)
- Run the schema SQL again

### Error: "UNIQUE constraint failed: users.email"
This means the table already has data. Don't worry!
- The schema uses `IF NOT EXISTS`, so it won't recreate tables that exist
- Just the missing columns will be added

### Error: "could not translate type <something>"
This is usually a SQL syntax error. Make sure you:
- Used the `SCHEMA_QUICK_FIX.sql` file (easier than the full schema)
- Didn't accidentally modify the SQL
- Are using a recent Supabase version

---

## Verification Checklist

After running the schema, verify with this query in the SQL Editor:

```sql
-- Check users table exists and has all columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

You should see columns like:
- id (uuid)
- name (text)
- email (text)
- password_hash (text)
- phone (text)
- role (text)
- avatar_url (text)
- created_at (timestamp)
- last_login (timestamp)
- updated_at (timestamp)

---

## If It Still Doesn't Work

1. **Restart the dev server**
   ```powershell
   # Stop: Ctrl+C in the terminal
   # Restart: npm run dev
   ```

2. **Clear browser cache**
   - Press Ctrl+Shift+Delete
   - Clear all browsing data

3. **Check the backend logs**
   - Look at the terminal running `npm run dev`
   - Look for any error messages starting with "Error creating user:"

4. **Try a simpler password**
   - Register with password: `password123`
   - Make sure it's at least 6 characters

5. **Check Supabase credentials in .env**
   - Open `.env` file
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are not empty
   - They should look like:
     ```
     SUPABASE_URL=https://qsikmiewoeaxgqohymjl.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
     ```

---

## Quick Testing After Schema Deployment

Use this curl command to test registration:

```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    phone = "+62123456789"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

Expected response (if successful):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "public"
  }
}
```

---

## Files Needed

- `SCHEMA_QUICK_FIX.sql` — Easiest schema to deploy (use this one!)
- `SUPABASE_SCHEMA.sql` — Full schema with all features
- `.env` — Your Supabase credentials

All are in your project root directory.
