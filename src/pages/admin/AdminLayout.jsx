import { useState } from "react"
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom"
import { LogOut, Menu, X, LayoutDashboard, Activity, Users2, Settings2, CalendarDays, Star, ShieldAlert } from "lucide-react"
import { supabase } from "../../lib/supabase"

const adminLinks = [
  { name: "Dashboard", path: "", icon: LayoutDashboard },
  { name: "Predictions", path: "predictions", icon: Star },
  { name: "Matches", path: "matches", icon: CalendarDays },
  { name: "Leagues", path: "leagues", icon: ShieldAlert },
  { name: "Users", path: "users", icon: Users2 },
  { name: "VIP", path: "vip", icon: Activity },
  { name: "Settings", path: "settings", icon: Settings2 },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const linkClasses = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive ? "bg-sky-500 text-black shadow-sm" : "text-slate-600 hover:bg-slate-100"
    }`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-500 transition lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Admin Panel</p>
              <h1 className="text-xl font-bold text-slate-900">Sportsbook Control Room</h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-500 transition"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 p-6 lg:hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin</p>
              <h2 className="text-xl font-bold text-white">Menu</h2>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 text-slate-200 hover:border-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3 rounded-3xl bg-slate-900/95 p-5 shadow-2xl">
            {adminLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.path || "dashboard-mobile"}
                  to={link.path}
                  className={linkClasses}
                  end={link.path === ""}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 text-slate-200" />
                  <span>{link.name}</span>
                </NavLink>
              )
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-4">Admin Menu</p>
            <div className="space-y-2">
              {adminLinks.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink key={link.path || "dashboard"} to={link.path} className={linkClasses} end={link.path === ""}>
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </NavLink>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
            <Link
              to="predictions"
              className="block rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black text-center hover:bg-sky-400 transition"
            >
              Add Prediction
            </Link>
            <Link
              to="messages"
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
            >
              View Messages
            </Link>
            <Link
              to="settings"
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
            >
              Edit Footer
            </Link>
            <Link
              to="matches"
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
            >
              Add Match
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              <span className="inline-flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </span>
            </button>
          </div>
        </aside>

        <main className="space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
