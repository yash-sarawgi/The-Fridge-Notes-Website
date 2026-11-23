"use client";

import React from "react";
import Image from "next/image";
import { Recipe } from "@/types";
import { Magnet } from "./Magnet";
import { Clock, ChefHat, Sparkles, Heart } from "lucide-react";

interface DishNoteProps {
  recipe: Recipe;
  onClick: () => void;
  onHover?: () => void;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export const DishNote: React.FC<DishNoteProps> = ({
  recipe,
  onClick,
  onHover,
  onToggleFavorite,
}) => {
  const rotation = recipe.rotation ?? (Math.random() * 4 - 2);
  const scale = Math.max(0.8, Math.min(1.3, recipe.scale || 1));

  // STYLE A: PHOTOGRAPH NOTE (POLAROID FRAME)
  if (recipe.style === "photo" && recipe.image) {
    return (
      <div
        onClick={onClick}
        onMouseEnter={onHover}
        className="group relative cursor-pointer transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xs bg-[#fdfbf7] p-3 pb-3.5 paper-shadow-md hover:paper-shadow-lifted hover:-translate-y-2 hover:rotate-0 w-full max-w-[210px] md:max-w-[230px]"
        style={{
          transform: `rotate(${rotation}deg)`,
          border: "1px solid rgba(0,0,0,0.06)",
        }}
        tabIndex={0}
        role="button"
        aria-label={`Recipe: ${recipe.title}, Prep time ${recipe.prepTime}. Click to view full recipe.`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Refrigerator Magnet on top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <Magnet color={recipe.magnetColor || "#ef4444"} size="md" />
        </div>

        {/* Favorite Heart Pin */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(e);
          }}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-full transition-all ${
            recipe.isFavorite
              ? "bg-rose-500 text-white scale-110 shadow-sm"
              : "bg-black/30 text-white hover:bg-rose-500/80 hover:scale-110 opacity-0 group-hover:opacity-100"
          }`}
          title={recipe.isFavorite ? "Favorited" : "Add to favorites"}
          aria-label={recipe.isFavorite ? "Remove favorite" : "Mark as favorite"}
        >
          <Heart className={`w-3.5 h-3.5 ${recipe.isFavorite ? "fill-white" : ""}`} />
        </button>

        {/* Photo Container (vintage polaroid aspect ratio) */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xs bg-stone-200 border border-black/10">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 240px, 260px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Special badge */}
          {recipe.isSpecial && (
            <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-sm bg-amber-500/90 text-white font-handwriting text-xs font-bold flex items-center gap-1 shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3 h-3" /> Special
            </div>
          )}
        </div>

        {/* Polaroid handwritten caption below photo */}
        <div className="pt-2 px-1 text-center">
          <h4
            className="font-handwriting font-bold text-[#2a170e] leading-snug line-clamp-2 group-hover:text-amber-900 transition-colors"
            style={{ fontSize: `calc(clamp(14px, 1.5cqw, 24px) * ${scale})` }}
          >
            {recipe.title}
          </h4>

          <div
            className="flex items-center justify-center gap-2 mt-1 text-[#5c4033]/80 font-handwriting font-medium"
            style={{ fontSize: `calc(clamp(11px, 1.1cqw, 16px) * ${scale})` }}
          >
            <span className="flex items-center gap-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" /> {recipe.totalTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <ChefHat className="w-3.5 h-3.5 text-amber-700" /> {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // STYLE B: TEXT-ONLY STICKY NOTE
  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      className="group relative cursor-pointer transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm paper-shadow-md hover:paper-shadow-lifted hover:-translate-y-2 hover:rotate-0 w-full aspect-square flex flex-col justify-between"
      style={{
        backgroundColor: recipe.paperColor || "#fef08a",
        transform: `rotate(${rotation}deg)`,
        padding: "clamp(8px, 0.9cqw, 18px)",
        paddingTop: "clamp(12px, 1.35cqw, 24px)",
      }}
      tabIndex={0}
      role="button"
      aria-label={`Recipe: ${recipe.title}. Click to view full recipe.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Magnet at top */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <Magnet color={recipe.magnetColor || "#0284c7"} size="sm" />
      </div>

      {/* Favorite Heart Pin */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.(e);
        }}
        className={`absolute top-2 right-2 z-20 p-1 rounded-full transition-all ${
          recipe.isFavorite
            ? "bg-rose-500 text-white scale-110 shadow-sm"
            : "text-stone-400 hover:text-rose-500 hover:scale-110 opacity-0 group-hover:opacity-100"
        }`}
        title={recipe.isFavorite ? "Favorited" : "Add to favorites"}
      >
        <Heart className={`w-3.5 h-3.5 ${recipe.isFavorite ? "fill-white" : ""}`} />
      </button>

      {/* Cute handwritten recipe title */}
      <div>
        <span
          className="font-handwriting uppercase tracking-wider text-black/60 font-bold block mb-0.5"
          style={{ fontSize: `calc(clamp(10px, 0.95cqw, 14px) * ${scale})` }}
        >
          {recipe.categoryName} Note
        </span>
        <h4
          className="font-handwriting font-bold text-[#2b1810] leading-tight line-clamp-2 group-hover:text-amber-900 transition-colors"
          style={{ fontSize: `calc(clamp(14px, 1.5cqw, 24px) * ${scale})` }}
        >
          {recipe.title}
        </h4>
        <p
          className="font-handwriting text-[#4d3327]/85 line-clamp-3 leading-snug mt-1"
          style={{ fontSize: `calc(clamp(12px, 1.2cqw, 18px) * ${scale})` }}
        >
          {recipe.description}
        </p>
      </div>

      {/* Sticky note bottom details */}
      <div
        className="pt-1.5 border-t border-black/10 flex items-center justify-between font-handwriting text-[#533525] mt-auto"
        style={{ fontSize: `calc(clamp(11px, 1.05cqw, 15px) * ${scale})` }}
      >
        <span className="flex items-center gap-0.5 font-semibold">
          <Clock className="w-3 h-3 text-amber-800" /> {recipe.totalTime}
        </span>
        <span className="px-1.5 py-0.5 rounded-sm bg-black/5 font-bold">
          {recipe.difficulty}
        </span>
      </div>
    </div>
  );
};
