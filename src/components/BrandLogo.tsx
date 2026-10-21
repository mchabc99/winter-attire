import React, { useId } from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero' | 'full';
  className?: string;
  rounded?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  rounded = true,
  onClick
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const gradId = `waRibbonGradient_${uniqueId}`;
  const stripesId = `waStripes_${uniqueId}`;

  // Proportions matching the attached image (9:10 portrait card), elegantly sized
  const sizeClasses = {
    xs: 'w-7 aspect-[9/10]',
    sm: 'w-11 sm:w-12 aspect-[9/10]',
    md: 'w-18 sm:w-20 aspect-[9/10]',
    lg: 'w-24 sm:w-28 aspect-[9/10]',
    hero: 'w-28 sm:w-32 md:w-36 aspect-[9/10]', // refined, slightly smaller as requested
    full: 'w-full max-w-44 aspect-[9/10]'
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none transition-transform duration-300 ${
        rounded ? 'rounded-2xl border border-[#A5D9DF]/90 shadow-sm' : ''
      } ${sizeClasses[size]} ${className}`}
      title="Winter Attire Official Brand Logo"
    >
      <svg
        viewBox="0 0 540 600"
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Authentic Aurora ribbon gradient: Periwinkle -> Sky Blue -> Aurora Turquoise -> Pastel Mint Green */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93A4EB" />
            <stop offset="32%" stopColor="#72BCE7" />
            <stop offset="66%" stopColor="#5CCFBE" />
            <stop offset="100%" stopColor="#4FD37C" />
          </linearGradient>

          {/* Delicate vertical pinstripes texture */}
          <pattern id={stripesId} width="4.5" height="12" patternUnits="userSpaceOnUse">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="12"
              stroke="#003540"
              strokeWidth="0.75"
              strokeOpacity="0.16"
            />
          </pattern>
        </defs>

        {/* Ice-blue background card (sampled from attached image #B8E2E8) */}
        <rect width="540" height="600" rx="36" fill="#B8E2E8" />

        {/* Monogram WA: Classic Black Serif Letters with Interlocking Ligature (Uncropped, as-is) */}
        <text
          x="270"
          y="350"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, 'Didot', 'Times New Roman', serif"
          fontWeight="900"
          fontSize="305"
          fill="#000000"
          letterSpacing="-31px"
        >
          WA
        </text>

        {/* Flowing Wave Banner Ribbon */}
        <g>
          {/* Base ribbon with smooth 4-color aurora pastel gradient */}
          <path
            d="M 54,444 C 145,416 290,402 410,390 C 455,385 475,374 484,364 L 484,462 C 475,474 455,485 410,490 C 290,502 145,516 54,528 Z"
            fill={`url(#${gradId})`}
          />

          {/* Vertical pinstripe texture */}
          <path
            d="M 54,444 C 145,416 290,402 410,390 C 455,385 475,374 484,364 L 484,462 C 475,474 455,485 410,490 C 290,502 145,516 54,528 Z"
            fill={`url(#${stripesId})`}
          />

          {/* Lower-left 4-pointed sparkle star */}
          <path
            d="M 98,495 Q 98,503 90,503 Q 98,503 98,511 Q 98,503 106,503 Q 98,503 98,495 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />

          {/* Upper-right 4-pointed sparkle star */}
          <path
            d="M 462,382 Q 462,388 456,388 Q 462,388 462,394 Q 462,388 468,388 Q 462,388 462,382 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />

          {/* Ribbon typography: Winter Attire (Original wording, as-is in the logo) */}
          <g transform="rotate(-2.2 270 455)">
            <text
              x="270"
              y="464"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="44"
              fill="#000000"
              letterSpacing="-0.5px"
            >
              Winter Attire
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
