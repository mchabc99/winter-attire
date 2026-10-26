import React, { useState, useMemo } from 'react';
import { RecommendationResult, LayerItem, BookingRecord } from '../types';
import { COMPLETE_PRODUCT_CATALOG, CatalogProduct } from '../data/productCatalog';
import { checkProductAvailability, formatIndoDate, DEFAULT_BOOKINGS } from '../services/availabilityService';
import { DynamicCatalogProduct } from '../services/catalogService';
import { SafeProductImage } from './SafeProductImage';
import {
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  Layers,
  Wind,
  CloudSnow,
  Sparkles,
  ShoppingBag,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ArrowRight,
  Shirt,
  Footprints,
  HelpCircle,
  AlertCircle,
  Calendar,
  Ruler
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductSpecDetailModal } from './ProductSpecDetailModal';
import { BookingFormModal, BookingFormDetails } from './BookingFormModal';
import { TermsAndConditionsModal, TermsModalTab } from './TermsAndConditionsModal';

interface RecommendationViewProps {
  result: RecommendationResult;
  onToggleLayer: (layerId: string) => void;
  onSelectAllLayers: () => void;
  onAddToCart?: (product: CatalogProduct | DynamicCatalogProduct) => void;
  onAddLayerToCart?: (layer: LayerItem) => void;
  onAddAllSelectedToCart?: () => void;
  cartItemCodes?: string[];
  onGoToCart?: () => void;
  onGoToCatalog?: (size?: string) => void;
  bookings?: BookingRecord[];
  startDate?: string;
  endDate?: string;
  catalogProducts?: DynamicCatalogProduct[];
  cacheKey?: string | number;
  onOpenTermsModal?: (tab?: TermsModalTab) => void;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  result,
  onToggleLayer,
  onSelectAllLayers,
  onAddToCart,
  onAddLayerToCart,
  onAddAllSelectedToCart,
  cartItemCodes = [],
  onGoToCart,
  onGoToCatalog,
  bookings = DEFAULT_BOOKINGS,
  startDate = '2026-12-20',
  endDate = '2026-12-28',
  catalogProducts = [],
  cacheKey,
  onOpenTermsModal
}) => {
  const [copied, setCopied] = useState(false);
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  const [showAllMatching, setShowAllMatching] = useState(false);
  const [showWhy3Layer, setShowWhy3Layer] = useState(false);
  const [detailProduct, setDetailProduct] = useState<CatalogProduct | null>(null);
  const [selectedDynamicProduct, setSelectedDynamicProduct] = useState<DynamicCatalogProduct | null>(null);
  const [hideBookedInAdvisor, setHideBookedInAdvisor] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [bookingModalData, setBookingModalData] = useState<BookingFormDetails | null>(null);

  // Hidden phone number - only accessed via URL on click
  const WA_PHONE_NUMBER = '6282135100969';

  // Format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Check outerwear availability
  const outerwearAvailability = useMemo(() => {
    return checkProductAvailability(result.outerwear.code, startDate, endDate, bookings);
  }, [result.outerwear.code, startDate, endDate, bookings]);

  // Filter items in catalog that match the recommended size with real-time availability from dynamic catalog
  const matchingSizeProducts = useMemo(() => {
    const currentSize = result.sizeResult.size.toUpperCase();
    const sourceList = (catalogProducts && catalogProducts.length > 0) ? catalogProducts : [];

    if (sourceList.length > 0) {
      // 1. Prioritize items matching user size
      const sizeMatched = sourceList.filter((item) => {
        const itemSize = (item.size_wa || '').toUpperCase();
        return (
          itemSize.includes(currentSize) ||
          itemSize.includes('ALL') ||
          itemSize.includes('FREE')
        );
      });

      const itemsToUse = sizeMatched.length > 0 ? sizeMatched : sourceList.slice(0, 8);

      return itemsToUse.map((item) => {
        const availability = checkProductAvailability(item.kode_produk, startDate, endDate, bookings);
        return {
          dynamicProduct: item,
          code: item.kode_produk,
          name: item.nama_produk,
          waSize: item.size_wa,
          imageUrl: item.image || item.link_foto_produk || item.specImage || item.link_foto_spek,
          secondaryUrl: item.specImage || item.link_foto_spek || item.image || item.link_foto_produk,
          kategori: item.kategori,
          dailyPrice: Math.round((item.harga_sewa_3_hari || 150000) / 3),
          availability
        };
      });
    }

    // Fallback to COMPLETE_PRODUCT_CATALOG if catalogProducts is empty
    return COMPLETE_PRODUCT_CATALOG.filter((item) => {
      return (
        item.sizeTags.some((t) => t.toUpperCase() === currentSize) ||
        item.sizeTags.includes('ALL') ||
        item.waSize.toLowerCase().includes('all')
      );
    }).map((item) => {
      const availability = checkProductAvailability(item.code, startDate, endDate, bookings);
      return {
        legacyProduct: item,
        code: item.code,
        name: item.name,
        waSize: item.waSize,
        imageUrl: item.imageUrl,
        secondaryUrl: item.imageUrl,
        kategori: item.categoryLabel,
        dailyPrice: item.dailyPrice,
        availability
      };
    });
  }, [result.sizeResult.size, startDate, endDate, bookings, catalogProducts]);

  const availableMatchingCount = useMemo(() => {
    return matchingSizeProducts.filter((p) => p.availability.isAvailable).length;
  }, [matchingSizeProducts]);

  const bookedMatchingCount = useMemo(() => {
    return matchingSizeProducts.filter((p) => !p.availability.isAvailable).length;
  }, [matchingSizeProducts]);

  // Displayed matching products (filtered by availability if hideBookedInAdvisor is true)
  const displayedMatchingProducts = useMemo(() => {
    let list = matchingSizeProducts;
    if (hideBookedInAdvisor) {
      list = list.filter((p) => p.availability.isAvailable);
    }
    return showAllMatching ? list : list.slice(0, 6);
  }, [showAllMatching, matchingSizeProducts, hideBookedInAdvisor]);

  // Construct structured WhatsApp message text purely for consultation on Destination & Sizing (NO item list)
  const getWhatsAppConsultationMessage = () => {
    const r = result;
    const destName = `${r.destination.name}, ${r.destination.country}`;
    const monthName = r.destination.months[r.month]?.label || 'Musim Dingin';
    const shoeSize = r.userProfile.shoeSize || 39;
    const recommendedBootSize = shoeSize + 1;

    return `Halo Admin Winter Attire (@winterattire.id)! ✨❄️
Saya ingin berkonsultasi seputar rencana perjalanan & fitting ukuran pakaian winter:

✈️ RENCANA PERJALANAN:
• Destinasi : ${destName} ${r.destination.flag}
• Bulan Keberangkatan : Bulan ${r.month} (${monthName})
• Estimasi Suhu : ${r.climate.min}°C s/d ${r.climate.max}°C (Terasa seperti ${r.feelsLikeMin}°C)
• Karakteristik Cuaca : ${r.climate.condition} (${r.climate.description})
• Peluang Salju : ${r.climate.snowLikelihood}

👤 PROFIL TUBUH & UKURAN:
• Gender : ${r.userProfile.gender}
• Tinggi Badan : ${r.userProfile.height} cm
• Berat Badan : ${r.userProfile.weight} kg (BMI: ${r.sizeResult.bmi.toFixed(1)} - ${r.sizeResult.bmiCategory})
• Rekomendasi Ukuran Jaket/Baju : *Size ${r.sizeResult.size}* (${r.sizeResult.shoulderChestGuide})
• Ukuran Kaki / Sepatu : EU ${shoeSize} (Saran Boots Salju: EU ${recommendedBootSize} untuk ruang kaos kaki wol tebal)

Apakah fitting ukuran dan jenis perlengkapan ini sudah sesuai untuk kondisi destinasi tersebut? Mohon sarannya ya Admin. Terima kasih! 🙏❄️`;
  };

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(getWhatsAppConsultationMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(getWhatsAppConsultationMessage());
    const waUrl = `https://wa.me/${WA_PHONE_NUMBER}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Helper for official Winter Attire recommendation in 3-layer system
  const getLayerWinterAttireRecommendation = (
    layerType: 'outer' | 'mid' | 'base' | 'accessory',
    prodName: string,
    prodCode?: string
  ) => {
    switch (layerType) {
      case 'outer':
        return `Pilihan Utama: ${prodName} (${prodCode || 'Down Parka'}). Cangkang luar berspesifikasi Windproof & Water-Repellent menahan hembusan angin beku dan salju basah agar panas tubuh tidak terhempas.`;
      case 'mid':
        return `Pilihan Utama: Insulated Puffer Vest (P4 / R1 / R3) atau Quilted Warm Layer. Menjebak kantong udara hangat tubuh bagian inti tanpa membatasi gerak tangan, sangat praktis saat masuk ruangan berpenghangat.`;
      case 'base':
        return `Pilihan Utama: Ultra Warm Heattech Innerwear Top + Bottom (H7 Series / H1 / H2). Wajib bersentuhan langsung dengan kulit untuk menyerap & menguapkan keringat agar tubuh tidak membeku basah.`;
      case 'accessory':
        return `Pilihan Utama: Waterproof Ski Gloves Touchscreen (P7/P8), Polar Beanie Hat, & Thermal Earmuffs. Menutup 40% pelepasan panas tubuh melalui kepala dan jari tangan; anti-basah saat bermain salju.`;
      default:
        return 'Perlengkapan standar teruji untuk proteksi maksimal di iklim musim dingin.';
    }
  };

  // Determine temperature severity badge
  const isExtreme = result.avgTemp < -5;
  const isCold = result.avgTemp >= -5 && result.avgTemp < 5;
  const isChilly = result.avgTemp >= 5 && result.avgTemp <= 10;

  return (
    <div className="space-y-6">
      {/* 1. Destination Weather Card with Scenic Cover Image */}
      <div className="glass-frost-card rounded-3xl overflow-hidden shadow-xl border border-white/90 relative">
        {/* City Scenic Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={result.destination.imageUrl}
            alt={result.destination.name}
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800';
            }}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C3B43] via-[#0C3B43]/50 to-transparent"></div>

          {/* Top Destination Badges */}
          <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider bg-black/40 backdrop-blur-md text-teal-200 border border-white/20 px-3 py-1 rounded-full">
              {result.destination.region}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${
                isExtreme
                  ? 'bg-indigo-900/80 text-indigo-200 border-indigo-400/40'
                  : isCold
                  ? 'bg-sky-900/80 text-sky-200 border-sky-400/40'
                  : isChilly
                  ? 'bg-emerald-900/80 text-emerald-200 border-emerald-400/40'
                  : 'bg-teal-900/80 text-teal-200 border-teal-400/40'
              }`}
            >
              {isExtreme
                ? '❄️ Ekstrem Sub-Zero'
                : isCold
                ? '🌨️ Salju & Dingin'
                : isChilly
                ? '🧥 Dingin Kota'
                : '🍂 Sejuk Nyaman'}
            </span>
          </div>

          {/* Bottom City Name & Highlight inside Image */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl drop-shadow">{result.destination.flag}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                {result.destination.name}, {result.destination.country}
              </h3>
            </div>
            {result.destination.popularHighlight && (
              <p className="text-xs sm:text-sm text-teal-100 font-medium drop-shadow mt-0.5 line-clamp-1">
                📍 {result.destination.popularHighlight}
              </p>
            )}
          </div>
        </div>

        {/* Climate & Weather Summary Stats: Ultra-Compact Chips */}
        <div className="p-4 sm:p-5 bg-white/95">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-extrabold text-slate-800">
                Bulan {result.month} ({result.climate.label})
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/70">
                <Thermometer className="w-3 h-3 text-teal-700" />
                <span>{result.climate.min}°C ~ {result.climate.max}°C</span>
              </span>
              <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                <Wind className="w-3 h-3 text-slate-500" />
                <span>Real Feel ~{result.feelsLikeMin}°C</span>
              </span>
            </div>

            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900">
              ❄️ Salju: {result.climate.snowLikelihood}
            </span>
          </div>

          {/* Condition Chips */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="font-bold text-slate-500">Kondisi:</span>
            <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
              {result.climate.condition}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Winter Attire Internal Size Recommendation: Visual Chips */}
      <div className="glass-frost-card rounded-3xl p-5 sm:p-6 shadow-xl border border-white/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
              Rekomendasi Ukuran Resmi Winter Attire
            </h4>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {result.userProfile.gender} • {result.userProfile.height} cm / {result.userProfile.weight} kg
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#0F2537] text-white">
              Size {result.sizeResult.size}
            </span>
          </div>
        </div>

        {/* Compact Fitting Chips Row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Chip 1: Size Jaket */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jaket & Outer</span>
                <span className="text-xs font-black text-slate-900">Size {result.sizeResult.size}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              Akurat 98%
            </span>
          </div>

          {/* Chip 2: Chest & Body Guide */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dimensi Dada</span>
                <span className="text-xs font-bold text-slate-800">{result.sizeResult.shoulderChestGuide}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800">
              Toleransi +5cm
            </span>
          </div>

          {/* Chip 3: Boots Size */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Boots Salju</span>
                <span className="text-xs font-bold text-slate-800">EU {(result.userProfile.shoeSize || 39) + 1}</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Upsize +1
            </span>
          </div>
        </div>

        {/* 🌟 Item Koleksi yang Pas untuk Posturmu (Size X) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-teal-700" />
                <h5 className="text-sm font-extrabold text-slate-900">
                  Item Koleksi yang Pas untuk Posturmu (Size {result.sizeResult.size})
                </h5>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Koleksi jaket, mantel, & perlengkapan yang proporsional dengan profil badanmu.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {bookedMatchingCount > 0 && (
                <button
                  type="button"
                  onClick={() => setHideBookedInAdvisor(!hideBookedInAdvisor)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                    hideBookedInAdvisor
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title="Klik untuk mengubah tampilan item booked"
                >
                  <span className={`w-2 h-2 rounded-full ${hideBookedInAdvisor ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                  <span>{hideBookedInAdvisor ? 'Sembunyikan Booked' : 'Tampilkan Semua'}</span>
                </button>
              )}
              <span className="text-xs text-teal-900 font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 shrink-0">
                {availableMatchingCount} Tersedia {bookedMatchingCount > 0 && !hideBookedInAdvisor && `(${bookedMatchingCount} Booked)`}
              </span>
            </div>
          </div>

          {/* Matching Products Grid: Clean 4-Element Vertical Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {displayedMatchingProducts.slice(0, 6).map(({ dynamicProduct, legacyProduct, code, name, waSize, imageUrl, secondaryUrl, kategori, dailyPrice, availability }, idx) => {
              const inCart = cartItemCodes.includes(code);
              const isBooked = !availability.isAvailable;
              const rental3Days = dynamicProduct?.harga_sewa_3_hari || (dailyPrice * 3);
              const tempBadge = dynamicProduct?.rekomendasi_suhu || '-10°C';

              return (
                <div
                  key={`${code}-${idx}`}
                  className={`rounded-2xl bg-white border border-slate-200 transition-all flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
                    isBooked ? 'opacity-80' : 'hover:border-[#0E7490]/50'
                  }`}
                >
                  <div>
                    {/* 1. FOTO PRODUK (Aspek Rasio Konsisten 4:5, Bersih) */}
                    <div
                      className="aspect-[4/5] w-full bg-slate-100 overflow-hidden relative cursor-pointer group"
                      onClick={() => {
                        if (dynamicProduct) {
                          setSelectedDynamicProduct(dynamicProduct);
                        } else if (legacyProduct) {
                          setDetailProduct(legacyProduct);
                        }
                      }}
                      title="Klik untuk melihat Detail Spek lengkap"
                    >
                      <SafeProductImage
                        src={imageUrl}
                        secondarySrc={secondaryUrl}
                        alt={name}
                        code={code}
                        category={kategori}
                        cacheKey={cacheKey}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Status Badges Overlay */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                        <span className="text-[9.5px] font-mono font-black px-1.5 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
                          {code}
                        </span>
                        {isBooked ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs">
                            Booked
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#0E7490] text-white shadow-xs">
                            Tersedia
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. NAMA PRODUK & BADGE KATEGORI */}
                    <div className="p-2.5 sm:p-3">
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          className="text-[13px] sm:text-sm font-semibold text-[#0F2537] line-clamp-2 cursor-pointer hover:text-[#0E7490] transition leading-snug min-h-[2.4rem] flex-1"
                          onClick={() => {
                            if (dynamicProduct) {
                              setSelectedDynamicProduct(dynamicProduct);
                            } else if (legacyProduct) {
                              setDetailProduct(legacyProduct);
                            }
                          }}
                          title={name}
                        >
                          {name}
                        </h4>
                        <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 border border-slate-200">
                          {kategori?.includes('Extreme') ? 'Extreme' : kategori?.includes('Regular') ? 'Regular' : (kategori || 'Winter')}
                        </span>
                      </div>

                      {/* 3. BADGE SUHU & UKURAN */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/80">
                          ❄️ {tempBadge}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          Size {waSize || 'All'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4. HARGA SEWA TOTAL & TOMBOL "SEWA" */}
                  <div className="p-2.5 sm:p-3 pt-0 space-y-2 mt-1 border-t border-slate-100">
                    <div className="flex items-baseline justify-between gap-1 pt-1.5">
                      <span className="text-[12px] sm:text-[13px] font-bold text-teal-950">
                        {formatRupiah(rental3Days)}
                        <span className="text-[11px] font-normal text-slate-500"> / 3h</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (dynamicProduct) {
                            setSelectedDynamicProduct(dynamicProduct);
                          } else if (legacyProduct) {
                            setDetailProduct(legacyProduct);
                          }
                        }}
                        className="text-[11px] text-teal-800 font-bold hover:underline cursor-pointer"
                      >
                        Detail Spek ↗
                      </button>
                    </div>

                    {isBooked ? (
                      <button
                        disabled
                        className="w-full py-1.5 px-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed text-center"
                      >
                        Tersewa
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart && onAddToCart(dynamicProduct || legacyProduct!)}
                        className={`w-full py-2 px-2.5 rounded-xl text-[13px] transition inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs ${
                          inCart
                            ? 'bg-[#0E7490] hover:bg-[#0c627b] text-white font-semibold'
                            : 'bg-[#0F2537] hover:bg-[#16364f] text-white font-medium'
                        }`}
                      >
                        {inCart ? (
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

          {/* Action Link: Directly Navigate to Catalog with Size Filter */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-teal-900/10 via-teal-800/5 to-slate-100 border border-teal-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0C3B43] text-teal-300 flex items-center justify-center shrink-0 shadow-xs">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900">
                  Lihat Semua Koleksi Size {result.sizeResult.size} di Halaman Katalog
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Tersedia {matchingSizeProducts.length} item koleksi pas untuk posturmu dengan filter kategori, zoom foto resolusi tinggi, dan panduan ukuran penuh.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onGoToCatalog ? onGoToCatalog(result.sizeResult.size) : onGoToCart?.()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0C3B43] via-[#10515B] to-[#0E5C50] hover:opacity-95 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <span>Buka Katalog Size {result.sizeResult.size}</span>
              <ArrowRight className="w-4 h-4 text-teal-300" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Panduan Edukasi 3-Layer Outfit & Aksesori (Integrated Educational Sub-bab) */}
      <div className="glass-frost-card rounded-3xl p-6 sm:p-7 shadow-xl border border-white/90 space-y-4">
        {/* Out of stock / Booked warning for recommended outerwear */}
        {!outerwearAvailability.isAvailable && (
          <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-300 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-rose-900">
                  Perhatian: Jaket {result.outerwear.code} Sudah Tersewa (Booked)
                </div>
                <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                  Jaket rekomendasi <strong>{result.outerwear.name} ({result.outerwear.code})</strong> tidak tersedia pada tanggal <strong>{formatIndoDate(startDate)} s/d {formatIndoDate(endDate)}</strong> karena sedang dipesan pelanggan lain. Silakan pilih jaket alternatif yang masih tersedia di katalog bawah.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-rose-200 text-rose-900 shrink-0">
              Pilih Alternatif Lain
            </span>
          </div>
        )}

        {/* Header 3-Layer Outfit & Aksesori: Ultra-Minimalist & Visual-First */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-700" />
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                Sistem 3-Layer &amp; Aksesori
              </h4>
            </div>
            {/* Visual Category Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                🧥 Layer 3 (Outer)
              </span>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                🦺 Layer 2 (Mid)
              </span>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                👕 Layer 1 (Base)
              </span>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                🧤 Aksesori
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAllLayers}
              className="text-xs font-bold text-teal-800 hover:text-teal-900 underline transition cursor-pointer"
            >
              Pilih Semua
            </button>
            {onAddAllSelectedToCart && (
              <button
                onClick={onAddAllSelectedToCart}
                className="text-xs font-extrabold bg-[#0C3B43] hover:bg-[#10515B] text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Semua ke Keranjang</span>
              </button>
            )}
          </div>
        </div>

        {/* List of 4 layers as Sub-bab with simple ADD TO CART action */}
        <div className="space-y-3">
          {result.layers.map((item, index) => {
            const isSelected = item.selected;
            const isOuter = item.layer === 'outer';
            const layerCode = item.productCode || `L${index + 1}`;
            const inCart = cartItemCodes.includes(layerCode);
            const layerAvailability = item.productCode
              ? checkProductAvailability(item.productCode, startDate, endDate, bookings)
              : { isAvailable: true };
            const isBooked = !layerAvailability.isAvailable;
            const tripDays = item.durationDays || 9;
            const calculatedTotal = item.rentalFee || (item.dailyPrice * tripDays);

            return (
              <div
                key={item.id ? `${item.id}-${index}` : `layer-${item.layer}-${index}`}
                className={`transition-all duration-200 rounded-2xl p-4 sm:p-5 border select-none ${
                  isBooked
                    ? 'border-rose-300 bg-rose-50/20'
                    : isSelected
                    ? isOuter
                      ? 'glass-frost-card border-l-4 border-l-teal-600 border-teal-300 shadow-md ring-1 ring-teal-500/20'
                      : 'glass-frost-card border-l-4 border-l-emerald-500 border-slate-200 shadow-xs'
                    : 'bg-white/60 border-slate-200 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Toggle Checkbox */}
                    <div
                      onClick={() => {
                        if (isBooked) return;
                        onToggleLayer(item.id);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 mt-0.5 border ${
                        isBooked
                          ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                          : isSelected
                          ? 'bg-teal-700 text-white border-teal-700 cursor-pointer'
                          : 'bg-white border-slate-300 text-transparent cursor-pointer'
                      }`}
                      title={isBooked ? 'Item sudah ter-booking di tanggal ini' : 'Pilih layer ini'}
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </div>

                    {/* Product Photo Thumbnail */}
                    {item.imageUrl && (
                      <div
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative cursor-pointer group shadow-2xs"
                        onClick={() => {
                          const matchedDynamic =
                            catalogProducts?.find((p) => p.kode_produk === item.productCode) ||
                            item.dynamicProduct;
                          if (matchedDynamic) {
                            setSelectedDynamicProduct(matchedDynamic);
                          }
                        }}
                        title="Klik untuk melihat foto resolusi tinggi & spek lengkap"
                      >
                        <SafeProductImage
                          src={item.imageUrl}
                          secondarySrc={item.secondaryUrl}
                          alt={item.productName}
                          code={item.productCode}
                          category={item.categoryLabel}
                          cacheKey={cacheKey}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.weightGram && (
                          <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[8.5px] font-bold px-1.5 py-0.2 rounded z-10">
                            {item.weightGram}g
                          </span>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isOuter
                              ? 'bg-teal-100 text-teal-900 font-bold'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.subtitle}
                        </span>

                        {item.tag && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                            {item.tag}
                          </span>
                        )}

                        {item.productCode && (
                          <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                            Kode: {item.productCode}
                          </span>
                        )}

                        {item.productCode && (
                          isBooked ? (
                            <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                              <span>Sudah Tersewa / Booked</span>
                            </span>
                          ) : (
                            <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              <span>Tersedia</span>
                            </span>
                          )
                        )}
                      </div>

                      <h5
                        className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 cursor-pointer hover:text-teal-800 transition"
                        onClick={() => {
                          const matchedDynamic =
                            catalogProducts?.find((p) => p.kode_produk === item.productCode) ||
                            item.dynamicProduct;
                          if (matchedDynamic) {
                            setSelectedDynamicProduct(matchedDynamic);
                          }
                        }}
                      >
                        {item.productName}
                      </h5>

                      {/* Visual Chips for Layer Specs */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                        {item.layer === 'outer' && (
                          <>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/80">
                              🛡️ Windproof &amp; Waterproof
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800">
                              ❄️ {item.tempRange || '-14°C'}
                            </span>
                          </>
                        )}
                        {item.layer === 'mid' && (
                          <>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80">
                              🦺 Core Warmth
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Insulated Layer
                            </span>
                          </>
                        )}
                        {item.layer === 'base' && (
                          <>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                              🧺 Moisture Wicking
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Ultra Warm Set
                            </span>
                          </>
                        )}
                        {item.layer === 'accessory' && (
                          <>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/80">
                              🧤 Waterproof Ski
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Polar Beanie
                            </span>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const matchedDynamic =
                              catalogProducts?.find((p) => p.kode_produk === item.productCode) ||
                              item.dynamicProduct;
                            if (matchedDynamic) {
                              setSelectedDynamicProduct(matchedDynamic);
                            }
                          }}
                          className="text-[10px] text-teal-800 font-bold hover:underline cursor-pointer ml-1"
                        >
                          Detail Spek ↗
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Accurate Tiered Price Calculation */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2.5 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-semibold text-slate-500">
                        Total Sewa ({tripDays} Hari):
                      </div>
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        {formatRupiah(calculatedTotal)}
                      </div>
                      <div className="text-[10.5px] text-teal-800 font-bold mt-0.5 flex items-center sm:justify-end gap-1 flex-wrap">
                        {item.rental3Days ? (
                          <span>Mulai {formatRupiah(item.rental3Days)} (3h)</span>
                        ) : null}
                      </div>
                    </div>

                    {isBooked ? (
                      <button
                        disabled
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      >
                        Sudah Tersewa
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddLayerToCart && onAddLayerToCart(item)}
                        className={`px-3.5 py-2 rounded-xl text-[13px] transition inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs ${
                          inCart
                            ? 'bg-[#0E7490] hover:bg-[#0c627b] text-white font-semibold'
                            : 'bg-[#0F2537] hover:bg-[#16364f] text-white font-medium'
                        }`}
                      >
                        {inCart ? (
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
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Action Banner: Ringkasan & Checkout WhatsApp */}
      <div className="glass-frost-card rounded-3xl p-5 sm:p-6 shadow-xl border border-teal-200/80 bg-gradient-to-br from-white via-white to-teal-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Sewa &amp; Booking Form</span>
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">🧺 Laundry Included</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">❄️ Tested -30°C</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">🛡️ Deposit Refundable</span>
            </div>
          </div>

          <div className="bg-teal-50 px-3.5 py-1.5 rounded-xl border border-teal-200 text-left sm:text-right shrink-0">
            <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block">
              Item Terpilih
            </span>
            <span className="text-base font-black text-teal-950">
              {result.layers.filter((l) => l.selected).length} Layer Dipilih
            </span>
          </div>
        </div>

        {/* Checkbox Persetujuan T&C Sebelum Checkout (Mandatory Requirement) */}
        <div className="pt-4 pb-1">
          <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200">
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

        {/* Action Buttons Grid */}
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Primary Action: Direct Rental via WhatsApp Booking Form */}
            <button
              onClick={() => {
                if (!agreedToTerms) {
                  alert('Mohon centang persetujuan T&C Sewa terlebih dahulu.');
                  return;
                }
                const selectedLayers = result.layers.filter((l) => l.selected);
                const selectedCodes = selectedLayers.map((l) => l.productCode || l.title);
                const rentalTotal = selectedLayers.reduce(
                  (acc, l) => acc + (l.rentalFee || (l.dailyPrice * (l.durationDays || 9))),
                  0
                );
                const depositTotal = selectedLayers.reduce(
                  (acc, l) => acc + (l.layer === 'outer' ? 500000 : 200000),
                  0
                );

                setBookingModalData({
                  destination: `${result.destination.name}, ${result.destination.country}`,
                  productCodes: selectedCodes.length > 0 ? selectedCodes : [result.outerwear.code],
                  productNames: selectedLayers.map((l) => l.productName),
                  durationDays: result.layers[0]?.durationDays || 9,
                  startDate: startDate,
                  endDate: endDate,
                  rentalFee: rentalTotal,
                  depositFee: depositTotal
                });
                setIsBookingModalOpen(true);
              }}
              disabled={!agreedToTerms}
              className={`w-full py-3.5 px-4 rounded-2xl font-black transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-md ${
                agreedToTerms
                  ? 'bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:from-[#20bd5a] hover:to-[#17a54e] text-white shadow-emerald-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.073.043.419-.101.824z" />
              </svg>
              <span>Sewa via WhatsApp (Booking Form)</span>
            </button>

            {/* Go to Cart */}
            {onGoToCart && (
              <button
                onClick={onGoToCart}
                className="w-full bg-[#0C3B43] hover:bg-[#10515B] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-teal-300" />
                <span>Buka Keranjang ({cartItemCodes.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* WA Consultation Button */}
            <button
              onClick={handleOpenWhatsApp}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3.5 px-4 rounded-2xl border border-slate-300 transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <span>Konsultasi Sizing & Cuaca</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Secondary Action: Copy Draft Text & Preview */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleCopyDraft}
              className="text-xs font-bold text-slate-700 hover:text-teal-800 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{copied ? '✓ Format Chat Berhasil Disalin!' : 'Salin Format Pesan Konsultasi'}</span>
            </button>

            <button
              onClick={() => setShowDraftPreview(!showDraftPreview)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer"
            >
              {showDraftPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showDraftPreview ? 'Sembunyikan Draf' : 'Lihat Isi Pesan Konsultasi'}</span>
            </button>
          </div>

          {/* Expandable preview */}
          {showDraftPreview && (
            <div className="mt-3 bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800">
              {getWhatsAppConsultationMessage()}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Product Spec Detail Modal */}
      <ProductSpecDetailModal
        product={selectedDynamicProduct}
        onClose={() => setSelectedDynamicProduct(null)}
        onAddToCart={(prod) => onAddToCart && onAddToCart(prod)}
        onViewCart={onGoToCart}
        isInCart={selectedDynamicProduct ? cartItemCodes.includes(selectedDynamicProduct.kode_produk) : false}
        isAvailable={
          selectedDynamicProduct
            ? checkProductAvailability(selectedDynamicProduct.kode_produk, startDate, endDate, bookings).isAvailable
            : true
        }
        startDate={startDate}
        endDate={endDate}
        cacheKey={cacheKey}
      />

      {/* Legacy Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={onAddToCart}
        onViewCart={onGoToCart}
        isInCart={detailProduct ? cartItemCodes.includes(detailProduct.code) : false}
        isAvailable={detailProduct ? checkProductAvailability(detailProduct.code, startDate, endDate, bookings).isAvailable : true}
        startDate={startDate}
        endDate={endDate}
        conflictingBooking={detailProduct ? checkProductAvailability(detailProduct.code, startDate, endDate, bookings).conflictingBooking : undefined}
      />

      {/* Official Booking Form Modal */}
      {bookingModalData && (
        <BookingFormModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          bookingData={bookingModalData}
          onOpenTermsModal={() => {
            if (onOpenTermsModal) {
              onOpenTermsModal('howToRent');
            } else {
              setIsTermsModalOpen(true);
            }
          }}
        />
      )}

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        initialTab="howToRent"
      />
    </div>
  );
};
