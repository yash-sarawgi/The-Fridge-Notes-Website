"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Recipe, Category } from "@/types";
import { initialCategories } from "@/data/categories";
import { initialRecipes } from "@/data/recipes";
import { siteConfig } from "@/config/siteConfig";
import { SmegBadge } from "./SmegBadge";
import { CategoryNote } from "./CategoryNote";
import { DishNote } from "./DishNote";
import { RecipeSheet } from "./RecipeSheet";
import { KitchenWhiteboard } from "./KitchenWhiteboard";
import { AdminModal } from "./AdminModal";
import { Magnet } from "./Magnet";
import { playMagnetClick, playPaperRustle } from "@/utils/audio";
import { ArrowLeft, ZoomOut, ZoomIn, Sparkles, ChefHat } from "lucide-react";

export const Refrigerator: React.FC = () => {
  // Camera & View Mode
  // "zoomed-out" shows the complete kitchen photo from your reference image.
  // "zoomed-in" zooms directly into the refrigerator, enabling natural scrolling down the doors.
  const [zoomMode, setZoomMode] = useState<"zoomed-out" | "zoomed-in">("zoomed-out");
  const [hasAutoZoomed, setHasAutoZoomed] = useState(false);

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

  // Ref to fridge top for scrolling
  const fridgeTopRef = useRef<HTMLDivElement>(null);

  // 1. Automatic Entrance Animation:
  // Starts with the full zoomed-out kitchen photo, then smoothly zooms into the fridge!
  useEffect(() => {
    const timer = setTimeout(() => {
      setZoomMode("zoomed-in");
      setHasAutoZoomed(true);
      playMagnetClick(soundEnabled);
    }, 1500);

    return () => clearTimeout(timer);
  }, [soundEnabled]);

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
        } else if (zoomMode === "zoomed-in") {
          setZoomMode("zoomed-out");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRecipe, selectedCategoryId, zoomMode, soundEnabled]);

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
    <div className="relative min-h-screen w-full bg-[#18110b] overflow-x-hidden select-none">
      
      {/* ============================================================== */}
      {/* FLOATING CAMERA CONTROL BAR                                    */}
      {/* ============================================================== */}
      <header className="fixed top-3 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
        
        {/* Brand Tag Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-heading tracking-widest text-xs uppercase font-extrabold">
            {siteConfig.name}
          </span>
        </div>

        {/* Camera Zoom Toggle Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              playMagnetClick(soundEnabled);
              setZoomMode(zoomMode === "zoomed-out" ? "zoomed-in" : "zoomed-out");
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-transform duration-200 hover:scale-105 active:scale-95 shadow-xl border border-amber-300 cursor-pointer"
            title={zoomMode === "zoomed-out" ? "Step closer to Refrigerator" : "Step back to Full Kitchen"}
          >
            {zoomMode === "zoomed-out" ? (
              <>
                <ZoomIn className="w-4 h-4" />
                <span>Step Closer to Fridge ➔</span>
              </>
            ) : (
              <>
                <ZoomOut className="w-4 h-4" />
                <span>🔍 View Full Kitchen</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* VIEWPORT PRESENTATION                                          */}
      {/* ============================================================== */}
      <AnimatePresence mode="wait">
        
        {/* ============================================================ */}
        {/* 1. ZOOMED-OUT FULL KITCHEN SCENE (EXACT PHOTO FROM REFERENCE) */}
        {/* ============================================================ */}
        {zoomMode === "zoomed-out" ? (
          <motion.div
            key="zoomed-out-kitchen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8"
          >
            {/* Ambient Background Glow matching the kitchen photo */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#e86b2e]/30 via-transparent to-[#1a110a] pointer-events-none" />

            {/* The Actual Real Photograph with Mapped Fridge Notes */}
            <div
              onClick={() => {
                setZoomMode("zoomed-in");
                playMagnetClick(soundEnabled);
              }}
              className="group relative w-full max-w-[736px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-black/40 cursor-pointer"
              title="Click to zoom in to the refrigerator!"
            >
              {/* The Real Kitchen Image (with SMEG text cleanly inpainted) */}
              <Image
                src="/images/smeg-fridge-clean.jpg"
                alt="Cozy retro kitchen with vintage refrigerator"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-102"
              />

              {/* Mapped Fridge Door Surface Area (Exact coordinates on 736x736 image) */}
              {/* Left: 41.3%, Top: 16.2%, Width: 40.4%, Height: 69.4% */}
              <div
                className="absolute"
                style={{
                  left: "41.3%",
                  top: "16.2%",
                  width: "40.4%",
                  height: "69.4%",
                }}
              >
                {/* 3D Chrome Emblem: "THE FRIDGE NOTES" (Replaces SMEG on the freezer door) */}
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-4/5 text-center pointer-events-none">
                  <span
                    className="font-heading font-black text-xs sm:text-sm tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    style={{
                      background: "linear-gradient(180deg, #ffffff 0%, #cbd5e1 50%, #64748b 52%, #e2e8f0 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    THE FRIDGE NOTES
                  </span>
                </div>

                {/* Handwritten Intro Sticky Note on Freezer */}
                <div
                  className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[72%] p-2 bg-[#fefce8] text-[#2c1d11] rounded-xs paper-shadow-md border border-amber-200 transform -rotate-1 text-center pointer-events-none"
                  style={{
                    boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Magnet color="#dc2626" size="sm" shape="round" />
                  </div>
                  <p className="font-handwriting text-[10px] sm:text-xs font-bold leading-tight text-amber-950">
                    &ldquo;{siteConfig.tagline}&rdquo;
                  </p>
                </div>

                {/* A few sample mini sticky notes on the lower door */}
                <div className="absolute top-[52%] left-[12%] w-[38%] p-1.5 bg-[#fef08a] rounded-xs shadow-md border border-amber-300 transform -rotate-3 text-center pointer-events-none">
                  <div className="absolute -top-1.5 left-2">
                    <Magnet color="#0284c7" size="sm" />
                  </div>
                  <span className="font-handwriting text-[9px] font-bold text-amber-950 block truncate">
                    🥪 Sandwiches
                  </span>
                </div>

                <div className="absolute top-[55%] right-[10%] w-[38%] p-1.5 bg-[#fbcfe8] rounded-xs shadow-md border border-pink-300 transform rotate-2 text-center pointer-events-none">
                  <div className="absolute -top-1.5 right-2">
                    <Magnet color="#eab308" size="sm" />
                  </div>
                  <span className="font-handwriting text-[9px] font-bold text-pink-950 block truncate">
                    🍰 Desserts
                  </span>
                </div>

                <div className="absolute top-[72%] left-[22%] w-[55%] p-1.5 bg-[#bbf7d0] rounded-xs shadow-md border border-emerald-300 transform -rotate-1 text-center pointer-events-none">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                    <Magnet color="#8b5cf6" size="sm" />
                  </div>
                  <span className="font-handwriting text-[9px] font-bold text-emerald-950 block truncate">
                    🍪 9 Categories Pinned
                  </span>
                </div>
              </div>

              {/* Welcoming Overlay Cue */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 border border-white/20 shadow-xl group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Click anywhere to step into the fridge</span>
              </div>
            </div>
          </motion.div>
        ) : (
          
          /* ============================================================ */
          /* 2. ZOOMED-IN FOCUSED REFRIGERATOR (SCROLLABLE DOWN THE DOOR) */
          /* ============================================================ */
          <motion.div
            key="zoomed-in-fridge"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-screen w-full flex flex-col items-center justify-start pt-16 pb-28 px-2 sm:px-6"
          >
            {/* Atmospheric Blurred Kitchen Photo as Room Backdrop */}
            <div
              className="fixed inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/smeg-fridge-clean.jpg')",
                filter: "blur(4px) brightness(0.65)",
                transform: "scale(1.05)",
              }}
            />

            {/* Main Interactive Refrigerator Container */}
            {/* Uses the real cropped SMEG refrigerator image for 100% photorealistic realism */}
            <div
              ref={fridgeTopRef}
              className="relative z-10 w-full max-w-[740px] mx-auto rounded-[46px] sm:rounded-[56px] overflow-hidden shadow-2xl border-4 border-black/40 flex flex-col"
              style={{
                boxShadow: "0 25px 60px -10px rgba(0,0,0,0.7), 0 35px 80px rgba(0,0,0,0.5)",
              }}
            >
              
              {/* ======================================================== */}
              {/* UPPER FREEZER DOOR (REAL PHOTOGRAPHIC TEXTURE & HANDLES) */}
              {/* ======================================================== */}
              <div className="relative w-full aspect-[630/425] flex flex-col items-center justify-start pt-6 sm:pt-8 px-6 overflow-hidden">
                
                {/* Real Photographic Freezer Door Texture */}
                <Image
                  src="/images/smeg-fridge-door.jpg"
                  alt="Retro refrigerator freezer door"
                  fill
                  priority
                  className="object-cover object-top pointer-events-none"
                />

                {/* 3D Chrome Block Lettering: "F R I D G E   N O T E S" */}
                <div className="relative z-20 mt-2 mb-3">
                  <SmegBadge
                    onClick={() => {
                      playMagnetClick(soundEnabled);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </div>

                {/* Handwritten Introduction Note Pinned on Freezer Door */}
                <div
                  className="relative z-20 px-6 py-3 bg-[#fefce8] text-[#2c1d11] rounded-sm paper-shadow-md border border-amber-200 max-w-md text-center transform -rotate-1 transition-transform hover:rotate-0"
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

                {/* Cute Ambient Reminder on Freezer */}
                <div className="hidden sm:block absolute bottom-4 right-8 z-20 pointer-events-none transform rotate-3">
                  <div className="px-3 py-1 bg-yellow-100 text-amber-950 font-handwriting text-xs rounded shadow-xs border border-amber-300">
                    <span>Don&apos;t forget butter!</span> 🧈
                  </div>
                  <div className="absolute -top-2 right-4">
                    <Magnet color="#ef4444" size="sm" shape="heart" />
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* LOWER MAIN REFRIGERATOR DOOR (SCROLLABLE DOWN AREA)       */}
              {/* ======================================================== */}
              <div
                className="relative w-full flex-1 min-h-[880px] flex flex-col justify-start pb-12 pt-8"
                style={{
                  background: "linear-gradient(180deg, #2488cc 0%, #207dbd 25%, #1c72ad 60%, #155d8f 100%)",
                }}
              >
                {/* Chrome seam reflection at top of lower door */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />

                {/* Dry-Erase Kitchen Whiteboard Strip (Search & Filters) */}
                <div className="relative z-20 px-3 sm:px-6 mb-4">
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

                {/* ====================================================== */}
                {/* MAIN DOOR INTERACTIVE SURFACE                          */}
                {/* ====================================================== */}
                <div className="relative z-20 w-full flex-1 px-4 sm:px-8 py-3 flex flex-col justify-start">
                  
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
                      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-3xl px-2">
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
                          <p className="font-handwriting text-2xl font-bold text-white drop-shadow-md">
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
                        <div className="w-full flex flex-wrap items-start justify-center gap-6 sm:gap-7 pt-2 pb-10">
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
                    
                    /* VIEW 3: HOMEPAGE CATEGORY NOTES ORGANICALLY MOUNTED ON THE DOOR */
                    <div className="w-full flex flex-col items-center">
                      <div className="text-center mb-6">
                        <span className="font-handwriting text-lg sm:text-xl text-amber-950 font-bold px-4 py-1.5 bg-amber-100/90 rounded-full border border-amber-300 shadow-md">
                          ✨ Pick a category sticky note to explore recipes ✨
                        </span>
                      </div>

                      {/* Organic Scrapbook Layout for Categories */}
                      <div className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-7 max-w-2xl pt-2 pb-8">
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

                {/* Base of the fridge with cylinder feet */}
                <div className="relative w-full max-w-md mx-auto flex items-center justify-between px-12 mt-auto pt-6">
                  <div className="w-12 h-5 rounded-b-md smeg-cylinder-foot shadow-lg" />
                  <div className="w-12 h-5 rounded-b-md smeg-cylinder-foot shadow-lg" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
