import { Toaster } from "@/components/ui/sonner";
import { LayoutDashboard, ShoppingCart, Users, Wallet } from "lucide-react";
import { useState } from "react";
import { BalanceTab } from "./mess-app/pages/BalanceTab";
import { DashboardTab } from "./mess-app/pages/DashboardTab";
import { ExpensesTab } from "./mess-app/pages/ExpensesTab";
import { MembersTab } from "./mess-app/pages/MembersTab";
import { useMessStore } from "./mess-app/useMessStore";

type Tab = "dashboard" | "members" | "expenses" | "balance";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "expenses", label: "Expenses", icon: ShoppingCart },
  { id: "balance", label: "Balance", icon: Wallet },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  const store = useMessStore();

  const handleAddMember = () => {
    setTab("members");
    setAddMemberOpen(true);
  };

  const handleAddExpense = () => {
    setTab("expenses");
    setAddExpenseOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none">Hostel Mess</h1>
            <p className="text-[10px] text-muted-foreground">Control Panel</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Balance:{" "}
          <span
            className={
              store.closingBalance >= 0
                ? "text-emerald-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            ₹{store.closingBalance.toLocaleString("en-IN")}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        {tab === "dashboard" && (
          <DashboardTab
            store={store}
            onAddMember={handleAddMember}
            onAddExpense={handleAddExpense}
          />
        )}
        {tab === "members" && (
          <MembersTab
            store={store}
            addDialogOpen={addMemberOpen}
            onAddDialogOpenChange={setAddMemberOpen}
          />
        )}
        {tab === "expenses" && (
          <ExpensesTab
            store={store}
            addDialogOpen={addExpenseOpen}
            onAddDialogOpenChange={setAddExpenseOpen}
          />
        )}
        {tab === "balance" && <BalanceTab store={store} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-20 bg-white border-t border-border">
        <div className="flex relative">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                type="button"
                key={t.id}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setTab(t.id)}
                data-ocid={`nav.${t.id}.tab`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`}
                />
                <span
                  className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="text-center text-[10px] text-muted-foreground py-2 bg-white border-t border-border">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Built with ♥ using caffeine.ai
        </a>
      </div>

      <Toaster />
    </div>
  );
}
