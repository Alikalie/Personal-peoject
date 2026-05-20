import { NavLink, Outlet, Link } from "react-router-dom"

const adminLinks = [
  { name: "Dashboard", path: "" },
  { name: "Predictions", path: "predictions" },
  { name: "Matches", path: "matches" },
  { name: "Leagues", path: "leagues" },
  { name: "Users", path: "users" },
  { name: "Settings", path: "settings" },
  { name: "VIP", path: "vip" },
]

export default function AdminLayout() {
  const linkClasses = ({ isActive }) =>
    `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive ? "bg-sky-500 text-black" : "text-gray-300 hover:bg-gray-900"
    }`

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-3">
          <div>
            <h1 className="text-xl font-bold text-sky-400">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Manage predictions, matches, leagues, users, and site settings.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-2xl border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-sky-400 hover:text-sky-400 transition"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Admin Menu</p>
            <div className="space-y-2">
              {adminLinks.map((link) => (
                <NavLink key={link.path || "dashboard"} to={link.path} className={linkClasses} end={link.path === ""}>
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-5 space-y-3">
            <h2 className="text-sm font-bold text-white">Quick Actions</h2>
            <Link
              to="predictions"
              className="block rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black text-center hover:bg-sky-400 transition"
            >
              Add Prediction
            </Link>
            <Link
              to="matches"
              className="block rounded-2xl border border-gray-700 px-4 py-3 text-sm font-semibold text-gray-200 hover:border-sky-400 hover:text-sky-400 transition"
            >
              Add Match
            </Link>
          </div>
        </aside>

        <main className="space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
