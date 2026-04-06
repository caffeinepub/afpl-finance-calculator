import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Attendance } from "./pages/Attendance";
import { Billing } from "./pages/Billing";
import { Dashboard } from "./pages/Dashboard";
import { Menu } from "./pages/Menu";
import { SettingsPage } from "./pages/SettingsPage";
import { Students } from "./pages/Students";
import {
  SAMPLE_ATTENDANCE,
  SAMPLE_BILLING,
  SAMPLE_STUDENTS,
  SAMPLE_WEEKLY_MENU,
} from "./sampleData";
import type {
  AppRoute,
  AttendanceRecord,
  BillingRecord,
  Settings,
  Student,
  WeeklyMenu,
} from "./types";

interface MessAppProps {
  onLogout: () => void;
}

export function MessApp({ onLogout }: MessAppProps) {
  const [route, setRoute] = useState<AppRoute>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>(SAMPLE_STUDENTS);
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>(SAMPLE_ATTENDANCE);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>(SAMPLE_WEEKLY_MENU);
  const [billing, setBilling] = useState<BillingRecord[]>(SAMPLE_BILLING);
  const [settings, setSettings] = useState<Settings>({
    hostelName: "Rajiv Gandhi Boys Hostel",
    wardenName: "Dr. S. K. Mishra",
    mealRates: { breakfast: 40, lunch: 60, dinner: 50 },
  });

  const renderPage = () => {
    switch (route) {
      case "dashboard":
        return (
          <Dashboard
            students={students}
            attendance={attendance}
            billing={billing}
            weeklyMenu={weeklyMenu}
          />
        );
      case "students":
        return <Students students={students} setStudents={setStudents} />;
      case "attendance":
        return (
          <Attendance
            students={students}
            attendance={attendance}
            setAttendance={setAttendance}
          />
        );
      case "menu":
        return <Menu weeklyMenu={weeklyMenu} setWeeklyMenu={setWeeklyMenu} />;
      case "billing":
        return (
          <Billing
            students={students}
            billing={billing}
            setBilling={setBilling}
          />
        );
      case "settings":
        return <SettingsPage settings={settings} setSettings={setSettings} />;
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-poppins">
      {sidebarOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar
        currentRoute={route}
        onNavigate={(r) => {
          setRoute(r);
          setSidebarOpen(false);
        }}
        onLogout={onLogout}
        isOpen={sidebarOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">{renderPage()}</main>
        <footer className="px-6 py-3 bg-card border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {settings.hostelName} &mdash; Warden: {settings.wardenName}
          </span>
          <span>
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
