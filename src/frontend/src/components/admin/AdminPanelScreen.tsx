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
import { useUpdateParameters } from "@/hooks/useQueries";
import { useParametersStore } from "@/state/parametersStore";
import { useState } from "react";
import { toast } from "sonner";
import AdminGuard from "./AdminGuard";

function AdminPanelContent() {
  const { parameters } = useParametersStore();
  const updateMutation = useUpdateParameters();

  const [interestRate, setInterestRate] = useState(
    parameters.interestRate.toString(),
  );
  const [processingFeeRate, setProcessingFeeRate] = useState(
    parameters.processingFeeRate.toString(),
  );
  const [gstRate, setGstRate] = useState(parameters.gstRate.toString());
  const [insurancePer1000, setInsurancePer1000] = useState(
    parameters.insurancePer1000.toString(),
  );
  const [numberOfPersons, setNumberOfPersons] = useState(
    parameters.numberOfPersons.toString(),
  );

  const handleSave = async () => {
    const newInterestRate = Number.parseFloat(interestRate);
    const newProcessingFeeRate = Number.parseFloat(processingFeeRate);
    const newGstRate = Number.parseFloat(gstRate);
    const newInsurancePer1000 = Number.parseFloat(insurancePer1000);
    const newNumberOfPersons = Number.parseInt(numberOfPersons);

    // Validation
    if (
      Number.isNaN(newInterestRate) ||
      newInterestRate < 0 ||
      newInterestRate > 100 ||
      Number.isNaN(newProcessingFeeRate) ||
      newProcessingFeeRate < 0 ||
      newProcessingFeeRate > 100 ||
      Number.isNaN(newGstRate) ||
      newGstRate < 0 ||
      newGstRate > 100 ||
      Number.isNaN(newInsurancePer1000) ||
      newInsurancePer1000 < 0 ||
      Number.isNaN(newNumberOfPersons) ||
      newNumberOfPersons < 1
    ) {
      toast.error("Please enter valid values");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        interestRate: newInterestRate,
        processingFeeRate: newProcessingFeeRate,
        gstRate: newGstRate,
        insurancePer1000: newInsurancePer1000,
        numberOfPersons: BigInt(newNumberOfPersons),
      });
      toast.success("Parameters updated successfully");
    } catch (error) {
      toast.error("Failed to update parameters");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
            Admin Settings
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Configure calculation parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interestRate" className="text-base font-semibold">
                Annual Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="processingFeeRate"
                className="text-base font-semibold"
              >
                Processing Fee Rate (%)
              </Label>
              <Input
                id="processingFeeRate"
                type="number"
                value={processingFeeRate}
                onChange={(e) => setProcessingFeeRate(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstRate" className="text-base font-semibold">
                GST Rate (%)
              </Label>
              <Input
                id="gstRate"
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="insurancePer1000"
                className="text-base font-semibold"
              >
                Insurance Rate (₹ per 1000)
              </Label>
              <Input
                id="insurancePer1000"
                type="number"
                value={insurancePer1000}
                onChange={(e) => setInsurancePer1000(e.target.value)}
                min="0"
                step="0.01"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="numberOfPersons"
                className="text-base font-semibold"
              >
                Number of Persons (Insurance Multiplier)
              </Label>
              <Input
                id="numberOfPersons"
                type="number"
                value={numberOfPersons}
                onChange={(e) => setNumberOfPersons(e.target.value)}
                min="1"
                step="1"
                className="text-lg"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Parameters"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPanelScreen() {
  return (
    <AdminGuard>
      <AdminPanelContent />
    </AdminGuard>
  );
}
