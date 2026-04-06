import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import type { useMessStore } from "../useMessStore";
import { formatINR, getInitials } from "../utils";

type Store = ReturnType<typeof useMessStore>;

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

interface Props {
  store: Store;
}

export function BalanceTab({ store }: Props) {
  const {
    store: data,
    totalContributions,
    totalExpenses,
    closingBalance,
    memberExpenseMap,
    setOpeningBalance,
  } = store;

  const [editingOB, setEditingOB] = useState(false);
  const [obInput, setObInput] = useState(String(data.openingBalance));

  const saveOB = () => {
    setOpeningBalance(Math.max(0, Number(obInput) || 0));
    setEditingOB(false);
  };

  const isPositive = closingBalance >= 0;

  return (
    <div className="animate-fade-in space-y-4 pb-4">
      <div>
        <h2 className="text-lg font-bold">Balance Sheet</h2>
        <p className="text-xs text-muted-foreground">Monthly overview</p>
      </div>

      {/* Balance Summary */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-1">
          {/* Opening Balance */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">
              Opening Balance
            </span>
            <div className="flex items-center gap-2">
              {editingOB ? (
                <>
                  <Input
                    type="number"
                    value={obInput}
                    onChange={(e) => setObInput(e.target.value)}
                    className="w-28 h-7 text-right text-sm"
                    onKeyDown={(e) => e.key === "Enter" && saveOB()}
                    autoFocus
                    data-ocid="balance.opening_balance.input"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7"
                    onClick={saveOB}
                    data-ocid="balance.opening_balance.save_button"
                  >
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">
                    {formatINR(data.openingBalance)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-primary"
                    onClick={() => {
                      setObInput(String(data.openingBalance));
                      setEditingOB(true);
                    }}
                    data-ocid="balance.opening_balance.edit_button"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Contributions */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">
              + Total Contributions
            </span>
            <span className="text-sm font-medium text-emerald-600">
              +{formatINR(totalContributions)}
            </span>
          </div>

          {/* Expenses */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">
              − Total Expenses
            </span>
            <span className="text-sm font-medium text-orange-600">
              −{formatINR(totalExpenses)}
            </span>
          </div>

          {/* Closing Balance */}
          <div
            className={`flex items-center justify-between py-3 px-3 rounded-lg mt-2 ${
              isPositive
                ? "bg-emerald-50 border border-emerald-200"
                : "bg-red-50 border border-red-200"
            }`}
            data-ocid="balance.closing_balance.card"
          >
            <span
              className={`text-sm font-bold ${isPositive ? "text-emerald-700" : "text-red-700"}`}
            >
              = Closing Balance
            </span>
            <span
              className={`text-lg font-extrabold ${isPositive ? "text-emerald-700" : "text-red-700"}`}
            >
              {formatINR(closingBalance)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Per-Member Summary */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Member-wise Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {data.members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No members added yet.
            </p>
          ) : (
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium pb-1 border-b">
                <span className="col-span-1">Member</span>
                <span className="text-right">Paid In</span>
                <span className="text-right">Spent</span>
                <span className="text-right">Net</span>
              </div>
              {data.members.map((m, i) => {
                const spent = memberExpenseMap[m.id] ?? 0;
                const net = m.contribution - spent;
                return (
                  <div
                    key={m.id}
                    className="grid grid-cols-4 gap-2 items-center py-1.5"
                    data-ocid={`balance.member.item.${i + 1}`}
                  >
                    <div className="col-span-1 flex items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                      >
                        {getInitials(m.name)}
                      </div>
                      <span className="text-xs font-medium truncate">
                        {m.name.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-right text-xs text-emerald-600 font-medium">
                      {formatINR(m.contribution)}
                    </span>
                    <span className="text-right text-xs text-orange-600 font-medium">
                      {formatINR(spent)}
                    </span>
                    <span
                      className={`text-right text-xs font-bold ${net >= 0 ? "text-emerald-700" : "text-red-600"}`}
                    >
                      {net >= 0 ? "+" : ""}
                      {formatINR(net)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
