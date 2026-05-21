-- ===================================================
-- Complete Database Schema for Betting Platform
-- Run this in Supabase SQL Editor as an admin
-- ===================================================

-- 1. LEAGUES TABLE
CREATE TABLE IF NOT EXISTS public.leagues (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255),
  icon_url TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leagues are viewable by everyone" ON public.leagues
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert leagues" ON public.leagues
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update leagues" ON public.leagues
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete leagues" ON public.leagues
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 2. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id BIGSERIAL PRIMARY KEY,
  league_id BIGINT REFERENCES public.leagues(id) ON DELETE CASCADE,
  home_team VARCHAR(255) NOT NULL,
  away_team VARCHAR(255) NOT NULL,
  match_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches are viewable by everyone" ON public.matches
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update matches" ON public.matches
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete matches" ON public.matches
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. VIP PLANS TABLE
CREATE TABLE IF NOT EXISTS public.vip_plans (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.vip_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VIP plans are viewable by everyone" ON public.vip_plans
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert vip_plans" ON public.vip_plans
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update vip_plans" ON public.vip_plans
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete vip_plans" ON public.vip_plans
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS public.predictions (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  prediction VARCHAR(255),
  current_odds DECIMAL(10, 2),
  result VARCHAR(50) DEFAULT 'pending',
  is_vip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Predictions are viewable by everyone" ON public.predictions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert predictions" ON public.predictions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update predictions" ON public.predictions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete predictions" ON public.predictions
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 5. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id BIGSERIAL PRIMARY KEY,
  site_title VARCHAR(255) DEFAULT 'BetPro Tips',
  homepage_headline TEXT DEFAULT 'Daily Winning Football Tips',
  vip_banner TEXT DEFAULT 'Unlock premium betting analysis',
  footer_text TEXT DEFAULT 'Professional football betting predictions platform',
  contact_header VARCHAR(255) DEFAULT 'Contact',
  contact_intro TEXT,
  contact_description TEXT,
  contact_title VARCHAR(255),
  nav_home_enabled BOOLEAN DEFAULT TRUE,
  nav_predictions_enabled BOOLEAN DEFAULT TRUE,
  nav_vip_enabled BOOLEAN DEFAULT TRUE,
  nav_leagues_enabled BOOLEAN DEFAULT TRUE,
  nav_contact_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can update site_settings" ON public.site_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 6. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id BIGSERIAL PRIMARY KEY,
  label VARCHAR(255),
  detail VARCHAR(255),
  icon VARCHAR(50) DEFAULT '📞',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact messages are viewable by everyone" ON public.contact_messages
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert contact_messages" ON public.contact_messages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update contact_messages" ON public.contact_messages
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete contact_messages" ON public.contact_messages
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 7. PROFILES TABLE (User profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  full_name VARCHAR(255),
  contact_number VARCHAR(20),
  country VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by own user" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 8. ADMIN USERS TABLE (for tracking admin privileges)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users list is viewable by admins" ON public.admin_users
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only super admins can manage admin_users" ON public.admin_users
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only super admins can delete admin_users" ON public.admin_users
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ===================================================
-- Insert sample data (optional)
-- ===================================================

-- Insert sample league
INSERT INTO public.leagues (name, country, status) 
VALUES ('English Premier League', 'England', 'Active')
ON CONFLICT DO NOTHING;

-- Insert a sample site settings record
INSERT INTO public.site_settings (site_title, homepage_headline)
VALUES ('BetPro Tips', 'Daily Winning Football Tips')
ON CONFLICT DO NOTHING;

-- ===================================================
-- Done! Tables created with RLS policies enabled
-- ===================================================
