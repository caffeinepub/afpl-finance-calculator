import type { CalculationParameters, CalculationResult } from "../calculator";
import { formatCurrencyINR } from "../format/currencyINR";

export function exportPdf(
  loanAmount: number,
  tenureYears: number,
  results: CalculationResult,
  parameters: CalculationParameters,
): void {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN");
  const timeStr = now.toLocaleTimeString("en-IN");

  const scheduleRows = results.repaymentSchedule
    .map(
      (r) =>
        `<tr style="background:${r.month % 2 === 0 ? "#f0f4ff" : "#ffffff"}">
          <td style="text-align:center">${r.month}</td>
          <td style="text-align:right">${formatCurrencyINR(r.openingBalance)}</td>
          <td style="text-align:right;font-weight:600;color:#1e3a8a">${formatCurrencyINR(r.emi)}</td>
          <td style="text-align:right;color:#15803d">${formatCurrencyINR(r.principal)}</td>
          <td style="text-align:right;color:#c2410c">${formatCurrencyINR(r.interest)}</td>
          <td style="text-align:right">${formatCurrencyINR(r.closingBalance)}</td>
        </tr>`,
    )
    .join("\n");

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EMI AND LPF CALCULATOR \u2014 Loan Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; padding: 20px; color: #333; }
    .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #1e3a8a; margin: 0 0 8px 0; font-size: 1.6em; }
    .header p { color: #666; margin: 4px 0; }
    .section { margin-bottom: 28px; }
    .section h2 { color: #1e3a8a; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px; font-size: 1.1em; }
    .row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f3f4f6; }
    .row.highlight { background: #eff6ff; padding: 12px 10px; font-weight: bold; font-size: 1.05em; }
    .label { color: #4b5563; }
    .value { font-weight: 600; color: #1e3a8a; }
    .note { font-size: 0.8em; color: #92400e; }
    table { width: 100%; border-collapse: collapse; font-size: 0.82em; }
    th { background: #1e3a8a; color: white; padding: 8px 6px; text-align: right; }
    th:first-child { text-align: center; }
    td { padding: 7px 6px; border-bottom: 1px solid #e5e7eb; }
    .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 0.85em; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>EMI AND LPF CALCULATOR</h1>
    <p>Loan Calculation Report</p>
    <p>Generated on ${dateStr} at ${timeStr}</p>
  </div>

  <div class="section">
    <h2>Loan Details</h2>
    <div class="row"><span class="label">Loan Amount</span><span class="value">${formatCurrencyINR(loanAmount)}</span></div>
    <div class="row"><span class="label">Tenure</span><span class="value">${tenureYears} year(s) \u2014 ${results.totalMonths} months</span></div>
    <div class="row"><span class="label">Rate of Interest (Annual)</span><span class="value">${results.roi}%</span></div>
    <div class="row"><span class="label">Nominee</span><span class="value">${results.nomineeCount === 2 ? "2 Persons (Husband + Wife)" : "1 Person"}</span></div>
  </div>

  <div class="section">
    <h2>Deductions</h2>
    <div class="row"><span class="label">Insurance Premium (${results.nomineeCount} person \u2014 <span class="note">No GST</span>)</span><span class="value">${formatCurrencyINR(results.insurance)}</span></div>
    <div class="row"><span class="label">Processing Fee</span><span class="value">${formatCurrencyINR(results.processingFee)}</span></div>
    <div class="row"><span class="label">GST on Processing Fee (${parameters.gstRate}%)</span><span class="value">${formatCurrencyINR(results.gst)}</span></div>
    <div class="row highlight"><span class="label">Total Deductions</span><span class="value">${formatCurrencyINR(results.totalDeductions)}</span></div>
  </div>

  <div class="section">
    <h2>Disbursement &amp; EMI</h2>
    <div class="row highlight"><span class="label">Net Disbursement</span><span class="value">${formatCurrencyINR(results.netDisbursement)}</span></div>
    <div class="row highlight"><span class="label">EMI (per month)</span><span class="value">${formatCurrencyINR(results.emi)}</span></div>
    <div class="row"><span class="label">Total Repayment</span><span class="value">${formatCurrencyINR(results.totalRepayment)}</span></div>
    <div class="row"><span class="label">Total Interest</span><span class="value">${formatCurrencyINR(results.totalInterest)}</span></div>
  </div>

  <div class="section">
    <h2>Repayment Schedule</h2>
    <table>
      <thead>
        <tr>
          <th style="text-align:center">Month</th>
          <th>Opening Balance</th>
          <th>EMI</th>
          <th>Principal</th>
          <th>Interest</th>
          <th>Closing Balance</th>
        </tr>
      </thead>
      <tbody>
        ${scheduleRows}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>This is a computer-generated report from EMI AND LPF CALCULATOR</p>
    <p>For informational purposes only \u2014 NBFC Non-Binding Estimate</p>
    <p style="margin-top:8px;font-size:0.85em">Made by Deepak Mathur</p>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
  }
}
