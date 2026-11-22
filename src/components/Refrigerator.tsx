"use client";

import React, { useState, useEffect } from "react";
import { Recipe, Category } from "@/types";
import { initialCategories } from "@/data/categories";
import { initialRecipes } from "@/data/recipes";
import { siteConfig } from "@/config/siteConfig";
import { CategoryNote } from "./CategoryNote";
import { DishNote } from "./DishNote";
import { RecipeSheet } from "./RecipeSheet";
import { KitchenWhiteboard } from "./KitchenWhiteboard";
import { AdminModal } from "./AdminModal";
import { Magnet } from "./Magnet";
import { playMagnetClick, playPaperRustle } from "@/utils/audio";
import { ArrowLeft, Sparkles, ChefHat } from "lucide-react";

export const Refrigerator: React.FC = () => {
  // Navigation State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Data State
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "photo" | "text" | "quick" | "favorites">("all");

  // Audio preference (default OFF)
  const [soundEnabled, setSoundEnabled] = useState(siteConfig.defaultAudioEnabled);

  // Admin Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load custom recipes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fridge_notes_custom_recipes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecipes(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const persistRecipes = (updated: Recipe[]) => {
    setRecipes(updated);
    try {
      localStorage.setItem("fridge_notes_custom_recipes", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Keyboard navigation: Escape key returns or closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedRecipe) {
          setSelectedRecipe(null);
          playMagnetClick(soundEnabled);
        } else if (selectedCategoryId) {
          setSelectedCategoryId(null);
          playMagnetClick(soundEnabled);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRecipe, selectedCategoryId, soundEnabled]);

  // Audio trigger helpers
  const handleHoverNote = () => {
    playPaperRustle(soundEnabled);
  };

  const handleClickCategory = (catId: string) => {
    playMagnetClick(soundEnabled);
    setSelectedCategoryId(catId);
    setSelectedRecipe(null);
  };

  const handleBackToCategories = () => {
    playMagnetClick(soundEnabled);
    setSelectedCategoryId(null);
    setSelectedRecipe(null);
  };

  const handleClickRecipe = (recipe: Recipe) => {
    playMagnetClick(soundEnabled);
    setSelectedRecipe(recipe);
  };

  const handleCloseRecipe = () => {
    playMagnetClick(soundEnabled);
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playMagnetClick(soundEnabled);
    const updated = recipes.map((r) =>
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    );
    persistRecipes(updated);
    if (selectedRecipe && selectedRecipe.id === id) {
      setSelectedRecipe((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleAddRecipe = (newR: Recipe) => {
    const updated = [newR, ...recipes];
    persistRecipes(updated);
  };

  const handleUpdateRecipe = (updatedR: Recipe) => {
    const updated = recipes.map((r) => (r.id === updatedR.id ? updatedR : r));
    persistRecipes(updated);
  };

  const handleDeleteRecipe = (id: string) => {
    const updated = recipes.filter((r) => r.id !== id);
    persistRecipes(updated);
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all recipes and kitchen notes back to factory defaults?")) {
      persistRecipes(initialRecipes);
      setIsAdminOpen(false);
    }
  };

  // Filtered dishes
  const displayedRecipes = recipes.filter((r) => {
    if (selectedCategoryId && !searchQuery) {
      if (r.categoryId !== selectedCategoryId) return false;
    }

    if (activeFilter === "photo" && r.style !== "photo") return false;
    if (activeFilter === "text" && r.style !== "text") return false;
    if (activeFilter === "favorites" && !r.isFavorite) return false;
    if (activeFilter === "quick") {
      const minutes = parseInt(r.totalTime) || 40;
      if (minutes > 30) return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(query);
      const matchDesc = r.description.toLowerCase().includes(query);
      const matchCat = r.categoryName.toLowerCase().includes(query);
      const matchIng = r.ingredients.some((i) => i.item.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchCat && !matchIng) return false;
    }

    return true;
  });

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden">
      
      {/* 1. Real Kitchen Interior Backdrop (Warm, cozy, domestic kitchen atmosphere) */}
      <div className="kitchen-room-bg" />

      {/* 2. Soft Ambient Warm Sunlight Reflection */}
      <div className="kitchen-sunlight" />

      {/* 3. Hardwood Kitchen Floor Plane at bottom */}
      <div className="kitchen-floor" />

      {/* ============================================================== */}
      {/* THE VINTAGE RETRO REFRIGERATOR (MAIN INTERFACE)                */}
      {/* Tall, continuous, authentic 1950s appliance proportions        */}
      {/* ============================================================== */}
      <main className="relative z-10 w-full max-w-[920px] mx-auto pt-6 sm:pt-10 pb-20 px-3 sm:px-6 flex flex-col items-center">
        
        {/* Refrigerator Master Body */}
        <div
          className="relative w-full rounded-t-[54px] sm:rounded-t-[68px] rounded-b-[24px] vintage-fridge-body flex flex-col overflow-hidden"
          style={{
            minHeight: "1150px",
          }}
        >
          {/* Subtle 3D side edge bevel */}
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/30 to-transparent pointer-events-none z-30" />
          <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-30" />

          {/* ========================================================== */}
          {/* A. UPPER FREEZER COMPARTMENT (CURVED CROWN & BRAND BADGE)  */}
          {/* ========================================================== */}
          <div className="relative w-full pt-8 pb-8 px-6 sm:px-12 flex flex-col items-center">
            
            {/* 3D Chrome Embossed Brand Badge */}
            <button
              onClick={handleBackToCategories}
              title="Return to fridge home"
              className="group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 mb-4 z-20"
              aria-label="Return to fridge home"
            >
              <div className="px-7 py-2.5 rounded-full chrome-finish border-2 border-slate-300 shadow-md flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500 shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-[1px] bg-slate-700 rotate-45" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span className="font-heading tracking-[0.24em] text-sm sm:text-base uppercase font-extrabold text-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                      {siteConfig.fridgeBadgeText}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  </div>
                  <span className="text-[9px] tracking-[0.22em] text-slate-600 font-bold uppercase">
                    DELUXE AUTOMATIC • EST. 1958
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500 shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-[1px] bg-slate-700 -rotate-45" />
                </div>
              </div>
            </button>

            {/* Handwritten Introduction Sticky Note pinned with 3D magnet */}
            <div
              className="relative z-20 px-6 py-3.5 bg-[#fefce8] text-[#2c1d11] rounded-sm paper-shadow-md border border-amber-200 max-w-md text-center transform -rotate-1 transition-transform duration-200 hover:rotate-0"
              style={{
                clipPath: "polygon(0 0, 100% 0.5%, 99.5% 99.5%, 0.5% 100%)",
              }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                <Magnet color="#dc2626" size="md" shape="round" />
              </div>
              <p className="font-handwriting text-xl sm:text-2xl font-bold leading-tight text-amber-950">
                &ldquo;{siteConfig.tagline}&rdquo;
              </p>
              <p className="font-handwriting text-sm sm:text-base text-amber-900/90 leading-snug mt-1">
                {siteConfig.subIntro}
              </p>
            </div>

            {/* Retro Streamlined Chrome Wing Handle on Freezer (Left Side) */}
            <div
              onClick={() => playMagnetClick(soundEnabled)}
              className="absolute bottom-2 left-6 sm:left-10 z-30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Freezer door handle"
              aria-hidden="true"
            >
              <div className="flex items-center">
                {/* Circular chrome pivot mount */}
                <div className="w-9 h-9 rounded-full chrome-finish border border-slate-300 shadow-md flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border border-slate-400 bg-gradient-to-br from-slate-200 to-slate-400 shadow-inner" />
                </div>
                {/* Horizontal tapered chrome wing */}
                <div
                  className="-ml-3 h-5 w-28 sm:w-36 chrome-finish rounded-r-full border-y border-r border-slate-300 shadow-lg"
                  style={{
                    clipPath: "polygon(0 20%, 85% 0%, 100% 50%, 85% 100%, 0 80%)",
                  }}
                />
              </div>
            </div>

            {/* Ambient Cute Reminder Note on Freezer */}
            <div className="hidden lg:block absolute top-12 right-12 z-20 pointer-events-none transform rotate-3">
              <div className="px-3 py-1 bg-yellow-100 text-amber-950 font-handwriting text-xs rounded shadow-xs border border-amber-300">
                <span>Don&apos;t forget butter!</span> 🧈
              </div>
              <div className="absolute -top-2 right-4">
                <Magnet color="#ef4444" size="sm" shape="heart" />
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* B. POLISHED CHROME SEAM DIVIDER BETWEEN DOORS              */}
          {/* ========================================================== */}
          <div className="relative w-full h-4 fridge-seam-divider z-20 flex items-center">
            <div className="w-full h-2 chrome-finish shadow-md border-y border-slate-400/80" />
          </div>

          {/* ========================================================== */}
          {/* C. MAIN LOWER REFRIGERATOR DOOR (TALL INTERACTIVE BODY)    */}
          {/* ========================================================== */}
          <div className="relative w-full flex-1 pt-6 pb-12 flex flex-col justify-start">
            
            {/* Retro Streamlined Chrome Wing Handle on Main Door (Left Side) */}
            <div
              onClick={() => playMagnetClick(soundEnabled)}
              className="absolute top-2 left-6 sm:left-10 z-30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Main refrigerator door handle"
              aria-hidden="true"
            >
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full chrome-finish border border-slate-300 shadow-md flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border border-slate-400 bg-gradient-to-br from-slate-200 to-slate-400 shadow-inner" />
                </div>
                <div
                  className="-ml-3 h-5 w-28 sm:w-36 chrome-finish rounded-r-full border-y border-r border-slate-300 shadow-lg"
                  style={{
                    clipPath: "polygon(0 20%, 85% 0%, 100% 50%, 85% 100%, 0 80%)",
                  }}
                />
              </div>
            </div>

            {/* Dry-Erase Kitchen Whiteboard Strip (Search & Filters) */}
            <div className="pt-8 sm:pt-4 px-2 sm:px-6">
              <KitchenWhiteboard
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  if (q.trim()) {
                    setSelectedRecipe(null);
                  }
                }}
                activeFilter={activeFilter}
                onFilterChange={(f) => {
                  setActiveFilter(f);
                  playMagnetClick(soundEnabled);
                }}
                soundEnabled={soundEnabled}
                onToggleSound={() => {
                  setSoundEnabled(!soundEnabled);
                  playMagnetClick(!soundEnabled);
                }}
                onOpenAdmin={() => setIsAdminOpen(true)}
                totalRecipesCount={recipes.length}
                currentDisplayCount={displayedRecipes.length}
              />
            </div>

            {/* Ambient Decorative Note on Main Door */}
            <div className="hidden lg:block absolute bottom-8 right-12 z-10 pointer-events-none transform rotate-2">
              <div className="px-3 py-1 bg-rose-100 text-rose-950 font-handwriting text-xs rounded shadow-xs border border-rose-200">
                &ldquo;Good food = Good mood&rdquo; 🍓
              </div>
              <div className="absolute -top-2 right-4">
                <Magnet color="#ec4899" size="sm" shape="heart" />
              </div>
            </div>

            {/* ======================================================== */}
            {/* MAIN DOOR INTERACTIVE SURFACE (CATEGORIES / DISHES)      */}
            {/* ======================================================== */}
            <div className="relative w-full flex-1 px-4 sm:px-8 lg:px-12 py-5 z-20 flex flex-col justify-start">
              
              {/* VIEW 1: EXPANDED RECIPE SHEET (MOUNTED ON THE FRIDGE) */}
              {selectedRecipe ? (
                <RecipeSheet
                  recipe={selectedRecipe}
                  onClose={handleCloseRecipe}
                  onToggleFavorite={(id) => handleToggleFavorite(id)}
                  soundEnabled={soundEnabled}
                />
              ) : selectedCategoryId || searchQuery ? (
                
                /* VIEW 2: SELECTED CATEGORY DISHES ON THE FRIDGE DOOR */
                <div className="w-full flex flex-col items-center space-y-6">
                  
                  {/* Physical Navigation Back Note */}
                  <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-4xl px-2">
                    <button
                      onClick={handleBackToCategories}
                      onMouseEnter={handleHoverNote}
                      className="group relative cursor-pointer px-5 py-2.5 bg-[#fefce8] text-amber-950 rounded-sm paper-shadow-md border border-amber-200 transform -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-500"
                      aria-label="Back to all categories"
                    >
                      <div className="absolute -top-2.5 left-4 z-20">
                        <Magnet color="#ef4444" size="sm" />
                      </div>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-800" />
                      <span className="font-handwriting text-lg font-bold">
                        ← Back to all category notes
                      </span>
                    </button>

                    {/* Category Title Note */}
                    <div className="relative px-4 py-1.5 bg-white/95 rounded-full border border-stone-300 shadow-xs flex items-center gap-2 text-stone-900">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedCategoryObj?.magnetColor || "#ef4444" }} />
                      <span className="font-handwriting text-lg font-bold">
                        {searchQuery
                          ? `Search results for "${searchQuery}"`
                          : `${selectedCategoryObj?.name || "Dishes"} (${displayedRecipes.length})`}
                      </span>
                    </div>
                  </div>

                  {/* Dish Notes Grid (Organically placed on the fridge door) */}
                  {displayedRecipes.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="text-4xl">🍳</div>
                      <p className="font-handwriting text-2xl font-bold text-stone-800">
                        No recipe notes match this search.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveFilter("all");
                        }}
                        className="px-5 py-2 rounded-full bg-amber-900 text-white font-handwriting text-base font-bold hover:bg-amber-800 cursor-pointer shadow-sm"
                      >
                        Show all dishes
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-wrap items-start justify-center gap-6 sm:gap-7 lg:gap-8 pt-2 pb-10">
                      {displayedRecipes.map((dish) => (
                        <DishNote
                          key={dish.id}
                          recipe={dish}
                          onClick={() => handleClickRecipe(dish)}
                          onHover={handleHoverNote}
                          onToggleFavorite={(e) => handleToggleFavorite(dish.id, e)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                
                /* VIEW 3: HOMEPAGE CATEGORY NOTES (ORGANICALLY ASSEMBLED ON THE DOOR) */
                <div className="w-full flex flex-col items-center">
                  <div className="text-center mb-6">
                    <span className="font-handwriting text-lg sm:text-xl text-amber-950 font-bold px-4 py-1.5 bg-amber-100/90 rounded-full border border-amber-300 shadow-md">
                      ✨ Pick a category sticky note to explore recipes ✨
                    </span>
                  </div>

                  {/* Organic Scrapbook Layout for Categories */}
                  <div className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-7 lg:gap-8 max-w-4xl pt-2 pb-8">
                    {categories.map((category) => {
                      const count = recipes.filter((r) => r.categoryId === category.id).length;
                      return (
                        <CategoryNote
                          key={category.id}
                          category={category}
                          recipeCount={count}
                          onClick={() => handleClickCategory(category.id)}
                          onHover={handleHoverNote}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Base Kickplate Detail */}
            <div className="relative w-full px-8 pt-4 pb-2 border-t border-black/10 mt-auto bg-black/5">
              <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-2 rounded-full bg-black/15 border-b border-white/40 shadow-inner"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vintage Chrome Cylinder Legs Resting on Hardwood Floor */}
        <div className="relative w-full max-w-2xl flex items-center justify-between px-16 sm:px-24 -mt-2 z-20">
          <div className="flex flex-col items-center">
            <div className="w-12 h-6 rounded-b-lg chrome-finish shadow-lg" />
            <div className="w-14 h-1.5 rounded-full bg-stone-900 border-t border-black/80" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-6 rounded-b-lg chrome-finish shadow-lg" />
            <div className="w-14 h-1.5 rounded-full bg-stone-900 border-t border-black/80" />
          </div>
        </div>

        {/* Floor Contact Shadow */}
        <div className="w-full max-w-3xl h-8 fridge-floor-shadow -mt-4 z-10" />
      </main>

      {/* Frontend Admin Preview Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        recipes={recipes}
        categories={categories}
        onAddRecipe={handleAddRecipe}
        onUpdateRecipe={handleUpdateRecipe}
        onDeleteRecipe={handleDeleteRecipe}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
};
