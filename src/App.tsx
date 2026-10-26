/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  UserFormData,
  Gender,
  LayerItem,
  RecommendationResult,
  ActivePage,
  CartItem,
  BookingRecord,
  OuterwearItem
} from './types';
import {
  DESTINATIONS,
  getOuterwearForTemp,
  calculateWinterAttireSize,
  OUTERWEAR_CATALOG
} from './data/winterData';
import { COMPLETE_PRODUCT_CATALOG, CatalogProduct } from './data/productCatalog';
import { STATIC_PRODUCTS } from './data/products';
import {
  DynamicCatalogProduct,
  convertGoogleDriveImageUrl,
  calculateTieredRentalPrice,
  calculateRentalDays
} from './services/catalogService';
import { checkProductAvailability } from './services/availabilityService';
import { Header } from './components/Header';
import { RentalForm } from './components/RentalForm';
import { RecommendationView } from './components/RecommendationView';
import { BrandHighlights } from './components/BrandHighlights';
import { ProductCatalogSection } from './components/ProductCatalogSection';
import { HowToRentSection } from './components/HowToRentSection';
import { CartView } from './components/CartView';
import { InventoryModal } from './components/InventoryModal';
import { LayeringGuideModal } from './components/LayeringGuideModal';
import { FaqModal } from './components/FaqModal';
import { TermsAndConditionsModal, TermsModalTab } from './components/TermsAndConditionsModal';
import { BrandLogo } from './components/BrandLogo';
import {
  Sparkles,
  Snowflake,
  Shield,
  Award,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Compass,
  ShoppingBag,
  ArrowRight,
  FileText
} from 'lucide-react';

export default function App() {
  // Navigation / Page state
  const [activePage, setActivePage] = useState<ActivePage>('advisor');

  // Form State - Synchronized initial dates and month (Desember = month 12)
  const [formData, setFormData] = useState<UserFormData>({
    destinationId: 'sapporo',
    month: 12, // Synchronized with December start date
    gender: 'Pria',
    height: 172,
    weight: 68,
    shoeSize: 41,
    duration: 9,
    startDate: '2026-12-20',
    endDate: '2026-12-28'
  });

  // Real-Time Availability & Bookings State (Clean, no mock data)
  const [bookings] = useState<BookingRecord[]>([]);

  // 100% Data Produk Lokal Statis Tertanam Langsung di Kode (47 Produk)
  const [catalogProducts] = useState<DynamicCatalogProduct[]>(STATIC_PRODUCTS);
  const [catalogInitialSize, setCatalogInitialSize] = useState<string>('all');

  useEffect(() => {
    // BYPASS LOCALSTORAGE SEPENUHNYA:
    // Bersihkan cache produk dari localStorage/sessionStorage agar tidak meninggalkan residu
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('winter_attire_catalog_cache_data');
        localStorage.removeItem('winter_attire_sheets_url');
        localStorage.removeItem('katalog_csv_url');
        localStorage.removeItem('booking_csv_url');
        sessionStorage.removeItem('winter_attire_byungimuncil_active');
        sessionStorage.removeItem('winter_attire_admin_authed');
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined' && window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      if (sp.has('sheet') || sp.has('catalog') || sp.has('catalog_sheet') || sp.has('bookings') || sp.has('byungimuncil')) {
        try {
          window.history.replaceState({}, '', window.location.pathname);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Cart State (Initialized clean - user selects what they want)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isLayeringGuideOpen, setIsLayeringGuideOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsModalTab, setTermsModalTab] = useState<TermsModalTab>('howToRent');

  const handleOpenTermsModal = (tab: TermsModalTab = 'howToRent') => {
    setTermsModalTab(tab);
    setIsTermsModalOpen(true);
  };

  // Selected layers state (sub-bab individual selection)
  const [layerSelection, setLayerSelection] = useState<Record<string, boolean>>({
    outer: true,
    mid: true,
    base: true,
    accessory: true
  });

  // Calculate recommendation result dynamically with REAL-TIME availability check
  const recommendationResult = useMemo<RecommendationResult>(() => {
    const dest =
      DESTINATIONS.find((d) => d.id === formData.destinationId) || DESTINATIONS[0];
    const isSouthern = dest.region === 'Selandia Baru & Australia';
    const defaultMonth = isSouthern ? 7 : 12;
    const activeMonth = formData.month || defaultMonth;
    const climate =
      dest.months[activeMonth] ||
      dest.months[defaultMonth] ||
      dest.months[12] ||
      dest.months[1] ||
      Object.values(dest.months)[0];
    const avgTemp = (climate.min + climate.max) / 2;

    const feelsLikeMin = climate.min + (climate.feelsLikeOffset || 0);
    const feelsLikeMax = climate.max + (climate.feelsLikeOffset || 0);

    const outerwearTemplate = getOuterwearForTemp(avgTemp);
    const sizeResult = calculateWinterAttireSize(
      formData.gender,
      formData.height,
      formData.weight,
      formData.shoeSize || 39
    );

    // Determine outerwear category based on temperature
    let targetCategory: 'extreme' | 'regular' | 'spring_autumn' = 'extreme';
    if (avgTemp > 10) {
      targetCategory = 'spring_autumn';
    } else if (avgTemp > 5) {
      targetCategory = 'regular';
    } else if (avgTemp > -5) {
      targetCategory = 'regular';
    } else {
      targetCategory = 'extreme';
    }

    // Filter candidate outerwear coats from dynamic catalogProducts (synchronized with Katalog & Size)
    const outerwearCandidates = catalogProducts.filter((p) => {
      const kat = (p.kategori || '').toLowerCase();
      const nama = (p.nama_produk || '').toLowerCase();
      const isBaseOrAcc =
        kat.includes('thermal') ||
        kat.includes('heattech') ||
        kat.includes('base') ||
        kat.includes('access') ||
        kat.includes('aksesoris') ||
        kat.includes('boot') ||
        kat.includes('sleepwear') ||
        nama.includes('heattech') ||
        nama.includes('sarung tangan') ||
        nama.includes('glove') ||
        nama.includes('beanie');
      return !isBaseOrAcc;
    });

    const coatsList = outerwearCandidates.length > 0 ? outerwearCandidates : catalogProducts;

    // Check availability for all candidate coats on user's travel dates
    const coatsWithAvailability = coatsList.map((coat) => {
      const avail = checkProductAvailability(
        coat.kode_produk,
        formData.startDate,
        formData.endDate,
        bookings
      );
      const isSizeMatch =
        (coat.size_wa || '').toUpperCase().includes(sizeResult.size.toUpperCase()) ||
        (coat.size_wa || '').toUpperCase().includes('ALL') ||
        (coat.size_wa || '').toUpperCase().includes('FREE');

      const katLower = (coat.kategori || '').toLowerCase();
      const isTierMatch =
        targetCategory === 'extreme'
          ? katLower.includes('extreme') || katLower.includes('puffer') || (coat.rekomendasi_suhu || '').includes('-')
          : targetCategory === 'regular'
          ? !katLower.includes('spring')
          : true;

      return { coat, avail, isSizeMatch, isTierMatch };
    });

    // Best choice: matching temperature tier, user size, AND available for selected dates!
    let chosenEntry = coatsWithAvailability.find(
      (entry) => entry.isTierMatch && entry.isSizeMatch && entry.avail.isAvailable
    );

    // If none found with both, try matching user size and available
    if (!chosenEntry) {
      chosenEntry = coatsWithAvailability.find(
        (entry) => entry.isSizeMatch && entry.avail.isAvailable
      );
    }

    // If none found with size match and available, try any available coat in that temperature tier
    if (!chosenEntry) {
      chosenEntry = coatsWithAvailability.find(
        (entry) => entry.isTierMatch && entry.avail.isAvailable
      );
    }

    // If still none, try any available coat
    if (!chosenEntry) {
      chosenEntry = coatsWithAvailability.find((entry) => entry.avail.isAvailable);
    }

    // If all are booked, pick first size match or first coat in tier
    if (!chosenEntry && coatsWithAvailability.length > 0) {
      chosenEntry =
        coatsWithAvailability.find((entry) => entry.isSizeMatch) ||
        coatsWithAvailability[0];
    }

    const chosenCoat = chosenEntry?.coat;
    const isCoatAvailable = chosenEntry ? chosenEntry.avail.isAvailable : true;
    const durationDays = calculateRentalDays(formData.startDate, formData.endDate) || formData.duration || 9;

    // Accurate tiered pricing based on travel duration
    const coatPricing = chosenCoat ? calculateTieredRentalPrice(chosenCoat, durationDays) : null;
    const coatDailyPrice = coatPricing
      ? Math.round(coatPricing.rentalFee / durationDays)
      : outerwearTemplate.dailyPrice;
    const coatRentalFee = coatPricing ? coatPricing.rentalFee : coatDailyPrice * durationDays;
    const coatRental3Days = chosenCoat?.harga_sewa_3_hari || (outerwearTemplate.dailyPrice * 3);

    const coatPhoto = chosenCoat
      ? (chosenCoat.link_foto_produk || chosenCoat.link_foto_spek)
      : (COMPLETE_PRODUCT_CATALOG[0]?.imageUrl || '');

    const outerwear: OuterwearItem = {
      id: chosenCoat ? chosenCoat.kode_produk : outerwearTemplate.code,
      name: chosenCoat ? chosenCoat.nama_produk : outerwearTemplate.name,
      brand: outerwearTemplate.brand,
      code: chosenCoat ? chosenCoat.kode_produk : outerwearTemplate.code,
      tempRange: chosenCoat ? (chosenCoat.rekomendasi_suhu || outerwearTemplate.tempRange) : outerwearTemplate.tempRange,
      category: chosenCoat ? (chosenCoat.kategori || outerwearTemplate.category) : outerwearTemplate.category,
      badgeColor: outerwearTemplate.badgeColor,
      description: chosenCoat ? (chosenCoat.fitur_spesial || outerwearTemplate.description) : outerwearTemplate.description,
      materials: outerwearTemplate.materials,
      dailyPrice: coatDailyPrice,
      minTempThreshold: outerwearTemplate.minTempThreshold,
      maxTempThreshold: outerwearTemplate.maxTempThreshold,
      recommendedFor: outerwearTemplate.recommendedFor
    };

    // Find real matching layers from dynamic catalogProducts (Katalog & Size)
    // 1. Base Layer: prioritize H7 Set if available
    const dynamicBaseProd =
      catalogProducts.find((p) => {
        const kode = (p.kode_produk || '').toLowerCase();
        const nama = (p.nama_produk || '').toLowerCase();
        return kode === 'h7' || (nama.includes('heattech') && nama.includes('set'));
      }) ||
      catalogProducts.find((p) => {
        const kat = (p.kategori || '').toLowerCase();
        const nama = (p.nama_produk || '').toLowerCase();
        const kode = (p.kode_produk || '').toLowerCase();
        return (
          kat.includes('thermal') ||
          kat.includes('heattech') ||
          kat.includes('base') ||
          nama.includes('heattech') ||
          nama.includes('thermal') ||
          kode.includes('h7')
        );
      });

    // 2. Mid Layer: prioritize authentic Puffer Vest (P4 / R1 / R3) or vest/mid layer from catalog
    const dynamicMidProd =
      catalogProducts.find((p) => {
        const kode = (p.kode_produk || '').toLowerCase();
        return kode === 'p4' || kode === 'r1' || kode === 'r3';
      }) ||
      catalogProducts.find((p) => {
        const kat = (p.kategori || '').toLowerCase();
        const nama = (p.nama_produk || '').toLowerCase();
        return (
          nama.includes('puffer vest') ||
          nama.includes('vest') ||
          kat.includes('vest') ||
          kat.includes('mid')
        );
      }) ||
      catalogProducts.find((p) => {
        const kode = (p.kode_produk || '').toLowerCase();
        return kode === 'r8' || kode === 'r9' || kode === 'p3';
      });

    // 3. Aksesori: prioritize P7/P8 ski gloves
    const dynamicAccProd =
      catalogProducts.find((p) => {
        const kode = (p.kode_produk || '').toLowerCase();
        return kode === 'p7' || kode === 'p8';
      }) ||
      catalogProducts.find((p) => {
        const kat = (p.kategori || '').toLowerCase();
        const nama = (p.nama_produk || '').toLowerCase();
        return (
          (nama.includes('ski') && nama.includes('glove')) ||
          (nama.includes('sarung tangan') && nama.includes('waterproof')) ||
          kat.includes('access') ||
          kat.includes('aksesoris') ||
          nama.includes('glove') ||
          nama.includes('sarung tangan') ||
          nama.includes('beanie')
        );
      });

    // Calculate tiered prices for each layer item
    const midPricing = dynamicMidProd ? calculateTieredRentalPrice(dynamicMidProd, durationDays) : null;
    const midDailyPrice = midPricing ? Math.round(midPricing.rentalFee / durationDays) : 35000;
    const midRentalFee = midPricing ? midPricing.rentalFee : midDailyPrice * durationDays;
    const midRental3Days = dynamicMidProd?.harga_sewa_3_hari || 80000;

    const basePricing = dynamicBaseProd ? calculateTieredRentalPrice(dynamicBaseProd, durationDays) : null;
    const baseDailyPrice = basePricing ? Math.round(basePricing.rentalFee / durationDays) : 25000;
    const baseRentalFee = basePricing ? basePricing.rentalFee : baseDailyPrice * durationDays;
    const baseRental3Days = dynamicBaseProd?.harga_sewa_3_hari || 55000;

    const accPricing = dynamicAccProd ? calculateTieredRentalPrice(dynamicAccProd, durationDays) : null;
    const accDailyPrice = accPricing ? Math.round(accPricing.rentalFee / durationDays) : 20000;
    const accRentalFee = accPricing ? accPricing.rentalFee : accDailyPrice * durationDays;
    const accRental3Days = dynamicAccProd?.harga_sewa_3_hari || 45000;

    // Build 4 layers array with real photos and specs from live collection
    const layers: LayerItem[] = [
      {
        id: 'outer',
        layer: 'outer',
        layerNumber: 3,
        title: 'Layer 3: Outerwear Shield',
        subtitle: isCoatAvailable ? 'Lapisan Luar Penahan Angin & Salju (Tersedia)' : 'Lapisan Luar Penahan Angin & Salju',
        productName: chosenCoat ? chosenCoat.nama_produk : outerwearTemplate.name,
        productCode: chosenCoat ? chosenCoat.kode_produk : 'OUTER',
        categoryLabel: chosenCoat?.kategori || outerwearTemplate.category,
        description: chosenCoat ? (chosenCoat.fitur_spesial || chosenCoat.rekomendasi_suhu) : outerwearTemplate.description,
        dailyPrice: coatDailyPrice,
        rental3Days: coatRental3Days,
        rentalFee: coatRentalFee,
        durationDays,
        icon: 'jacket',
        selected: layerSelection['outer'] ?? true,
        tag: isCoatAvailable ? 'Siap Sewa di Tanggal Ini' : 'Sudah Tersewa',
        imageUrl: coatPhoto,
        secondaryUrl: chosenCoat?.link_foto_spek,
        dynamicProduct: chosenCoat,
        weightGram: chosenCoat ? chosenCoat.berat_gram : 750,
        specsText: chosenCoat
          ? `Berat ${chosenCoat.berat_gram}g | Panjang ${chosenCoat.panjang_cm || 70}cm | LD max ${chosenCoat.lingkar_dada_max_cm || 110}cm`
          : 'Insulasi Bulu Angsa Windproof'
      },
      {
        id: 'mid',
        layer: 'mid',
        layerNumber: 2,
        title: 'Layer 2: Mid Layer Insulation',
        subtitle: 'Penjebak Panas Tubuh',
        productName: dynamicMidProd ? dynamicMidProd.nama_produk : 'U.S. Polo Assn Puffer Vest',
        productCode: dynamicMidProd ? dynamicMidProd.kode_produk : 'P4',
        categoryLabel: dynamicMidProd?.kategori || 'Puffer Vest Insulation',
        description: dynamicMidProd
          ? (dynamicMidProd.fitur_spesial || 'Menangkap udara panas tubuh tanpa membuat sesak nafas; fleksibel saat masuk ke ruangan berpenghangat.')
          : 'Rompi puffer berinsulasi hangat untuk mengunci panas tubuh bagian inti (core warmth) dengan fleksibilitas gerak lengan maksimal.',
        dailyPrice: midDailyPrice,
        rental3Days: midRental3Days,
        rentalFee: midRentalFee,
        durationDays,
        icon: 'shirt',
        selected: layerSelection['mid'] ?? true,
        imageUrl: dynamicMidProd
          ? (dynamicMidProd.link_foto_produk || dynamicMidProd.link_foto_spek)
          : 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
        secondaryUrl: dynamicMidProd?.link_foto_spek,
        dynamicProduct: dynamicMidProd,
        weightGram: dynamicMidProd?.berat_gram || 550,
        specsText: dynamicMidProd
          ? `Rompi insulasi hangat (${dynamicMidProd.berat_gram || 550}g) | Size ${dynamicMidProd.size_wa || 'S-M'}`
          : 'Rompi insulasi hangat (550g) | Size equal to S-M'
      },
      {
        id: 'base',
        layer: 'base',
        layerNumber: 1,
        title: 'Layer 1: Base Layer Thermo-Regulation',
        subtitle: 'Kontak Langsung Kulit',
        productName: dynamicBaseProd ? dynamicBaseProd.nama_produk : 'Ultra Warm Heattech Innerwear (Top + Bottom - H7)',
        productCode: dynamicBaseProd ? dynamicBaseProd.kode_produk : 'H7 Series',
        categoryLabel: dynamicBaseProd?.kategori || 'Thermal Base Layer',
        description: dynamicBaseProd
          ? (dynamicBaseProd.fitur_spesial || 'Setelan atasan + bawahan untuk menguapkan keringat agar tubuh tidak membeku basah, menjaga sirkulasi termal tubuh tetap optimal.')
          : 'Setelan atasan + bawahan untuk menguapkan keringat agar tubuh tidak membeku basah, menjaga sirkulasi termal tubuh tetap optimal.',
        dailyPrice: baseDailyPrice,
        rental3Days: baseRental3Days,
        rentalFee: baseRentalFee,
        durationDays,
        icon: 'layers',
        selected: layerSelection['base'] ?? true,
        imageUrl: dynamicBaseProd
          ? (dynamicBaseProd.link_foto_produk || dynamicBaseProd.link_foto_spek)
          : 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
        secondaryUrl: dynamicBaseProd?.link_foto_spek,
        dynamicProduct: dynamicBaseProd,
        weightGram: dynamicBaseProd?.berat_gram || 370,
        specsText: dynamicBaseProd
          ? `Set Atasan + Celana (${dynamicBaseProd.berat_gram || 370}g) | Size ${dynamicBaseProd.size_wa || 'All Size'}`
          : 'Set Atasan + Celana (370g) | LD 94cm | LP 98cm (BB 60-70 kg)'
      },
      {
        id: 'accessory',
        layer: 'accessory',
        title: 'Aksesoris Wajib Ekstremitas',
        subtitle: 'Perlindungan Jari & Telinga',
        productName: dynamicAccProd ? dynamicAccProd.nama_produk : 'Waterproof Ski Gloves (P7 / P8) + Polar Beanie',
        productCode: dynamicAccProd ? dynamicAccProd.kode_produk : 'P7 / P8 Series',
        categoryLabel: dynamicAccProd?.kategori || 'Accessories',
        description: dynamicAccProd
          ? (dynamicAccProd.fitur_spesial || 'Mencegah radang dingin (frostnip) pada telinga dan ujung jari tangan; material tahan salju.')
          : 'Mencegah radang dingin (frostnip) pada telinga dan ujung jari tangan; material waterproof tidak akan basah saat bermain lempar salju.',
        dailyPrice: accDailyPrice,
        rental3Days: accRental3Days,
        rentalFee: accRentalFee,
        durationDays,
        icon: 'sparkles',
        selected: layerSelection['accessory'] ?? true,
        imageUrl: dynamicAccProd
          ? (dynamicAccProd.link_foto_produk || dynamicAccProd.link_foto_spek)
          : 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?q=80&w=800&auto=format&fit=crop',
        secondaryUrl: dynamicAccProd?.link_foto_spek,
        dynamicProduct: dynamicAccProd,
        weightGram: dynamicAccProd?.berat_gram || 200,
        specsText: dynamicAccProd
          ? `${dynamicAccProd.nama_produk} (${dynamicAccProd.berat_gram || 200}g) | Size ${dynamicAccProd.size_wa || 'All Size'}`
          : '100% Waterproof Ski Gloves (200g) + Polar Beanie'
      }
    ];

    // Compute prices
    const totalDailyPrice = layers
      .filter((l) => l.selected)
      .reduce((sum, item) => sum + item.dailyPrice, 0);

    const grandTotal = totalDailyPrice * formData.duration;

    return {
      destination: dest,
      month: formData.month,
      climate,
      avgTemp,
      feelsLikeMin,
      feelsLikeMax,
      sizeResult,
      outerwear,
      layers,
      totalDailyPrice,
      duration: formData.duration,
      grandTotal,
      userProfile: {
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        shoeSize: formData.shoeSize || 39
      }
    };
  }, [formData, layerSelection, bookings, catalogProducts]);

  const handleFormChange = (data: Partial<UserFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleToggleLayer = (layerId: string) => {
    setLayerSelection((prev) => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const handleSelectAllLayers = () => {
    setLayerSelection({
      outer: true,
      mid: true,
      base: true,
      accessory: true
    });
  };

  // Cart operations
  const handleAddToCart = (product: CatalogProduct | CartItem | DynamicCatalogProduct) => {
    // If passed as a prepared CartItem
    if ('categoryLabel' in product && 'dailyPrice' in product && 'waSize' in product && 'weightGram' in product && 'code' in product) {
      const cartItem = product as CartItem;
      setCartItems((prev) => {
        const existing = prev.find((item) => item.code === cartItem.code);
        if (existing) {
          return prev.filter((item) => item.code !== cartItem.code);
        }
        return [...prev, cartItem];
      });
      return;
    }

    // If passed as DynamicCatalogProduct
    if ('kode_produk' in product) {
      const p = product as DynamicCatalogProduct;
      const pricing = calculateTieredRentalPrice(p, formData.duration || 9);
      const cartItem: CartItem = {
        code: p.kode_produk,
        name: p.nama_produk,
        categoryLabel: p.kategori,
        waSize: p.size_wa,
        dailyPrice: Math.round(pricing.rentalFee / (formData.duration || 9)),
        imageUrl: convertGoogleDriveImageUrl(p.link_foto_produk),
        weightGram: p.berat_gram,
        specsText: `${p.warna} | LD Max ${p.lingkar_dada_max_cm}cm | Pjg ${p.panjang_cm}cm`,
        quantity: 1,
        rentalFee: pricing.rentalFee,
        depositFee: pricing.depositFee,
        totalInitialPayment: pricing.totalInitialPayment,
        durationDays: formData.duration || 9,
        specPhotoUrl: convertGoogleDriveImageUrl(p.link_foto_spek),
        dynamicProduct: p
      };

      setCartItems((prev) => {
        const existing = prev.find((item) => item.code === p.kode_produk);
        if (existing) {
          return prev.filter((item) => item.code !== p.kode_produk);
        }
        return [...prev, cartItem];
      });
      return;
    }

    // Legacy CatalogProduct
    const prod = product as CatalogProduct;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.code === prod.code);
      if (existing) {
        // Toggle out if clicked again
        return prev.filter((item) => item.code !== prod.code);
      }
      return [
        ...prev,
        {
          code: prod.code,
          name: prod.name,
          brand: prod.brand,
          categoryLabel: prod.categoryLabel,
          waSize: prod.waSize,
          dailyPrice: prod.dailyPrice,
          imageUrl: prod.imageUrl,
          weightGram: prod.weightGram,
          specsText: prod.specialFeatures.join(', '),
          quantity: 1
        }
      ];
    });
  };

  const handleAddLayerToCart = (layer: LayerItem) => {
    const code = layer.productCode || `LAYER-${layer.id.toUpperCase()}`;
    const matchedDyn = catalogProducts.find(
      (p) => p.kode_produk.toLowerCase() === code.toLowerCase()
    );
    setCartItems((prev) => {
      const existing = prev.find((item) => item.code === code);
      if (existing) {
        return prev.filter((item) => item.code !== code);
      }
      return [
        ...prev,
        {
          code,
          name: layer.productName,
          categoryLabel: layer.subtitle,
          waSize: `Size ${recommendationResult.sizeResult.size}`,
          dailyPrice: layer.dailyPrice,
          imageUrl: layer.imageUrl || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
          weightGram: layer.weightGram || 400,
          specsText: layer.specsText || layer.description,
          quantity: 1,
          layerTag: layer.title,
          dynamicProduct: matchedDyn
        }
      ];
    });
  };

  const handleAddAllSelectedLayersToCart = () => {
    const selectedLayers = recommendationResult.layers.filter((l) => l.selected);
    selectedLayers.forEach((layer) => {
      const code = layer.productCode || `LAYER-${layer.id.toUpperCase()}`;
      const matchedDyn = catalogProducts.find(
        (p) => p.kode_produk.toLowerCase() === code.toLowerCase()
      );
      setCartItems((prev) => {
        if (prev.some((item) => item.code === code)) return prev;
        return [
          ...prev,
          {
            code,
            name: layer.productName,
            categoryLabel: layer.subtitle,
            waSize: `Size ${recommendationResult.sizeResult.size}`,
            dailyPrice: layer.dailyPrice,
            imageUrl: layer.imageUrl || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
            weightGram: layer.weightGram || 400,
            specsText: layer.specsText || layer.description,
            quantity: 1,
            layerTag: layer.title,
            dynamicProduct: matchedDyn
          }
        ];
      });
    });
  };

  const handleRemoveFromCart = (code: string) => {
    setCartItems((prev) => prev.filter((item) => item.code !== code));
  };

  const handleUpdateQuantity = (code: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.code === code ? { ...item, quantity } : item))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartItemCodes = useMemo(() => cartItems.map((c) => c.code), [cartItems]);
  const cartTotalFee = useMemo(
    () => cartItems.reduce((acc, c) => acc + (c.rentalFee || (c.dailyPrice * 3)), 0),
    [cartItems]
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#BCE4E8] selection:text-[#0D262B] relative overflow-x-hidden">
      {/* Ambient Aurora Borealis Glow Backdrop (Pastel Blue & Pastel Green) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] bg-gradient-to-br from-teal-200/40 via-emerald-200/30 to-sky-200/35 rounded-full blur-3xl animate-aurora-slow" />
        <div
          className="absolute top-1/3 -right-24 w-[480px] h-[480px] bg-gradient-to-bl from-sky-200/35 via-teal-200/25 to-emerald-200/30 rounded-full blur-3xl animate-aurora-slow"
          style={{ animationDelay: '-6s' }}
        />
        <div className="absolute bottom-16 left-12 w-[420px] h-[420px] bg-gradient-to-tr from-emerald-100/30 via-teal-100/25 to-sky-200/30 rounded-full blur-3xl" />
      </div>

      {/* Header with Multi-Page Navigation */}
      <Header
        activePage={activePage}
        onPageChange={(page) => setActivePage(page)}
        cartCount={cartItems.length}
        onOpenLayeringGuide={() => setIsLayeringGuideOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenTermsModal={handleOpenTermsModal}
      />

      {/* Page Content Container with safe bottom padding for mobile bottom bar */}
      <main className="flex-1 max-w-6xl w-full max-w-full overflow-x-hidden mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-28 md:pb-16">
        {/* PAGE 1: SMART RENTAL ADVISOR */}
        {activePage === 'advisor' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Hero Section: Ultra-Minimalist & Visual-First */}
            <section className="text-center max-w-2xl mx-auto mb-3 sm:mb-5">
              <h1 className="text-[18px] sm:text-[20px] font-bold text-[#0F2537] tracking-tight">
                Sewa Perlengkapan Musim Dingin Teruji
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Kurasi outfit sesuai suhu &amp; ukuran tubuhmu dalam 30 detik.
              </p>

              {/* 3 Pills / Badge / Chips Ringkas (Maksimal 2-3 kata) */}
              <div className="mt-2.5 sm:mt-3 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 text-[11px] font-bold text-slate-700">
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                  <span>🧺</span>
                  <span>Laundry Included</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                  <span>❄️</span>
                  <span>Tested -30°C</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                  <span>🛡️</span>
                  <span>Deposit Refundable</span>
                </span>
              </div>
            </section>

            {/* 2-Column Responsive Layout: Form (Left 5 Cols) & Recommendation (Right 7 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form */}
              <section className="lg:col-span-5 space-y-5">
                <RentalForm
                  formData={formData}
                  onChange={handleFormChange}
                  onSubmit={() => {
                    const el = document.getElementById('recommendation-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  isAnalyzed={true}
                  bookingsCount={bookings.length}
                />
              </section>

              {/* Right Column: Recommendations */}
              <section id="recommendation-section" className="lg:col-span-7 scroll-mt-20">
                <RecommendationView
                  result={recommendationResult}
                  onToggleLayer={handleToggleLayer}
                  onSelectAllLayers={handleSelectAllLayers}
                  onAddToCart={handleAddToCart}
                  onAddLayerToCart={handleAddLayerToCart}
                  onAddAllSelectedToCart={handleAddAllSelectedLayersToCart}
                  cartItemCodes={cartItemCodes}
                  onGoToCart={() => setActivePage('cart')}
                  onGoToCatalog={(size) => {
                    if (size) setCatalogInitialSize(size);
                    setActivePage('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  bookings={bookings}
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  catalogProducts={catalogProducts}
                  onOpenTermsModal={handleOpenTermsModal}
                />
              </section>
            </div>
          </div>
        )}

        {/* PAGE 2: COMPLETE CATALOG WITH FILTERS */}
        {activePage === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
              <div>
                <span className="wa-badge-aurora text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Koleksi Resmi Winter Attire
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  Katalog Lengkap & Filter Ukuran
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pilih item sesuai suhu & ukuranmu, lalu klik <strong>+ Keranjang</strong> untuk
                  merangkum pesanan sewa.
                </p>
              </div>

              {cartItems.length > 0 && (
                <button
                  onClick={() => setActivePage('cart')}
                  className="bg-[#0C3B43] hover:bg-[#10515B] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-teal-300" />
                  <span>Lihat Keranjang ({cartItems.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <ProductCatalogSection
              products={catalogProducts}
              onAddToCart={handleAddToCart}
              onViewCart={() => setActivePage('cart')}
              cartItemCodes={cartItemCodes}
              initialSize={catalogInitialSize}
              startDate={formData.startDate}
              endDate={formData.endDate}
              bookings={bookings}
            />
          </div>
        )}

        {/* PAGE 3: SHOPPING CART & WHATSAPP GENERATOR */}
        {activePage === 'cart' && (
          <div className="animate-fadeIn">
            <CartView
              cartItems={cartItems}
              items={cartItems}
              duration={formData.duration}
              catalogProducts={catalogProducts}
              onUpdateDuration={(d) => setFormData((prev) => ({ ...prev, duration: d }))}
              onDurationChange={(d) => setFormData((prev) => ({ ...prev, duration: d }))}
              onRemoveItem={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onClearCart={handleClearCart}
              onNavigateToCatalog={() => setActivePage('catalog')}
              onContinueShopping={() => setActivePage('catalog')}
              onNavigateToAdvisor={() => setActivePage('advisor')}
              formData={formData}
              sizeResult={recommendationResult.sizeResult}
              destinationName={`${recommendationResult.destination.name}, ${recommendationResult.destination.country}`}
              onOpenTermsModal={handleOpenTermsModal}
            />
          </div>
        )}

        {/* PAGE 4: HOW TO RENT & BRAND HIGHLIGHTS */}
        {activePage === 'guide' && (
          <div className="space-y-10 animate-fadeIn">
            <HowToRentSection
              onGoToCart={() => setActivePage('cart')}
              onGoToCatalog={() => setActivePage('catalog')}
            />
            <BrandHighlights />
          </div>
        )}
      </main>

      {/* Footer (with bottom margin on mobile to clear bottom navigation) */}
      <footer className="border-t border-[#BCE4E8] bg-white/90 backdrop-blur-md py-8 mb-16 md:mb-0 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div className="text-left">
              <a
                href="https://instagram.com/winterattire.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-teal-900 hover:text-teal-950 block"
              >
                @winterattire.id ↗
              </a>
              <span className="text-[11px] text-slate-500">
                Official Winter Rental Service •{' '}
                <a
                  href={`https://wa.me/6282135100969?text=${encodeURIComponent('Halo Admin Winter Attire, saya ingin bertanya seputar sewa perlengkapan winter.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-800 font-bold hover:underline"
                >
                  Konsultasi Cepat via WhatsApp
                </a>
              </span>
            </div>
          </div>
          <div className="text-center sm:text-right flex flex-col sm:items-end">
            <div>Smart Rental Advisor & Sustainable Winter Wardrobe.</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Pick Up / GO-SEND (Jakarta) & JNE YES (Luar Kota). Free Laundry Included.
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-center sm:justify-end gap-3 text-[10.5px] flex-wrap">
              <span className="text-slate-400">© Winter Attire Indonesia</span>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => handleOpenTermsModal('howToRent')}
                className="text-teal-800 hover:text-teal-950 transition flex items-center gap-1 cursor-pointer font-bold"
                title="Buka Cara Sewa & Syarat Ketentuan Resmi"
              >
                <FileText className="w-3 h-3 text-teal-700" />
                <span>Cara Sewa & Syarat Ketentuan (T&C)</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InventoryModal isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />
      <LayeringGuideModal
        isOpen={isLayeringGuideOpen}
        onClose={() => setIsLayeringGuideOpen(false)}
      />
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        initialTab={termsModalTab}
      />
    </div>
  );
};
