import { useEffect, useState } from "react"
import { NavLink, Link } from "react-router-dom"
import { supabase } from "../../lib/supabase"

export default function Navbar() {
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: "BetPro Tips",
    navHomeEnabled: true,
    navPredictionsEnabled: true,
    navVipEnabled: true,
    navContactEnabled: true,
    allowLogin: false,
  })
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClasses = ({ isActive }) =>
    `hover:text-sky-400 transition ${isActive ? "text-sky-400" : "text-slate-500"}`

  useEffect(() => {
    async function loadNavSettings() {
      setLoadingSettings(true)
      // select full row to tolerate missing columns
      const { data, error } = await supabase.from("site_settings").select("*").maybeSingle()

      if (!error && data) {
        setSiteSettings((prev) => ({
          ...prev,
          siteTitle: data.site_title || prev.siteTitle,
          navHomeEnabled: data.nav_home_enabled ?? prev.navHomeEnabled,
          navPredictionsEnabled: data.nav_predictions_enabled ?? prev.navPredictionsEnabled,
          navVipEnabled: data.nav_vip_enabled ?? prev.navVipEnabled,
          navContactEnabled: data.nav_contact_enabled ?? prev.navContactEnabled,
          allowLogin: data.allow_login ?? prev.allowLogin,
        }))
      }
      setLoadingSettings(false)
    }

    loadNavSettings()
  }, [])

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xl font-bold tracking-wide text-sky-400">
            {siteSettings.siteTitle}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {siteSettings.navHomeEnabled ? (
            <NavLink to="/" className={linkClasses} end>
              Home
            </NavLink>
          ) : null}
          {siteSettings.navPredictionsEnabled ? (
            <NavLink to="/predictions" className={linkClasses}>
              Predictions
            </NavLink>
          ) : null}
          {siteSettings.navVipEnabled ? (
            <NavLink to="/vip" className={linkClasses}>
              VIP Tips
            </NavLink>
          ) : null}
          {siteSettings.navContactEnabled ? (
            <NavLink to="/contact" className={linkClasses}>
              Contact
            </NavLink>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 border border-slate-200"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Login removed from navbar — admin login available at /admin */}

          {siteSettings.navVipEnabled ? (
            <Link
              to="/vip"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold transition text-sm"
            >
              Join VIP
            </Link>
          ) : null}
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl transform transition duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="text-lg font-bold text-sky-500">
                  {siteSettings.siteTitle}
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md border border-slate-200">
                  <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-4">
                {siteSettings.navHomeEnabled ? (
                  <NavLink to="/" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Home
                  </NavLink>
                ) : null}
                {siteSettings.navPredictionsEnabled ? (
                  <NavLink to="/predictions" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Predictions
                  </NavLink>
                ) : null}
                {siteSettings.navVipEnabled ? (
                  <NavLink to="/vip" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    VIP Tips
                  </NavLink>
                ) : null}
                {siteSettings.navContactEnabled ? (
                  <NavLink to="/contact" className="text-slate-800 text-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Contact
                  </NavLink>
                ) : null}
              </nav>

              <div className="mt-6 space-y-3">
                {/* Login removed from mobile nav — admin login available at /admin */}

                {siteSettings.navVipEnabled ? (
                  <Link to="/vip" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold">
                    Join VIP
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
