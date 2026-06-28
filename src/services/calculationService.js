/**
 * Calculation service for quotation calculations.
 */

/**
 * Calculates area from length and width.
 * @param {number|string} length 
 * @param {number|string} width 
 * @returns {number} The calculated area (rounded to 2 decimal places)
 */
export const calculateArea = (length, width) => {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  return parseFloat((l * w).toFixed(2));
};

/**
 * Calculates cost from area and rate per sq.ft.
 * @param {number|string} area 
 * @param {number|string} rate 
 * @returns {number} The calculated cost (rounded to 2 decimal places)
 */
export const calculateCost = (area, rate) => {
  const a = parseFloat(area) || 0;
  const r = parseFloat(rate) || 0;
  return parseFloat((a * r).toFixed(2));
};

/**
 * Calculates the subtotal of all project rows.
 * @param {Array} projects - Array of project objects
 * @returns {number} The sum of all project costs
 */
export const calculateSubTotal = (projects) => {
  if (!Array.isArray(projects)) return 0;
  const sum = projects.reduce((acc, project) => {
    const length = parseFloat(project.length) || 0;
    const width = parseFloat(project.width) || 0;
    const rate = parseFloat(project.rate) || 0;
    const cost = length * width * rate;
    return acc + cost;
  }, 0);
  return parseFloat(sum.toFixed(2));
};

/**
 * Calculates grand total. Since there's no GST or other additions,
 * Grand Total is equal to Sub Total.
 * @param {number} subTotal 
 * @returns {number} The grand total
 */
export const calculateGrandTotal = (subTotal) => {
  return parseFloat((parseFloat(subTotal) || 0).toFixed(2));
};

/**
 * Calculates the balance amount.
 * @param {number|string} grandTotal 
 * @param {number|string} advanceAmount 
 * @returns {number} The balance amount (rounded to 2 decimal places)
 */
export const calculateBalance = (grandTotal, advanceAmount) => {
  const total = parseFloat(grandTotal) || 0;
  const advance = parseFloat(advanceAmount) || 0;
  return parseFloat((total - advance).toFixed(2));
};
