import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Plus, Edit3, Trash2, Loader2, X } from "lucide-react"

const blankMatch = {
  home_team: "",
  away_team: "",
  match_date: "",
  status: "Scheduled",
}

export default function AdminMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(blankMatch)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setNotification(null)

    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("match_date", { ascending: true })

    if (error) {
      setNotification({ type: "error", message: error.message })
      setMatches([])
    } else {
      setMatches(data || [])
    }

    setLoading(false)
  }

  function openModal(match = null) {
    if (match) {
      setEditing(match)
      setForm({
        home_team: match.home_team,
        away_team: match.away_team,
        match_date: match.match_date?.split("T")[0] || "",
        status: match.status || "Scheduled",
      })
    } else {
      setEditing(null)
      setForm(blankMatch)
    }
    setNotification(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setNotification(null)
  }

  async function saveMatch() {
    if (!form.home_team || !form.away_team || !form.match_date) {
      setNotification({ type: "error", message: "All fields are required." })
      return
    }

    setSaving(true)
    const payload = {
      home_team: form.home_team,
      away_team: form.away_team,
      match_date: form.match_date,
    }
    let response
    try {
      response = editing
        ? await supabase.from("matches").update(payload).eq("id", editing.id)
        : await supabase.from("matches").insert([payload])

      if (response.error) throw response.error

      setNotification({ type: "success", message: editing ? "Match updated." : "Match added." })
      setModalOpen(false)
      await loadData()
    } catch (err) {
      setNotification({ type: "error", message: err.message || String(err) })
    } finally {
      setSaving(false)
    }
  }

  async function deleteMatch(match) {
    const confirmed = window.confirm("Delete this match from the schedule?")
    if (!confirmed) return

    const { error } = await supabase.from("matches").delete().eq("id", match.id)
    if (error) {
      setNotification({ type: "error", message: error.message })
      return
    }

    setNotification({ type: "success", message: "Match deleted." })
    loadData()
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Match CRUD</h2>
          <p className="text-slate-600 mt-2">Manage upcoming fixtures and match details for your predictions.</p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition"
        >
          <Plus className="h-4 w-4" /> Add New Match
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
              <th className="px-4 py-3">Home</th>
              <th className="px-4 py-3">Away</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-600">
                  <div className="inline-flex items-center gap-2 font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading matches...
                  </div>
                </td>
              </tr>
            ) : matches.length > 0 ? (
              matches.map((match) => (
                <tr key={match.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">{match.home_team}</td>
                  <td className="px-4 py-4 text-slate-700">{match.away_team}</td>
                  <td className="px-4 py-4 text-slate-700">{match.match_date?.split("T")[0] || "TBD"}</td>
                  <td className="px-4 py-4 text-slate-700">{match.status}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => openModal(match)}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5 inline-block" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMatch(match)}
                      className="rounded-2xl border border-red-700 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-700/10 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5 inline-block" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-600">
                  No matches found. Add a new match to populate the schedule.
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
                <h3 className="text-2xl font-bold text-slate-900">{editing ? "Edit Match" : "Add New Match"}</h3>
                <p className="text-sm text-slate-500">Keep upcoming fixtures accurate for your predictions and VIP releases.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-600 hover:border-slate-300 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {notification ? (
              <div className={`mt-4 rounded-3xl border p-4 text-sm ${notification.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                {notification.message}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Home team
                <input
                  type="text"
                  value={form.home_team}
                  onChange={(event) => setForm({ ...form, home_team: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Away team
                <input
                  type="text"
                  value={form.away_team}
                  onChange={(event) => setForm({ ...form, away_team: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Match date
                <input
                  type="date"
                  value={form.match_date}
                  onChange={(event) => setForm({ ...form, match_date: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                Status
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
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
                onClick={saveMatch}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editing ? "Save Match" : "Create Match"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
