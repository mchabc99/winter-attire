import React from 'react';
import { OUTERWEAR_CATALOG } from '../data/winterData';
import { X, ShieldCheck, Sparkles, Thermometer } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-frost-card rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-white/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Koleksi Mantel & Jaket Winter Attire
              </h3>
              <p className="text-xs text-slate-500">
                Standarisasi kode inventaris @winterattire.id berdasarkan rentang suhu riil
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

        {/* Table representation */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[11px]">
                <th className="pb-3 pr-4">Rentang Suhu</th>
                <th className="pb-3 pr-4">Katalog & Kode Inventaris</th>
                <th className="pb-3 pr-4">Tipe & Spesifikasi</th>
                <th className="pb-3 text-right">Tarif Sewa / Hari</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {OUTERWEAR_CATALOG.map((item, idx) => (
                <tr key={`${item.id || item.code}-${idx}`} className="hover:bg-sky-50/50 transition">
                  <td className="py-4 pr-4 align-top">
                    <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                      {item.tempRange}
                    </span>
                    <span className="text-[10px] text-slate-400">Rekomendasi Utama</span>
                  </td>

                  <td className="py-4 pr-4 align-top">
                    <div className="font-extrabold text-sky-900">{item.name}</div>
                    <div className="text-xs font-semibold text-sky-600 mt-0.5">
                      Kode: {item.code}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{item.brand}</div>
                  </td>

                  <td className="py-4 pr-4 align-top">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 mb-1">
                      {item.category}
                    </span>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </td>

                  <td className="py-4 text-right align-top">
                    <span className="font-black text-slate-900 text-sm block">
                      {formatRupiah(item.dailyPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400">/ hari sewa</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Accessories & Innerwear tariff box */}
        <div className="mt-6 p-4 rounded-2xl bg-sky-50/80 border border-sky-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Innerwear & Aksesori Pelengkap:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="font-bold text-slate-900">Base: Heattech Innerwear</div>
              <div className="text-slate-500 text-[11px]">Top + Bottom Ultra Warm</div>
              <div className="font-extrabold text-sky-700 mt-1">Rp 25.000 / hari</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="font-bold text-slate-900">Mid: Puffer Vest (P4 / R1)</div>
              <div className="text-slate-500 text-[11px]">Insulasi Tubuh Inti (Core)</div>
              <div className="font-extrabold text-sky-700 mt-1">Rp 55.000 / hari</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-sky-100">
              <div className="font-bold text-slate-900">Aksesori: Ski Gloves (P7/P8)</div>
              <div className="text-slate-500 text-[11px]">Waterproof + Polar Beanie</div>
              <div className="font-extrabold text-sky-700 mt-1">Rp 20.000 / hari</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Tutup Katalog
          </button>
        </div>
      </div>
    </div>
  );
};
