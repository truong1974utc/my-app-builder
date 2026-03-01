import { ChevronDown, Menu, Route } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
interface AdminHeaderProps {
  onMenuClick?: () => void;
}
import { Link} from "react-router-dom";
import { RoutePaths } from "@/config/route";

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { logout, user } = useAuth();
  const roleLabel = user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin";
  const avatarLetter = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A";
  const email = user?.email || "";
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          N
        </div>
        <span className="text-lg font-semibold text-foreground">
          Nexus Admin
        </span>
      </div>
      <div className="flex-1" /> {/* Spacer */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
          <span className="text-sm font-medium text-foreground hidden sm:inline">
            {roleLabel}
          </span>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {avatarLetter}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Account
            </p>
            <p className="text-sm font-medium truncate">{email}</p>
          </div>
          <DropdownMenuItem asChild>
            <Link to={RoutePaths.SETTINGS}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Account Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={logout} className="text-destructive">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
