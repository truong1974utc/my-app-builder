import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardOverview from "./pages/DashboardOverview";
import UserManagement from "./pages/UserManagement";
import CategoryManagement from "./pages/CategoryManagement";
import ProductManagement from "./pages/ProductManagement";
import DocumentManagement from "./pages/DocumentManagement";
import ContentPages from "./pages/ContentPages";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { RoutePaths } from './config/route';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path={RoutePaths.LOGIN} element={<LoginPage />} />
          <Route element={<AdminLayout />}>
            <Route path={RoutePaths.DASHBOARD} element={<DashboardOverview />} />
            <Route path={RoutePaths.USERS} element={<UserManagement />} />
            <Route path={RoutePaths.CATEGORIES} element={<CategoryManagement />} />
            <Route path={RoutePaths.PRODUCTS} element={<ProductManagement />} />
            <Route path={RoutePaths.DOCUMENTS} element={<DocumentManagement />} />
            <Route path={RoutePaths.CONTENT_PAGES} element={<ContentPages />} />
            <Route path={RoutePaths.SETTINGS} element={<SettingsPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
