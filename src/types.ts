export type Gender = 'Pria' | 'Wanita';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ClimateMonthData {
  min: number;
  max: number;
  label: string;
  condition: string;
  snowLikelihood: 'Tinggi' | 'Sedang' | 'Rendah' | 'Nol';
  feelsLikeOffset: number; // e.g. -3 for windchill
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string; // e.g. 'Jepang', 'Korea Selatan', 'Eropa Barat & Alpen', 'Eropa Utara / Nordic', etc.
  flag: string;
  imageUrl: string;
  popularHighlight?: string;
  months: Record<number, ClimateMonthData>;
}

export interface OuterwearItem {
  id: string;
  name: string;
  brand: string;
  code: string;
  tempRange: string;
  category: string;
  badgeColor: string;
  description: string;
  materials: string;
  dailyPrice: number;
  minTempThreshold: number; // for logic matching
  maxTempThreshold: number;
  recommendedFor: string;
}

export interface LayerItem {
  id: string;
  layer: 'base' | 'mid' | 'outer' | 'accessory';
  layerNumber?: number;
  title: string;
  subtitle: string;
  productName: string;
  productCode?: string;
  categoryLabel?: string;
  description: string;
  dailyPrice: number;
  rental3Days?: number;
  rentalFee?: number;
  durationDays?: number;
  icon: string;
  selected: boolean;
  tag?: string;
  imageUrl?: string;
  secondaryUrl?: string;
  weightGram?: number;
  specsText?: string;
  dynamicProduct?: any;
}

export interface UserFormData {
  destinationId: string;
  month: number;
  gender: Gender;
  height: number;
  weight: number;
  shoeSize: number; // EU shoe size e.g. 36 - 45
  duration: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export interface BookingRecord {
  id?: string;
  productCode: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  customerName?: string;
  status?: string;
  notes?: string;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  statusText: string;
  conflictingBooking?: BookingRecord;
}

export interface SizeCalculationResult {
  size: Size;
  bmi: number;
  bmiCategory: string;
  note: string;
  shoulderChestGuide: string;
  shoeGuide?: string;
}

export interface RecommendationResult {
  destination: Destination;
  month: number;
  climate: ClimateMonthData;
  avgTemp: number;
  feelsLikeMin: number;
  feelsLikeMax: number;
  sizeResult: SizeCalculationResult;
  outerwear: OuterwearItem;
  layers: LayerItem[];
  totalDailyPrice: number;
  duration: number;
  grandTotal: number;
  userProfile: {
    gender: Gender;
    height: number;
    weight: number;
    shoeSize: number;
  };
}

export type ActivePage = 'advisor' | 'catalog' | 'cart' | 'guide';

export interface CartItem {
  code: string;
  name: string;
  brand?: string;
  categoryLabel: string;
  waSize: string;
  dailyPrice: number;
  imageUrl: string;
  weightGram: number;
  specsText?: string;
  quantity?: number;
  layerTag?: string;
  rentalFee?: number;
  depositFee?: number;
  totalInitialPayment?: number;
  durationDays?: number;
  specPhotoUrl?: string;
  id?: string;
  dynamicProduct?: any;
}
