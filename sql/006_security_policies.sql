-- ===================================================
-- Security policies: add is_admin helper and tighten RLS
-- Run this as an admin in Supabase SQL editor
-- ===================================================

-- 1) Create helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.admin_users au WHERE au.user_id = auth.uid()
  )
  OR EXISTS(
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND (p.role = 'super_admin' OR p.is_admin = TRUE)
  );
$$;

-- 2) Alter policies to require is_admin() for admin operations
-- Leagues
ALTER POLICY "Only admins can insert leagues" ON public.leagues FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only admins can update leagues" ON public.leagues FOR UPDATE USING (public.is_admin());
ALTER POLICY "Only admins can delete leagues" ON public.leagues FOR DELETE USING (public.is_admin());

-- Matches
ALTER POLICY "Only admins can insert matches" ON public.matches FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only admins can update matches" ON public.matches FOR UPDATE USING (public.is_admin());
ALTER POLICY "Only admins can delete matches" ON public.matches FOR DELETE USING (public.is_admin());

-- VIP plans
ALTER POLICY "Only admins can insert vip_plans" ON public.vip_plans FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only admins can update vip_plans" ON public.vip_plans FOR UPDATE USING (public.is_admin());
ALTER POLICY "Only admins can delete vip_plans" ON public.vip_plans FOR DELETE USING (public.is_admin());

-- Predictions (legacy)
ALTER POLICY "Only admins can insert predictions" ON public.predictions FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only admins can update predictions" ON public.predictions FOR UPDATE USING (public.is_admin());
ALTER POLICY "Only admins can delete predictions" ON public.predictions FOR DELETE USING (public.is_admin());

-- Site settings (only admins can update)
ALTER POLICY "Only admins can update site_settings" ON public.site_settings FOR UPDATE USING (public.is_admin());

-- Contact messages
ALTER POLICY "Only admins can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only admins can update contact_messages" ON public.contact_messages FOR UPDATE USING (public.is_admin());
ALTER POLICY "Only admins can delete contact_messages" ON public.contact_messages FOR DELETE USING (public.is_admin());

-- Admin users management: only existing admins can manage admin_users
ALTER POLICY "Only super admins can manage admin_users" ON public.admin_users FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only super admins can manage admin_users" ON public.admin_users FOR DELETE USING (public.is_admin());

-- Daily predictions / prediction_matches / past_predictions (from restructure)
-- These policies were created with permissive checks; tighten them now.
ALTER POLICY "Only admins can insert daily_predictions" ON public.daily_predictions FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only admins can update daily_predictions" ON public.daily_predictions FOR UPDATE USING (public.is_admin());
ALTER POLICY "Only admins can delete daily_predictions" ON public.daily_predictions FOR DELETE USING (public.is_admin());

ALTER POLICY "Only admins can insert prediction_matches" ON public.prediction_matches FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only admins can update prediction_matches" ON public.prediction_matches FOR UPDATE USING (public.is_admin());
ALTER POLICY "Only admins can delete prediction_matches" ON public.prediction_matches FOR DELETE USING (public.is_admin());

ALTER POLICY "Only admins can insert past_predictions" ON public.past_predictions FOR INSERT WITH CHECK (public.is_admin());
ALTER POLICY "Only admins can update past_predictions" ON public.past_predictions FOR UPDATE USING (public.is_admin());
ALTER POLICY "Only admins can delete past_predictions" ON public.past_predictions FOR DELETE USING (public.is_admin());

-- End of security policy updates
