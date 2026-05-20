import { Link } from "react-router-dom"

export default function AdminDashboard() {
  const metrics = [
    { label: "Pending Predictions", value: 18 },
    { label: "Upcoming Matches", value: 47 },
    { label: "Tracked Leagues", value: 12 },
    { label: "Active Users", value: 789 },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-8">
        <div className="flex items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome back, Admin</h2>
            <p className="text-gray-400 mt-2">Review platform activity and manage content from one place.</p>
          </div>
          <div className="inline-flex rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black">Live</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-gray-800 bg-gray-950 p-5">
              <p className="text-sm text-gray-400">{metric.label}</p>
              <p className="mt-4 text-3xl font-black text-sky-400">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Link
          to="predictions"
          className="rounded-3xl border border-gray-800 bg-gray-900 p-6 text-left hover:border-sky-400 transition"
        >
          <p className="text-sm text-gray-400">Predictions</p>
          <h3 className="mt-4 text-xl font-bold text-white">Manage bets</h3>
        </Link>
        <Link
          to="matches"
          className="rounded-3xl border border-gray-800 bg-gray-900 p-6 text-left hover:border-sky-400 transition"
        >
          <p className="text-sm text-gray-400">Matches</p>
          <h3 className="mt-4 text-xl font-bold text-white">Edit fixtures</h3>
        </Link>
        <Link
          to="users"
          className="rounded-3xl border border-gray-800 bg-gray-900 p-6 text-left hover:border-sky-400 transition"
        >
          <p className="text-sm text-gray-400">Users</p>
          <h3 className="mt-4 text-xl font-bold text-white">User management</h3>
        </Link>
      </div>
    </div>
  )
}
