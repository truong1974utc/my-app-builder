import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Package, 
  FileText, 
  FileType, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "User Management", url: "/users", icon: Users },
  { title: "Category Management", url: "/categories", icon: Layers },
  { title: "Product Management", url: "/products", icon: Package },
  { title: "Document Management", url: "/documents", icon: FileText },
  { title: "Content Pages", url: "/content-pages", icon: FileType },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          N
        </div>
        <span className="text-lg font-semibold text-foreground">Nexus Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
