import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  async function checkAdminStatus() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // If user is authenticated, grant admin access as requested
      if (user) {
        // We will grant access to all logged in users for now
        setAuthorized(true)

        // Try to optionally update or create their profile as super_admin
        const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle()
        if (profile) {
          await supabase.from("profiles").update({ role: "super_admin", is_admin: true }).eq("id", user.id)
        } else {
          await supabase.from("profiles").insert([{
            id: user.id,
            email: user.email,
            role: "super_admin",
            is_admin: true,
          }])
        }
      } else {
        setAuthorized(false)
      }
    } catch (err) {
      console.error("Admin check error:", err)
      setAuthorized(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-6">Please log in to access the admin dashboard.</p>
          <a href="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return children
}
