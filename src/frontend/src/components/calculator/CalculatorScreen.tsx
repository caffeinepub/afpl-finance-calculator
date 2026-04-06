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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { calculateLoan } from "@/lib/calculator";
import { exportExcel } from "@/lib/exportExcel";
import { exportPdf } from "@/lib/pdf/exportPdf";
import { generateShareSummary } from "@/lib/shareSummary";
import { shareViaWhatsApp } from "@/lib/whatsappShare";
import { useParametersStore } from "@/state/parametersStore";
import { FileDown, FileSpreadsheet, RotateCcw, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import RepaymentSchedule from "./RepaymentSchedule";
import ResultsPanel from "./ResultsPanel";
import { tenureOptions } from "./tenureOptions";

export default function CalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [tenureYears, setTenureYears] = useState<number>(1);
  const [nominee, setNominee] = useState<"yes" | "no">("yes");
  const { parameters } = useParametersStore();
  const [roi, setRoi] = useState<string>(parameters.interestRate.toString());

  const nomineeCount = nominee === "yes" ? 2 : 1;
  const roiValue = Number.parseFloat(roi) || parameters.interestRate;

  const results =
    loanAmount && Number.parseFloat(loanAmount) > 0
      ? calculateLoan(
          Number.parseFloat(loanAmount),
          tenureYears,
          parameters,
          roiValue,
          nomineeCount,
        )
      : null;

  const handleReset = () => {
    setLoanAmount("");
    setTenureYears(1);
    setNominee("yes");
    setRoi(parameters.interestRate.toString());
    toast.success("Calculator reset");
  };

  const handleShare = () => {
    if (!results) {
      toast.error("Please enter a loan amount first");
      return;
    }
    const summary = generateShareSummary(
      Number.parseFloat(loanAmount),
      tenureYears,
      results,
      parameters,
    );
    shareViaWhatsApp(summary);
  };

  const handleExportPdf = () => {
    if (!results) {
      toast.error("Please enter a loan amount first");
      return;
    }
    try {
      exportPdf(
        Number.parseFloat(loanAmount),
        tenureYears,
        results,
        parameters,
      );
      toast.success("PDF exported successfully");
    } catch (e) {
      toast.error("Failed to export PDF");
      console.error(e);
    }
  };

  const handleExportExcel = () => {
    if (!results) {
      toast.error("Please enter a loan amount first");
      return;
    }
    try {
      exportExcel(
        Number.parseFloat(loanAmount),
        tenureYears,
        results,
        parameters,
      );
      toast.success("Excel file exported successfully");
    } catch (e) {
      toast.error("Failed to export Excel");
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-xl border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
            Loan EMI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loanAmount" className="text-base font-semibold">
                Loan Amount (&#8377;)
              </Label>
              <Input
                id="loanAmount"
                data-ocid="emi.input"
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
              <Label htmlFor="tenure" className="text-base font-semibold">
                Tenure
              </Label>
              <Select
                value={tenureYears.toString()}
                onValueChange={(v) => setTenureYears(Number.parseFloat(v))}
              >
                <SelectTrigger
                  id="tenure"
                  data-ocid="emi.select"
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

            <div className="space-y-2">
              <Label htmlFor="roi" className="text-base font-semibold">
                Rate of Interest (Annual %)
              </Label>
              <Input
                id="roi"
                data-ocid="emi.roi.input"
                type="number"
                placeholder="e.g. 24.49"
                value={roi}
                onChange={(e) => setRoi(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="text-lg h-12"
              />
              <p className="text-xs text-slate-500">
                Default: {parameters.interestRate}% (editable)
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Nominee (Insurance Persons)
              </Label>
              <ToggleGroup
                type="single"
                value={nominee}
                onValueChange={(v) => {
                  if (v) setNominee(v as "yes" | "no");
                }}
                className="justify-start gap-3 mt-1"
                data-ocid="emi.toggle"
              >
                <ToggleGroupItem
                  value="yes"
                  className="h-12 px-6 text-base font-medium border border-blue-200 data-[state=on]:bg-blue-700 data-[state=on]:text-white"
                >
                  Yes (2 Persons)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="no"
                  className="h-12 px-6 text-base font-medium border border-blue-200 data-[state=on]:bg-blue-700 data-[state=on]:text-white"
                >
                  No (1 Person)
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-xs text-slate-500">
                Yes = Husband + Wife (double insurance), No = Single person
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 min-w-[130px]"
              data-ocid="emi.reset.button"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 min-w-[130px]"
              disabled={!results}
              data-ocid="emi.share.button"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share WhatsApp
            </Button>
            <Button
              onClick={handleExportPdf}
              variant="outline"
              className="flex-1 min-w-[130px]"
              disabled={!results}
              data-ocid="emi.pdf.button"
            >
              <FileDown className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              className="flex-1 min-w-[130px]"
              disabled={!results}
              data-ocid="emi.excel.button"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <ResultsPanel results={results} />
          <RepaymentSchedule
            results={results}
            loanAmount={Number.parseFloat(loanAmount)}
            tenureYears={tenureYears}
            parameters={parameters}
          />
        </>
      )}
    </div>
  );
}
