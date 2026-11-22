"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Recipe, Category } from "@/types";
import { initialCategories } from "@/data/categories";
import { initialRecipes } from "@/data/recipes";
import { siteConfig } from "@/config/siteConfig";
import { SmegBadge } from "./SmegBadge";
import { SmegHandle } from "./SmegHandle";
import { CategoryNote } from "./CategoryNote";
import { DishNote } from "./DishNote";
import { RecipeSheet } from "./RecipeSheet";
import { KitchenWhiteboard } from "./KitchenWhiteboard";
import { AdminModal } from "./AdminModal";
import { Magnet } from "./Magnet";
import { playMagnetClick, playPaperRustle } from "@/utils/audio";
import { ArrowLeft, ZoomOut, ZoomIn, Palette, Sparkles, ChefHat } from "lucide-react";

type FridgeColor = "blue" | "cream" | "mint" | "pink";

export const Refrigerator: React.FC = () => {
  // Camera & View Mode
  // "zoomed-out" shows the complete kitchen scene from the reference photo.
  // "zoomed-in" zooms directly into the refrigerator, enabling natural scrolling down the doors.
  const [zoomMode, setZoomMode] = useState<"zoomed-out" | "zoomed-in">("zoomed-out");
  const [hasAutoZoomed, setHasAutoZoomed] = useState(false);

  // Refrigerator Color Theme (defaulting to the iconic Retro Blue from the user's reference photo!)
  const [fridgeColor, setFridgeColor] = useState<FridgeColor>("blue");

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

  // Ref to scroll container
  const fridgeContainerRef = useRef<HTMLDivElement>(null);

  // 1. Automatic Entrance Animation:
  // Starts in zoomed-out kitchen view, then smoothly zooms into the freezer door!
  useEffect(() => {
    const timer = setTimeout(() => {
      setZoomMode("zoomed-in");
      setHasAutoZoomed(true);
      playMagnetClick(soundEnabled);
    }, 1400);

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
    // Smooth scroll down to main notes area if needed
    if (fridgeContainerRef.current) {
      fridgeContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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

  // Dynamic enamel class based on user chosen retro color
  const getEnamelClass = () => {
    switch (fridgeColor) {
      case "cream":
        return "fridge-enamel-cream text-[#2a1d15]";
      case "mint":
        return "fridge-enamel-mint text-[#173029]";
      case "pink":
        return "fridge-enamel-pink text-[#351824]";
      default:
        // Retro blue matching reference image
        return "fridge-enamel-blue text-white";
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#18110b] overflow-x-hidden select-none">
      
      {/* ============================================================== */}
      {/* FLOATING CAMERA CONTROL BAR (ZOOM OUT / ZOOM IN & COLOR PICKER)*/}
      {/* ============================================================== */}
      <header className="fixed top-3 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
        
        {/* Brand Tag Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-heading tracking-widest text-xs uppercase font-extrabold">
            {siteConfig.name}
          </span>
        </div>

        {/* Camera Zoom Toggle & Color Swatches */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          {/* Color Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-lg">
            <Palette className="w-3.5 h-3.5 text-white/80 mr-1" />
            <button
              onClick={() => { setFridgeColor("blue"); playMagnetClick(soundEnabled); }}
              className={`w-4 h-4 rounded-full bg-sky-400 border transition-transform ${fridgeColor === "blue" ? "scale-125 border-white ring-2 ring-white/50" : "border-black/30 hover:scale-110"}`}
              title="Retro Sky Blue (Original SMEG)"
            />
            <button
              onClick={() => { setFridgeColor("cream"); playMagnetClick(soundEnabled); }}
              className={`w-4 h-4 rounded-full bg-[#f6efe1] border transition-transform ${fridgeColor === "cream" ? "scale-125 border-white ring-2 ring-white/50" : "border-black/30 hover:scale-110"}`}
              title="Vintage Ivory Cream"
            />
            <button
              onClick={() => { setFridgeColor("mint"); playMagnetClick(soundEnabled); }}
              className={`w-4 h-4 rounded-full bg-emerald-300 border transition-transform ${fridgeColor === "mint" ? "scale-125 border-white ring-2 ring-white/50" : "border-black/30 hover:scale-110"}`}
              title="Retro Mint Sage"
            />
            <button
              onClick={() => { setFridgeColor("pink"); playMagnetClick(soundEnabled); }}
              className={`w-4 h-4 rounded-full bg-pink-300 border transition-transform ${fridgeColor === "pink" ? "scale-125 border-white ring-2 ring-white/50" : "border-black/30 hover:scale-110"}`}
              title="Pastel Dusty Pink"
            />
          </div>

          {/* Zoom Toggle Button */}
          <button
            onClick={() => {
              playMagnetClick(soundEnabled);
              setZoomMode(zoomMode === "zoomed-out" ? "zoomed-in" : "zoomed-out");
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-transform duration-200 hover:scale-105 active:scale-95 shadow-lg border border-amber-300 cursor-pointer"
            title={zoomMode === "zoomed-out" ? "Zoom into Refrigerator" : "Zoom out to Full Kitchen"}
          >
            {zoomMode === "zoomed-out" ? (
              <>
                <ZoomIn className="w-4 h-4" />
                <span>Zoom In to Fridge</span>
              </>
            ) : (
              <>
                <ZoomOut className="w-4 h-4" />
                <span>Zoom Out to Kitchen</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* COMPLETE RETRO KITCHEN SCENE (INSPIRED DIRECTLY BY ATTACHED PHOTO) */}
      {/* ============================================================== */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden">
        
        {/* A. Warm Terracotta / Orange Upper Wall */}
        <div className="absolute top-0 left-0 right-0 h-[380px] kitchen-orange-wall z-0" />

        {/* B. Retro Wall Shelves with Cactus Pots & Glass Jars (matching the photo!) */}
        <div className="absolute top-14 left-0 right-0 max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-12 z-1 pointer-events-none opacity-90">
          
          {/* Left Wooden Shelf */}
          <div className="flex flex-col items-start w-52 sm:w-64">
            <div className="flex items-end gap-3 px-3 pb-1">
              <div className="w-6 h-10 rounded-t-sm bg-sky-200/60 border border-sky-300/40 shadow-xs" />
              <div className="w-10 h-7 rounded-sm bg-sky-400/80 shadow-xs flex items-center justify-center text-[10px]">
                🥣
              </div>
              <div className="w-8 h-12 rounded-t-md bg-stone-100/50 border border-white/40 shadow-xs" />
            </div>
            {/* Wooden shelf board */}
            <div className="w-full h-3.5 rounded-xs bg-[#935835] border-t border-[#b67852] shadow-md" />
          </div>

          {/* Right Wooden Shelf with Potted Cacti & Storage Jars */}
          <div className="flex flex-col items-end w-52 sm:w-64">
            <div className="flex items-end gap-3 px-3 pb-1">
              <div className="flex flex-col items-center">
                <span className="text-sm">🌵</span>
                <div className="w-6 h-5 rounded-sm bg-sky-400 shadow-xs" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs">🌵</span>
                <div className="w-5 h-4 rounded-sm bg-sky-400 shadow-xs" />
              </div>
              <div className="w-7 h-11 rounded-t-md bg-amber-100/60 border border-amber-200/40 shadow-xs" />
            </div>
            {/* Wooden shelf board */}
            <div className="w-full h-3.5 rounded-xs bg-[#935835] border-t border-[#b67852] shadow-md" />
          </div>
        </div>

        {/* C. White Ceramic Tile Backsplash */}
        <div className="absolute top-[280px] left-0 right-0 h-[420px] kitchen-tile-backsplash z-0" />

        {/* D. Retro Fluted Orange Cabinets on Left & Right with Stone Countertops & Oranges */}
        <div className="absolute top-[360px] left-0 right-0 max-w-6xl mx-auto flex justify-between px-4 sm:px-8 z-1 pointer-events-none">
          
          {/* Left Cabinet with Bowl of Fresh Oranges */}
          <div className="relative w-44 sm:w-64 flex flex-col items-center">
            {/* Bowl of fresh oranges on countertop */}
            <div className="relative -mb-1 flex items-center justify-center">
              <div className="w-16 h-8 rounded-b-full bg-sky-400 border border-sky-300 shadow-md flex items-center justify-center">
                <span className="text-base -mt-4">🍊🍊🍊</span>
              </div>
            </div>
            {/* Grey stone countertop */}
            <div className="w-full h-4 rounded-xs bg-[#c9d1d9] border-t border-white shadow-md" />
            {/* Fluted orange cabinet body with vertical slats */}
            <div className="w-full h-72 sm:h-80 bg-gradient-to-r from-[#e66c30] via-[#ea783e] to-[#df6427] rounded-b-md shadow-xl border-t border-black/20 p-2 flex justify-around">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2.5 h-full rounded-full bg-black/10 border-r border-white/20" />
              ))}
            </div>
          </div>

          {/* Right Cabinet with Cutting Board & Blue Bowl */}
          <div className="relative w-44 sm:w-64 flex flex-col items-center">
            {/* Cutting board and fruit */}
            <div className="relative -mb-1 flex items-center gap-2">
              <div className="w-8 h-10 rounded-t-sm bg-[#c28456] border border-[#d89c6f] shadow-xs rotate-6" />
              <div className="w-16 h-8 rounded-b-full bg-sky-400 border border-sky-300 shadow-md flex items-center justify-center">
                <span className="text-base -mt-4">🍊🍊</span>
              </div>
            </div>
            {/* Grey stone countertop */}
            <div className="w-full h-4 rounded-xs bg-[#c9d1d9] border-t border-white shadow-md" />
            {/* Fluted orange cabinet body */}
            <div className="w-full h-72 sm:h-80 bg-gradient-to-r from-[#df6427] via-[#ea783e] to-[#e66c30] rounded-b-md shadow-xl border-t border-black/20 p-2 flex justify-around">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2.5 h-full rounded-full bg-black/10 border-r border-white/20" />
              ))}
            </div>
          </div>
        </div>

        {/* E. Herringbone / Chevron Parquet Floor at the bottom */}
        <div className="absolute top-[680px] bottom-0 left-0 right-0 min-h-[500px] kitchen-herringbone-floor z-0" />

        {/* ============================================================== */}
        {/* FRAMER MOTION CAMERA RIG & INTERACTIVE REFRIGERATOR            */}
        {/* ============================================================== */}
        <motion.div
          animate={
            zoomMode === "zoomed-in"
              ? {
                  scale: 1,
                  y: 0,
                  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                }
              : {
                  scale: 0.68,
                  y: 45,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                }
          }
          className="relative z-10 w-full max-w-[880px] sm:max-w-[940px] mx-auto pt-16 sm:pt-20 pb-28 px-3 sm:px-6 flex flex-col items-center origin-top"
        >
          {/* Refrigerator Master Body (1950s SMEG-Style Curved Pill Appliance) */}
          <div
            ref={fridgeContainerRef}
            className={`relative w-full rounded-[48px] sm:rounded-[60px] smeg-fridge-body ${getEnamelClass()} flex flex-col overflow-hidden pb-10 transition-colors duration-500`}
            style={{
              minHeight: "1180px",
            }}
          >
            
            {/* ============================================================ */}
            {/* 1. UPPER FREEZER DOOR                                        */}
            {/* ============================================================ */}
            <div className="relative w-full pt-8 pb-10 px-6 sm:px-12 flex flex-col items-center">
              
              {/* Authentic 3D Chrome Spaced Lettering: "F R I D G E   N O T E S" */}
              <SmegBadge
                onClick={() => {
                  playMagnetClick(soundEnabled);
                  if (fridgeContainerRef.current) {
                    fridgeContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="mb-4"
              />

              {/* Handwritten Introduction Sticky Note pinned with 3D magnet */}
              <div
                className="relative mt-2 px-6 py-3 bg-[#fefce8] text-[#2c1d11] rounded-sm paper-shadow-md border border-amber-200 max-w-md text-center transform -rotate-1 transition-transform duration-200 hover:rotate-0"
                style={{
                  clipPath: "polygon(0 0, 100% 0.5%, 99.5% 99.5%, 0.5% 100%)",
                }}
              >
                {/* 3D Magnet */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <Magnet color="#dc2626" size="md" shape="round" />
                </div>

                <p className="font-handwriting text-xl sm:text-2xl font-bold leading-tight text-amber-950">
                  &ldquo;{siteConfig.tagline}&rdquo;
                </p>
                <p className="font-handwriting text-sm sm:text-base text-amber-900/90 leading-snug mt-1">
                  {siteConfig.subIntro}
                </p>
              </div>

              {/* Streamlined Chrome Wing Handle for the Freezer (Bottom-Left of Freezer Door) */}
              <div className="absolute bottom-3 left-4 sm:left-8 z-30">
                <SmegHandle
                  onClick={() => playMagnetClick(soundEnabled)}
                  title="Freezer door handle"
                />
              </div>

              {/* Ambient Cute Freezer Magnets */}
              <div className="hidden lg:block absolute top-10 right-14 pointer-events-none transform rotate-3">
                <div className="px-3 py-1 bg-rose-100 text-rose-950 font-handwriting text-xs rounded shadow-xs border border-rose-200">
                  <span>Don&apos;t forget butter!</span> 🧈
                </div>
                <div className="absolute -top-2 right-4">
                  <Magnet color="#ef4444" size="sm" shape="heart" />
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* 2. POLISHED CHROME SEAM DIVIDER BETWEEN DOORS               */}
            {/* ============================================================ */}
            <div className="relative w-full h-3 sm:h-3.5 smeg-chrome-divider z-20 my-1" />

            {/* ============================================================ */}
            {/* 3. LOWER MAIN REFRIGERATOR DOOR                              */}
            {/* ============================================================ */}
            <div className="relative w-full flex-1 pt-6 pb-12 flex flex-col justify-start">
              
              {/* Streamlined Chrome Wing Handle for the Main Fridge (Top-Left of Lower Door) */}
              <div className="absolute top-2 left-4 sm:left-8 z-30">
                <SmegHandle
                  onClick={() => playMagnetClick(soundEnabled)}
                  title="Main refrigerator door handle"
                />
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
                <div className="px-3 py-1 bg-yellow-100 text-amber-950 font-handwriting text-xs rounded shadow-xs border border-amber-300">
                  &ldquo;Good food = Good mood&rdquo; 🍓
                </div>
                <div className="absolute -top-2 right-4">
                  <Magnet color="#10b981" size="sm" shape="round" />
                </div>
              </div>

              {/* ========================================================== */}
              {/* INTERACTIVE DOOR SURFACE (CATEGORIES / DISHES / RECIPES)   */}
              {/* ========================================================== */}
              <div className="relative w-full flex-1 px-4 sm:px-8 lg:px-12 py-5 z-20 flex flex-col justify-start">
                
                {/* VIEW 1: EXPANDED RECIPE VIEW (STAYS MOUNTED ON THE FRIDGE) */}
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
                    
                    {/* Physical Handwritten Navigation Back Note pinned to fridge */}
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
                      <div className="relative px-4 py-1.5 bg-white/90 rounded-full border border-stone-300 shadow-xs flex items-center gap-2 text-stone-900">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedCategoryObj?.magnetColor || "#ef4444" }} />
                        <span className="font-handwriting text-lg font-bold">
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
                      <span className="font-handwriting text-lg sm:text-xl text-amber-950 font-bold px-4 py-1.5 bg-amber-100/90 rounded-full border border-amber-300 shadow-md">
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
          </div>

          {/* ============================================================ */}
          {/* 4. CHROME CYLINDER FEET RESTING ON HERRINGBONE FLOOR         */}
          {/* ============================================================ */}
          <div className="relative w-full max-w-2xl flex items-center justify-between px-16 sm:px-24 -mt-2 z-20">
            {/* Left Foot */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 rounded-b-lg smeg-cylinder-foot" />
              <div className="w-14 h-1.5 rounded-full bg-black/80" />
            </div>

            {/* Right Foot */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 rounded-b-lg smeg-cylinder-foot" />
              <div className="w-14 h-1.5 rounded-full bg-black/80" />
            </div>
          </div>

          {/* Floor Shadow Under Feet */}
          <div className="w-full max-w-3xl h-7 smeg-floor-shadow -mt-3 z-10" />
        </motion.div>
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
