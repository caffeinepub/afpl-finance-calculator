import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { WeeklyMenu } from "../types";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEALS = ["breakfast", "lunch", "dinner"] as const;

interface MenuProps {
  weeklyMenu: WeeklyMenu;
  setWeeklyMenu: React.Dispatch<React.SetStateAction<WeeklyMenu>>;
}

export function Menu({ weeklyMenu, setWeeklyMenu }: MenuProps) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [draft, setDraft] = useState<WeeklyMenu>(() =>
    JSON.parse(JSON.stringify(weeklyMenu)),
  );

  const handleChange = (
    day: string,
    meal: (typeof MEALS)[number],
    value: string,
  ) => {
    setDraft((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));
  };

  const handleSave = () => {
    setWeeklyMenu(draft);
    toast.success("Weekly menu saved!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weekly Menu</h2>
          <p className="text-muted-foreground text-sm">
            Edit meal plans for each day
          </p>
        </div>
        <Button
          data-ocid="menu.save_button"
          onClick={handleSave}
          className="bg-[oklch(0.22_0.09_253)] hover:bg-[oklch(0.27_0.09_253)] gap-2"
        >
          <Save className="w-4 h-4" /> Save Menu
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <button
            type="button"
            key={day}
            data-ocid={`menu.${day.toLowerCase()}.tab`}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedDay === day
                ? "bg-[oklch(0.22_0.09_253)] text-white shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-[oklch(0.22_0.09_253)]"
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <Card className="border border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{selectedDay}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {MEALS.map((meal) => (
            <div key={meal} className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {meal}
              </Label>
              <Textarea
                data-ocid={`menu.${meal}.textarea`}
                value={draft[selectedDay]?.[meal] ?? ""}
                onChange={(e) =>
                  handleChange(selectedDay, meal, e.target.value)
                }
                placeholder={`Enter ${meal} items...`}
                className="text-sm resize-none"
                rows={2}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map((day) => (
          <Card
            key={day}
            className="border border-border shadow-card cursor-pointer hover:border-[oklch(0.22_0.09_253)] transition-colors"
            onClick={() => setSelectedDay(day)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {MEALS.map((meal) => (
                <div key={meal}>
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                    {meal}
                  </p>
                  <p className="text-[11px] text-foreground line-clamp-1">
                    {draft[day]?.[meal] || (
                      <span className="italic text-muted-foreground">
                        Not set
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
