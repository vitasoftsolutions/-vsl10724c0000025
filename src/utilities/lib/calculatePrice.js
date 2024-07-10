export function calculateOriginalPrice(totalPrice, taxRate, taxMethod) {
  // Ensure inputs are valid numbers
  const sanitizedTotalPrice = Number(totalPrice) || 0;
  const sanitizedTaxRate = Number(taxRate) || 0;

  // Convert tax rate to decimal
  const taxRateDecimal = sanitizedTaxRate / 100;

  // Calculate original price
  let originalPrice = sanitizedTotalPrice / (1 + taxRateDecimal);

  // Ensure originalPrice is not negative
  originalPrice = Math.max(0, originalPrice);

  // Round to two decimal places and always show two decimal places
  if (taxMethod === "Inclusive") {
    return originalPrice.toFixed(2);
  }

  return (Math.round(originalPrice * 100) / 100).toFixed(2);
}
