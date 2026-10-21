import React from 'react';
import { X, HelpCircle, Sparkles, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      icon: Truck,
      q: 'Kapan jaket dan perlengkapan dikirim ke alamat saya?',
      a: 'Winter Attire mengirimkan paket sewa tiba di alamat Anda maksimal H-2 sebelum tanggal penerbangan Anda, sehingga Anda memiliki cukup waktu untuk packing koper tanpa panik.'
    },
    {
      icon: Sparkles,
      q: 'Bagaimana standar kebersihan dan higienitas pakaian sewa?',
      a: 'Setiap jaket, innerwear, dan aksesori melalui proses Professional Dry Cleaning, disinfeksi uap panas, serta sterilisasi UV-C & Ozon sebelum dikemas dalam wadah vacuum steril.'
    },
    {
      icon: RefreshCw,
      q: 'Bagaimana jika size yang saya terima ternyata kurang pas?',
      a: 'Kami memberikan fasilitas Fitting Guarantee: Anda dapat mengajukan penukaran ukuran (tukar size) gratis secara instan sebelum hari keberangkatan (ongkir ekspres berlaku).'
    },
    {
      icon: ShieldCheck,
      q: 'Bagaimana sistem deposit dan pengembalian barang?',
      a: 'Deposit pengaman ditransfer bersamaan dengan pelunasan sewa, dan akan ditransfer balik 100% ke rekening Anda maksimal 1x24 jam setelah barang sewa kami terima kembali dalam kondisi baik.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-frost-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-white/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                FAQ & Standar Layanan Sewa
              </h3>
              <p className="text-xs text-slate-500">
                Informasi penting sewa pakaian musim dingin di @winterattire.id
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3.5">
          {faqs.map((faq, idx) => {
            const Icon = faq.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white/80 border border-slate-200/90 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-xl shrink-0 mt-0.5 border border-sky-100">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Tutup FAQ
          </button>
        </div>
      </div>
    </div>
  );
};
