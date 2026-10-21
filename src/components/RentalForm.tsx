import React, { useState, useMemo } from 'react';
import { UserFormData } from '../types';
import {
  DESTINATIONS,
  calculateWinterAttireSize
} from '../data/winterData';
import {
  MapPin,
  Calendar,
  User,
  Ruler,
  Weight,
  Sparkles,
  ChevronDown,
  Search,
  Footprints,
  CheckCircle2,
  ThermometerSnowflake
} from 'lucide-react';

interface RentalFormProps {
  formData: UserFormData;
  onChange: (data: Partial<UserFormData>) => void;
  onSubmit: () => void;
  isAnalyzed: boolean;
  onOpenSheetConfig?: () => void;
  sheetSource?: 'none' | 'google_sheets' | 'fallback_mock';
  bookingsCount?: number;
}

const QUICK_DURATIONS = [
  { days: 3, label: '3 Hari' },
  { days: 6, label: '6 Hari' },
  { days: 9, label: '9 Hari' },
  { days: 12, label: '12 Hari' }
];

const SHOE_SIZE_OPTIONS = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

export const RentalForm: React.FC<RentalFormProps> = ({
  formData,
  onChange,
  onSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Current selected destination info
  const selectedDestination = useMemo(() => {
    return DESTINATIONS.find((d) => d.id === formData.destinationId) || DESTINATIONS[0];
  }, [formData.destinationId]);

  // Synchronize winter/snow default month: Southern Hemisphere (NZ/AU) is July (7), Northern is December (12)
  const isSouthern = selectedDestination?.region === 'Selandia Baru & Australia';
  const defaultMonth = isSouthern ? 7 : 12;
  const currentMonth = formData.month || defaultMonth;
  const currentTemp =
    (selectedDestination?.months && selectedDestination.months[currentMonth]) ||
    (selectedDestination?.months && selectedDestination.months[defaultMonth]) ||
    (selectedDestination?.months && selectedDestination.months[12]) ||
    { min: -5, max: 2, condition: 'Salju & dingin' };

  // Filtered destinations list
  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return DESTINATIONS;
    const q = searchQuery.toLowerCase();
    return DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.popularHighlight && d.popularHighlight.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Grouped destinations for clean optgroup display without cutting off text
  const groupedDestinations = useMemo(() => {
    const map = new Map<string, typeof DESTINATIONS>();
    DESTINATIONS.forEach((d) => {
      const reg = d.region || 'Lainnya';
      if (!map.has(reg)) {
        map.set(reg, []);
      }
      map.get(reg)!.push(d);
    });
    return Array.from(map.entries()).map(([region, items]) => ({
      region,
      items
    }));
  }, []);

  // Real-time live size recommendation
  const liveSize = useMemo(() => {
    return calculateWinterAttireSize(
      formData.gender,
      formData.height || 170,
      formData.weight || 65,
      formData.shoeSize || 40
    );
  }, [formData.gender, formData.height, formData.weight, formData.shoeSize]);

  // Handlers for dates
  const handleStartDateChange = (newStart: string) => {
    if (!newStart) {
      onChange({ startDate: '', endDate: '' });
      return;
    }
    const start = new Date(newStart);
    if (!isNaN(start.getTime())) {
      const end = new Date(start);
      end.setDate(start.getDate() + (formData.duration - 1));
      const endStr = end.toISOString().split('T')[0];
      const monthNum = start.getMonth() + 1;
      onChange({ startDate: newStart, endDate: endStr, month: monthNum });
    } else {
      onChange({ startDate: newStart });
    }
  };

  const handleEndDateChange = (newEnd: string) => {
    if (!newEnd) {
      onChange({ endDate: '' });
      return;
    }
    if (formData.startDate) {
      const s = new Date(formData.startDate);
      const e = new Date(newEnd);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const diff = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        const monthNum = s.getMonth() + 1;
        onChange({ endDate: newEnd, duration: diff, month: monthNum });
        return;
      }
    }
    onChange({ endDate: newEnd });
  };

  const handleDurationClick = (days: number) => {
    if (formData.startDate) {
      const start = new Date(formData.startDate);
      if (!isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(start.getDate() + (days - 1));
        const endStr = end.toISOString().split('T')[0];
        onChange({ duration: days, endDate: endStr });
        return;
      }
    }
    onChange({ duration: days });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="pb-2.5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-extrabold text-[#0F2537] text-sm sm:text-base flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Fitting &amp; Sewa</span>
        </h2>
        <span className="text-[10px] font-bold text-slate-400">
          3 Langkah Cepat
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-3 text-xs"
      >
        {/* ================= LANGKAH 1: DESTINASI ================= */}
        <div className="bg-slate-50/70 rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 space-y-2">
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#0F2537] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#0F2537] text-white flex items-center justify-center text-[9px] font-bold">1</span>
              <span>Destinasi</span>
            </label>
            {/* Live Temp Badge: [ 📍 Sapporo | -7°C ] */}
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/70">
              <ThermometerSnowflake className="w-3 h-3 text-teal-700" />
              <span>📍 {selectedDestination.name} | {currentTemp.min}°C</span>
            </span>
          </div>

          {/* City Dropdown & Search */}
          <div className="space-y-1.5 pt-0.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari 240+ kota destinasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0E7490]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={formData.destinationId}
                onChange={(e) => onChange({ destinationId: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl pl-2.5 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0E7490] appearance-none cursor-pointer"
              >
                {searchQuery.trim() ? (
                  filteredDestinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.flag} {d.name} ({d.country})
                    </option>
                  ))
                ) : (
                  groupedDestinations.map((g) => (
                    <optgroup key={g.region} label={`${g.region} (${g.items.length} Kota)`}>
                      {g.items.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.flag} {d.name}
                        </option>
                      ))}
                    </optgroup>
                  ))
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= LANGKAH 2: DURASI ================= */}
        <div className="bg-slate-50/70 rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#0F2537] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#0F2537] text-white flex items-center justify-center text-[9px] font-bold">2</span>
              <span>Durasi Sewa</span>
            </label>
            <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
              {formData.duration} Hari
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                Mulai Sewa
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0E7490] cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                Selesai Sewa
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                min={formData.startDate || undefined}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0E7490] cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Duration Chips: [3 Hari] [6 Hari] [9 Hari] [12 Hari] */}
          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {QUICK_DURATIONS.map((qd) => {
              const isSelected = formData.duration === qd.days;
              return (
                <button
                  key={qd.days}
                  type="button"
                  onClick={() => handleDurationClick(qd.days)}
                  className={`py-1.5 px-1 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[#0F2537] text-white border-[#0F2537] shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {qd.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= LANGKAH 3: UKURAN ================= */}
        <div className="bg-slate-50/70 rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 space-y-2">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#0F2537] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#0F2537] text-white flex items-center justify-center text-[9px] font-bold">3</span>
              <span>Ukuran Badan</span>
            </label>
            {/* Live Size Chip: [ Rekomendasi: Size M ] */}
            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#0F2537] text-white shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Rekomendasi: Size {liveSize.size}</span>
            </span>
          </div>

          {/* Gender: [Pria] / [Wanita] */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ gender: 'Pria' })}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                formData.gender === 'Pria'
                  ? 'bg-[#0F2537] text-white border-[#0F2537] shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>👨</span>
              <span>Pria</span>
            </button>
            <button
              type="button"
              onClick={() => onChange({ gender: 'Wanita' })}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                formData.gender === 'Wanita'
                  ? 'bg-[#0F2537] text-white border-[#0F2537] shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>👩</span>
              <span>Wanita</span>
            </button>
          </div>

          {/* Tinggi & Berat */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tinggi (cm)</label>
              <input
                type="number"
                min={120}
                max={220}
                value={formData.height || ''}
                onChange={(e) => onChange({ height: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0E7490]"
                placeholder="170"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Berat (kg)</label>
              <input
                type="number"
                min={35}
                max={150}
                value={formData.weight || ''}
                onChange={(e) => onChange({ weight: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0E7490]"
                placeholder="65"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#0F2537] hover:bg-[#1a3850] text-white font-extrabold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>Lihat Outfit Rekomendasi</span>
        </button>
      </form>
    </div>
  );
};
