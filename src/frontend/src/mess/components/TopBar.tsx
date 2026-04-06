import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center gap-4 shadow-xs z-10">
      <button
        type="button"
        data-ocid="topbar.toggle"
        className="md:hidden text-muted-foreground hover:text-foreground"
        onClick={onMenuToggle}
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.22_0.09_253)] hidden md:block whitespace-nowrap">
        HOSTEL MESS CONTROL
      </h1>

      <div className="flex-1 max-w-xs relative hidden sm:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          data-ocid="topbar.search_input"
          placeholder="Search students..."
          className="pl-9 rounded-full bg-background border-border text-sm h-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          data-ocid="topbar.notifications.button"
          className="relative p-2 rounded-full hover:bg-background text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[oklch(0.62_0.17_142)] rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[oklch(0.22_0.09_253)] text-white text-xs font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-tight">
              Admin
            </p>
            <p className="text-[10px] text-muted-foreground">Warden</p>
          </div>
        </div>
      </div>
    </header>
  );
}
