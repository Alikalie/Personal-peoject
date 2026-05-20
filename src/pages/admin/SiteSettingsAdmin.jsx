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

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState(defaultSettings)
  const [supportContacts, setSupportContacts] = useState([createBlankContact()])
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const [settingsRes, contactsRes] = await Promise.all([
      supabase.from("site_settings").select("id, site_title, homepage_headline, vip_banner, footer_text, contact_header, contact_intro, contact_description, nav_home_enabled, nav_predictions_enabled, nav_vip_enabled, nav_leagues_enabled, nav_contact_enabled").single(),
      supabase.from("support_contacts").select("id, label, detail, icon").order("id", { ascending: true }),
    ])

    if (!settingsRes.error && settingsRes.data) {
      setSettings((prev) => ({ ...prev, ...{
        siteTitle: settingsRes.data.site_title || prev.siteTitle,
        homepageHeadline: settingsRes.data.homepage_headline || prev.homepageHeadline,
        vipBanner: settingsRes.data.vip_banner || prev.vipBanner,
        footerText: settingsRes.data.footer_text || prev.footerText,
        contactHeader: settingsRes.data.contact_header || prev.contactHeader,
        contactIntro: settingsRes.data.contact_intro || prev.contactIntro,
        contactDescription: settingsRes.data.contact_description || prev.contactDescription,
        navHomeEnabled: settingsRes.data.nav_home_enabled ?? prev.navHomeEnabled,
        navPredictionsEnabled: settingsRes.data.nav_predictions_enabled ?? prev.navPredictionsEnabled,
        navVipEnabled: settingsRes.data.nav_vip_enabled ?? prev.navVipEnabled,
        navLeaguesEnabled: settingsRes.data.nav_leagues_enabled ?? prev.navLeaguesEnabled,
        navContactEnabled: settingsRes.data.nav_contact_enabled ?? prev.navContactEnabled,
      }}))
    }

    if (!contactsRes.error && contactsRes.data) {
      setSupportContacts(contactsRes.data.map((item) => ({ ...item, uid: item.id || `contact-${item.id}` })))
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  function updateContact(index, field, value) {
    setSupportContacts((prev) => prev.map((contact, idx) => (idx === index ? { ...contact, [field]: value } : contact)))
  }

  function addContact() {
    setSupportContacts((prev) => [...prev, createBlankContact()])
  }

  async function deleteContact(contact, index) {
    if (contact.id) {
      const { error } = await supabase.from("support_contacts").delete().eq("id", contact.id)
      if (error) {
        setNotification({ type: "error", message: error.message })
        return
      }
    }
    setSupportContacts((prev) => prev.filter((_, idx) => idx !== index))
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
      contact_intro: settings.contactIntro,
      contact_description: settings.contactDescription,
      nav_home_enabled: settings.navHomeEnabled,
      nav_predictions_enabled: settings.navPredictionsEnabled,
      nav_vip_enabled: settings.navVipEnabled,
      nav_leagues_enabled: settings.navLeaguesEnabled,
      nav_contact_enabled: settings.navContactEnabled,
    }

    const { error } = await supabase.from("site_settings").upsert([payload], { onConflict: "id" })
    setSaving(false)

    if (error) {
      setNotification({ type: "error", message: error.message })
    } else {
      setNotification({ type: "success", message: "Site settings saved successfully." })
    }
  }

  async function saveContacts() {
    setSaving(true)
    setNotification(null)
    const payload = supportContacts.map(({ id, label, detail, icon }) => ({ id, label, detail, icon }))
    const { error } = await supabase.from("support_contacts").upsert(payload, { onConflict: "id" })
    setSaving(false)

    if (error) {
      setNotification({ type: "error", message: error.message })
    } else {
      setNotification({ type: "success", message: "Support contacts saved successfully." })
      loadSettings()
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
          <button
            type="button"
            onClick={saveContacts}
            disabled={saving}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-400 transition disabled:opacity-50"
          >
            Save Support Contacts
          </button>
          <button
            type="button"
            onClick={addContact}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-400 transition"
          >
            Add support contact
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {supportContacts.map((contact, index) => (
          <div key={contact.uid} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm text-slate-700">
                  Label
                  <input
                    value={contact.label}
                    onChange={(event) => updateContact(index, "label", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
                    placeholder="Email, WhatsApp, Telegram"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Detail
                  <input
                    value={contact.detail}
                    onChange={(event) => updateContact(index, "detail", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
                    placeholder="support@betprotips.com"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Icon
                  <input
                    value={contact.icon}
                    onChange={(event) => updateContact(index, "icon", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
                    placeholder="📞"
                  />
                </label>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => deleteContact(contact, index)}
                  className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
