// Khmer Modern Utility & Currency Formatter

export const KHR_RATE = 4100; // 1 USD = 4,100 KHR

// Convert Arabic digits to Khmer digits (123 -> ១២៣)
export const toKhmerDigits = (num) => {
  if (num === null || num === undefined) return '';
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return String(num).replace(/[0-9]/g, (w) => khmerDigits[+w]);
};

// Format USD: $3.50
export const formatUSD = (usdAmount) => {
  const num = Number(usdAmount) || 0;
  const cents = Math.round((num + Number.EPSILON) * 100);
  return `$${(cents / 100).toFixed(2)}`;
};

// Format Khmer Riel: ១៤,៣៥០ ៛
export const formatKHR = (usdAmount, useKhmerDigits = true) => {
  const khr = Math.round((Number(usdAmount) || 0) * KHR_RATE);
  const formatted = khr.toLocaleString('en-US');
  return useKhmerDigits ? `${toKhmerDigits(formatted)} ៛` : `${formatted} ៛`;
};

// Dual format: $3.50 • ១៤,៣៥០ ៛
export const formatDualPrice = (usdAmount) => {
  return `${formatUSD(usdAmount)} • ${formatKHR(usdAmount)}`;
};

// Standard Sugar Level options in modern Cambodian specialty cafes
export const SUGAR_LEVELS = [
  { percent: '0%', value: 0, labelKm: 'ឥតស្ករ', labelEn: 'No Sugar', desc: 'សុខភាពល្អ រសជាតិកាហ្វេសុទ្ធ' },
  { percent: '25%', value: 25, labelKm: 'ផ្អែមតិចណាស់', labelEn: 'Quarter Sweet', desc: 'រសជាតិកាហ្វេដិត ផ្អែមស្រាល' },
  { percent: '50%', value: 50, labelKm: 'ផ្អែមតិច', labelEn: 'Half Sweet', desc: 'ផ្អែមល្មម ស័ក្តិសមសម្រាប់សុខភាព' },
  { percent: '70%', value: 70, labelKm: 'ផ្អែមល្មម', labelEn: 'Less Sweet', desc: 'តុល្យភាពកាហ្វេ និងទឹកដោះគោ' },
  { percent: '100%', value: 100, labelKm: 'ផ្អែមធម្មតា', labelEn: 'Standard Sweet', desc: 'រូបមន្តដើមប្រចាំហាង' },
  { percent: '120%', value: 120, labelKm: 'ផ្អែមខ្លាំង', labelEn: 'Extra Sweet', desc: 'សម្រាប់អ្នកចូលចិត្តផ្អែមដិត' },
];

// Ice level options
export const ICE_LEVELS = [
  { id: 'regular', percent: '100%', labelKm: 'ទឹកកកធម្មតា', labelEn: 'Regular Ice' },
  { id: 'less', percent: '50%', labelKm: 'ទឹកកកតិច', labelEn: 'Less Ice' },
  { id: 'none', percent: '0%', labelKm: 'ឥតទឹកកក', labelEn: 'No Ice' },
];

// Beverage types
export const DRINK_TYPES = [
  { id: 'iced', labelKm: 'ទឹកកក', labelEn: 'Iced', icon: '❄️' },
  { id: 'hot', labelKm: 'ក្តៅ', labelEn: 'Hot', icon: '☕' },
  { id: 'frappe', labelKm: 'ក្រឡុក', labelEn: 'Frappe', icon: '🥤', extraPrice: 0.5 },
];

