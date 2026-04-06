import { Heart } from "lucide-react";
import type { ReactNode } from "react";

type Route = "emi" | "lpf" | "insurance" | "admin";

interface AppLayoutProps {
  children: ReactNode;
  currentRoute?: Route;
}

const navItems: { label: string; href: string; route: Route }[] = [
  { label: "EMI Calculator", href: "#/", route: "emi" },
  { label: "LPF Calculator", href: "#/lpf", route: "lpf" },
  { label: "Insurance", href: "#/insurance", route: "insurance" },
  { label: "Admin", href: "#/admin", route: "admin" },
];

export default function AppLayout({
  children,
  currentRoute = "emi",
}: AppLayoutProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    window.location.hostname || "emi-lpf-calculator",
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-center md:text-left">
            EMI AND LPF CALCULATOR
          </h1>
        </div>
        <nav className="container mx-auto px-4 pb-0 flex overflow-x-auto gap-1">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <a
                key={item.route}
                href={item.href}
                data-ocid={`nav.${item.route}.link`}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-blue-200 hover:text-white hover:border-blue-300"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p className="mb-1">
            &copy; {currentYear} EMI AND LPF CALCULATOR. Built with{" "}
            <Heart
              className="inline text-red-500 mx-0.5 fill-red-500"
              size={14}
            />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs">Made by Deepak Mathur</p>
        </div>
      </footer>
    </div>
  );
}
