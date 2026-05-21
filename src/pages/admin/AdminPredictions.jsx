import { useEffect, useState } from "react"
import { getPredictions, createPrediction, updatePrediction, deletePrediction } from "../../services/predictionsService"
import { getMatches } from "../../services/matchesService"
import { Plus, Edit3, Trash2, Loader2, X } from "lucide-react"

const initialForm = {
  match_id: "",
  prediction: "",
  current_odds: "",
  result: "pending",
  is_vip: false,
}

const resultOptions = [
  { value: "pending", label: "Pending" },
  { value: "win", label: "Win" },
  { value: "lose", label: "Lose" },
  { value: "void", label: "Void" },
]

export default function AdminPredictions() {
  const [predictions, setPredictions] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [editing, setEditing] = useState(null)
  const [notification, setNotification] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setNotification(null)

    try {
      const [predData, matchData] = await Promise.all([
        getPredictions(),
        getMatches(),
      ])
      setPredictions(predData || [])
      setMatches(matchData || [])
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Failed to load data.",
      })
      setPredictions([])
      setMatches([])
    }

    setLoading(false)
  }

  function openModal(prediction = null) {
    if (prediction) {
      setEditing(prediction)
      setForm({
        match_id: prediction.match_id || "",
        prediction: prediction.prediction || "",
        current_odds: prediction.current_odds || "",
        result: prediction.result || "pending",
        is_vip: prediction.is_vip || false,
      })
    } else {
      setEditing(null)
      setForm(initialForm)
    }
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setNotification(null)
  }

  async function handleSave() {
    if (!form.match_id) {
      setNotification({ type: "error", message: "Select a match before saving." })
      return
    }

    setSaving(true)
    const payload = {
      match_id: Number(form.match_id),
      prediction: form.prediction,
      current_odds: form.current_odds,
      result: form.result,
      is_vip: form.is_vip,
    }

    try {
      editing
        ? await updatePrediction(editing.id, payload)
        : await createPrediction(payload)
      
      setNotification({ type: "success", message: editing ? "Prediction updated successfully." : "Prediction created successfully." })
      setModalOpen(false)
      loadData()
    } catch (err) {
      setNotification({ type: "error", message: err.message || "Failed to save prediction" })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(prediction) {
    const confirmed = window.confirm("Delete this prediction permanently?")
    if (!confirmed) return

    try {
      await deletePrediction(prediction.id)
      setNotification({ type: "success", message: "Prediction removed." })
      loadData()
    } catch (err) {
      setNotification({ type: "error", message: err.message || "Failed to delete prediction" })
    }
  }

  const matchOptions = matches.map((match) => {
    const text = `${match.home_team} vs ${match.away_team} (${new Date(match.match_date).toLocaleDateString()})`
    return (
      <option key={match.id} value={match.id}>
        {text}
      </option>
    )
  })

  function currentMatchLabel() {
    const selected = matches.find((match) => match.id === Number(form.match_id))
    if (!selected) return "No match selected"
    return `${selected.home_team} vs ${selected.away_team}`
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Prediction CRUD</h2>
            <p className="text-slate-600 mt-2">Manage predictions from Supabase and push changes live.</p>
          </div>
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition"
          >
            <Plus className="h-4 w-4" />
            Add New Prediction
          </button>
        </div>

        {notification ? (
          <div className={`mt-4 rounded-3xl p-4 text-sm ${notification.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
            {notification.message}
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 uppercase tracking-[0.2em] text-xs">
              <th className="px-4 py-3">Match</th>
              <th className="px-4 py-3">Prediction</th>
              <th className="px-4 py-3">Odds</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">VIP</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-600">
                  <div className="inline-flex items-center gap-2 font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading predictions...
                  </div>
                </td>
              </tr>
            ) : predictions.length > 0 ? (
              predictions.map((prediction) => (
                <tr key={prediction.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">
                    {prediction.matches?.home_team ? `${prediction.matches.home_team} vs ${prediction.matches.away_team}` : "Unlinked match"}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{prediction.prediction}</td>
                  <td className="px-4 py-4 text-sky-500">{prediction.current_odds || "-"}</td>
                  <td className="px-4 py-4 text-slate-700 capitalize">{prediction.result || "pending"}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${prediction.is_vip ? "bg-violet-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                      {prediction.is_vip ? "VIP" : "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-4 space-x-2 flex">
                    <button
                      type="button"
                      onClick={() => openModal(prediction)}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5 inline-block" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prediction)}
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
                  No predictions available. Create one using the button above or add matches under Admin Matches.
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
                <h3 className="text-2xl font-bold text-slate-900">{editing ? "Edit Prediction" : "Add New Prediction"}</h3>
                <p className="text-sm text-slate-500">Save changes directly to the Supabase predictions table.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-600 hover:border-slate-300 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Match
                <select
                  value={form.match_id}
                  onChange={(event) => setForm({ ...form, match_id: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                >
                  <option value="">Select existing match</option>
                  {matchOptions}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Odds
                <input
                  type="text"
                  value={form.current_odds}
                  onChange={(event) => setForm({ ...form, current_odds: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                  placeholder="e.g. 2.10"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                Prediction
                <input
                  type="text"
                  value={form.prediction}
                  onChange={(event) => setForm({ ...form, prediction: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                  placeholder="e.g. Over 2.5, Both Teams To Score"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Result
                <select
                  value={form.result}
                  onChange={(event) => setForm({ ...form, result: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                >
                  {resultOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_vip}
                  onChange={(event) => setForm({ ...form, is_vip: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
                Mark as VIP
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
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editing ? "Save Changes" : "Create Prediction"}
              </button>
            </div>

            <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>
                Selected match: <span className="font-semibold text-slate-900">{currentMatchLabel()}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
