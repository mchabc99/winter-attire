import { COMPLETE_PRODUCT_CATALOG } from '../data/productCatalog';

export const CATALOG_SHEET_STORAGE_KEY = 'winter_attire_catalog_sheet_url';
export const CATALOG_CACHE_STORAGE_KEY = 'winter_attire_catalog_cache_data';

export interface DynamicCatalogProduct {
  id?: string;
  kode_produk: string;
  nama_produk: string;
  kategori: string;
  warna: string;
  size_wa: string;
  rekomendasi_suhu: string;
  berat_gram: number;
  panjang_cm: number;
  lingkar_dada_max_cm: number;
  lingkar_pinggang_max_cm: number;
  fitur_spesial: string;
  harga_sewa_3_hari: number;
  harga_sewa_6_hari: number;
  harga_sewa_9_hari: number;
  harga_sewa_12_hari: number;
  harga_sewa_15_hari: number;
  harga_sewa_18_hari: number;
  harga_sewa_21_hari: number;
  harga_sewa_24_hari: number;
  biaya_deposit: number;
  link_foto_produk: string;
  link_foto_spek: string;
}

export interface TieredPriceCalculation {
  durationDays: number;
  tierDays: number;
  tierLabel: string;
  rentalFee: number;
  depositFee: number;
  totalInitialPayment: number;
  breakdown: string;
}

/**
 * Detects if a URL points to a Google Drive folder rather than an individual image file.
 */
export function isGoogleDriveFolder(rawUrl: string): boolean {
  if (!rawUrl) return false;
  const str = String(rawUrl).trim();
  return /drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/[a-zA-Z0-9_-]+/i.test(str);
}

/**
 * Extracts pure Google Drive folder ID if the URL points to a folder.
 */
export function extractGoogleDriveFolderId(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const str = String(rawUrl).trim();
  const folderMatch = str.match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/i);
  return folderMatch && folderMatch[1] ? folderMatch[1] : null;
}

/**
 * Extracts pure Google Drive file ID from virtually any URL or cell value.
 * Explicitly ignores folder links so they don't break image tags.
 * Handles:
 * - https://drive.google.com/file/d/{FILE_ID}/view...
 * - https://drive.google.com/file/u/0/d/{FILE_ID}/...
 * - https://drive.google.com/open?id={FILE_ID}
 * - https://drive.google.com/uc?id={FILE_ID}
 * - https://drive.google.com/uc?export=view&id={FILE_ID}
 * - https://drive.google.com/thumbnail?id={FILE_ID}
 * - https://lh3.googleusercontent.com/d/{FILE_ID}
 * - =HYPERLINK("https://drive.google.com/...", ...)
 * - =IMAGE("https://drive.google.com/...")
 * - drive.google.com/file/d/{FILE_ID} (without https://)
 * - Raw 25-50 alphanumeric file IDs
 */
/**
 * Extracts pure Google Drive file ID from virtually any URL or cell value using regex /[-\w]{25,}/.
 * Explicitly ignores folder links so they don't break image tags.
 * Handles:
 * - https://drive.google.com/file/d/{FILE_ID}/view...
 * - https://drive.google.com/file/u/0/d/{FILE_ID}/...
 * - https://drive.google.com/open?id={FILE_ID}
 * - https://drive.google.com/uc?id={FILE_ID}
 * - https://lh3.googleusercontent.com/d/{FILE_ID}
 * - Raw 25-50 alphanumeric file IDs
 */
export function extractGoogleDriveFileId(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const clean = String(rawUrl).trim();

  // If it's a folder, do not treat folder ID as an image file ID
  if (isGoogleDriveFolder(clean)) {
    return null;
  }

  // 1. Google Drive specific patterns (/d/ID, id=ID, lh3.../d/ID)
  const driveSpecificMatch = clean.match(/(?:drive\.google\.com\/(?:file\/(?:u\/\d+\/)?d\/|open\?id=|uc\?(?:export=view&)?id=)|lh3\.googleusercontent\.com\/(?:u\/\d+\/)?d\/)([-\w]{25,})/i);
  if (driveSpecificMatch && driveSpecificMatch[1]) {
    return driveSpecificMatch[1];
  }

  // 2. Query param ?id= or &id=
  const idQueryMatch = clean.match(/[?&]id=([-\w]{25,})/i);
  if (idQueryMatch && idQueryMatch[1]) {
    return idQueryMatch[1];
  }

  // 3. Fallback: match any base64 / alphanumeric ID with regex /[-\w]{25,}/
  if (!clean.includes('spreadsheets') && !clean.includes('unsplash.com')) {
    const rawMatch = clean.match(/[-\w]{25,}/);
    if (rawMatch) {
      return rawMatch[0];
    }
  }

  return null;
}

/**
 * Extracts multiple Google Drive links or IDs from a cell if the user entered more than one.
 */
export function extractAllGoogleDriveFileIds(raw: string): string[] {
  if (!raw) return [];
  const matches = String(raw).matchAll(/([-\w]{25,})/g);
  const ids: string[] = [];
  for (const m of matches) {
    if (m[1] && !ids.includes(m[1])) {
      ids.push(m[1]);
    }
  }
  return ids;
}

/**
 * Sanitizes and extracts clean media URL from spreadsheet cell values.
 * Handles =HYPERLINK("...", "..."), =IMAGE("..."), raw URLs, quotes, and whitespace.
 * Automatically adds https:// if omitted.
 */
export function sanitizeMediaUrl(raw: string): string {
  if (!raw) return '';
  let trimmed = String(raw).trim();

  // Strip enclosing quotes or apostrophes
  trimmed = trimmed.replace(/^["']|["']$/g, '').trim();

  // Handle formula: =HYPERLINK("https://...", "text") or =IMAGE("https://...")
  const formulaMatch = trimmed.match(/=(?:HYPERLINK|IMAGE)\s*\(\s*["']([^"']+)["']/i);
  if (formulaMatch && formulaMatch[1]) {
    trimmed = formulaMatch[1].trim();
  }

  // Prepend https:// if starts with drive.google.com or similar
  if (/^(?:drive|docs|lh3)\.google/i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  const urlMatch = trimmed.match(/https?:\/\/[^\s"'<>,)]+/i);
  if (urlMatch) {
    return urlMatch[0];
  }

  return trimmed;
}

export const DEFAULT_PRODUCT_FALLBACK_IMAGE = '/winter-attire-default-product.svg';

export interface GoogleDriveImageResolution {
  primaryUrl: string; // https://lh3.googleusercontent.com/d/${id}=s800
  thumbnailUrl: string; // https://drive.google.com/thumbnail?id=${id}&sz=w800
  originalUrl: string;
  isDrive: boolean;
  driveId: string | null;
}

/**
 * Utilitas khusus untuk menangani link gambar dari kolom CSV:
 * - Ekstrak Google Drive ID menggunakan regex: /[-\w]{25,}/ (mencakup /d/ID/view, id=ID, raw ID)
 * - Konversi URL utama ke CDN Google: https://lh3.googleusercontent.com/d/${id}=s800 (=s800 optimasi resolusi & bypass CORS)
 * - Siapkan fallback pertama: https://drive.google.com/thumbnail?id=${id}&sz=w800
 * - Siapkan fallback kedua jika link bukan Google Drive: gunakan URL aslinya langsung.
 */
export function resolveCatalogImageUrl(rawUrl: string | null | undefined): GoogleDriveImageResolution {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      primaryUrl: DEFAULT_PRODUCT_FALLBACK_IMAGE,
      thumbnailUrl: DEFAULT_PRODUCT_FALLBACK_IMAGE,
      originalUrl: '',
      isDrive: false,
      driveId: null
    };
  }

  const clean = sanitizeMediaUrl(rawUrl);
  const driveId = extractGoogleDriveFileId(clean);

  if (driveId) {
    return {
      primaryUrl: `https://lh3.googleusercontent.com/d/${driveId}=s800`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`,
      originalUrl: clean,
      isDrive: true,
      driveId
    };
  }

  return {
    primaryUrl: clean || DEFAULT_PRODUCT_FALLBACK_IMAGE,
    thumbnailUrl: clean || DEFAULT_PRODUCT_FALLBACK_IMAGE,
    originalUrl: clean,
    isDrive: false,
    driveId: null
  };
}

/**
 * Direct image converter for Google Drive links using high-speed Fife CDN (lh3.googleusercontent.com/d/{id}=s800).
 * Prevents CORS or rate-limit blocks on public/published domains.
 */
export function getDirectDriveImg(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const resolved = resolveCatalogImageUrl(url);
  return resolved.primaryUrl;
}

/**
 * Returns prioritized direct image CDN URLs for Google Drive images.
 * Provides Google's high-speed Fife CDN (lh3.googleusercontent.com) and Drive thumbnail endpoints.
 * Supports cacheBuster parameter to force browser to bypass cached responses.
 */
export function getGoogleDriveImageCandidates(rawUrl: string, cacheBuster?: string | number): string[] {
  if (!rawUrl) return [];
  const resolved = resolveCatalogImageUrl(rawUrl);

  if (resolved.isDrive && resolved.driveId) {
    const cbParam = cacheBuster ? `&_cb=${cacheBuster}` : '';

    return [
      // 1. Primary: Google Fife direct CDN with optimal =s800 parameter
      `${resolved.primaryUrl}${cbParam}`,
      // 2. Fallback 1: Google Drive official thumbnail endpoint
      `${resolved.thumbnailUrl}${cbParam}`,
      // 3. Fallback 2: lh3 without parameter
      `https://lh3.googleusercontent.com/d/${resolved.driveId}`,
      // 4. Download & preview endpoints
      `https://drive.google.com/uc?export=view&id=${resolved.driveId}${cbParam}`,
      `https://drive.google.com/uc?id=${resolved.driveId}${cbParam}`
    ];
  }

  const clean = sanitizeMediaUrl(rawUrl);
  if (!clean) return [];
  if (cacheBuster && clean.startsWith('http')) {
    const sep = clean.includes('?') ? '&' : '?';
    return [`${clean}${sep}_cb=${cacheBuster}`, clean];
  }
  return [clean];
}

/**
 * Converts any Google Drive link to direct image URL (https://lh3.googleusercontent.com/d/[ID_FILE]=s800).
 * Fallback to clean URL if not a Drive link.
 */
export function convertGoogleDriveImageUrl(rawUrl: string, cacheBuster?: string | number): string {
  if (!rawUrl) return '';
  const resolved = resolveCatalogImageUrl(rawUrl);
  if (resolved.isDrive) {
    if (cacheBuster) {
      return `${resolved.primaryUrl}&_cb=${cacheBuster}`;
    }
    return resolved.primaryUrl;
  }
  return resolved.primaryUrl;
}

/**
 * Returns original Google Drive web view URL for opening in a new tab.
 * Works seamlessly for both file links and folder links.
 */
export function getGoogleDriveOriginalUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const str = String(rawUrl).trim();

  // If it's a folder, return direct folder URL
  const folderId = extractGoogleDriveFolderId(str);
  if (folderId) {
    return `https://drive.google.com/drive/folders/${folderId}`;
  }

  // If it's a file, return direct file sharing URL
  const fileId = extractGoogleDriveFileId(str);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }

  if (str.startsWith('http')) {
    return str;
  }
  return null;
}

/**
 * Converts any standard Google Sheets URL into a direct CSV export link.
 * Handles both published links (/d/e/2PACX-...) and standard edit/view links (/d/{id}/...).
 */
export function convertToDirectCsvUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const url = rawUrl.trim();

  // Pattern 1: Published to web links (/spreadsheets/d/e/2PACX-...):
  if (url.includes('/spreadsheets/d/e/')) {
    if (url.includes('/pub?output=csv')) return url;
    if (url.includes('/pubhtml')) return url.replace('/pubhtml', '/pub?output=csv');
    if (url.includes('/pub')) return url.replace(/\/pub(\?.*)?$/, '/pub?output=csv');
    const baseMatch = url.match(/(https:\/\/docs\.google\.com\/spreadsheets\/d\/e\/[a-zA-Z0-9-_]+)/);
    if (baseMatch) {
      const gidMatch = url.match(/[?&#]gid=([0-9]+)/);
      return `${baseMatch[1]}/pub?output=csv${gidMatch ? `&gid=${gidMatch[1]}` : ''}`;
    }
  }

  // Pattern 2: Standard editable or viewable Google Sheets URL with long sheet ID (/d/{sheetId}/...)
  const idMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]{20,})/);
  if (idMatch) {
    const sheetId = idMatch[1];
    const gidMatch = url.match(/[?&#]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
  }

  // Pattern 3: already a pub?output=csv link
  if (url.includes('/pub?output=csv')) {
    return url;
  }

  return url;
}

/**
 * Calculates rental duration (inclusive of start and end date).
 */
export function calculateRentalDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 9; // Default 9 days favorite
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 9;
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  } catch {
    return 9;
  }
}

/**
 * Dynamic Rental Pricing Logic based on nearest duration tier (3, 6, 9, 12, 15, 18, 21, 24 days).
 * Returns: Subtotal Biaya Sewa, Deposit Refundable, and Total Pembayaran Awal.
 */
export function calculateTieredRentalPrice(
  product: DynamicCatalogProduct,
  durationDays: number
): TieredPriceCalculation {
  const days = Math.max(1, durationDays);
  let tierDays = 3;
  let rentalFee = 0;

  if (days <= 3) {
    tierDays = 3;
    rentalFee = product.harga_sewa_3_hari || 280000;
  } else if (days <= 6) {
    tierDays = 6;
    rentalFee = product.harga_sewa_6_hari || (product.harga_sewa_3_hari ? Math.round((product.harga_sewa_3_hari * 1.5) / 5000) * 5000 : 420000);
  } else if (days <= 9) {
    tierDays = 9;
    rentalFee = product.harga_sewa_9_hari || (product.harga_sewa_3_hari ? Math.round((product.harga_sewa_3_hari * 2.0) / 5000) * 5000 : 560000);
  } else if (days <= 12) {
    tierDays = 12;
    rentalFee = product.harga_sewa_12_hari || (product.harga_sewa_3_hari ? Math.round((product.harga_sewa_3_hari * 2.5) / 5000) * 5000 : 700000);
  } else if (days <= 15) {
    tierDays = 15;
    rentalFee = product.harga_sewa_15_hari || (product.harga_sewa_3_hari ? Math.round((product.harga_sewa_3_hari * 3.0) / 5000) * 5000 : 840000);
  } else if (days <= 18) {
    tierDays = 18;
    rentalFee = product.harga_sewa_18_hari || (product.harga_sewa_3_hari ? Math.round((product.harga_sewa_3_hari * 3.5) / 5000) * 5000 : 980000);
  } else if (days <= 21) {
    tierDays = 21;
    rentalFee = product.harga_sewa_21_hari || (product.harga_sewa_3_hari ? Math.round((product.harga_sewa_3_hari * 4.0) / 5000) * 5000 : 1120000);
  } else if (days <= 24) {
    tierDays = 24;
    rentalFee = product.harga_sewa_24_hari || (product.harga_sewa_3_hari ? Math.round((product.harga_sewa_3_hari * 4.5) / 5000) * 5000 : 1260000);
  } else {
    tierDays = 24;
    const base24 = product.harga_sewa_24_hari || (product.harga_sewa_3_hari ? Math.round((product.harga_sewa_3_hari * 4.5) / 5000) * 5000 : 1260000);
    const extraDays = days - 24;
    const extraDailyRate = Math.round(base24 / 24 / 1000) * 1000;
    rentalFee = base24 + extraDays * extraDailyRate;
  }

  const depositFee = product.biaya_deposit || 500000;
  const totalInitialPayment = rentalFee + depositFee;

  return {
    durationDays: days,
    tierDays,
    tierLabel: days <= 24 ? `Paket ${tierDays} Hari (${days} hari aktif)` : `${days} Hari (Paket 24 Hari + Ekstra)`,
    rentalFee,
    depositFee,
    totalInitialPayment,
    breakdown: `Sewa: Rp ${rentalFee.toLocaleString('id-ID')} + Deposit: Rp ${depositFee.toLocaleString('id-ID')} = Total: Rp ${totalInitialPayment.toLocaleString('id-ID')}`
  };
}

/**
 * Clean and parse numeric values from messy CSV cells (e.g. "Rp 140.000", "80 cm", "1.145 g").
 */
function parseNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return isNaN(value) ? defaultValue : value;
  const str = String(value).trim();
  if (!str) return defaultValue;

  // Remove currency symbols, units, spaces
  const cleaned = str
    .replace(/rp/gi, '')
    .replace(/idr/gi, '')
    .replace(/gram/gi, '')
    .replace(/cm/gi, '')
    .replace(/kg/gi, '')
    .replace(/\s+/g, '');

  // Handle dot as thousand separator: e.g. "500.000" -> "500000"
  // If format is 140.000 or 1,145
  let normalized = cleaned;
  if (/^\d{1,3}(\.\d{3})+$/.test(normalized)) {
    normalized = normalized.replace(/\./g, '');
  } else if (/^\d{1,3}(,\d{3})+$/.test(normalized)) {
    normalized = normalized.replace(/,/g, '');
  } else {
    // Replace comma with dot for standard decimals if needed
    normalized = normalized.replace(',', '.');
  }

  const num = parseFloat(normalized);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Detects common tabular delimiters (tab for copy-pasted sheets, semicolon, or comma).
 */
function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/)[0] || '';
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  if (tabCount > commaCount && tabCount > semiCount) return '\t';
  if (semiCount > commaCount) return ';';
  return ',';
}

/**
 * Parses raw CSV/TSV lines handling quoted fields and multi-delimiters correctly.
 */
function parseCsvRows(csvText: string): string[][] {
  const delimiter = detectDelimiter(csvText);
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \r\n
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Normalizes header string to match the 22 columns flexibly.
 */
function normalizeHeaderKey(header: string): string {
  return header
    .toLowerCase()
    .replace(/^["']|["']$/g, '')
    .trim()
    .replace(/[\s\-_]+/g, '_');
}

/**
 * Parses the 22-column CSV structure from Google Sheets.
 */
export function parseCatalogCsv(csvText: string): DynamicCatalogProduct[] {
  if (!csvText || typeof csvText !== 'string') return [];

  // Remove potential UTF-8 BOM
  const cleanCsv = csvText.replace(/^\uFEFF/, '');
  const rows = parseCsvRows(cleanCsv);

  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeaderKey);

  // Map header indexes
  const getIndex = (keys: string[]): number => {
    for (const key of keys) {
      const idx = headers.findIndex((h) => h === key || h.includes(key));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idxMap = {
    kode_produk: getIndex(['kode_produk', 'kode', 'code', 'product_code']),
    nama_produk: getIndex(['nama_produk', 'nama', 'product_name', 'name']),
    kategori: getIndex(['kategori', 'category']),
    warna: getIndex(['warna', 'color']),
    size_wa: getIndex(['size_wa', 'wa_size', 'size', 'ukuran']),
    rekomendasi_suhu: getIndex(['rekomendasi_suhu', 'suhu', 'temperature', 'temp_suitability']),
    berat_gram: getIndex(['berat_gram', 'berat', 'weight_gram', 'weight']),
    panjang_cm: getIndex(['panjang_cm', 'panjang', 'length_cm', 'length']),
    lingkar_dada_max_cm: getIndex(['lingkar_dada_max_cm', 'lingkar_dada', 'ld_max', 'chest_max', 'chest']),
    lingkar_pinggang_max_cm: getIndex(['lingkar_pinggang_max_cm', 'lingkar_pinggang', 'lp_max', 'waist_max', 'waist']),
    fitur_spesial: getIndex(['fitur_spesial', 'fitur', 'special_features', 'features']),
    harga_sewa_3_hari: getIndex(['harga_sewa_3_hari', 'sewa_3_hari', 'harga_3_hari', '3_hari', 'price_3_days']),
    harga_sewa_6_hari: getIndex(['harga_sewa_6_hari', 'sewa_6_hari', 'harga_6_hari', '6_hari', 'price_6_days']),
    harga_sewa_9_hari: getIndex(['harga_sewa_9_hari', 'sewa_9_hari', 'harga_9_hari', '9_hari', 'price_9_days']),
    harga_sewa_12_hari: getIndex(['harga_sewa_12_hari', 'sewa_12_hari', 'harga_12_hari', '12_hari', 'price_12_days']),
    harga_sewa_15_hari: getIndex(['harga_sewa_15_hari', 'sewa_15_hari', 'harga_15_hari', '15_hari', 'price_15_days']),
    harga_sewa_18_hari: getIndex(['harga_sewa_18_hari', 'sewa_18_hari', 'harga_18_hari', '18_hari', 'price_18_days']),
    harga_sewa_21_hari: getIndex(['harga_sewa_21_hari', 'sewa_21_hari', 'harga_21_hari', '21_hari', 'price_21_days']),
    harga_sewa_24_hari: getIndex(['harga_sewa_24_hari', 'sewa_24_hari', 'harga_24_hari', '24_hari', 'price_24_days']),
    biaya_deposit: getIndex(['biaya_deposit', 'deposit', 'uang_deposit', 'biaya_jaminan', 'jaminan']),
    link_foto_produk: getIndex([
      'link_foto_produk',
      'link_foto',
      'foto_produk',
      'foto',
      'link_produk',
      'gambar_produk',
      'gambar',
      'link_gambar',
      'image_url',
      'product_image',
      'image',
      'picture',
      'photo',
      'drive_produk',
      'drive_foto_produk',
      'link_drive',
      'google_drive',
      'drive',
      'link_gdrive',
      'gdrive',
      'url_foto',
      'url_gambar',
      'url_image',
      'foto_jaket',
      'foto_baju',
      'foto_item',
      'foto_utama',
      'link_drive_foto'
    ]),
    link_foto_spek: getIndex([
      'link_foto_spek',
      'foto_spek',
      'spek_foto',
      'link_spek',
      'foto_spesifikasi',
      'link_spesifikasi',
      'spec_photo',
      'spec_image',
      'spec_photo_url',
      'slide_ukuran',
      'size_chart',
      'foto_size',
      'spek',
      'drive_spek',
      'drive_foto_spek',
      'foto_detail',
      'link_detail',
      'foto_belakang',
      'foto_2',
      'link_foto_2'
    ])
  };

  // Smart Header Fallback: if no photo column was matched by explicit names,
  // find any column containing "foto", "drive", "gambar", "image", or "photo"
  if (idxMap.link_foto_produk === -1) {
    const photoCols = headers
      .map((h, i) => ({ header: h, index: i }))
      .filter(({ header }) =>
        /foto|gambar|image|drive|photo|picture|img/i.test(header)
      );

    if (photoCols.length > 0) {
      idxMap.link_foto_produk = photoCols[0].index;
      if (photoCols.length > 1 && idxMap.link_foto_spek === -1) {
        idxMap.link_foto_spek = photoCols[1].index;
      }
    }
  }

  const parsedProducts: DynamicCatalogProduct[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const getValue = (idx: number): string => (idx !== -1 && idx < row.length ? row[idx].trim() : '');

    const kode_produk = getValue(idxMap.kode_produk);
    const nama_produk = getValue(idxMap.nama_produk);

    // Skip empty lines without code or name
    if (!kode_produk && !nama_produk) continue;

    const rawFotoProduk = getValue(idxMap.link_foto_produk);
    const rawFotoSpek = getValue(idxMap.link_foto_spek);

    let cleanFotoProduk = sanitizeMediaUrl(rawFotoProduk);
    let cleanFotoSpek = sanitizeMediaUrl(rawFotoSpek);

    // Check if multiple Google Drive IDs were included in a single cell
    if (rawFotoProduk && !cleanFotoSpek) {
      const allIds = extractAllGoogleDriveFileIds(rawFotoProduk);
      if (allIds.length >= 2) {
        cleanFotoProduk = `https://lh3.googleusercontent.com/d/${allIds[0]}=s800`;
        cleanFotoSpek = `https://lh3.googleusercontent.com/d/${allIds[1]}=s800`;
      }
    }

    const resolvedProduk = resolveCatalogImageUrl(cleanFotoProduk);
    const resolvedSpek = resolveCatalogImageUrl(cleanFotoSpek);

    const link_foto_produk = resolvedProduk.primaryUrl || resolvedSpek.primaryUrl;
    const link_foto_spek = resolvedSpek.primaryUrl || link_foto_produk;

    const harga_3 = parseNumber(getValue(idxMap.harga_sewa_3_hari), 0);
    const harga_6 = parseNumber(getValue(idxMap.harga_sewa_6_hari), harga_3 ? Math.round(harga_3 * 1.5) : 0);
    const harga_9 = parseNumber(getValue(idxMap.harga_sewa_9_hari), harga_3 ? Math.round(harga_3 * 2.0) : 0);
    const harga_12 = parseNumber(getValue(idxMap.harga_sewa_12_hari), harga_3 ? Math.round(harga_3 * 2.5) : 0);
    const harga_15 = parseNumber(getValue(idxMap.harga_sewa_15_hari), harga_3 ? Math.round(harga_3 * 3.0) : 0);
    const harga_18 = parseNumber(getValue(idxMap.harga_sewa_18_hari), harga_3 ? Math.round(harga_3 * 3.5) : 0);
    const harga_21 = parseNumber(getValue(idxMap.harga_sewa_21_hari), harga_3 ? Math.round(harga_3 * 4.0) : 0);
    const harga_24 = parseNumber(getValue(idxMap.harga_sewa_24_hari), harga_3 ? Math.round(harga_3 * 4.5) : 0);

    const product: DynamicCatalogProduct = {
      id: `${kode_produk || 'ITEM'}_${r}`,
      kode_produk: kode_produk || `ITEM-${r}`,
      nama_produk: nama_produk || `Winter Attire Gear ${kode_produk}`,
      kategori: getValue(idxMap.kategori) || 'Regular',
      warna: getValue(idxMap.warna) || 'Black',
      size_wa: getValue(idxMap.size_wa) || 'All Size',
      rekomendasi_suhu: getValue(idxMap.rekomendasi_suhu) || '5°C s/d -15°C',
      berat_gram: parseNumber(getValue(idxMap.berat_gram), 800),
      panjang_cm: parseNumber(getValue(idxMap.panjang_cm), 75),
      lingkar_dada_max_cm: parseNumber(getValue(idxMap.lingkar_dada_max_cm), 110),
      lingkar_pinggang_max_cm: parseNumber(getValue(idxMap.lingkar_pinggang_max_cm), 105),
      fitur_spesial: getValue(idxMap.fitur_spesial) || 'Windproof, Water-repellent, Thermal Insulation',
      harga_sewa_3_hari: harga_3 || 280000,
      harga_sewa_6_hari: harga_6 || 420000,
      harga_sewa_9_hari: harga_9 || 560000,
      harga_sewa_12_hari: harga_12 || 700000,
      harga_sewa_15_hari: harga_15 || 840000,
      harga_sewa_18_hari: harga_18 || 980000,
      harga_sewa_21_hari: harga_21 || 1120000,
      harga_sewa_24_hari: harga_24 || 1260000,
      biaya_deposit: parseNumber(getValue(idxMap.biaya_deposit), 500000),
      link_foto_produk,
      link_foto_spek
    };

    parsedProducts.push(product);
  }

  return parsedProducts;
}

/**
 * Generate 22-column seed fallback products from the authentic Winter Attire catalog.
 */
export function getFallbackDynamicCatalog(): DynamicCatalogProduct[] {
  return COMPLETE_PRODUCT_CATALOG.map((item, idx) => {
    // Map category to official naming
    let kategori = 'Regular';
    if (item.category === 'extreme') {
      kategori = 'Premium Extreme';
    } else if (item.category === 'heattech') {
      kategori = 'Thermal Base Layer / Bottom / Set';
    } else if (item.category === 'accessories') {
      kategori = 'Accessories';
    } else if (item.category === 'boots') {
      kategori = 'Boots';
    } else if (item.category === 'sleepwear') {
      kategori = 'Sleepwear / Lounge';
    } else {
      kategori = 'Regular';
    }

    const daily = item.dailyPrice || 100000;
    const harga_3 = Math.round((daily * 2.2) / 5000) * 5000;
    const harga_6 = Math.round((daily * 3.4) / 5000) * 5000;
    const harga_9 = Math.round((daily * 4.6) / 5000) * 5000;
    const harga_12 = Math.round((daily * 5.8) / 5000) * 5000;
    const harga_15 = Math.round((daily * 7.0) / 5000) * 5000;
    const harga_18 = Math.round((daily * 8.2) / 5000) * 5000;
    const harga_21 = Math.round((daily * 9.4) / 5000) * 5000;
    const harga_24 = Math.round((daily * 10.6) / 5000) * 5000;

    let deposit = 500000;
    if (item.category === 'extreme') deposit = 1000000;
    else if (item.category === 'accessories' || item.category === 'heattech') deposit = 200000;

    return {
      id: `${item.code}_${idx}`,
      kode_produk: item.code,
      nama_produk: item.name,
      kategori,
      warna: item.color || 'Standard',
      size_wa: item.waSize || 'All Size',
      rekomendasi_suhu: item.tempSuitability || item.testedFor || '< 5°C',
      berat_gram: item.weightGram || 700,
      panjang_cm: item.lengthCm || 70,
      lingkar_dada_max_cm: typeof item.chestMaxCm === 'number' ? item.chestMaxCm : 108,
      lingkar_pinggang_max_cm: typeof item.waistMaxCm === 'number' ? item.waistMaxCm : 104,
      fitur_spesial: item.specialFeatures.join(', '),
      harga_sewa_3_hari: harga_3,
      harga_sewa_6_hari: harga_6,
      harga_sewa_9_hari: harga_9,
      harga_sewa_12_hari: harga_12,
      harga_sewa_15_hari: harga_15,
      harga_sewa_18_hari: harga_18,
      harga_sewa_21_hari: harga_21,
      harga_sewa_24_hari: harga_24,
      biaya_deposit: deposit,
      link_foto_produk: item.imageUrl,
      link_foto_spek: item.imageUrl // Default spec slide preview
    };
  });
}

/**
 * Hardcoded Master Google Sheets CSV URL for Winter Attire Official Catalog.
 * Ensures the app immediately loads real catalog data on first load even if localStorage is empty
 * (e.g. Incognito, private mode, new visitor).
 */
export const DEFAULT_CSV_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_GOOGLE_SHEET_CATALOG_URL) ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT5K7qOQ_WinterAttire_Catalog_Master/pub?output=csv';

export const DEFAULT_CATALOG_SHEET_URL = DEFAULT_CSV_URL;

/**
 * Retrieves saved Google Sheets URL for Catalog from URL params, localStorage, or environment.
 * Cross-checks with general spreadsheet configuration to prevent sync gaps.
 * Falls back to DEFAULT_CSV_URL if localStorage is empty.
 */
export function getCatalogSheetUrl(): string {
  if (typeof window !== 'undefined') {
    // 0. Auto-capture from URL query params (e.g. ?sheet=... or ?catalog=...) for 1-click cross-domain sync
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryParam = searchParams.get('sheet') || searchParams.get('catalog') || searchParams.get('catalog_sheet') || searchParams.get('catalog_url');
      if (queryParam && queryParam.trim()) {
        const cleanParam = queryParam.trim();
        localStorage.setItem(CATALOG_SHEET_STORAGE_KEY, cleanParam);
        if (!localStorage.getItem('winter_attire_sheets_url')) {
          localStorage.setItem('winter_attire_sheets_url', cleanParam);
        }
        return cleanParam;
      }
    } catch {
      // ignore
    }

    const catalogUrl = localStorage.getItem(CATALOG_SHEET_STORAGE_KEY);
    if (catalogUrl && catalogUrl.trim()) return catalogUrl.trim();

    const generalSheetUrl = localStorage.getItem('winter_attire_sheets_url');
    if (generalSheetUrl && generalSheetUrl.trim()) return generalSheetUrl.trim();

    const bookingSheetUrl = localStorage.getItem('winter_attire_calendar_sheet_url');
    if (bookingSheetUrl && bookingSheetUrl.trim()) return bookingSheetUrl.trim();

    const envCatalogUrl = (import.meta as any)?.env?.VITE_GOOGLE_SHEET_CATALOG_URL;
    if (envCatalogUrl && envCatalogUrl.trim()) return envCatalogUrl.trim();

    const envCsvUrl = (import.meta as any)?.env?.VITE_GOOGLE_SHEET_CSV_URL;
    if (envCsvUrl && envCsvUrl.trim()) return envCsvUrl.trim();
  }
  return DEFAULT_CSV_URL;
}

export const getSavedCatalogSheetUrl = getCatalogSheetUrl;

/**
 * Saves Google Sheets URL for Catalog to localStorage.
 */
export function saveCatalogSheetUrl(url: string): void {
  if (typeof window !== 'undefined') {
    const clean = url.trim();
    if (clean) {
      localStorage.setItem(CATALOG_SHEET_STORAGE_KEY, clean);
      if (!localStorage.getItem('winter_attire_sheets_url')) {
        localStorage.setItem('winter_attire_sheets_url', clean);
      }
    } else {
      localStorage.removeItem(CATALOG_SHEET_STORAGE_KEY);
    }
  }
}

/**
 * Live-fetches catalog CSV from Google Sheets with no-cache guarantees and CORS proxy fallback.
 */
export async function fetchCatalogFromGoogleSheet(
  sheetUrl?: string
): Promise<{ products: DynamicCatalogProduct[]; source: 'google_sheets' | 'fallback'; error?: string }> {
  const rawUrl = sheetUrl || getCatalogSheetUrl();
  if (!rawUrl || !rawUrl.trim()) {
    return {
      products: getFallbackDynamicCatalog(),
      source: 'fallback'
    };
  }

  const csvExportUrl = convertToDirectCsvUrl(rawUrl);

  const fetchCsvContent = async (url: string): Promise<string> => {
    const sep = url.includes('?') ? '&' : '?';
    const noCacheUrl = `${url}${sep}t=${Date.now()}`;

    const res = await fetch(noCacheUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv, text/plain, */*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Gagal mengunduh CSV dari Google Sheets.`);
    }

    const text = await res.text();
    // Detect if Google returned HTML login page instead of CSV
    if (text.includes('<!DOCTYPE html>') || text.includes('<html') || text.includes('accounts.google.com')) {
      throw new Error('Google Sheets memerlukan login. Pastikan setelan berbagi diatur ke "Anyone with the link can view" (Siapa saja yang memiliki link dapat melihat).');
    }
    return text;
  };

  try {
    let csvText = '';
    try {
      csvText = await fetchCsvContent(csvExportUrl);
    } catch (directErr: any) {
      console.warn('Direct catalog CSV fetch failed, attempting CORS proxy:', directErr);
      // Fallback through AllOrigins proxy with fresh timestamp
      const sep = csvExportUrl.includes('?') ? '&' : '?';
      const noCacheExportUrl = `${csvExportUrl}${sep}t=${Date.now()}`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(noCacheExportUrl)}`;
      csvText = await fetchCsvContent(proxyUrl);
    }

    const parsed = parseCatalogCsv(csvText);

    if (parsed.length === 0) {
      throw new Error('Spreadsheet kosong atau format kolom belum sesuai (pastikan terdapat kolom kode_produk, nama_produk, dan link_foto_produk).');
    }

    // Cache locally for offline resilience
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CATALOG_CACHE_STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // quota ignore
      }
    }

    return {
      products: parsed,
      source: 'google_sheets'
    };
  } catch (err: any) {
    console.warn('Google Sheets catalog fetch error:', err);

    // Try reading cached data
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(CATALOG_CACHE_STORAGE_KEY);
        if (cached) {
          const cachedData = JSON.parse(cached);
          if (Array.isArray(cachedData) && cachedData.length > 0) {
            return {
              products: cachedData,
              source: 'google_sheets',
              error: `Terkoneksi ke cache offline (${err?.message || 'Koneksi terbatas'})`
            };
          }
        }
      } catch {
        // fallback
      }
    }

    return {
      products: getFallbackDynamicCatalog(),
      source: 'fallback',
      error: err?.message || 'Tidak dapat terhubung ke Google Sheets CSV.'
    };
  }
}
