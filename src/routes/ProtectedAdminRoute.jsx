import { Navigate } from "react-router-dom"

export default function ProtectedAdminRoute({
  user,
  profile,
  children,
}) {

  if (!user) {
    return <Navigate to="/admin/login" />
  }

  // Any authenticated user can access the admin dashboard
  return children
}
