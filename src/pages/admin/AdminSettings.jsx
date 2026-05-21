import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const defaultSettings = {
  siteTitle: "BetPro Tips",
  homepageHeadline: "Daily Winning Football Tips",
  vipBanner: "Unlock premium betting analysis",
  footerText: "Professional football betting predictions platform providing daily expert tips and VIP betting analysis.",
  contactHeader: "Contact",
  contactIntro: "Reach out to our support team for VIP access, partnership inquiries, or general questions.",
  contactDescription: "Our support team is here 24/7 for VIP members and new signups.",
  navHomeEnabled: true,
  navPredictionsEnabled: true,
  navVipEnabled: true,
  navLeaguesEnabled: true,
  navContactEnabled: true,
  allowLogin: false,
  allowRegistration: false,
}

function createBlankContact() {
  return {
    uid: crypto?.randomUUID?.() ?? `new-${Date.now()}`,
    label: "",
    detail: "",
    icon: "📞",
    id: null,
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [supportContacts, setSupportContacts] = useState([createBlankContact()])
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    // fetch full settings row
    const settingsRes = await supabase.from("site_settings").select("*").maybeSingle()
    const { data: contactsData, error: contactsError } = await supabase.from("contact_messages").select("*").order('id', { ascending: true })

    if (!settingsRes.error && settingsRes.data) {
      const data = settingsRes.data || {}
      setSettings((prev) => ({
        ...prev,
        siteTitle: data.site_title || prev.siteTitle,
        homepageHeadline: data.homepage_headline || prev.homepageHeadline,
        vipBanner: data.vip_banner || prev.vipBanner,
        footerText: data.footer_text || prev.footerText,
        contactHeader: data.contact_header || data.contact_title || prev.contactHeader,
        contactIntro: data.contact_intro || prev.contactIntro,
        contactDescription: data.contact_description || prev.contactDescription,
        navHomeEnabled: data.nav_home_enabled ?? prev.navHomeEnabled,
        navPredictionsEnabled: data.nav_predictions_enabled ?? prev.navPredictionsEnabled,
        navVipEnabled: data.nav_vip_enabled ?? prev.navVipEnabled,
        navContactEnabled: data.nav_contact_enabled ?? prev.navContactEnabled,
        allowLogin: data.allow_login ?? prev.allowLogin,
        allowRegistration: data.allow_registration ?? prev.allowRegistration,
      }))
    } else if (settingsRes.error) {
      setNotification({ type: "error", message: `Failed to load site settings: ${settingsRes.error.message}` })
    }

    if (!contactsError && contactsData) {
      // map into UI-friendly objects
      setSupportContacts(
        contactsData.map((c) => ({ uid: `id-${c.id}`, label: c.label || "", detail: c.detail || "", icon: c.icon || "", id: c.id }))
      )
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  async function saveSettings() {
    setSaving(true)
    setNotification(null)

    const payload = {
      site_title: settings.siteTitle,
      homepage_headline: settings.homepageHeadline,
      vip_banner: settings.vipBanner,
      footer_text: settings.footerText,
      contact_header: settings.contactHeader,
      contact_title: settings.contactHeader,
      contact_intro: settings.contactIntro,
      contact_description: settings.contactDescription,
      nav_home_enabled: settings.navHomeEnabled,
      nav_predictions_enabled: settings.navPredictionsEnabled,
      nav_vip_enabled: settings.navVipEnabled,
      nav_contact_enabled: settings.navContactEnabled,
      allow_login: settings.allowLogin,
      allow_registration: settings.allowRegistration,
    }

    const { error } = await supabase.from("site_settings").upsert([payload])
    // save contact messages: simple approach - delete all and insert the current list
    if (!error) {
      const clean = supportContacts
        .filter((c) => c.label || c.detail)
        .map((c) => ({ label: c.label, detail: c.detail, icon: c.icon }))

      const { error: delErr } = await supabase.from('contact_messages').delete().gt('id', 0)
      if (delErr) {
        console.warn('Failed to clear contact_messages', delErr)
      }

      if (clean.length) {
        const { error: insErr } = await supabase.from('contact_messages').insert(clean)
        if (insErr) console.warn('Failed to insert contact_messages', insErr)
      }
    }

    setSaving(false)

    if (error) {
      setNotification({ type: "error", message: error.message })
    } else {
      setNotification({ type: "success", message: "Site settings saved successfully." })
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Site & Contact Settings</h2>
        <p className="text-slate-600 mt-2">Update homepage content, support contact details, and footer copy from the admin panel.</p>
      </div>

      {notification ? (
        <div className={`rounded-3xl border p-4 text-sm ${notification.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {notification.message}
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Site Title</label>
            <input
              name="siteTitle"
              value={settings.siteTitle}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Homepage Headline</label>
            <input
              name="homepageHeadline"
              value={settings.homepageHeadline}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">VIP Banner Text</label>
            <input
              name="vipBanner"
              value={settings.vipBanner}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Footer Text</label>
            <textarea
              name="footerText"
              value={settings.footerText}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
              rows={3}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Header</label>
            <input
              name="contactHeader"
              value={settings.contactHeader}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Intro Paragraph</label>
            <input
              name="contactIntro"
              value={settings.contactIntro}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Description</label>
            <input
              name="contactDescription"
              value={settings.contactDescription}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Navigation visibility</p>
            <div className="space-y-3 text-slate-700">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.navHomeEnabled}
                  onChange={(event) => setSettings((prev) => ({ ...prev, navHomeEnabled: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500"
                />
                Show Home link
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.navPredictionsEnabled}
                  onChange={(event) => setSettings((prev) => ({ ...prev, navPredictionsEnabled: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500"
                />
                Show Predictions link
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.navVipEnabled}
                  onChange={(event) => setSettings((prev) => ({ ...prev, navVipEnabled: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500"
                />
                Show VIP link
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.navLeaguesEnabled}
                  onChange={(event) => setSettings((prev) => ({ ...prev, navLeaguesEnabled: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500"
                />
                Show Leagues link
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.navContactEnabled}
                  onChange={(event) => setSettings((prev) => ({ ...prev, navContactEnabled: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500"
                />
                Show Contact link
              </label>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Auth Controls</p>
            <div className="space-y-3 text-slate-700">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.allowLogin}
                  onChange={(event) => setSettings((prev) => ({ ...prev, allowLogin: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500"
                />
                Allow Login
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(event) => setSettings((prev) => ({ ...prev, allowRegistration: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500"
                />
                Allow Registration
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition disabled:opacity-50"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
