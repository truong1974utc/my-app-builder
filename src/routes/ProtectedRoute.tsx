import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("access_token")
  const user = localStorage.getItem("user")

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}
