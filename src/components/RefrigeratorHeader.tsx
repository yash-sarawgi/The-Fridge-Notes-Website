"use client";

import React from "react";
import { siteConfig } from "@/config/siteConfig";
import { Magnet } from "./Magnet";
import { Sparkles, ThermometerSnowflake } from "lucide-react";

interface RefrigeratorHeaderProps {
  onTitleClick?: () => void;
  soundEnabled?: boolean;
}

export const RefrigeratorHeader: React.FC<RefrigeratorHeaderProps> = ({
  onTitleClick,
}) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center pt-6 pb-4 px-4 z-10">
      
      {/* Top Freezer Accessories Bar: Vintage Defrost Dial + Chrome Logo Badge */}
      <div className="w-full flex items-center justify-between max-w-2xl px-4 mb-3">
        {/* Retro Temperature / Frost-Free Dial Gauge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100/90 border border-stone-300 shadow-inner text-stone-700">
          <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-600" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600">
            ZERO ZONE • FROST-FREE
          </span>
        </div>

        {/* Vintage Embossed Chrome Script Badge */}
        <button
          onClick={onTitleClick}
          title="Return to fridge home"
          className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] mx-auto sm:mx-0"
          aria-label={`${siteConfig.name} - Return to Fridge Home`}
        >
          <div className="relative px-7 py-2.5 rounded-full chrome-finish border-2 border-slate-300 shadow-lg flex items-center gap-3">
            {/* Left mounting screw with slot detail */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-[1px] bg-slate-600 rotate-45" />
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span className="font-heading tracking-[0.24em] text-sm sm:text-base uppercase font-black text-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                  {siteConfig.fridgeBadgeText}
                </span>
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              </div>
              <span className="text-[9px] tracking-[0.2em] text-slate-600 font-bold uppercase mt-0.5">
                DELUXE REFRIGERATION • CUSTOM 1958
              </span>
            </div>

            {/* Right mounting screw */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-[1px] bg-slate-600 -rotate-45" />
            </div>
          </div>
        </button>

        {/* Subtle Decorative Vintage Energy / Model Tag */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-amber-900/60 uppercase tracking-widest px-2.5 py-1 rounded bg-black/5">
          MODEL F-58
        </div>
      </div>

      {/* Handwritten introduction paper note pinned with a realistic 3D magnet */}
      <div
        className="relative mt-2 px-6 py-3 bg-[#fefce8] text-[#332211] rounded-sm paper-shadow-md border border-amber-200 max-w-md text-center transform -rotate-1 transition-transform duration-200 hover:rotate-0"
        style={{
          clipPath: "polygon(0 0, 100% 0.5%, 99.5% 99.5%, 0.5% 100%)",
        }}
      >
        {/* Pinned 3D Magnet */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <Magnet color="#dc2626" size="md" shape="round" />
        </div>

        <p className="font-handwriting text-xl sm:text-2xl font-bold leading-tight tracking-wide text-amber-950">
          &ldquo;{siteConfig.tagline}&rdquo;
        </p>
        <p className="font-handwriting text-sm sm:text-base text-amber-900/90 leading-snug mt-1">
          {siteConfig.subIntro}
        </p>
      </div>
    </div>
  );
};
