import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  CalculationParameters,
  CalculationResult,
} from "@/lib/calculator";
import { exportExcel } from "@/lib/exportExcel";
import { formatCurrencyINR } from "@/lib/format/currencyINR";
import { exportPdf } from "@/lib/pdf/exportPdf";
import {
  ChevronDown,
  ChevronUp,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  results: CalculationResult;
  loanAmount: number;
  tenureYears: number;
  parameters: CalculationParameters;
}

export default function RepaymentSchedule({
  results,
  loanAmount,
  tenureYears,
  parameters,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const handleExportPdf = () => {
    try {
      exportPdf(loanAmount, tenureYears, results, parameters);
      toast.success("PDF exported successfully");
    } catch (e) {
      toast.error("Failed to export PDF");
      console.error(e);
    }
  };

  const handleExportExcel = () => {
    try {
      exportExcel(loanAmount, tenureYears, results, parameters);
      toast.success("Excel file exported successfully");
    } catch (e) {
      toast.error("Failed to export Excel");
      console.error(e);
    }
  };

  const schedule = results.repaymentSchedule;

  return (
    <Card
      className="shadow-xl border-blue-100 dark:border-blue-900"
      data-ocid="repayment.card"
    >
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
            Repayment Schedule
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportExcel}
              data-ocid="repayment.excel.button"
            >
              <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Export Excel
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportPdf}
              data-ocid="repayment.pdf.button"
            >
              <FileDown className="mr-1.5 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between mb-3 text-blue-800 dark:text-blue-300"
          onClick={() => setExpanded((p) => !p)}
          data-ocid="repayment.toggle"
        >
          <span className="font-medium">
            {expanded ? "Hide" : "Show"} Monthly Schedule ({schedule.length}{" "}
            months)
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expanded && (
          <ScrollArea className="h-[420px] rounded-md border border-blue-100 dark:border-blue-900">
            <Table data-ocid="repayment.table">
              <TableHeader>
                <TableRow className="bg-blue-900 hover:bg-blue-900">
                  <TableHead className="text-white text-center w-14">
                    Month
                  </TableHead>
                  <TableHead className="text-white text-right">
                    Opening Balance
                  </TableHead>
                  <TableHead className="text-white text-right">EMI</TableHead>
                  <TableHead className="text-white text-right">
                    Principal
                  </TableHead>
                  <TableHead className="text-white text-right">
                    Interest
                  </TableHead>
                  <TableHead className="text-white text-right">
                    Closing Balance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((row, idx) => (
                  <TableRow
                    key={row.month}
                    className={
                      idx % 2 === 0
                        ? "bg-white dark:bg-slate-950"
                        : "bg-blue-50 dark:bg-blue-950/20"
                    }
                    data-ocid={`repayment.item.${row.month}`}
                  >
                    <TableCell className="text-center font-medium">
                      {row.month}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrencyINR(row.openingBalance)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-blue-800 dark:text-blue-300">
                      {formatCurrencyINR(row.emi)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-green-700 dark:text-green-400">
                      {formatCurrencyINR(row.principal)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-orange-700 dark:text-orange-400">
                      {formatCurrencyINR(row.interest)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrencyINR(row.closingBalance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
