import axiosClient from "./axiosClient"

export interface AuthApiResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    user: any
  }
}

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    axiosClient.post("/auth/login", payload) as Promise<AuthApiResponse>,

  refresh: (refreshToken: string) =>
    axiosClient.post("/auth/refresh", {
      refreshToken,
    }) as Promise<AuthApiResponse>,

  me: () =>
    axiosClient.get("/auth/me"),

  logout: () =>
    axiosClient.post("/auth/logout"),
}
