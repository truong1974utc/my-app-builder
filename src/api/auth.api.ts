import axiosClient from "./axiosClient"

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number,
  user: any
}

export interface LoginApiResponse {
  success: boolean
  data: LoginResponse
}

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    axiosClient.post<{ success: boolean; data: LoginResponse }>(
      "/auth/login",
      payload
    ),

  refresh: (refreshToken: string) =>
    axiosClient.post("/auth/refresh", {
      refreshToken,
    }),

  me: () =>
    axiosClient.get("/auth/me"),

  logout: () =>
    axiosClient.post("/auth/logout"),
}
