"use client";

import React, { useState, useEffect } from "react";
import { Recipe, Category, FridgeSettings } from "@/types";
import { initialCategories } from "@/data/categories";
import { initialRecipes } from "@/data/recipes";
import { siteConfig } from "@/config/siteConfig";
import { fetchFridgeData, defaultFridgeSettings } from "@/lib/supabase/api";
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
  const [settings, setSettings] = useState<FridgeSettings>(defaultFridgeSettings);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "photo" | "text" | "quick" | "favorites">("all");

  // Audio preference (default OFF)
  const [soundEnabled, setSoundEnabled] = useState(siteConfig.defaultAudioEnabled);

  // Admin Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load live data from Supabase (or localStorage fallback)
  useEffect(() => {
    let mounted = true;
    fetchFridgeData().then((data) => {
      if (mounted) {
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
        if (data.recipes && data.recipes.length > 0) setRecipes(data.recipes);
        if (data.settings) setSettings(data.settings);
      }
    });
    return () => {
      mounted = false;
    };
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
    <div className="relative w-full min-h-screen bg-[#ea7317] overflow-x-hidden flex flex-col items-center select-none">

      {/* ============================================================== */}
      {/* 1:1 RETRO FRIDGE SCENE CONTAINER                               */}
      {/* Zoomed in significantly (175vw) so the fridge fills ~90% of    */}
      {/* the screen, and shifted up (marginTop -15vw) to eliminate      */}
      {/* the top blank wall space completely.                           */}
      {/* ============================================================== */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: "clamp(1200px, 175vw, 2400px)",
          height: "clamp(1200px, 175vw, 2400px)",
          marginTop: "clamp(-260px, -15vw, -140px)",
        }}
      >
        {/* Real Kitchen Background Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/smeg-fridge-bg.jpg"
          alt="Retro blue fridge in warm orange kitchen"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          style={{ maxWidth: "none" }}
          draggable={false}
        />

        {/* ============================================================ */}
        {/* ZONE A: UPPER FREEZER DOOR (y: 15.6% to 43.7%, x: 34.4% to 67.7%) */}
        {/* ============================================================ */}

        {/* 1. Chrome Fridge Crown Badge ("THE FRIDGE NOTES") */}
        <div
          className="absolute z-30"
          style={{
            left: "51.05%",
            top: "17.2%",
            transform: "translateX(-50%)",
          }}
        >
          <button
            onClick={handleBackToCategories}
            title="Return to fridge home"
            className="group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="Return to fridge home"
          >
            <div className="px-4 py-1 sm:px-5 sm:py-1.5 rounded-full chrome-finish border-2 border-slate-300 shadow-xl flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400 flex-shrink-0" />
              <span className="font-heading tracking-[0.2em] text-xs sm:text-sm uppercase font-extrabold text-slate-800 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                {settings.badgeText}
              </span>
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400 flex-shrink-0" />
            </div>
          </button>
        </div>

        {/* 2. Kitchen Whiteboard (MOUNTED ON FREEZER DOOR per user request) */}
        <div
          className="absolute z-30"
          style={{
            left: "51.05%",
            top: "22.8%",
            transform: "translateX(-50%)",
            width: "clamp(280px, 29%, 560px)",
          }}
        >
          <KitchenWhiteboard
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (q.trim()) setSelectedRecipe(null);
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

        {/* 3. Handwritten Intro Note ("A little taste of home") - Below Whiteboard on Freezer */}
        <div
          className="absolute z-20 flex flex-col items-center"
          style={{
            left: "48%",
            top: "35.2%",
            transform: "translateX(-50%) rotate(-1deg)",
            width: "clamp(190px, 19%, 300px)",
          }}
        >
          <div
            className="relative px-3 py-1.5 sm:px-4 sm:py-2 bg-[#fefce8] text-[#2c1d11] rounded-xs paper-shadow-md border border-amber-200/90 text-center transition-transform duration-200 hover:rotate-0"
            style={{
              clipPath: "polygon(0 0, 100% 0.5%, 99.5% 99.5%, 0.5% 100%)",
            }}
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30">
              <Magnet color="#dc2626" size="sm" shape="round" />
            </div>
            <p className="font-handwriting text-sm sm:text-base font-bold leading-tight text-amber-950">
              &ldquo;{settings.tagline}&rdquo;
            </p>
            <p className="font-handwriting text-[11px] sm:text-xs text-amber-900/90 leading-snug mt-0.5 max-w-[210px] mx-auto">
              {settings.subIntro}
            </p>
          </div>
        </div>

        {/* 4. "Don't forget butter! 🧈" Note - Strictly inside right of freezer */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: "60.5%",
            top: "35.5%",
            width: "clamp(50px, 5.5%, 80px)",
            transform: "rotate(3deg)",
          }}
        >
          <div className="relative px-2 py-1 bg-yellow-100 text-amber-950 font-handwriting text-[10px] sm:text-xs font-bold rounded shadow-sm border border-amber-300 text-center">
            <div className="absolute -top-2 right-1">
              <Magnet color="#ef4444" size="sm" shape="heart" />
            </div>
            <span>{settings.butterNoteText}</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ZONE B: LOWER FRIDGE DOOR (y: 45.0% to 95.0%, x: 34.4% to 67.7%) */}
        {/* ALL category notes, dish polaroids, and recipes live here!    */}
        {/* Strictly contained between 35.8% and 66.3% = 100% on door!   */}
        {/* ============================================================ */}

        <div
          className="absolute z-20"
          style={{
            left: "51.05%",
            top: "49.5%",
            transform: "translateX(-50%)",
            width: "clamp(320px, 30.5%, 660px)",
          }}
        >
          {/* VIEW 1: EXPANDED RECIPE SHEET */}
          {selectedRecipe ? (
            <div className="w-full pb-8">
              <RecipeSheet
                recipe={selectedRecipe}
                onClose={handleCloseRecipe}
                onToggleFavorite={(id) => handleToggleFavorite(id)}
                soundEnabled={soundEnabled}
              />
            </div>
          ) : selectedCategoryId || searchQuery ? (

            /* VIEW 2: DISH NOTES FOR SELECTED CATEGORY OR SEARCH */
            <div className="w-full flex flex-col items-center gap-3 pb-8">
              {/* Navigation Back Button & Filter Tag */}
              <div className="flex flex-wrap items-center justify-between gap-2 w-full px-1">
                <button
                  onClick={handleBackToCategories}
                  onMouseEnter={handleHoverNote}
                  className="group relative cursor-pointer px-3 py-1 bg-[#fefce8] text-amber-950 rounded-sm paper-shadow-md border border-amber-200 transform -rotate-1 hover:rotate-0 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Back to all categories"
                >
                  <div className="absolute -top-2 left-2.5 z-20">
                    <Magnet color="#ef4444" size="sm" />
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-800 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-handwriting text-xs sm:text-sm font-bold">
                    ← Back to categories
                  </span>
                </button>

                <div className="relative px-2.5 py-0.5 bg-white/95 rounded-full border border-stone-300 shadow-xs flex items-center gap-1.5 text-stone-900">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: selectedCategoryObj?.magnetColor || "#ef4444" }}
                  />
                  <span className="font-handwriting text-xs sm:text-sm font-bold">
                    {searchQuery
                      ? `"${searchQuery}"`
                      : `${selectedCategoryObj?.name || "Dishes"} (${displayedRecipes.length})`}
                  </span>
                </div>
              </div>

              {/* Dish Notes Grid - 3 columns, stays 100% on the door */}
              {displayedRecipes.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="text-4xl">🍳</div>
                  <p className="font-handwriting text-lg font-bold text-stone-800">
                    No recipe notes found.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                    className="px-3.5 py-1 rounded-full bg-amber-900 text-white font-handwriting text-xs font-bold hover:bg-amber-800 cursor-pointer shadow-sm"
                  >
                    Show all recipes
                  </button>
                </div>
              ) : (
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 justify-items-center pt-2">
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

            /* VIEW 3: HOMEPAGE 9 CATEGORY NOTES (Strictly 3x3 grid = 100% on fridge door) */
            <div className="w-full flex flex-col items-center pb-6">
              <div className="text-center mb-2">
                <span className="font-handwriting text-xs font-bold text-amber-950 px-2.5 py-0.5 bg-amber-100/90 rounded-full border border-amber-300 shadow-sm inline-block">
                  ✨ Pick a category sticky note to explore recipes ✨
                </span>
              </div>

              {/* Strict 3-Column Grid: 9 notes in 3 rows fits cleanly on the door! */}
              <div className="w-full grid grid-cols-3 gap-2 sm:gap-2.5 justify-items-center pt-1">
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

        {/* 5. Decorative Mood Sticky Note on Bottom Right of Fridge Door */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: "60%",
            top: "84.5%",
            width: "clamp(65px, 6.5%, 95px)",
            transform: "rotate(2deg)",
          }}
        >
          <div className="relative px-2 py-1 bg-rose-100 text-rose-950 font-handwriting text-[10px] sm:text-xs font-bold rounded shadow-sm border border-rose-200 whitespace-nowrap text-center">
            &ldquo;{settings.moodNoteText}&rdquo;
            <div className="absolute -top-1.5 right-1">
              <Magnet color="#ec4899" size="sm" shape="heart" />
            </div>
          </div>
        </div>

      </div>
      {/* END 1:1 FRIDGE SCENE CONTAINER */}

      {/* Admin Modal */}
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
