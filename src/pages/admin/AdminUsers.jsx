import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Plus, RefreshCcw, Shield, Unlock, Loader2, X } from "lucide-react"

const emptyUserForm = {
  full_name: "",
  email: "",
  role: "Member",
  is_vip: false,
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [newUser, setNewUser] = useState(emptyUserForm)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    setNotification(null)

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, is_vip, is_active, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      setNotification({ type: "error", message: error.message })
      setUsers([])
    } else {
      setUsers(data || [])
    }

    setLoading(false)
  }

  async function createUser() {
    setActionLoading(true)
    const { error } = await supabase.from("profiles").insert([
      {
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        is_vip: newUser.is_vip,
        is_active: true,
      },
    ])
    setActionLoading(false)

    if (error) {
      setNotification({ type: "error", message: error.message })
      return
    }

    setNotification({ type: "success", message: "User profile created successfully." })
    setModalOpen(false)
    setNewUser(emptyUserForm)
    loadUsers()
  }

  async function sendPasswordReset(user) {
    if (!user.email) {
      setNotification({ type: "error", message: "No email address available for this user." })
      return
    }

    setActionLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    setActionLoading(false)

    if (error) {
      setNotification({ type: "error", message: error.message })
    } else {
      setNotification({ type: "success", message: `Password reset email sent to ${user.email}.` })
    }
  }

  async function toggleVip(user) {
    setActionLoading(true)
    const { error } = await supabase.from("profiles").update({ is_vip: !user.is_vip }).eq("id", user.id)
    setActionLoading(false)

    if (error) {
      setNotification({ type: "error", message: error.message })
    } else {
      setNotification({ type: "success", message: `VIP status updated for ${user.full_name}.` })
      loadUsers()
    }
  }

  async function toggleActive(user) {
    setActionLoading(true)
    const { error } = await supabase.from("profiles").update({ is_active: !user.is_active }).eq("id", user.id)
    setActionLoading(false)

    if (error) {
      setNotification({ type: "error", message: error.message })
    } else {
      setNotification({ type: "success", message: `${user.full_name} has been ${user.is_active ? "deactivated" : "activated"}.` })
      loadUsers()
    }
  }

  function highlightStatus(user) {
    if (user.is_active === false) return "text-red-500"
    return "text-emerald-600"
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-600 mt-2">View registered profiles, trigger password resets, and update VIP access.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition"
        >
          <Plus className="h-4 w-4" />
          Add User
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">VIP</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-600">
                  <div className="inline-flex items-center gap-2 font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading users...
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-4 text-slate-700">{user.full_name || "Anonymous"}</td>
                  <td className="px-4 py-4 text-slate-700">{user.email || "-"}</td>
                  <td className="px-4 py-4 text-slate-700">{user.role || "Member"}</td>
                  <td className="px-4 py-4 text-slate-700">{user.is_vip ? "Yes" : "No"}</td>
                  <td className={`px-4 py-4 font-semibold ${highlightStatus(user)}`}>{user.is_active === false ? "Inactive" : "Active"}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => sendPasswordReset(user)}
                      disabled={actionLoading}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
                    >
                      <Unlock className="h-3.5 w-3.5 inline-block" /> Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVip(user)}
                      disabled={actionLoading}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-400 transition"
                    >
                      <Shield className="h-3.5 w-3.5 inline-block" /> {user.is_vip ? "Revoke VIP" : "Grant VIP"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(user)}
                      disabled={actionLoading}
                      className="rounded-2xl border border-red-700 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-700/10 transition"
                    >
                      {user.is_active === false ? "Activate" : "Deactivate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-600">
                  No users found. Add one with the button above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Create User Profile</h3>
                <p className="text-sm text-slate-500">Adding a profile row for platform user management.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-600 hover:border-slate-300 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="space-y-2 text-sm text-slate-700">
                Full Name
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(event) => setNewUser({ ...newUser, full_name: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                  placeholder="Enter full name"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Email
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                  placeholder="user@example.com"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Role
                  <select
                    value={newUser.role}
                    onChange={(event) => setNewUser({ ...newUser, role: event.target.value })}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                  >
                    <option value="Member">Member</option>
                    <option value="VIP">VIP</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>
                <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newUser.is_vip}
                    onChange={(event) => setNewUser({ ...newUser, is_vip: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                  Grant VIP
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createUser}
                disabled={actionLoading}
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Profile
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
