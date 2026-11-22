"use client";

import React from "react";
import { Category } from "@/types";
import { Magnet } from "./Magnet";
import { 
  Soup, 
  Sandwich, 
  Cake, 
  Cookie, 
  Utensils, 
  Egg, 
  Coffee, 
  Salad, 
  Sparkles,
  Flame,
  type LucideIcon
} from "lucide-react";

interface CategoryNoteProps {
  category: Category;
  recipeCount: number;
  isSelected?: boolean;
  onClick: () => void;
  onHover?: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  soup: Soup,
  sandwich: Sandwich,
  cake: Cake,
  cookie: Cookie,
  utensils: Utensils,
  egg: Egg,
  coffee: Coffee,
  salad: Salad,
  sparkles: Sparkles,
};

export const CategoryNote: React.FC<CategoryNoteProps> = ({
  category,
  recipeCount,
  isSelected = false,
  onClick,
  onHover,
}) => {
  const IconComponent = iconMap[category.iconName] || Flame;

  // Placement for the magnet
  const getMagnetPosition = () => {
    switch (category.pinPosition) {
      case "top-left":
        return "top-1 left-4";
      case "top-right":
        return "top-1 right-4";
      default:
        return "top-1 left-1/2 -translate-x-1/2";
    }
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className={`group relative text-left outline-none cursor-pointer transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm w-full max-w-[170px] sm:max-w-[190px] md:max-w-[210px] p-2.5 sm:p-3 pt-3.5 sm:pt-4 pb-2.5 sm:pb-3 paper-shadow-md hover:paper-shadow-lifted ${
        isSelected ? "ring-2 ring-amber-600 scale-105" : "hover:-translate-y-2 hover:rotate-0"
      }`}
      style={{
        backgroundColor: category.color,
        transform: `rotate(${category.rotation}deg)`,
      }}
      aria-label={`Category: ${category.name}, ${recipeCount} recipes. Click to open.`}
    >
      {/* 3D Magnet */}
      <div className={`absolute -top-3 z-20 ${getMagnetPosition()}`}>
        <Magnet color={category.magnetColor} size="md" />
      </div>

      {/* Decorative corner dog-ear fold on the paper */}
      <div className="absolute top-0 right-0 w-4 h-4 bg-black/5 [clip-path:polygon(0_0,100%_100%,0_100%)] pointer-events-none" />

      {/* Note Header with handwritten title */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <h3 className="font-handwriting text-lg sm:text-xl font-bold text-[#2b1810] tracking-wide leading-tight group-hover:text-amber-900 transition-colors">
          {category.name}
        </h3>
        <span className="p-1 rounded-full bg-black/5 text-[#422517] group-hover:bg-black/10 group-hover:scale-110 transition-transform">
          <IconComponent className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Description */}
      <p className="font-handwriting text-[11px] sm:text-xs text-[#4b3327]/85 line-clamp-2 leading-snug mb-2">
        {category.description}
      </p>

      {/* Footer count tag / sticker */}
      <div className="flex items-center justify-between pt-1.5 border-t border-black/10">
        <span className="font-handwriting text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-white/70 text-[#3b2416] border border-black/5 shadow-xs">
          {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
        </span>
        <span className="font-handwriting text-[11px] sm:text-xs font-bold text-[#6d4128] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
          Open ➔
        </span>
      </div>
    </button>
  );
};
