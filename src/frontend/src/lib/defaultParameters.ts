import type { CalculationParameters } from "./calculator";

/**
 * Default calculation parameters as specified in requirements:
 * - Interest Rate (Annual): 24.49%
 * - Processing Fee: 1.5% of loan amount
 * - GST on Processing: 18%
 * - Insurance: Rs 7.50 per 1000, 2 persons (husband + wife)
 */
export const defaultParameters: CalculationParameters = {
  interestRate: 24.49,
  processingFeeRate: 1.5,
  gstRate: 18.0,
  insurancePer1000: 7.5,
  numberOfPersons: 2,
};
