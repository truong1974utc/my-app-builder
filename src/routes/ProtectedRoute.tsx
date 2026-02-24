import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();
  console.log("🟣 PROTECTED USER:", user);
  console.log("🟣 LOADING:", loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("🔴 REDIRECTING");
    return <Navigate to="/login" replace />;
  }

  return children;
}
