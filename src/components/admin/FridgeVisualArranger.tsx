"use client";

import React, { useState, useEffect } from "react";
import { Category, FridgeSettings } from "@/types";
import { Magnet } from "../Magnet";
import {
  Move,
  ZoomIn,
  RotateCw,
  Save,
  RotateCcw,
  Palette,
  Check,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  Soup,
  Sandwich,
  Cake,
  Cookie,
  Utensils,
  Egg,
  Coffee,
  Salad,
  Flame,
  Wand2,
  type LucideIcon,
} from "lucide-react";

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

interface FridgeVisualArrangerProps {
  categories: Category[];
  settings: FridgeSettings;
  onSaveLayout: (updatedCategories: Category[], updatedSettings: FridgeSettings) => Promise<void>;
  onResetLayout: () => void;
  isSaving: boolean;
}

export const FridgeVisualArranger: React.FC<FridgeVisualArrangerProps> = ({
  categories: initialCategoriesProp,
  settings: initialSettingsProp,
  onSaveLayout,
  onResetLayout,
  isSaving,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategoriesProp);
  const [settings, setSettings] = useState<FridgeSettings>(initialSettingsProp);
  const [selectedId, setSelectedId] = useState<string>(categories[0]?.id || "sandwiches");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setCategories(initialCategoriesProp);
  }, [initialCategoriesProp]);

  useEffect(() => {
    setSettings(initialSettingsProp);
  }, [initialSettingsProp]);

  const selectedIndex = categories.findIndex((c) => c.id === selectedId);
  const selectedCategory = categories[selectedIndex] || categories[0];

  // Helper to update selected category attributes
  const updateSelected = (updates: Partial<Category>) => {
    if (!selectedCategory) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === selectedCategory.id ? { ...c, ...updates } : c))
    );
  };

  // Reordering helpers (Move slot in 3x3 grid)
  const swapCategories = (indexA: number, indexB: number) => {
    if (indexA < 0 || indexA >= categories.length || indexB < 0 || indexB >= categories.length) {
      return;
    }
    const copy = [...categories];
    const temp = copy[indexA];
    copy[indexA] = copy[indexB];
    copy[indexB] = temp;
    // Update displayOrder
    copy.forEach((c, idx) => {
      c.displayOrder = idx;
    });
    setCategories(copy);
  };

  const handleMove = (direction: "up" | "down" | "left" | "right") => {
    if (selectedIndex === -1) return;
    const col = selectedIndex % 3;
    const row = Math.floor(selectedIndex / 3);

    let targetIndex = selectedIndex;
    if (direction === "left" && col > 0) targetIndex = selectedIndex - 1;
    if (direction === "right" && col < 2) targetIndex = selectedIndex + 1;
    if (direction === "up" && row > 0) targetIndex = selectedIndex - 3;
    if (direction === "down" && row < Math.floor((categories.length - 1) / 3)) {
      targetIndex = selectedIndex + 3;
    }

    if (targetIndex !== selectedIndex && targetIndex < categories.length) {
      swapCategories(selectedIndex, targetIndex);
    }
  };

  // Drag and Drop reordering on the fridge door
  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
    setSelectedId(categories[idx].id);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIndex(idx);
  };

  const handleDrop = (idx: number) => {
    if (draggedIndex !== null && draggedIndex !== idx) {
      swapCategories(draggedIndex, idx);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Randomize natural tilts
  const handleRandomizeTilts = () => {
    const tilts = [-3, 2, -2, 3, -1.5, 2.5, -2.5, 1.5, -3.5];
    setCategories((prev) =>
      prev.map((c, idx) => ({
        ...c,
        rotation: tilts[idx % tilts.length],
      }))
    );
  };

  // Straighten all notes
  const handleStraightenAll = () => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        rotation: 0,
      }))
    );
  };

  // Save layout
  const handleSave = async () => {
    setSavedSuccess(false);
    await onSaveLayout(categories, settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const paperColors = [
    { name: "Cream Yellow", value: "#fef08a" },
    { name: "Warm Amber", value: "#fed7aa" },
    { name: "Soft Pink", value: "#fbcfe8" },
    { name: "Mint Green", value: "#bbf7d0" },
    { name: "Sky Blue", value: "#bae6fd" },
    { name: "Lavender", value: "#e9d5ff" },
    { name: "Pure White", value: "#ffffff" },
  ];

  const magnetColors = [
    { name: "Ruby Red", value: "#ef4444" },
    { name: "Ocean Blue", value: "#0284c7" },
    { name: "Sun Yellow", value: "#eab308" },
    { name: "Emerald Green", value: "#10b981" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Silver Metal", value: "#64748b" },
  ];

  const availableIcons = [
    { name: "sandwich", label: "Sandwich" },
    { name: "soup", label: "Soup" },
    { name: "cake", label: "Cake" },
    { name: "cookie", label: "Snack" },
    { name: "utensils", label: "Utensils" },
    { name: "egg", label: "Egg" },
    { name: "coffee", label: "Beverage" },
    { name: "salad", label: "Salad" },
    { name: "sparkles", label: "Specials" },
  ];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Move className="w-5 h-5 text-sky-400" />
            Visual Fridge Notes Arranger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any sticky note to customize it, drag & drop to swap door positions, or adjust size & tilt.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRandomizeTilts}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/50 rounded-lg transition-colors"
            title="Apply subtle cozy handwriting tilts"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Natural Tilts
          </button>
          <button
            onClick={onResetLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : savedSuccess ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {savedSuccess ? "Saved to Fridge!" : isSaving ? "Saving..." : "Save Fridge Layout"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 1:1 Scale Fridge Canvas Replica */}
        <div className="lg:col-span-7 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2.5 px-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Live Fridge Preview (1:1 with Public Website)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Drag notes to swap positions
            </span>
          </div>

          {/* Fridge Canvas Box */}
          <div
            className="relative w-full aspect-square max-w-[580px] select-none rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#ea580c]/15"
            style={{
              backgroundImage: "url(/smeg-fridge-bg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            {/* Fridge Badge Area at top */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: "51.05%",
                top: "17.5%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="px-3 py-0.5 bg-white/80 rounded-full border border-slate-300 text-[10px] font-serif font-black tracking-widest text-slate-800 shadow-sm">
                {settings.badgeText || "THE FRIDGE NOTES"}
              </div>
            </div>

            {/* Kitchen Whiteboard on Freezer Door */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: "51.05%",
                top: "23%",
                transform: "translateX(-50%)",
                width: "29%",
              }}
            >
              <div className="bg-white/95 rounded border border-slate-300 p-1.5 shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-700 font-sans">
                  📋 Kitchen Board
                </span>
              </div>
            </div>

            {/* Intro Tagline Note */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: "48%",
                top: "35.2%",
                transform: "translateX(-50%) rotate(-1deg)",
                width: "19%",
              }}
            >
              <div className="bg-[#fefce8] p-1 rounded-xs border border-amber-200 text-center shadow-xs">
                <p className="text-[9px] font-bold text-amber-950 leading-tight truncate">
                  &ldquo;{settings.tagline}&rdquo;
                </p>
              </div>
            </div>

            {/* ============================================================== */}
            {/* LOWER FRIDGE DOOR NOTES ZONE: 100% CONFINED INSIDE BLUE DOOR */}
            {/* Exact dimensions: left 51.05%, top 49.5%, width 30.5%           */}
            {/* ============================================================== */}
            <div
              className="absolute z-30 transition-all"
              style={{
                left: "51.05%",
                top: "49.5%",
                transform: `translateX(-50%) scale(${settings.notesScale || 1})`,
                transformOrigin: "top center",
                width: "30.5%",
              }}
            >
              {/* Header pill */}
              <div className="text-center mb-1 pointer-events-none">
                <span className="text-[8px] font-bold text-amber-950 px-2 py-0.5 bg-amber-100/90 rounded-full border border-amber-300/80 shadow-xs inline-block">
                  ✨ Pick a category sticky note ✨
                </span>
              </div>

              {/* 3x3 Door Grid - Exactly matches frontend */}
              <div className="grid grid-cols-3 gap-1 sm:gap-1.5 justify-items-center">
                {categories.map((cat, idx) => {
                  const isSelected = cat.id === selectedCategory?.id;
                  const isDragTarget = dragOverIndex === idx;
                  const IconComp = iconMap[cat.iconName] || Flame;
                  const scale = cat.scale ?? 1;
                  const rotation = cat.rotation ?? 0;

                  return (
                    <div
                      key={cat.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={() => handleDrop(idx)}
                      onClick={() => setSelectedId(cat.id)}
                      style={{
                        backgroundColor: cat.color || "#fef08a",
                        transform: `rotate(${rotation}deg) scale(${scale})`,
                        transformOrigin: "center center",
                      }}
                      className={`relative w-full aspect-square p-1 rounded-xs shadow-sm cursor-pointer transition-all flex flex-col justify-between text-left select-none ${
                        isSelected
                          ? "ring-2 ring-sky-500 ring-offset-1 ring-offset-slate-900 shadow-lg z-30"
                          : "hover:scale-105 z-10"
                      } ${isDragTarget ? "border-2 border-dashed border-sky-400 bg-sky-100" : ""}`}
                    >
                      {/* Magnet Pin */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 pointer-events-none">
                        <Magnet color={cat.magnetColor || "#ef4444"} size="sm" />
                      </div>

                      {/* Header with Icon */}
                      <div className="flex items-center justify-between gap-0.5 mt-0.5">
                        <span className="font-bold text-[9px] text-slate-900 leading-tight truncate">
                          {cat.name}
                        </span>
                        <IconComp className="w-2.5 h-2.5 text-slate-700 shrink-0" />
                      </div>

                      {/* Description */}
                      <p className="text-[7.5px] text-slate-700/90 line-clamp-2 leading-tight">
                        {cat.description}
                      </p>

                      {/* Slot badge & Open */}
                      <div className="flex items-center justify-between text-[7px] text-slate-600 border-t border-black/10 pt-0.5">
                        <span className="font-mono font-bold bg-white/70 px-1 rounded">
                          #{idx + 1}
                        </span>
                        <span>Open ➔</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mood Note on bottom right of fridge door */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: "60%",
                top: "84.5%",
                width: "6.5%",
                transform: "rotate(2deg)",
              }}
            >
              <div className="px-1 py-0.5 bg-rose-100 text-rose-950 text-[7px] font-bold rounded shadow-xs border border-rose-200 truncate text-center">
                🍓 Mood
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Sticky Note Customizer */}
        <div className="lg:col-span-5 bg-slate-900/95 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                Note Customizer
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize size, position slot, rotation and color.
              </p>
            </div>
            {selectedCategory && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-sky-950 text-sky-400 border border-sky-800 rounded-full">
                Slot #{selectedIndex + 1} of 9
              </span>
            )}
          </div>

          {/* Quick Note Selector Grid (3x3 matching fridge) */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Door Slots (Click to Select Note)
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              {categories.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  style={{
                    backgroundColor: c.id === selectedCategory?.id ? c.color : "#1e293b",
                    color: c.id === selectedCategory?.id ? "#0f172a" : "#cbd5e1",
                    fontWeight: c.id === selectedCategory?.id ? "bold" : "normal",
                  }}
                  className={`p-2 rounded-lg text-xs truncate text-center border transition-all ${
                    c.id === selectedCategory?.id
                      ? "border-sky-400 shadow-md ring-1 ring-sky-400 scale-[1.02]"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="block text-[9px] font-mono text-slate-500 mb-0.5">
                    Slot #{idx + 1}
                  </span>
                  <span className="truncate block font-semibold">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedCategory && (
            <div className="space-y-4 pt-1 text-xs">
              {/* Slot Reorder Buttons */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <label className="font-semibold text-slate-300 block">
                  Move Note on Fridge Door
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleMove("up")}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowUp className="w-3 h-3 text-sky-400" /> Up
                  </button>
                  <button
                    onClick={() => handleMove("down")}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowDown className="w-3 h-3 text-sky-400" /> Down
                  </button>
                  <button
                    onClick={() => handleMove("left")}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3 text-sky-400" /> Left
                  </button>
                  <button
                    onClick={() => handleMove("right")}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-sky-400" /> Right
                  </button>
                </div>
              </div>

              {/* Note Content Edit */}
              <div className="space-y-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Note Title
                  </label>
                  <input
                    type="text"
                    value={selectedCategory.name}
                    onChange={(e) => updateSelected({ name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={selectedCategory.description}
                    onChange={(e) => updateSelected({ description: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sliders: Size and Rotation */}
              <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                {/* Individual Note Size */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                      This Note Size / Scale
                    </span>
                    <span className="font-mono text-sky-400 font-bold">
                      {Math.round((selectedCategory.scale || 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.25"
                    step="0.05"
                    value={selectedCategory.scale || 1}
                    onChange={(e) => updateSelected({ scale: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Tilt / Rotation */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                      Tilt / Rotation
                    </span>
                    <span className="font-mono text-sky-400 font-bold">
                      {selectedCategory.rotation > 0
                        ? `+${selectedCategory.rotation}°`
                        : `${selectedCategory.rotation || 0}°`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={selectedCategory.rotation || 0}
                    onChange={(e) => updateSelected({ rotation: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex gap-2 mt-1.5">
                    <button
                      onClick={() => updateSelected({ rotation: -2.5 })}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] rounded text-slate-300 hover:text-white"
                    >
                      Tilt Left (-2.5°)
                    </button>
                    <button
                      onClick={() => updateSelected({ rotation: 0 })}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] rounded text-slate-300 hover:text-white"
                    >
                      Straight (0°)
                    </button>
                    <button
                      onClick={() => updateSelected({ rotation: 2.5 })}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] rounded text-slate-300 hover:text-white"
                    >
                      Tilt Right (+2.5°)
                    </button>
                  </div>
                </div>

                {/* Master All-Notes Scale */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="font-medium text-amber-300">
                      Master Size (All 9 Notes on Fridge)
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      {Math.round((settings.notesScale || 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.80"
                    max="1.20"
                    step="0.05"
                    value={settings.notesScale || 1}
                    onChange={(e) =>
                      setSettings({ ...settings, notesScale: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3">
                {/* Paper Color */}
                <div>
                  <label className="font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    Sticky Paper Color
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {paperColors.map((color) => (
                      <button
                        key={color.value}
                        title={color.name}
                        onClick={() => updateSelected({ color: color.value })}
                        style={{ backgroundColor: color.value }}
                        className={`w-6 h-6 rounded-md border transition-transform ${
                          selectedCategory.color === color.value
                            ? "ring-2 ring-sky-400 scale-110 border-white"
                            : "border-slate-700 hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Magnet Pin Color */}
                <div>
                  <label className="font-semibold text-slate-300 block mb-1.5">
                    Magnet Pin Color
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {magnetColors.map((color) => (
                      <button
                        key={color.value}
                        title={color.name}
                        onClick={() => updateSelected({ magnetColor: color.value })}
                        style={{ backgroundColor: color.value }}
                        className={`w-6 h-6 rounded-full border transition-transform shadow ${
                          selectedCategory.magnetColor === color.value
                            ? "ring-2 ring-sky-400 scale-110 border-white"
                            : "border-slate-700 hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1.5">
                  Category Note Icon
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableIcons.map((ic) => {
                    const IcComponent = iconMap[ic.name] || Flame;
                    const isSelectedIcon = selectedCategory.iconName === ic.name;
                    return (
                      <button
                        key={ic.name}
                        onClick={() => updateSelected({ iconName: ic.name })}
                        className={`px-2 py-1 rounded-md text-[10px] flex items-center gap-1 border transition-all ${
                          isSelectedIcon
                            ? "bg-sky-500/20 border-sky-400 text-sky-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <IcComponent className="w-3 h-3" />
                        <span>{ic.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
