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
    // If a category is selected, only show dishes belonging to it (unless search is actively used)
    if (selectedCategoryId && !searchQuery) {
      if (r.categoryId !== selectedCategoryId) return false;
    }

    // Filter type
    if (activeFilter === "photo" && r.style !== "photo") return false;
    if (activeFilter === "text" && r.style !== "text") return false;
    if (activeFilter === "favorites" && !r.isFavorite) return false;
    if (activeFilter === "quick") {
      const minutes = parseInt(r.totalTime) || 40;
      if (minutes > 30) return false;
    }

    // Search query
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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-6">
      
      {/* Surroundings: Vintage Kitchen Wall Wallpaper with subtle warm shadow */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* ========================================================= */}
        {/* THE VINTAGE CREAM REFRIGERATOR (MAIN INTERFACE) */}
        {/* ========================================================= */}
        <div
          className="relative w-full rounded-[38px] sm:rounded-[48px] fridge-body-enamel border-[5px] sm:border-[8px] border-[#ede3d4] flex flex-col overflow-hidden pb-12 transition-all duration-300"
          style={{
            minHeight: "88vh",
          }}
        >
          {/* Subtle Top Freezer Compartment Seam with Chrome Molding */}
          <div className="relative w-full pt-1">
            <div className="w-full h-1.5 chrome-finish opacity-70 my-1" />
          </div>

          {/* Refrigerator Chrome Logo Badge & Handwritten Tagline Note */}
          <RefrigeratorHeader
            onTitleClick={handleBackToCategories}
            soundEnabled={soundEnabled}
          />

          {/* Retro Chrome Fridge Handle mounted on the right */}
          <div
            className="hidden md:flex absolute top-52 right-3 w-7 h-44 rounded-full chrome-handle z-30 cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-95 items-center justify-center group"
            title="Vintage latch handle"
            onClick={() => playMagnetClick(soundEnabled)}
            aria-hidden="true"
          >
            {/* Latch screw detail */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-600 shadow-inner group-hover:rotate-45 transition-transform" />
            <div className="absolute top-3 w-3 h-1.5 rounded-xs bg-slate-400/80 shadow-xs" />
            <div className="absolute bottom-3 w-3 h-1.5 rounded-xs bg-slate-400/80 shadow-xs" />
          </div>

          {/* Interactive Whiteboard strip for search & audio controls */}
          <KitchenWhiteboard
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (q.trim()) {
                // If searching, clear recipe view to show search results on fridge
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

          {/* Decorative ambient magnets on the fridge door */}
          <div className="hidden lg:block absolute top-28 left-6 z-10 pointer-events-none transform -rotate-6">
            <div className="px-3 py-1 bg-yellow-100/90 text-amber-950 font-handwriting text-xs rounded-xs shadow-xs border border-amber-200">
              <span className="font-bold">Reminder:</span> Buy fresh sourdough! 🥖
            </div>
            <div className="absolute -top-2 left-4">
              <Magnet color="#10b981" size="sm" shape="round" />
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-12 right-12 z-10 pointer-events-none transform rotate-3">
            <div className="px-3 py-1 bg-rose-100/90 text-rose-950 font-handwriting text-xs rounded-xs shadow-xs border border-rose-200">
              &ldquo;Good food = Good mood&rdquo; 🍓
            </div>
            <div className="absolute -top-2 right-4">
              <Magnet color="#ec4899" size="sm" shape="heart" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* FRIDGE DOOR INTERACTION VIEWS */}
          {/* The same refrigerator always remains visible! */}
          {/* ========================================================= */}
          <div className="relative w-full flex-1 px-4 sm:px-8 lg:px-12 py-4 z-20 flex flex-col justify-start">
            
            {/* VIEW 1: EXPANDED RECIPE VIEW (REMAINS ON THE SAME FRIDGE) */}
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
                    className="group relative cursor-pointer px-5 py-2.5 bg-[#fefce8] text-amber-950 rounded-sm paper-shadow-md border border-amber-200/80 transform -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-500"
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
                  <div className="relative px-4 py-1.5 bg-white/80 rounded-full border border-stone-300/80 shadow-xs flex items-center gap-2">
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
                  <div className="py-16 text-center space-y-3">
                    <div className="text-4xl">🍳</div>
                    <p className="font-handwriting text-2xl font-bold text-stone-700">
                      No recipe notes match this search.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveFilter("all");
                      }}
                      className="px-4 py-1.5 rounded-full bg-amber-900 text-white font-handwriting text-base font-bold hover:bg-amber-800 cursor-pointer"
                    >
                      Show all dishes
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex flex-wrap items-start justify-center gap-5 sm:gap-7 lg:gap-8 pt-4 pb-12">
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
                <div className="text-center mb-5">
                  <span className="font-handwriting text-base sm:text-lg text-amber-950 font-bold px-3 py-1 bg-amber-100/60 rounded-full border border-amber-300/50">
                    ✨ Pick a category sticky note to explore recipes ✨
                  </span>
                </div>

                {/* Organic Scrapbook Layout for Categories */}
                <div className="w-full flex flex-wrap items-center justify-center gap-5 sm:gap-7 lg:gap-8 max-w-4xl pt-2 pb-8">
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

          {/* Refrigerator Base Grille / Feet (Vintage appliance detail) */}
          <div className="relative w-full px-8 pt-4 pb-2 border-t border-stone-300/60 mt-auto bg-gradient-to-b from-transparent to-stone-200/40">
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-2 rounded-full bg-stone-400/40 border-b border-white shadow-inner"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Vintage Bottom Footers: Chrome Feet of the Refrigerator */}
        <div className="w-full max-w-4xl flex items-center justify-between px-12 -mt-2">
          <div className="w-12 h-4 rounded-b-xl chrome-finish shadow-md" />
          <div className="w-12 h-4 rounded-b-xl chrome-finish shadow-md" />
        </div>
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
