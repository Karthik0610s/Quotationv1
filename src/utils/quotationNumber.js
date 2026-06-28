/**
 * Utility for generating sequential quotation numbers.
 */

/**
 * Generates a quotation number based on a counter and the current year.
 * Format: WP-YYYY-XXXX (e.g. WP-2026-1001)
 * @param {number} counter - The sequential counter
 * @returns {string} The generated quotation number
 */
export const generateQuotationNumber = (counter = 1001) => {
  const year = new Date().getFullYear();
  return `WP-${year}-${String(counter).padStart(4, '0')}`;
};

/**
 * Gets the next counter value.
 * @param {number} currentCounter - The current counter value
 * @returns {number} The next counter value
 */
export const getNextCounter = (currentCounter) => {
  const num = parseInt(currentCounter, 10);
  return isNaN(num) ? 1002 : num + 1;
};
