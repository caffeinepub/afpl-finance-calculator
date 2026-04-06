import type { CalculationParameters, CalculationResult } from "./calculator";
import { formatCurrencyINR } from "./format/currencyINR";

export function generateShareSummary(
  loanAmount: number,
  tenureYears: number,
  results: CalculationResult,
  parameters: CalculationParameters,
): string {
  const lines = [
    "\uD83D\uDCCA *EMI AND LPF CALCULATOR*",
    "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
    "",
    "\uD83D\uDCB0 *Loan Details*",
    `Loan Amount: ${formatCurrencyINR(loanAmount)}`,
    `Tenure: ${tenureYears} year${tenureYears !== 1 ? "s" : ""} (${results.totalMonths} months)`,
    `Interest Rate: ${results.roi}% p.a.`,
    "",
    "\uD83D\uDCCB *Deductions*",
    `Insurance Premium: ${formatCurrencyINR(results.insurance)}`,
    `Processing Fee: ${formatCurrencyINR(results.processingFee)}`,
    `GST on Processing: ${formatCurrencyINR(results.gst)}`,
    `Total Deductions: ${formatCurrencyINR(results.totalDeductions)}`,
    "",
    "\uD83D\uDCB5 *Disbursement & EMI*",
    `Net Disbursement: ${formatCurrencyINR(results.netDisbursement)}`,
    `EMI (per month): ${formatCurrencyINR(results.emi)}`,
    "",
    "\uD83D\uDCC8 *Repayment Summary*",
    `Total Repayment: ${formatCurrencyINR(results.totalRepayment)}`,
    `Total Interest: ${formatCurrencyINR(results.totalInterest)}`,
    "",
    "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
    "Calculated using EMI AND LPF CALCULATOR",
    "Made by Deepak Mathur",
  ];

  // suppress unused-param warning — parameters kept for API compatibility
  void parameters;

  return lines.join("\n");
}
