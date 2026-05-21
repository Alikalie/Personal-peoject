import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { supabase } from "../../lib/supabase"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

const countryOptions = [
  { name: "Afghanistan", dial: "+93" },
  { name: "Albania", dial: "+355" },
  { name: "Algeria", dial: "+213" },
  { name: "Andorra", dial: "+376" },
  { name: "Angola", dial: "+244" },
  { name: "Antigua and Barbuda", dial: "+1-268" },
  { name: "Argentina", dial: "+54" },
  { name: "Armenia", dial: "+374" },
  { name: "Australia", dial: "+61" },
  { name: "Austria", dial: "+43" },
  { name: "Azerbaijan", dial: "+994" },
  { name: "Bahamas", dial: "+1-242" },
  { name: "Bahrain", dial: "+973" },
  { name: "Bangladesh", dial: "+880" },
  { name: "Barbados", dial: "+1-246" },
  { name: "Belarus", dial: "+375" },
  { name: "Belgium", dial: "+32" },
  { name: "Belize", dial: "+501" },
  { name: "Benin", dial: "+229" },
  { name: "Bhutan", dial: "+975" },
  { name: "Bolivia", dial: "+591" },
  { name: "Bosnia and Herzegovina", dial: "+387" },
  { name: "Botswana", dial: "+267" },
  { name: "Brazil", dial: "+55" },
  { name: "Brunei", dial: "+673" },
  { name: "Bulgaria", dial: "+359" },
  { name: "Burkina Faso", dial: "+226" },
  { name: "Burundi", dial: "+257" },
  { name: "Cabo Verde", dial: "+238" },
  { name: "Cambodia", dial: "+855" },
  { name: "Cameroon", dial: "+237" },
  { name: "Canada", dial: "+1" },
  { name: "Central African Republic", dial: "+236" },
  { name: "Chad", dial: "+235" },
  { name: "Chile", dial: "+56" },
  { name: "China", dial: "+86" },
  { name: "Colombia", dial: "+57" },
  { name: "Comoros", dial: "+269" },
  { name: "Costa Rica", dial: "+506" },
  { name: "Côte d'Ivoire", dial: "+225" },
  { name: "Croatia", dial: "+385" },
  { name: "Cuba", dial: "+53" },
  { name: "Cyprus", dial: "+357" },
  { name: "Czech Republic", dial: "+420" },
  { name: "Democratic Republic of the Congo", dial: "+243" },
  { name: "Denmark", dial: "+45" },
  { name: "Djibouti", dial: "+253" },
  { name: "Dominica", dial: "+1-767" },
  { name: "Dominican Republic", dial: "+1-809" },
  { name: "Ecuador", dial: "+593" },
  { name: "Egypt", dial: "+20" },
  { name: "El Salvador", dial: "+503" },
  { name: "Equatorial Guinea", dial: "+240" },
  { name: "Eritrea", dial: "+291" },
  { name: "Estonia", dial: "+372" },
  { name: "Eswatini", dial: "+268" },
  { name: "Ethiopia", dial: "+251" },
  { name: "Fiji", dial: "+679" },
  { name: "Finland", dial: "+358" },
  { name: "France", dial: "+33" },
  { name: "Gabon", dial: "+241" },
  { name: "Gambia", dial: "+220" },
  { name: "Georgia", dial: "+995" },
  { name: "Germany", dial: "+49" },
  { name: "Ghana", dial: "+233" },
  { name: "Greece", dial: "+30" },
  { name: "Grenada", dial: "+1-473" },
  { name: "Guatemala", dial: "+502" },
  { name: "Guinea", dial: "+224" },
  { name: "Guinea-Bissau", dial: "+245" },
  { name: "Guyana", dial: "+592" },
  { name: "Haiti", dial: "+509" },
  { name: "Honduras", dial: "+504" },
  { name: "Hungary", dial: "+36" },
  { name: "Iceland", dial: "+354" },
  { name: "India", dial: "+91" },
  { name: "Indonesia", dial: "+62" },
  { name: "Iran", dial: "+98" },
  { name: "Iraq", dial: "+964" },
  { name: "Ireland", dial: "+353" },
  { name: "Israel", dial: "+972" },
  { name: "Italy", dial: "+39" },
  { name: "Jamaica", dial: "+1-876" },
  { name: "Japan", dial: "+81" },
  { name: "Jordan", dial: "+962" },
  { name: "Kazakhstan", dial: "+7" },
  { name: "Kenya", dial: "+254" },
  { name: "Kiribati", dial: "+686" },
  { name: "Kosovo", dial: "+383" },
  { name: "Kuwait", dial: "+965" },
  { name: "Kyrgyzstan", dial: "+996" },
  { name: "Laos", dial: "+856" },
  { name: "Latvia", dial: "+371" },
  { name: "Lebanon", dial: "+961" },
  { name: "Lesotho", dial: "+266" },
  { name: "Liberia", dial: "+231" },
  { name: "Libya", dial: "+218" },
  { name: "Liechtenstein", dial: "+423" },
  { name: "Lithuania", dial: "+370" },
  { name: "Luxembourg", dial: "+352" },
  { name: "Madagascar", dial: "+261" },
  { name: "Malawi", dial: "+265" },
  { name: "Malaysia", dial: "+60" },
  { name: "Maldives", dial: "+960" },
  { name: "Mali", dial: "+223" },
  { name: "Malta", dial: "+356" },
  { name: "Marshall Islands", dial: "+692" },
  { name: "Mauritania", dial: "+222" },
  { name: "Mauritius", dial: "+230" },
  { name: "Mexico", dial: "+52" },
  { name: "Micronesia", dial: "+691" },
  { name: "Moldova", dial: "+373" },
  { name: "Monaco", dial: "+377" },
  { name: "Mongolia", dial: "+976" },
  { name: "Montenegro", dial: "+382" },
  { name: "Morocco", dial: "+212" },
  { name: "Mozambique", dial: "+258" },
  { name: "Myanmar", dial: "+95" },
  { name: "Namibia", dial: "+264" },
  { name: "Nauru", dial: "+674" },
  { name: "Nepal", dial: "+977" },
  { name: "Netherlands", dial: "+31" },
  { name: "New Zealand", dial: "+64" },
  { name: "Nicaragua", dial: "+505" },
  { name: "Niger", dial: "+227" },
  { name: "Nigeria", dial: "+234" },
  { name: "North Korea", dial: "+850" },
  { name: "North Macedonia", dial: "+389" },
  { name: "Norway", dial: "+47" },
  { name: "Oman", dial: "+968" },
  { name: "Pakistan", dial: "+92" },
  { name: "Palau", dial: "+680" },
  { name: "Panama", dial: "+507" },
  { name: "Papua New Guinea", dial: "+675" },
  { name: "Paraguay", dial: "+595" },
  { name: "Peru", dial: "+51" },
  { name: "Philippines", dial: "+63" },
  { name: "Poland", dial: "+48" },
  { name: "Portugal", dial: "+351" },
  { name: "Qatar", dial: "+974" },
  { name: "Republic of the Congo", dial: "+242" },
  { name: "Romania", dial: "+40" },
  { name: "Russia", dial: "+7" },
  { name: "Rwanda", dial: "+250" },
  { name: "Saint Kitts and Nevis", dial: "+1-869" },
  { name: "Saint Lucia", dial: "+1-758" },
  { name: "Saint Vincent and the Grenadines", dial: "+1-784" },
  { name: "Samoa", dial: "+685" },
  { name: "San Marino", dial: "+378" },
  { name: "Sao Tome and Principe", dial: "+239" },
  { name: "Saudi Arabia", dial: "+966" },
  { name: "Senegal", dial: "+221" },
  { name: "Serbia", dial: "+381" },
  { name: "Seychelles", dial: "+248" },
  { name: "Sierra Leone", dial: "+232" },
  { name: "Singapore", dial: "+65" },
  { name: "Slovakia", dial: "+421" },
  { name: "Slovenia", dial: "+386" },
  { name: "Solomon Islands", dial: "+677" },
  { name: "Somalia", dial: "+252" },
  { name: "South Africa", dial: "+27" },
  { name: "South Korea", dial: "+82" },
  { name: "South Sudan", dial: "+211" },
  { name: "Spain", dial: "+34" },
  { name: "Sri Lanka", dial: "+94" },
  { name: "Sudan", dial: "+249" },
  { name: "Suriname", dial: "+597" },
  { name: "Sweden", dial: "+46" },
  { name: "Switzerland", dial: "+41" },
  { name: "Syria", dial: "+963" },
  { name: "Taiwan", dial: "+886" },
  { name: "Tajikistan", dial: "+992" },
  { name: "Tanzania", dial: "+255" },
  { name: "Thailand", dial: "+66" },
  { name: "Timor-Leste", dial: "+670" },
  { name: "Togo", dial: "+228" },
  { name: "Tonga", dial: "+676" },
  { name: "Trinidad and Tobago", dial: "+1-868" },
  { name: "Tunisia", dial: "+216" },
  { name: "Turkey", dial: "+90" },
  { name: "Turkmenistan", dial: "+993" },
  { name: "Tuvalu", dial: "+688" },
  { name: "Uganda", dial: "+256" },
  { name: "Ukraine", dial: "+380" },
  { name: "United Arab Emirates", dial: "+971" },
  { name: "United Kingdom", dial: "+44" },
  { name: "United States", dial: "+1" },
  { name: "Uruguay", dial: "+598" },
  { name: "Uzbekistan", dial: "+998" },
  { name: "Vanuatu", dial: "+678" },
  { name: "Vatican City", dial: "+379" },
  { name: "Venezuela", dial: "+58" },
  { name: "Vietnam", dial: "+84" },
  { name: "Yemen", dial: "+967" },
  { name: "Zambia", dial: "+260" },
  { name: "Zimbabwe", dial: "+263" },
]

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isLogin, setIsLogin] = useState(true)
  const [adminOnly, setAdminOnly] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get("admin") === "1") {
      setAdminOnly(true)
      setIsLogin(true)
    }
  }, [location.search])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [contact, setContact] = useState("")
  const [country, setCountry] = useState("")

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const selectedCountry = countryOptions.find((option) => option.name === country)
  const dialCode = selectedCountry?.dial || "+"

  async function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)
    setMessage("")

    if (isLogin) {
      // check site setting for login availability
      try {
        const { data: settings } = await supabase.from("site_settings").select("allow_login").maybeSingle()
        if (!settings?.allow_login) {
          alert("Login is currently disabled.")
          setLoading(false)
          return
        }
      } catch (err) {
        // if settings check fails, continue to attempt login
        console.warn('Failed to check allow_login', err)
      }
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        const user = signInData?.user || (await supabase.auth.getUser()).data.user

        // No admin restriction: allow any signed-in user to go to admin
        navigate("/admin/dashboard")
      }
    } else {
      // check site setting for registration availability
      try {
        const { data: settings } = await supabase.from("site_settings").select("allow_registration").maybeSingle()
        if (!settings?.allow_registration) {
          alert("Registration is currently disabled.")
          setLoading(false)
          return
        }
      } catch (err) {
        console.warn('Failed to check allow_registration', err)
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage("Account created successfully. Check your email.")

        if (data?.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: name,
            contact_number: contact,
            country: country,
            email: email,
            role: "user",
          })
        }
      }
    }

    setLoading(false)
  }

  return (
    <div className={`min-h-screen text-slate-900 flex items-center justify-center relative overflow-hidden px-6 py-10 ${adminOnly ? 'bg-[#077B8A]' : 'bg-slate-50'}`}>
      {/* BACKGROUND */}
      {!adminOnly && (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-400/10 blur-3xl rounded-full"></div>
        </div>
      )}

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full ${adminOnly ? "max-w-md" : "max-w-3xl"} bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg ${adminOnly ? 'px-6 py-10' : ''} grid lg:grid-cols-2`}
      >
        {/* LEFT SIDE */}
        {!adminOnly && (
          <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-sky-500 to-sky-700 text-black">
          <div>
            <h1 className="text-5xl font-black leading-tight">BetPro Tips</h1>

            <p className="mt-6 text-lg leading-relaxed font-medium">
              Join thousands of football bettors using our expert predictions,
              VIP tips, and match analysis daily.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-100 backdrop-blur rounded-2xl p-5 border border-slate-200/70">
              <h3 className="font-black text-xl text-slate-900">Daily Winning Tips</h3>
              <p className="mt-2 text-slate-600">
                Accurate predictions from top football matches worldwide.
              </p>
            </div>

            <div className="bg-slate-100 backdrop-blur rounded-2xl p-5 border border-slate-200/70">
              <h3 className="font-black text-xl text-slate-900">VIP Premium Access</h3>
              <p className="mt-2 text-slate-600">
                Get access to high-confidence accumulator predictions.
              </p>
            </div>
          </div>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className={`flex flex-col justify-center transition ${isLogin ? "bg-white border-l border-slate-200" : "bg-slate-50 border-l border-slate-200"} ${adminOnly ? 'p-6' : 'p-8 lg:p-12'}`}>
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
              <div className="h-10 w-10 rounded-lg bg-sky-500 flex items-center justify-center text-black font-black">BP</div>
              <div>
                <div className="text-lg font-extrabold">BetPro Tips</div>
                <div className="text-sm text-slate-500">Professional match predictions</div>
              </div>
            </div>

            {/* Admin-only simplified header */}
            {adminOnly ? (
              <>
                <h2 className="text-3xl font-extrabold text-slate-900">Login</h2>
                <p className="text-slate-600 mt-2 text-base">Sign in to continue</p>
              </>
            ) : (
              <>
                <h2 className={`text-3xl font-extrabold ${isLogin ? "text-slate-900" : "text-emerald-700"}`}>
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                <p className="text-slate-600 mt-2 text-base">
                  {isLogin ? "Sign in to access the admin dashboard" : "Register to access football predictions"}
                </p>
              </>
            )}
          </div>

          {/* TOGGLE */}
          {!adminOnly && (
            <div className="flex bg-slate-100 rounded-2xl p-2 mb-8 border border-slate-200">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl font-bold transition ${
                  isLogin ? "bg-sky-500 text-black" : "text-slate-600"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl font-bold transition ${
                  !isLogin ? "bg-sky-500 text-black" : "text-slate-600"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className={`space-y-5 ${adminOnly ? 'max-w-md mx-auto' : ''}`}>
            {!isLogin && !adminOnly && (
              <>
                <div>
                  <label className="block mb-2 text-sm text-slate-600">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-sky-400 outline-none shadow-sm transition text-sm"
                      required
                    />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-600">
                    Contact Number
                    {country && (
                      <span className="ml-2 text-xs text-sky-300">
                        {dialCode}
                      </span>
                    )}
                  </label>
                  <input
                    type="tel"
                    placeholder={
                      selectedCountry
                        ? `${selectedCountry.dial} 7000 000000`
                        : "Enter your phone number"
                    }
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-sky-400 outline-none shadow-sm transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-600">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-sky-400 outline-none shadow-sm transition text-sm"
                    required
                  >
                    <option value="">Select country</option>
                    {countryOptions.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )} 

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Email:</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ${adminOnly ? 'h-14 px-6' : 'px-4 py-3'} rounded-lg bg-white border border-slate-200 focus:border-sky-400 outline-none shadow-sm transition text-sm`}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Password:</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full ${adminOnly ? 'h-14 px-6' : 'px-4 py-3'} rounded-lg bg-white border border-slate-200 focus:border-sky-400 outline-none shadow-sm transition text-sm`}
                required
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-500"
                  />
                  Show Password
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot")}
                  className="text-sky-500 font-semibold hover:text-sky-400"
                >
                  Forgot Username / Password?
                </button>
              </div>
            )}

            {message && (
              <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl text-sm text-center text-slate-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${adminOnly ? 'py-4' : 'py-3'} rounded-xl bg-[#077B8A] text-white font-bold text-lg hover:opacity-95 transition shadow-md disabled:opacity-50`}
            >
              {loading ? "Please wait..." : isLogin ? "SIGN IN" : "Create account"}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 text-sm">
            By continuing, you agree to our Terms & Privacy Policy.
          </div>
        </div>
      </motion.div>
    </div>
  )
}
