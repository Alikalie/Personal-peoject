import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import AdminLoginPage from "./pages/admin/AdminLoginPage"

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
