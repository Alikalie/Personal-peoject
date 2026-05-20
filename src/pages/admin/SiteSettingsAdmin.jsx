import { useState } from "react"

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState({
    siteTitle: "BetPro Tips",
    homepageHeadline: "Daily Winning Football Tips",
    vipBanner: "Unlock premium betting analysis",
  })

  const handleUpdate = (event) => {
    const { name, value } = event.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-2xl font-bold text-white">Site Settings</h2>
        <p className="text-gray-400 mt-2">Update homepage content, banner text, and platform messaging.</p>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">Site Title</label>
          <input
            name="siteTitle"
            value={settings.siteTitle}
            onChange={handleUpdate}
            className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">Homepage Headline</label>
          <input
            name="homepageHeadline"
            value={settings.homepageHeadline}
            onChange={handleUpdate}
            className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">VIP Banner Text</label>
          <input
            name="vipBanner"
            value={settings.vipBanner}
            onChange={handleUpdate}
            className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
          />
        </div>

        <button className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-black hover:bg-sky-400 transition">
          Save Settings
        </button>
      </div>
    </div>
  )
}
