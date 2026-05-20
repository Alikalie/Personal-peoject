export default function VipManagementAdmin() {
  const vipPlans = [
    { id: 1, name: "Monthly VIP", price: "$29", status: "Active" },
    { id: 2, name: "Quarterly VIP", price: "$79", status: "Active" },
    { id: 3, name: "Annual VIP", price: "$249", status: "Paused" },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">VIP Management</h2>
          <p className="text-gray-400 mt-2">Control VIP offers, subscription plans, and special access tiers.</p>
        </div>
        <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition">
          Add VIP Plan
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-gray-950 p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400 uppercase tracking-[0.2em] text-xs">
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {vipPlans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-900/80 transition">
                <td className="px-4 py-4 text-gray-200">{plan.name}</td>
                <td className="px-4 py-4 text-sky-400">{plan.price}</td>
                <td className="px-4 py-4 text-gray-200">{plan.status}</td>
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
