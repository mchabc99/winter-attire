import React from 'react';
import { CatalogProduct } from '../data/productCatalog';
import { BookingRecord } from '../types';
import { formatIndoDate } from '../services/availabilityService';
import { SafeProductImage } from './SafeProductImage';
import {
  X,
  Check,
  ShieldCheck,
  Scale,
  Ruler,
  Sparkles,
  Wind,
  Droplets,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ProductDetailModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
  onSelectForRental?: (product: CatalogProduct) => void;
  onAddToCart?: (product: CatalogProduct) => void;
  onViewCart?: () => void;
  isInCart?: boolean;
  isAvailable?: boolean;
  startDate?: string;
  endDate?: string;
  conflictingBooking?: BookingRecord;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectForRental,
  onAddToCart,
  onViewCart,
  isInCart = false,
  isAvailable = true,
  startDate,
  endDate,
  conflictingBooking
}) => {
  if (!product) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-frost-card rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-white/90">
        {/* Header with WA Logo and Code */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="wa-badge-cyan text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Code = {product.code}
                </span>
                <span className="text-xs font-bold text-slate-500">{product.categoryLabel}</span>
                {isAvailable ? (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Tersedia</span>
                  </span>
                ) : (
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    <span>Sudah Tersewa / Booked</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {product.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5">
          {/* Photo Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video sm:aspect-21/9 shadow-inner">
            <SafeProductImage
              src={product.imageUrl}
              alt={product.name}
              category={product.categoryLabel}
              code={product.code}
              objectFit="cover"
              showOriginalLink={true}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 wa-badge-rose text-xs font-bold px-3 py-1 rounded-full shadow-xs pointer-events-none">
              Kode: {product.code}
            </div>
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">
              Warna: {product.color}
            </div>
          </div>

          {/* Product Information Table (Identical to PDF specification slides) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                PRODUCT INFORMATION:
              </h4>
              <span className="text-[11px] font-semibold text-sky-700">Standar Pengukuran Asli</span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider w-1/2">
                      BERAT (gram)
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900">
                      {product.weightGram} gram
                    </td>
                  </tr>

                  {product.lengthCm && (
                    <tr className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                        PANJANG (cm)
                      </td>
                      <td className="py-2.5 px-4 font-black text-slate-900">
                        {product.lengthCm} cm
                      </td>
                    </tr>
                  )}

                  {product.pantsLengthCm && (
                    <tr className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                        PANJANG CELANA (cm)
                      </td>
                      <td className="py-2.5 px-4 font-black text-slate-900">
                        {product.pantsLengthCm} cm
                      </td>
                    </tr>
                  )}

                  {product.chestMaxCm && (
                    <tr className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                        LINGKAR DADA max (cm)
                      </td>
                      <td className="py-2.5 px-4 font-black text-slate-900">
                        {product.chestMaxCm} cm
                      </td>
                    </tr>
                  )}

                  {product.waistMaxCm && (
                    <tr className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                        LINGKAR PINGGANG max (cm)
                      </td>
                      <td className="py-2.5 px-4 font-black text-slate-900">
                        {product.waistMaxCm} cm
                      </td>
                    </tr>
                  )}

                  {product.shoeSize && (
                    <tr className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                        UKURAN SEPATU
                      </td>
                      <td className="py-2.5 px-4 font-black text-slate-900">
                        Size {product.shoeSize}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Special Features & WA Size Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
              <span className="text-[11px] uppercase font-black tracking-wider text-sky-800 block mb-2">
                Special Features:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {product.specialFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7EFF4] border border-[#E8D4E2]">
              <span className="text-[11px] uppercase font-black tracking-wider text-[#582A4D] block mb-1">
                Winter Attire Size:
              </span>
              <div className="text-base font-black text-slate-900 mt-1">
                • {product.waSize}
              </div>
              <div className="text-[11px] text-slate-600 mt-2">
                <strong>Uji Lapangan:</strong> {product.testedFor}
              </div>
              <div className="text-[11px] text-sky-800 font-semibold mt-1">
                Suhu Ideal: {product.tempSuitability}
              </div>
            </div>
          </div>

          {/* Availability Collision Notice */}
          {!isAvailable && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-950">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-rose-900">
                  Item Sudah Tersewa / Booked
                </strong>
                <span className="text-slate-700">
                  Produk ini sedang disewa untuk rentang tanggal tersebut
                  {conflictingBooking ? (
                    <>
                      {' '}
                      (Booking: <strong>{formatIndoDate(conflictingBooking.startDate)} s/d {formatIndoDate(conflictingBooking.endDate)}</strong>
                      {conflictingBooking.notes ? ` - ${conflictingBooking.notes}` : ''})
                    </>
                  ) : ''}.
                  {' '}Tombol sewa dinonaktifkan sementara. Silakan pilih tanggal lain atau item alternatif.
                </span>
              </div>
            </div>
          )}

          {/* Pricing & Deposit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200">
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase">Biaya Sewa</div>
              <div className="text-xl font-black text-slate-900">
                {formatRupiah(product.dailyPrice)} <span className="text-xs font-normal text-slate-500">/ hari</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Estimasi Deposit: <strong>{product.depositRange}</strong> (refundable)
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {onAddToCart && (
                <button
                  type="button"
                  onClick={() => isAvailable && onAddToCart(product)}
                  disabled={!isAvailable}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[13px] transition inline-flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs ${
                    !isAvailable
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : isInCart
                      ? 'bg-[#0E7490] hover:bg-[#0c627b] text-white font-semibold cursor-pointer'
                      : 'bg-[#0F2537] hover:bg-[#16364f] text-white font-medium cursor-pointer'
                  }`}
                >
                  {!isAvailable ? (
                    <span>Sudah Tersewa</span>
                  ) : isInCart ? (
                    <>
                      <Check className="w-4 h-4 shrink-0 text-white" />
                      <span>Terpilih</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 shrink-0 text-teal-300" />
                      <span>+ Tambah ke Keranjang</span>
                    </>
                  )}
                </button>
              )}
              {onSelectForRental && isAvailable && (
                <button
                  onClick={() => {
                    onSelectForRental(product);
                    onClose();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition cursor-pointer"
                >
                  Pilih ke Advisor
                </button>
              )}
              {isInCart && onViewCart && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewCart();
                  }}
                  className="px-4 py-2.5 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buka Keranjang</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
