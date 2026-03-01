import axiosClient from "./axiosClient";
import axiosNoAuth from "./axiosNoAuth";

export interface AuthApiResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: any;
  };
}

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const res = await axiosNoAuth.post("/auth/login", payload);
    return res.data; // quan trọng
  },

  refresh: async (refreshToken: string) => {
    const res = await axiosNoAuth.post("/auth/refresh", { refreshToken });
    return res.data;
  },
  
  me: () => axiosClient.get("/auth/me"),

  logout: () => axiosClient.post("/auth/logout"),
};
