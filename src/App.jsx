import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, useNavigate } from "react-router-dom"
import { supabase } from "./lib/supabase"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminPredictions from "./pages/admin/AdminPredictions"
import AdminMatches from "./pages/admin/AdminMatches"
import AdminLeagues from "./pages/admin/AdminLeagues"
import AdminUsers from "./pages/admin/AdminUsers"
import SiteSettingsAdmin from "./pages/admin/SiteSettingsAdmin"
import VipManagementAdmin from "./pages/admin/VipManagementAdmin"

const resultStatusClasses = {
  pending: "bg-yellow-300 text-black",
  win: "bg-emerald-500 text-white",
  lose: "bg-red-500 text-white",
  void: "bg-gray-500 text-white",
}

function Navbar() {
  const linkClasses = ({ isActive }) =>
    `hover:text-sky-400 transition ${isActive ? "text-sky-400" : "text-gray-300"}`

  return (
    <nav className="border-b border-gray-800 bg-gray-950/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xl font-bold tracking-wide text-sky-400">
            BetPro Tips
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" className={linkClasses} end>
            Home
          </NavLink>
          <NavLink to="/predictions" className={linkClasses}>
            Predictions
          </NavLink>
          <NavLink to="/vip" className={linkClasses}>
            VIP Tips
          </NavLink>
          <NavLink to="/leagues" className={linkClasses}>
            Leagues
          </NavLink>
          <NavLink to="/admin" className={linkClasses}>
            Admin
          </NavLink>
          <NavLink to="/contact" className={linkClasses}>
            Contact
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl border border-gray-700 hover:border-sky-400 transition text-sm"
          >
            Login
          </Link>

          <Link
            to="/vip"
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold transition text-sm"
          >
            Join VIP
          </Link>
        </div>
      </div>
    </nav>
  )
}

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAdmin") === "true"
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

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
      .from("daily")
      .select(`
        id,
        home_team,
        away_team,
        match_date,
        league,
        prediction,
        current_odds,
        is_vip
      `)
      .order("match_date", { ascending: true })
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
    if (tip.home_team && tip.away_team) return `${tip.home_team} vs ${tip.away_team}`
    return tip.match || tip.match_name || tip.league || "Top Tip"
  }

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight">
            Daily Winning
            <span className="text-sky-400"> Football Tips</span>
          </h1>

          <p className="text-gray-400 text-base mt-6 leading-relaxed max-w-xl">
            Get accurate football predictions, VIP betting tips, odds history,
            match analysis, and expert picks from all major leagues worldwide.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/predictions"
              className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-base transition shadow-lg shadow-sky-500/20"
            >
              View Predictions
            </Link>

            <Link
              to="/vip"
              className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-sky-400 font-semibold text-sm transition"
            >
              Become VIP
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-14">
            <div>
              <h2 className="text-3xl font-black text-sky-400">95%</h2>
              <p className="text-gray-400 mt-2">Winning Accuracy</p>
            </div>

            <div>
              <h2 className="text-3xl font-black text-sky-400">50K+</h2>
              <p className="text-gray-400 mt-2">Community Members</p>
            </div>

            <div>
              <h2 className="text-3xl font-black text-sky-400">1000+</h2>
              <p className="text-gray-400 mt-2">Predictions Posted</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full"></div>

          <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Today's Top Tips</h3>
                <p className="text-gray-400 mt-1">From the daily table</p>
              </div>

              <div className="px-3 py-2 rounded-xl bg-sky-500 text-black font-bold text-sm">
                VIP
              </div>
            </div>

            {tipsLoading ? (
              <p className="text-gray-400">Loading today's top tips...</p>
            ) : tipsError ? (
              <p className="text-red-400">Failed to load top tips.</p>
            ) : (
              <div className="space-y-5">
                {topTipItems.length > 0 ? (
                  topTipItems.map((tip) => (
                    <div key={tip.id} className="bg-gray-800 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-bold">{formatMatchName(tip)}</h4>
                        <span className="text-sky-400 font-bold">{tip.current_odds || "-"}</span>
                      </div>

                      <p className="text-gray-300 text-sm">Prediction: {tip.prediction || "N/A"}</p>
                      <p className="text-gray-500 text-xs mt-2">{tip.league || "Daily"} • {tip.match_date ? new Date(tip.match_date).toLocaleDateString() : "Date TBD"}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-800 rounded-2xl p-4">
                    <p className="text-gray-400">No top tips available right now.</p>
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

          <p className="text-gray-400 mt-5 text-base max-w-2xl mx-auto">
            Advanced football predictions platform built for serious bettors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-sky-400 transition">
            <div className="text-4xl mb-5">⚽</div>
            <h3 className="text-xl font-bold mb-3">All Leagues</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Predictions from Premier League, La Liga, Serie A, Bundesliga,
              Champions League, and more.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-sky-400 transition">
            <div className="text-4xl mb-5">📈</div>
            <h3 className="text-xl font-bold mb-3">Odds History</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Track odds movement and analyze prediction performance over time.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-sky-400 transition">
            <div className="text-4xl mb-5">🔒</div>
            <h3 className="text-xl font-bold mb-3">VIP Predictions</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Exclusive premium betting tips and high-confidence predictions.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-sky-400 transition">
            <div className="text-4xl mb-5">🏆</div>
            <h3 className="text-xl font-bold mb-3">Expert Analysis</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
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
              className="px-8 py-4 rounded-2xl bg-black text-white font-bold hover:bg-gray-900 transition"
            >
              Join VIP Now
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 rounded-2xl border-2 border-black font-bold hover:bg-black hover:text-white transition"
            >
              Contact Admin
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black">
            Popular <span className="text-sky-400">Leagues</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: "Premier League", icon: "🦁" },
            { name: "La Liga", icon: "🇪🇸" },
            { name: "Serie A", icon: "🇮🇹" },
            { name: "Bundesliga", icon: "🇩🇪" },
            { name: "Ligue 1", icon: "🇫🇷" },
            { name: "Champions League", icon: "🏆" },
          ].map((league) => (
            <div
              key={league.name}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center hover:border-sky-400 transition"
            >
              <div className="text-4xl mb-4">{league.icon}</div>
              <h3 className="text-sm font-semibold">{league.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gray-900 border border-gray-800 rounded-[40px] p-10 text-center">
          <h3 className="text-xl font-bold text-white">Predictions</h3>
          <p className="text-gray-400 mt-3">View today's and past predictions on the Predictions page.</p>
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
      matches (
        home_team,
        away_team,
        match_date,
        leagues (
          name
        )
      )
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
        <p className="text-gray-400 max-w-3xl mb-6">
          Browse the latest predictions for today and review past performance from recent matches.
        </p>
        {loading && <p className="text-gray-400">Loading predictions...</p>}
        {error && (
          <div className="text-red-400 bg-gray-900 p-3 rounded-md mb-4">
            Error loading predictions: {error.message || JSON.stringify(error)}
          </div>
        )}
      </div>

      <section className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Daily Predictions</h2>
            <p className="text-gray-400 text-sm">Today's top betting tips and odds.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800 text-sm">
            <thead>
              <tr className="text-left text-gray-400 uppercase text-xs tracking-wide">
                <th className="px-4 py-3">League</th>
                <th className="px-4 py-3">Home Team</th>
                <th className="px-4 py-3">Away Team</th>
                <th className="px-4 py-3">Prediction</th>
                <th className="px-4 py-3">Odds</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">VIP</th>
                <th className="px-4 py-3">Match Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {dailyPredictions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-950/80 transition">
                  <td className="px-4 py-4 text-gray-100">{item.matches?.leagues?.name || '-'}</td>
                  <td className="px-4 py-4 text-gray-100">{item.matches?.home_team || '-'}</td>
                  <td className="px-4 py-4 text-gray-100">{item.matches?.away_team || '-'}</td>
                  <td className="px-4 py-4 text-gray-300">{item.prediction}</td>
                  <td className="px-4 py-4 text-sky-400">{item.current_odds || item.odds}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${resultStatusClasses[item.result] || 'bg-gray-600 text-white'}`}>
                      {item.result}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-300">{item.is_vip ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 text-gray-300">{item.matches?.match_date || '-'}</td>
                </tr>
              ))}
              {dailyPredictions.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-gray-400">No daily predictions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Past Predictions</h2>
            <p className="text-gray-400 text-sm">Recent results and performance history.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800 text-sm">
            <thead>
              <tr className="text-left text-gray-400 uppercase text-xs tracking-wide">
                <th className="px-4 py-3">League</th>
                <th className="px-4 py-3">Home Team</th>
                <th className="px-4 py-3">Away Team</th>
                <th className="px-4 py-3">Prediction</th>
                <th className="px-4 py-3">Odds</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">VIP</th>
                <th className="px-4 py-3">Match Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {pastPredictions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-950/80 transition">
                  <td className="px-4 py-4 text-gray-100">{item.matches?.leagues?.name || '-'}</td>
                  <td className="px-4 py-4 text-gray-100">{item.matches?.home_team || '-'}</td>
                  <td className="px-4 py-4 text-gray-100">{item.matches?.away_team || '-'}</td>
                  <td className="px-4 py-4 text-gray-300">{item.prediction}</td>
                  <td className="px-4 py-4 text-sky-400">{item.current_odds || item.odds}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${resultStatusClasses[item.result] || 'bg-gray-600 text-white'}`}>
                      {item.result}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-300">{item.is_vip ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 text-gray-300">{item.matches?.match_date || '-'}</td>
                </tr>
              ))}
              {pastPredictions.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-gray-400">No past predictions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function VIPPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-black text-sky-400 mb-6">VIP Tips</h1>
      <p className="text-gray-400 max-w-3xl mb-10">
        Join the VIP club for premium betting advice, exclusive odds and expert insights across top leagues.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-3">Daily VIP Picks</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Get early access to high-confidence betting selections from our tipsters.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-3">Premium Insights</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Benefit from expert match previews, form analysis, and odds movement data.</p>
        </div>
      </div>
    </div>
  )
}

function LeaguesPage() {
  const leagues = [
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "Champions League",
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-black text-sky-400 mb-6">Leagues</h1>
      <p className="text-gray-400 max-w-3xl mb-10">
        Explore our coverage of the world’s top football leagues and see which competitions our predictions focus on.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {leagues.map((league) => (
          <div key={league} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 text-center">
            <div className="text-4xl mb-4">🏟️</div>
            <h2 className="text-lg font-semibold">{league}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-black text-sky-400 mb-6">Contact</h1>
      <p className="text-gray-400 max-w-3xl mb-10">
        Reach out to our support team for VIP access, partnership inquiries, or general questions.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-3">Support</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Email: support@betprotips.com
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            WhatsApp: +232 XXX XXX XXX
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-3">Office</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Available 24/7 for VIP members and new signups.
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    setError(null)

    const isValidAdmin = email === "admin@betprotips.com" && password === "admin123"
    if (!isValidAdmin) {
      setError("Invalid admin credentials. Please try again.")
      return
    }

    localStorage.setItem("isAdmin", "true")
    navigate("/admin", { replace: true })
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-black text-sky-400 mb-6">Admin Login</h1>
      <p className="text-gray-400 max-w-3xl mb-10">
        Enter your admin credentials to access the dashboard.
      </p>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md mx-auto">
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@betprotips.com"
              className="w-full rounded-2xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mt-6 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="w-full rounded-2xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold py-3 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-black text-sky-400">BetPro Tips</h2>
          <p className="text-gray-400 mt-4 leading-relaxed text-sm">
            Professional football betting predictions platform providing daily
            expert tips and VIP betting analysis.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Quick Links</h3>
          <div className="space-y-3 text-gray-400">
            <Link to="/" className="hover:text-sky-400 transition block">
              Home
            </Link>
            <Link to="/predictions" className="hover:text-sky-400 transition block">
              Predictions
            </Link>
            <Link to="/vip" className="hover:text-sky-400 transition block">
              VIP Tips
            </Link>
            <Link to="/contact" className="hover:text-sky-400 transition block">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Leagues</h3>
          <div className="space-y-3 text-gray-400">
            <p>Premier League</p>
            <p>La Liga</p>
            <p>Serie A</p>
            <p>Bundesliga</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Contact</h3>
          <div className="space-y-3 text-gray-400">
            <p>Email: support@betprotips.com</p>
            <p>WhatsApp: +232 XXX XXX XXX</p>
            <p>Available 24/7</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        © 2026 BetPro Tips. All rights reserved.
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/vip" element={<VIPPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="predictions" element={<AdminPredictions />} />
              <Route path="matches" element={<AdminMatches />} />
              <Route path="leagues" element={<AdminLeagues />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<SiteSettingsAdmin />} />
              <Route path="vip" element={<VipManagementAdmin />} />
            </Route>

            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
