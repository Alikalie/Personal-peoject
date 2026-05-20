import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, useLocation } from "react-router-dom"
import { supabase } from "./lib/supabase"
import AuthPage from "./pages/AuthPage"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminPredictions from "./pages/admin/AdminPredictions"
import AdminMatches from "./pages/admin/AdminMatches"
import AdminLeagues from "./pages/admin/AdminLeagues"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminMessages from "./pages/admin/AdminMessages"
import SiteSettingsAdmin from "./pages/admin/SiteSettingsAdmin"
import VipManagementAdmin from "./pages/admin/VipManagementAdmin"
import ForgotPassword from "./pages/ForgotPassword"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"

const resultStatusClasses = {
  pending: "bg-yellow-300 text-black",
  win: "bg-emerald-500 text-white",
  lose: "bg-red-500 text-white",
  void: "bg-gray-500 text-white",
}

function Navbar() {
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: "BetPro Tips",
    navHomeEnabled: true,
    navPredictionsEnabled: true,
    navVipEnabled: true,
    navLeaguesEnabled: true,
    navContactEnabled: true,
  })
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClasses = ({ isActive }) =>
    `hover:text-sky-400 transition ${isActive ? "text-sky-400" : "text-slate-500"}`

  useEffect(() => {
    async function loadNavSettings() {
      setLoadingSettings(true)
      // select full row to tolerate missing columns
      const { data, error } = await supabase.from("site_settings").select("*").maybeSingle()

      if (!error && data) {
        setSiteSettings((prev) => ({
          ...prev,
          siteTitle: data.site_title || prev.siteTitle,
          navHomeEnabled: data.nav_home_enabled ?? prev.navHomeEnabled,
          navPredictionsEnabled: data.nav_predictions_enabled ?? prev.navPredictionsEnabled,
          navVipEnabled: data.nav_vip_enabled ?? prev.navVipEnabled,
          navLeaguesEnabled: data.nav_leagues_enabled ?? prev.navLeaguesEnabled,
          navContactEnabled: data.nav_contact_enabled ?? prev.navContactEnabled,
        }))
      }
      setLoadingSettings(false)
    }

    loadNavSettings()
  }, [])

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xl font-bold tracking-wide text-sky-400">
            {siteSettings.siteTitle}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {siteSettings.navHomeEnabled ? (
            <NavLink to="/" className={linkClasses} end>
              Home
            </NavLink>
          ) : null}
          {siteSettings.navPredictionsEnabled ? (
            <NavLink to="/predictions" className={linkClasses}>
              Predictions
            </NavLink>
          ) : null}
          {siteSettings.navVipEnabled ? (
            <NavLink to="/vip" className={linkClasses}>
              VIP Tips
            </NavLink>
          ) : null}
          {siteSettings.navLeaguesEnabled ? (
            <NavLink to="/leagues" className={linkClasses}>
              Leagues
            </NavLink>
          ) : null}
          {siteSettings.navContactEnabled ? (
            <NavLink to="/contact" className={linkClasses}>
              Contact
            </NavLink>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 border border-slate-200"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link
            to="/login"
            className="px-4 py-2 rounded-xl border border-slate-300 hover:border-sky-400 transition text-sm text-slate-700"
          >
            Login
          </Link>

          {siteSettings.navVipEnabled ? (
            <Link
              to="/vip"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold transition text-sm"
            >
              Join VIP
            </Link>
          ) : null}
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl transform transition duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="text-lg font-bold text-sky-500">
                  {siteSettings.siteTitle}
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md border border-slate-200">
                  <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-4">
                {siteSettings.navHomeEnabled ? (
                  <NavLink to="/" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Home
                  </NavLink>
                ) : null}
                {siteSettings.navPredictionsEnabled ? (
                  <NavLink to="/predictions" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Predictions
                  </NavLink>
                ) : null}
                {siteSettings.navVipEnabled ? (
                  <NavLink to="/vip" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    VIP Tips
                  </NavLink>
                ) : null}
                {siteSettings.navLeaguesEnabled ? (
                  <NavLink to="/leagues" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Leagues
                  </NavLink>
                ) : null}
                {siteSettings.navContactEnabled ? (
                  <NavLink to="/contact" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Contact
                  </NavLink>
                ) : null}
              </nav>

              <div className="mt-6 space-y-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl border border-slate-200 hover:border-sky-300 text-slate-800">
                  Login
                </Link>

                {siteSettings.navVipEnabled ? (
                  <Link to="/vip" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold">
                    Join VIP
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
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

          <p className="text-slate-600 text-base mt-6 leading-relaxed max-w-xl">
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
                      <p className="text-slate-500 text-xs mt-2">{tip.league || "Daily"} • {tip.match_date ? new Date(tip.match_date).toLocaleDateString() : "Date TBD"}</p>
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
            <h3 className="text-xl font-bold mb-3">All Leagues</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Predictions from Premier League, La Liga, Serie A, Bundesliga,
              Champions League, and more.
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
              className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:border-sky-400 transition"
            >
              <div className="text-4xl mb-4">{league.icon}</div>
              <h3 className="text-sm font-semibold text-slate-900">{league.name}</h3>
            </div>
          ))}
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
            <tbody className="divide-y divide-slate-200">
              {dailyPredictions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">{item.matches?.leagues?.name || '-'}</td>
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
            <tbody className="divide-y divide-slate-200">
              {pastPredictions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">{item.matches?.leagues?.name || '-'}</td>
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

function VIPPage() {
  const vipPackages = [
    {
      title: "Starter Package",
      price: "$19.99",
      perks: [
        "3 daily predictions",
        "Basic odds analysis",
        "Email support",
      ],
      tone: "bg-slate-50",
    },
    {
      title: "Pro Package",
      price: "$49.99",
      perks: [
        "7 daily predictions",
        "VIP accumulator tips",
        "Priority support",
      ],
      tone: "bg-white",
    },
    {
      title: "Elite Package",
      price: "$99.99",
      perks: [
        "Unlimited daily tips",
        "Premium match analysis",
        "Dedicated WhatsApp support",
      ],
      tone: "bg-slate-50",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-black text-sky-400 mb-4">VIP Packages</h1>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Choose the VIP plan that fits your football betting style and get access to high-confidence predictions, expert analysis, and exclusive support.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {vipPackages.map((pkg) => (
          <div key={pkg.title} className={`rounded-3xl border border-slate-200 p-6 shadow-sm ${pkg.tone}`}>
            <h2 className="text-2xl font-bold text-slate-900">{pkg.title}</h2>
            <p className="text-4xl font-black text-sky-400 mt-4 mb-6">{pkg.price}</p>
            <ul className="space-y-3 mb-8 text-slate-600 text-sm">
              {pkg.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <span className="mt-1 text-sky-400">•</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <button className="w-full rounded-2xl bg-sky-500 text-black font-semibold py-3 hover:bg-sky-400 transition">
              Choose {pkg.title}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Why VIP?</h2>
        <p className="leading-relaxed">
          The VIP club gives you early access to the best football betting selections, deeper match previews, and a higher chance to win with curated tips from our expert analysts.
        </p>
      </div>
    </div>
  )
}

function LeaguesPage() {
  const [leagues, setLeagues] = useState([])
  const [loadingLeagues, setLoadingLeagues] = useState(true)
  const [leagueError, setLeagueError] = useState(null)

  useEffect(() => {
    loadLeagues()
  }, [])

  async function loadLeagues() {
    setLoadingLeagues(true)
    setLeagueError(null)

    const { data, error } = await supabase
      .from("leagues")
      .select("id, name, country, status, icon_url")
      .order("name", { ascending: true })

    if (error) {
      setLeagueError(error.message)
      setLeagues([
        { id: "fallback-1", name: "Premier League", country: "England", status: "Active" },
        { id: "fallback-2", name: "La Liga", country: "Spain", status: "Active" },
        { id: "fallback-3", name: "Serie A", country: "Italy", status: "Active" },
      ])
    } else {
      setLeagues(data || [])
    }

    setLoadingLeagues(false)
  }

  const leagueIcons = {
    "Premier League": "🏆",
    "La Liga": "🇪🇸",
    "Serie A": "🇮🇹",
    "Bundesliga": "🇩🇪",
    "Ligue 1": "🇫🇷",
    "Champions League": "🏟️",
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-sky-400 mb-6">Leagues</h1>
          <p className="text-slate-600 max-w-3xl">
            Explore our coverage of the world’s top football leagues and discover the competitions behind every prediction.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
          {loadingLeagues ? "Loading leagues..." : leagueError ? leagueError : `${leagues.length} leagues available`}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((league) => (
          <div key={league.id} className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center text-4xl">
              {league.icon_url ? (
                <img src={league.icon_url} alt={league.name} className="h-full w-full object-cover" />
              ) : (
                leagueIcons[league.name] || "🏟️"
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{league.name}</h2>
            <p className="mt-3 text-sm text-slate-500">{league.country || "International"}</p>
            <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              {league.status || "Active"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactPage() {
  const [supportContacts, setSupportContacts] = useState([])
  const [settings, setSettings] = useState({
    contactTitle: "Contact",
    contactIntro: "Reach out to our support team for VIP access, partnership inquiries, or general questions.",
    contactDescription: "Our team is available 24/7 to help you with VIP upgrades, membership information, and urgent questions.",
  })
  const [loadingContact, setLoadingContact] = useState(true)
  const [contactError, setContactError] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [statusMessage, setStatusMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadContactContent()
  }, [])

  async function loadContactContent() {
    setLoadingContact(true)
    setContactError(null)
    // perform a safe full-row select so the client won't fail if columns are missing
    const [settingsRes, contactsRes] = await Promise.all([
      supabase.from("site_settings").select("*").maybeSingle(),
      supabase.from("contact_messages").select("id, name, email, subject, message, created_at").order("created_at", { ascending: false }),
    ])

    // map fields defensively (support both contact_header and legacy contact_title)
    if (!settingsRes.error && settingsRes.data) {
      const data = settingsRes.data || {}
      setSettings((prev) => ({
        ...prev,
        contactTitle: data.contact_header || data.contact_title || prev.contactTitle,
        contactIntro: data.contact_intro || data.contact_intro || prev.contactIntro,
        contactDescription: data.contact_description || prev.contactDescription,
      }))
    } else if (settingsRes.error) {
      setContactError(settingsRes.error.message)
    }

    if (contactsRes.error || !contactsRes.data) {
      // if contact_messages table is missing or returned an error, keep fallbacks
      if (contactsRes.error) {
        setContactError((prev) => (prev ? `${prev} — ${contactsRes.error.message}` : contactsRes.error.message))
      }
      setSupportContacts([
        { id: "fallback-1", label: "Support Email", detail: "support@betprotips.com", icon: "📧" },
        { id: "fallback-2", label: "WhatsApp", detail: "+232 XXX XXX XXX", icon: "📱" },
      ])
    } else {
      setSupportContacts(contactsRes.data)
    }

    setLoadingContact(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setStatusMessage(null)

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      },
    ])

    setSubmitting(false)
    if (error) {
      setStatusMessage({ type: "error", text: error.message })
      return
    }

    setStatusMessage({ type: "success", text: "Your message has been sent. Our team will reach out shortly." })
    setForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-sky-400 mb-6">{settings.contactTitle}</h1>
          <p className="text-slate-600 max-w-3xl">{settings.contactIntro}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
          {loadingContact ? "Loading support channels..." : supportContacts.length ? `${supportContacts.length} support contacts available` : "No support contacts configured"}
        </div>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Contacts</h2>
            <p className="text-slate-600 mb-6">{settings.contactDescription}</p>

            {contactError ? (
              <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{contactError}</div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {supportContacts.length > 0 ? (
                supportContacts.map((contact) => (
                  <div key={contact.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-xl text-black">
                        {contact.icon || "📞"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{contact.label}</p>
                        <p className="text-sm text-slate-600">{contact.detail}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
                  No support contacts have been configured yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                placeholder="What do you need help with?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                className="w-full min-h-[140px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                placeholder="Tell us more about your request"
                required
              />
            </div>
            {statusMessage ? (
              <div className={`rounded-3xl p-4 text-sm ${statusMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                {statusMessage.text}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Sending message..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  const [footerText, setFooterText] = useState(
    "Professional football betting predictions platform providing daily expert tips and VIP betting analysis."
  )
  const [supportContacts, setSupportContacts] = useState([])
  const [linkVisibility, setLinkVisibility] = useState({
    home: true,
    predictions: true,
    vip: true,
    leagues: true,
    contact: true,
  })
  const [siteTitleFooter, setSiteTitleFooter] = useState("BetPro Tips")
  const [loadingFooter, setLoadingFooter] = useState(true)

  useEffect(() => {
    loadFooterContent()
  }, [])

  async function loadFooterContent() {
    setLoadingFooter(true)
    // fetch entire settings row to avoid errors if some columns don't exist
    const [settingsRes, contactsRes] = await Promise.all([
      supabase.from("site_settings").select("*").maybeSingle(),
      supabase.from("contact_messages").select("id, name, email, subject, message, created_at").order("created_at", { ascending: false }),
    ])

    if (!settingsRes.error && settingsRes.data) {
      const data = settingsRes.data || {}
      if (data.footer_text) setFooterText(data.footer_text)
      if (data.site_title) setSiteTitleFooter(data.site_title)
      setLinkVisibility({
        home: data.nav_home_enabled ?? true,
        predictions: data.nav_predictions_enabled ?? true,
        vip: data.nav_vip_enabled ?? true,
        leagues: data.nav_leagues_enabled ?? true,
        contact: data.nav_contact_enabled ?? true,
      })
    }

    if (!contactsRes.error && contactsRes.data) {
      setSupportContacts(contactsRes.data)
    } else {
      setSupportContacts([
        { id: "fallback-1", label: "Email", detail: "support@betprotips.com" },
        { id: "fallback-2", label: "WhatsApp", detail: "+232 XXX XXX XXX" },
      ])
    }

    setLoadingFooter(false)
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-black text-sky-400">BetPro Tips</h2>
          <p className="text-slate-600 mt-4 leading-relaxed text-sm">{footerText}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Quick Links</h3>
          <div className="space-y-3 text-slate-600">
            {linkVisibility.home ? (
              <Link to="/" className="hover:text-sky-400 transition block">
                Home
              </Link>
            ) : null}
            {linkVisibility.predictions ? (
              <Link to="/predictions" className="hover:text-sky-400 transition block">
                Predictions
              </Link>
            ) : null}
            {linkVisibility.vip ? (
              <Link to="/vip" className="hover:text-sky-400 transition block">
                VIP Tips
              </Link>
            ) : null}
            {linkVisibility.leagues ? (
              <Link to="/leagues" className="hover:text-sky-400 transition block">
                Leagues
              </Link>
            ) : null}
            {linkVisibility.contact ? (
              <Link to="/contact" className="hover:text-sky-400 transition block">
                Contact
              </Link>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Leagues</h3>
          <div className="space-y-3 text-slate-600">
            <p>Premier League</p>
            <p>La Liga</p>
            <p>Serie A</p>
            <p>Bundesliga</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Contact</h3>
          <div className="space-y-3 text-slate-600">
            {supportContacts.map((contact) => (
              <p key={contact.id}>{contact.detail}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} {siteTitleFooter}. All rights reserved.
      </div>
    </footer>
  )
}

function AppContent() {
  const location = useLocation()
  const hideAdminShell = location.pathname.startsWith("/admin")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {!hideAdminShell && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/vip" element={<VIPPage />} />
          <Route path="/leagues" element={<LeaguesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/login" element={<AuthPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="predictions" element={<AdminPredictions />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="leagues" element={<AdminLeagues />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<SiteSettingsAdmin />} />
            <Route path="vip" element={<VipManagementAdmin />} />
          </Route>

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!hideAdminShell && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
