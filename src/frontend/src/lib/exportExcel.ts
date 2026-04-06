import type { CalculationParameters, CalculationResult } from "./calculator";

function xmlEscape(s: string | number): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt(n: number): string {
  return n.toFixed(2);
}

export function exportExcel(
  loanAmount: number,
  tenureYears: number,
  results: CalculationResult,
  parameters: CalculationParameters,
): void {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN");

  const cell = (value: string | number, type: "String" | "Number" = "String") =>
    `<Cell><Data ss:Type="${type}">${xmlEscape(value)}</Data></Cell>`;

  const headerCell = (value: string) =>
    `<Cell ss:StyleID="header"><Data ss:Type="String">${xmlEscape(value)}</Data></Cell>`;

  const summaryRows = [
    ["EMI AND LPF CALCULATOR \u2014 Loan Summary", ""],
    ["Generated On", dateStr],
    ["", ""],
    ["LOAN DETAILS", ""],
    ["Loan Amount (\u20b9)", fmt(loanAmount)],
    ["Tenure", `${tenureYears} year(s) \u2014 ${results.totalMonths} months`],
    ["Rate of Interest (Annual)", `${results.roi}%`],
    [
      "Nominee",
      results.nomineeCount === 2 ? "2 Persons (Husband + Wife)" : "1 Person",
    ],
    ["", ""],
    ["DEDUCTIONS", ""],
    [
      `Insurance Premium (${results.nomineeCount} person \u2014 No GST)`,
      fmt(results.insurance),
    ],
    ["Processing Fee", fmt(results.processingFee)],
    ["GST on Processing Fee (18%)", fmt(results.gst)],
    ["Total Deductions", fmt(results.totalDeductions)],
    ["", ""],
    ["DISBURSEMENT & EMI", ""],
    ["Net Disbursement", fmt(results.netDisbursement)],
    ["EMI (per month)", fmt(results.emi)],
    ["Total Repayment", fmt(results.totalRepayment)],
    ["Total Interest", fmt(results.totalInterest)],
    ["", ""],
    ["PARAMETERS", ""],
    ["Processing Fee Rate", `${parameters.processingFeeRate}%`],
    ["GST Rate", `${parameters.gstRate}%`],
    ["Insurance per \u20b91000", `\u20b9${parameters.insurancePer1000}`],
  ];

  const summaryXml = summaryRows
    .map((row) => `<Row>${cell(row[0])}${cell(row[1])}</Row>`)
    .join("\n");

  const scheduleHeader = `<Row>
    ${headerCell("Month")}
    ${headerCell("Opening Balance (\u20b9)")}
    ${headerCell("EMI (\u20b9)")}
    ${headerCell("Principal (\u20b9)")}
    ${headerCell("Interest (\u20b9)")}
    ${headerCell("Closing Balance (\u20b9)")}
  </Row>`;

  const scheduleRows = results.repaymentSchedule
    .map(
      (r) =>
        `<Row>
      ${cell(r.month, "Number")}
      ${cell(fmt(r.openingBalance), "Number")}
      ${cell(fmt(r.emi), "Number")}
      ${cell(fmt(r.principal), "Number")}
      ${cell(fmt(r.interest), "Number")}
      ${cell(fmt(r.closingBalance), "Number")}
    </Row>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:x="urn:schemas-microsoft-com:office:excel">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#1e3a8a" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Loan Summary">
    <Table>${summaryXml}</Table>
  </Worksheet>
  <Worksheet ss:Name="Repayment Schedule">
    <Table>${scheduleHeader}${scheduleRows}</Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EMI_LPF_Report_${loanAmount}_${tenureYears}yr.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
