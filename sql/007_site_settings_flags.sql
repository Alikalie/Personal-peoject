-- Add allow_login and allow_registration flags to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS allow_login BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS allow_registration BOOLEAN DEFAULT FALSE;

-- Optional: set defaults for existing site settings row (id = 1)
UPDATE public.site_settings SET allow_login = FALSE, allow_registration = FALSE WHERE id IS NOT NULL;
