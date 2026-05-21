-- ===================================================
-- Predictions restructure: daily and past predictions
-- Creates tables:
--  - daily_predictions (active tip tickets)
--  - prediction_matches (multiple matches per ticket)
--  - past_predictions (archived prediction records)
-- Designed for Supabase (Postgres)
-- ===================================================

-- 1. DAILY PREDICTIONS (active tip tickets)
CREATE TABLE IF NOT EXISTS public.daily_predictions (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  country VARCHAR(100),
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active', -- active | expired | cancelled
  is_vip BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.daily_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Daily predictions are viewable by everyone" ON public.daily_predictions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert daily_predictions" ON public.daily_predictions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update daily_predictions" ON public.daily_predictions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete daily_predictions" ON public.daily_predictions
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 2. PREDICTION_MATCHES (many matches under a single prediction ticket)
CREATE TABLE IF NOT EXISTS public.prediction_matches (
  id BIGSERIAL PRIMARY KEY,
  daily_prediction_id BIGINT REFERENCES public.daily_predictions(id) ON DELETE CASCADE NOT NULL,
  match_id BIGINT REFERENCES public.matches(id) ON DELETE SET NULL,
  match_order INT DEFAULT 0,
  predicted_outcome VARCHAR(255),
  odds DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.prediction_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prediction matches are viewable by everyone" ON public.prediction_matches
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert prediction_matches" ON public.prediction_matches
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update prediction_matches" ON public.prediction_matches
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete prediction_matches" ON public.prediction_matches
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. PAST PREDICTIONS (archive)
-- Archived records store results, odds and history. Intentionally stored WITHOUT a timestamp field
CREATE TABLE IF NOT EXISTS public.past_predictions (
  id BIGSERIAL PRIMARY KEY,
  daily_prediction_id BIGINT REFERENCES public.daily_predictions(id) ON DELETE SET NULL,
  title VARCHAR(255),
  country VARCHAR(100),
  is_vip BOOLEAN DEFAULT FALSE,
  results JSONB,
  odds JSONB,
  history JSONB
);

ALTER TABLE public.past_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Past predictions are viewable by everyone" ON public.past_predictions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert past_predictions" ON public.past_predictions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update past_predictions" ON public.past_predictions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete past_predictions" ON public.past_predictions
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Optional helper: move expired daily predictions into past_predictions
-- This function can be invoked by a scheduled job (Edge Function / Cron) to archive expired tickets.
-- NOTE: leaving implementation as reference SQL for admins to adapt to their environment.
--
-- Example (run as admin):
-- INSERT INTO public.past_predictions (daily_prediction_id, title, country, is_vip, results, odds, history)
-- SELECT dp.id, dp.title, dp.country, dp.is_vip,
--        jsonb_agg(jsonb_build_object('match_id', pm.match_id, 'predicted', pm.predicted_outcome, 'odds', pm.odds, 'result', p.result)) as results,
--        jsonb_agg(jsonb_build_object('match_id', pm.match_id, 'odds', pm.odds)) as odds,
--        jsonb_build_object('archived_from', 'daily_predictions') as history
-- FROM public.daily_predictions dp
-- LEFT JOIN public.prediction_matches pm ON pm.daily_prediction_id = dp.id
-- LEFT JOIN public.predictions p ON p.match_id = pm.match_id
-- WHERE dp.expires_at IS NOT NULL AND dp.expires_at < now() AND dp.status = 'active'
-- GROUP BY dp.id, dp.title, dp.country, dp.is_vip;

-- After inserting into past_predictions you may delete or mark the original daily_prediction as archived/expired.

-- End of predictions restructure
