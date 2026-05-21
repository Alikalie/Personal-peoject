import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"

export default function AdminLoginPage() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e) {

    e.preventDefault()

    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // No role enforcement: any authenticated user can access dashboard
    if (data?.user) {
      navigate("/admin/dashboard")
      setLoading(false)
      return
    }

    setError("Unable to sign in")
    setLoading(false)
  }

  useEffect(() => {
    // if already signed in, redirect to dashboard
    async function check() {
      try {
        const { data } = await supabase.auth.getUser()
        const current = data?.user ?? null
        if (!current) return
        navigate('/admin/dashboard')
      } catch (err) {
        console.warn('auto admin check failed', err)
      }
    }

    check()
  }, [navigate])

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-sky-500 text-white text-center py-8 px-6">

          <h1 className="text-4xl font-bold mb-2">
            Admin Panel
          </h1>

          <p className="text-sky-100 text-sm">
            Betting Platform Management System
          </p>

        </div>

        <div className="p-8">

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 transition text-white font-bold py-3 rounded-xl"
            >
              {loading ? "Signing In..." : "Admin Login"}
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Secure Super Admin Access
          </div>

        </div>

      </div>

    </div>
  )
}
