import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  MapPin,
  Calendar,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  User,
  Instagram,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export interface BookingFormDetails {
  destination: string;
  productCodes: string[];
  productNames?: string[];
  durationDays: number;
  startDate?: string;
  endDate?: string;
  rentalFee: number;
  depositFee: number;
}

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingFormDetails;
  onOpenTermsModal?: () => void;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onOpenTermsModal
}) => {
  // Saved form fields from localStorage
  const [nama, setNama] = useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('wa_booking_nama')) || '';
  });
  const [instagram, setInstagram] = useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('wa_booking_ig')) || '';
  });
  const [phone, setPhone] = useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('wa_booking_phone')) || '';
  });
  const [alamat, setAlamat] = useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('wa_booking_alamat')) || '';
  });
  const [metodePengiriman, setMetodePengiriman] = useState<string>(() => {
    return (
      (typeof window !== 'undefined' && localStorage.getItem('wa_booking_pengiriman')) ||
      'GO-SEND (Area Jakarta)'
    );
  });
  const [metodePengembalian, setMetodePengembalian] = useState<string>(() => {
    return (
      (typeof window !== 'undefined' && localStorage.getItem('wa_booking_pengembalian')) ||
      'GO-SEND'
    );
  });
  const [noRekening, setNoRekening] = useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('wa_booking_rekening')) || '';
  });

  // Mandatory Agreement Checkbox
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync state changes with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wa_booking_nama', nama);
      localStorage.setItem('wa_booking_ig', instagram);
      localStorage.setItem('wa_booking_phone', phone);
      localStorage.setItem('wa_booking_alamat', alamat);
      localStorage.setItem('wa_booking_pengiriman', metodePengiriman);
      localStorage.setItem('wa_booking_pengembalian', metodePengembalian);
      localStorage.setItem('wa_booking_rekening', noRekening);
    }
  }, [nama, instagram, phone, alamat, metodePengiriman, metodePengembalian, noRekening]);

  if (!isOpen) return null;

  // Format dates in readable Indonesian
  const formatIndoDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
          'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
        ];
        const day = parseInt(parts[2], 10);
        const monthIdx = parseInt(parts[1], 10) - 1;
        const year = parts[0];
        return `${day} ${months[monthIdx] || ''} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const periodText =
    bookingData.startDate && bookingData.endDate
      ? `${bookingData.durationDays} Hari (${formatIndoDate(bookingData.startDate)} s/d ${formatIndoDate(bookingData.endDate)})`
      : `${bookingData.durationDays} Hari (Jadwal Segera)`;

  const igHandle = instagram ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : '@[Akun IG]';
  const codesText = bookingData.productCodes.length > 0 ? bookingData.productCodes.join(' / ') : '[Pilih Produk]';

  // Construct official WhatsApp Booking message strictly according to prompt requirements
  const generateOfficialMessage = () => {
    return `Halo Admin Winter Attire, saya ingin mengajukan sewa:

BOOKING FORM:
• Nama: ${nama.trim() || '[Isi di Chat]'}
• Instagram Account: ${igHandle}
• No. HP: ${phone.trim() || '[Nomor HP]'}
• Alamat Rumah: ${alamat.trim() || '[Alamat Pengiriman]'}
• Negara Tujuan: ${bookingData.destination || 'Luar Negeri'}
• Kode Produk: ${codesText}
• Periode Sewa: ${periodText}
• Estimasi Biaya Sewa: ${formatRupiah(bookingData.rentalFee)}
• Nilai Deposit: ${formatRupiah(bookingData.depositFee)}
• Metode Pengiriman: ${metodePengiriman}
• Metode Pengembalian: ${metodePengembalian}
• No. Rekening Bank: ${noRekening.trim() || '[Untuk Pengembalian Deposit]'}

Saya menyetujui T&C Winter Attire dan siap melampirkan foto KTP/SIM yang berlaku. Mohon konfirmasi ketersediaannya ya kak!`;
  };

  const handleSendWhatsApp = () => {
    if (!agreedToTerms) {
      alert('Mohon centang persetujuan Syarat & Ketentuan (T&C) terlebih dahulu.');
      return;
    }
    const msg = generateOfficialMessage();
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/6282135100969?text=${encoded}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateOfficialMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#93A4EB] via-[#72BCE7] via-[#5CCFBE] to-[#4FD37C]" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full inline-block">
                Booking Form Resmi
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
                Formulir Pengajuan Sewa WhatsApp
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer shrink-0"
            title="Tutup Form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-[13px]">
          {/* Summary Banner of Pre-Calculated Order */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0C3B43] to-slate-900 text-white shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-teal-700/60">
              <span className="text-teal-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Rincian Item & Destinasi</span>
              </span>
              <span className="text-slate-300 font-medium">
                {bookingData.productCodes.length} Item
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-teal-200/80 block">Destinasi</span>
                <strong className="text-white truncate block text-[12px]">
                  {bookingData.destination || 'Luar Negeri'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-teal-200/80 block">Kode Produk</span>
                <strong className="text-white truncate block font-mono text-[12px]">
                  {codesText}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-teal-200/80 block">Estimasi Sewa</span>
                <strong className="text-white block text-[12px]">
                  {formatRupiah(bookingData.rentalFee)}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-teal-200/80 block">Deposit (100% Refundable)</span>
                <strong className="text-emerald-300 block text-[12px]">
                  {formatRupiah(bookingData.depositFee)}
                </strong>
              </div>
            </div>

            <div className="text-[11px] text-teal-100 flex items-center gap-1.5 pt-1 border-t border-teal-700/40">
              <Calendar className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>Periode Sewa: <strong>{periodText}</strong></span>
            </div>
          </div>

          {/* User Input Fields Form */}
          <div className="space-y-3 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              Lengkapi Data Penyewa (Disimpan Otomatis):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nama */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap Pemesan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Akun Instagram <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Instagram className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Contoh: @budi.travels"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* No HP */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* No Rekening Bank */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  No. Rekening Bank (Pengembalian Deposit)
                </label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={noRekening}
                    onChange={(e) => setNoRekening(e.target.value)}
                    placeholder="Contoh: BCA 123456789 a.n. Budi"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Alamat Pengiriman */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Alamat Rumah / Pengiriman Lengkap <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota & kode pos..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-xs text-slate-900 bg-white resize-none"
              />
            </div>

            {/* Metode Pengiriman & Pengembalian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Metode Pengiriman:</span>
                </label>
                <select
                  value={metodePengiriman}
                  onChange={(e) => setMetodePengiriman(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-xs text-slate-900 bg-white cursor-pointer"
                >
                  <option value="Pick Up (Area Jakarta)">Pick Up Sendiri (Area Jakarta)</option>
                  <option value="GO-SEND (Area Jakarta)">GO-SEND Instan/Sameday (Area Jakarta)</option>
                  <option value="JNE YES (Luar Jakarta)">JNE YES Kilat (Luar Jakarta)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-teal-700" />
                  <span>Metode Pengembalian:</span>
                </label>
                <select
                  value={metodePengembalian}
                  onChange={(e) => setMetodePengembalian(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-xs text-slate-900 bg-white cursor-pointer"
                >
                  <option value="Drop Off">Drop Off Langsung ke Studio</option>
                  <option value="GO-SEND">GO-SEND / GrabExpress</option>
                  <option value="JNE YES">JNE YES / Ekspedisi Kilat</option>
                </select>
              </div>
            </div>
          </div>

          {/* CHECKBOX PERSETUJUAN SEBELUM CHECKOUT (Mandatory Requirement) */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-teal-800 focus:ring-teal-700 cursor-pointer"
              />
              <span className="text-xs text-slate-700 leading-snug">
                Saya menyetujui <strong>T&C Sewa</strong> (Wajib KTP/SIM, Deposit Refundable H+7, & Laundry Included).{' '}
                {onOpenTermsModal && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenTermsModal();
                    }}
                    className="text-teal-800 font-black hover:underline inline-flex items-center gap-0.5 ml-1 cursor-pointer"
                  >
                    <span>[Baca T&C Lengkap]</span>
                  </button>
                )}
              </span>
            </label>
          </div>

          {/* WhatsApp Message Preview Toggle */}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-bold text-slate-600 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPreview ? 'Sembunyikan Draf Pesan' : 'Lihat Format Pesan WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-700" />}
                <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
              </button>
            </div>

            {showPreview && (
              <div className="mt-2.5 bg-slate-900 text-slate-100 p-3.5 rounded-2xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-48 overflow-y-auto">
                {generateOfficialMessage()}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            Siapkan foto <strong>KTP / SIM asli</strong> untuk dikirim via chat WhatsApp.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={!agreedToTerms}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black text-white transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                agreedToTerms
                  ? 'bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:from-[#20bd5a] hover:to-[#17a54e] shadow-emerald-500/20'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0" />
              <span>Kirim ke WhatsApp Winter Attire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
