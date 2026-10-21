import { OuterwearItem, SizeCalculationResult, Gender } from '../types';
import { ALL_DESTINATIONS, DESTINATION_REGIONS } from './destinationsData';

export const MONTH_OPTIONS = [
  { value: 11, label: 'November', season: 'Awal Musim Dingin (Early Winter)' },
  { value: 12, label: 'Desember', season: 'Puncak Liburan Musim Dingin (Peak Winter)' },
  { value: 1, label: 'Januari', season: 'Musim Dingin Paling Dingin (Deep Winter)' },
  { value: 2, label: 'Februari', season: 'Salju Lebat & Musim Dingin (Deep Winter)' },
  { value: 3, label: 'Maret', season: 'Transisi Musim Dingin ke Semi (Late Winter)' },
  { value: 4, label: 'April', season: 'Musim Semi Sejuk (Spring Transition)' },
  { value: 5, label: 'Mei', season: 'Pra-Musim Panas / Dingin Selatan' },
  { value: 6, label: 'Juni', season: 'Musim Dingin Belahan Bumi Selatan (NZ/AU)' },
  { value: 7, label: 'Juli', season: 'Puncak Libur Sekolah & Salju NZ/AU' },
  { value: 8, label: 'Agustus', season: 'Musim Dingin Akhir NZ/AU' },
  { value: 9, label: 'September', season: 'Awal Musim Gugur' },
  { value: 10, label: 'Oktober', season: 'Puncak Musim Gugur (Autumn Foliage)' }
];

// Re-export destinations and regions
export const DESTINATIONS = ALL_DESTINATIONS;
export { DESTINATION_REGIONS };

// Outerwear Catalog by Temperature Range (From Winter Attire PDF Master Catalog)
export const OUTERWEAR_CATALOG: OuterwearItem[] = [
  {
    id: 'outer-mild',
    name: 'Primark Black Series',
    brand: 'Primark London',
    code: 'R1 / R3',
    tempRange: '10°C s/d 15°C',
    category: 'Windbreaker / Light Trench Coat',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Jaket penahan angin (windproof) dan gerimis ringan dengan siluet sleek & urban. Cocok untuk cuaca sejuk tanpa rasa gerah atau kaku saat mobilitas tinggi.',
    materials: 'High-density micro polyester, breathable mesh lining, water-repellent DWR coating',
    dailyPrice: 45000,
    minTempThreshold: 10,
    maxTempThreshold: 15,
    recommendedFor: 'Tokyo (Nov), Paris (Nov/Apr), Turki (Nov/Apr), musim semi sejuk'
  },
  {
    id: 'outer-medium',
    name: 'Primark Olive Edition',
    brand: 'Primark Signature',
    code: 'R5 / R10',
    tempRange: '5°C s/d 10°C',
    category: 'Mid-Warm Quilted / Wool Silhouette Coat',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Mantel berinsulasi medium dengan aksen jahitan quilted elegan. Menahan terpaan angin dingin perkotaan dan menjaga suhu dada tetap stabil saat berada di outdoor.',
    materials: 'Thermolite synthetic fill, soft-touch matte outer shell, storm cuffs',
    dailyPrice: 65000,
    minTempThreshold: 5,
    maxTempThreshold: 10,
    recommendedFor: 'Tokyo (Des/Jan), Seoul (Nov/Mar), Paris (Des/Feb), Turki (Des/Mar)'
  },
  {
    id: 'outer-cold',
    name: 'New Look Puffer Series',
    brand: 'New Look London',
    code: 'R13 / R16',
    tempRange: '-5°C s/d 5°C',
    category: 'Heavy Insulated Puffer Shield',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    description: 'Puffer tebal dengan kantong insulasi termal empuk penahan suhu beku. Didesain khusus untuk menangkal salju awal, hujan es halus, dan hembusan angin sub-zero moderat.',
    materials: 'Heavyweight thermal fiber loft (down-feel), ripstop nylon shell, fleece-lined handwarmer pockets',
    dailyPrice: 95000,
    minTempThreshold: -5,
    maxTempThreshold: 5,
    recommendedFor: 'Sapporo (Nov/Des), Seoul (Des/Feb), Swiss (Nov/Mar), Turki (Jan/Feb)'
  },
  {
    id: 'outer-extreme',
    name: 'The North Face P1 / Michael Kors P2 / Zara P9',
    brand: 'The North Face & Designer Outerwear',
    code: 'P1 / P2 / P9 Series',
    tempRange: '< -5°C (Kondisi Ekstrem)',
    category: 'Arctic Down Expedition Parka',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Koleksi jaket kasta tertinggi Winter Attire dengan spesifikasi badai salju Alpen & kutub. Isian bulu angsa (duck down 700+ fill power) dan penahan badai (double storm-flap) untuk kenyamanan mutlak di suhu minus.',
    materials: 'Premium 90/10 Duck Down, DryVent / Gore-Tex waterproof membrane, removable faux-fur hood trim',
    dailyPrice: 140000,
    minTempThreshold: -99,
    maxTempThreshold: -5,
    recommendedFor: 'Sapporo (Jan/Feb), Swiss Alpen (Des-Feb), Harbin (Semua bulan), Iceland (Semua bulan)'
  }
];

// Helper function to pick outerwear based on average temperature
export function getOuterwearForTemp(avgTemp: number): OuterwearItem {
  if (avgTemp > 10) {
    return OUTERWEAR_CATALOG[0]; // 10-15°C (Primark Black R1/R3)
  } else if (avgTemp >= 5) {
    return OUTERWEAR_CATALOG[1]; // 5-10°C (Primark Olive R5/R10)
  } else if (avgTemp >= -5) {
    return OUTERWEAR_CATALOG[2]; // -5 s/d 5°C (New Look Puffer R13/R16)
  } else {
    return OUTERWEAR_CATALOG[3]; // < -5°C Ekstrem (The North Face P1, Michael Kors P2, Zara P9)
  }
}

// Sizing calculation engine for Winter Attire
// Factoring in layering bulk (heattech + sweater underneath) + Boot sizing for thick wool socks
export function calculateWinterAttireSize(
  gender: Gender,
  height: number,
  weight: number,
  shoeSize: number = 39
): SizeCalculationResult {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let bmiCategory = 'Normal';

  if (bmi < 18.5) bmiCategory = 'Ramping (Underweight)';
  else if (bmi < 23) bmiCategory = 'Ideal Normal (Normal weight)';
  else if (bmi < 27.5) bmiCategory = 'Padat Berisi (Overweight)';
  else bmiCategory = 'Ekstra Berisi (Plus)';

  // Shoe / Winter Boots sizing advice:
  // Recommended +1 size above daily shoe size for thermal wool socks / heattech socks
  const recommendedBootSize = shoeSize + 1;
  const shoeGuide = `Harian EU ${shoeSize} → Rekomendasi Boots: EU ${recommendedBootSize} (Upsize +1)`;

  if (gender === 'Wanita') {
    if (weight < 50 || (height < 156 && weight < 53)) {
      return {
        size: 'S',
        bmi,
        bmiCategory,
        note: 'Pas rapi di pundak dan pinggang tanpa terasa sesak, tetap ada ruang gerak untuk 2 lapis innerwear.',
        shoulderChestGuide: 'Lebar Bahu ~38-40 cm | Lingkar Dada ~90-94 cm',
        shoeGuide
      };
    } else if (weight <= 60 && height <= 168) {
      return {
        size: 'M',
        bmi,
        bmiCategory,
        note: 'Ukuran paling fleksibel dan populer untuk wanita Indonesia; proporsional saat dipadukan dengan knit sweater tebal.',
        shoulderChestGuide: 'Lebar Bahu ~40-42 cm | Lingkar Dada ~96-100 cm',
        shoeGuide
      };
    } else if (weight <= 72 || (height > 168 && weight <= 75)) {
      return {
        size: 'L',
        bmi,
        bmiCategory,
        note: 'Memberikan keleluasaan gerak penuh pada area dada, ketiak, dan lengan saat memakai fleece hoodie.',
        shoulderChestGuide: 'Lebar Bahu ~42-44 cm | Lingkar Dada ~102-106 cm',
        shoeGuide
      };
    } else {
      return {
        size: 'XL',
        bmi,
        bmiCategory,
        note: 'Kenyamanan maksimal pada pinggul, dada, dan punggung saat jaket dikancingkan penuh di cuaca bersalju.',
        shoulderChestGuide: 'Lebar Bahu ~44-47 cm | Lingkar Dada ~108-115 cm',
        shoeGuide
      };
    }
  } else {
    // Pria
    if (weight < 58 && height < 170) {
      return {
        size: 'S',
        bmi,
        bmiCategory,
        note: 'Fit proporsional untuk postur ramping pria tanpa kesan kedodoran atau lengan terlalu panjang.',
        shoulderChestGuide: 'Lebar Bahu ~43-45 cm | Lingkar Dada ~98-102 cm',
        shoeGuide
      };
    } else if (weight <= 70 && height <= 176) {
      return {
        size: 'M',
        bmi,
        bmiCategory,
        note: 'Ukuran ideal standar pria Indonesia; leluasa dipakai di atas kemeja flanel ataupun sweater rajut.',
        shoulderChestGuide: 'Lebar Bahu ~45-47 cm | Lingkar Dada ~104-108 cm',
        shoeGuide
      };
    } else if (weight <= 83 || (height > 176 && weight <= 85)) {
      return {
        size: 'L',
        bmi,
        bmiCategory,
        note: 'Reguler fit nyaman untuk postur tegap berisi; jahitan bahu kuat dan nyaman untuk mobilitas aktif.',
        shoulderChestGuide: 'Lebar Bahu ~48-50 cm | Lingkar Dada ~110-116 cm',
        shoeGuide
      };
    } else {
      return {
        size: 'XL',
        bmi,
        bmiCategory,
        note: 'Ruang gerak maksimal dan nyaman saat memakai jaket tebal berspesifikasi ekspedisi kutub.',
        shoulderChestGuide: 'Lebar Bahu ~51-54 cm | Lingkar Dada ~118-126 cm',
        shoeGuide
      };
    }
  }
}

export interface RentalDurationOption {
  days: number;
  label: string;
  subLabel: string;
  isBestSeller: boolean;
  desc: string;
}

export const RENTAL_DURATIONS: RentalDurationOption[] = [
  { days: 3, label: '3 Hari', subLabel: '3 Days', isBestSeller: false, desc: 'Short Trip' },
  { days: 6, label: '6 Hari', subLabel: '6 Days', isBestSeller: false, desc: 'Weekend Plus' },
  { days: 9, label: '9 Hari', subLabel: '9 Days', isBestSeller: true, desc: 'Liburan Favorit' },
  { days: 12, label: '12 Hari', subLabel: '12 Days', isBestSeller: true, desc: 'Trip Populer' },
  { days: 15, label: '15 Hari', subLabel: '15 Days', isBestSeller: true, desc: 'Jelajah Penuh' },
  { days: 18, label: '18 Hari', subLabel: '18 Days', isBestSeller: false, desc: 'Multi-Kota' },
  { days: 21, label: '21 Hari', subLabel: '21 Days', isBestSeller: false, desc: '3 Minggu' },
  { days: 24, label: '24 Hari', subLabel: '24 Days', isBestSeller: false, desc: 'Extended Trip' }
];
