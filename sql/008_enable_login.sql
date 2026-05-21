-- Enable site-wide login
-- Run this in your Supabase SQL editor as an admin

UPDATE public.site_settings
SET allow_login = TRUE
WHERE id IS NOT NULL;

-- Optionally verify the change:
-- select id, allow_login, allow_registration from public.site_settings;
