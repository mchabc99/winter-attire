/**
 * KONFIGURASI SUMBER DATA MASTER WINTER ATTIRE
 * URL resmi Google Sheets disimpan secara permanen di source code dan tidak bergantung pada localStorage.
 */
export const DEFAULT_KATALOG_CSV =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_GOOGLE_SHEET_CATALOG_URL) ||
  '';

export const DEFAULT_BOOKING_CSV =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_GOOGLE_SHEET_CSV_URL) ||
  '';

// Aliases for compatibility
export const DEFAULT_KATALOG_CSV_URL = DEFAULT_KATALOG_CSV;
export const DEFAULT_BOOKING_CSV_URL = DEFAULT_BOOKING_CSV;
