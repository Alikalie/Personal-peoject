export default function AdminLeagues() {
  const leagueItems = [
    { id: 1, name: "Premier League", country: "England", status: "Active" },
    { id: 2, name: "Serie A", country: "Italy", status: "Active" },
    { id: 3, name: "Bundesliga", country: "Germany", status: "Active" },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">League CRUD</h2>
          <p className="text-gray-400 mt-2">Manage league names, countries and status tags for your data model.</p>
        </div>
        <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition">
          Add League
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-gray-950 p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400 uppercase tracking-[0.2em] text-xs">
              <th className="px-4 py-3">League</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leagueItems.map((league) => (
              <tr key={league.id} className="hover:bg-gray-900/80 transition">
                <td className="px-4 py-4 text-gray-200">{league.name}</td>
                <td className="px-4 py-4 text-gray-200">{league.country}</td>
                <td className="px-4 py-4 text-gray-200">{league.status}</td>
                <td className="px-4 py-4 space-x-2">
                  <button className="rounded-2xl border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-200 hover:border-sky-400 hover:text-sky-400 transition">
                    Edit
                  </button>
                  <button className="rounded-2xl border border-red-700 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-700/20 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
