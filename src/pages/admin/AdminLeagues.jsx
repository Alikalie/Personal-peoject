import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Plus, Edit3, Trash2, Loader2, X, ImageIcon } from "lucide-react"

const blankLeague = {
  name: "",
  country: "",
  icon_url: "",
  status: "Active",
}

export default function AdminLeagues() {
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(blankLeague)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadLeagues()
  }, [])

  async function loadLeagues() {
    setLoading(true)
    setNotification(null)

    const { data, error } = await supabase.from("leagues").select("id, name, country, status, icon_url").order("name", { ascending: true })

    if (error) {
      setNotification({ type: "error", message: error.message })
      setLeagues([])
    } else {
      setLeagues(data || [])
    }

    setLoading(false)
  }

  function openModal(league = null) {
    if (league) {
      setEditing(league)
      setForm({ name: league.name, country: league.country, icon_url: league.icon_url || "", status: league.status || "Active" })
    } else {
      setEditing(null)
      setForm(blankLeague)
    }
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setNotification(null)
  }

  async function saveLeague() {
    if (!form.name || !form.country) {
      setNotification({ type: "error", message: "Name and country are required." })
      return
    }
    setSaving(true)
    setNotification(null)

    try {
      let iconUrl = form.icon_url

      // If a new file is selected, upload to Supabase storage
      if (file) {
        setUploading(true)
        const filePath = `league-icons/${Date.now()}_${file.name.replace(/\s+/g, "_")}`
        const { error: uploadErr } = await supabase.storage.from("league-icons").upload(filePath, file, { upsert: true })
        if (uploadErr) {
          throw uploadErr
        }
        const { data: urlData } = supabase.storage.from("league-icons").getPublicUrl(filePath)
        iconUrl = urlData?.publicUrl || iconUrl
        setUploading(false)
      }

      const payload = {
        name: form.name,
        country: form.country,
        icon_url: iconUrl,
        status: form.status,
      }

      const response = editing
        ? await supabase.from("leagues").update(payload).eq("id", editing.id)
        : await supabase.from("leagues").insert([payload])

      if (response.error) throw response.error

      setNotification({ type: "success", message: editing ? "League updated." : "League added." })
      setModalOpen(false)
      loadLeagues()
    } catch (err) {
      setNotification({ type: "error", message: err.message || String(err) })
    } finally {
      setSaving(false)
      setUploading(false)
      setFile(null)
    }
  }

  async function deleteLeague(league) {
    const confirmed = window.confirm("Delete this league from the system?")
    if (!confirmed) return

    const { error } = await supabase.from("leagues").delete().eq("id", league.id)
    if (error) {
      setNotification({ type: "error", message: error.message })
      return
    }

    setNotification({ type: "success", message: "League deleted." })
    loadLeagues()
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">League CRUD</h2>
          <p className="text-slate-600 mt-2">Manage league names, country badges, icons, and status from Supabase.</p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition"
        >
          <Plus className="h-4 w-4" />
          Add League
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
              <th className="px-4 py-3">League</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-600">
                  <div className="inline-flex items-center gap-2 font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading leagues...
                  </div>
                </td>
              </tr>
            ) : leagues.length > 0 ? (
              leagues.map((league) => (
                <tr key={league.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">{league.name}</td>
                  <td className="px-4 py-4 text-slate-700">{league.country}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {league.icon_url ? (
                      <img src={league.icon_url} alt={league.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                        {league.name?.[0] || "L"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{league.status}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => openModal(league)}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5 inline-block" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteLeague(league)}
                      className="rounded-2xl border border-red-700 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-700/10 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5 inline-block" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-600">
                  No leagues found. Add a new league to populate the public leagues page.
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
                <h3 className="text-2xl font-bold text-slate-900">{editing ? "Edit League" : "Add New League"}</h3>
                <p className="text-sm text-slate-500">Upload league icon URLs and keep your league roster current.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-600 hover:border-slate-300 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                League name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                  placeholder="Premier League"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Country
                <input
                  type="text"
                  value={form.country}
                  onChange={(event) => setForm({ ...form, country: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                  placeholder="England"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                Icon URL
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={form.icon_url}
                    onChange={(event) => setForm({ ...form, icon_url: event.target.value })}
                    className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                    placeholder="https://..."
                  />
                  <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer hover:border-sky-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                    <ImageIcon className="h-4 w-4" /> Upload
                  </label>
                </div>
                {file ? <div className="text-xs text-slate-500 mt-1">Selected: {file.name}</div> : null}
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
                onClick={saveLeague}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editing ? "Save League" : "Create League"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
