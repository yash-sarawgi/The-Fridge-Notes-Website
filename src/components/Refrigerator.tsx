"use client";

import React, { useState, useEffect } from "react";
import { Recipe, Category } from "@/types";
import { initialCategories } from "@/data/categories";
import { initialRecipes } from "@/data/recipes";
import { siteConfig } from "@/config/siteConfig";
import { RefrigeratorHeader } from "./RefrigeratorHeader";
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

  // Data State (with local storage persistence for frontend admin edits)
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "photo" | "text" | "quick" | "favorites">("all");

  // Audio preference (default OFF as required by brief)
  const [soundEnabled, setSoundEnabled] = useState(siteConfig.defaultAudioEnabled);

  // Admin Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load saved recipes from localStorage on mount if available
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

  // Save recipes when updated
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

  // Admin handlers
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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden">
      
      {/* 1. Real Warm Cozy Kitchen Interior Backdrop */}
      <div className="kitchen-room-bg" />

      {/* 2. Soft Ambient Kitchen Window Light Glow */}
      <div className="kitchen-sunlight" />

      {/* 3. Hardwood Kitchen Floor Plane at bottom */}
      <div className="kitchen-floor" />

      {/* 4. Main Appliance Container: Full-Height Standing Vintage Refrigerator */}
      <div className="relative z-10 w-full max-w-[1040px] mx-auto pt-6 sm:pt-10 pb-16 px-3 sm:px-6 flex flex-col items-center">
        
        {/* ============================================================== */}
        {/* 3D REFRIGERATOR BODY WITH SIDE CABINET & PROPER ANATOMY */}
        {/* ============================================================== */}
        <div className="relative w-full flex items-stretch fridge-appliance-shadow rounded-t-[50px] sm:rounded-t-[64px] rounded-b-[20px] transition-all">
          
          {/* A. 3D Left Side Cabinet Panel (Gives authentic depth of standing appliance) */}
          <div className="hidden md:flex w-8 lg:w-11 fridge-side-cabinet rounded-tl-[50px] sm:rounded-tl-[64px] rounded-bl-[16px] shrink-0 border-r border-black/30 flex-col justify-between py-12 relative">
            {/* Subtle vintage side vents */}
            <div className="space-y-2 px-2 opacity-50">
              <div className="h-1 bg-black/20 rounded-full" />
              <div className="h-1 bg-black/20 rounded-full" />
              <div className="h-1 bg-black/20 rounded-full" />
            </div>
            {/* Lower side shadow */}
            <div className="h-24 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* B. Front Face of the Refrigerator */}
          <div className="relative flex-1 flex flex-col rounded-t-[50px] sm:rounded-t-[64px] md:rounded-tl-none rounded-b-[18px] overflow-hidden bg-[#faf6ed]">
            
            {/* ========================================================== */}
            {/* UPPER COMPARTMENT: VINTAGE FREEZER DOOR */}
            {/* ========================================================== */}
            <div className="relative w-full fridge-enamel-door rounded-t-[50px] sm:rounded-t-[64px] md:rounded-tl-none border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 border-white/80 pb-6 pt-2">
              
              {/* Exposed Vintage Chrome Hinge on upper left */}
              <div className="absolute top-8 -left-1 w-4 h-9 rounded-r-sm chrome-hinge z-30 hidden sm:block border-l border-slate-600" />

              {/* Vintage Freezer Pull Latch Handle on upper right */}
              <div
                onClick={() => playMagnetClick(soundEnabled)}
                className="absolute top-10 right-4 sm:right-6 w-5 sm:w-6 h-16 rounded-md chrome-finish z-30 cursor-pointer shadow-md transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center group"
                title="Freezer latch"
              >
                <div className="w-2.5 h-1.5 rounded-full bg-slate-400 border border-slate-600 shadow-inner group-hover:rotate-45 transition-transform" />
                <div className="w-1 h-8 rounded-full bg-slate-400/40 my-1" />
              </div>

              {/* Refrigerator Header: Chrome Logo Badge, Defrost Dial & Welcome Note */}
              <RefrigeratorHeader
                onTitleClick={handleBackToCategories}
                soundEnabled={soundEnabled}
              />

              {/* Cute Ambient Freezer Magnets */}
              <div className="hidden lg:block absolute top-12 left-10 pointer-events-none transform -rotate-6">
                <div className="px-2.5 py-1 bg-yellow-100 text-amber-950 font-handwriting text-xs rounded shadow-xs border border-amber-300">
                  <span>Ice cream inside!</span> 🍨
                </div>
                <div className="absolute -top-2 left-3">
                  <Magnet color="#06b6d4" size="sm" shape="round" />
                </div>
              </div>

              <div className="hidden lg:block absolute top-14 right-20 pointer-events-none transform rotate-3">
                <div className="px-2.5 py-1 bg-rose-100 text-rose-950 font-handwriting text-xs rounded shadow-xs border border-rose-200">
                  <span>Don&apos;t forget butter!</span> 🧈
                </div>
                <div className="absolute -top-2 right-4">
                  <Magnet color="#ec4899" size="sm" shape="heart" />
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* DOOR SEAM: DEEP HORIZONTAL RUBBER GASKET GAP & CHROME TRIM */}
            {/* ========================================================== */}
            <div className="relative w-full h-4 sm:h-5 fridge-gasket-seam z-20 flex items-center justify-center">
              {/* Polished Chrome Dividing Trim Bar */}
              <div className="w-full h-1.5 sm:h-2 chrome-finish shadow-md border-y border-slate-400/60" />
            </div>

            {/* ========================================================== */}
            {/* LOWER COMPARTMENT: MAIN TALL REFRIGERATOR DOOR */}
            {/* ========================================================== */}
            <div className="relative w-full flex-1 fridge-enamel-door min-h-[780px] sm:min-h-[850px] border-l-2 sm:border-l-4 border-white/70 flex flex-col justify-start pb-8">
              
              {/* Exposed Vintage Chrome Middle & Bottom Hinges on Left */}
              <div className="absolute top-16 -left-1 w-4 h-10 rounded-r-sm chrome-hinge z-30 hidden sm:block border-l border-slate-600" />
              <div className="absolute bottom-28 -left-1 w-4 h-10 rounded-r-sm chrome-hinge z-30 hidden sm:block border-l border-slate-600" />

              {/* ======================================================== */}
              {/* CLASSIC HEAVY VERTICAL VINTAGE CHROME REFRIGERATOR HANDLE */}
              {/* ======================================================== */}
              <div
                onClick={() => playMagnetClick(soundEnabled)}
                className="hidden md:flex absolute top-28 right-3 lg:right-4 z-30 flex-col items-center cursor-pointer group select-none"
                title="Vintage refrigerator door handle"
                aria-label="Refrigerator Handle"
              >
                {/* Top Mounting Bracket with Screw Detail */}
                <div className="w-7 h-8 rounded-t-md chrome-bracket flex items-center justify-center border-t border-white shadow-md">
                  <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-[1px] bg-slate-700 rotate-45" />
                  </div>
                </div>

                {/* Long Cylindrical Chrome Handle Bar */}
                <div className="w-6 h-72 lg:h-80 chrome-handle-vertical flex flex-col items-center justify-center relative transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-95">
                  {/* Subtle thumb latch release button in center */}
                  <div className="w-3.5 h-10 rounded-full bg-slate-400 border border-slate-600 shadow-inner group-hover:bg-slate-300 transition-colors" />
                </div>

                {/* Bottom Mounting Bracket with Screw Detail */}
                <div className="w-7 h-8 rounded-b-md chrome-bracket flex items-center justify-center border-b border-slate-600 shadow-md">
                  <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-[1px] bg-slate-700 -rotate-45" />
                  </div>
                </div>
              </div>

              {/* Dry-Erase Kitchen Whiteboard Strip (Search & Filters) */}
              <div className="pt-4 px-2 sm:px-6">
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
              <div className="hidden lg:block absolute bottom-8 right-16 z-10 pointer-events-none transform rotate-3">
                <div className="px-3 py-1 bg-rose-100 text-rose-950 font-handwriting text-xs rounded shadow-xs border border-rose-200">
                  &ldquo;Good food = Good mood&rdquo; 🍓
                </div>
                <div className="absolute -top-2 right-4">
                  <Magnet color="#ef4444" size="sm" shape="heart" />
                </div>
              </div>

              {/* ======================================================== */}
              {/* MAIN INTERACTIVE DOOR SURFACE AREA */}
              {/* All Category Notes, Dish Notes & Recipes live here! */}
              {/* ======================================================== */}
              <div className="relative w-full flex-1 px-4 sm:px-8 lg:px-12 py-5 z-20 flex flex-col justify-start">
                
                {/* VIEW 1: EXPANDED RECIPE VIEW (STAYS ATTACHED ON THE SAME FRIDGE) */}
                {selectedRecipe ? (
                  <RecipeSheet
                    recipe={selectedRecipe}
                    onClose={handleCloseRecipe}
                    onToggleFavorite={(id) => handleToggleFavorite(id)}
                    soundEnabled={soundEnabled}
                  />
                ) : selectedCategoryId || searchQuery ? (
                  
                  /* VIEW 2: SELECTED CATEGORY DISHES ON THE SAME REFRIGERATOR */
                  <div className="w-full flex flex-col items-center space-y-6">
                    
                    {/* Physical Handwritten Navigation Back Note pinned to the fridge */}
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
                      <div className="relative px-4 py-1.5 bg-white/90 rounded-full border border-stone-300 shadow-xs flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedCategoryObj?.magnetColor || "#ef4444" }} />
                        <span className="font-handwriting text-lg font-bold text-stone-800">
                          {searchQuery
                            ? `Search results for "${searchQuery}"`
                            : `${selectedCategoryObj?.name || "Dishes"} (${displayedRecipes.length})`}
                        </span>
                      </div>
                    </div>

                    {/* Dish Notes Grid (Organically arranged on the fridge door) */}
                    {displayedRecipes.length === 0 ? (
                      <div className="py-20 text-center space-y-3">
                        <div className="text-4xl">🍳</div>
                        <p className="font-handwriting text-2xl font-bold text-stone-700">
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
                      <div className="w-full flex flex-wrap items-start justify-center gap-6 sm:gap-7 lg:gap-8 pt-4 pb-12">
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
                  
                  /* VIEW 3: HOMEPAGE CATEGORY NOTES (ORGANICALLY ASSEMBLED ON THE FRIDGE) */
                  <div className="w-full flex flex-col items-center">
                    <div className="text-center mb-6">
                      <span className="font-handwriting text-lg sm:text-xl text-amber-950 font-bold px-4 py-1.5 bg-amber-100/80 rounded-full border border-amber-300 shadow-xs">
                        ✨ Pick a category sticky note to explore recipes ✨
                      </span>
                    </div>

                    {/* Organic Scrapbook Layout for Categories */}
                    <div className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-7 lg:gap-8 max-w-4xl pt-2 pb-10">
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
            </div>

            {/* ========================================================== */}
            {/* BOTTOM COMPARTMENT: RECESSED KICKPLATE & LOUVER VENTILATION GRILLE */}
            {/* ========================================================== */}
            <div className="relative w-full fridge-base-grille py-3 px-6 sm:px-12 border-t-2 border-stone-800">
              <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-3 rounded-full grille-slot"
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* RETRO CHROME BULLET LEGS RESTING ON HARDWOOD FLOOR */}
        {/* ============================================================== */}
        <div className="relative w-full max-w-3xl flex items-center justify-between px-16 sm:px-24 -mt-1 z-10">
          {/* Left Chrome Leg with Black Rubber Foot Base */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-6 rounded-b-xl chrome-bullet-foot" />
            <div className="w-14 h-2 rounded-full bg-stone-900 border-t border-black/80" />
          </div>

          {/* Right Chrome Leg with Black Rubber Foot Base */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-6 rounded-b-xl chrome-bullet-foot" />
            <div className="w-14 h-2 rounded-full bg-stone-900 border-t border-black/80" />
          </div>
        </div>

        {/* Ambient Floor Contact Shadow underneath the refrigerator feet */}
        <div className="w-full max-w-4xl h-8 fridge-floor-shadow -mt-4 z-0" />
      </div>

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
