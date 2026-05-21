import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function HomePage() {
  const [topTips, setTopTips] = useState([])
  const [tipsLoading, setTipsLoading] = useState(true)
  const [tipsError, setTipsError] = useState(null)

  useEffect(() => {
    fetchTopTips()
  }, [])

  async function fetchTopTips() {
    setTipsLoading(true)
    setTipsError(null)

    const { data, error } = await supabase
      .from("predictions")
      .select(`
        id,
        prediction,
        current_odds,
        is_vip,
        matches (
          home_team,
          away_team,
          match_date
        )
      `)
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      setTipsError(error)
      setTopTips([])
    } else {
      setTopTips(data || [])
    }

    setTipsLoading(false)
  }

  const topTipItems = topTips.slice(0, 3)

  const formatMatchName = (tip) => {
    if (tip.matches?.home_team && tip.matches?.away_team) {
      return `${tip.matches.home_team} vs ${tip.matches.away_team}`
    }
    return "Top Tip"
  }

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight">
            Daily Winning
            <span className="text-sky-400"> Football Tips</span>
          </h1>

            Get accurate football predictions, VIP betting tips, odds history,
            match analysis, and expert picks from around the world.

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/predictions"
              className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-base transition shadow-lg shadow-sky-500/20"
            >
              View Predictions
            </Link>

            <Link
              to="/vip"
              className="px-6 py-3 rounded-2xl border border-slate-300 hover:border-sky-400 font-semibold text-sm transition"
            >
              Become VIP
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-14">
            <div>
              <h2 className="text-3xl font-black text-sky-400">95%</h2>
              <p className="text-slate-600 mt-2">Winning Accuracy</p>
            </div>

            <div>
              <h2 className="text-3xl font-black text-sky-400">50K+</h2>
              <p className="text-slate-600 mt-2">Community Members</p>
            </div>

            <div>
              <h2 className="text-3xl font-black text-sky-400">1000+</h2>
              <p className="text-slate-600 mt-2">Predictions Posted</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full"></div>

          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Today's Top Tips</h3>
                <p className="text-slate-600 mt-1">From the daily table</p>
              </div>

              <div className="px-3 py-2 rounded-xl bg-sky-500 text-black font-bold text-sm">
                VIP
              </div>
            </div>

            {tipsLoading ? (
              <p className="text-slate-600">Loading today's top tips...</p>
            ) : tipsError ? (
              <p className="text-red-400">Failed to load top tips.</p>
            ) : (
              <div className="space-y-5">
                {topTipItems.length > 0 ? (
                  topTipItems.map((tip) => (
                    <div key={tip.id} className="bg-slate-100 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-bold">{formatMatchName(tip)}</h4>
                        <span className="text-sky-400 font-bold">{tip.current_odds || "-"}</span>
                      </div>

                      <p className="text-slate-700 text-sm">Prediction: {tip.prediction || "N/A"}</p>
                      <p className="text-slate-500 text-xs mt-2">Daily • {tip.matches?.match_date ? new Date(tip.matches.match_date).toLocaleDateString() : "Date TBD"}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-100 rounded-2xl p-4">
                    <p className="text-slate-600">No top tips available right now.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black">
            Why Choose <span className="text-sky-400">BetPro</span>
          </h2>

          <p className="text-slate-600 mt-5 text-base max-w-2xl mx-auto">
            Advanced football predictions platform built for serious bettors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-sky-400 transition">
            <div className="text-4xl mb-5">⚽</div>
            <h3 className="text-xl font-bold mb-3">All Matches</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Predictions from top matches all across the globe.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-sky-400 transition">
            <div className="text-4xl mb-5">📈</div>
            <h3 className="text-xl font-bold mb-3">Odds History</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Track odds movement and analyze prediction performance over time.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-sky-400 transition">
            <div className="text-4xl mb-5">🔒</div>
            <h3 className="text-xl font-bold mb-3">VIP Predictions</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Exclusive premium betting tips and high-confidence predictions.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-sky-400 transition">
            <div className="text-4xl mb-5">🏆</div>
            <h3 className="text-xl font-bold mb-3">Expert Analysis</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Detailed match previews, team form, and betting insights.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-sky-500 to-sky-700 py-20 text-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black">Unlock Premium VIP Predictions</h2>

          <p className="text-base mt-5 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Access exclusive high-odds football tips, daily accumulator picks,
            and premium betting analysis from expert tipsters.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Link
              to="/vip"
              className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
            >
              Join VIP Now
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 rounded-2xl border-2 border-slate-900 font-bold hover:bg-slate-900 hover:text-white transition"
            >
              Contact Admin
            </Link>
          </div>
        </div>
      </section>



      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white border border-slate-200 rounded-[40px] p-10 text-center">
          <h3 className="text-xl font-bold text-slate-900">Predictions</h3>
          <p className="text-slate-600 mt-3">View today's and past predictions on the Predictions page.</p>
          <div className="mt-6">
            <Link to="/predictions" className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold">
              View Predictions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
export default HomePage;
