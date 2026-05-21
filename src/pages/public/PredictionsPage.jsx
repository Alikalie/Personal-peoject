import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { resultStatusClasses } from "../../utils/constants";

function PredictionsPage() {
  const [dailyPredictions, setDailyPredictions] = useState([])
  const [pastPredictions, setPastPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPredictions()
  }, [])

  async function fetchPredictions() {
    setLoading(true)
    setError(null)

    const selectFields = `
      id,
      prediction,
      current_odds,
      result,
      is_vip,
      matches (*)
    `

    const { data: daily, error: e1 } = await supabase
      .from('predictions')
      .select(selectFields)
      .eq('result', 'pending')
      .order('match_date', { ascending: true, foreignTable: 'matches' })

    const { data: past, error: e2 } = await supabase
      .from('predictions')
      .select(selectFields)
      .in('result', ['win', 'lose', 'void'])
      .order('match_date', { ascending: false, foreignTable: 'matches' })

    if (e1 || e2) setError(e1 || e2)
    setDailyPredictions(daily || [])
    setPastPredictions(past || [])
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-14">
      <div>
        <h1 className="text-4xl font-black text-sky-400 mb-3">Predictions</h1>
        <p className="text-slate-600 max-w-3xl mb-6">
          Browse the latest predictions for today and review past performance from recent matches.
        </p>
        {loading && <p className="text-slate-600">Loading predictions...</p>}
        {error && (
          <div className="text-red-700 bg-red-100 p-3 rounded-md mb-4">
            Error loading predictions: {error.message || JSON.stringify(error)}
          </div>
        )}
      </div>

      <section className="bg-white border border-slate-200 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Daily Predictions</h2>
            <p className="text-slate-600 text-sm">Today's top betting tips and odds.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-600 uppercase text-xs tracking-wide">
                <th className="px-4 py-3">Home Team</th>
                <th className="px-4 py-3">Away Team</th>
                <th className="px-4 py-3">Prediction</th>
                <th className="px-4 py-3">Odds</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">VIP</th>
                <th className="px-4 py-3">Match Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dailyPredictions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">{item.matches?.home_team || '-'}</td>
                  <td className="px-4 py-4 text-slate-700">{item.matches?.away_team || '-'}</td>
                  <td className="px-4 py-4 text-slate-700">{item.prediction}</td>
                  <td className="px-4 py-4 text-sky-400">{item.current_odds || item.odds}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${resultStatusClasses[item.result] || 'bg-slate-500 text-white'}`}>
                      {item.result}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{item.is_vip ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 text-slate-700">{item.matches?.match_date || '-'}</td>
                </tr>
              ))}
              {dailyPredictions.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-slate-600">No daily predictions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Past Predictions</h2>
            <p className="text-slate-600 text-sm">Recent results and performance history.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-600 uppercase text-xs tracking-wide">
                <th className="px-4 py-3">Home Team</th>
                <th className="px-4 py-3">Away Team</th>
                <th className="px-4 py-3">Prediction</th>
                <th className="px-4 py-3">Odds</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">VIP</th>
                <th className="px-4 py-3">Match Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pastPredictions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">{item.matches?.home_team || '-'}</td>
                  <td className="px-4 py-4 text-slate-700">{item.matches?.away_team || '-'}</td>
                  <td className="px-4 py-4 text-slate-700">{item.prediction}</td>
                  <td className="px-4 py-4 text-sky-400">{item.current_odds || item.odds}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${resultStatusClasses[item.result] || 'bg-slate-500 text-white'}`}>
                      {item.result}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{item.is_vip ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 text-slate-700">{item.matches?.match_date || '-'}</td>
                </tr>
              ))}
              {pastPredictions.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-slate-600">No past predictions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
export default PredictionsPage;
