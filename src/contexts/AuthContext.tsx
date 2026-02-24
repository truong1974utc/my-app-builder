import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user.type";
import { authApi } from "@/services/auth.api";

interface AuthContextType {
  user: User | null;
  login: (data: any) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const login = (data: any) => {
    console.log("🟢 CONTEXT RECEIVED DATA:", data);
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      console.log("🟡 INIT REFRESH TOKEN:", refreshToken);

      // 🔥 QUAN TRỌNG: Không có refreshToken thì khỏi gọi me
      if (!refreshToken) {
        console.log("🔴 No refreshToken → skip init");
        setLoading(false);
        return;
      }

      try {
        console.log("🟡 INIT AUTH - CALLING /auth/me");

        const res = await authApi.me();

        console.log("🟢 INIT AUTH SUCCESS:", res);

        setUser(res.data);
      } catch (err) {
        console.log("🔴 INIT AUTH FAILED");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};
