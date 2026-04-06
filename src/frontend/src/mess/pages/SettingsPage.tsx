import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save, Utensils } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Settings } from "../types";

interface SettingsPageProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function SettingsPage({ settings, setSettings }: SettingsPageProps) {
  const [draft, setDraft] = useState<Settings>(() =>
    JSON.parse(JSON.stringify(settings)),
  );

  const handleSave = () => {
    setSettings(draft);
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground text-sm">
          Configure hostel information and meal rates
        </p>
      </div>

      {/* Hostel Info */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[oklch(0.22_0.09_253)]" />
            <CardTitle className="text-base">Hostel Information</CardTitle>
          </div>
          <CardDescription>Basic hostel details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Hostel Name</Label>
            <Input
              data-ocid="settings.hostel_name.input"
              value={draft.hostelName}
              onChange={(e) =>
                setDraft((d) => ({ ...d, hostelName: e.target.value }))
              }
              placeholder="Enter hostel name"
            />
          </div>
          <div className="space-y-2">
            <Label>Warden Name</Label>
            <Input
              data-ocid="settings.warden_name.input"
              value={draft.wardenName}
              onChange={(e) =>
                setDraft((d) => ({ ...d, wardenName: e.target.value }))
              }
              placeholder="Enter warden name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Meal Rates */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[oklch(0.62_0.17_142)]" />
            <CardTitle className="text-base">Meal Rates</CardTitle>
          </div>
          <CardDescription>Set price per meal (in ₹)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
            <div key={meal} className="flex items-center gap-4">
              <Label className="w-24 capitalize">{meal}</Label>
              <div className="relative flex-1 max-w-xs">
                <span className="absolute left-3 top-2 text-sm text-muted-foreground">
                  ₹
                </span>
                <Input
                  data-ocid={`settings.${meal}_rate.input`}
                  type="number"
                  min={0}
                  value={draft.mealRates[meal]}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      mealRates: {
                        ...d.mealRates,
                        [meal]: Number(e.target.value),
                      },
                    }))
                  }
                  className="pl-7"
                  placeholder="0"
                />
              </div>
              <span className="text-xs text-muted-foreground">per meal</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        data-ocid="settings.save_button"
        onClick={handleSave}
        className="bg-[oklch(0.22_0.09_253)] hover:bg-[oklch(0.27_0.09_253)] gap-2"
      >
        <Save className="w-4 h-4" /> Save Settings
      </Button>
    </div>
  );
}
