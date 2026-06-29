// Shared money/format helpers — replace inline regexes previously duplicated
// in Cart.jsx, CartModal.jsx, ProductPage.jsx, Shop.jsx.

/**
 * Convert any price value (number, numeric string, "₦316,300") to a Number.
 * Strips currency symbols, commas, spaces and anything non-numeric.
 */
export const parsePrice = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (value == null) return 0;
  return Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;
};

/**
 * Format a numeric value as Naira: "₦316,300".
 * Pass a raw number; rounding happens here.
 */
export const formatNaira = (value) => {
  const n = parsePrice(value);
  return `₦${n.toLocaleString()}`;
};

/**
 * Format a numeric value as a bare localised number with thousands separators:
 * "316,300" (no currency symbol). Used for cart subtotals that already have ₦.
 */
export const formatNumber = (value) => parsePrice(value).toLocaleString();

/**
 * Format an already-stringed price (e.g. "316300") as "₦316,300" without
 * touching the original. Used by products that come from the API as raw strings.
 */
export const formatPriceString = (value) =>
  `₦${parsePrice(value).toLocaleString()}`;