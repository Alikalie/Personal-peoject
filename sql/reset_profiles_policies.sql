-- Reset and create safe policies for public.profiles
-- Run these in the Supabase SQL editor as an admin.

-- Disable RLS temporarily for debugging (optional)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Recommended: Recreate owner-only policies using auth.uid()
DROP POLICY IF EXISTS "Profiles - Owners" ON public.profiles;
CREATE POLICY "Profiles: users can read their own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Profiles - Update" ON public.profiles;
CREATE POLICY "Profiles: users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- If your profiles.id is UUID, use auth.uid()::uuid = id instead. For example:
-- CREATE POLICY "Profiles: users can read their own profile" ON public.profiles
--   FOR SELECT
--   USING (auth.uid()::uuid = id);

-- Re-enable RLS if you disabled it
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Note: Do NOT create policies that SELECT from profiles inside profiles policies (no recursion).
-- If you need admin roles, implement them using separate role-checking tables or custom claims.
