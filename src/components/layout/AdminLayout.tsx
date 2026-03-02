import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <AdminSidebar className="w-64 shrink-0 border-r" />}

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar
              className="border-r-0"
              onNavClick={() => setMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
