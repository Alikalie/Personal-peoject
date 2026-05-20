export default function AdminMatches() {
  const sampleFixtures = [
    { id: 1, league: "Bundesliga", home: "Bayern", away: "Dortmund", date: "2026-05-23" },
    { id: 2, league: "Ligue 1", home: "PSG", away: "Lyon", date: "2026-05-24" },
    { id: 3, league: "Champions League", home: "Man City", away: "Real Madrid", date: "2026-05-28" },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Match CRUD</h2>
          <p className="text-gray-400 mt-2">Manage upcoming fixtures and match details for your predictions.</p>
        </div>
        <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition">
          Add New Match
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-gray-950 p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400 uppercase tracking-[0.2em] text-xs">
              <th className="px-4 py-3">League</th>
              <th className="px-4 py-3">Home</th>
              <th className="px-4 py-3">Away</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sampleFixtures.map((fixture) => (
              <tr key={fixture.id} className="hover:bg-gray-900/80 transition">
                <td className="px-4 py-4 text-gray-200">{fixture.league}</td>
                <td className="px-4 py-4 text-gray-200">{fixture.home}</td>
                <td className="px-4 py-4 text-gray-200">{fixture.away}</td>
                <td className="px-4 py-4 text-gray-200">{fixture.date}</td>
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
