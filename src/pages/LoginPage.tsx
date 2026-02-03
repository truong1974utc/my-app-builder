import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - replace with actual auth later
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
          N
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Nexus Admin</h1>
        <p className="mt-1 text-muted-foreground">Sign in to manage your system</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={() => login(email, password)}
            type="submit" 
            className="w-full h-12 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 flex items-center justify-center gap-4 border-t border-border pt-6">
          <button 
            type="button"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </button>
          <span className="text-muted-foreground">|</span>
          <button 
            type="button"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Need help?
          </button>
        </div>
      </div>

      {/* Copyright */}
      <p className="mt-8 text-sm text-muted-foreground">
        © 2024 Nexus Systems Inc. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;
