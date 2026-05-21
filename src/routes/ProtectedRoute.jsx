import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import AdminLoginPage from "../pages/admin/AdminLoginPage"

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
        // Check admin status from a trusted source: `admin_users` or `profiles.role`
        const [{ data: adminRecord }, { data: profileRecord }] = await Promise.all([
          supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle(),
          supabase.from("profiles").select("role, is_admin").eq("id", user.id).maybeSingle(),
        ])

        const isAdmin = (adminRecord && adminRecord.user_id === user.id) || (profileRecord && (profileRecord.role === "super_admin" || profileRecord.is_admin === true))

        if (isAdmin) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
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
    // Render the admin login form inline so visiting /admin shows login
    return <AdminLoginPage />
  }

  return children
}
