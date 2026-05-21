import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function VIPPage() {
  const [vipPackages, setVipPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlans() {
      const { data, error } = await supabase.from("vip_plans").select("*").order("price", { ascending: true })
      if (!error && data) {
        setVipPackages(data)
      }
      setLoading(false)
    }
    loadPlans()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-black text-sky-400 mb-4">VIP Packages</h1>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Choose the VIP plan that fits your football betting style and get access to high-confidence predictions, expert analysis, and exclusive support.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {loading ? (
          <p className="text-slate-600 md:col-span-3 text-center">Loading VIP Plans...</p>
        ) : vipPackages.length > 0 ? (
          vipPackages.map((pkg, i) => (
            <div key={pkg.id} className={`rounded-3xl border border-slate-200 p-6 shadow-sm ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
              <h2 className="text-2xl font-bold text-slate-900">{pkg.name}</h2>
              <p className="text-4xl font-black text-sky-400 mt-4 mb-6">${pkg.price}</p>
              <div className="mb-8 text-slate-600 text-sm whitespace-pre-line">
                {pkg.description || "Premium VIP Access."}
              </div>
              <button className="w-full rounded-2xl bg-sky-500 text-black font-semibold py-3 hover:bg-sky-400 transition">
                Choose {pkg.name}
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-600 md:col-span-3 text-center">No VIP plans available right now.</p>
        )}
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
export default VIPPage;
