import { supabase } from '../lib/supabase.js';

// Fetch active daily predictions and normalize to match the frontend shape
export async function fetchDailyPredictions() {
  const { data, error } = await supabase
    .from('daily_predictions')
    .select(`*, prediction_matches(*, match:matches(*))`)
    .eq('status', 'active');

  if (error) throw error;

  // Normalize: map first two matches to match_1 / match_2 and compute top-level odds
  return data.map((dp) => {
    const matches = (dp.prediction_matches || []).sort((a, b) => (a.match_order || 0) - (b.match_order || 0));
    const match_1 = matches[0]?.match ?? null;
    const match_2 = matches[1]?.match ?? null;

    // Determine top-level prediction text and odds
    const predictionText = dp.prediction_text || dp.title || dp.description || null;

    // Use a stored total_odds if present, otherwise multiply per-match odds when available
    let totalOdds = dp.total_odds ?? null;
    if (!totalOdds) {
      const product = matches.reduce((acc, m) => acc * (m.odds ?? 1), 1);
      totalOdds = product && product !== 1 ? Number(product.toFixed(2)) : null;
    }

    return {
      id: dp.id,
      title: dp.title,
      description: dp.description,
      country: dp.country,
      is_vip: dp.is_vip,
      prediction: predictionText,
      odds: totalOdds,
      match_1,
      match_2,
      raw: dp
    };
  });
}

// Admin: create a match
export async function createMatch({ league_id = null, country = null, home_team, away_team, match_date, status = 'Scheduled' }) {
  const { data, error } = await supabase.from('matches').insert([{ league_id, country, home_team, away_team, match_date, status }]).select().single();
  if (error) throw error;
  return data;
}

// Admin: create a daily prediction ticket with one or more matches
// matchesData: [{ match_id, match_order, predicted_outcome, odds, notes }]
export async function createDailyPrediction({ title, description = null, country = null, starts_at = null, expires_at = null, is_vip = false, created_by = null, matchesData = [] }) {
  // insert daily_predictions
  const { data: dp, error: dpErr } = await supabase.from('daily_predictions').insert([{ title, description, country, starts_at, expires_at, is_vip, created_by }]).select().single();
  if (dpErr) throw dpErr;

  // insert prediction_matches
  if (matchesData.length) {
    const rows = matchesData.map((m) => ({ daily_prediction_id: dp.id, match_id: m.match_id, match_order: m.match_order ?? 0, predicted_outcome: m.predicted_outcome, odds: m.odds, notes: m.notes }));
    const { error: pmErr } = await supabase.from('prediction_matches').insert(rows);
    if (pmErr) throw pmErr;
  }

  return dp;
}

// Manual archive: move a daily_prediction into past_predictions and remove the active record
export async function archivePrediction(dailyPredictionId) {
  // fetch the ticket and associated matches
  const { data: dpArr, error: dpErr } = await supabase.from('daily_predictions').select(`*, prediction_matches(*, match:matches(*))`).eq('id', dailyPredictionId).limit(1).single();
  if (dpErr) throw dpErr;
  const dp = dpArr;

  const matches = (dp.prediction_matches || []).sort((a, b) => (a.match_order || 0) - (b.match_order || 0));

  // build JSONB payloads
  const results = matches.map((m) => ({ match_id: m.match_id, predicted: m.predicted_outcome, odds: m.odds, result: m.result ?? null }));
  const odds = matches.map((m) => ({ match_id: m.match_id, odds: m.odds }));
  const history = { archived_from: 'daily_predictions', archived_by: supabase.auth.user()?.id ?? null };

  // insert into past_predictions
  const { data: past, error: pastErr } = await supabase.from('past_predictions').insert([{ daily_prediction_id: dp.id, title: dp.title, country: dp.country, is_vip: dp.is_vip, results: results, odds: odds, history }]).select().single();
  if (pastErr) throw pastErr;

  // delete prediction_matches and daily_prediction
  const { error: delMatchesErr } = await supabase.from('prediction_matches').delete().eq('daily_prediction_id', dp.id);
  if (delMatchesErr) throw delMatchesErr;

  const { error: delDpErr } = await supabase.from('daily_predictions').delete().eq('id', dp.id);
  if (delDpErr) throw delDpErr;

  return past;
}

export default {
  fetchDailyPredictions,
  createMatch,
  createDailyPrediction,
  archivePrediction
};

// --- Legacy CRUD for single-match `predictions` table (keeps AdminPredictions.jsx working)
export async function getPredictions() {
  const { data, error } = await supabase
    .from('predictions')
    .select(`*, matches(*)`)
    .order('id', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPrediction(values) {
  const { data, error } = await supabase
    .from('predictions')
    .insert(values)
    .select();

  if (error) throw error;
  return data;
}

export async function updatePrediction(id, values) {
  const { data, error } = await supabase
    .from('predictions')
    .update(values)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

export async function deletePrediction(id) {
  const { error } = await supabase
    .from('predictions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

