import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authApi } from "@/api/auth.api"
import { saveAuth } from "@/utils/token"

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await authApi.login({ email, password })

      const { accessToken, refreshToken, expiresIn, user } = res.data

      saveAuth({ accessToken, refreshToken, expiresIn })

      localStorage.setItem("user", JSON.stringify(user))

      navigate("/")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return {
    login,
    logout,
    loading,
    error,
  }
}
