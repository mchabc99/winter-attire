import React from 'react';
import { ActivePage } from '../types';
import {
  Instagram,
  BookOpen,
  Sparkles,
  FileText,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import { TermsModalTab } from './TermsAndConditionsModal';

interface HeaderProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  cartCount: number;
  onOpenLayeringGuide: () => void;
  onOpenFaq: () => void;
  onOpenSheetConfig?: () => void;
  onOpenTermsModal?: (tab?: TermsModalTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onPageChange,
  cartCount,
  onOpenLayeringGuide,
  onOpenFaq,
  onOpenSheetConfig,
  onOpenTermsModal
}) => {
  return (
    <>
      {/* ============================================================== */}
      {/* 1. TOP HEADER (Responsive: Compact on mobile, Full on desktop) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#BCE4E8] shadow-xs">
        {/* Aurora Borealis Accent Ribbon (Pastel Blue to Pastel Green) */}
        <div className="h-1 w-full bg-gradient-to-r from-[#93A4EB] via-[#72BCE7] via-[#5CCFBE] to-[#4FD37C]"></div>

        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Brand Identity: Clean, Proportional & Modern Minimalist */}
          <div className="flex items-center gap-2.5 select-none shrink-0 py-1">
            <button
              type="button"
              onClick={() => {
                onPageChange('advisor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-hidden"
              aria-label="Winter Attire Beranda"
            >
              <img
                src="/winter-attire-logo.svg"
                alt="Winter Attire Logo"
                referrerPolicy="no-referrer"
                className="w-[38px] h-[38px] rounded-xl object-cover border border-[#BCE4E8] shadow-2xs group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="flex flex-col justify-center leading-tight">
                <span className="font-bold text-[14px] text-[#0F2537] tracking-tight group-hover:text-teal-900 transition-colors">
                  Winter Attire
                </span>
                <a
                  href="https://instagram.com/winterattire.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-[#64748B] hover:text-[#0E7490] transition-colors leading-normal"
                >
                  @winterattire.id
                </a>
              </div>
            </button>
          </div>

          {/* DESKTOP NAVIGATION (viewport >= 768px): Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => onPageChange('advisor')}
              className={`text-xs font-extrabold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activePage === 'advisor'
                  ? 'bg-[#0C3B43] text-white shadow-xs'
                  : 'text-slate-700 hover:text-teal-900 hover:bg-teal-50/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => onPageChange('catalog')}
              className={`text-xs font-extrabold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activePage === 'catalog'
                  ? 'bg-[#0C3B43] text-white shadow-xs'
                  : 'text-slate-700 hover:text-teal-900 hover:bg-teal-50/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-300" />
              <span>Katalog &amp; Size</span>
            </button>

            <button
              onClick={() => onPageChange('cart')}
              className={`text-xs font-extrabold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 relative ${
                activePage === 'cart'
                  ? 'bg-[#0C3B43] text-white shadow-xs'
                  : 'text-slate-700 hover:text-teal-900 hover:bg-teal-50/70'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-teal-300" />
              <span>Keranjang</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-2xs">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (onOpenTermsModal) {
                  onOpenTermsModal('howToRent');
                } else {
                  onPageChange('guide');
                }
              }}
              className="text-xs font-extrabold px-3 py-2 rounded-xl text-slate-700 hover:text-teal-900 hover:bg-teal-50/70 transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Buka Cara Sewa & Syarat Ketentuan Resmi"
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Cara Sewa &amp; T&amp;C</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-0.5"></div>

            {/* WhatsApp Direct Help */}
            <a
              href={`https://wa.me/6282135100969?text=${encodeURIComponent('Halo Admin Winter Attire, saya ingin berkonsultasi seputar rental pakaian & perlengkapan musim dingin.')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat Admin WhatsApp"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chat WhatsApp</span>
            </a>

            {/* Instagram Link */}
            <a
              href="https://instagram.com/winterattire.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-pink-700 wa-badge-rose px-2.5 py-1.5 rounded-xl transition shadow-2xs shrink-0"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>@winterattire.id</span>
            </a>
          </nav>

          {/* MOBILE HEADER ACTIONS (viewport < 768px): Only Instagram & Cart Icon */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Instagram Quick Link */}
            <a
              href="https://instagram.com/winterattire.id"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Winter Attire"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-pink-700 bg-pink-50/90 hover:bg-pink-100 border border-pink-200/80 transition shadow-2xs cursor-pointer active:scale-95"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
            </a>

            {/* Cart Quick Icon Button with Live Counter Badge */}
            <button
              onClick={() => {
                onPageChange('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Keranjang Belanja"
              className={`w-9 h-9 rounded-xl flex items-center justify-center relative transition border cursor-pointer active:scale-95 ${
                activePage === 'cart'
                  ? 'bg-[#0C3B43] text-white border-[#0C3B43] shadow-xs'
                  : 'bg-teal-50/90 hover:bg-teal-100 text-teal-900 border-teal-200/80 shadow-2xs'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${activePage === 'cart' ? 'text-teal-200' : 'text-teal-800'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full text-[9.5px] font-black bg-emerald-500 text-white flex items-center justify-center shadow-xs border-2 border-white leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MOBILE BOTTOM NAVIGATION BAR (viewport < 768px)             */}
      {/* Native App Feel: Clean 4 Tabs, Pinned at Bottom of Screen     */}
      {/* ============================================================== */}
      <nav
        aria-label="Navigasi Bawah Layar"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(15,37,55,0.08)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 h-14 items-center px-1 max-w-md mx-auto">
          {/* Tab 1: Advisor */}
          <button
            onClick={() => {
              onPageChange('advisor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 transition relative cursor-pointer active:scale-95 ${
              activePage === 'advisor'
                ? 'text-[#0C3B43]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`w-8 h-6 rounded-full flex items-center justify-center transition ${
                activePage === 'advisor' ? 'bg-teal-100/80' : ''
              }`}
            >
              <Sparkles
                className={`w-4 h-4 transition ${
                  activePage === 'advisor' ? 'text-[#0C3B43] stroke-[2.5]' : 'text-slate-500'
                }`}
              />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight ${
                activePage === 'advisor' ? 'font-black text-[#0C3B43]' : 'font-semibold text-slate-500'
              }`}
            >
              Advisor
            </span>
          </button>

          {/* Tab 2: Katalog */}
          <button
            onClick={() => {
              onPageChange('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 transition relative cursor-pointer active:scale-95 ${
              activePage === 'catalog'
                ? 'text-[#0C3B43]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`w-8 h-6 rounded-full flex items-center justify-center transition ${
                activePage === 'catalog' ? 'bg-teal-100/80' : ''
              }`}
            >
              <BookOpen
                className={`w-4 h-4 transition ${
                  activePage === 'catalog' ? 'text-[#0C3B43] stroke-[2.5]' : 'text-slate-500'
                }`}
              />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight ${
                activePage === 'catalog' ? 'font-black text-[#0C3B43]' : 'font-semibold text-slate-500'
              }`}
            >
              Katalog
            </span>
          </button>

          {/* Tab 3: Keranjang */}
          <button
            onClick={() => {
              onPageChange('cart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 transition relative cursor-pointer active:scale-95 ${
              activePage === 'cart'
                ? 'text-[#0C3B43]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`w-8 h-6 rounded-full flex items-center justify-center relative transition ${
                activePage === 'cart' ? 'bg-teal-100/80' : ''
              }`}
            >
              <ShoppingBag
                className={`w-4 h-4 transition ${
                  activePage === 'cart' ? 'text-[#0C3B43] stroke-[2.5]' : 'text-slate-500'
                }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white flex items-center justify-center shadow-xs border border-white leading-none">
                  {cartCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight ${
                activePage === 'cart' ? 'font-black text-[#0C3B43]' : 'font-semibold text-slate-500'
              }`}
            >
              Keranjang
            </span>
          </button>

          {/* Tab 4: Panduan */}
          <button
            onClick={() => {
              onPageChange('guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 transition relative cursor-pointer active:scale-95 ${
              activePage === 'guide'
                ? 'text-[#0C3B43]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`w-8 h-6 rounded-full flex items-center justify-center transition ${
                activePage === 'guide' ? 'bg-teal-100/80' : ''
              }`}
            >
              <FileText
                className={`w-4 h-4 transition ${
                  activePage === 'guide' ? 'text-[#0C3B43] stroke-[2.5]' : 'text-slate-500'
                }`}
              />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight ${
                activePage === 'guide' ? 'font-black text-[#0C3B43]' : 'font-semibold text-slate-500'
              }`}
            >
              Panduan
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
