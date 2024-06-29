// utils.js

/**
 * Formats a number as currency.
 * @param {number} number - The number to format.
 * @param {string} locale - Locale string to be used for formatting.
 * @param {string} currency - Currency code for the formatting.
 * @returns {string} - The formatted currency string.
 */
export const formatNumberAsCurrency = (number, locale = 'en-US', currency = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };
  

 export const calculateItemFields = (item) => {
    const unitPrice = Number(item.unitPrice) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate = Number(item.taxRate) || 0;

    const netAmount = (unitPrice * quantity) - discount;
    const taxAmount = netAmount * (taxRate / 100);
    const totalAmount = netAmount + taxAmount;

    return { netAmount, taxAmount, totalAmount };
};