import React, { useState, useEffect } from 'react';
import { BookingRecord } from '../types';
import {
  X,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  HelpCircle,
  Calendar,
  ClipboardCheck,
  ClipboardPaste,
  Trash2,
  Sparkles,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  Boxes,
  CalendarRange,
  Image as ImageIcon,
  Ruler,
  FolderOpen,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { SafeProductImage } from './SafeProductImage';
import {
  formatIndoDate,
  parseGoogleSheetCsv,
  fetchBookingsFromGoogleSheet,
  DEFAULT_BOOKINGS,
  DEFAULT_BOOKING_CSV_URL,
  getBookingSheetUrl,
  saveBookingSheetUrl,
  GOOGLE_SHEET_STORAGE_KEY
} from '../services/availabilityService';
import { DEFAULT_KATALOG_CSV, DEFAULT_BOOKING_CSV } from '../constants';
import {
  DynamicCatalogProduct,
  fetchCatalogFromGoogleSheet,
  parseCatalogCsv,
  getSavedCatalogSheetUrl,
  saveCatalogSheetUrl,
  DEFAULT_KATALOG_CSV_URL,
  DEFAULT_CATALOG_SHEET_URL,
  extractGoogleDriveFileId,
  isGoogleDriveFolder,
  getGoogleDriveOriginalUrl
} from '../services/catalogService';

const ADMIN_PIN_STORAGE_KEY = 'winter_attire_admin_pin';
const ADMIN_SESSION_STORAGE_KEY = 'winter_attire_admin_authed';
const DEFAULT_ADMIN_PIN = 'winter2026';

interface GoogleSheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Booking Availability State
  bookings: BookingRecord[];
  sheetSource: 'google_sheets' | 'none';
  onUpdateBookings: (bookings: BookingRecord[], source: 'google_sheets' | 'none') => void;
  // Dynamic Catalog State
  catalogProducts?: DynamicCatalogProduct[];
  catalogSource?: 'google_sheets' | 'fallback';
  lastCatalogSync?: Date | null;
  onRefreshCatalog?: () => Promise<void> | void;
  onUpdateCatalog?: (products: DynamicCatalogProduct[], source: 'google_sheets' | 'fallback') => void;
  // Admin Mode Controls
  isAdminAuthed?: boolean;
  onAdminAuthChange?: (isAuthed: boolean) => void;
  defaultSection?: 'catalog' | 'bookings';
}

export const GoogleSheetConfigModal: React.FC<GoogleSheetConfigModalProps> = ({
  isOpen,
  onClose,
  bookings,
  sheetSource,
  onUpdateBookings,
  catalogProducts = [],
  catalogSource = 'google_sheets',
  lastCatalogSync = null,
  onRefreshCatalog,
  onUpdateCatalog,
  isAdminAuthed,
  onAdminAuthChange,
  defaultSection = 'catalog'
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true';
    }
    return false;
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');

  // Active Main Section (Catalog vs Bookings)
  const [activeSection, setActiveSection] = useState<'catalog' | 'bookings'>(defaultSection);

  // Sync defaultSection and URLs when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSection(defaultSection);
      setCatalogUrl(DEFAULT_KATALOG_CSV || getSavedCatalogSheetUrl());
      setBookingUrl(DEFAULT_BOOKING_CSV || getBookingSheetUrl());
    }
  }, [isOpen, defaultSection]);

  // Keep internal auth state synced with external prop if provided
  useEffect(() => {
    if (isAdminAuthed !== undefined) {
      setIsAuthenticated(isAdminAuthed);
    }
  }, [isAdminAuthed]);

  // Change PIN State
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Bookings Tab State
  const [bookingTab, setBookingTab] = useState<'url' | 'paste'>('url');
  const [bookingUrl, setBookingUrl] = useState(() => {
    return DEFAULT_BOOKING_CSV || getBookingSheetUrl();
  });
  const [bookingPastedText, setBookingPastedText] = useState('');
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingStatusMsg, setBookingStatusMsg] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Catalog Tab State
  const [catalogTab, setCatalogTab] = useState<'url' | 'paste' | 'photos'>('url');
  const [catalogUrl, setCatalogUrl] = useState(() => {
    return DEFAULT_KATALOG_CSV || getSavedCatalogSheetUrl();
  });
  const [catalogPastedText, setCatalogPastedText] = useState('');
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogStatusMsg, setCatalogStatusMsg] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [copiedPublishLink, setCopiedPublishLink] = useState(false);

  // Drive Photo Diagnostic Cache Buster
  const [photoCacheKey, setPhotoCacheKey] = useState<number>(Date.now());
  const [isPhotoRefreshing, setIsPhotoRefreshing] = useState(false);

  const handleForceRefreshPhotos = async () => {
    setIsPhotoRefreshing(true);
    setPhotoCacheKey(Date.now());
    if (onRefreshCatalog) {
      try {
        await onRefreshCatalog();
      } catch (err) {
        console.error('Error refreshing catalog:', err);
      }
    }
    setTimeout(() => {
      setIsPhotoRefreshing(false);
    }, 1200);
  };

  if (!isOpen) return null;

  // Retrieve current active PIN
  const getCurrentPin = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || DEFAULT_ADMIN_PIN;
    }
    return DEFAULT_ADMIN_PIN;
  };

  // PIN Verification Handler
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getCurrentPin();
    if (enteredPin.trim() === correctPin.trim()) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
      }
      if (onAdminAuthChange) {
        onAdminAuthChange(true);
      }
      setPinError('');
      setEnteredPin('');
    } else {
      setPinError('PIN Admin salah. Pastikan PIN sesuai.');
    }
  };

  // Logout / Relock Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsChangingPin(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
    if (onAdminAuthChange) {
      onAdminAuthChange(false);
    }
    setEnteredPin('');
    setPinError('');
  };

  // Change PIN Handler
  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);
    if (newPin.trim().length < 4) {
      setPinChangeMsg({ type: 'error', text: 'PIN baru minimal 4 karakter.' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMsg({ type: 'error', text: 'Konfirmasi PIN tidak cocok.' });
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, newPin.trim());
    }
    setPinChangeMsg({ type: 'success', text: 'PIN Admin berhasil diubah!' });
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => {
      setIsChangingPin(false);
      setPinChangeMsg(null);
    }, 1800);
  };

  // ================= CATALOG MANAGEMENT ACTIONS =================
  const handleSaveAndSyncCatalogUrl = async () => {
    const target = catalogUrl.trim();
    setIsCatalogLoading(true);
    setCatalogStatusMsg(null);

    saveCatalogSheetUrl(target || DEFAULT_CATALOG_SHEET_URL);

    const result = await fetchCatalogFromGoogleSheet(target || DEFAULT_CATALOG_SHEET_URL);
    setIsCatalogLoading(false);

    if (result.source === 'google_sheets' && result.products.length > 0) {
      if (onUpdateCatalog) {
        onUpdateCatalog(result.products, 'google_sheets');
      }
      setCatalogStatusMsg({
        type: 'success',
        text: `Katalog berhasil terhubung live! Berhasil memuat ${result.products.length} produk dari Google Sheets.`
      });
    } else {
      setCatalogStatusMsg({
        type: 'error',
        text: result.error || 'Gagal menyinkronkan data katalog dari URL spreadsheet. Periksa izin pembagian file.'
      });
    }
  };

  const handleRefreshCatalogNow = async () => {
    setIsCatalogLoading(true);
    setCatalogStatusMsg(null);
    try {
      if (onRefreshCatalog) {
        await onRefreshCatalog();
      } else {
        const result = await fetchCatalogFromGoogleSheet(catalogUrl);
        if (onUpdateCatalog) {
          onUpdateCatalog(result.products, result.source);
        }
      }
      setCatalogStatusMsg({
        type: 'success',
        text: `Katalog berhasil diperbarui! ${catalogProducts.length} produk siap disewa.`
      });
    } catch {
      setCatalogStatusMsg({
        type: 'error',
        text: 'Gagal memperbarui katalog. Periksa koneksi internet.'
      });
    } finally {
      setIsCatalogLoading(false);
    }
  };

  const handleApplyPastedCatalog = () => {
    if (!catalogPastedText.trim()) {
      setCatalogStatusMsg({
        type: 'error',
        text: 'Teks CSV/TSV masih kosong. Silakan copy-paste baris 22 kolom dari Google Sheets.'
      });
      return;
    }

    try {
      const parsed = parseCatalogCsv(catalogPastedText);
      if (parsed.length > 0) {
        if (onUpdateCatalog) {
          onUpdateCatalog(parsed, 'google_sheets');
        }
        setCatalogStatusMsg({
          type: 'success',
          text: `Berhasil memuat ${parsed.length} produk dari teks tabel yang ditempel!`
        });
      } else {
        setCatalogStatusMsg({
          type: 'error',
          text: 'Format tabel belum sesuai 22 kolom. Pastikan kolom kode_produk dan nama_produk terisi.'
        });
      }
    } catch {
      setCatalogStatusMsg({
        type: 'error',
        text: 'Terjadi kesalahan saat mengurai teks. Pastikan baris header sesuai panduan 22 kolom.'
      });
    }
  };

  const handleResetCatalogUrl = () => {
    setCatalogUrl(DEFAULT_KATALOG_CSV_URL);
    saveCatalogSheetUrl(DEFAULT_KATALOG_CSV_URL);
    setCatalogStatusMsg({
      type: 'info',
      text: 'URL katalog direset ke URL resmi Winter Attire. Klik "Simpan & Hubungkan Live" untuk menyinkronkan.'
    });
  };

  // ================= BOOKING MANAGEMENT ACTIONS =================
  const handleResetBookingUrl = () => {
    setBookingUrl(DEFAULT_BOOKING_CSV_URL);
    saveBookingSheetUrl(DEFAULT_BOOKING_CSV_URL);
    setBookingStatusMsg({
      type: 'info',
      text: 'URL booking direset ke URL resmi Winter Attire. Klik "Sinkronkan Jadwal Booking" untuk menyinkronkan.'
    });
  };

  const handleFetchBookingUrl = async (urlToFetch?: string) => {
    const target = (urlToFetch !== undefined ? urlToFetch : bookingUrl).trim();
    setIsBookingLoading(true);
    setBookingStatusMsg(null);

    saveBookingSheetUrl(target);

    if (!target) {
      onUpdateBookings([], 'none');
      setIsBookingLoading(false);
      setBookingStatusMsg({
        type: 'info',
        text: 'URL dikosongkan. Data booking dibersihkan, semua item kini berstatus Siap Sewa.'
      });
      return;
    }

    const result = await fetchBookingsFromGoogleSheet(target);
    setIsBookingLoading(false);

    if (result.source === 'google_sheets') {
      onUpdateBookings(result.bookings, 'google_sheets');
      setBookingStatusMsg({
        type: 'success',
        text: `Berhasil tersambung! Membaca ${result.bookings.length} jadwal booking dari spreadsheet.`
      });
    } else {
      setBookingStatusMsg({
        type: 'error',
        text: result.error || 'Gagal membaca CSV dari spreadsheet. Pastikan link disetel "Anyone with the link can view".'
      });
    }
  };

  const handleApplyPastedBookings = () => {
    if (!bookingPastedText.trim()) {
      setBookingStatusMsg({
        type: 'error',
        text: 'Teks masih kosong. Silakan copy-paste baris data dari Google Sheets atau file CSV.'
      });
      return;
    }

    const parsed = parseGoogleSheetCsv(bookingPastedText);
    if (parsed.length > 0) {
      onUpdateBookings(parsed, 'google_sheets');
      setBookingStatusMsg({
        type: 'success',
        text: `Berhasil menerapkan ${parsed.length} jadwal booking dari teks yang ditempel!`
      });
    } else {
      setBookingStatusMsg({
        type: 'error',
        text: 'Format teks belum dikenali. Pastikan baris pertama memiliki judul kolom Code, Start Date, End Date.'
      });
    }
  };

  const handleClearAllBookings = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GOOGLE_SHEET_STORAGE_KEY);
    }
    setBookingUrl('');
    setBookingPastedText('');
    onUpdateBookings([], 'none');
    setBookingStatusMsg({
      type: 'info',
      text: 'Seluruh data jadwal booking dibersihkan. Semua perlengkapan kembali berstatus Siap Sewa.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-frost-card rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-white/90 flex flex-col">
        {/* ================= VIEW 1: PASSWORD AUTHENTICATION SCREEN ================= */}
        {!isAuthenticated ? (
          <div>
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-900 text-white flex items-center justify-center shadow-md shadow-teal-950/20 shrink-0">
                  <Lock className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Admin Stok & Pengaturan Spreadsheet
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Winter Attire • Area Keamanan Pengelola
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-amber-950">
                    Akses Khusus Admin & Tim Operasional
                  </div>
                  <div className="mt-1 text-amber-800/90 leading-relaxed">
                    Halaman ini dilindungi PIN pengelola agar pelanggan umum tidak dapat mengubah tautan spreadsheet live, mengedit sumber katalog 22-kolom, atau memodifikasi jadwal booking sewa.
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyPin} className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                    Masukkan PIN / Kata Sandi Admin
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={enteredPin}
                      onChange={(e) => {
                        setEnteredPin(e.target.value);
                        setPinError('');
                      }}
                      placeholder="Masukkan PIN Admin..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pinError && (
                    <p className="text-xs font-bold text-rose-600 mt-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{pinError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0C3B43] hover:bg-[#10515B] text-white font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-sm"
                >
                  <Unlock className="w-4 h-4 text-teal-300" />
                  <span>Buka Panel Pengaturan Admin</span>
                </button>
              </form>

              {/* Helpful Hint */}
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">
                  🔑 PIN Default Toko: <strong className="text-slate-600 font-mono">winter2026</strong>
                  {' '}(Dapat diubah kapan saja setelah berhasil login)
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ================= VIEW 2: UNLOCKED CONFIGURATION MODAL ================= */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Modal Header with Admin Status */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Admin Stok & Konfigurasi Google Sheets
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Admin Mode
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola data katalog 22-kolom, foto Google Drive, & ketersediaan stok
                  </p>
                </div>
              </div>

              {/* Admin Actions: Change PIN, Lock, Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(!isChangingPin)}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                    isChangingPin
                      ? 'bg-teal-900 text-white border-teal-900'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                  title="Ganti PIN Admin"
                >
                  <KeyRound className="w-3 h-3 text-teal-600" />
                  <span className="hidden sm:inline">Ganti PIN</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition cursor-pointer flex items-center gap-1"
                  title="Kunci Panel / Keluar Mode Admin"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Kunci</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition cursor-pointer shrink-0 ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inline PIN Change Banner */}
            {isChangingPin && (
              <div className="p-4 bg-teal-50 border-b border-teal-200 space-y-3 shrink-0 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-teal-950 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-teal-700" />
                    <span>Ubah PIN Akses Pengelola</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(false)}
                    className="text-xs text-teal-800 hover:underline cursor-pointer"
                  >
                    Batal
                  </button>
                </div>

                <form onSubmit={handleSaveNewPin} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="PIN Baru (min 4 digit)"
                    className="px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Ulangi PIN Baru"
                    className="px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0C3B43] hover:bg-[#10515B] text-white text-xs font-black rounded-xl transition cursor-pointer"
                  >
                    Simpan PIN Baru
                  </button>
                </form>

                {pinChangeMsg && (
                  <p
                    className={`text-xs font-bold ${
                      pinChangeMsg.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {pinChangeMsg.text}
                  </p>
                )}
              </div>
            )}

            {/* Section Switcher Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 pt-3 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveSection('catalog')}
                className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x transition flex items-center gap-2 cursor-pointer ${
                  activeSection === 'catalog'
                    ? 'bg-white text-teal-900 border-slate-200 border-b-white -mb-px shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                <Boxes className="w-4 h-4 text-teal-700" />
                <span>Katalog Produk 22-Kolom & Foto Drive</span>
                {catalogSource === 'google_sheets' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('bookings')}
                className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x transition flex items-center gap-2 cursor-pointer ${
                  activeSection === 'bookings'
                    ? 'bg-white text-teal-900 border-slate-200 border-b-white -mb-px shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                <CalendarRange className="w-4 h-4 text-teal-700" />
                <span>Jadwal Booking & Ketersediaan Stok</span>
                {sheetSource === 'google_sheets' && bookings.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 max-h-[70vh]">
              {/* ================= SECTION 1: DYNAMIC CATALOG 22-COLUMNS ================= */}
              {activeSection === 'catalog' && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Status Banner: Terkoneksi Live vs Standar */}
                  <div
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      catalogSource === 'google_sheets'
                        ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                        : 'bg-sky-50/90 border-sky-200 text-sky-950'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {catalogSource === 'google_sheets' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Database className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                          <span>
                            Status Katalog:{' '}
                            {catalogSource === 'google_sheets'
                              ? 'Google Sheets Terkoneksi Live'
                              : 'Katalog Standar Toko'}
                          </span>
                          <span className="font-mono text-[11px] px-2 py-0.2 rounded-full bg-white font-extrabold border border-current">
                            {catalogProducts.length} Produk Aktif
                          </span>
                        </div>
                        <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                          {catalogSource === 'google_sheets'
                            ? `Tersinkronisasi otomatis dengan Google Sheets 22 kolom. Terakhir diperbarui: ${
                                lastCatalogSync ? lastCatalogSync.toLocaleTimeString('id-ID') : 'Baru saja'
                              }. Foto dari link Google Drive otomatis dikonversi ke CDN resolusi tinggi.`
                            : `Saat ini menggunakan fallback katalog resmi Winter Attire. Anda dapat memasukkan URL spreadsheet 22-kolom baru di bawah untuk mengaktifkan koneksi live.`}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRefreshCatalogNow}
                      disabled={isCatalogLoading}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCatalogLoading ? 'animate-spin' : ''}`} />
                      <span>{isCatalogLoading ? 'Menyinkronkan...' : 'Refresh Sekarang'}</span>
                    </button>
                  </div>

                  {catalogStatusMsg && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        catalogStatusMsg.type === 'success'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : catalogStatusMsg.type === 'error'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : 'bg-teal-100 text-teal-900 border border-teal-300'
                      }`}
                    >
                      {catalogStatusMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : catalogStatusMsg.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" />
                      )}
                      <span>{catalogStatusMsg.text}</span>
                    </div>
                  )}

                    {/* Subtabs: URL vs Paste Text vs Diagnostik Foto Drive */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                      <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/60 p-1.5 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCatalogTab('url')}
                          className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            catalogTab === 'url'
                              ? 'bg-white text-teal-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>URL Google Sheets</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCatalogTab('paste')}
                          className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            catalogTab === 'paste'
                              ? 'bg-white text-teal-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <ClipboardPaste className="w-3.5 h-3.5" />
                          <span>Tempel CSV / TSV</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCatalogTab('photos')}
                          className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            catalogTab === 'photos'
                              ? 'bg-white text-teal-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-teal-700" />
                          <span>📷 Status & Diagnostik Foto Drive</span>
                        </button>
                      </div>

                      <div className="p-4 sm:p-5">
                        {catalogTab === 'url' ? (
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-slate-700">
                                  Tautan Publik Google Sheets (22 Kolom):
                                </label>
                                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  Tersimpan Permanen di Kode
                                </span>
                              </div>
                              <input
                                type="url"
                                readOnly
                                value={catalogUrl || DEFAULT_KATALOG_CSV}
                                onChange={(e) => setCatalogUrl(e.target.value)}
                                placeholder="Tersimpan permanen di source code (constants.ts)"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-100 font-mono select-all focus:outline-none"
                              />
                              <p className="text-[11px] text-slate-500 mt-1">
                                URL telah ditanamkan permanen di source code (<code>constants.ts</code>). Browser otomatis memuat data terbaru tanpa perlu input ulang link.
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                              <span className="text-[11px] text-slate-400">
                                *Memuat data langsung dari Google Sheets via timestamp anti-cache.
                              </span>

                              <button
                                type="button"
                                onClick={handleRefreshCatalogNow}
                                disabled={isCatalogLoading}
                                className="px-4 py-2 bg-[#0C3B43] hover:bg-[#10515B] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isCatalogLoading ? 'animate-spin' : ''}`} />
                                <span>{isCatalogLoading ? 'Menyinkronkan...' : 'Refresh Sekarang'}</span>
                              </button>
                            </div>

                            {catalogUrl.trim() && (
                              <div className="mt-3 p-3 bg-teal-50/90 border border-teal-200/80 rounded-xl text-xs space-y-1.5">
                                <div className="font-bold text-teal-950 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                                  <span>Tautan Aktivasi Domain Publik (Cloud Run)</span>
                                </div>
                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                  Browser memisahkan <em>localStorage</em> antar domain yang berbeda. Saat Anda mem-publish ke URL Cloud Run baru, klik tombol di bawah untuk menyalin tautan aktivasi langsung yang otomatis membawa koneksi Google Sheets Anda:
                                </p>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const pubUrl = `https://winter-attire-smart-rental-advisor-806252440195.asia-southeast1.run.app/?sheet=${encodeURIComponent(catalogUrl.trim())}`;
                                      navigator.clipboard.writeText(pubUrl);
                                      setCopiedPublishLink(true);
                                      setTimeout(() => setCopiedPublishLink(false), 2500);
                                    }}
                                    className="px-3 py-1.5 bg-white border border-teal-300 text-teal-900 hover:bg-teal-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                  >
                                    {copiedPublishLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-700" />}
                                    <span>{copiedPublishLink ? 'Tautan Berhasil Disalin!' : 'Salin Tautan Aktivasi Domain Publik'}</span>
                                  </button>
                                  <a
                                    href={`https://winter-attire-smart-rental-advisor-806252440195.asia-southeast1.run.app/?sheet=${encodeURIComponent(catalogUrl.trim())}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    <span>Buka & Aktifkan di Tab Baru</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : catalogTab === 'paste' ? (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-slate-700">
                              Salin dan tempel baris dari Google Sheets (mendukung pemisah Tab / Koma / Titik Koma):
                            </label>
                            <textarea
                              rows={5}
                              value={catalogPastedText}
                              onChange={(e) => setCatalogPastedText(e.target.value)}
                              placeholder="kode_produk&#9;nama_produk&#9;kategori&#9;warna&#9;size_wa&#9;rekomendasi_suhu&#9;berat_gram&#9;panjang_cm&#9;lingkar_dada_max_cm&#9;lingkar_pinggang_max_cm&#9;fitur_spesial&#9;harga_sewa_3_hari&#9;harga_sewa_6_hari&#9;harga_sewa_9_hari&#9;harga_sewa_12_hari&#9;harga_sewa_15_hari&#9;harga_sewa_18_hari&#9;harga_sewa_21_hari&#9;harga_sewa_24_hari&#9;biaya_deposit&#9;link_foto_produk&#9;link_foto_spek"
                              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                            />

                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500">
                                Salin langsung dari spreadsheet lalu tempel di atas.
                              </span>
                              <button
                                type="button"
                                onClick={handleApplyPastedCatalog}
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                              >
                                <ClipboardCheck className="w-3.5 h-3.5" />
                                <span>Terapkan Data Katalog</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ================= DIAGNOSTIK FOTO GOOGLE DRIVE ================= */
                          <div className="space-y-5 animate-in fade-in">
                            {/* Stats Counter Bar */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Produk</span>
                                <span className="text-base font-black text-slate-900">{catalogProducts.length} Item</span>
                              </div>
                              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                                <span className="text-[10px] uppercase font-bold text-teal-800 block">Link Foto Produk</span>
                                <span className="text-base font-black text-teal-950">
                                  {catalogProducts.filter((p) => p.link_foto_produk && p.link_foto_produk.trim()).length} / {catalogProducts.length}
                                </span>
                              </div>
                              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                                <span className="text-[10px] uppercase font-bold text-sky-800 block">Link Foto Spek</span>
                                <span className="text-base font-black text-sky-950">
                                  {catalogProducts.filter((p) => p.link_foto_spek && p.link_foto_spek.trim()).length} / {catalogProducts.length}
                                </span>
                              </div>
                              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Google Drive Terdeteksi</span>
                                <span className="text-base font-black text-emerald-950">
                                  {
                                    catalogProducts.filter(
                                      (p) =>
                                        extractGoogleDriveFileId(p.link_foto_produk || '') ||
                                        extractGoogleDriveFileId(p.link_foto_spek || '') ||
                                        isGoogleDriveFolder(p.link_foto_produk || '') ||
                                        isGoogleDriveFolder(p.link_foto_spek || '')
                                    ).length
                                  } Item
                                </span>
                              </div>
                            </div>

                            {/* Cache-busting refresh banner */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C3B43] via-[#114b55] to-[#0A3036] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-teal-700/50">
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                  <RefreshCw className={`w-4 h-4 text-teal-300 ${isPhotoRefreshing ? 'animate-spin' : ''}`} />
                                </div>
                                <div>
                                  <h5 className="text-xs font-black text-white">
                                    Sudah Mengubah Izin Drive ke "Anyone with link"?
                                  </h5>
                                  <p className="text-[11px] text-teal-200/90 mt-0.5 leading-snug">
                                    Klik tombol ini untuk memaksa browser mengambil foto Google Drive langsung tanpa menggunakan cache lama (bypass HTTP 403 cache).
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleForceRefreshPhotos}
                                disabled={isPhotoRefreshing}
                                className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-black shrink-0 transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isPhotoRefreshing ? 'animate-spin' : ''}`} />
                                <span>{isPhotoRefreshing ? 'Menyegarkan Foto...' : 'Muat Ulang Semua Foto (Bypass Cache)'}</span>
                              </button>
                            </div>

                            {/* Important Guide: Why Drive images don't show and How to fix */}
                            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 space-y-3">
                              <div className="flex items-start gap-2.5">
                                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                                <div>
                                  <h5 className="text-xs font-black uppercase tracking-wider text-amber-900">
                                    Kenapa Foto Google Drive Belum Muncul di Web?
                                  </h5>
                                  <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                                    Secara default, file yang diupload ke Google Drive bersifat <strong>"Dibatasi (Restricted)"</strong>. Saat Anda membukanya di browser sendiri foto bisa dibuka karena Anda sedang login akun Google Anda. Namun, website katalog dipanggil oleh browser publik tanpa login Google Anda, sehingga Google memblokir pemanggilan gambar (HTTP 403 Forbidden).
                                  </p>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-amber-200">
                                <span className="text-xs font-black text-amber-950 block mb-1.5">
                                  Solusi 3 Langkah Praktis (1 Menit Selesai):
                                </span>
                                <ol className="text-xs text-amber-950 space-y-1.5 list-decimal pl-4 leading-relaxed">
                                  <li>
                                    Buka <strong>Folder Utama Foto</strong> Anda di Google Drive (atau file foto).
                                  </li>
                                  <li>
                                    Klik kanan pada folder &rarr; pilih <strong>Bagikan (Share)</strong> &rarr; <strong>Bagikan</strong>.
                                  </li>
                                  <li>
                                    Di bagian <strong>Akses umum (General access)</strong>, ubah dari <em>Dibatasi (Restricted)</em> menjadi <strong className="underline">"Siapa saja yang memiliki link" (Anyone with the link)</strong> dengan peran <strong>Pelihat (Viewer)</strong>.
                                  </li>
                                  <li>
                                    Klik <strong>Selesai</strong>, lalu klik tombol <strong className="text-teal-900">"Refresh Sekarang"</strong> di atas. Seluruh foto produk akan otomatis langsung tampil di website!
                                  </li>
                                </ol>
                                <p className="text-[11px] text-amber-800 font-semibold mt-2">
                                  💡 <em>Trik Hemat Waktu:</em> Anda cukup membagikan 1 Folder Utama foto ke "Siapa saja yang memiliki link", maka seluruh puluhan/ratusan file foto di dalam folder tersebut otomatis memiliki izin publik sekaligus!
                                </p>
                              </div>
                            </div>

                            {/* Folder link note */}
                            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2.5">
                              <FolderOpen className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block">Catatan Tautan Folder Google Drive:</span>
                                <p className="text-[11px] text-teal-900/90 mt-0.5 leading-relaxed">
                                  Jika link di spreadsheet berformat <code>drive.google.com/drive/folders/...</code> (Folder, bukan file), website akan otomatis menampilkan kartu folder dengan tombol <strong>"Buka Galeri di Drive ↗"</strong> agar pengunjung tetap bisa melihat foto-fotonya. Untuk menampilkan gambar langsung di katalog, pastikan linknya mengarah langsung ke file fotonya (misal: <code>drive.google.com/file/d/...</code>).
                                </p>
                              </div>
                            </div>

                            {/* Interactive Diagnostics Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-black text-slate-800">
                                  Daftar Produk & Verifikasi Tautan Foto ({catalogProducts.length} Produk)
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Klik tombol untuk menguji langsung tautan Drive
                                </span>
                              </div>

                              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                                {catalogProducts.map((prod, idx) => {
                                  const driveFotoProduk = extractGoogleDriveFileId(prod.link_foto_produk || '');
                                  const isFolderFotoProduk = isGoogleDriveFolder(prod.link_foto_produk || '');
                                  const driveFotoSpek = extractGoogleDriveFileId(prod.link_foto_spek || '');
                                  const isFolderFotoSpek = isGoogleDriveFolder(prod.link_foto_spek || '');

                                  const origFotoProduk = getGoogleDriveOriginalUrl(prod.link_foto_produk || '');
                                  const origFotoSpek = getGoogleDriveOriginalUrl(prod.link_foto_spek || '');

                                  return (
                                    <div key={prod.id || idx} className="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 text-xs">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                                          <SafeProductImage
                                            src={prod.link_foto_produk || prod.link_foto_spek}
                                            alt={prod.nama_produk}
                                            category={prod.kategori}
                                            cacheKey={photoCacheKey}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono font-black text-slate-900">{prod.kode_produk}</span>
                                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">{prod.size_wa}</span>
                                          </div>
                                          <p className="text-[11px] text-slate-600 truncate max-w-xs">{prod.nama_produk}</p>
                                        </div>
                                      </div>

                                      {/* Status & Actions */}
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {origFotoProduk ? (
                                          <a
                                            href={origFotoProduk}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                                              isFolderFotoProduk
                                                ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                                                : 'bg-slate-900 text-white hover:bg-black'
                                            }`}
                                            title="Uji buka link foto produk di tab baru"
                                          >
                                            {isFolderFotoProduk ? <FolderOpen className="w-3 h-3" /> : <ExternalLink className="w-3 h-3 text-teal-300" />}
                                            <span>{isFolderFotoProduk ? 'Folder Foto ↗' : 'Foto Produk ↗'}</span>
                                          </a>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 italic px-2">Tanpa Foto</span>
                                        )}

                                        {origFotoSpek && origFotoSpek !== origFotoProduk && (
                                          <a
                                            href={origFotoSpek}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                                              isFolderFotoSpek
                                                ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                                                : 'bg-teal-800 text-white hover:bg-teal-900'
                                            }`}
                                            title="Uji buka link foto spek di tab baru"
                                          >
                                            {isFolderFotoSpek ? <FolderOpen className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                                            <span>{isFolderFotoSpek ? 'Folder Spek ↗' : 'Foto Spek ↗'}</span>
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  {/* 22 Column Reference & Google Drive Converter Information */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                    <div className="font-extrabold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-teal-700" />
                      <span>Konversi Foto Google Drive & Format 22 Kolom</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Sistem otomatis mendeteksi link Google Drive di kolom <strong>link_foto_produk</strong> dan <strong>link_foto_spek</strong> (misal: <code>drive.google.com/file/d/FILE_ID/view</code>) dan mengonversinya menjadi <em>direct CDN image</em> berkecepatan tinggi via <code>drive.google.com/thumbnail?id=FILE_ID&amp;sz=w1000</code> dan <code>lh3.googleusercontent.com/d/FILE_ID</code> dengan fallback silang.
                    </p>
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold block text-slate-900">Kolom 1-5:</span>
                        kode_produk, nama_produk, kategori, warna, size_wa
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold block text-slate-900">Kolom 6-11:</span>
                        rekomendasi_suhu, berat_gram, panjang_cm, LD_max, LP_max, fitur
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold block text-slate-900">Kolom 12-19:</span>
                        8 tiering sewa (3, 6, 9, 12, 15, 18, 21, 24 hari)
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold block text-slate-900">Kolom 20-22:</span>
                        biaya_deposit, link_foto_produk, link_foto_spek
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 2: BOOKING AVAILABILITY SCHEDULES ================= */}
              {activeSection === 'bookings' && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Active Booking Source Status Banner */}
                  <div
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      sheetSource === 'google_sheets' && bookings.length > 0
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {sheetSource === 'google_sheets' && bookings.length > 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Database className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider">
                          Status Booking:{' '}
                          {sheetSource === 'google_sheets' && bookings.length > 0
                            ? `Tersambung ke Spreadsheet (${bookings.length} Booking Terdaftar)`
                            : 'Belum Ada Data Booking (Semua Item Berstatus Tersedia)'}
                        </div>
                        <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                          {sheetSource === 'google_sheets' && bookings.length > 0
                            ? `Terdapat ${bookings.length} jadwal sewa pelanggan aktif. Item dengan tanggal bentrok otomatis ditandai "Sudah Tersewa".`
                            : `Sistem dalam kondisi bersih tanpa mock data. Masukkan URL Google Sheets booking di bawah untuk mengaktifkan filter ketersediaan real-time.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {bookingStatusMsg && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        bookingStatusMsg.type === 'success'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : bookingStatusMsg.type === 'error'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : 'bg-teal-100 text-teal-900 border border-teal-300'
                      }`}
                    >
                      {bookingStatusMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : bookingStatusMsg.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" />
                      )}
                      <span>{bookingStatusMsg.text}</span>
                    </div>
                  )}

                  {/* Booking Subtabs: URL vs Paste */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div className="flex border-b border-slate-100 bg-slate-50/60 p-1.5 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBookingTab('url')}
                        className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          bookingTab === 'url'
                            ? 'bg-white text-teal-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Tautan Google Sheets Booking</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingTab('paste')}
                        className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          bookingTab === 'paste'
                            ? 'bg-white text-teal-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        <span>Tempel Data Manual</span>
                      </button>
                    </div>

                    <div className="p-4 sm:p-5">
                      {bookingTab === 'url' ? (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-xs font-bold text-slate-700">
                                URL Google Sheets Booking (Publik / View-Only):
                              </label>
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Tersimpan Permanen di Kode
                              </span>
                            </div>
                            <input
                              type="url"
                              readOnly
                              value={bookingUrl || DEFAULT_BOOKING_CSV}
                              onChange={(e) => setBookingUrl(e.target.value)}
                              placeholder="Tersimpan permanen di source code (constants.ts)"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-100 font-mono select-all focus:outline-none"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">
                              URL jadwal booking ditanamkan secara permanen di source code (<code>constants.ts</code>).
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                            <span className="text-[11px] text-slate-400">
                              *Sinkronisasi data real-time dengan query timestamp bypass cache.
                            </span>

                            <button
                              type="button"
                              onClick={() => handleFetchBookingUrl()}
                              disabled={isBookingLoading}
                              className="px-4 py-2 bg-[#0C3B43] hover:bg-[#10515B] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isBookingLoading ? 'animate-spin' : ''}`} />
                              <span>{isBookingLoading ? 'Menghubungkan...' : 'Refresh Sekarang'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-slate-700">
                            Tempel data tabel booking (CSV atau TSV):
                          </label>
                          <textarea
                            rows={5}
                            value={bookingPastedText}
                            onChange={(e) => setBookingPastedText(e.target.value)}
                            placeholder="Code&#9;Start Date&#9;End Date&#9;Customer&#10;WA-EXT-01&#9;2026-10-10&#9;2026-10-18&#9;Budi"
                            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                          />

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">
                              Mendukung format tanggal YYYY-MM-DD atau DD/MM/YYYY.
                            </span>
                            <button
                              type="button"
                              onClick={handleApplyPastedBookings}
                              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <ClipboardCheck className="w-3.5 h-3.5" />
                              <span>Terapkan Data Booking</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Bookings Preview List */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-700" />
                        <span>Jadwal Booking yang Terdaftar ({bookings.length} Item)</span>
                      </div>
                      {bookings.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllBookings}
                          className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer underline"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Kosongkan Data Booking</span>
                        </button>
                      )}
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto shadow-2xs">
                      {bookings.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          Belum ada jadwal booking yang terdaftar. Semua item akan berstatus "Tersedia".
                        </div>
                      ) : (
                        bookings.map((b, idx) => (
                          <div
                            key={`${b.id || b.productCode || 'b'}-${idx}`}
                            className="p-3 bg-white hover:bg-slate-50/80 transition flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-black px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px]">
                                {b.productCode}
                              </span>
                              <div>
                                <div className="font-bold text-slate-900">
                                  {formatIndoDate(b.startDate)} s/d {formatIndoDate(b.endDate)}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate max-w-xs">
                                  {b.customerName ? `Penyewa: ${b.customerName}` : b.notes || 'Pemesanan Sewa'}
                                </div>
                              </div>
                            </div>

                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight bg-rose-100 text-rose-800 border border-rose-200 shrink-0 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                              <span>{b.status || 'Booked'}</span>
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-500">
                *Pengaturan hanya dapat diakses melalui mode Admin berpassword.
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black text-xs transition cursor-pointer shadow-sm"
              >
                Tutup Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
