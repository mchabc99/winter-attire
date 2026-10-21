import React, { useState, useEffect } from 'react';
import { CartItem, UserFormData, SizeCalculationResult } from '../types';
import { RENTAL_DURATIONS } from '../data/winterData';
import { SafeProductImage } from './SafeProductImage';
import {
  calculateTieredRentalPrice,
  DynamicCatalogProduct,
  getFallbackDynamicCatalog
} from '../services/catalogService';
import {
  ShoppingBag,
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Package,
  Info
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BookingFormModal, BookingFormDetails } from './BookingFormModal';
import { TermsAndConditionsModal, TermsModalTab } from './TermsAndConditionsModal';

interface CartViewProps {
  cartItems?: CartItem[];
  items?: CartItem[];
  duration: number;
  catalogProducts?: DynamicCatalogProduct[];
  onUpdateDuration?: (days: number) => void;
  onDurationChange?: (days: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity?: (code: string, quantity: number) => void;
  onClearCart: () => void;
  onNavigateToCatalog?: () => void;
  onContinueShopping?: () => void;
  onNavigateToAdvisor?: () => void;
  formData?: UserFormData;
  sizeResult?: SizeCalculationResult | null;
  destinationName?: string;
  onOpenTermsModal?: (tab?: TermsModalTab) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems: propCartItems,
  items: propItems,
  duration = 9,
  catalogProducts,
  onUpdateDuration,
  onDurationChange,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onNavigateToCatalog,
  onContinueShopping,
  onNavigateToAdvisor,
  formData = {
    destinationId: 'sapporo',
    month: 1,
    gender: 'Pria',
    height: 170,
    weight: 65,
    shoeSize: 41,
    duration: 9,
    startDate: undefined,
    endDate: undefined
  } as UserFormData,
  sizeResult,
  destinationName = 'Destinasi Liburan',
  onOpenTermsModal
}) => {
  const [copied, setCopied] = useState(false);
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  const [currentDuration, setCurrentDuration] = useState<number>(duration || 9);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);

  // Synchronize when parent duration changes
  useEffect(() => {
    if (duration && duration !== currentDuration) {
      setCurrentDuration(duration);
    }
  }, [duration]);

  // Fallback to whichever prop was passed, guaranteed array
  const cartItems = propCartItems || propItems || [];

  const handleDurationChange = (d: number) => {
    const cleanDays = Math.max(1, d);
    setCurrentDuration(cleanDays);
    if (onUpdateDuration) onUpdateDuration(cleanDays);
    if (onDurationChange) onDurationChange(cleanDays);
  };

  const handleGoToCatalog = () => {
    if (onNavigateToCatalog) onNavigateToCatalog();
    if (onContinueShopping) onContinueShopping();
  };

  const WA_PHONE_NUMBER = '6282135100969';

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  /**
   * Resolves the exact tiered rental fee, deposit, and daily rate FYI for an item at currentDuration.
   * Matches the official pricing table in Katalog & Size / Detail Spek.
   */
  const getItemPricing = (item: CartItem, targetDays: number) => {
    let prod: DynamicCatalogProduct | undefined = item.dynamicProduct;

    // 1. Search in passed catalogProducts
    if (!prod && catalogProducts && catalogProducts.length > 0) {
      prod = catalogProducts.find(
        (p) =>
          p.kode_produk.toLowerCase() === item.code.toLowerCase() ||
          p.nama_produk.toLowerCase() === item.name.toLowerCase()
      );
    }

    // 2. Search in fallback catalog products
    if (!prod) {
      const fallbacks = getFallbackDynamicCatalog();
      prod = fallbacks.find(
        (p) =>
          p.kode_produk.toLowerCase() === item.code.toLowerCase() ||
          p.nama_produk.toLowerCase() === item.name.toLowerCase()
      );
    }

    if (prod) {
      const tiered = calculateTieredRentalPrice(prod, targetDays);
      const dailyFyi = Math.round(tiered.rentalFee / targetDays);
      return {
        rentalFee: tiered.rentalFee,
        depositFee: tiered.depositFee,
        totalInitialPayment: tiered.totalInitialPayment,
        dailyFyi,
        tierLabel: tiered.tierLabel
      };
    }

    // 3. Fallback for custom layers or items without dynamic catalog match
    const baseDaily =
      item.dailyPrice ||
      (item.rentalFee ? Math.round(item.rentalFee / (item.durationDays || 9)) : 50000);
    const harga_3 = Math.round((baseDaily * 2.2) / 5000) * 5000;
    const pseudoProd: DynamicCatalogProduct = {
      kode_produk: item.code,
      nama_produk: item.name,
      kategori: item.categoryLabel || 'Regular',
      warna: 'Standard',
      size_wa: item.waSize || 'All Size',
      rekomendasi_suhu: '< 5°C',
      berat_gram: item.weightGram || 500,
      panjang_cm: 70,
      lingkar_dada_max_cm: 105,
      lingkar_pinggang_max_cm: 100,
      fitur_spesial: item.specsText || 'Winter gear',
      harga_sewa_3_hari: harga_3,
      harga_sewa_6_hari: Math.round((baseDaily * 3.4) / 5000) * 5000,
      harga_sewa_9_hari: Math.round((baseDaily * 4.6) / 5000) * 5000,
      harga_sewa_12_hari: Math.round((baseDaily * 5.8) / 5000) * 5000,
      harga_sewa_15_hari: Math.round((baseDaily * 7.0) / 5000) * 5000,
      harga_sewa_18_hari: Math.round((baseDaily * 8.2) / 5000) * 5000,
      harga_sewa_21_hari: Math.round((baseDaily * 9.4) / 5000) * 5000,
      harga_sewa_24_hari: Math.round((baseDaily * 10.6) / 5000) * 5000,
      biaya_deposit:
        item.depositFee ||
        (item.categoryLabel?.toLowerCase().includes('extreme') ? 1000000 : 500000),
      link_foto_produk: item.imageUrl,
      link_foto_spek: item.imageUrl
    };
    const tiered = calculateTieredRentalPrice(pseudoProd, targetDays);
    return {
      rentalFee: tiered.rentalFee,
      depositFee: tiered.depositFee,
      totalInitialPayment: tiered.totalInitialPayment,
      dailyFyi: Math.round(tiered.rentalFee / targetDays),
      tierLabel: tiered.tierLabel
    };
  };

  // Compute live pricings for all items according to active currentDuration
  const itemPricings = (cartItems || []).map((item) => getItemPricing(item, currentDuration));
  const totalRentalFee = itemPricings.reduce((acc, p) => acc + p.rentalFee, 0);
  const totalDepositFee = itemPricings.reduce((acc, p) => acc + p.depositFee, 0);
  const totalInitialPayment = totalRentalFee + totalDepositFee;
  const grandTotal = totalRentalFee;
  const totalWeightGram = (cartItems || []).reduce((acc, item) => acc + (item.weightGram || 0), 0);

  // Generate official pre-filled WhatsApp Booking Form message
  const generateWhatsAppMessage = () => {
    const codes = cartItems.map((c) => c.code).join(', ');
    const periodText = formData.startDate && formData.endDate
      ? `${currentDuration} Hari (${formData.startDate} s/d ${formData.endDate})`
      : `${currentDuration} Hari`;

    return `Halo Admin Winter Attire, saya ingin mengajukan sewa:

BOOKING FORM:
• Nama: [Nama User / Isi di Chat]
• Instagram Account: @[Akun IG]
• No. HP: [Nomor HP]
• Alamat Rumah: [Alamat Pengiriman]
• Negara Tujuan: ${destinationName}
• Kode Produk: ${codes || '[Pilih Produk]'}
• Periode Sewa: ${periodText}
• Estimasi Biaya Sewa: ${formatRupiah(totalRentalFee)}
• Nilai Deposit: ${formatRupiah(totalDepositFee)}
• Metode Pengiriman: Pick Up / GO-SEND (Area Jakarta) / JNE YES (Luar Jakarta)
• Metode Pengembalian: Drop Off / GO-SEND / JNE YES
• No. Rekening Bank: [Untuk Pengembalian Deposit]

Saya menyetujui T&C Winter Attire dan siap melampirkan foto KTP/SIM yang berlaku. Mohon konfirmasi ketersediaannya ya kak!`;
  };

  const handleOpenWhatsApp = () => {
    if (!agreedToTerms) {
      alert('Mohon centang persetujuan T&C Sewa terlebih dahulu.');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(generateWhatsAppMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="glass-frost-card rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-6 border border-white/90 shadow-xl">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Keranjang Sewa Masih Kosong
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          Kamu belum memilih pakaian atau aksesori musim dingin. Gunakan Smart Advisor untuk
          rekomendasi sesuai ukuranmu, atau jelajahi Katalog Koleksi Resmi kami.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateToAdvisor}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0C3B43] via-[#10515B] to-[#0E5C50] text-white font-extrabold text-xs transition shadow-md hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>Mulai dari Smart Advisor</span>
          </button>
          <button
            onClick={handleGoToCatalog}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>Lihat Semua Katalog</span>
          </button>
        </div>
      </div>
    );
  }

  const getCatalogMatch = (item: CartItem) => {
    if (item.dynamicProduct) return item.dynamicProduct;
    if (catalogProducts && catalogProducts.length > 0) {
      const found = catalogProducts.find(
        (p) =>
          p.kode_produk.toLowerCase() === item.code.toLowerCase() ||
          p.nama_produk.toLowerCase() === item.name.toLowerCase()
      );
      if (found) return found;
    }
    const fallbacks = getFallbackDynamicCatalog();
    return fallbacks.find(
      (p) =>
        p.kode_produk.toLowerCase() === item.code.toLowerCase() ||
        p.nama_produk.toLowerCase() === item.name.toLowerCase()
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-4 pb-20 md:pb-8">
      {/* Top Header Card */}
      <div className="glass-frost-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/90 shadow-sm flex flex-col gap-3">
        {/* Baris Atas: Logo mini di kiri, di sampingnya ada Badge "KERANJANG SEWA", dan di pojok kanan teks counter "N Item" */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="xs" className="w-7 h-auto rounded-lg" />
            <span className="wa-badge-aurora text-[10.5px] sm:text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              KERANJANG SEWA
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100/90 text-teal-900 border border-teal-200/60 shadow-2xs">
            {cartItems.length} Item
          </span>
        </div>

        {/* Baris Bawah: Judul "Rincian Item Pilihanmu" rata kiri (text-left) dengan font bold bersih */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-left">
          Rincian Item Pilihanmu
        </h2>

        {/* Tombol Aksi: Sejajarkan tombol "+ Tambah Item" dan "Kosongkan" dalam satu baris horizontal */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={handleGoToCatalog}
            className="text-xs font-bold text-teal-900 hover:text-teal-950 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/90 px-3.5 sm:px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Package className="w-3.5 h-3.5 text-teal-700" />
            <span>+ Tambah Item</span>
          </button>
          <button
            onClick={onClearCart}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
            title="Kosongkan keranjang"
          >
            Kosongkan
          </button>
        </div>
      </div>

      {/* Item List & Duration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Items List with consistent 12px gap and 80px bottom padding on mobile */}
        <div className="lg:col-span-7 flex flex-col gap-3 pb-20 lg:pb-0">
          {cartItems.map((item, index) => {
            const pricing = itemPricings[index] || getItemPricing(item, currentDuration);
            const matchedProd = getCatalogMatch(item);
            const displayCategory = matchedProd?.kategori || item.categoryLabel || 'Regular';
            const displayColor = matchedProd?.warna;
            const rawSize = item.waSize || matchedProd?.size_wa || 'All Size';
            const displaySize = rawSize.toLowerCase().startsWith('size') ? rawSize : `Size ${rawSize}`;

            return (
              <div
                key={item.id ? `${item.id}-${index}` : `${item.code}-${index}`}
                className="glass-frost-card rounded-2xl p-3.5 sm:p-4 border border-white/90 shadow-sm flex items-start gap-3 relative group hover:border-teal-300 transition"
              >
                {/* Kiri: Foto produk (persegi 84x84px, rounded-xl, object-fit: cover, flex-shrink: 0) */}
                <div className="w-[84px] h-[84px] rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-2xs">
                  <SafeProductImage
                    src={item.imageUrl}
                    alt={item.name}
                    code={item.code}
                    category={displayCategory}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Kanan: Kontainer teks dengan hierarki yang jelas */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div>
                    {/* Baris 1: Badge Kode & Kategori (misal: [R2] Regular) di kiri, dan ikon Delete/Trash di pojok kanan atas */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-[#0C3B43] text-white">
                          [{item.code}]
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {displayCategory}
                        </span>
                        {item.layerTag && (
                          <span className="text-[9.5px] font-extrabold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200">
                            {item.layerTag}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id || item.code)}
                        className="p-1 -mr-1 -mt-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0 cursor-pointer"
                        title="Hapus dari keranjang"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Baris 2: Nama Produk lengkap (jangan potong nama terlalu dini, biarkan turun ke baris ke-2 jika panjang, font-weight: 600, font-size: 14px) */}
                    <h4 className="text-[14px] font-semibold text-slate-900 mt-1 leading-snug break-words">
                      {item.name}
                    </h4>

                    {/* Baris 3: Chip ringkas: "Size S-M" • "Yellow Lime" (gunakan font abu-abu 12px yang bersih) */}
                    <div className="text-[12px] text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>{displaySize}</span>
                      {displayColor && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>{displayColor}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Baris 4: Informasi Harga Sewa yang terstruktur jelas:
                      Subtotal harga sewa di kanan bawah dengan nominal tegas, dan di bawahnya teks kecil: "(Paket 9 Hari • Rp 22.222/hari)" */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col items-end text-right">
                    <div className="text-[14px] sm:text-[15px] font-bold text-teal-950">
                      Subtotal: {formatRupiah(pricing.rentalFee)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      (Paket {currentDuration} Hari • {formatRupiah(pricing.dailyFyi)}/hari)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Cols: Duration & Checkout Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* Duration Selector Card */}
          <div className="glass-frost-card rounded-3xl p-5 sm:p-6 border border-white/90 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Pilih Durasi Sewa
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">3 s/d 24 Hari</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {RENTAL_DURATIONS.map((d) => {
                const isSelected = currentDuration === d.days;
                return (
                  <button
                    key={d.days}
                    onClick={() => handleDurationChange(d.days)}
                    className={`relative py-2 px-1 rounded-xl text-center border cursor-pointer transition-all duration-150 flex flex-col items-center justify-between min-h-[58px] ${
                      isSelected
                        ? 'bg-[#0C3B43] text-white border-[#0C3B43] shadow-xs'
                        : d.isBestSeller
                        ? 'bg-amber-50/70 hover:bg-amber-100/80 text-slate-800 border-amber-300'
                        : 'bg-white hover:bg-teal-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="h-3.5 flex items-center justify-center">
                      {d.isBestSeller ? (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[7.5px] font-black uppercase tracking-tight whitespace-nowrap ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 font-extrabold'
                              : 'bg-amber-200/90 text-amber-950 font-extrabold border border-amber-300/80'
                          }`}
                        >
                          ★ Best Seller
                        </span>
                      ) : (
                        <span
                          className={`text-[8.5px] font-medium ${
                            isSelected ? 'text-teal-300/80' : 'text-slate-400'
                          }`}
                        >
                          {d.subLabel}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-black tracking-tight">{d.label}</div>
                    <div
                      className={`text-[8.5px] font-semibold leading-none ${
                        isSelected
                          ? 'text-teal-200'
                          : d.isBestSeller
                          ? 'text-amber-800 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {d.isBestSeller ? 'Paling Laris' : d.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
              <span>Atur Hari Kustom:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDurationChange(Math.max(1, currentDuration - 1))}
                  className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="font-extrabold text-sm text-slate-900 w-8 text-center">
                  {currentDuration}
                </span>
                <button
                  onClick={() => handleDurationChange(currentDuration + 1)}
                  className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
                <span className="text-slate-500 text-[11px]">Hari</span>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout */}
          <div className="glass-frost-card rounded-3xl p-5 sm:p-6 border border-teal-200/80 shadow-lg bg-gradient-to-br from-white via-white to-teal-50/40">
            <div className="space-y-2 pb-4 border-b border-slate-200">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal Biaya Sewa ({currentDuration} Hari):</span>
                <span className="font-bold text-slate-800">{formatRupiah(totalRentalFee)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Total Deposit (Refundable 100%):</span>
                <span className="font-bold text-teal-800">{formatRupiah(totalDepositFee)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Total Berat Paket:</span>
                <span className="font-bold text-slate-700">
                  ~{(totalWeightGram / 1000).toFixed(2)} kg
                </span>
              </div>
            </div>

            <div className="py-4 border-b border-slate-200 bg-teal-50/60 -mx-5 sm:-mx-6 px-5 sm:px-6">
              <div className="text-[11px] uppercase font-black tracking-wider text-teal-900 flex items-center justify-between">
                <span>Total Pembayaran Awal</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  [Sewa] + [Deposit]
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-teal-950 tracking-tight mt-0.5">
                {formatRupiah(totalInitialPayment)}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Biaya sewa: <strong>{formatRupiah(totalRentalFee)}</strong> + Jaminan deposit: <strong>{formatRupiah(totalDepositFee)}</strong>. Deposit dikembalikan 100% utuh H+7 setelah barang diterima kembali.
              </p>
            </div>

            {/* Checkbox Persetujuan T&C Sebelum Checkout (Mandatory Requirement) */}
            <div className="pt-3 pb-1">
              <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-teal-800 focus:ring-teal-700 cursor-pointer"
                  />
                  <span className="text-[11.5px] text-slate-700 leading-snug">
                    Saya menyetujui <strong>T&C Sewa</strong> (Wajib KTP/SIM, Deposit Refundable H+7, & Laundry Included).{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onOpenTermsModal) {
                          onOpenTermsModal('howToRent');
                        } else {
                          setIsTermsModalOpen(true);
                        }
                      }}
                      className="text-teal-800 font-black hover:underline inline-flex items-center gap-0.5 ml-1 cursor-pointer"
                    >
                      <span>[Lihat Syarat & Ketentuan]</span>
                    </button>
                  </span>
                </label>
              </div>
            </div>

            {/* Official WhatsApp Connect Button (Opens Booking Form) */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleOpenWhatsApp}
                disabled={!agreedToTerms}
                className={`w-full py-4 px-5 rounded-2xl font-black transition transform active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer text-sm sm:text-base ${
                  agreedToTerms
                    ? 'bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:from-[#20bd5a] hover:to-[#17a54e] text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.073.043.419-.101.824z" />
                </svg>
                <span>Sewa via WhatsApp (Booking Form)</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </button>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleCopyDraft}
                  className="text-xs font-bold text-slate-700 hover:text-teal-800 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Draf Berhasil Disalin!' : 'Salin Format Draf Chat'}</span>
                </button>

                <button
                  onClick={() => setShowDraftPreview(!showDraftPreview)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer"
                >
                  {showDraftPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showDraftPreview ? 'Tutup' : 'Lihat Draf'}</span>
                </button>
              </div>

              {showDraftPreview && (
                <div className="mt-3 bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-60 overflow-y-auto">
                  {generateWhatsAppMessage()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Official Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingData={{
          destination: destinationName,
          productCodes: cartItems.map((c) => c.code),
          productNames: cartItems.map((c) => c.name),
          durationDays: currentDuration,
          startDate: formData.startDate,
          endDate: formData.endDate,
          rentalFee: totalRentalFee,
          depositFee: totalDepositFee
        }}
        onOpenTermsModal={() => {
          if (onOpenTermsModal) {
            onOpenTermsModal('howToRent');
          } else {
            setIsTermsModalOpen(true);
          }
        }}
      />

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        initialTab="howToRent"
      />
    </div>
  );
};
