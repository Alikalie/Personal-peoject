# Database Setup Guide - Betting Platform

## Quick Fix Summary

Your errors are due to **missing database tables**. Follow these steps to fix everything:

---

## Step 1: Create Database Tables (REQUIRED)

1. **Go to Supabase Dashboard** → Your Project → **SQL Editor**
2. **Create a new query** and paste the entire contents from: `sql/001_create_schema.sql`
3. **Click "Run"** to execute

✅ This will create all required tables:
- `leagues`
- `matches` 
- `vip_plans`
- `predictions`
- `site_settings`
- `contact_messages`
- `profiles`
- `admin_users`

---

## Step 2: Verify Tables Were Created

Run this query to verify:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all the tables listed above.

---

## Step 3: Fix Admin Buttons (ALREADY DONE ✅)

I've updated `src/components/ProtectedAdminRoute.jsx` to properly handle authentication.

---

## Step 4: Test Your Admin Features

1. **Start your app**: `npm run dev`
2. **Log in** as a user
3. Go to Admin Dashboard - you should now be able to:
   - ✅ Create/edit/delete Leagues
   - ✅ Create/edit/delete Matches
   - ✅ Create/edit/delete VIP Plans
   - ✅ Create/edit/delete Predictions
   - ✅ Save Site Settings

---

## Step 5 (Optional): Set Up Admin Users Table

If you want strict admin-only access later, use `sql/002_setup_admin_user.sql`:

1. Find your user UUID: In Supabase Dashboard → Authentication → Users (copy the ID)
2. Run this query in SQL Editor:
```sql
INSERT INTO public.admin_users (user_id, role)
VALUES ('YOUR_USER_ID_HERE'::uuid, 'admin');
```

Replace `YOUR_USER_ID_HERE` with your actual UUID.

Then update the ProtectedAdminRoute to uncomment the admin check (currently commented for easier setup).

---

## Troubleshooting

### Still seeing "Could not find table..." error?
- ✅ Make sure you ran the entire `001_create_schema.sql` file
- ✅ Refresh your browser after running the SQL
- ✅ Check that all tables appear in Supabase SQL Editor

### Save buttons still not working?
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page (Ctrl+R)
- Check browser console for errors (F12)

### Can't access admin pages?
- Make sure you're logged in first
- Check the browser console for auth errors

---

## Database Schema Overview

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `leagues` | Sports leagues | name, country, icon_url, status |
| `matches` | Match fixtures | league_id, home_team, away_team, match_date, status |
| `predictions` | Betting predictions | match_id, prediction, current_odds, result, is_vip |
| `vip_plans` | VIP subscription tiers | name, price, status, description |
| `site_settings` | Site configuration | site_title, homepage_headline, nav_* flags |
| `contact_messages` | Support contact info | label, detail, icon |
| `profiles` | User profiles | (linked to auth.users) |
| `admin_users` | Admin designations | user_id, role |

---

## Next Steps

After tables are created, you can:

1. **Add sample data** via admin UI
2. **Configure RLS policies** for stricter security
3. **Set up proper admin roles** using admin_users table
4. **Enable email notifications** for admin actions

All features should now work! 🎉
