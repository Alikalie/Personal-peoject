import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Plus, Edit3, Trash2, Loader2, X } from "lucide-react"

const blankPlan = {
  name: "",
  price: "",
  status: "Active",
  description: "",
}

export default function VipManagementAdmin() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(blankPlan)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    setLoading(true)
    setNotification(null)

    const { data, error } = await supabase
      .from("vip_plans")
      .select("id, name, price, status, description")
      .order("id", { ascending: false })

    if (error) {
      setNotification({ type: "error", message: error.message })
      setPlans([])
    } else {
      setPlans(data || [])
    }

    setLoading(false)
  }

  function openModal(plan = null) {
    if (plan) {
      setEditing(plan)
      setForm({ name: plan.name, price: plan.price, status: plan.status || "Active", description: plan.description || "" })
    } else {
      setEditing(null)
      setForm(blankPlan)
    }
    setModalOpen(true)
    setNotification(null)
  }

  function closeModal() {
    setModalOpen(false)
    setNotification(null)
  }

  async function savePlan() {
    if (!form.name || !form.price) {
      setNotification({ type: "error", message: "Plan name and price are required." })
      return
    }

    setSaving(true)
    const payload = {
      name: form.name,
      price: form.price,
      status: form.status,
      description: form.description,
    }

    const response = editing
      ? await supabase.from("vip_plans").update(payload).eq("id", editing.id)
      : await supabase.from("vip_plans").insert([payload])

    setSaving(false)

    if (response.error) {
      setNotification({ type: "error", message: response.error.message })
      return
    }

    setNotification({ type: "success", message: editing ? "VIP plan updated." : "VIP plan created." })
    setModalOpen(false)
    loadPlans()
  }

  async function deletePlan(plan) {
    const confirmed = window.confirm("Delete this VIP plan?")
    if (!confirmed) return

    const { error } = await supabase.from("vip_plans").delete().eq("id", plan.id)
    if (error) {
      setNotification({ type: "error", message: error.message })
      return
    }

    setNotification({ type: "success", message: "VIP plan deleted." })
    loadPlans()
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">VIP Management</h2>
          <p className="text-slate-600 mt-2">Control VIP offers, subscription plans, and special access tiers.</p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition"
        >
          <Plus className="h-4 w-4" /> Add VIP Plan
        </button>
      </div>

      {notification ? (
        <div className={`rounded-3xl border p-4 text-sm ${notification.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {notification.message}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 uppercase tracking-[0.2em] text-xs">
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-600">
                  <div className="inline-flex items-center gap-2 font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading VIP plans...
                  </div>
                </td>
              </tr>
            ) : plans.length > 0 ? (
              plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">{plan.name}</td>
                  <td className="px-4 py-4 text-sky-400">{plan.price}</td>
                  <td className="px-4 py-4 text-slate-700">{plan.status}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => openModal(plan)}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5 inline-block" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePlan(plan)}
                      className="rounded-2xl border border-red-700 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-700/10 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5 inline-block" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-600">
                  No VIP plans found. Add a plan to start selling VIP access.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{editing ? "Edit VIP Plan" : "Add VIP Plan"}</h3>
                <p className="text-sm text-slate-500">Create VIP offerings that your members can purchase.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-600 hover:border-slate-300 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Plan name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Price
                <input
                  type="text"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                  placeholder="$29"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Status
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                  rows={4}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={savePlan}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editing ? "Save VIP Plan" : "Create VIP Plan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
