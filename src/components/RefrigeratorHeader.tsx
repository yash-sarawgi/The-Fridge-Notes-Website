"use client";

import React from "react";
import { siteConfig } from "@/config/siteConfig";
import { Magnet } from "./Magnet";

interface RefrigeratorHeaderProps {
  onTitleClick?: () => void;
  soundEnabled?: boolean;
}

export const RefrigeratorHeader: React.FC<RefrigeratorHeaderProps> = ({
  onTitleClick,
}) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center pt-5 pb-3 px-4 z-10">
      {/* Vintage Embossed Chrome Script Badge */}
      <button
        onClick={onTitleClick}
        title="Click to go to fridge home"
        className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        aria-label={`${siteConfig.name} - Return to Fridge Home`}
      >
        <div className="relative px-6 py-2 rounded-full chrome-finish border border-slate-300/80 shadow-md flex items-center gap-3">
          {/* Miniature mounting screws on each side */}
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-[1px] bg-slate-600 rotate-45" />
          </div>

          <div className="flex flex-col items-center">
            <span className="font-heading tracking-[0.22em] text-xs uppercase font-extrabold text-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              {siteConfig.fridgeBadgeText}
            </span>
            <span className="text-[10px] tracking-widest text-slate-600 font-semibold uppercase">
              DELUXE AUTOMATIC • EST. 1958
            </span>
          </div>

          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-[1px] bg-slate-600 -rotate-45" />
          </div>
        </div>
      </button>

      {/* Handwritten intro paper note pinned with a magnet */}
      <div
        className="relative mt-3 px-5 py-2.5 bg-[#fefce8] text-[#332211] rounded-sm paper-shadow-sm border border-amber-200/60 max-w-md text-center transform -rotate-1 transition-transform duration-200 hover:rotate-0"
        style={{
          clipPath: "polygon(0 0, 100% 1%, 99% 99%, 1% 100%)",
        }}
      >
        {/* Pinned Magnet */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <Magnet color="#dc2626" size="sm" shape="round" />
        </div>

        <p className="font-handwriting text-lg sm:text-xl font-bold leading-tight tracking-wide text-amber-950">
          &ldquo;{siteConfig.tagline}&rdquo;
        </p>
        <p className="font-handwriting text-sm sm:text-base text-amber-800/90 leading-snug">
          {siteConfig.subIntro}
        </p>
      </div>
    </div>
  );
};
