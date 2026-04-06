import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, IndianRupee } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BillingRecord, BillingStatus, Student } from "../types";

interface BillingProps {
  students: Student[];
  billing: BillingRecord[];
  setBilling: React.Dispatch<React.SetStateAction<BillingRecord[]>>;
}

export function Billing({ students, billing, setBilling }: BillingProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const months = Array.from(new Set(billing.map((b) => b.month)))
    .sort()
    .reverse();
  if (!months.includes(currentMonth)) months.unshift(currentMonth);

  const monthBilling = billing.filter((b) => b.month === selectedMonth);
  const studentBillingMap = Object.fromEntries(
    monthBilling.map((b) => [b.studentId, b]),
  );

  const toggleStatus = (studentId: string) => {
    setBilling((prev) => {
      const existing = prev.find(
        (b) => b.studentId === studentId && b.month === selectedMonth,
      );
      if (existing) {
        return prev.map((b) =>
          b.studentId === studentId && b.month === selectedMonth
            ? { ...b, status: b.status === "Paid" ? "Unpaid" : "Paid" }
            : b,
        );
      }
      return prev;
    });
    toast.success("Billing status updated");
  };

  const totalRevenue = monthBilling
    .filter((b) => b.status === "Paid")
    .reduce((acc, b) => acc + b.totalAmount, 0);
  const pendingAmount = monthBilling
    .filter((b) => b.status === "Unpaid")
    .reduce((acc, b) => acc + b.totalAmount, 0);
  const paidCount = monthBilling.filter((b) => b.status === "Paid").length;
  const unpaidCount = monthBilling.filter((b) => b.status === "Unpaid").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Billing</h2>
          <p className="text-muted-foreground text-sm">
            Monthly mess billing per student
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger data-ocid="billing.month.select" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border shadow-kpi">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Collected</p>
            <p className="text-xl font-bold mt-1 text-[oklch(0.22_0.09_253)]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-kpi">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending Amount</p>
            <p className="text-xl font-bold mt-1 text-red-600">
              ₹{pendingAmount.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-kpi">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Paid Students</p>
            <p className="text-xl font-bold mt-1 text-green-600">{paidCount}</p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-kpi">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Unpaid Students</p>
            <p className="text-xl font-bold mt-1 text-orange-500">
              {unpaidCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Bill Details — {selectedMonth}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold">
                    Student
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Block/Room
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Meal Plan
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-right">
                    Meals
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                      data-ocid="billing.empty_state"
                    >
                      No billing data
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s, i) => {
                    const record = studentBillingMap[s.id];
                    return (
                      <TableRow key={s.id} data-ocid={`billing.item.${i + 1}`}>
                        <TableCell>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.id}
                          </p>
                        </TableCell>
                        <TableCell className="text-xs">
                          Block {s.block} / {s.roomNumber}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${
                              s.mealPlan === "Full"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : s.mealPlan === "Partial"
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                  : "bg-muted text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {s.mealPlan}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {record?.mealsAttended ?? "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end gap-1 text-sm font-semibold">
                            <IndianRupee className="w-3 h-3" />
                            {record
                              ? record.totalAmount.toLocaleString("en-IN")
                              : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {record ? (
                            <Badge
                              className={`text-xs ${
                                record.status === "Paid"
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : "bg-red-100 text-red-700 hover:bg-red-100"
                              }`}
                            >
                              {record.status === "Paid" ? (
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                              ) : (
                                <AlertCircle className="w-3 h-3 inline mr-1" />
                              )}
                              {record.status}
                            </Badge>
                          ) : (
                            <Badge className="text-xs bg-muted text-muted-foreground hover:bg-muted">
                              No Data
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {record && (
                            <Button
                              data-ocid={`billing.toggle_status.button.${i + 1}`}
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => toggleStatus(s.id)}
                            >
                              Mark{" "}
                              {record.status === "Paid" ? "Unpaid" : "Paid"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
