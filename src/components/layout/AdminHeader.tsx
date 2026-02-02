import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
          <span className="text-sm font-medium text-foreground">Super Admin</span>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              A
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Account Settings</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
