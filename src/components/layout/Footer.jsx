import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../lib/supabase"

export default function Footer() {
  const [footerText, setFooterText] = useState(
    "Professional football betting predictions platform providing daily expert tips and VIP betting analysis."
  )
  const [supportContacts, setSupportContacts] = useState([])
  const [linkVisibility, setLinkVisibility] = useState({
    home: true,
    predictions: true,
    vip: true,
    leagues: true,
    contact: true,
  })
  const [siteTitleFooter, setSiteTitleFooter] = useState("BetPro Tips")
  const [loadingFooter, setLoadingFooter] = useState(true)

  useEffect(() => {
    loadFooterContent()
  }, [])

  async function loadFooterContent() {
    setLoadingFooter(true)
    const { data: settingsRes, error: settingsError } = await supabase.from("site_settings").select("*").maybeSingle()

    if (!settingsError && settingsRes) {
      if (settingsRes.footer_text) setFooterText(settingsRes.footer_text)
      if (settingsRes.site_title) setSiteTitleFooter(settingsRes.site_title)
      setLinkVisibility({
        home: settingsRes.nav_home_enabled ?? true,
        predictions: settingsRes.nav_predictions_enabled ?? true,
        vip: settingsRes.nav_vip_enabled ?? true,
        contact: settingsRes.nav_contact_enabled ?? true,
      })
    }

    setSupportContacts([
      { id: "fallback-1", label: "Email", detail: "alikaliefofanah0@gmal.com" },
      { id: "fallback-2", label: "WhatsApp", detail: "+232 77864684" },
    ])

    setLoadingFooter(false)
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-black text-sky-400">BetPro Tips</h2>
          <p className="text-slate-600 mt-4 leading-relaxed text-sm">{footerText}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Quick Links</h3>
          <div className="space-y-3 text-slate-600">
            {linkVisibility.home ? (
              <Link to="/" className="hover:text-sky-400 transition block">
                Home
              </Link>
            ) : null}
            {linkVisibility.predictions ? (
              <Link to="/predictions" className="hover:text-sky-400 transition block">
                Predictions
              </Link>
            ) : null}
            {linkVisibility.vip ? (
              <Link to="/vip" className="hover:text-sky-400 transition block">
                VIP Tips
              </Link>
            ) : null}
            {linkVisibility.contact ? (
              <Link to="/contact" className="hover:text-sky-400 transition block">
                Contact
              </Link>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Contact</h3>
          <div className="space-y-3 text-slate-600">
            {supportContacts.map((contact) => (
              <p key={contact.id}>{contact.detail}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} {siteTitleFooter}. All rights reserved.
      </div>
    </footer>
  )
}
