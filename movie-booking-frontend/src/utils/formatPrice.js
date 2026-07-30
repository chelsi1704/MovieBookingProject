/**
 * Price formatting utilities for the movie booking application
 * All prices are in Indian Rupees (₹)
 */

/**
 * Format price with Indian Rupee symbol
 * @param {number} price - Price to format
 * @param {boolean} showDecimals - Show decimal places (default: false)
 * @returns {string} Formatted price (e.g., "₹500" or "₹500.00")
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '₹0';
  }

  // Convert to number and format with commas
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return formattedPrice;
};

/**
 * Format price with decimal places
 * @param {number} price - Price to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted price with decimals
 */
export const formatPriceWithDecimals = (price, decimals = 2) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '₹0.00';
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);

  return formattedPrice;
};

/**
 * Format ticket price
 * @param {number} price - Ticket price
 * @returns {string} Formatted ticket price
 */
export const formatTicketPrice = (price) => {
  return formatPrice(price);
};

/**
 * Format total booking amount
 * @param {number} amount - Total amount
 * @returns {string} Formatted amount with emphasis
 */
export const formatBookingTotal = (amount) => {
  return formatPrice(amount);
};

/**
 * Format discount amount
 * @param {number} discount - Discount amount
 * @returns {string} Formatted discount with negative sign
 */
export const formatDiscount = (discount) => {
  if (typeof discount !== 'number' || isNaN(discount) || discount === 0) {
    return '₹0';
  }

  return `-${formatPrice(Math.abs(discount))}`;
};

/**
 * Format discount percentage
 * @param {number} percentage - Discount percentage
 * @returns {string} Formatted percentage
 */
export const formatDiscountPercentage = (percentage) => {
  if (typeof percentage !== 'number' || isNaN(percentage)) {
    return '0%';
  }

  return `${Math.round(percentage)}%`;
};

/**
 * Format offer discount
 * @param {number} discount - Discount value
 * @param {string} type - Type of discount ('percentage' or 'fixed')
 * @returns {string} Formatted offer
 */
export const formatOfferDiscount = (discount, type = 'percentage') => {
  if (type === 'percentage') {
    return `${Math.round(discount)}% OFF`;
  } else {
    return `₹${Math.round(discount)} OFF`;
  }
};

/**
 * Format convenience fee
 * @param {number} fee - Convenience fee amount
 * @returns {string} Formatted convenience fee
 */
export const formatConvenienceFee = (fee) => {
  return `+ ${formatPrice(fee)}`;
};

/**
 * Format tax amount
 * @param {number} tax - Tax amount
 * @returns {string} Formatted tax
 */
export const formatTax = (tax) => {
  return `+ ${formatPrice(tax)}`;
};

/**
 * Format refund amount
 * @param {number} refund - Refund amount
 * @returns {string} Formatted refund with positive sign
 */
export const formatRefund = (refund) => {
  if (typeof refund !== 'number' || isNaN(refund)) {
    return '₹0';
  }

  return `+ ${formatPrice(Math.abs(refund))}`;
};

/**
 * Format price range (min-max)
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {string} Formatted price range (e.g., "₹200 - ₹500")
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

/**
 * Format seat price
 * @param {number} price - Seat price
 * @returns {string} Formatted seat price
 */
export const formatSeatPrice = (price) => {
  return formatPrice(price);
};

/**
 * Calculate and format discounted price
 * @param {number} originalPrice - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {object} Object with original, discount, and final prices
 */
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  return {
    original: formatPrice(originalPrice),
    discount: formatDiscount(discountAmount),
    final: formatPrice(finalPrice),
    savedAmount: formatPrice(discountAmount),
  };
};

/**
 * Format price with savings badge
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {string} Formatted string with savings
 */
export const formatPriceWithSavings = (originalPrice, discountedPrice) => {
  const savings = originalPrice - discountedPrice;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  return `${formatPrice(discountedPrice)} (Save ${formatPrice(savings)}, ${savingsPercent}%)`;
};

/**
 * Format movie rating value
 * @param {number} rating - Rating value (0-10 or 0-5)
 * @returns {string} Formatted rating
 */
export const formatRating = (rating) => {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return '0';
  }

  return rating.toFixed(1);
};

/**
 * Format collection amount (for admin)
 * @param {number} amount - Collection amount
 * @returns {string} Formatted collection
 */
export const formatCollection = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} K`;
  }

  return formatPrice(amount);
};

/**
 * Get price label based on amount
 * @param {number} price - Price value
 * @returns {string} Price label
 */
export const getPriceLabel = (price) => {
  if (price <= 0) return 'FREE';
  if (price <= 150) return 'BUDGET';
  if (price <= 250) return 'ECONOMY';
  if (price <= 400) return 'STANDARD';
  if (price <= 500) return 'PREMIUM';
  return 'LUXURY';
};

/**
 * Format revenue for display
 * @param {number} revenue - Revenue amount
 * @returns {string} Formatted revenue
 */
export const formatRevenue = (revenue) => {
  return formatCollection(revenue);
};

/**
 * Format currency amount (generic)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'INR')
 * @returns {string} Formatted amount
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  if (currency === 'INR') {
    return formatPrice(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default {
  formatPrice,
  formatPriceWithDecimals,
  formatTicketPrice,
  formatBookingTotal,
  formatDiscount,
  formatDiscountPercentage,
  formatOfferDiscount,
  formatConvenienceFee,
  formatTax,
  formatRefund,
  formatPriceRange,
  formatSeatPrice,
  calculateDiscountedPrice,
  formatPriceWithSavings,
  formatRating,
  formatCollection,
  getPriceLabel,
  formatRevenue,
  formatCurrency,
};
