import { BookingRecord, AvailabilityResult } from '../types';

export const GOOGLE_SHEET_STORAGE_KEY = 'winter_attire_sheets_url';
export const CUSTOM_BOOKINGS_STORAGE_KEY = 'winter_attire_custom_bookings';

// Clean bookings store (No confidential or mock data)
export const DEFAULT_BOOKINGS: BookingRecord[] = [];

/**
 * Normalizes date string into YYYY-MM-DD
 * Supports ISO (YYYY-MM-DD), DMY (DD/MM/YYYY, DD-MM-YYYY), and Indonesian month names (e.g. 20 Des 2026)
 */
export function normalizeDateString(dateStr: string): string {
  if (!dateStr) return '';
  const clean = dateStr.trim().replace(/^["']|["']$/g, '').trim();

  // Format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }

  // Format DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmy = clean.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    const year = dmy[3];
    return `${year}-${month}-${day}`;
  }

  // Indonesian month text: e.g. "20 Des 2026", "20 Desember 2026"
  const textMatch = clean.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (textMatch) {
    const day = textMatch[1].padStart(2, '0');
    const monthStr = textMatch[2].toLowerCase();
    const year = textMatch[3];
    const monthMap: Record<string, string> = {
      jan: '01', januari: '01',
      feb: '02', februari: '02',
      mar: '03', maret: '03',
      apr: '04', april: '04',
      mei: '05', may: '05',
      jun: '06', juni: '06',
      jul: '07', juli: '07',
      agu: '08', ags: '08', agustus: '08', aug: '08',
      sep: '09', september: '09',
      okt: '10', oktober: '10', oct: '10',
      nov: '11', november: '11',
      des: '12', desember: '12', dec: '12'
    };
    const monthNumber = monthMap[monthStr];
    if (monthNumber) {
      return `${year}-${monthNumber}-${day}`;
    }
  }

  // Fallback to standard Date parser
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    try {
      return parsed.toISOString().split('T')[0];
    } catch {
      return clean;
    }
  }

  return clean;
}

/**
 * Converts any standard Google Sheets URL into direct CSV export link
 * Supports:
 * - https://docs.google.com/spreadsheets/d/{ID}/edit... -> /gviz/tq?tqx=out:csv
 * - https://docs.google.com/spreadsheets/d/e/{ID}/pubhtml -> /pub?output=csv
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
 * Parses CSV or tab-delimited text from Google Sheets into structured BookingRecord[]
 */
export function parseGoogleSheetCsv(csvText: string): BookingRecord[] {
  if (!csvText || typeof csvText !== 'string') return [];

  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length <= 1) return [];

  // Delimiter detection: check header line for \t, ;, or ,
  const headerLine = lines[0];
  let delimiter = ',';
  if (headerLine.includes('\t')) {
    delimiter = '\t';
  } else if (headerLine.includes(';')) {
    delimiter = ';';
  }

  const normalizeHeader = (h: string) =>
    h
      .trim()
      .toLowerCase()
      .replace(/^["']|["']$/g, '')
      .replace(/[\s\-_]+/g, '_');

  const headers = headerLine.split(delimiter).map(normalizeHeader);

  // Find column indices with robust Indonesian & English aliases
  const codeIndex = headers.findIndex((h) =>
    [
      'code', 'kode', 'product_code', 'productcode', 'item_code', 'itemcode',
      'kode_produk', 'kode_barang', 'id', 'item', 'produk', 'nama_kode'
    ].includes(h)
  );

  const startIndex = headers.findIndex((h) =>
    [
      'start_date', 'startdate', 'tanggal_mulai', 'tgl_mulai', 'mulai',
      'start', 'dari', 'sewa_mulai', 'tanggal_ambil', 'tgl_ambil', 'tgl_pinjam'
    ].includes(h)
  );

  const endIndex = headers.findIndex((h) =>
    [
      'end_date', 'enddate', 'tanggal_selesai', 'tgl_selesai', 'selesai',
      'end', 'sampai', 'sewa_selesai', 'tanggal_kembali', 'tgl_kembali', 'tgl_pulang'
    ].includes(h)
  );

  const statusIndex = headers.findIndex((h) =>
    ['status', 'keterangan', 'status_booking', 'state', 'kondisi'].includes(h)
  );

  const customerIndex = headers.findIndex((h) =>
    ['customer', 'nama', 'customer_name', 'penyewa', 'nama_penyewa', 'nama_customer', 'client'].includes(h)
  );

  const notesIndex = headers.findIndex((h) =>
    ['notes', 'catatan', 'tujuan', 'trip', 'destinasi'].includes(h)
  );

  // If standard headers not found, fallback to pos 0 = code, pos 1 = start, pos 2 = end if >= 3 cols
  if (codeIndex === -1 || startIndex === -1 || endIndex === -1) {
    if (headers.length >= 3) {
      return parseWithFallbackIndices(lines.slice(1), delimiter, 0, 1, 2);
    }
    return [];
  }

  const results: BookingRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));
    const rawCode = rawCols[codeIndex]?.toUpperCase();
    const start = normalizeDateString(rawCols[startIndex] || '');
    const end = normalizeDateString(rawCols[endIndex] || '');

    if (rawCode && start && end) {
      // Extract clean code (e.g. if rawCode is "P1 - PARKA", take "P1")
      const cleanCodeMatch = rawCode.match(/^[A-Z0-9]+/);
      const code = cleanCodeMatch ? cleanCodeMatch[0] : rawCode;

      results.push({
        id: `sheet-${i}`,
        productCode: code,
        startDate: start,
        endDate: end,
        customerName: customerIndex >= 0 ? rawCols[customerIndex] : undefined,
        status: statusIndex >= 0 ? rawCols[statusIndex] : 'Booked',
        notes: notesIndex >= 0 ? rawCols[notesIndex] : `Baris ${i + 1} Google Sheets`
      });
    }
  }

  return results;
}

function parseWithFallbackIndices(
  rows: string[],
  delimiter: string,
  codeIdx: number,
  startIdx: number,
  endIdx: number
): BookingRecord[] {
  const list: BookingRecord[] = [];
  rows.forEach((line, idx) => {
    const cols = line.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));
    const rawCode = cols[codeIdx]?.toUpperCase();
    const start = normalizeDateString(cols[startIdx] || '');
    const end = normalizeDateString(cols[endIdx] || '');
    if (rawCode && start && end) {
      const cleanCodeMatch = rawCode.match(/^[A-Z0-9]+/);
      const code = cleanCodeMatch ? cleanCodeMatch[0] : rawCode;
      list.push({
        id: `row-${idx}`,
        productCode: code,
        startDate: start,
        endDate: end,
        status: 'Booked',
        notes: `Baris ${idx + 2} Spreadsheet`
      });
    }
  });
  return list;
}

/**
 * Fetches Google Sheet published CSV with auto URL conversion, local cache, and CORS proxy fallback
 */
export async function fetchBookingsFromGoogleSheet(url?: string): Promise<{
  bookings: BookingRecord[];
  source: 'google_sheets' | 'none';
  error?: string;
  directUrlUsed?: string;
}> {
  // Check if locally cached custom bookings exist
  let cachedCustom: BookingRecord[] = [];
  if (typeof window !== 'undefined') {
    try {
      const rawCustom = localStorage.getItem(CUSTOM_BOOKINGS_STORAGE_KEY);
      if (rawCustom) {
        const parsed = JSON.parse(rawCustom);
        if (Array.isArray(parsed)) {
          // Discard any old mock items
          cachedCustom = parsed.filter((b: any) => !b.id?.startsWith('mock-'));
        }
      }
    } catch {
      // ignore
    }
  }

  let queryBookingUrl = '';
  if (typeof window !== 'undefined') {
    try {
      const sp = new URLSearchParams(window.location.search);
      queryBookingUrl = sp.get('bookings') || sp.get('bookings_url') || sp.get('calendar_sheet') || '';
      if (queryBookingUrl.trim()) {
        localStorage.setItem(GOOGLE_SHEET_STORAGE_KEY, queryBookingUrl.trim());
      }
    } catch {
      // ignore
    }
  }

  const rawTargetUrl =
    url !== undefined
      ? url
      : (queryBookingUrl ||
        (typeof window !== 'undefined' ? localStorage.getItem(GOOGLE_SHEET_STORAGE_KEY) : '') ||
        ((import.meta as any).env?.VITE_GOOGLE_SHEET_CSV_URL as string) ||
        '');

  if (!rawTargetUrl || rawTargetUrl.trim() === '') {
    if (cachedCustom.length > 0) {
      return {
        bookings: cachedCustom,
        source: 'google_sheets'
      };
    }
    return {
      bookings: [],
      source: 'none'
    };
  }

  const directCsvUrl = convertToDirectCsvUrl(rawTargetUrl.trim());

  // Attempt 1: Direct fetch
  try {
    const response = await fetch(directCsvUrl, {
      headers: {
        Accept: 'text/csv, text/plain, */*'
      }
    });

    if (response.ok) {
      const text = await response.text();

      // Check if response is actually HTML error page
      if (text.includes('<!DOCTYPE html>') || text.includes('<html') || text.includes('accounts.google.com')) {
        throw new Error('URL menghasilkan laman HTML (butuh login/bukan CSV publik). Harap pastikan link disetel "Anyone with the link can view".');
      }

      const parsed = parseGoogleSheetCsv(text);
      if (parsed.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(GOOGLE_SHEET_STORAGE_KEY, rawTargetUrl.trim());
          localStorage.setItem(CUSTOM_BOOKINGS_STORAGE_KEY, JSON.stringify(parsed));
        }
        return {
          bookings: parsed,
          source: 'google_sheets',
          directUrlUsed: directCsvUrl
        };
      } else {
        throw new Error('CSV berhasil diunduh namun kolom tidak dikenali. Pastikan ada kolom Code, Start Date, End Date.');
      }
    }
  } catch (err: any) {
    console.warn('Direct fetch failed, mencoba proxy CORS fallback...', err);
  }

  // Attempt 2: CORS Proxy Fallback (AllOrigins)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directCsvUrl)}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const text = await proxyRes.text();
      if (!text.includes('<!DOCTYPE html>') && !text.includes('<html')) {
        const parsed = parseGoogleSheetCsv(text);
        if (parsed.length > 0) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(GOOGLE_SHEET_STORAGE_KEY, rawTargetUrl.trim());
            localStorage.setItem(CUSTOM_BOOKINGS_STORAGE_KEY, JSON.stringify(parsed));
          }
          return {
            bookings: parsed,
            source: 'google_sheets',
            directUrlUsed: directCsvUrl
          };
        }
      }
    }
  } catch (proxyErr: any) {
    console.warn('CORS Proxy fetch juga gagal:', proxyErr);
  }

  if (cachedCustom.length > 0) {
    return {
      bookings: cachedCustom,
      source: 'google_sheets',
      error: 'Tidak dapat refresh spreadsheet terbaru. Menggunakan data tersimpan sebelumnya.'
    };
  }

  return {
    bookings: [],
    source: 'none',
    error: 'Tidak dapat membaca spreadsheet secara online. Pastikan Google Sheet disetel "Anyone with the link can view" atau gunakan fitur Tempel CSV.'
  };
}

export const loadBookings = fetchBookingsFromGoogleSheet;

/**
 * Checks product availability by date range.
 * Interval collision formula:
 * Two date intervals [A_start, A_end] and [B_start, B_end] overlap IF AND ONLY IF:
 * A_start <= B_end AND A_end >= B_start
 */
export function checkProductAvailability(
  productCode: string,
  userStartDate?: string,
  userEndDate?: string,
  bookingsList: BookingRecord[] = DEFAULT_BOOKINGS
): AvailabilityResult {
  if (!productCode) {
    return { isAvailable: true, statusText: 'Tersedia' };
  }

  // Clean codes (support codes with aliases or spaces e.g. "R1 / R3")
  const targetCode = productCode.trim().toUpperCase();

  // If no date is set yet by user, consider available by default with prompt
  if (!userStartDate && !userEndDate) {
    return {
      isAvailable: true,
      statusText: 'Tersedia'
    };
  }

  // If only start date is selected, assume 1-day or check start date collision
  const start = userStartDate || userEndDate!;
  const end = userEndDate || userStartDate!;

  // Find colliding booking
  const conflict = bookingsList.find((b) => {
    // Check if codes match (handles 'P1', or catalog alias 'P1 / P2 / P9 Series')
    const bCode = b.productCode.trim().toUpperCase();
    const isCodeMatch =
      targetCode === bCode ||
      targetCode.startsWith(bCode + ' ') ||
      targetCode.includes(`/${bCode}`) ||
      targetCode.includes(`${bCode}/`) ||
      targetCode.includes(` ${bCode} `);

    if (!isCodeMatch) return false;

    // Check overlap: booking.startDate <= userEndDate && booking.endDate >= userStartDate
    const bookingStart = b.startDate;
    const bookingEnd = b.endDate;

    const hasOverlap = bookingStart <= end && bookingEnd >= start;
    return hasOverlap;
  });

  if (conflict) {
    return {
      isAvailable: false,
      statusText: 'Sudah Tersewa / Booked',
      conflictingBooking: conflict
    };
  }

  return {
    isAvailable: true,
    statusText: 'Tersedia'
  };
}

/**
 * Formats Indonesian readable date string (e.g. "20 Des 2026")
 */
export function formatIndoDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const [y, m, d] = dateStr.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const monthIdx = parseInt(m, 10) - 1;
    return `${parseInt(d, 10)} ${monthNames[monthIdx] || m} ${y}`;
  } catch {
    return dateStr;
  }
}
