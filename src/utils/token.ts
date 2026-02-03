import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  EXPIRES_AT_KEY,
} from "@/constants/auth"

export function saveAuth(data: {
  accessToken: string
  refreshToken: string
  expiresIn: number
}) {
  const expiresAt = Date.now() + data.expiresIn * 1000

  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString())
}

export function clearAuth() {
  localStorage.clear()
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getExpiresAt() {
  const v = localStorage.getItem(EXPIRES_AT_KEY)
  return v ? Number(v) : null
}

export function isTokenExpired(bufferSeconds = 60) {
  const expiresAt = getExpiresAt()
  if (!expiresAt) return true

  return Date.now() > expiresAt - bufferSeconds * 1000
}
