import {
  BookOpen,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import type { AppRoute } from "../types";

const NAV_ITEMS: { route: AppRoute; label: string; icon: React.ReactNode }[] = [
  {
    route: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  { route: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
  {
    route: "attendance",
    label: "Attendance",
    icon: <CalendarCheck className="w-4 h-4" />,
  },
  { route: "menu", label: "Menu", icon: <BookOpen className="w-4 h-4" /> },
  { route: "billing", label: "Billing", icon: <Receipt className="w-4 h-4" /> },
  {
    route: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
  isOpen: boolean;
}

export function Sidebar({
  currentRoute,
  onNavigate,
  onLogout,
  isOpen,
}: SidebarProps) {
  return (
    <aside
      className={`
        fixed md:relative z-30 flex flex-col w-[240px] h-full sidebar-gradient
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15">
          <UtensilsCrossed className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">
            HOSTEL MESS
          </p>
          <p className="text-white/60 text-xs">Control System</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = currentRoute === item.route;
          return (
            <button
              type="button"
              key={item.route}
              data-ocid={`nav.${item.route}.link`}
              onClick={() => onNavigate(item.route)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left
                transition-all duration-150
                ${active ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"}
              `}
            >
              <span className={active ? "text-white" : "text-white/60"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          type="button"
          data-ocid="nav.logout.button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4 text-white/60" />
          Logout
        </button>
      </div>
    </aside>
  );
}
