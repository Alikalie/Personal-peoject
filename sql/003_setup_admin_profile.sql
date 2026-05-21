-- ===================================================
-- Admin Profile Setup
-- Run this to make yourself an admin
-- ===================================================

-- Step 1: Add is_admin column to profiles table (if not exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Step 2: Make yourself admin
-- Replace '72a15a0e-3e77-4602-8e4c-b1f11ed49ffd' with YOUR user ID
UPDATE public.profiles
SET 
  role = 'super_admin',
  is_admin = true
WHERE id = '72a15a0e-3e77-4602-8e4c-b1f11ed49ffd';

-- To find YOUR user ID, run:
-- SELECT id, email FROM auth.users;
-- Then copy your UUID and paste it above

-- Verify the update worked:
-- SELECT id, email, role, is_admin FROM public.profiles WHERE is_admin = true;
