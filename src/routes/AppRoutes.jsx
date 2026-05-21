import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

import AdminLoginPage from "../pages/admin/AdminLoginPage"
import ProtectedAdminRoute from "./ProtectedAdminRoute"
import PublicLayout from "../components/layout/PublicLayout"
import AdminLayout from "../components/layout/AdminLayout"
import ProtectedRoute from "./ProtectedRoute"

import HomePage from "../pages/public/HomePage"
import PredictionsPage from "../pages/public/PredictionsPage"
import VipPage from "../pages/public/VipPage"
import ContactPage from "../pages/public/ContactPage"

import LoginPage from "../pages/auth/LoginPage"
import ForgotPassword from "../pages/auth/ForgotPasswordPage"

import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminPredictions from "../pages/admin/AdminPredictions"
import AdminMatches from "../pages/admin/AdminMatches"
import AdminUsers from "../pages/admin/AdminUsers"
import AdminMessages from "../pages/admin/AdminMessages"
import AdminSettings from "../pages/admin/AdminSettings"
import AdminVipPlans from "../pages/admin/AdminVipPlans"

export default function AppRoutes() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function loadAuth() {
      try {
        const { data } = await supabase.auth.getUser()
        const current = data?.user ?? null
        setUser(current)

        if (current) {
          const { data: prof } = await supabase.from("profiles").select("*").eq("id", current.id).maybeSingle()
          setProfile(prof || null)
        }
      } catch (err) {
        console.warn("Failed to load auth", err)
      }
    }

    loadAuth()
  }, [])
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/predictions" element={<PredictionsPage />} />
        <Route path="/vip" element={<VipPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute user={user} profile={profile}>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="predictions" element={<AdminPredictions />} />
        <Route path="matches" element={<AdminMatches />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="vip" element={<AdminVipPlans />} />
      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
