import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Link,
  Info,
  ClipboardPaste,
  Image as ImageIcon
} from 'lucide-react';
import {
  getCatalogSheetUrl,
  saveCatalogSheetUrl,
  fetchCatalogFromGoogleSheet,
  parseCatalogCsv,
  DynamicCatalogProduct
} from '../services/catalogService';

interface CatalogSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSynced: (products: DynamicCatalogProduct[], source: 'google_sheets' | 'fallback') => void;
  currentCount: number;
}

export const CatalogSheetSyncModal: React.FC<CatalogSheetSyncModalProps> = ({
  isOpen,
  onClose,
  onSynced,
  currentCount
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'paste'>('url');
  const [sheetUrl, setSheetUrl] = useState(() => getCatalogSheetUrl());
  const [pastedCsv, setPastedCsv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showColumnsGuide, setShowColumnsGuide] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSyncUrl = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    const cleanUrl = sheetUrl.trim();
    saveCatalogSheetUrl(cleanUrl);

    try {
      const result = await fetchCatalogFromGoogleSheet(cleanUrl);
      if (result.source === 'google_sheets') {
        setStatusMessage({
          type: 'success',
          text: `Berhasil tersinkronisasi! ${result.products.length} produk katalog berhasil dimuat dari Google Sheets.`
        });
        onSynced(result.products, 'google_sheets');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        if (cleanUrl) {
          setStatusMessage({
            type: 'error',
            text: result.error || 'Gagal memuat dari link tersebut. Pastikan sheet bersifat "Anyone with the link can view".'
          });
        } else {
          setStatusMessage({
            type: 'info',
            text: 'URL dikosongkan. Menggunakan katalog bawaan Winter Attire.'
          });
          onSynced(result.products, 'fallback');
        }
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Terjadi kesalahan saat menghubungkan ke Google Sheets.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPastedCsv = () => {
    if (!pastedCsv.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Silakan tempel (paste) data teks CSV atau baris spreadsheet terlebih dahulu.'
      });
      return;
    }

    try {
      const parsed = parseCatalogCsv(pastedCsv.trim());
      if (parsed.length === 0) {
        setStatusMessage({
          type: 'error',
          text: 'Format data tidak sesuai. Pastikan baris pertama memuat nama kolom (seperti kode_produk, nama_produk, link_foto_produk).'
        });
        return;
      }

      onSynced(parsed, 'google_sheets');
      setStatusMessage({
        type: 'success',
        text: `Berhasil menerapkan ${parsed.length} produk katalog langsung dari data yang ditempel!`
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Gagal memproses teks CSV: ${err?.message || 'Format tidak valid'}`
      });
    }
  };

  const columnsList = [
    { num: 1, name: 'kode_produk', desc: 'Kode unik (contoh: P1, R1, B1, H1)' },
    { num: 2, name: 'nama_produk', desc: 'Nama lengkap jaket / item winter' },
    { num: 3, name: 'kategori', desc: 'Regular, Premium Extreme, Thermal Base Layer / Bottom / Set, Sleepwear / Lounge, Accessories, Boots' },
    { num: 4, name: 'warna', desc: 'Warna utama (contoh: Black, Silver, Ivory)' },
    { num: 5, name: 'size_wa', desc: 'Ukuran Winter Attire (contoh: equal to S-M)' },
    { num: 6, name: 'rekomendasi_suhu', desc: 'Batas suhu ideal (contoh: < -5°C, 5-15°C)' },
    { num: 7, name: 'berat_gram', desc: 'Bobot jaket dalam gram (contoh: 1145)' },
    { num: 8, name: 'panjang_cm', desc: 'Panjang jaket dalam cm (contoh: 80)' },
    { num: 9, name: 'lingkar_dada_max_cm', desc: 'Lingkar dada maksimal dalam cm (contoh: 110)' },
    { num: 10, name: 'lingkar_pinggang_max_cm', desc: 'Lingkar pinggang maksimal (contoh: 106)' },
    { num: 11, name: 'fitur_spesial', desc: 'Waterproof, Windproof, Topi Bulu, Down, dll.' },
    { num: 12, name: 'harga_sewa_3_hari', desc: 'Tarif sewa paket 1-3 hari (Rp)' },
    { num: 13, name: 'harga_sewa_6_hari', desc: 'Tarif sewa paket 4-6 hari (Rp)' },
    { num: 14, name: 'harga_sewa_9_hari', desc: 'Tarif sewa paket 7-9 hari (Rp)' },
    { num: 15, name: 'harga_sewa_12_hari', desc: 'Tarif sewa paket 10-12 hari (Rp)' },
    { num: 16, name: 'harga_sewa_15_hari', desc: 'Tarif sewa paket 13-15 hari (Rp)' },
    { num: 17, name: 'harga_sewa_18_hari', desc: 'Tarif sewa paket 16-18 hari (Rp)' },
    { num: 18, name: 'harga_sewa_21_hari', desc: 'Tarif sewa paket 19-21 hari (Rp)' },
    { num: 19, name: 'harga_sewa_24_hari', desc: 'Tarif sewa paket 22-24 hari (Rp)' },
    { num: 20, name: 'biaya_deposit', desc: 'Biaya jaminan refundable (Rp)' },
    { num: 21, name: 'link_foto_produk', desc: 'Link Google Drive / URL foto produk' },
    { num: 22, name: 'link_foto_spek', desc: 'Link Google Drive / URL foto spesifikasi/slide' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-frost-card rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-white/90">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Sinkronisasi Google Sheets Katalog
              </h3>
              <p className="text-xs text-slate-500">
                Koneksi langsung data inventaris & tiering harga sewa real-time
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

        {/* Tab Switcher */}
        <div className="mt-5 flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('url');
              setStatusMessage(null);
            }}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'url'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Koneksi URL Spreadsheet</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('paste');
              setStatusMessage(null);
            }}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'paste'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Tempel (Paste) CSV / Baris Langsung</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-4 space-y-4">
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-teal-950 font-bold block mb-0.5">
                  100% Otomatis & Terkoneksi Langsung:
                </strong>
                Sistem membaca 22 kolom katalog Winter Attire secara langsung dan otomatis mengonversi link Google Drive di kolom <code className="font-bold text-teal-900 bg-teal-100 px-1 rounded">link_foto_produk</code> dan <code className="font-bold text-teal-900 bg-teal-100 px-1 rounded">link_foto_spek</code> menjadi foto resolusi tinggi berkecepatan tinggi (Google UserContent CDN).
              </div>
            </div>
          </div>

          {activeTab === 'url' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-teal-700" />
                  <span>URL Google Sheets (CSV / Sharing Link):</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowColumnsGuide(!showColumnsGuide)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showColumnsGuide ? 'Sembunyikan Kolom' : 'Lihat 22 Kolom'}</span>
                </button>
              </div>
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit?usp=sharing"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono shadow-inner"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                💡 Format didukung: Tautan Google Sheets biasa (<code>/edit</code>), tautan publikasi web (<code>/pubhtml</code>), atau tautan CSV langsung (<code>/gviz/tq?tqx=out:csv</code>). Pastikan hak akses disetel ke <strong>"Anyone with the link can view"</strong>.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ClipboardPaste className="w-3.5 h-3.5 text-teal-700" />
                  <span>Tempel Teks CSV / Baris Google Sheets:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowColumnsGuide(!showColumnsGuide)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showColumnsGuide ? 'Sembunyikan Kolom' : 'Lihat 22 Kolom'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={pastedCsv}
                onChange={(e) => setPastedCsv(e.target.value)}
                placeholder="Salin baris dari Google Sheets (termasuk baris header) lalu tempel di sini..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono shadow-inner"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                💡 Anda dapat memblok seluruh tabel di Google Sheets (Ctrl+A / Cmd+A), menyalinnya (Ctrl+C / Cmd+C), dan langsung menempelkannya di sini.
              </p>
            </div>
          )}

          {/* 22 Column Guide */}
          {showColumnsGuide && (
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs space-y-2 animate-in fade-in">
              <div className="font-black text-sky-950 flex items-center gap-2">
                <span>📋 Struktur 22 Kolom yang Dibaca Sistem:</span>
              </div>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-1 divide-y divide-sky-100">
                {columnsList.map((col) => (
                  <div key={col.num} className="pt-1.5 first:pt-0 flex items-start justify-between gap-2 text-[11px]">
                    <span className="font-mono font-bold text-sky-900 shrink-0">
                      {col.num}. {col.name}
                    </span>
                    <span className="text-slate-600 text-right">{col.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border border-rose-300 text-rose-900'
                  : 'bg-sky-50 border border-sky-300 text-sky-900'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              {statusMessage.type === 'info' && <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Saat ini termuat: <strong>{currentCount}</strong> produk katalog
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={activeTab === 'url' ? handleSyncUrl : handleApplyPastedCsv}
                disabled={isLoading}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0C3B43] via-[#10515B] to-[#0E5C50] text-white text-xs font-black hover:opacity-95 transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghubungkan...</span>
                  </>
                ) : activeTab === 'url' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Simpan & Sinkronkan</span>
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Terapkan Data Langsung</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
