import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, CheckCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AttendanceRecord, MealType, Student } from "../types";

interface AttendanceProps {
  students: Student[];
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

const MEALS: MealType[] = ["Breakfast", "Lunch", "Dinner"];

export function Attendance({
  students,
  attendance,
  setAttendance,
}: AttendanceProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const activeStudents = students.filter(
    (s) => s.status === "Active" && s.mealPlan !== "None",
  );

  const getRecord = (studentId: string): AttendanceRecord => {
    return (
      attendance.find(
        (a) => a.studentId === studentId && a.date === selectedDate,
      ) ?? {
        studentId,
        date: selectedDate,
        breakfast: false,
        lunch: false,
        dinner: false,
      }
    );
  };

  const toggleMeal = (studentId: string, meal: Lowercase<MealType>) => {
    setAttendance((prev) => {
      const existing = prev.find(
        (a) => a.studentId === studentId && a.date === selectedDate,
      );
      if (existing) {
        return prev.map((a) =>
          a.studentId === studentId && a.date === selectedDate
            ? { ...a, [meal]: !a[meal] }
            : a,
        );
      }
      return [
        ...prev,
        {
          studentId,
          date: selectedDate,
          breakfast: false,
          lunch: false,
          dinner: false,
          [meal]: true,
        },
      ];
    });
  };

  const bulkMark = (present: boolean) => {
    setAttendance((prev) => {
      const newRecords = activeStudents.map((s) => ({
        studentId: s.id,
        date: selectedDate,
        breakfast: present,
        lunch: present,
        dinner: present,
      }));
      const filtered = prev.filter((a) => a.date !== selectedDate);
      return [...filtered, ...newRecords];
    });
    toast.success(present ? "Marked all present" : "Marked all absent");
  };

  const dayRecords = attendance.filter((a) => a.date === selectedDate);
  const totalPossible = activeStudents.length * 3;
  const totalPresent = dayRecords.reduce(
    (acc, a) =>
      acc + (a.breakfast ? 1 : 0) + (a.lunch ? 1 : 0) + (a.dinner ? 1 : 0),
    0,
  );
  const attendancePct =
    totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Attendance</h2>
        <p className="text-muted-foreground text-sm">
          Mark meal attendance per student
        </p>
      </div>

      {/* Date & controls */}
      <Card className="border border-border shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <input
                data-ocid="attendance.date.input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-border rounded-lg px-3 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[oklch(0.62_0.17_142/0.15)] text-[oklch(0.35_0.12_142)] border-[oklch(0.62_0.17_142/0.3)] border">
                {attendancePct}% Attendance
              </Badge>
              <span className="text-xs text-muted-foreground">
                {totalPresent}/{totalPossible} meals
              </span>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button
                data-ocid="attendance.mark_all_present.button"
                size="sm"
                variant="outline"
                onClick={() => bulkMark(true)}
                className="gap-1.5"
              >
                <CheckCheck className="w-4 h-4 text-green-600" /> All Present
              </Button>
              <Button
                data-ocid="attendance.mark_all_absent.button"
                size="sm"
                variant="outline"
                onClick={() => bulkMark(false)}
                className="gap-1.5"
              >
                <XCircle className="w-4 h-4 text-red-500" /> All Absent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Meal Attendance — {selectedDate}
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
                  {MEALS.map((m) => (
                    <TableHead
                      key={m}
                      className="text-xs font-semibold text-center"
                    >
                      {m}
                    </TableHead>
                  ))}
                  <TableHead className="text-xs font-semibold text-center">
                    Meals
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-10"
                      data-ocid="attendance.empty_state"
                    >
                      No active students with meal plans
                    </TableCell>
                  </TableRow>
                ) : (
                  activeStudents.map((s, i) => {
                    const rec = getRecord(s.id);
                    const count =
                      (rec.breakfast ? 1 : 0) +
                      (rec.lunch ? 1 : 0) +
                      (rec.dinner ? 1 : 0);
                    return (
                      <TableRow
                        key={s.id}
                        data-ocid={`attendance.item.${i + 1}`}
                      >
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {s.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          Block {s.block} / {s.roomNumber}
                        </TableCell>
                        {(["breakfast", "lunch", "dinner"] as const).map(
                          (meal) => (
                            <TableCell key={meal} className="text-center">
                              <Checkbox
                                data-ocid={`attendance.${meal}.checkbox.${i + 1}`}
                                checked={rec[meal]}
                                onCheckedChange={() => toggleMeal(s.id, meal)}
                                className="mx-auto"
                              />
                            </TableCell>
                          ),
                        )}
                        <TableCell className="text-center">
                          <Badge
                            className={`text-xs ${
                              count === 3
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : count > 0
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            {count}/3
                          </Badge>
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
