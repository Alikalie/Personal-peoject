-- ===================================================
-- ADMIN USER SETUP
-- Run this after creating tables to add your first admin
-- ===================================================

-- TO USE THIS:
-- 1. First, get your user ID from Supabase Auth (go to Users tab)
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Run this query in SQL Editor

-- Example (uncomment and modify):
-- INSERT INTO public.admin_users (user_id, role)
-- VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'admin');

-- For now, let's set a permissive policy that allows any authenticated user
-- to manage these tables (you can restrict later with proper admin_users checks)

-- If you have multiple users, manually add admins using this query:
-- INSERT INTO public.admin_users (user_id, role) VALUES ('USER_UUID_HERE'::uuid, 'admin');

-- To find your user UUID, run:
-- SELECT id, email FROM auth.users;

-- Then copy the UUID and paste it into an INSERT statement above
