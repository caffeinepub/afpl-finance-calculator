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
import { formatCurrencyINR } from "@/lib/format/currencyINR";
import { useParametersStore } from "@/state/parametersStore";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const insuranceTenureOptions = [
  { label: "1 year", value: 1 },
  { label: "2 years", value: 2 },
  { label: "2.5 years", value: 2.5 },
  { label: "3 years", value: 3 },
  { label: "3.5 years", value: 3.5 },
  { label: "4 years", value: 4 },
];

export default function InsuranceCalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [insuranceTenure, setInsuranceTenure] = useState<number>(1);
  const [nominee, setNominee] = useState<"yes" | "no">("yes");
  const { parameters } = useParametersStore();
  const [insuranceRate, setInsuranceRate] = useState<string>(
    parameters.insurancePer1000.toString(),
  );

  const nomineeCount = nominee === "yes" ? 2 : 1;
  const amount = Number.parseFloat(loanAmount);
  const rateValue = Number.parseFloat(insuranceRate) || 0;

  const insuranceAmount =
    amount > 0
      ? (amount / 1000) * rateValue * nomineeCount * insuranceTenure
      : null;

  const handleReset = () => {
    setLoanAmount("");
    setInsuranceTenure(1);
    setNominee("yes");
    setInsuranceRate(parameters.insurancePer1000.toString());
    toast.success("Insurance Calculator reset");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-xl border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
            Insurance Calculator
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loan Insurance Premium Calculator &#8212; GST Free
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ins-amount" className="text-base font-semibold">
                Loan Amount (&#8377;)
              </Label>
              <Input
                id="ins-amount"
                data-ocid="insurance.input"
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
              <Label htmlFor="ins-tenure" className="text-base font-semibold">
                Insurance Tenure
              </Label>
              <Select
                value={insuranceTenure.toString()}
                onValueChange={(v) => setInsuranceTenure(Number.parseFloat(v))}
              >
                <SelectTrigger
                  id="ins-tenure"
                  data-ocid="insurance.select"
                  className="text-lg h-12"
                >
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceTenureOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ins-rate" className="text-base font-semibold">
                Insurance Rate (per &#8377;1000)
              </Label>
              <Input
                id="ins-rate"
                data-ocid="insurance.rate.input"
                type="number"
                placeholder="Rate per ₹1000"
                value={insuranceRate}
                onChange={(e) => setInsuranceRate(e.target.value)}
                min="0"
                step="0.01"
                className="text-lg h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Nominee</Label>
            <ToggleGroup
              type="single"
              value={nominee}
              onValueChange={(v) => {
                if (v) setNominee(v as "yes" | "no");
              }}
              className="justify-start gap-3"
              data-ocid="insurance.toggle"
            >
              <ToggleGroupItem
                value="yes"
                className="h-11 px-6 text-base border border-blue-200 data-[state=on]:bg-blue-700 data-[state=on]:text-white"
              >
                Yes &#8212; 2 Persons
              </ToggleGroupItem>
              <ToggleGroupItem
                value="no"
                className="h-11 px-6 text-base border border-blue-200 data-[state=on]:bg-blue-700 data-[state=on]:text-white"
              >
                No &#8212; 1 Person
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-slate-500">
              Yes = Husband + Wife (double insurance amount), No = Single person
            </p>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
            Rate: &#8377;{rateValue} per &#8377;1000 of loan &times;{" "}
            {nomineeCount} person(s) &times; {insuranceTenure} year(s) &#8212;{" "}
            <strong>No GST applicable</strong>
          </div>

          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
            data-ocid="insurance.reset.button"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </CardContent>
      </Card>

      {insuranceAmount !== null && amount > 0 && (
        <Card
          className="shadow-xl border-blue-100 dark:border-blue-900"
          data-ocid="insurance.card"
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl text-white">
              <ShieldCheck className="h-10 w-10 flex-shrink-0 opacity-80" />
              <div>
                <p className="text-sm opacity-80 mb-1">
                  Total Insurance Premium
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrencyINR(insuranceAmount)}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  GST-Free &bull;{" "}
                  {nomineeCount === 2 ? "Husband + Wife" : "Single Person"}{" "}
                  &bull; {insuranceTenure} year(s)
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Loan Amount</span>
                <span className="font-medium">{formatCurrencyINR(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rate per &#8377;1000</span>
                <span className="font-medium">&#8377;{rateValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Number of Persons</span>
                <span className="font-medium">{nomineeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Insurance Tenure</span>
                <span className="font-medium">{insuranceTenure} year(s)</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Insurance Premium (No GST)</span>
                <span className="text-blue-900 dark:text-blue-300">
                  {formatCurrencyINR(insuranceAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
