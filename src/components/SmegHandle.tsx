"use client";

import React from "react";

interface SmegHandleProps {
  className?: string;
  onClick?: () => void;
  title?: string;
}

/**
 * Authentic 1950s SMEG-style horizontal teardrop wing handle:
 * Features a circular chrome base on the left and a streamlined
 * tapered chrome wing pointing horizontally to the right.
 */
export const SmegHandle: React.FC<SmegHandleProps> = ({
  className = "",
  onClick,
  title = "Vintage refrigerator handle",
}) => {
  return (
    <div
      onClick={onClick}
      title={title}
      className={`group relative flex items-center cursor-pointer select-none transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      style={{
        filter: "drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45))",
      }}
      aria-hidden="true"
    >
      {/* 1. Circular Chrome Pivot Base on the Left */}
      <div
        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full chrome-finish shrink-0 border border-slate-300 flex items-center justify-center z-10"
        style={{
          boxShadow: `
            0 4px 8px rgba(0, 0, 0, 0.5),
            inset 0 2px 3px rgba(255, 255, 255, 0.95),
            inset 0 -2px 3px rgba(0, 0, 0, 0.5)
          `,
        }}
      >
        {/* Inner concentric chrome groove */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-400 bg-gradient-to-br from-slate-200 to-slate-400 shadow-inner flex items-center justify-center">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 border border-slate-500 shadow-xs" />
        </div>
      </div>

      {/* 2. Streamlined Tapered Chrome Wing Handle pointing right */}
      <div
        className="relative -ml-3 sm:-ml-4 h-5 sm:h-6 w-28 sm:w-36 rounded-r-full chrome-finish border-y border-r border-slate-300 overflow-hidden"
        style={{
          boxShadow: `
            2px 4px 10px rgba(0, 0, 0, 0.4),
            inset 0 2px 2px rgba(255, 255, 255, 0.95),
            inset 0 -2px 3px rgba(0, 0, 0, 0.45)
          `,
          clipPath: "polygon(0 20%, 85% 0%, 100% 50%, 85% 100%, 0 80%)",
        }}
      >
        {/* High-gloss horizontal chrome reflection line */}
        <div className="absolute top-1 left-2 right-4 h-1 rounded-full bg-white/80 blur-[0.4px]" />
        <div className="absolute bottom-1 left-3 right-6 h-1 rounded-full bg-black/25" />
      </div>
    </div>
  );
};
