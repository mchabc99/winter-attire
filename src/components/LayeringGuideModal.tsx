import React from 'react';
import { X, Layers, Wind, Droplets, Sun, Sparkles } from 'lucide-react';

interface LayeringGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayeringGuideModal: React.FC<LayeringGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-frost-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-white/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Prinsip Standar 3-Layer System
              </h3>
              <p className="text-xs text-slate-500">
                Rahasia tetap hangat tanpa memakai 5 lapis baju tebal yang kaku
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

        <div className="mt-6 space-y-4">
          {/* Layer 3 Outer */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">
              L3
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Outer Layer (Shell / Weatherproof Shield)
                </h4>
                <Wind className="w-3.5 h-3.5 text-teal-700" />
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <strong>Fungsi:</strong> Menahan angin dingin menusuk (windproof) dan air/salju basah
                (waterproof). Menjaga panas yang terperangkap di dalam tidak hilang terbawa hembusan
                badai.
              </p>
              <div className="mt-2 pt-2 border-t border-teal-200/60 bg-white/70 p-2 rounded-xl text-xs flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-teal-950 font-extrabold">Rekomendasi Winter Attire:</strong>
                  <span className="text-slate-700 block text-[11px] mt-0.5">
                    The North Face Arctic Down Parka (P1), Michael Kors Metallic Puffer (P2), Zara P9 Crop Puffer, New Look Heavy Puffer (R13).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 2 Mid */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">
              L2
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Mid Layer (Insulation / Thermal Trap)
                </h4>
                <Sun className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <strong>Fungsi:</strong> Menjebak kantong udara hangat tubuh agar tidak kabur.
                Fleksibel untuk dilepas saat berada di dalam ruangan (restoran/kereta/mall) yang
                memiliki pemanas sentral (heater).
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200 bg-white/70 p-2 rounded-xl text-xs flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-extrabold">Rekomendasi Winter Attire:</strong>
                  <span className="text-slate-700 block text-[11px] mt-0.5">
                    Insulated Puffer Vest (P4 / R1 / R3), Quilted Warm Layer, atau Highneck Thermal Top.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 1 Base */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-700 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">
              L1
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Base Layer (Moisture-Wicking / Heattech)
                </h4>
                <Droplets className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <strong>Fungsi:</strong> Bersentuhan langsung dengan kulit. Menguapkan keringat agar
                kulit tetap kering. Kulit yang basah oleh keringat akan cepat membeku saat terkena
                suhu dingin!
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200 bg-white/70 p-2 rounded-xl text-xs flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-extrabold">Rekomendasi Winter Attire:</strong>
                  <span className="text-slate-700 block text-[11px] mt-0.5">
                    Ultra Warm Heattech Innerwear Top + Bottom (H7 Series / H1 / H2) berlapis thermal microfleece.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Aksesori */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">
              +
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-extrabold text-slate-900">
                Aksesori Ekstremitas Tubuh (Tangan, Kepala, Telinga)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Tubuh manusia kehilangan 40% panas melalui kepala dan telinga. Sarung tangan ski
                tahan air wajib digunakan agar tidak basah saat memegang salju.
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-200/60 bg-white/70 p-2 rounded-xl text-xs flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-extrabold">Rekomendasi Winter Attire:</strong>
                  <span className="text-slate-700 block text-[11px] mt-0.5">
                    Waterproof Touchscreen Ski Gloves (P7 / P8), Beanie Rajut Wol Polar (A2), dan Thermal Earmuffs (A3).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
