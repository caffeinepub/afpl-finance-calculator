export interface CalculationParameters {
  interestRate: number;
  processingFeeRate: number;
  gstRate: number;
  insurancePer1000: number;
  numberOfPersons: number;
}

export interface RepaymentRow {
  month: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
}

export interface CalculationResult {
  totalMonths: number;
  insurance: number;
  processingFee: number;
  gst: number;
  totalDeductions: number;
  netDisbursement: number;
  emi: number;
  totalRepayment: number;
  totalInterest: number;
  roi: number;
  nomineeCount: number;
  repaymentSchedule: RepaymentRow[];
}

export function calculateLoan(
  amount: number,
  tenureYears: number,
  parameters: CalculationParameters,
  roi?: number,
  nomineeCount?: number,
): CalculationResult {
  const effectiveRoi = roi !== undefined ? roi : parameters.interestRate;
  const effectiveNomineeCount =
    nomineeCount !== undefined ? nomineeCount : parameters.numberOfPersons;
  const totalMonths = Math.round(tenureYears * 12);

  // Insurance: (loan/1000) x insurancePer1000 x nomineeCount x tenureYears (NO GST on insurance)
  const insurance =
    (amount / 1000) *
    parameters.insurancePer1000 *
    effectiveNomineeCount *
    tenureYears;

  // Processing fee
  const processingFee = amount * (parameters.processingFeeRate / 100);

  // GST on processing fee only
  const gst = processingFee * (parameters.gstRate / 100);

  const totalDeductions = insurance + processingFee + gst;
  const netDisbursement = amount - totalDeductions;

  // EMI using reducing balance formula on full loan amount
  const monthlyRate = effectiveRoi / 100 / 12;
  let emi: number;
  if (monthlyRate > 0) {
    const factor = (1 + monthlyRate) ** totalMonths;
    emi = (amount * (monthlyRate * factor)) / (factor - 1);
  } else {
    emi = amount / totalMonths;
  }

  const totalRepayment = emi * totalMonths;
  const totalInterest = totalRepayment - amount;

  // Generate repayment schedule
  const repaymentSchedule: RepaymentRow[] = [];
  let balance = amount;
  for (let m = 1; m <= totalMonths; m++) {
    const openingBalance = balance;
    const interest = openingBalance * monthlyRate;
    const principal = emi - interest;
    const closingBalance = Math.max(0, openingBalance - principal);
    repaymentSchedule.push({
      month: m,
      openingBalance,
      emi,
      principal,
      interest,
      closingBalance,
    });
    balance = closingBalance;
  }

  return {
    totalMonths,
    insurance,
    processingFee,
    gst,
    totalDeductions,
    netDisbursement,
    emi,
    totalRepayment,
    totalInterest,
    roi: effectiveRoi,
    nomineeCount: effectiveNomineeCount,
    repaymentSchedule,
  };
}
