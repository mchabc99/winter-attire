import React, { useState, useMemo, useEffect } from 'react';
import {
  DynamicCatalogProduct,
  calculateRentalDays,
  calculateTieredRentalPrice,
  convertGoogleDriveImageUrl,
  getDirectDriveImg
} from '../services/catalogService';
import { ProductSpecDetailModal } from './ProductSpecDetailModal';
import { SafeProductImage } from './SafeProductImage';
import { BookingRecord, CartItem } from '../types';
import { checkProductAvailability, formatIndoDate, DEFAULT_BOOKINGS } from '../services/availabilityService';
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  Check,
  ShoppingBag,
  Calendar,
  Layers,
  Ruler,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  Lock
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ProductCatalogSectionProps {
  products: DynamicCatalogProduct[];
  isLoading?: boolean;
  sheetSource?: 'google_sheets' | 'fallback';
  lastSyncTime?: Date | null;
  onRefreshCatalog: () => void;
  onUpdateProducts?: (newProducts: DynamicCatalogProduct[], source: 'google_sheets' | 'fallback') => void;
  onAddToCart?: (item: CartItem) => void;
  onViewCart?: () => void;
  cartItemCodes?: string[];
  initialCategory?: string;
  initialSize?: string;
  bookings?: BookingRecord[];
  startDate?: string;
  endDate?: string;
  onDateChange?: (startDate: string, endDate: string) => void;
  // Admin Mode Controls (Password Protected)
  isAdminAuthed?: boolean;
  onOpenAdminStok?: () => void;
  onLogoutAdmin?: () => void;
  cacheKey?: string | number;
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  products = [],
  isLoading = false,
  sheetSource = 'fallback',
  lastSyncTime = null,
  onRefreshCatalog,
  onUpdateProducts,
  onAddToCart,
  onViewCart,
  cartItemCodes = [],
  initialCategory = 'Semua',
  initialSize = 'all',
  bookings = DEFAULT_BOOKINGS,
  startDate = '2026-12-20',
  endDate = '2026-12-28',
  onDateChange,
  isAdminAuthed = false,
  onOpenAdminStok,
  onLogoutAdmin,
  cacheKey
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize || 'all');
  const [specModalProduct, setSpecModalProduct] = useState<DynamicCatalogProduct | null>(null);

  // Sync initialSize if passed dynamically
  useEffect(() => {
    if (initialSize && initialSize !== 'all') {
      setSelectedSize(initialSize);
    }
  }, [initialSize]);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'booked'>('available');

  const durationDays = useMemo(() => calculateRentalDays(startDate, endDate), [startDate, endDate]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Exactly 7 categories requested in Requirement 6
  const categories = [
    'Semua',
    'Regular',
    'Premium Extreme',
    'Thermal Base Layer / Bottom / Set',
    'Sleepwear / Lounge',
    'Accessories',
    'Boots'
  ];

  const sizeFilters = [
    { id: 'all', label: 'Semua Ukuran' },
    { id: 'XS', label: 'Size XS' },
    { id: 'S', label: 'Size S' },
    { id: 'M', label: 'Size M' },
    { id: 'L', label: 'Size L' },
    { id: 'XL', label: 'Size XL' },
    { id: 'XXL', label: 'Size XXL' }
  ];

  // Match items with availability
  const productsWithAvailability = useMemo(() => {
    return products.map((item) => ({
      item,
      availability: checkProductAvailability(item.kode_produk, startDate, endDate, bookings),
      pricing: calculateTieredRentalPrice(item, durationDays)
    }));
  }, [products, startDate, endDate, bookings, durationDays]);

  const availableCount = useMemo(() => {
    return productsWithAvailability.filter((p) => p.availability.isAvailable).length;
  }, [productsWithAvailability]);

  const bookedCount = useMemo(() => {
    return productsWithAvailability.filter((p) => !p.availability.isAvailable).length;
  }, [productsWithAvailability]);

  // Filter products by category, size, availability, and search query
  const filteredProducts = useMemo(() => {
    return productsWithAvailability.filter(({ item, availability }) => {
      // Availability filter
      if (availabilityFilter === 'available' && !availability.isAvailable) return false;
      if (availabilityFilter === 'booked' && availability.isAvailable) return false;

      // Category filter matching logic (Requirement 6)
      if (selectedCategory !== 'Semua') {
        const itemCat = (item.kategori || '').toLowerCase();
        const selected = selectedCategory.toLowerCase();

        if (selectedCategory === 'Regular') {
          if (!itemCat.includes('regular') || itemCat.includes('extreme')) return false;
        } else if (selectedCategory === 'Premium Extreme') {
          if (!itemCat.includes('extreme') && !itemCat.includes('premium')) return false;
        } else if (selectedCategory === 'Thermal Base Layer / Bottom / Set') {
          const isThermal =
            itemCat.includes('thermal') ||
            itemCat.includes('base layer') ||
            itemCat.includes('heattech') ||
            itemCat.includes('bottom') ||
            itemCat.includes('set');
          if (!isThermal) return false;
        } else if (selectedCategory === 'Sleepwear / Lounge') {
          const isSleepwear = itemCat.includes('sleepwear') || itemCat.includes('lounge');
          if (!isSleepwear) return false;
        } else if (selectedCategory === 'Accessories') {
          const isAcc =
            itemCat.includes('accessori') ||
            itemCat.includes('aksesori') ||
            itemCat.includes('gloves') ||
            itemCat.includes('beanie');
          if (!isAcc) return false;
        } else if (selectedCategory === 'Boots') {
          const isBoot = itemCat.includes('boot') || itemCat.includes('sepatu');
          if (!isBoot) return false;
        } else {
          if (!itemCat.includes(selected)) return false;
        }
      }

      // Size filter
      if (selectedSize !== 'all') {
        const sizeWaStr = (item.size_wa || '').toUpperCase();
        const matchesSize =
          sizeWaStr.includes(selectedSize.toUpperCase()) ||
          (selectedSize === 'S' && sizeWaStr.includes('S-M')) ||
          (selectedSize === 'M' && (sizeWaStr.includes('S-M') || sizeWaStr.includes('M-L'))) ||
          (selectedSize === 'L' && (sizeWaStr.includes('M-L') || sizeWaStr.includes('L-XL'))) ||
          (selectedSize === 'XL' && sizeWaStr.includes('L-XL'));
        if (!matchesSize) return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchCode = (item.kode_produk || '').toLowerCase().includes(q);
        const matchName = (item.nama_produk || '').toLowerCase().includes(q);
        const matchColor = (item.warna || '').toLowerCase().includes(q);
        const matchFeatures = (item.fitur_spesial || '').toLowerCase().includes(q);
        const matchCategory = (item.kategori || '').toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchColor && !matchFeatures && !matchCategory) {
          return false;
        }
      }

      return true;
    });
  }, [productsWithAvailability, availabilityFilter, selectedCategory, selectedSize, searchQuery]);

  const handleAddToCart = (item: DynamicCatalogProduct) => {
    if (!onAddToCart) return;
    const pricing = calculateTieredRentalPrice(item, durationDays);
    const cartItem: CartItem = {
      code: item.kode_produk,
      name: item.nama_produk,
      categoryLabel: item.kategori,
      waSize: item.size_wa,
      dailyPrice: Math.round(pricing.rentalFee / durationDays),
      imageUrl: convertGoogleDriveImageUrl(item.link_foto_produk),
      weightGram: item.berat_gram,
      specsText: `${item.warna} | LD Max ${item.lingkar_dada_max_cm}cm | Pjg ${item.panjang_cm}cm`,
      rentalFee: pricing.rentalFee,
      depositFee: pricing.depositFee,
      totalInitialPayment: pricing.totalInitialPayment,
      durationDays,
      specPhotoUrl: convertGoogleDriveImageUrl(item.link_foto_spek)
    };
    onAddToCart(cartItem);
  };

  return (
    <section id="catalogSection" className="my-12">
      <div className="glass-frost-card rounded-3xl p-6 sm:p-8 shadow-xl border border-white/90">
        {/* Admin Operational Bar (Only displayed when authenticated via Admin PIN) */}
        {isAdminAuthed && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-950 via-[#0C3B43] to-slate-900 text-white shadow-md border border-teal-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950">
                    Mode Admin Aktif
                  </span>
                  <span className="text-xs font-bold text-teal-100">
                    {sheetSource === 'google_sheets' ? 'Google Sheets Terkoneksi Live' : 'Katalog Standar Toko'}
                  </span>
                </div>
                <p className="text-[11px] text-teal-200 mt-0.5">
                  {products.length} produk • Terakhir refresh:{' '}
                  {lastSyncTime ? lastSyncTime.toLocaleTimeString('id-ID') : 'Baru saja'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onRefreshCatalog}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                title="Refresh katalog langsung dari Google Sheets"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Menyinkronkan...' : 'Refresh Katalog'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenAdminStok}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Kelola URL Google Sheets & data stok"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-300" />
                <span>Kelola Sheets</span>
              </button>

              {onLogoutAdmin && (
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Kunci / Keluar Mode Admin"
                >
                  <Lock className="w-3 h-3" />
                  <span>Kunci</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <BrandLogo size="sm" />
              <span className="wa-badge-aurora text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Koleksi Resmi
              </span>
              <span className="bg-teal-50 text-teal-900 border border-teal-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-teal-700" />
                <span>Winter Attire Verified ({products.length} Items)</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Koleksi Produk & Tiering Tarif Sewa
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Perlengkapan musim dingin terverifikasi suhu dengan fitting akurat dan deposit transparan [Sewa] + [Deposit].
            </p>
          </div>
        </div>

        {/* Real-Time Availability & Date Duration Bar */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#0F2537] text-white shadow-sm border border-slate-700/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-teal-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] sm:text-xs font-extrabold text-white uppercase tracking-wider">
                    Periode Sewa Aktif
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#0E7490] text-white font-extrabold">
                    {durationDays} Hari
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                  {startDate && endDate ? `${formatIndoDate(startDate)} s/d ${formatIndoDate(endDate)}` : '20 Des - 28 Des 2026'}
                </p>
              </div>
            </div>

            {/* Quick Filter: Availability */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setAvailabilityFilter('all')}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
                  availabilityFilter === 'all'
                    ? 'bg-white text-[#0F2537] border-white font-black shadow-xs'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                Semua ({productsWithAvailability.length})
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('available')}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 shrink-0 ${
                  availabilityFilter === 'available'
                    ? 'bg-[#0E7490] text-white border-[#0E7490] font-black shadow-xs'
                    : 'bg-teal-950/40 text-teal-200 border-teal-500/30 hover:bg-teal-900/50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Tersedia ({availableCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('booked')}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 shrink-0 ${
                  availabilityFilter === 'booked'
                    ? 'bg-rose-500 text-white border-rose-400 font-black shadow-xs'
                    : 'bg-rose-950/40 text-rose-200 border-rose-500/30 hover:bg-rose-900/50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Tersewa ({bookedCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Filter Bar on Catalog: Categories, Sizes & Search */}
        <div className="mt-4 pt-2 pb-2 space-y-3">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0F2537] text-white shadow-xs border border-[#0F2537]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Size Filter & Search Input */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
            {/* Size Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-0.5 scrollbar-none">
              <span className="text-[10px] font-black uppercase text-slate-400 mr-1 shrink-0">
                Size:
              </span>
              {sizeFilters.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSize(s.id)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer shrink-0 ${
                    selectedSize === s.id
                      ? 'bg-[#0F2537] text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Search box */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode, nama, warna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0E7490]"
              />
            </div>
          </div>
        </div>

        {/* Product Cards Grid: Skeleton Loader when Loading, or 2 cols on Mobile / 3-4 cols on Desktop */}
        {isLoading ? (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-fadeIn">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs p-2.5 flex flex-col justify-between animate-pulse"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-slate-200/80" />
                  </div>
                  <div className="mt-2.5 space-y-1.5 px-0.5">
                    <div className="h-3.5 bg-slate-200 rounded w-4/5" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-16" />
                  <div className="h-7 bg-slate-200 rounded-xl w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map(({ item, availability, pricing }, index) => {
              const isBooked = !availability.isAvailable;
              const directProductPhoto = item.image || item.link_foto_produk || getDirectDriveImg(item.link_foto_produk);
              const directSpecPhoto = item.specImage || item.link_foto_spek || getDirectDriveImg(item.link_foto_spek);

              return (
                <div
                  key={item.id || `${item.kode_produk}-${index}`}
                  className={`group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                    isBooked ? 'opacity-85 border-slate-200' : 'hover:border-[#0E7490]/50'
                  }`}
                >
                <div>
                  {/* 1. FOTO PRODUK (Aspek Rasio Konsisten 4:5, Bersih) */}
                  <div
                    className="relative aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer"
                    onClick={() => setSpecModalProduct(item)}
                    title="Klik untuk melihat Detail Spek lengkap"
                  >
                    <SafeProductImage
                      src={item.image || directProductPhoto || directSpecPhoto}
                      secondarySrc={item.specImage || directSpecPhoto}
                      alt={item.nama_produk}
                      category={item.kategori}
                      code={item.kode_produk}
                      cacheKey={cacheKey}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        isBooked ? 'grayscale-25' : ''
                      }`}
                    />

                    {/* Product Code Badge */}
                    <span className="absolute top-2 left-2 text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
                      {item.kode_produk}
                    </span>

                    {/* Availability Badge */}
                    {isBooked ? (
                      <span className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>Booked</span>
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 bg-[#0E7490] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>Tersedia</span>
                      </span>
                    )}
                  </div>

                  {/* 2. NAMA PRODUK & BADGE KATEGORI */}
                  <div className="p-2.5 sm:p-3">
                    <div className="flex items-start justify-between gap-1.5">
                      <h4
                        onClick={() => setSpecModalProduct(item)}
                        className="text-[13px] sm:text-sm font-semibold text-[#0F2537] line-clamp-2 leading-snug cursor-pointer hover:text-[#0E7490] transition flex-1 min-h-[2.4rem]"
                        title={item.nama_produk}
                      >
                        {item.nama_produk}
                      </h4>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 border border-slate-200">
                        {item.kategori.includes('Extreme') ? 'Extreme' : item.kategori.includes('Regular') ? 'Regular' : item.kategori}
                      </span>
                    </div>

                    {/* 3. BADGE SUHU & UKURAN */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/80">
                        ❄️ {item.rekomendasi_suhu || '-10°C'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        Size {item.size_wa || 'All Size'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. HARGA SEWA TOTAL & TOMBOL "SEWA" */}
                <div className="p-2.5 sm:p-3 pt-0 space-y-2 mt-1 border-t border-slate-100">
                  <div className="flex items-baseline justify-between gap-1 pt-1.5">
                    <span className="text-[12px] sm:text-[13px] font-bold text-teal-950">
                      {formatRupiah(pricing.rentalFee)}
                      <span className="text-[11px] font-normal text-slate-500"> / {pricing.tierLabel}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSpecModalProduct(item)}
                      className="text-[11px] text-teal-800 font-bold hover:underline cursor-pointer"
                    >
                      Detail Spek ↗
                    </button>
                  </div>

                  {isBooked ? (
                    <button
                      disabled
                      type="button"
                      className="w-full py-2 px-2.5 rounded-xl bg-slate-100 text-slate-400 text-[13px] font-medium cursor-not-allowed text-center whitespace-nowrap"
                    >
                      Tersewa
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className={`w-full py-2 px-2.5 rounded-xl text-[13px] transition inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs ${
                        cartItemCodes.includes(item.kode_produk)
                          ? 'bg-[#0E7490] hover:bg-[#0c627b] text-white font-semibold'
                          : 'bg-[#0F2537] hover:bg-[#16364f] text-white font-medium'
                      }`}
                    >
                      {cartItemCodes.includes(item.kode_produk) ? (
                        <>
                          <Check className="w-4 h-4 shrink-0 text-white" />
                          <span>Terpilih</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 shrink-0 text-teal-300" />
                          <span>Sewa</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-200 mt-6">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.2]" />
            <h4 className="text-base font-bold text-slate-800">Tidak ada produk yang sesuai filter</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Coba ganti filter kategori, reset ukuran, atau hapus kata kunci pencarian.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedSize('all');
                setSearchQuery('');
                setAvailabilityFilter('all');
              }}
              className="mt-3 px-4 py-2 bg-teal-800 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-teal-900 transition"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Modal: "Lihat Detail Spek" (Requirement 3 & 4) */}
      <ProductSpecDetailModal
        product={specModalProduct}
        onClose={() => setSpecModalProduct(null)}
        onAddToCart={handleAddToCart}
        onViewCart={onViewCart}
        isInCart={specModalProduct ? cartItemCodes.includes(specModalProduct.kode_produk) : false}
        isAvailable={
          specModalProduct
            ? checkProductAvailability(specModalProduct.kode_produk, startDate, endDate, bookings).isAvailable
            : true
        }
        startDate={startDate}
        endDate={endDate}
        durationDays={durationDays}
        conflictingBooking={
          specModalProduct
            ? checkProductAvailability(specModalProduct.kode_produk, startDate, endDate, bookings).conflictingBooking
            : undefined
        }
        cacheKey={cacheKey}
      />
    </section>
  );
};
