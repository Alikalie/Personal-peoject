import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import { Activity, ArrowRight, TrendingUp, Users2, ShieldCheck, Star } from "lucide-react"

const cards = [
  {
    title: "Pending Predictions",
    description: "Unresolved betting selections waiting for review.",
    key: "pending",
    icon: Activity,
    accent: "text-sky-500 bg-sky-500/10",
  },
  {
    title: "VIP Tips",
    description: "Premium picks reserved for VIP members.",
    key: "vip",
    icon: Star,
    accent: "text-violet-500 bg-violet-500/10",
  },
  {
    title: "Active Users",
    description: "Registered bettors and platform accounts.",
    key: "users",
    icon: Users2,
    accent: "text-emerald-500 bg-emerald-500/10",
  },
  {
    title: "Tracked Matches",
    description: "Fixtures currently available for prediction.",
    key: "matches",
    icon: ShieldCheck,
    accent: "text-amber-500 bg-amber-500/10",
  },
  {
    title: "Contact Messages",
    description: "User inquiries submitted through the public contact form.",
    key: "messages",
    icon: ArrowRight,
    accent: "text-sky-700 bg-sky-700/10",
  },
]

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({ pending: 0, vip: 0, users: 0, matches: 0, messages: 0 })
  const [recentPredictions, setRecentPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)
    setError("")

    try {
      const [pendingRes, vipRes, usersRes, matchesRes, messagesRes, recentRes] = await Promise.all([
        supabase.from("predictions").select("id", { count: "exact", head: true }).eq("result", "pending"),
        supabase.from("predictions").select("id", { count: "exact", head: true }).eq("is_vip", true),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("matches").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase
          .from("predictions")
          .select(
            `id,prediction,current_odds,result,is_vip,matches(home_team,away_team,match_date,leagues(name))`
          )
          .order("id", { ascending: false })
          .limit(6),
      ])

      setMetrics({
        pending: pendingRes.count || 0,
        vip: vipRes.count || 0,
        users: usersRes.count || 0,
        matches: matchesRes.count || 0,
        messages: messagesRes.count || 0,
      })

      if (recentRes.error) throw recentRes.error
      setRecentPredictions(recentRes.data || [])
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.")
    }

    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Admin Dashboard</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">Sportsbook performance overview</h2>
            <p className="mt-2 max-w-2xl text-slate-600">Live metrics and prediction activity from your betting platform.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
            <TrendingUp className="h-5 w-5 text-sky-500" />
            {loading ? "Updating metrics..." : "Live data fetched from Supabase"}
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.key} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className={`inline-flex items-center justify-center rounded-2xl ${card.accent} p-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-sm text-slate-500">{card.title}</p>
                  <p className="mt-4 text-4xl font-black text-slate-900">{metrics[card.key]}</p>
                  <p className="mt-3 text-sm text-slate-500">{card.description}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Recent Predictions</h3>
              <p className="mt-2 text-slate-600">Monitor the latest betting selections and track performance.</p>
            </div>
            <Link
              to="predictions"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition"
            >
              View Predictions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-[0.2em] text-xs">
                  <th className="px-4 py-3">Match</th>
                  <th className="px-4 py-3">Prediction</th>
                  <th className="px-4 py-3">Odds</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentPredictions.length > 0 ? (
                  recentPredictions.map((prediction) => (
                    <tr key={prediction.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-4 text-slate-700">
                        {prediction.matches?.home_team || "N/A"} vs {prediction.matches?.away_team || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-slate-700">{prediction.prediction}</td>
                      <td className="px-4 py-4 text-sky-500 font-semibold">{prediction.current_odds || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-700 capitalize">{prediction.result || "pending"}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${prediction.is_vip ? "bg-violet-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                          {prediction.is_vip ? "VIP" : "Free"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      {loading ? "Loading predictions..." : "No recent predictions found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Prediction Management</p>
            <h3 className="mt-3 text-2xl font-bold text-slate-900">Ready for CRUD</h3>
            <p className="mt-2 text-slate-600">This admin dashboard supports prediction creation, editing, and deletion workflows.</p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">User management</p>
              <p className="mt-2 font-semibold text-slate-900">Roles, profiles, and account actions.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">VIP management</p>
              <p className="mt-2 font-semibold text-slate-900">Approve VIP requests and manage special access.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Settings editor</p>
              <p className="mt-2 font-semibold text-slate-900">Homepage content, payment settings, and site controls.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
