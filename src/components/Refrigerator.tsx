"use client";

import React, { useState, useEffect } from "react";
import { Recipe, Category, FridgeSettings } from "@/types";
import { initialCategories } from "@/data/categories";
import { initialRecipes } from "@/data/recipes";
import { siteConfig } from "@/config/siteConfig";
import { fetchFridgeData, defaultFridgeSettings, defaultFridgeTags } from "@/lib/supabase/api";
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

  // Active Visible Entities (Hidden items can be drafted/tested in CMS without public exposure)
  const visibleCategories = categories.filter((c) => !c.isHidden);
  const visibleRecipes = recipes.filter((r) => !r.isHidden);
  const visibleTags = (
    settings.customTags && settings.customTags.length > 0
      ? settings.customTags
      : defaultFridgeTags
  ).filter((t) => !t.isHidden);

  // Filtered dishes
  const displayedRecipes = visibleRecipes.filter((r) => {
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

  const selectedCategoryObj = visibleCategories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="relative w-full min-h-screen bg-[#ea7317] overflow-x-hidden flex flex-col items-center select-none">

      {/* ============================================================== */}
      {/* 1:1 RETRO FRIDGE SCENE CONTAINER                               */}
      {/* Zoomed in prominently (160vw) as requested, with container    */}
      {/* query scaling so EVERY element on the fridge door scales       */}
      {/* dynamically with 100% proportional precision on any screen.    */}
      {/* ============================================================== */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: "clamp(1000px, 160vw, 2400px)",
          height: "clamp(1000px, 160vw, 2400px)",
          aspectRatio: "1 / 1",
          marginTop: "clamp(-270px, -15vw, -90px)",
          containerType: "inline-size",
        }}
      >
        {/* Real Kitchen Background Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/smeg-fridge-bg.jpg"
          alt="Retro blue fridge in warm orange kitchen"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
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
            <div
              className="rounded-full chrome-finish border-2 border-slate-300 shadow-xl flex items-center gap-1.5"
              style={{
                padding: "clamp(4px, 0.4cqw, 8px) clamp(10px, 1.1cqw, 20px)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" />
              <span
                className="font-heading tracking-[0.2em] uppercase font-extrabold text-slate-800 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
                style={{ fontSize: "clamp(11px, 1.05cqw, 18px)" }}
              >
                {settings.badgeText}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" />
            </div>
          </button>
        </div>

        {/* 2. Kitchen Whiteboard (MOUNTED ON FREEZER DOOR - DYNAMICALLY POSITIONABLE) */}
        <div
          className="absolute z-30 transition-all duration-300"
          style={{
            left: `${settings.whiteboardPos?.x ?? 51.05}%`,
            top: `${settings.whiteboardPos?.y ?? 22.8}%`,
            transform: "translateX(-50%)",
            width: `${settings.whiteboardPos?.width ?? 29}%`,
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
            totalRecipesCount={visibleRecipes.length}
            currentDisplayCount={displayedRecipes.length}
          />
        </div>

        {/* 3. Handwritten Intro Note ("A little taste of home") - Below Whiteboard on Freezer */}
        {!settings.introNotePos?.isHidden && (
          <div
            className="absolute z-20 flex flex-col items-center transition-all duration-300"
            style={{
              left: `${settings.introNotePos?.x ?? 48}%`,
              top: `${settings.introNotePos?.y ?? 35.8}%`,
              transform: `translateX(-50%) rotate(${settings.introNotePos?.rotation ?? -1}deg) scale(${settings.introNotePos?.scale ?? 1})`,
              width: `${settings.introNotePos?.width ?? 19}%`,
            }}
          >
            <div
              className="relative bg-[#fefce8] text-[#2c1d11] rounded-xs paper-shadow-md border border-amber-200/90 text-center transition-transform duration-200 hover:rotate-0 w-full"
              style={{
                padding: "clamp(6px, 0.7cqw, 14px) clamp(10px, 1.1cqw, 22px)",
                clipPath: "polygon(0 0, 100% 0.5%, 99.5% 99.5%, 0.5% 100%)",
              }}
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30">
                <Magnet color="#dc2626" size="sm" shape="round" />
              </div>
              <p
                className="font-handwriting font-bold leading-tight text-amber-950"
                style={{ fontSize: "clamp(14px, 1.5cqw, 26px)" }}
              >
                &ldquo;{settings.tagline}&rdquo;
              </p>
              <p
                className="font-handwriting text-amber-900/90 leading-snug mt-1 mx-auto"
                style={{ fontSize: "clamp(11px, 1.15cqw, 18px)" }}
              >
                {settings.subIntro}
              </p>
            </div>
          </div>
        )}

        {/* 4. Dynamic Fridge Sticky Tags (Add / Remove / Edit in Visual Arranger) */}
        {visibleTags.map((tag) => (
          <div
            key={tag.id}
            className="absolute z-20 pointer-events-none transition-transform duration-200"
            style={{
              left: `${tag.xPos}%`,
              top: `${tag.yPos}%`,
              transform: `translate(-50%, -50%) rotate(${tag.rotation ?? 0}deg) scale(${tag.scale ?? 1})`,
              transformOrigin: "center center",
            }}
          >
            <div
              className="relative font-handwriting font-bold rounded-sm shadow-md border text-center whitespace-nowrap"
              style={{
                backgroundColor: tag.color || "#fef9c3",
                borderColor: "rgba(0,0,0,0.14)",
                color: "#1e293b",
                fontSize: `calc(clamp(13px, 1.35cqw, 24px) * ${tag.scale ?? 1})`,
                padding: "clamp(5px, 0.55cqw, 12px) clamp(10px, 1.1cqw, 22px)",
              }}
            >
              <div className="absolute -top-2.5 right-1 pointer-events-none">
                <Magnet color={tag.magnetColor || "#ef4444"} size="sm" shape="heart" />
              </div>
              <span className="leading-tight drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
                {tag.text}
              </span>
              {tag.subText && (
                <div
                  className="font-normal opacity-85 mt-0.5"
                  style={{ fontSize: "0.85em" }}
                >
                  {tag.subText}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* ============================================================ */}
        {/* ZONE B: LOWER FRIDGE DOOR (y: 45.0% to 95.0%, x: 34.4% to 67.7%) */}
        {/* ALL category notes, dish polaroids, and recipes live here!    */}
        {/* Strictly contained between 35.8% and 66.3% = 100% on door!   */}
        {/* ============================================================ */}

        <div
          className="absolute z-20"
          style={{
            left: "51.05%",
            top: "50.0%",
            transform: "translateX(-50%)",
            width: "30.5%",
          }}
        >
          {/* VIEW: DISH NOTES (WHEN CATEGORY IS SELECTED OR SEARCHING) */}
          {selectedCategoryId || searchQuery ? (

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
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-[0.7cqw] justify-items-center pt-2">
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
              <div className="text-center mb-[0.6cqw]">
                <span
                  className="font-handwriting font-bold text-amber-950 rounded-full border border-amber-300/80 shadow-xs inline-block bg-amber-100/90"
                  style={{
                    fontSize: "clamp(9px, 0.9cqw, 15px)",
                    padding: "clamp(2px, 0.2cqw, 4px) clamp(8px, 0.8cqw, 14px)",
                  }}
                >
                  ✨ Pick a category sticky note to explore recipes ✨
                </span>
              </div>

              {/* Strict 3-Column Grid: 9 square notes in 3 rows fits cleanly on the door! */}
              <div
                className="w-full grid grid-cols-3 gap-[0.7cqw] justify-items-center pt-1 transition-transform"
                style={{
                  transform: `scale(${settings.notesScale || 1})`,
                  transformOrigin: "top center",
                }}
              >
                {[...visibleCategories]
                  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                  .map((category) => {
                    const count = visibleRecipes.filter((r) => r.categoryId === category.id).length;
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
      {/* END 1:1 FRIDGE SCENE CONTAINER */}

      {/* ============================================================== */}
      {/* FULLSCREEN BLURRED RECIPE POPUP (OCCUPIES MAJORITY OF SCREEN)  */}
      {/* ============================================================== */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 lg:p-12 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseRecipe}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col bg-[#fffdfa] border border-amber-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <RecipeSheet
              recipe={selectedRecipe}
              onClose={handleCloseRecipe}
              onToggleFavorite={(id) => handleToggleFavorite(id)}
              soundEnabled={soundEnabled}
            />
          </div>
        </div>
      )}

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
