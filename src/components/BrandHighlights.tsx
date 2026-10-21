import React, { useState } from 'react';
import {
  Sparkles,
  Leaf,
  Tag,
  CheckCircle2,
  ShieldAlert,
  Snowflake,
  ExternalLink,
  Instagram,
  Copy,
  Info,
  Layers,
  ThermometerSnowflake,
  Compass
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const BrandHighlights: React.FC = () => {
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText('WINTER10-IG');
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  return (
    <div className="space-y-6 my-10">
      {/* 1. Voucher Banner (From PDF Page 8) */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-teal-200/80 bg-gradient-to-r from-[#E0F7FA]/90 via-[#E6FAF2]/85 to-[#F2FAFB] shadow-md">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <BrandLogo size="md" className="ring-2 ring-white/80 shadow-xs" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="wa-badge-aurora text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Special Promo
                </span>
                <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <span>@winterattire.id</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Diskon 10% Off Untuk Sewa Berikutnya!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                Bagikan review foto OOTD liburanmu dan tag kami <strong>@winterattire.id</strong> di
                Instagram Story/Feed/Reels. Minimal transaksi sewa Rp 1.000.000.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {/* Coupon Ticket Style Card */}
            <div className="w-full sm:w-auto bg-white/95 border-2 border-dashed border-teal-400 p-3.5 rounded-2xl flex items-center justify-between sm:justify-start gap-4 shadow-xs">
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Klaim Kode Promo</div>
                <div className="font-mono font-black text-base text-teal-900 tracking-wider">
                  WINTER10-IG
                </div>
              </div>
              <button
                onClick={handleCopyVoucher}
                className="text-xs font-bold bg-teal-100 hover:bg-teal-200 text-teal-900 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedVoucher ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid: About Us & Sustainable Fashion + 6 Unique Differences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: About Us & Sustainable Fashion */}
        <div className="lg:col-span-5 glass-frost-card rounded-3xl p-6 sm:p-7 border border-white/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                Sustainable Fashion & About Us
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              Hangat, Stylish, & Peduli Kelestarian Lingkungan
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              Industri fashion menyumbang hampir <strong>10% emisi karbon global</strong>. Pakaian
              musim dingin biasanya hanya dipakai 1-2 kali setahun, lalu menumpuk tak terpakai di
              lemari.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950">
              <div className="font-extrabold mb-1 flex items-center gap-1.5">
                <span>🌱 Mengapa Menyewa Lebih Bijak?</span>
              </div>
              <p className="leading-relaxed">
                Daripada membeli jaket mahal hingga belasan juta rupiah yang jarang dipakai, menyewa
                di Winter Attire mendukung gerakan <em>sustainable wardrobe</em> tanpa
                overconsumption.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Standar Higienis: Dry Cleaning + UV-C</span>
            <span className="font-bold text-sky-700">@winterattire.id</span>
          </div>
        </div>

        {/* Right 7 Cols: Our 6 Unique Differences (From PDF Page 9) */}
        <div className="lg:col-span-7 glass-frost-card rounded-3xl p-6 sm:p-7 border border-white/90">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-800">
                Keunggulan Layanan Kami
              </span>
              <h4 className="text-lg sm:text-xl font-black text-slate-900">
                Our Unique Differences
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-400">6 Standar Baku</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Free Consultation</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">
                Konsultasi gratis memilih mantel yang paling sesuai dengan destinasi & fisikmu.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Tested in Europe’s Winter</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">
                Semua koleksi jaket kami telah diuji coba di iklim musim dingin nyata Eropa.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>Ski & Extreme Winter Ready</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">
                Tersedia sarung tangan ski anti-air dan jaket untuk suhu ekstrem di bawah minus 20°C.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  4
                </span>
                <span>Gender & Size Inclusivity</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">
                Rentang ukuran lengkap dari <strong>XS hingga XXL / 3XL</strong> untuk Pria & Wanita.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  5
                </span>
                <span>Warm Without Bulky Look</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">
                Tetap hangat tanpa kelihatan menggelembung kaku; ringan saat bergerak aktif.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition">
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  6
                </span>
                <span>Waterproof & Windproof</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">
                Proteksi menyeluruh terhadap hembusan angin dingin menusuk dan butiran salju basah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
