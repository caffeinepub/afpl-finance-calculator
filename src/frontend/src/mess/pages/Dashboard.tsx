import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, IndianRupee, Users, UtensilsCrossed } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  AttendanceRecord,
  BillingRecord,
  Student,
  WeeklyMenu,
} from "../types";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const BILLING_CHART_DATA = [
  { month: "Oct", Paid: 18200, Unpaid: 4500 },
  { month: "Nov", Paid: 20400, Unpaid: 3200 },
  { month: "Dec", Paid: 22000, Unpaid: 2800 },
  { month: "Jan", Paid: 19800, Unpaid: 5100 },
  { month: "Feb", Paid: 23500, Unpaid: 1900 },
  { month: "Mar", Paid: 20640, Unpaid: 3480 },
];

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
  billing: BillingRecord[];
  weeklyMenu: WeeklyMenu;
}

export function Dashboard({
  students,
  attendance,
  billing,
  weeklyMenu,
}: DashboardProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const mealsToday = todayAttendance.reduce(
    (acc, a) =>
      acc + (a.breakfast ? 1 : 0) + (a.lunch ? 1 : 0) + (a.dinner ? 1 : 0),
    0,
  );
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthBilling = billing.filter((b) => b.month === currentMonth);
  const monthRevenue = monthBilling
    .filter((b) => b.status === "Paid")
    .reduce((acc, b) => acc + b.totalAmount, 0);
  const activePlans = students.filter(
    (s) => s.mealPlan !== "None" && s.status === "Active",
  ).length;

  const kpis = [
    {
      label: "Total Students",
      value: students.length,
      icon: <Users className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Meals Today",
      value: mealsToday,
      icon: <UtensilsCrossed className="w-5 h-5" />,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Monthly Revenue",
      value: `₹${monthRevenue.toLocaleString("en-IN")}`,
      icon: <IndianRupee className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Active Meal Plans",
      value: activePlans,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const lastMealMap: Record<string, string> = {};
  for (const a of attendance) {
    const prev = lastMealMap[a.studentId];
    if (!prev || a.date > prev) lastMealMap[a.studentId] = a.date;
  }

  const todayDay =
    DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayMenu = weeklyMenu[todayDay];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome Back, Admin!
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Here's what's happening at the hostel today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-border shadow-kpi">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-bold mt-1 text-foreground">
                    {kpi.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${kpi.color}`}>{kpi.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Student Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">ID</TableHead>
                    <TableHead className="text-xs font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Block
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Room
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Last Meal
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Plan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.slice(0, 6).map((s, i) => (
                    <TableRow key={s.id} data-ocid={`students.item.${i + 1}`}>
                      <TableCell className="text-xs font-mono">
                        {s.id}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {s.name}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px]">
                          Block {s.block}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{s.roomNumber}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {lastMealMap[s.id] || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] ${
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Today's Menu</CardTitle>
            <p className="text-xs text-muted-foreground">{todayDay}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayMenu ? (
              ["breakfast", "lunch", "dinner"].map((meal) => (
                <div key={meal}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    {meal}
                  </p>
                  <div className="bg-[oklch(0.94_0.05_142/0.3)] border border-[oklch(0.62_0.17_142/0.2)] rounded-lg px-3 py-2">
                    <p className="text-xs text-foreground">
                      {todayMenu[meal as keyof typeof todayMenu]}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No menu set for today.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Monthly Billing Status</CardTitle>
          <p className="text-xs text-muted-foreground">
            Paid vs Unpaid (last 6 months)
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BILLING_CHART_DATA} barSize={20} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `₹${value.toLocaleString("en-IN")}`,
                  undefined,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Paid" fill="#0B2A5A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Unpaid" fill="#34A853" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
