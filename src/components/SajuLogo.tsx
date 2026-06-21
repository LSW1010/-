import React from 'react';
import { getSiteConfig } from '../data/db';

interface SajuLogoProps {
  className?: string;
  size?: number;
}

export default function SajuLogo({ className = '', size = 40 }: SajuLogoProps) {
  const config = getSiteConfig();
  const mode = config.logoMode || 'traditional';
  const logoColor = config.logoColor || '#0B2240';
  const logoText = config.logoText || '공방';
  const logoEmoji = config.logoEmoji || '🏯';
  const logoImage = config.logoImage || '';

  if (mode === 'image' && logoImage) {
    return (
      <div 
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`flex items-center justify-center select-none shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white hover:scale-105 transition-all duration-300 ${className}`}
      >
        <img
          src={logoImage}
          alt="사주공방 로고"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (mode === 'text') {
    return (
      <div 
        style={{ color: logoColor, borderColor: logoColor, width: `${size}px`, height: `${size}px` }}
        className={`flex items-center justify-center font-serif text-center select-none shrink-0 border-2 rounded-lg font-black bg-[#FDFCF8] shadow-[2px_2px_0px_0px_rgba(45,41,38,0.15)] hover:scale-105 transition-transform duration-300 ${className}`}
      >
        <span 
          style={{ fontSize: `${size * 0.4}px`, lineHeight: 1 }}
          className="px-2 py-1 tracking-tight"
        >
          {logoText}
        </span>
      </div>
    );
  }

  if (mode === 'emoji') {
    return (
      <div 
        className={`flex items-center justify-center select-none shrink-0 border-2 rounded-full hover:scale-105 transition-transform duration-300 ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: logoColor,
          backgroundColor: `${logoColor}10`
        }}
      >
        <span style={{ fontSize: `${size * 0.55}px` }}>
          {logoEmoji}
        </span>
      </div>
    );
  }

  // default: 'traditional' Mode
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`select-none shrink-0 transition-all duration-300 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: logoColor }}
    >
      {/* Outer elegant double ring representing cosmology and boundaries */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeOpacity="0.95"
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.7"
      />

      {/* Crescent Moon on the left, representing moonlight, intuition, and Yin energy */}
      <path
        d="M 45,21 C 31,23 21,34 21,48 C 21,62 31,73 45,75 C 36,72 30,62 30,48 C 30,34 36,24 45,21 Z"
        fill="currentColor"
      />

      {/* Two refined four-pointed stars representing cosmic light and destiny */}
      {/* Star 1 (Larger) */}
      <path
        d="M 52,25.5 Q 52,29 55.5,29 Q 52,29 52,32.5 Q 52,29 48.5,29 Q 52,29 52,25.5 Z"
        fill="currentColor"
      />
      {/* Star 2 (Smaller) */}
      <path
        d="M 59,20 Q 59,22.2 61.2,22.2 Q 59,22.2 59,24.4 Q 59,22.2 56.8,22.2 Q 59,22.2 59,20 Z"
        fill="currentColor"
      />

      {/* Traditional Korean Hanok Pavilion Roof with upturned eaves */}
      <path
        d="M 45,47 C 50,45.8 54,40 64,40 C 74,40 78,45.8 83,47 C 81,48.2 79.5,49.2 78,49.2 M 45,47 C 46.5,48.2 48.5,49.2 50,49.2 L 78,49.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Roof under-eaves rafters details */}
      <path
        d="M 52,47 L 51,49.2 M 56,46 L 55,49.2 M 60,45.2 L 59,49.2 M 64,45.2 L 64,49.2 M 68,45.2 L 69,49.2 M 72,46 L 73,49.2 M 76,47 L 77,49.2"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* Hanok house pillars / main window beam structure */}
      <path
        d="M 53,49.2 L 53,60 L 75,60 L 75,49.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Lattice window detail lines */}
      <path
        d="M 57.4,51.5 L 57.4,58 M 61.8,51.5 L 61.8,58 M 66.2,51.5 L 66.2,58 M 70.6,51.5 L 70.6,58"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />

      {/* Styled traditional clouds/waves scroll elements at the bottom */}
      <path
        d="M 23,71.5 C 31,73.5 35.5,65.5 40.5,65.5 C 45.5,65.5 48.5,72.5 54.5,72.5 C 60.5,72.5 63.5,64.5 68.5,64.5 C 73.5,64.5 78.5,71.5 83.5,71.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left cloud-curl flourish */}
      <path
        d="M 37.5,68.5 C 36.5,65.5 33,63.5 30.5,65.5 C 28.5,67.5 30.5,71.5 34.5,71.5 C 38.5,71.5 41.5,67.5 39.5,63.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right cloud-curl flourish */}
      <path
        d="M 64.5,67.5 C 63.5,64.5 60.5,62.5 58.5,64.5 C 56.5,66.5 58.5,70.5 62.5,70.5 C 66.5,70.5 69.5,66.5 67.5,62.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
