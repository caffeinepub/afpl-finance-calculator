/**
 * Formats a number as Indian Rupee currency with proper thousand separators
 * @param amount - The amount to format
 * @returns Formatted string with ₹ symbol and Indian number formatting
 */
export function formatCurrencyINR(amount: number): string {
  // Round to 2 decimal places
  const rounded = Math.round(amount * 100) / 100;

  // Format with Indian locale (en-IN) for proper thousand separators
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);

  return `₹${formatted}`;
}
