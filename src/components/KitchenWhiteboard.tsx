"use client";

import React from "react";
import { Search, Volume2, VolumeX, SlidersHorizontal, BookPlus, Sparkles, Heart } from "lucide-react";
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
    <div className="relative w-full max-w-2xl mx-auto px-4 my-2 z-20">
      {/* Magnetic Dry-Erase Whiteboard Strip attached to the fridge */}
      <div
        className="relative bg-[#ffffff] rounded-md border-2 border-slate-300 p-3 sm:p-4 shadow-md"
        style={{
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06), 0 8px 18px -4px rgba(35,25,20,0.18)",
        }}
      >
        {/* Top left and right corner magnets */}
        <div className="absolute -top-3 -left-2 z-20">
          <Magnet color="#0284c7" size="md" />
        </div>
        <div className="absolute -top-3 -right-2 z-20">
          <Magnet color="#dc2626" size="md" />
        </div>

        {/* Top Whiteboard Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-handwriting font-bold text-base sm:text-lg text-slate-800 flex items-center gap-1.5">
              <span>📋</span> Kitchen Board
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {currentDisplayCount} of {totalRecipesCount} recipes
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle Magnet */}
            <button
              onClick={onToggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
              title={soundEnabled ? "Mute kitchen sounds" : "Enable paper & magnet sounds"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? "Audio ON" : "Audio OFF"}</span>
            </button>

            {/* Chef's Admin Preview button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300/80 hover:bg-amber-100 transition-colors cursor-pointer"
              title="Open Recipe Admin Preview"
            >
              <BookPlus className="w-3.5 h-3.5 text-amber-700" />
              <span>Chef&apos;s Notebook</span>
            </button>
          </div>
        </div>

        {/* Search input + Filter pills */}
        <div className="pt-2.5 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dishes or ingredients..."
              className="w-full pl-9 pr-3 py-1.5 rounded-sm bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
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
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-amber-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All
            </button>

            <button
              onClick={() => onFilterChange("photo")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all cursor-pointer ${
                activeFilter === "photo"
                  ? "bg-amber-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Polaroids 📷
            </button>

            <button
              onClick={() => onFilterChange("text")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all cursor-pointer ${
                activeFilter === "text"
                  ? "bg-amber-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Sticky Notes 📝
            </button>

            <button
              onClick={() => onFilterChange("quick")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all cursor-pointer ${
                activeFilter === "quick"
                  ? "bg-amber-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              &lt; 30 mins ⏱️
            </button>

            <button
              onClick={() => onFilterChange("favorites")}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap font-medium transition-all flex items-center gap-1 cursor-pointer ${
                activeFilter === "favorites"
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
