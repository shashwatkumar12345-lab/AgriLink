export const getCurrencySymbol = (country: string): string => {
  const countryToCurrency: { [key: string]: string } = {
    'India': '₹',
    'Pakistan': '₨',
    'Bangladesh': '৳',
    'United States': '$',
    'Canada': '$',
    'Australia': '$',
    'Mexico': '$',
    'Brazil': 'R$',
    'Argentina': '$',
    'United Kingdom': '£',
    'Germany': '€',
    'France': '€',
    'Italy': '€',
    'Spain': '€',
    'Netherlands': '€',
    'Belgium': '€',
    'Austria': '€',
    'Ireland': '€',
    'Finland': '€',
    'Greece': '€',
    'Portugal': '€',
    'Nigeria': '₦',
    'South Africa': 'R',
    'Japan': '¥',
    'China': '¥',
    'Russia': '₽',
  };

  return countryToCurrency[country] || '$'; // Default to '$'
};
