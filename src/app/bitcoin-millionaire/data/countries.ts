export interface CountryEntry {
  name: string;
  code: string;
  symbol: string;
  flag: string;
  usdRate: number;
  lat: number;
  lng: number;
}

export const COUNTRIES: CountryEntry[] = [
  { name: "United States",  code: "USD", symbol: "$",    flag: "🇺🇸", usdRate: 1,     lat: 38.90, lng:  -77.04 },
  { name: "Eurozone",       code: "EUR", symbol: "€",    flag: "🇪🇺", usdRate: 0.92,  lat: 50.85, lng:    4.35 },
  { name: "United Kingdom", code: "GBP", symbol: "£",    flag: "🇬🇧", usdRate: 0.79,  lat: 51.50, lng:   -0.13 },
  { name: "Switzerland",    code: "CHF", symbol: "Fr",   flag: "🇨🇭", usdRate: 0.90,  lat: 46.95, lng:    7.45 },
  { name: "Japan",          code: "JPY", symbol: "¥",    flag: "🇯🇵", usdRate: 155,   lat: 35.68, lng:  139.69 },
  { name: "China",          code: "CNY", symbol: "¥",    flag: "🇨🇳", usdRate: 7.20,  lat: 39.90, lng:  116.40 },
  { name: "Hong Kong",      code: "HKD", symbol: "HK$",  flag: "🇭🇰", usdRate: 7.83,  lat: 22.30, lng:  114.17 },
  { name: "Singapore",      code: "SGD", symbol: "S$",   flag: "🇸🇬", usdRate: 1.35,  lat:  1.35, lng:  103.82 },
  { name: "South Korea",    code: "KRW", symbol: "₩",    flag: "🇰🇷", usdRate: 1370,  lat: 37.57, lng:  126.98 },
  { name: "India",          code: "INR", symbol: "₹",    flag: "🇮🇳", usdRate: 83,    lat: 28.60, lng:   77.20 },
  { name: "Indonesia",      code: "IDR", symbol: "Rp",   flag: "🇮🇩", usdRate: 16000, lat: -6.21, lng:  106.85 },
  { name: "Thailand",       code: "THB", symbol: "฿",    flag: "🇹🇭", usdRate: 36,    lat: 13.75, lng:  100.50 },
  { name: "Vietnam",        code: "VND", symbol: "₫",    flag: "🇻🇳", usdRate: 25000, lat: 21.03, lng:  105.85 },
  { name: "Philippines",    code: "PHP", symbol: "₱",    flag: "🇵🇭", usdRate: 58,    lat: 14.60, lng:  120.98 },
  { name: "Malaysia",       code: "MYR", symbol: "RM",   flag: "🇲🇾", usdRate: 4.70,  lat:  3.14, lng:  101.69 },
  { name: "Pakistan",       code: "PKR", symbol: "₨",    flag: "🇵🇰", usdRate: 280,   lat: 33.70, lng:   73.05 },
  { name: "Bangladesh",     code: "BDT", symbol: "৳",    flag: "🇧🇩", usdRate: 117,   lat: 23.81, lng:   90.41 },
  { name: "Australia",      code: "AUD", symbol: "A$",   flag: "🇦🇺", usdRate: 1.51,  lat: -35.28, lng: 149.13 },
  { name: "New Zealand",    code: "NZD", symbol: "NZ$",  flag: "🇳🇿", usdRate: 1.65,  lat: -41.29, lng: 174.78 },
  { name: "Canada",         code: "CAD", symbol: "C$",   flag: "🇨🇦", usdRate: 1.36,  lat: 45.42, lng:  -75.70 },
  { name: "Mexico",         code: "MXN", symbol: "Mex$", flag: "🇲🇽", usdRate: 17,    lat: 19.43, lng:  -99.13 },
  { name: "Brazil",         code: "BRL", symbol: "R$",   flag: "🇧🇷", usdRate: 5.10,  lat: -15.79, lng: -47.88 },
  { name: "Argentina",      code: "ARS", symbol: "$",    flag: "🇦🇷", usdRate: 880,   lat: -34.60, lng: -58.38 },
  { name: "Chile",          code: "CLP", symbol: "CLP$", flag: "🇨🇱", usdRate: 920,   lat: -33.45, lng: -70.67 },
  { name: "Colombia",       code: "COP", symbol: "COP$", flag: "🇨🇴", usdRate: 4000,  lat:   4.71, lng: -74.07 },
  { name: "Peru",           code: "PEN", symbol: "S/",   flag: "🇵🇪", usdRate: 3.70,  lat: -12.05, lng: -77.04 },
  { name: "Venezuela",      code: "VES", symbol: "Bs",   flag: "🇻🇪", usdRate: 36,    lat:  10.48, lng: -66.90 },
  { name: "Norway",         code: "NOK", symbol: "kr",   flag: "🇳🇴", usdRate: 10.70, lat:  59.91, lng:  10.75 },
  { name: "Sweden",         code: "SEK", symbol: "kr",   flag: "🇸🇪", usdRate: 10.60, lat:  59.33, lng:  18.07 },
  { name: "Denmark",        code: "DKK", symbol: "kr",   flag: "🇩🇰", usdRate: 6.85,  lat:  55.68, lng:  12.57 },
  { name: "Iceland",        code: "ISK", symbol: "kr",   flag: "🇮🇸", usdRate: 138,   lat:  64.13, lng: -21.94 },
  { name: "Poland",         code: "PLN", symbol: "zł",   flag: "🇵🇱", usdRate: 3.95,  lat:  52.23, lng:  21.01 },
  { name: "Czech Republic", code: "CZK", symbol: "Kč",   flag: "🇨🇿", usdRate: 23,    lat:  50.08, lng:  14.44 },
  { name: "Hungary",        code: "HUF", symbol: "Ft",   flag: "🇭🇺", usdRate: 360,   lat:  47.50, lng:  19.04 },
  { name: "Ukraine",        code: "UAH", symbol: "₴",    flag: "🇺🇦", usdRate: 40,    lat:  50.45, lng:  30.52 },
  { name: "Turkey",         code: "TRY", symbol: "₺",    flag: "🇹🇷", usdRate: 32,    lat:  39.93, lng:  32.86 },
  { name: "Russia",         code: "RUB", symbol: "₽",    flag: "🇷🇺", usdRate: 90,    lat:  55.75, lng:  37.62 },
  { name: "Israel",         code: "ILS", symbol: "₪",    flag: "🇮🇱", usdRate: 3.70,  lat:  31.78, lng:  35.22 },
  { name: "UAE",            code: "AED", symbol: "د.إ",  flag: "🇦🇪", usdRate: 3.67,  lat:  24.45, lng:  54.38 },
  { name: "Saudi Arabia",   code: "SAR", symbol: "﷼",    flag: "🇸🇦", usdRate: 3.75,  lat:  24.71, lng:  46.67 },
  { name: "Egypt",          code: "EGP", symbol: "E£",   flag: "🇪🇬", usdRate: 48,    lat:  30.04, lng:  31.24 },
  { name: "South Africa",   code: "ZAR", symbol: "R",    flag: "🇿🇦", usdRate: 18,    lat: -25.75, lng:  28.19 },
  { name: "Nigeria",        code: "NGN", symbol: "₦",    flag: "🇳🇬", usdRate: 1500,  lat:   9.08, lng:   7.40 },
  { name: "Kenya",          code: "KES", symbol: "KSh",  flag: "🇰🇪", usdRate: 130,   lat:  -1.29, lng:  36.82 },
  { name: "Lebanon",        code: "LBP", symbol: "ل.ل",  flag: "🇱🇧", usdRate: 89500, lat:  33.89, lng:  35.50 },
];
