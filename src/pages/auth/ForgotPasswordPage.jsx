import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("If an account exists, a reset email has been sent. Check your inbox.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white rounded-[28px] border border-slate-200 shadow-2xl p-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-900">Reset Password</h1>
          <p className="text-slate-600 mt-3">
            Enter your email and we’ll send a password reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-slate-600">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-sky-500 outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>

          {message && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black py-4 text-lg transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center text-sm text-slate-500">
            Remembered your password?{' '}
            <Link to="/login" className="text-sky-500 font-semibold hover:text-sky-400">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
