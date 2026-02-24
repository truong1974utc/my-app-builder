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
    console.log("🟢 Calling LOGIN API");
    const res = await axiosNoAuth.post("/auth/login", payload);
    console.log("🟢 LOGIN RESPONSE:", res.data);
    return res.data; // quan trọng
  },

  refresh: async (refreshToken: string) => {
    console.log("🟡 Calling REFRESH API");
    const res = await axiosNoAuth.post("/auth/refresh", { refreshToken });
    console.log("🟡 REFRESH RESPONSE:", res.data);
    return res.data;
  },
  
  me: () => axiosClient.get("/auth/me"),

  logout: () => axiosClient.post("/auth/logout"),
};
