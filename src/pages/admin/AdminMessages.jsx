import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Trash2, Mail, User, MessageCircle } from "lucide-react"

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("contact_messages")
      .select("id, name, email, subject, message, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      setMessages([])
    } else {
      setMessages(data || [])
    }

    setLoading(false)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)
    if (error) {
      setError(error.message)
      return
    }
    setMessages((prev) => prev.filter((message) => message.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Admin Messages</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">User contact inquiries</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Manage all messages sent from the public contact form.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
            {loading ? "Loading messages..." : `${messages.length} message${messages.length === 1 ? "" : "s"}`}
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600">Fetching contact messages...</div>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-slate-600">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
                        <User className="h-4 w-4" /> {message.name || "Guest"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
                        <Mail className="h-4 w-4" /> {message.email || "No email"}
                      </span>
                    </div>
                    <div className="text-slate-800">
                      <p className="text-lg font-bold">{message.subject || "No subject"}</p>
                      <p className="mt-2 text-slate-600 whitespace-pre-line">{message.message || "No message content."}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 text-right">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Sent</p>
                    <p className="text-sm text-slate-600">{message.created_at ? new Date(message.created_at).toLocaleString() : "Unknown"}</p>
                    <button
                      type="button"
                      onClick={() => handleDelete(message.id)}
                      className="inline-flex items-center gap-2 self-end rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 transition"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600">No contact messages have been submitted yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
