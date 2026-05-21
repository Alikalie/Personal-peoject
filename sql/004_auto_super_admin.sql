-- ===================================================
-- Auto-assign Super Admin to All Auth Users
-- Run this in Supabase SQL Editor
-- ===================================================

-- Step 1: Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, is_admin)
  VALUES (new.id, new.email, 'super_admin', true);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create trigger for new auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Grant super_admin to existing auth users
INSERT INTO public.profiles (id, email, role, is_admin)
SELECT id, email, 'super_admin', true
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin', is_admin = true;

-- Verify all users are now super_admin
SELECT id, email, role, is_admin FROM public.profiles ORDER BY created_at DESC;
