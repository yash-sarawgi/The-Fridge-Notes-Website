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
      className={`group relative text-left outline-none cursor-pointer transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xs w-full aspect-square paper-shadow-md hover:paper-shadow-lifted flex flex-col justify-between ${
        isSelected ? "ring-2 ring-amber-600 scale-105" : "hover:-translate-y-1.5 hover:rotate-0"
      }`}
      style={{
        backgroundColor: category.color,
        transform: `rotate(${category.rotation}deg) scale(${category.scale || 1})`,
        padding: "clamp(6px, 0.75cqw, 14px)",
        paddingTop: "clamp(10px, 1.25cqw, 22px)",
        paddingBottom: "clamp(6px, 0.7cqw, 12px)",
      }}
      aria-label={`Category: ${category.name}, ${recipeCount} recipes. Click to open.`}
    >
      {/* 3D Magnet */}
      <div className={`absolute -top-2.5 sm:-top-3 z-20 ${getMagnetPosition()}`}>
        <Magnet color={category.magnetColor} size="sm" />
      </div>

      {/* Decorative corner dog-ear fold on the paper */}
      <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-black/5 [clip-path:polygon(0_0,100%_100%,0_100%)] pointer-events-none" />

      {/* Note Header with handwritten title */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h3
            className="font-handwriting font-bold text-[#2b1810] tracking-wide leading-tight group-hover:text-amber-900 transition-colors truncate"
            style={{ fontSize: "clamp(11px, 1.2cqw, 20px)" }}
          >
            {category.name}
          </h3>
          <span className="p-0.5 rounded-full bg-black/5 text-[#422517] group-hover:bg-black/10 transition-transform shrink-0">
            <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
        </div>

        {/* Description */}
        <p
          className="font-handwriting text-[#4b3327]/90 line-clamp-2 leading-snug"
          style={{ fontSize: "clamp(9px, 0.9cqw, 14px)" }}
        >
          {category.description}
        </p>
      </div>

      {/* Footer count tag / sticker */}
      <div className="flex items-center justify-between pt-1 border-t border-black/10 mt-auto">
        <span
          className="font-handwriting font-semibold px-1.5 py-0.5 rounded-full bg-white/75 text-[#3b2416] border border-black/5 shadow-xs"
          style={{ fontSize: "clamp(8px, 0.8cqw, 12px)" }}
        >
          {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
        </span>
        <span
          className="font-handwriting font-bold text-[#6d4128] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5"
          style={{ fontSize: "clamp(9px, 0.85cqw, 13px)" }}
        >
          Open ➔
        </span>
      </div>
    </button>
  );
};
