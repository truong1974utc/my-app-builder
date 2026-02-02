import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import DashboardOverview from "./pages/DashboardOverview";
import UserManagement from "./pages/UserManagement";
import CategoryManagement from "./pages/CategoryManagement";
import ProductManagement from "./pages/ProductManagement";
import DocumentManagement from "./pages/DocumentManagement";
import ContentPages from "./pages/ContentPages";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/documents" element={<DocumentManagement />} />
            <Route path="/content-pages" element={<ContentPages />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
