import React, { useState, useEffect, useMemo } from 'react';
import {
  getDirectDriveImg,
  getGoogleDriveImageCandidates,
  extractGoogleDriveFileId,
  isGoogleDriveFolder,
  DEFAULT_PRODUCT_FALLBACK_IMAGE
} from '../services/catalogService';
import {
  Image as ImageIcon
} from 'lucide-react';

interface SafeProductImageProps {
  src?: string;
  secondarySrc?: string;
  alt: string;
  className?: string;
  category?: string;
  code?: string;
  objectFit?: 'cover' | 'contain';
  showOriginalLink?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  cacheKey?: string | number;
}

export const SafeProductImage: React.FC<SafeProductImageProps> = ({
  src,
  secondarySrc,
  alt,
  className = 'w-full h-full object-cover',
  category = '',
  code = '',
  objectFit = 'cover',
  showOriginalLink = false,
  onLoad,
  onError,
  fallbackSrc,
  cacheKey
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [allCandidatesFailed, setAllCandidatesFailed] = useState(false);
  const [localCacheBuster, setLocalCacheBuster] = useState<number | null>(null);

  const cleanSrc = (src || '').trim();
  const isFolder = isGoogleDriveFolder(cleanSrc);
  const isDriveFile = Boolean(extractGoogleDriveFileId(cleanSrc));

  // Consistent official Winter Attire logo fallback with #C2E6ED background (never random Unsplash/Picsum)
  const defaultFallback = fallbackSrc || DEFAULT_PRODUCT_FALLBACK_IMAGE;

  // Effective cache-buster (uses either parent cacheKey or user's local retry timestamp)
  const effectiveCacheBuster = localCacheBuster || cacheKey || null;

  // Direct LH3 Google Drive URL conversion
  const directDriveUrl = getDirectDriveImg(cleanSrc);
  const secondaryDirectDriveUrl = secondarySrc ? getDirectDriveImg(secondarySrc.trim()) : '';

  // Generate prioritized candidates with cache-busting support
  const candidates = useMemo(() => {
    // If it's a folder, do not try to render as an image tag
    if (isFolder) return [];

    const list: string[] = [];

    // 1. Primary direct lh3 CDN URL (requested direct format)
    if (directDriveUrl) {
      if (effectiveCacheBuster && directDriveUrl.startsWith('http')) {
        const sep = directDriveUrl.includes('?') ? '&' : '?';
        list.push(`${directDriveUrl}${sep}_cb=${effectiveCacheBuster}`);
      }
      list.push(directDriveUrl);
    }

    // 2. Primary source candidates (Drive thumbnails & download endpoints)
    if (cleanSrc) {
      const primaryCandidates = getGoogleDriveImageCandidates(cleanSrc, effectiveCacheBuster || undefined);
      list.push(...primaryCandidates);
    }

    // 3. Secondary source candidates (e.g. foto spek <-> foto produk)
    if (secondaryDirectDriveUrl && secondaryDirectDriveUrl !== directDriveUrl) {
      list.push(secondaryDirectDriveUrl);
    }
    if (secondarySrc && secondarySrc.trim() && secondarySrc.trim() !== cleanSrc) {
      const secondaryCandidates = getGoogleDriveImageCandidates(secondarySrc.trim(), effectiveCacheBuster || undefined);
      list.push(...secondaryCandidates);
    }

    // Deduplicate candidate URLs
    return Array.from(new Set(list.filter(Boolean)));
  }, [cleanSrc, secondarySrc, isFolder, directDriveUrl, secondaryDirectDriveUrl, effectiveCacheBuster]);

  // Reset states when source changes or parent cacheKey changes
  useEffect(() => {
    setCandidateIndex(0);
    setHasLoaded(false);
    setAllCandidatesFailed(false);
  }, [cleanSrc, secondarySrc, cacheKey]);

  // Auto-retry when user returns to this browser tab after changing Google Drive permissions
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && allCandidatesFailed && isDriveFile) {
        setLocalCacheBuster(Date.now());
        setCandidateIndex(0);
        setHasLoaded(false);
        setAllCandidatesFailed(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [allCandidatesFailed, isDriveFile]);

  const currentCandidateUrl = candidates[candidateIndex] || '';

  const handleImageError = () => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setAllCandidatesFailed(true);
      if (onError) onError();
    }
  };

  const handleImageLoad = () => {
    setHasLoaded(true);
    if (onLoad) onLoad();
  };

  // Resolve active image URL: candidate or Winter Attire logo fallback (#C2E6ED)
  const activeUrl = allCandidatesFailed ? defaultFallback : (currentCandidateUrl || defaultFallback);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-100">
      {/* Loading Skeleton */}
      {!hasLoaded && (
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse flex items-center justify-center z-0">
          <ImageIcon className="w-8 h-8 text-slate-400 stroke-1" />
        </div>
      )}

      {/* Main Image Tag */}
      {activeUrl ? (
        <img
          key={activeUrl}
          src={activeUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${
            hasLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        />
      ) : (
        /* Fallback when completely empty */
        <div className="p-4 text-center text-slate-400 flex flex-col items-center justify-center w-full h-full bg-slate-50">
          <ImageIcon className="w-10 h-10 text-slate-300 stroke-1 mb-1.5" />
          <p className="text-xs font-bold text-slate-600 line-clamp-1">{alt}</p>
          {code && (
            <span className="mt-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              Kode: {code}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

