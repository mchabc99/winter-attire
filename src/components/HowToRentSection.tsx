import React from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowRight,
  Sparkles,
  CalendarCheck
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HowToRentSectionProps {
  onGoToCart?: () => void;
  onGoToCatalog?: () => void;
}

export const HowToRentSection: React.FC<HowToRentSectionProps> = ({
  onGoToCart,
  onGoToCatalog
}) => {
  return (
    <section id="howToRentSection" className="my-12">
      <div className="glass-frost-card rounded-3xl p-6 sm:p-8 shadow-xl border border-white/90">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <span className="wa-badge-aurora text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Panduan Resmi
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Cara Sewa & Syarat Ketentuan
              </h3>
            </div>
          </div>
          {onGoToCart && (
            <button
              onClick={onGoToCart}
              className="text-xs font-black bg-teal-800 hover:bg-teal-900 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-teal-300" />
              <span>Buka Menu Keranjang</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
            </button>
          )}
        </div>

        {/* 4 Steps How To Rent */}
        <div className="mt-8">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
            4 Langkah Mudah Menyewa (How To Rent)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-900 text-xs font-black flex items-center justify-center mb-3">
                1
              </span>
              <h5 className="text-sm font-extrabold text-slate-900">Cek Katalog & Ukuran</h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pilih produk outerwear, boots, atau aksesoris sesuai preferensi gaya & suhu destinasi. Cek panduan ukuran lingkar dada & panjang badan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-900 text-xs font-black flex items-center justify-center mb-3">
                2
              </span>
              <h5 className="text-sm font-extrabold text-slate-900">Masukkan ke Keranjang</h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Klik <strong>+ Tambah ke Keranjang</strong> pada produk pilihan Anda. Tentukan tanggal mulai & selesai sewa agar tarif berjenjang terhitung otomatis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-900 text-xs font-black flex items-center justify-center mb-3">
                3
              </span>
              <h5 className="text-sm font-extrabold text-slate-900">Checkout di Menu Keranjang</h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Buka menu <strong>Keranjang Sewa</strong> untuk meninjau rincian biaya sewa, estimasi deposit garansi, dan mengisi identitas pemesan langsung dengan praktis.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-900 text-xs font-black flex items-center justify-center mb-3">
                4
              </span>
              <h5 className="text-sm font-extrabold text-slate-900">Enjoy & Pengembalian</h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pelunasan via transfer, pengiriman via GO-SEND atau JNE YES kilat. Nikmati liburan hangat dan kembalikan tanpa perlu dicuci (Free Laundry)!
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column: Keranjang Checkout Information & T&C Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Focused Cart Checkout Guidance */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#0C3B43] via-[#10515B] to-slate-950 text-white p-6 sm:p-7 rounded-3xl border border-teal-600/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 uppercase tracking-wider">
                    Sistem Pemesanan Terintegrasi
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
                    Check Out Langsung via Menu Keranjang
                  </h4>
                </div>
              </div>

              <p className="text-xs text-teal-100/90 leading-relaxed">
                Pemesanan sewa kini jauh lebih mudah dan otomatis! Anda tidak perlu lagi menyusun atau menyalin format booking form secara manual. Semua proses sewa telah disatukan di menu <strong>Keranjang</strong>:
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 border border-white/10">
                  <CalendarCheck className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-white block">Kalkulasi Tarif Sewa Berjenjang Otomatis</strong>
                    <span className="text-[11px] text-teal-100/80 leading-relaxed block mt-0.5">
                      Tarif rental otomatis menyesuaikan durasi sewa (3-4 hari, 5-7 hari, 8-10 hari, dst.) sesuai tanggal berangkat dan pulang Anda.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-white block">Total Deposit Garansi Terbuka & Transparan</strong>
                    <span className="text-[11px] text-teal-100/80 leading-relaxed block mt-0.5">
                      Jumlah deposit garansi (refundable H+7 setelah barang kembali) langsung terakumulasi rapi tanpa ada biaya tersembunyi.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-white block">Rincian Lengkap Sekali Klik</strong>
                    <span className="text-[11px] text-teal-100/80 leading-relaxed block mt-0.5">
                      Rincian produk, ukuran, tanggal sewa, dan data identitas pemesan langsung terformat sempurna siap dikirim ke Admin.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6">
              {onGoToCart ? (
                <button
                  onClick={onGoToCart}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buka Menu Keranjang untuk Check Out</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : onGoToCatalog ? (
                <button
                  onClick={onGoToCatalog}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pilih Produk di Katalog & Tambah ke Keranjang</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-center text-xs text-teal-200">
                  Silakan pilih produk favorit di Katalog dan klik <strong>+ Tambah ke Keranjang</strong> untuk checkout.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: T&C + Deposit Terms */}
          <div className="lg:col-span-6 space-y-3 flex flex-col justify-between">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ketentuan Deposit (Refundable 100%)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                • Produk Regular: <strong>Rp 200.000 - Rp 500.000</strong> per item. <br />
                • Produk Premium Extreme: <strong>Rp 500.000 - Rp 1.000.000</strong> per item. <br />
                • Deposit dikembalikan utuh 100% maksimal <strong>H+7</strong> dari tanggal barang
                diterima kembali tanpa kerusakan / kehilangan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Pengukuran Mandiri & No Refund</span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Panduan ukuran tersedia lengkap di setiap katalog produk. Harap mengukur dengan
                teliti di rumah sebelum booking karena barang yang telah dipesan tidak dapat
                ditukar/dikembalikan jika kekecilan/kebesaran.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-700" />
                <span>Pengiriman & Pengembalian</span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                • <strong>Area Jakarta:</strong> Pick Up langsung oleh penyewa atau via kurir instan GO-SEND.<br />
                • <strong>Luar Jakarta:</strong> Ekspedisi JNE YES kilat (ongkir ditanggung penyewa).<br />
                • <strong>Free Laundry:</strong> Anda tidak perlu mencuci baju saat mengembalikan!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
