"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Recipe } from "@/types";
import { Magnet } from "./Magnet";
import { 
  X, 
  Clock, 
  Users, 
  ChefHat, 
  Check, 
  Printer, 
  Share2, 
  Heart, 
  Sparkles,
  BookOpen,
  StickyNote
} from "lucide-react";
import confetti from "canvas-confetti";

interface RecipeSheetProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  soundEnabled?: boolean;
}

export const RecipeSheet: React.FC<RecipeSheetProps> = ({
  recipe,
  onClose,
  onToggleFavorite,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Toggle ingredient item check
  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Trigger celebratory confetti when favoriting
  const handleFavoriteClick = () => {
    onToggleFavorite?.(recipe.id);
    if (!recipe.isFavorite) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#fb923c", "#fde047", "#38bdf8"],
      });
    }
  };

  // Helper to adjust ingredient amounts for multipliers (e.g. 1x, 2x, 3x)
  const formatAmount = (amountStr: string, multiplier: number) => {
    if (multiplier === 1) return amountStr;

    // Regex to match leading numbers or fractions
    return amountStr.replace(/^(\d+(?:\.\d+)?|\d+\/\d+)/, (match) => {
      if (match.includes("/")) {
        const [num, den] = match.split("/").map(Number);
        const val = (num / den) * multiplier;
        return Number.isInteger(val) ? val.toString() : val.toFixed(1);
      }
      const val = parseFloat(match) * multiplier;
      return Number.isInteger(val) ? val.toString() : val.toFixed(1);
    });
  };

  // Handle printing
  const handlePrint = () => {
    window.print();
  };

  // Handle sharing / copying link
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${recipe.title}\n\nIngredients:\n` +
          recipe.ingredients.map((i) => `• ${i.amount} ${i.item}`).join("\n") +
          `\n\nFrom ${window.location.origin}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#fffdfa] rounded-2xl overflow-hidden text-[#2c221e] shadow-2xl">
      {/* Top Magnet & Washi Tape Holding the Recipe */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
        <Magnet color="#dc2626" size="lg" shape="round" />
      </div>

      {/* Vintage Top Navigation Bar on Paper */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-amber-900/10 bg-[#faf6ed] shrink-0">
        <button
          onClick={onClose}
          className="group flex items-center gap-1.5 font-handwriting text-base sm:text-lg font-bold text-amber-950 hover:text-amber-700 transition-colors cursor-pointer"
          aria-label="Back to fridge notes"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span>Pin back to fridge</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share / Copy Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-black/5 text-amber-900 transition-colors"
            title="Copy ingredients to clipboard"
            aria-label="Share recipe"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Print Recipe Button */}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-full hover:bg-black/5 text-amber-900 transition-colors"
            title="Print recipe card"
            aria-label="Print recipe"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Favorite Pin */}
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full transition-all ${
              recipe.isFavorite ? "text-rose-600 scale-110" : "text-stone-400 hover:text-rose-600"
            }`}
            title={recipe.isFavorite ? "Favorited" : "Add to favorites"}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${recipe.isFavorite ? "fill-rose-600" : ""}`} />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 text-stone-600 hover:text-stone-900 transition-colors ml-2 cursor-pointer"
            aria-label="Close recipe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Recipe Content Body */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Photograph if available */}
            {recipe.image && (
              <div className="relative w-full md:w-5/12 aspect-4/3 rounded-sm overflow-hidden bg-stone-200 border border-black/10 shadow-sm shrink-0">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority
                />
                {recipe.isSpecial && (
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-sm bg-amber-500 text-white font-handwriting text-xs font-bold shadow-xs">
                    Special Recipe ★
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-handwriting text-sm font-semibold tracking-wide border border-amber-300/40">
                {recipe.categoryName}
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2a170e] leading-tight">
                {recipe.title}
              </h1>

              <p className="font-handwriting text-base sm:text-lg text-amber-950/80 leading-relaxed pt-1">
                &ldquo;{recipe.description}&rdquo;
              </p>

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                <div className="px-3 py-2 rounded-xs bg-[#f6eee2] text-[#42281a] border border-amber-900/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800/70 block flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Prep Time
                  </span>
                  <span className="font-semibold text-sm">{recipe.prepTime}</span>
                </div>

                <div className="px-3 py-2 rounded-xs bg-[#f6eee2] text-[#42281a] border border-amber-900/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800/70 block flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Cook Time
                  </span>
                  <span className="font-semibold text-sm">{recipe.cookTime}</span>
                </div>

                <div className="px-3 py-2 rounded-xs bg-[#f6eee2] text-[#42281a] border border-amber-900/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800/70 block flex items-center gap-1">
                    <Users className="w-3 h-3" /> Servings
                  </span>
                  <span className="font-semibold text-sm">
                    {recipe.servings * servingsMultiplier} people
                  </span>
                </div>

                <div className="px-3 py-2 rounded-xs bg-[#f6eee2] text-[#42281a] border border-amber-900/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800/70 block flex items-center gap-1">
                    <ChefHat className="w-3 h-3" /> Difficulty
                  </span>
                  <span className="font-semibold text-sm">{recipe.difficulty}</span>
                </div>
              </div>

              {/* Servings scaler control */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-handwriting font-bold text-amber-900">
                  Scale recipe:
                </span>
                {[1, 2, 3].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setServingsMultiplier(mult)}
                    className={`px-2 py-0.5 rounded-sm text-xs font-bold transition-all ${
                      servingsMultiplier === mult
                        ? "bg-amber-900 text-white shadow-xs"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-t border-dashed border-amber-900/20" />

          {/* Two-column layout for Ingredients & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Ingredients Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-[#2a170e] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-700" /> Ingredients
                </h3>
                <span className="text-xs font-handwriting text-stone-500">
                  (tap to check off)
                </span>
              </div>

              <ul className="space-y-2 bg-[#fdfaf5] p-3 rounded-xs border border-amber-900/10">
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = checkedIngredients[idx];
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`group flex items-start gap-2.5 p-1.5 rounded-xs cursor-pointer transition-colors ${
                        isChecked ? "opacity-40" : "hover:bg-amber-50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-xs border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                          isChecked
                            ? "bg-amber-800 border-amber-800 text-white"
                            : "border-amber-900/40 bg-white group-hover:border-amber-800"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>

                      <div className="text-sm leading-tight">
                        <span
                          className={`font-semibold text-amber-950 mr-1.5 ${
                            isChecked ? "line-through text-stone-400" : ""
                          }`}
                        >
                          {formatAmount(ing.amount, servingsMultiplier)}
                        </span>
                        <span
                          className={`text-stone-800 ${
                            isChecked ? "line-through text-stone-400" : ""
                          }`}
                        >
                          {ing.item}
                        </span>
                        {ing.notes && (
                          <span className="text-xs text-stone-500 italic block mt-0.5">
                            {ing.notes}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Preparation Instructions Column */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#2a170e] flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-amber-700" /> Preparation Method
              </h3>

              <ol className="space-y-4">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-stone-800">
                    <span className="w-6 h-6 rounded-full bg-amber-200/80 text-amber-950 font-handwriting text-base font-bold flex items-center justify-center shrink-0 shadow-xs border border-amber-400/40">
                      {idx + 1}
                    </span>
                    <p className="pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* "My Kitchen Notes" - Styled like an authentic yellow sticky note clipped to the recipe */}
          {recipe.kitchenNotes && recipe.kitchenNotes.length > 0 && (
            <div className="relative mt-6 p-5 bg-[#fef08a] rounded-sm paper-shadow-md border border-amber-300 transform -rotate-1 transition-transform hover:rotate-0">
              {/* Paper clip / cute magnet */}
              <div className="absolute -top-3 left-6 z-20">
                <Magnet color="#0284c7" size="sm" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-4 h-4 text-amber-900" />
                <h4 className="font-handwriting text-xl font-bold text-amber-950">
                  My Kitchen Notes & Secrets
                </h4>
              </div>

              <ul className="space-y-1.5 list-disc list-inside text-sm font-handwriting text-amber-950/90 leading-snug">
                {recipe.kitchenNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Variations & Storage Tips Footer */}
          {(recipe.variations || recipe.storageTips) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-stone-700 bg-[#faf6ed] p-4 rounded-sm border border-amber-900/10">
              {recipe.variations && recipe.variations.length > 0 && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-amber-900 block mb-1">
                    Variations & Substitutions:
                  </span>
                  <ul className="space-y-1 list-disc list-inside">
                    {recipe.variations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recipe.storageTips && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-amber-900 block mb-1">
                    Storage & Freshness:
                  </span>
                  <p>{recipe.storageTips}</p>
                </div>
              )}
            </div>
          )}

          {/* Return button at bottom */}
          <div className="pt-4 text-center">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-900 text-white font-handwriting text-lg font-bold hover:bg-amber-800 transition-colors shadow-sm cursor-pointer"
            >
              ← Put back on fridge
            </button>
          </div>
        </div>
      </div>
  );
};
