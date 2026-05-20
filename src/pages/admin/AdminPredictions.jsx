export default function AdminPredictions() {
  const samplePredictions = [
    { id: 1, league: "Premier League", match: "Arsenal vs Chelsea", prediction: "Over 2.5", odds: "2.10", vip: true },
    { id: 2, league: "La Liga", match: "Real Madrid vs Barca", prediction: "Both Teams To Score", odds: "1.85", vip: false },
    { id: 3, league: "Serie A", match: "Juventus vs Milan", prediction: "Juventus Win", odds: "2.40", vip: true },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Prediction CRUD</h2>
          <p className="text-gray-400 mt-2">Create, edit and remove predictions across all leagues.</p>
        </div>
        <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition">
          Add New Prediction
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-gray-950 p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400 uppercase tracking-[0.2em] text-xs">
              <th className="px-4 py-3">League</th>
              <th className="px-4 py-3">Match</th>
              <th className="px-4 py-3">Prediction</th>
              <th className="px-4 py-3">Odds</th>
              <th className="px-4 py-3">VIP</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {samplePredictions.map((prediction) => (
              <tr key={prediction.id} className="hover:bg-gray-900/80 transition">
                <td className="px-4 py-4 text-gray-200">{prediction.league}</td>
                <td className="px-4 py-4 text-gray-200">{prediction.match}</td>
                <td className="px-4 py-4 text-gray-200">{prediction.prediction}</td>
                <td className="px-4 py-4 text-sky-400">{prediction.odds}</td>
                <td className="px-4 py-4 text-gray-200">{prediction.vip ? "Yes" : "No"}</td>
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
