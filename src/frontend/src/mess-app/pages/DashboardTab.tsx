import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { useMessStore } from "../useMessStore";
import { formatDate, formatINR, getInitials } from "../utils";

type Store = ReturnType<typeof useMessStore>;

interface Props {
  store: Store;
  onAddMember: () => void;
  onAddExpense: () => void;
}

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

export function DashboardTab({ store, onAddMember, onAddExpense }: Props) {
  const {
    store: data,
    totalContributions,
    totalExpenses,
    closingBalance,
  } = store;
  const recentExpenses = [...data.expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const getMemberName = (id: string) =>
    data.members.find((m) => m.id === id)?.name ?? "Unknown";

  const balanceColor =
    closingBalance >= 0 ? "text-emerald-600" : "text-red-600";

  const balanceCardBg =
    closingBalance >= 0
      ? "bg-emerald-50 border-emerald-200"
      : "bg-red-50 border-red-200";

  return (
    <div className="animate-fade-in space-y-5 pb-4">
      {/* Header */}
      <div className="bg-primary rounded-2xl p-5 text-white">
        <p className="text-white/70 text-sm font-medium">Hostel Mess</p>
        <h1 className="text-2xl font-bold mt-0.5">Good {getGreeting()}!</h1>
        <p className="text-white/80 text-sm mt-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={<Users className="w-5 h-5" />}
          label="Members"
          value={String(data.members.length)}
          iconBg="bg-blue-100 text-blue-600"
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Collected"
          value={formatINR(totalContributions)}
          iconBg="bg-emerald-100 text-emerald-600"
        />
        <KpiCard
          icon={<ShoppingCart className="w-5 h-5" />}
          label="Total Expenses"
          value={formatINR(totalExpenses)}
          iconBg="bg-orange-100 text-orange-600"
        />
        <div
          className={`rounded-xl border p-4 shadow-card flex flex-col gap-2 ${balanceCardBg}`}
          data-ocid="dashboard.card"
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${closingBalance >= 0 ? "bg-emerald-200 text-emerald-700" : "bg-red-200 text-red-700"}`}
          >
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Balance</p>
            <p className={`text-lg font-bold ${balanceColor}`}>
              {formatINR(closingBalance)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl"
          onClick={onAddExpense}
          data-ocid="dashboard.add_expense.button"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Expense
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-primary text-primary hover:bg-secondary rounded-xl"
          onClick={onAddMember}
          data-ocid="dashboard.add_member.button"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Member
        </Button>
      </div>

      {/* Recent Expenses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base">Recent Expenses</h2>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            Last 5 <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {recentExpenses.length === 0 ? (
          <Card
            className="shadow-card border-dashed"
            data-ocid="dashboard.expenses.empty_state"
          >
            <CardContent className="py-8 text-center text-muted-foreground">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No expenses yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map((exp, i) => (
              <Card
                key={exp.id}
                className="shadow-card"
                data-ocid={`dashboard.expenses.item.${i + 1}`}
              >
                <CardContent className="px-4 py-3 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                  >
                    {getInitials(getMemberName(exp.paidById))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{exp.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {getMemberName(exp.paidById)} · {formatDate(exp.date)}
                    </p>
                  </div>
                  <span className="font-semibold text-sm text-orange-600 flex-shrink-0">
                    {formatINR(exp.amount)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
}) {
  return (
    <Card className="shadow-card" data-ocid="dashboard.card">
      <CardContent className="px-4 py-4 flex flex-col gap-2">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}
