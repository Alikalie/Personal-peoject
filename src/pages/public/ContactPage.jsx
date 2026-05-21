import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function ContactPage() {
  const [supportContacts, setSupportContacts] = useState([])
  const [settings, setSettings] = useState({
    contactTitle: "Contact",
    contactIntro: "Reach out to our support team for VIP access, partnership inquiries, or general questions.",
    contactDescription: "Our team is available 24/7 to help you with VIP upgrades, membership information, and urgent questions.",
  })
  const [loadingContact, setLoadingContact] = useState(true)
  const [contactError, setContactError] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [statusMessage, setStatusMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadContactContent()
  }, [])

  async function loadContactContent() {
    setLoadingContact(true)
    setContactError(null)
    const { data: settingsRes, error: settingsError } = await supabase.from("site_settings").select("*").maybeSingle()

    if (!settingsError && settingsRes) {
      setSettings((prev) => ({
        ...prev,
        contactTitle: settingsRes.contact_header || settingsRes.contact_title || prev.contactTitle,
        contactIntro: settingsRes.contact_intro || prev.contactIntro,
        contactDescription: settingsRes.contact_description || prev.contactDescription,
      }))
    } else if (settingsError) {
      setContactError(settingsError.message)
    }

    try {
      const { data: contactsData, error: contactsError } = await supabase.from('contact_messages').select('*').order('id', { ascending: true })
      if (!contactsError && contactsData && contactsData.length) {
        setSupportContacts(
          contactsData.map((c) => ({ id: `id-${c.id}`, label: c.label || (c.detail?.includes('@') ? 'Email' : 'Contact'), detail: c.detail || '', icon: c.icon || '📧' }))
        )
      } else {
        // fallback to the two admin emails provided
        setSupportContacts([
          { id: 'fallback-1', label: 'Support Email', detail: 'alikaliefofanah0@gmail.com', icon: '📧' },
          { id: 'fallback-2', label: 'Support Email', detail: 'alikaliepapaykinniefofanah@gmail.com', icon: '📧' },
        ])
      }
    } catch (err) {
      console.warn('Failed to load support contacts', err)
      setSupportContacts([
        { id: 'fallback-1', label: 'Support Email', detail: 'alikaliefofanah0@gmail.com', icon: '📧' },
        { id: 'fallback-2', label: 'Support Email', detail: 'alikaliepapaykinniefofanah@gmail.com', icon: '📧' },
      ])
    }
    setLoadingContact(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setStatusMessage(null)

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      },
    ])

    setSubmitting(false)
    if (error) {
      setStatusMessage({ type: "error", text: error.message })
      return
    }

    setStatusMessage({ type: "success", text: "Your message has been sent. Our team will reach out shortly." })
    setForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-sky-400 mb-6">{settings.contactTitle}</h1>
          <p className="text-slate-600 max-w-3xl">{settings.contactIntro}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
          {loadingContact ? "Loading support channels..." : supportContacts.length ? `${supportContacts.length} support contacts available` : "No support contacts configured"}
        </div>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Contacts</h2>
            <p className="text-slate-600 mb-6">{settings.contactDescription}</p>

            {contactError ? (
              <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{contactError}</div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {supportContacts.length > 0 ? (
                supportContacts.map((contact) => (
                  <div key={contact.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-xl text-black">
                        {contact.icon || "📞"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{contact.label}</p>
                        {contact.detail?.includes('@') ? (
                          <a className="text-sm text-slate-600 hover:text-sky-500" href={`mailto:${contact.detail}`}>{contact.detail}</a>
                        ) : (
                          <p className="text-sm text-slate-600">{contact.detail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
                  No support contacts have been configured yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                placeholder="What do you need help with?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                className="w-full min-h-[140px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                placeholder="Tell us more about your request"
                required
              />
            </div>
            {statusMessage ? (
              <div className={`rounded-3xl p-4 text-sm ${statusMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                {statusMessage.text}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Sending message..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default ContactPage;
