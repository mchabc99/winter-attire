import React, { useState, useEffect, useMemo } from 'react';
import {
  getDirectDriveImg,
  getGoogleDriveImageCandidates,
  extractGoogleDriveFileId,
  isGoogleDriveFolder,
  resolveCatalogImageUrl,
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

  // Consistent official Winter Attire logo fallback with #C2E6ED background
  const defaultFallback = fallbackSrc || DEFAULT_PRODUCT_FALLBACK_IMAGE;

  // Effective cache-buster
  const effectiveCacheBuster = localCacheBuster || cacheKey || null;

  // Resolve Drive image URLs
  const resolution = useMemo(() => resolveCatalogImageUrl(cleanSrc), [cleanSrc]);
  const secondaryResolution = useMemo(
    () => (secondarySrc ? resolveCatalogImageUrl(secondarySrc.trim()) : null),
    [secondarySrc]
  );

  // Generate prioritized candidates: 1. lh3...=s800 -> 2. thumbnail?sz=w800 -> 3. original / secondary -> 4. fallback placeholder
  const candidates = useMemo(() => {
    if (isFolder) return [];

    const list: string[] = [];

    // 1. Direct src as provided (e.g. product.image from Apps Script)
    if (cleanSrc && cleanSrc.startsWith('http')) {
      if (effectiveCacheBuster) {
        const sep = cleanSrc.includes('?') ? '&' : '?';
        list.push(`${cleanSrc}${sep}_cb=${effectiveCacheBuster}`);
      }
      list.push(cleanSrc);
    }

    // 2. Google Fife direct CDN with optimal =s800
    if (resolution.primaryUrl && resolution.primaryUrl !== cleanSrc) {
      if (effectiveCacheBuster && resolution.primaryUrl.startsWith('http')) {
        const sep = resolution.primaryUrl.includes('?') ? '&' : '?';
        list.push(`${resolution.primaryUrl}${sep}_cb=${effectiveCacheBuster}`);
      }
      list.push(resolution.primaryUrl);
    }

    // 3. Fallback 1: Google Drive official thumbnail endpoint (sz=w800)
    if (resolution.thumbnailUrl && resolution.thumbnailUrl !== resolution.primaryUrl) {
      list.push(resolution.thumbnailUrl);
    }

    // 3. Fallback 2: lh3 without parameter or direct download endpoint
    if (resolution.isDrive && resolution.driveId) {
      list.push(`https://lh3.googleusercontent.com/d/${resolution.driveId}`);
      list.push(`https://drive.google.com/uc?export=view&id=${resolution.driveId}`);
    }

    // 4. Secondary source candidates (e.g. foto spek)
    if (secondaryResolution?.primaryUrl && secondaryResolution.primaryUrl !== resolution.primaryUrl) {
      list.push(secondaryResolution.primaryUrl);
      if (secondaryResolution.thumbnailUrl) {
        list.push(secondaryResolution.thumbnailUrl);
      }
    }

    // 5. Default product jacket placeholder
    list.push(defaultFallback);

    // Deduplicate candidate URLs
    return Array.from(new Set(list.filter(Boolean)));
  }, [cleanSrc, isFolder, resolution, secondaryResolution, effectiveCacheBuster, defaultFallback]);

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

