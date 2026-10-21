import React, { useState } from 'react';
import {
  DynamicCatalogProduct,
  calculateTieredRentalPrice
} from '../services/catalogService';
import { BookingRecord } from '../types';
import { formatIndoDate } from '../services/availabilityService';
import { SafeProductImage } from './SafeProductImage';
import {
  X,
  ShieldCheck,
  Ruler,
  Scale,
  Sparkles,
  ShoppingBag,
  Check,
  Calendar,
  AlertCircle,
  Clock,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BookingFormModal, BookingFormDetails } from './BookingFormModal';
import { TermsAndConditionsModal } from './TermsAndConditionsModal';

interface ProductSpecDetailModalProps {
  product: DynamicCatalogProduct | null;
  onClose: () => void;
  onAddToCart?: (product: DynamicCatalogProduct) => void;
  onViewCart?: () => void;
  isInCart?: boolean;
  isAvailable?: boolean;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  conflictingBooking?: BookingRecord;
  cacheKey?: string | number;
}

export const ProductSpecDetailModal: React.FC<ProductSpecDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewCart,
  isInCart = false,
  isAvailable = true,
  startDate,
  endDate,
  durationDays = 9,
  conflictingBooking,
  cacheKey
}) => {
  const [activePhotoTab, setActivePhotoTab] = useState<'spek' | 'produk'>('spek');
  const [imageError, setImageError] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  if (!product) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const pricing = calculateTieredRentalPrice(product, durationDays);

  const tierRows = [
    { label: '1 - 3 Hari', days: 3, price: product.harga_sewa_3_hari },
    { label: '4 - 6 Hari', days: 6, price: product.harga_sewa_6_hari },
    { label: '7 - 9 Hari', days: 9, price: product.harga_sewa_9_hari },
    { label: '10 - 12 Hari', days: 12, price: product.harga_sewa_12_hari },
    { label: '13 - 15 Hari', days: 15, price: product.harga_sewa_15_hari },
    { label: '16 - 18 Hari', days: 18, price: product.harga_sewa_18_hari },
    { label: '19 - 21 Hari', days: 21, price: product.harga_sewa_21_hari },
    { label: '22 - 24 Hari', days: 24, price: product.harga_sewa_24_hari }
  ];

  const currentPhotoUrl = activePhotoTab === 'spek'
    ? (product.link_foto_spek || product.link_foto_produk)
    : (product.link_foto_produk || product.link_foto_spek);

  const secondaryPhotoUrl = activePhotoTab === 'spek'
    ? (product.link_foto_produk || product.link_foto_spek)
    : (product.link_foto_spek || product.link_foto_produk);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-frost-card rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-white/90">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="wa-badge-cyan text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Code = {product.kode_produk}
                </span>
                <span className="text-xs font-bold text-slate-500">{product.kategori}</span>
                {isAvailable ? (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Tersedia</span>
                  </span>
                ) : (
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    <span>Sudah Tersewa</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                {product.nama_produk}
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

        {/* Media & Specification Photo Section */}
        <div className="mt-5 space-y-5">
          {/* Photo Switcher Tabs */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActivePhotoTab('spek');
                  setImageError(false);
                }}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                  activePhotoTab === 'spek'
                    ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Foto Spek & Slide Ukuran</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePhotoTab('produk');
                  setImageError(false);
                }}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                  activePhotoTab === 'produk'
                    ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Foto Produk</span>
              </button>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              Warna: <strong className="text-slate-800">{product.warna}</strong>
            </span>
          </div>

          {/* Photo Display */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video sm:aspect-21/9 shadow-inner flex items-center justify-center">
            {currentPhotoUrl ? (
              <SafeProductImage
                src={currentPhotoUrl}
                secondarySrc={secondaryPhotoUrl}
                alt={`${product.nama_produk} - ${activePhotoTab}`}
                category={product.kategori}
                code={product.kode_produk}
                objectFit="contain"
                showOriginalLink={false}
                cacheKey={cacheKey}
                className="w-full h-full object-contain bg-slate-900/5"
              />
            ) : (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 stroke-[1.2] text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">
                  {activePhotoTab === 'spek' ? 'Foto spesifikasi belum tersedia' : 'Foto produk belum tersedia'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Foto sedang disiapkan oleh tim Winter Attire
                </p>
              </div>
            )}
            <div className="absolute top-3 left-3 wa-badge-rose text-xs font-bold px-3 py-1 rounded-full shadow-xs pointer-events-none">
              Kode: {product.kode_produk}
            </div>
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">
              Size WA: {product.size_wa}
            </div>
          </div>

          {/* Physical Measurements Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-teal-700" />
                <span>Rincian Lengkap Dimensi & Spesifikasi:</span>
              </h4>
              <span className="text-[11px] font-semibold text-teal-700">Toleransi fitting +4-6 cm</span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider w-1/2">
                      Lingkar Dada Max (LD Max)
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900">
                      {product.lingkar_dada_max_cm} cm
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                      Lingkar Pinggang Max (LP Max)
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900">
                      {product.lingkar_pinggang_max_cm} cm
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                      Panjang Baju / Jaket
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900">
                      {product.panjang_cm} cm
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                      Berat Bersih Jaket
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900">
                      {product.berat_gram} gram
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                      Rekomendasi Suhu Ekstrem
                    </td>
                    <td className="py-2.5 px-4 font-black text-sky-800">
                      {product.rekomendasi_suhu}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                      Fitur Proteksi & Material
                    </td>
                    <td className="py-2.5 px-4 text-slate-800 font-medium">
                      {product.fitur_spesial}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic Rental Tiering Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Tiering Tarif Sewa Berdasarkan Durasi:</span>
              </h4>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Pilihan Anda: {durationDays} Hari
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 text-center">
                {tierRows.slice(0, 4).map((t) => {
                  const isActive = pricing.tierDays === t.days;
                  return (
                    <div
                      key={t.days}
                      className={`p-3 transition ${
                        isActive
                          ? 'bg-teal-50/90 border-2 border-teal-600 font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">
                        {t.label}
                      </span>
                      <strong className={`text-xs sm:text-sm block mt-0.5 ${isActive ? 'text-teal-900 font-black' : 'text-slate-900'}`}>
                        {formatRupiah(t.price)}
                      </strong>
                      {isActive && (
                        <span className="text-[9px] bg-teal-700 text-white font-black px-1.5 py-0.5 rounded-sm mt-1 inline-block">
                          Aktif Digunakan
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-t border-slate-100 text-center">
                {tierRows.slice(4, 8).map((t) => {
                  const isActive = pricing.tierDays === t.days;
                  return (
                    <div
                      key={t.days}
                      className={`p-3 transition ${
                        isActive
                          ? 'bg-teal-50/90 border-2 border-teal-600 font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">
                        {t.label}
                      </span>
                      <strong className={`text-xs sm:text-sm block mt-0.5 ${isActive ? 'text-teal-900 font-black' : 'text-slate-900'}`}>
                        {formatRupiah(t.price)}
                      </strong>
                      {isActive && (
                        <span className="text-[9px] bg-teal-700 text-white font-black px-1.5 py-0.5 rounded-sm mt-1 inline-block">
                          Aktif Digunakan
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Rental Calculation Box (Requirement 4) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-sky-50/80 border border-teal-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Kalkulasi Transparan Pembayaran Awal</span>
              </span>
              <span className="text-xs text-slate-500">
                Durasi: <strong>{durationDays} Hari</strong> ({pricing.tierLabel})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Subtotal Biaya Sewa:</span>
                <strong className="text-base text-slate-900 block mt-0.5">
                  {formatRupiah(pricing.rentalFee)}
                </strong>
                <span className="text-[10px] text-slate-400">Sesuai tiering {pricing.tierDays} hari</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Deposit (Refundable):</span>
                <strong className="text-base text-teal-800 block mt-0.5">
                  {formatRupiah(pricing.depositFee)}
                </strong>
                <span className="text-[10px] text-emerald-600 font-medium">Dikembalikan utuh 100%</span>
              </div>

              <div className="p-3 bg-teal-800 text-white rounded-xl border border-teal-900 shadow-xs">
                <span className="text-teal-200 block text-[11px] font-bold">Total Pembayaran Awal:</span>
                <strong className="text-lg text-white block mt-0.5 font-black">
                  {formatRupiah(pricing.totalInitialPayment)}
                </strong>
                <span className="text-[10px] text-teal-200">[Sewa] + [Deposit]</span>
              </div>
            </div>
          </div>

          {/* Availability Notice */}
          {!isAvailable && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-950">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-rose-900">
                  Item Sudah Tersewa / Booked
                </strong>
                <span className="text-slate-700">
                  Produk ini sedang dibooking pada rentang tanggal sewa yang Anda pilih
                  {conflictingBooking ? (
                    <>
                      {' '}
                      (Booking: <strong>{formatIndoDate(conflictingBooking.startDate)} s/d {formatIndoDate(conflictingBooking.endDate)}</strong>)
                    </>
                  ) : ''}.
                  Silakan pilih alternatif jaket lain yang tersedia atau ubah rentang tanggal sewa.
                </span>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Total Pembayaran Awal</span>
              <div className="text-xl font-black text-slate-900">
                {formatRupiah(pricing.totalInitialPayment)}
                <span className="text-xs font-normal text-slate-500 ml-1">
                  (Sewa: {formatRupiah(pricing.rentalFee)} + Deposit: {formatRupiah(pricing.depositFee)})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Direct WhatsApp Rental Button (Opens Official Booking Form) */}
              {isAvailable && (
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  title="Pesan sewa item ini langsung melalui chat WhatsApp"
                >
                  <span>Sewa via WhatsApp ↗</span>
                </button>
              )}

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
                      <span>Sewa</span>
                    </>
                  )}
                </button>
              )}

              {isInCart && onViewCart && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewCart();
                  }}
                  className="px-4 py-2.5 rounded-xl font-extrabold text-xs bg-[#0F2537] hover:bg-[#1a3850] text-white transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Buka Keranjang ({durationDays}h)</span>
                </button>
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
          destination: 'Destinasi Musim Dingin',
          productCodes: [product.kode_produk],
          productNames: [product.nama_produk],
          durationDays: durationDays,
          startDate: startDate,
          endDate: endDate,
          rentalFee: pricing.rentalFee,
          depositFee: pricing.depositFee
        }}
        onOpenTermsModal={() => setIsTermsModalOpen(true)}
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
