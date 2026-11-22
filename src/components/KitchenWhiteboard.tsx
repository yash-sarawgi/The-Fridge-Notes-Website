"use client";

import React from "react";
import Link from "next/link";
import { Search, Volume2, VolumeX, SlidersHorizontal, BookPlus, Sparkles, Heart, Settings } from "lucide-react";
import { Magnet } from "./Magnet";

interface KitchenWhiteboardProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: "all" | "photo" | "text" | "quick" | "favorites";
  onFilterChange: (f: "all" | "photo" | "text" | "quick" | "favorites") => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAdmin: () => void;
  totalRecipesCount: number;
  currentDisplayCount: number;
}

export const KitchenWhiteboard: React.FC<KitchenWhiteboardProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  soundEnabled,
  onToggleSound,
  onOpenAdmin,
  totalRecipesCount,
  currentDisplayCount,
}) => {
  return (
    <div className="relative w-full mx-auto z-20">
      {/* Magnetic Dry-Erase Whiteboard Strip attached to the fridge */}
      <div
        className="relative bg-[#ffffff] rounded-md border-2 border-slate-300 p-2 sm:p-2.5 shadow-md"
        style={{
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06), 0 8px 18px -4px rgba(35,25,20,0.18)",
        }}
      >
        {/* Top left and right corner magnets */}
        <div className="absolute -top-2.5 -left-1.5 z-20">
          <Magnet color="#0284c7" size="sm" />
        </div>
        <div className="absolute -top-2.5 -right-1.5 z-20">
          <Magnet color="#dc2626" size="sm" />
        </div>

        {/* Top Whiteboard Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1 pb-1.5 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="font-handwriting font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1">
              <span>📋</span> Kitchen Board
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {currentDisplayCount} of {totalRecipesCount}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle Magnet */}
            <button
              onClick={onToggleSound}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${soundEnabled
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              title={soundEnabled ? "Mute kitchen sounds" : "Enable paper & magnet sounds"}
            >
              {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>{soundEnabled ? "Audio ON" : "Audio OFF"}</span>
            </button>

            {/* Admin CMS Dashboard */}
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-900 border border-sky-300 hover:bg-sky-100 transition-colors"
              title="Open Backend CMS & Fridge Arranger"
            >
              <Settings className="w-3 h-3 text-sky-700" />
              <span>Admin CMS</span>
            </Link>
          </div>
        </div>

        {/* Search input + Filter pills */}
        <div className="pt-1.5 flex flex-col gap-1.5">
          {/* Quick Search */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dishes or ingredients..."
              className="w-full pl-8 pr-3 py-1 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => onFilterChange("all")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all cursor-pointer ${activeFilter === "all"
                  ? "bg-amber-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              All
            </button>

            <button
              onClick={() => onFilterChange("photo")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all cursor-pointer ${activeFilter === "photo"
                  ? "bg-amber-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              Polaroids 📷
            </button>

            <button
              onClick={() => onFilterChange("text")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all cursor-pointer ${activeFilter === "text"
                  ? "bg-amber-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              Sticky Notes 📝
            </button>

            <button
              onClick={() => onFilterChange("quick")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all cursor-pointer ${activeFilter === "quick"
                  ? "bg-amber-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              &lt; 30 mins ⏱️
            </button>

            <button
              onClick={() => onFilterChange("favorites")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all flex items-center gap-1 cursor-pointer ${activeFilter === "favorites"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              <Heart className="w-3 h-3 fill-current" />
              <span>Faves</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
