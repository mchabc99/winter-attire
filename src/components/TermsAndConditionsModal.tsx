import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export type TermsModalTab = 'howToRent' | 'deposit' | 'cancellation';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: TermsModalTab;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'howToRent'
}) => {
  const [activeTab, setActiveTab] = useState<TermsModalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#93A4EB] via-[#72BCE7] via-[#5CCFBE] to-[#4FD37C]" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full inline-block">
                Informasi Operasional Resmi
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
                Cara Sewa & Syarat Ketentuan (T&C)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer shrink-0"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Controls (Anti-slop clean segmented buttons) */}
        <div className="px-5 sm:px-6 pt-3 bg-slate-50/70 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('howToRent')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'howToRent'
                  ? 'bg-[#0C3B43] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-teal-900 border border-slate-200/70'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Cara Sewa (How to Rent)</span>
            </button>

            <button
              onClick={() => setActiveTab('deposit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'deposit'
                  ? 'bg-[#0C3B43] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-teal-900 border border-slate-200/70'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. T&C Deposit & Refund</span>
            </button>

            <button
              onClick={() => setActiveTab('cancellation')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'cancellation'
                  ? 'bg-[#0C3B43] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-teal-900 border border-slate-200/70'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>3. Pembatalan & Logistik</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
          {/* TAB 1: CARA SEWA */}
          {activeTab === 'howToRent' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-xs text-teal-900">
                    Proses Praktis & Transparan di Winter Attire
                  </strong>
                  <span className="text-[11.5px] text-teal-800 leading-relaxed">
                    Sewa perlengkapan musim dingin premium dengan 4 langkah mudah tanpa ribet datang ke toko.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-900 font-black text-xs flex items-center justify-center">
                        1
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Eksplorasi
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Cek Katalog Produk & Ukuran
                    </h4>
                    <p className="text-slate-600 mt-1 text-[11.5px] leading-relaxed">
                      Pilih produk jaket, mantel, vest, atau perlengkapan salju sesuai preferensi & suhu destinasi liburanmu.
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-teal-800 bg-teal-50/70 p-2 rounded-xl">
                      💡 <em>Ukur badan secara mandiri di rumah</em> (lingkar dada, panjang badan, berat badan) sesuai spek di web.
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-900 font-black text-xs flex items-center justify-center">
                        2
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Verifikasi
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Booking via Admin WhatsApp
                    </h4>
                    <p className="text-slate-600 mt-1 text-[11.5px] leading-relaxed">
                      Kirim kode produk terpilih beserta tanggal sewa ke Admin WhatsApp menggunakan format resmi otomatis di aplikasi ini.
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200/60">
                      ⚠️ <strong>Wajib:</strong> Melampirkan foto KTP atau SIM asli yang masih berlaku sebagai verifikasi identitas penyewa.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-900 font-black text-xs flex items-center justify-center">
                        3
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Pelunasan
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Pembayaran 100% di Awal
                    </h4>
                    <p className="text-slate-600 mt-1 text-[11.5px] leading-relaxed">
                      Lakukan transfer pembayaran penuh <strong>[Biaya Sewa] + [Nilai Deposit Garansi]</strong> di muka.
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-teal-900 bg-teal-50/70 p-2 rounded-xl">
                      ⚡ <strong>Prinsip:</strong> First pay = First serve (tidak ada sistem keep produk sebelum pembayaran lunas diverifikasi).
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-900 font-black text-xs flex items-center justify-center">
                        4
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Selesai
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Enjoy & Return (Pengembalian)
                    </h4>
                    <p className="text-slate-600 mt-1 text-[11.5px] leading-relaxed">
                      Nikmati liburan musim dingin dengan hangat dan penuh gaya. Kembalikan unit setelah masa sewa berakhir.
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200/60">
                      ✨ <strong>Free Laundry:</strong> Penyewa <em>TIDAK PERLU mencuci jaket</em> (biaya sewa sudah termasuk cuci higienis profesional).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEPOSIT & REFUND */}
          {activeTab === 'deposit' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0C3B43] text-white">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                  Ketentuan Uang Jaminan (Refundable 100%)
                </span>
                <h4 className="text-sm sm:text-base font-black text-white mt-1">
                  Nilai Deposit Berdasarkan Kategori Item di Katalog
                </h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-teal-300 font-bold block text-xs">Produk Regular / Standard</span>
                    <strong className="text-sm font-black text-white block mt-0.5">
                      Rp 200.000 – Rp 500.000 / item
                    </strong>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      Berlaku untuk vest, fleece, boots, aksesoris, & jaket winter kasual.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-amber-300 font-bold block text-xs">Produk Premium / Heavy Extreme</span>
                    <strong className="text-sm font-black text-white block mt-0.5">
                      Rp 500.000 – Rp 5.000.000 / item
                    </strong>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      Berlaku untuk down parka tebal, jaket ski waterproof, brand luxury & ekspedisi kutub.
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-teal-200/90 mt-2.5 font-medium">
                  *Nominal deposit spesifik ditentukan per item di sistem katalog resmi spreadsheet.
                </div>
              </div>

              {/* Ketentuan Pengembalian Deposit */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Mekanisme Transfer Pengembalian Deposit (Maksimal H+7)
                  </h4>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Uang deposit ditransfer kembali ke rekening bank penyewa <strong>maksimal H+7</strong> setelah seluruh barang sewaan diterima kembali oleh pihak Winter Attire dan selesai diinspeksi dengan ketentuan:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold text-emerald-950 block">Normal & Lengkap</strong>
                      <span className="text-[11px] text-emerald-800">
                        Deposit dikembalikan utuh <strong>100%</strong> tanpa potongan apapun.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold text-amber-950 block">Kerusakan / Sobek / Noda Permanen</strong>
                      <span className="text-[11px] text-amber-800">
                        Dipotong biaya perbaikan sesuai tingkat kerusakan yang dinilai tim Winter Attire.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold text-orange-950 block">Keterlambatan Pengembalian</strong>
                      <span className="text-[11px] text-orange-800">
                        Dipotong biaya sewa tambahan per hari keterlambatan sesuai tarif harian produk.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold text-rose-950 block">Barang Hilang</strong>
                      <span className="text-[11px] text-rose-800">
                        Uang deposit <strong>100% hangus</strong> untuk penggantian item yang hilang.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* No Refund Policy for Sizing */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="font-extrabold text-amber-950 block">
                    Kebijakan No Refund (Tidak Ada Penukaran Ukuran)
                  </strong>
                  <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                    Winter Attire beroperasi secara online dan tidak menyediakan showroom fisik untuk fitting. Oleh karena itu, <strong>tidak ada penukaran atau pengembalian dana (no refund)</strong> jika terjadi kesalahan pemilihan ukuran (kekecilan atau kebesaran). Harap ukur badan secara teliti sebelum booking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PEMBATALAN & LOGISTIK */}
          {activeTab === 'cancellation' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Pembatalan & Reschedule */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-teal-700" />
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Kebijakan Pembatalan & Penjadwalan Ulang (Reschedule)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                    <span className="text-rose-900 font-extrabold block text-xs">Pembatalan Sewa (Cancel)</span>
                    <p className="text-[11px] text-rose-800 mt-1 leading-relaxed">
                      • Biaya sewa <strong>100% hangus / tidak dapat dikembalikan</strong> karena slot unit telah diblokir untuk Anda.<br />
                      • Uang deposit garansi <strong>dikembalikan penuh 100%</strong> ke rekening penyewa.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                    <span className="text-amber-900 font-extrabold block text-xs">Penjadwalan Ulang (Reschedule)</span>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      • Reschedule tanggal dikenakan biaya administrasi / denda <strong>50% dari total biaya sewa</strong>.<br />
                      • Jadwal baru tergantung pada ketersediaan produk pada tanggal pengganti.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pengiriman & Pengembalian */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-teal-700" />
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Metode Pengiriman & Pengembalian
                  </h4>
                </div>

                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Seluruh biaya ongkos kirim keberangkatan dan kepulangan ditanggung sepenuhnya oleh penyewa:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block text-xs">Area Jabodetabek / Jakarta:</strong>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                      <li><strong>Pick Up Sendiri:</strong> Diambil langsung ke lokasi studio Winter Attire.</li>
                      <li><strong>GO-SEND / GrabExpress:</strong> Instan atau Sameday pada hari H-1 atau tanggal mulai sewa.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block text-xs">Luar Jakarta / Seluruh Indonesia:</strong>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                      <li><strong>JNE YES (Yakin Esok Sampai):</strong> Layanan kilat 1 hari sampai ke seluruh kota besar.</li>
                      <li>Pengembalian wajib menggunakan ekspedisi kilat berasuransi.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Laundry Guarantee */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="font-extrabold text-emerald-950 block">
                    Penyewa TIDAK PERLU Mencuci Jaket (Free Laundry Included)
                  </strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    Demi menjaga kualitas lapisan bulu angsa (down feather) dan membran anti-air (waterproof coating), Winter Attire menggunakan metode pencucian khusus berstandar higienis. Anda cukup memasukkan kembali barang ke kemasan rapi dan mengirimkannya ke kami.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            T&C ini mengikat seluruh transaksi pemesanan di Winter Attire.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#0C3B43] hover:bg-[#10515B] text-white transition cursor-pointer shadow-xs"
            >
              Saya Mengerti & Setuju
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
