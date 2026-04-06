import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyINR } from "@/lib/format/currencyINR";
import { useParametersStore } from "@/state/parametersStore";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { tenureOptions } from "./tenureOptions";

interface LpfResult {
  processingFee: number;
  gst: number;
  totalLpf: number;
}

function calculateLpf(
  loanAmount: number,
  processingFeeRate: number,
  gstRate: number,
): LpfResult {
  const processingFee = loanAmount * (processingFeeRate / 100);
  const gst = processingFee * (gstRate / 100);
  return { processingFee, gst, totalLpf: processingFee + gst };
}

export default function LpfCalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [tenureYears, setTenureYears] = useState<number>(1);
  const { parameters } = useParametersStore();

  // Manual override state — pre-filled from global params
  const [processingFeeRate, setProcessingFeeRate] = useState<string>(
    parameters.processingFeeRate.toString(),
  );
  const [gstRate, setGstRate] = useState<string>(parameters.gstRate.toString());

  const parsedProcessingFeeRate = Number.parseFloat(processingFeeRate) || 0;
  const parsedGstRate = Number.parseFloat(gstRate) || 0;

  const result =
    loanAmount && Number.parseFloat(loanAmount) > 0
      ? calculateLpf(
          Number.parseFloat(loanAmount),
          parsedProcessingFeeRate,
          parsedGstRate,
        )
      : null;

  const handleReset = () => {
    setLoanAmount("");
    setTenureYears(1);
    setProcessingFeeRate(parameters.processingFeeRate.toString());
    setGstRate(parameters.gstRate.toString());
    toast.success("LPF Calculator reset");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-xl border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
            LPF Calculator
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loan Processing Fee &amp; GST Calculator
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lpf-amount" className="text-base font-semibold">
                Loan Amount (&#8377;)
              </Label>
              <Input
                id="lpf-amount"
                data-ocid="lpf.input"
                type="number"
                placeholder="Enter loan amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                min="0"
                step="1000"
                className="text-lg h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lpf-tenure" className="text-base font-semibold">
                Tenure
              </Label>
              <Select
                value={tenureYears.toString()}
                onValueChange={(v) => setTenureYears(Number.parseFloat(v))}
              >
                <SelectTrigger
                  id="lpf-tenure"
                  data-ocid="lpf.select"
                  className="text-lg h-12"
                >
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  {tenureOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Manual rate inputs */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="lpf-processing-rate"
                className="text-base font-semibold"
              >
                Processing Fee (%)
              </Label>
              <Input
                id="lpf-processing-rate"
                data-ocid="lpf.processingRate.input"
                type="number"
                placeholder="e.g. 1.5"
                value={processingFeeRate}
                onChange={(e) => setProcessingFeeRate(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="text-lg h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lpf-gst-rate" className="text-base font-semibold">
                GST (%)
              </Label>
              <Input
                id="lpf-gst-rate"
                data-ocid="lpf.gstRate.input"
                type="number"
                placeholder="e.g. 18"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="text-lg h-12"
              />
            </div>
          </div>

          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
            data-ocid="lpf.reset.button"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card
          className="shadow-xl border-blue-100 dark:border-blue-900"
          data-ocid="lpf.card"
        >
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
              LPF Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400">
                Processing Fee ({parsedProcessingFeeRate}% of loan)
              </span>
              <span className="text-xl font-semibold">
                {formatCurrencyINR(result.processingFee)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400">
                GST on Processing ({parsedGstRate}%)
              </span>
              <span className="text-xl font-semibold">
                {formatCurrencyINR(result.gst)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-3 bg-blue-50 dark:bg-blue-950/30 px-3 rounded-lg">
              <span className="font-bold text-lg">Total LPF Deduction</span>
              <span className="font-bold text-2xl text-blue-900 dark:text-blue-200">
                {formatCurrencyINR(result.totalLpf)}
              </span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Tenure selected: {tenureYears} year(s) &#8212; LPF is a one-time
              charge deducted at disbursement.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
