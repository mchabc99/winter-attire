/**
 * KONFIGURASI SUMBER DATA MASTER WINTER ATTIRE
 * Endpoint Web App Google Apps Script resmi disimpan secara permanen di source code.
 */
export const API_URL = "https://script.google.com/macros/s/AKfycbz2X2nIm4r-tpnf1UZdbJqSKk2B1gC8obI_Rpwy4BGI_u5p0sv3b5PbNaZ6CXWziIXA/exec";

export const DEFAULT_KATALOG_API_URL = API_URL;
export const DEFAULT_KATALOG_CSV = API_URL;

export const DEFAULT_BOOKING_CSV =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_GOOGLE_SHEET_CSV_URL) ||
  '';

// Aliases for compatibility
export const DEFAULT_KATALOG_CSV_URL = API_URL;
export const DEFAULT_BOOKING_CSV_URL = DEFAULT_BOOKING_CSV;
