import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CalculationResult } from "@/lib/calculator";
import { formatCurrencyINR } from "@/lib/format/currencyINR";

interface ResultsPanelProps {
  results: CalculationResult;
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <Card className="shadow-xl border-blue-100 dark:border-blue-900">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
            Calculation Results
          </CardTitle>
          <Badge
            variant="outline"
            className="text-blue-800 border-blue-300 bg-blue-50"
          >
            ROI: {results.roi}% p.a.
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-3">
            Deductions Breakdown
          </h3>
          <div className="space-y-2">
            <Row
              label={`Insurance Premium (${results.nomineeCount === 2 ? "2 persons" : "1 person"} \u2014 No GST)`}
              value={results.insurance}
            />
            <Separator />
            <Row label="Processing Fee" value={results.processingFee} />
            <Separator />
            <Row label="GST on Processing Fee (18%)" value={results.gst} />
            <Separator />
            <Row
              label="Total Deductions"
              value={results.totalDeductions}
              highlight="deduction"
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-3">
            Disbursement
          </h3>
          <Row
            label="Net Disbursement"
            value={results.netDisbursement}
            highlight="disbursement"
          />
        </div>

        <Separator />

        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-3">
            EMI &amp; Repayment
          </h3>
          <div className="space-y-2">
            <Row label="EMI (per month)" value={results.emi} highlight="emi" />
            <Separator />
            <Row label="Total Repayment" value={results.totalRepayment} />
            <Separator />
            <Row label="Total Interest" value={results.totalInterest} />
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
          <span>
            Tenure:{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              {results.totalMonths} months
            </strong>
          </span>
          <span>
            ROI:{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              {results.roi}% p.a.
            </strong>
          </span>
          <span>
            Nominee:{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              {results.nomineeCount === 2 ? "2 Persons" : "1 Person"}
            </strong>
          </span>
          <span className="text-xs text-amber-700 dark:text-amber-400">
            * Insurance is GST-free
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: "deduction" | "disbursement" | "emi";
}) {
  const colorMap = {
    deduction: "text-orange-700 dark:text-orange-400",
    disbursement: "text-blue-900 dark:text-blue-200",
    emi: "text-green-700 dark:text-green-400",
  };
  const valueClass = highlight
    ? `font-bold text-2xl ${colorMap[highlight]}`
    : "text-xl font-semibold text-slate-700 dark:text-slate-300";
  const labelClass = highlight
    ? "font-bold text-base"
    : "text-base text-slate-600 dark:text-slate-400";

  return (
    <div className="flex justify-between items-center py-2">
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{formatCurrencyINR(value)}</span>
    </div>
  );
}
