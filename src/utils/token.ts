interface SaveAuthPayload {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export function saveAuth({
  accessToken,
  refreshToken,
  expiresIn,
}: SaveAuthPayload) {
  localStorage.setItem("access_token", accessToken)
  localStorage.setItem("refresh_token", refreshToken)

  const expiresAt = Date.now() + expiresIn * 1000
  localStorage.setItem("expires_at", expiresAt.toString())
}

export function clearAuth() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("expires_at")
}
