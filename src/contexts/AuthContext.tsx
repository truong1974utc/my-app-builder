import { createContext, useContext, useEffect, useState } from "react";
import { TUser } from "@/types/user.type";
import { authApi } from "@/services/auth.api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: TUser | null;
  login: (data: any) => void;
  logout: () => void;
  setUser: (user: TUser | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const login = (data: any) => {
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

      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.me();
        setUser(res.data);
      } catch (err) {
        setUser(null);
        toast({
          title: "Error",
          description: "Failed to fetch user",
          variant: "destructive",
        });
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
