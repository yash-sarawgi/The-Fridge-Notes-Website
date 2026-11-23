"use client";

import React, { useState, useEffect } from "react";
import { Category, FridgeSettings, FridgeTag } from "@/types";
import { Magnet } from "../Magnet";
import { defaultFridgeTags } from "@/lib/supabase/api";
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
  Plus,
  Trash2,
  Tag,
  ClipboardList,
  FileText,
  Eye,
  EyeOff,
  LayoutGrid,
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
  const [activeTab, setActiveTab] = useState<"categories" | "whiteboard" | "intro" | "tags">("categories");

  // Selected Category
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || "sandwiches");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Selected Custom Tag
  const tagsList = settings.customTags && settings.customTags.length > 0
    ? settings.customTags
    : defaultFridgeTags;
  const [selectedTagId, setSelectedTagId] = useState<string>(tagsList[0]?.id || "tag-butter");

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showGuides, setShowGuides] = useState(true);

  useEffect(() => {
    setCategories(initialCategoriesProp);
  }, [initialCategoriesProp]);

  useEffect(() => {
    setSettings((prev) => ({
      ...initialSettingsProp,
      customTags:
        initialSettingsProp.customTags && initialSettingsProp.customTags.length > 0
          ? initialSettingsProp.customTags
          : prev.customTags || defaultFridgeTags,
      whiteboardPos: initialSettingsProp.whiteboardPos || { x: 51.05, y: 22.8, width: 29 },
    }));
  }, [initialSettingsProp]);

  // Selected Category
  const selectedCatIndex = categories.findIndex((c) => c.id === selectedCatId);
  const selectedCategory = categories[selectedCatIndex] || categories[0];

  const updateSelectedCategory = (updates: Partial<Category>) => {
    if (!selectedCategory) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === selectedCategory.id ? { ...c, ...updates } : c))
    );
  };

  // Category Reordering
  const swapCategories = (indexA: number, indexB: number) => {
    if (indexA < 0 || indexA >= categories.length || indexB < 0 || indexB >= categories.length) return;
    const copy = [...categories];
    const temp = copy[indexA];
    copy[indexA] = copy[indexB];
    copy[indexB] = temp;
    copy.forEach((c, idx) => {
      c.displayOrder = idx;
    });
    setCategories(copy);
  };

  const handleMoveCategory = (direction: "up" | "down" | "left" | "right") => {
    if (selectedCatIndex === -1) return;
    const col = selectedCatIndex % 3;
    const row = Math.floor(selectedCatIndex / 3);

    let targetIndex = selectedCatIndex;
    if (direction === "left" && col > 0) targetIndex = selectedCatIndex - 1;
    if (direction === "right" && col < 2) targetIndex = selectedCatIndex + 1;
    if (direction === "up" && row > 0) targetIndex = selectedCatIndex - 3;
    if (direction === "down" && row < Math.floor((categories.length - 1) / 3)) {
      targetIndex = selectedCatIndex + 3;
    }

    if (targetIndex !== selectedCatIndex && targetIndex < categories.length) {
      swapCategories(selectedCatIndex, targetIndex);
    }
  };

  const handleRandomizeTilts = () => {
    const tilts = [-3, 2, -2, 3, -1.5, 2.5, -2.5, 1.5, -3.5];
    setCategories((prev) =>
      prev.map((c, idx) => ({
        ...c,
        rotation: tilts[idx % tilts.length],
      }))
    );
  };

  // Kitchen Board Position Updates
  const currentWhiteboardPos = {
    x: settings.whiteboardPos?.x ?? 51.05,
    y: settings.whiteboardPos?.y ?? 22.8,
    width: settings.whiteboardPos?.width ?? 29,
  };
  const updateWhiteboardPos = (updates: Partial<{ x: number; y: number; width: number }>) => {
    setSettings((prev) => ({
      ...prev,
      whiteboardPos: {
        x: updates.x ?? prev.whiteboardPos?.x ?? 51.05,
        y: updates.y ?? prev.whiteboardPos?.y ?? 22.8,
        width: updates.width ?? prev.whiteboardPos?.width ?? 29,
      },
    }));
  };

  // Intro Note ("A little taste of home") Updates
  const currentIntroNotePos = {
    x: settings.introNotePos?.x ?? 48,
    y: settings.introNotePos?.y ?? 35.8,
    scale: settings.introNotePos?.scale ?? 1,
    rotation: settings.introNotePos?.rotation ?? -1,
    width: settings.introNotePos?.width ?? 19,
    isHidden: settings.introNotePos?.isHidden ?? false,
  };

  const updateIntroNotePos = (
    updates: Partial<{ x: number; y: number; scale: number; rotation: number; width: number; isHidden: boolean }>
  ) => {
    setSettings((prev) => ({
      ...prev,
      introNotePos: {
        x: updates.x ?? prev.introNotePos?.x ?? 48,
        y: updates.y ?? prev.introNotePos?.y ?? 35.8,
        scale: updates.scale ?? prev.introNotePos?.scale ?? 1,
        rotation: updates.rotation ?? prev.introNotePos?.rotation ?? -1,
        width: updates.width ?? prev.introNotePos?.width ?? 19,
        isHidden: updates.isHidden ?? prev.introNotePos?.isHidden ?? false,
      },
    }));
  };

  // Custom Tags Management
  const currentTags = settings.customTags && settings.customTags.length > 0
    ? settings.customTags
    : defaultFridgeTags;
  const selectedTag = currentTags.find((t) => t.id === selectedTagId) || currentTags[0];

  const updateSelectedTag = (updates: Partial<FridgeTag>) => {
    if (!selectedTag) return;
    const updated = currentTags.map((t) =>
      t.id === selectedTag.id ? { ...t, ...updates } : t
    );
    setSettings((prev) => ({ ...prev, customTags: updated }));
  };

  const handleAddTag = () => {
    const newId = `tag-${Date.now()}`;
    const newTag: FridgeTag = {
      id: newId,
      text: "New Reminder 📌",
      color: "#fef08a",
      magnetColor: "#ef4444",
      xPos: 60.0,
      yPos: 50.0,
      rotation: (Math.random() * 6 - 3),
      scale: 1,
    };
    const updated = [...currentTags, newTag];
    setSettings((prev) => ({ ...prev, customTags: updated }));
    setSelectedTagId(newId);
    setActiveTab("tags");
  };

  const handleDeleteTag = (id: string) => {
    const filtered = currentTags.filter((t) => t.id !== id);
    setSettings((prev) => ({ ...prev, customTags: filtered }));
    if (selectedTagId === id && filtered.length > 0) {
      setSelectedTagId(filtered[0].id);
    }
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
            Customize category sticky notes, Kitchen Board position, and add/remove custom fridge text tags.
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
              Interactive Fridge Canvas
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGuides(!showGuides)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  showGuides
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
                title="Toggle visual outlines for the fridge doors and handle"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{showGuides ? "Door Outlines: ON" : "Door Outlines: OFF"}</span>
              </button>
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                Click to edit
              </span>
            </div>
          </div>

          {/* Fridge Canvas Box */}
          <div
            className="relative w-full aspect-square max-w-[580px] select-none rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#ea580c]/15"
            style={{
              backgroundImage: "url(/images/smeg-fridge-bg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            {/* Visual Fridge Door Outlines & Guides for Arrangement Judgement */}
            {showGuides && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* 1. Main Fridge Contour Silhouette */}
                <div
                  className="absolute border-2 border-dashed border-sky-400/45 shadow-inner"
                  style={{
                    left: "34.4%",
                    top: "14.0%",
                    width: "33.3%",
                    height: "81.0%",
                    borderRadius: "36px 36px 18px 18px",
                  }}
                />

                {/* 2. Freezer Door Outline */}
                <div
                  className="absolute border border-dashed border-sky-300/70 bg-sky-500/5 shadow-xs"
                  style={{
                    left: "34.7%",
                    top: "15.4%",
                    width: "32.7%",
                    height: "26.5%",
                    borderRadius: "32px 32px 6px 6px",
                  }}
                >
                  <span className="absolute top-1 left-2 text-[8px] font-mono font-bold tracking-wider text-sky-400 uppercase bg-slate-950/85 px-1.5 py-0.5 rounded border border-sky-500/40 shadow-xs">
                    Freezer Door
                  </span>
                </div>

                {/* 3. Handle Guide Line */}
                <div
                  className="absolute border border-slate-200/80 bg-white/20 shadow-sm"
                  style={{
                    left: "36.8%",
                    top: "42.1%",
                    width: "14.5%",
                    height: "2.4%",
                    borderRadius: "9999px",
                  }}
                >
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[7.5px] font-mono text-slate-200 uppercase whitespace-nowrap bg-slate-950/85 px-1 rounded border border-slate-700">
                    Freezer Handle
                  </span>
                </div>

                {/* 4. Lower Main Fridge Door Outline */}
                <div
                  className="absolute border border-dashed border-amber-400/70 bg-amber-500/5 shadow-xs"
                  style={{
                    left: "34.7%",
                    top: "45.0%",
                    width: "32.7%",
                    height: "49.0%",
                    borderRadius: "6px 6px 16px 16px",
                  }}
                >
                  <span className="absolute bottom-1 right-2 text-[8px] font-mono font-bold tracking-wider text-amber-300 uppercase bg-slate-950/85 px-1.5 py-0.5 rounded border border-amber-500/40 shadow-xs">
                    Main Refrigerator Door
                  </span>
                </div>
              </div>
            )}

            {/* Fridge Badge Area at top */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: "51.05%",
                top: "17.2%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="px-3 py-0.5 bg-white/80 rounded-full border border-slate-300 text-[10px] font-serif font-black tracking-widest text-slate-800 shadow-sm">
                {settings.badgeText || "THE FRIDGE NOTES"}
              </div>
            </div>

            {/* Kitchen Whiteboard on Freezer Door (Interactive) */}
            <div
              onClick={() => setActiveTab("whiteboard")}
              className={`absolute z-20 cursor-pointer transition-all ${
                activeTab === "whiteboard"
                  ? "ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900 shadow-xl"
                  : "hover:scale-[1.01]"
              }`}
              style={{
                left: `${currentWhiteboardPos.x}%`,
                top: `${currentWhiteboardPos.y}%`,
                transform: "translateX(-50%)",
                width: `${currentWhiteboardPos.width}%`,
              }}
            >
              <div className="bg-white/95 rounded border border-slate-300 p-1.5 shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-800 font-sans">
                  📋 Kitchen Board
                </span>
                <span className="block text-[8px] text-slate-500 font-mono">
                  (Click to adjust placement)
                </span>
              </div>
            </div>

            {/* Intro Tagline Note (Interactive, Movable & Editable) */}
            <div
              onClick={() => setActiveTab("intro")}
              className={`absolute z-20 cursor-pointer transition-all ${
                activeTab === "intro"
                  ? "ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900 shadow-xl scale-105"
                  : "hover:scale-[1.02]"
              } ${currentIntroNotePos.isHidden ? "opacity-50" : ""}`}
              style={{
                left: `${currentIntroNotePos.x}%`,
                top: `${currentIntroNotePos.y}%`,
                transform: `translateX(-50%) rotate(${currentIntroNotePos.rotation}deg) scale(${currentIntroNotePos.scale})`,
                width: `${currentIntroNotePos.width}%`,
              }}
            >
              <div
                className={`relative bg-[#fefce8] p-1.5 rounded-xs border text-center shadow-xs ${
                  currentIntroNotePos.isHidden ? "border-dashed border-amber-500" : "border-amber-200"
                }`}
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 pointer-events-none">
                  <Magnet color="#dc2626" size="sm" shape="round" />
                </div>
                {currentIntroNotePos.isHidden && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-mono text-[6.5px] font-black px-1 rounded uppercase tracking-wider">
                    Hidden
                  </span>
                )}
                <p className="text-[9.5px] font-bold text-amber-950 leading-tight truncate">
                  &ldquo;{settings.tagline}&rdquo;
                </p>
                {settings.subIntro && (
                  <p className="text-[7px] text-amber-900/80 leading-tight truncate mt-0.5">
                    {settings.subIntro}
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Custom Fridge Sticky Tags */}
            {currentTags.map((tag) => {
              const isSelectedTag = activeTab === "tags" && selectedTag?.id === tag.id;
              const tagScale = tag.scale ?? 1;
              return (
                <div
                  key={tag.id}
                  onClick={() => {
                    setSelectedTagId(tag.id);
                    setActiveTab("tags");
                  }}
                  className={`absolute z-25 cursor-pointer transition-transform ${
                    isSelectedTag ? "ring-2 ring-sky-400 shadow-lg scale-110" : "hover:scale-105"
                  } ${tag.isHidden ? "opacity-50" : ""}`}
                  style={{
                    left: `${tag.xPos}%`,
                    top: `${tag.yPos}%`,
                    transform: `translate(-50%, -50%) rotate(${tag.rotation ?? 0}deg) scale(${tagScale})`,
                  }}
                >
                  <div
                    className={`relative rounded-xs shadow-sm border text-center whitespace-nowrap p-1 px-2.5 ${
                      tag.isHidden ? "border-dashed border-amber-400" : ""
                    }`}
                    style={{
                      backgroundColor: tag.color || "#fef9c3",
                      borderColor: tag.isHidden ? "#f59e0b" : "rgba(0,0,0,0.15)",
                      color: "#2a1508",
                      fontSize: `${Math.max(9, Math.round(11 * tagScale))}px`,
                      fontWeight: "bold",
                    }}
                  >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                      <Magnet color={tag.magnetColor || "#ef4444"} size="sm" shape="round" />
                    </div>
                    {tag.isHidden && (
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-mono text-[7px] font-black px-1 rounded uppercase tracking-wider">
                        Hidden
                      </span>
                    )}
                    <span>{tag.text}</span>
                  </div>
                </div>
              );
            })}

            {/* LOWER FRIDGE DOOR NOTES ZONE */}
            <div
              className="absolute z-30 transition-all"
              style={{
                left: "51.05%",
                top: "50.0%",
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

              {/* 3x3 Door Grid */}
              <div className="grid grid-cols-3 gap-1 sm:gap-1.5 justify-items-center">
                {categories.map((cat, idx) => {
                  const isSelected = activeTab === "categories" && cat.id === selectedCategory?.id;
                  const isDragTarget = dragOverIndex === idx;
                  const IconComp = iconMap[cat.iconName] || Flame;
                  const scale = cat.scale ?? 1;
                  const rotation = cat.rotation ?? 0;

                  return (
                    <div
                      key={cat.id}
                      draggable
                      onDragStart={() => {
                        setDraggedIndex(idx);
                        setSelectedCatId(cat.id);
                        setActiveTab("categories");
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIndex(idx);
                      }}
                      onDrop={() => {
                        if (draggedIndex !== null && draggedIndex !== idx) {
                          swapCategories(draggedIndex, idx);
                        }
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      onClick={() => {
                        setSelectedCatId(cat.id);
                        setActiveTab("categories");
                      }}
                      style={{
                        backgroundColor: cat.color || "#fef08a",
                        transform: `rotate(${rotation}deg) scale(${scale})`,
                        transformOrigin: "center center",
                      }}
                      className={`relative w-full aspect-square p-1 rounded-xs shadow-sm cursor-pointer transition-all flex flex-col justify-between text-left select-none ${
                        isSelected
                          ? "ring-2 ring-sky-500 ring-offset-1 ring-offset-slate-900 shadow-lg z-30"
                          : "hover:scale-105 z-10"
                      } ${cat.isHidden ? "opacity-55 border-dashed border-amber-400" : ""} ${
                        isDragTarget ? "border-2 border-dashed border-sky-400 bg-sky-100" : ""
                      }`}
                    >
                      {/* Magnet Pin */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 pointer-events-none">
                        <Magnet color={cat.magnetColor || "#ef4444"} size="sm" />
                      </div>

                      {/* Header with Icon & Hidden indicator */}
                      <div className="flex items-center justify-between gap-0.5 mt-0.5">
                        <span
                          className="font-bold text-slate-900 leading-tight truncate"
                          style={{ fontSize: `${Math.max(10, Math.round(11 * scale))}px` }}
                        >
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {cat.isHidden && (
                            <span className="bg-amber-500/90 text-slate-950 font-mono text-[7px] font-black px-1 rounded leading-none uppercase">
                              Hidden
                            </span>
                          )}
                          <IconComp className="w-2.5 h-2.5 text-slate-700 shrink-0" />
                        </div>
                      </div>

                      {/* Description with scale-adjusted font */}
                      <p
                        className="text-slate-700/90 line-clamp-3 leading-tight"
                        style={{ fontSize: `${Math.max(8.5, Math.round(9.5 * scale))}px` }}
                      >
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
          </div>
        </div>

        {/* Right: Inspector & Controls Panel */}
        <div className="lg:col-span-5 bg-slate-900/95 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          {/* Section Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "categories"
                  ? "bg-sky-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Category Notes
            </button>
            <button
              onClick={() => setActiveTab("whiteboard")}
              className={`flex-1 py-1.5 px-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                activeTab === "whiteboard"
                  ? "bg-sky-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Whiteboard
            </button>
            <button
              onClick={() => setActiveTab("intro")}
              className={`flex-1 py-1.5 px-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                activeTab === "intro"
                  ? "bg-sky-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Intro Note
            </button>
            <button
              onClick={() => setActiveTab("tags")}
              className={`flex-1 py-1.5 px-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                activeTab === "tags"
                  ? "bg-sky-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Tags ({currentTags.length})
            </button>
          </div>

          {/* TAB 1: CATEGORY NOTES */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Select Door Slot ({selectedCatIndex + 1} of 9)
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  {categories.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCatId(c.id)}
                      style={{
                        backgroundColor: c.id === selectedCategory?.id ? c.color : "#1e293b",
                        color: c.id === selectedCategory?.id ? "#0f172a" : "#cbd5e1",
                        fontWeight: c.id === selectedCategory?.id ? "bold" : "normal",
                      }}
                      className={`p-1.5 rounded-lg text-xs truncate text-center border transition-all ${
                        c.id === selectedCategory?.id
                          ? "border-sky-400 shadow ring-1 ring-sky-400 scale-[1.02]"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span className="block text-[8.5px] font-mono text-slate-500">
                        Slot #{idx + 1}
                      </span>
                      <span className="truncate block font-semibold text-[11px]">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCategory && (
                <div className="space-y-4 pt-1 text-xs">
                  {/* Visibility Toggle for Selected Category Note */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-2">
                      {selectedCategory.isHidden ? (
                        <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-slate-200 block text-xs">
                          {selectedCategory.isHidden ? "Hidden from Public Fridge" : "Visible on Public Fridge"}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {selectedCategory.isHidden ? "Draft mode — only visible in admin CMS" : "Visitors can click and open recipes"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSelectedCategory({ isHidden: !selectedCategory.isHidden })}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                        selectedCategory.isHidden
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                      }`}
                    >
                      {selectedCategory.isHidden ? "Unhide" : "Hide Note"}
                    </button>
                  </div>

                  {/* Slot Reorder Buttons */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <label className="font-semibold text-slate-300 block">
                      Move Slot on Fridge Door
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => handleMoveCategory("up")}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md flex items-center justify-center gap-1 transition-colors"
                      >
                        <ArrowUp className="w-3 h-3 text-sky-400" /> Up
                      </button>
                      <button
                        onClick={() => handleMoveCategory("down")}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md flex items-center justify-center gap-1 transition-colors"
                      >
                        <ArrowDown className="w-3 h-3 text-sky-400" /> Down
                      </button>
                      <button
                        onClick={() => handleMoveCategory("left")}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md flex items-center justify-center gap-1 transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3 text-sky-400" /> Left
                      </button>
                      <button
                        onClick={() => handleMoveCategory("right")}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md flex items-center justify-center gap-1 transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 text-sky-400" /> Right
                      </button>
                    </div>
                  </div>

                  {/* Note Content Edit */}
                  <div className="space-y-2">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Note Title</label>
                      <input
                        type="text"
                        value={selectedCategory.name}
                        onChange={(e) => updateSelectedCategory({ name: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Short Description</label>
                      <input
                        type="text"
                        value={selectedCategory.description}
                        onChange={(e) => updateSelectedCategory({ description: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sliders: Size and Rotation */}
                  <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span className="flex items-center gap-1 font-medium">
                          <ZoomIn className="w-3.5 h-3.5 text-sky-400" /> This Note Scale
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
                        onChange={(e) => updateSelectedCategory({ scale: parseFloat(e.target.value) })}
                        className="w-full accent-sky-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span className="flex items-center gap-1 font-medium">
                          <RotateCw className="w-3.5 h-3.5 text-sky-400" /> Tilt / Rotation
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
                        onChange={(e) => updateSelectedCategory({ rotation: parseFloat(e.target.value) })}
                        className="w-full accent-sky-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Paper & Magnet Colors */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5 text-amber-400" /> Sticky Color
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {paperColors.map((color) => (
                          <button
                            key={color.value}
                            title={color.name}
                            onClick={() => updateSelectedCategory({ color: color.value })}
                            style={{ backgroundColor: color.value }}
                            className={`w-5 h-5 rounded border ${
                              selectedCategory.color === color.value
                                ? "ring-2 ring-sky-400 scale-110 border-white"
                                : "border-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Pin Magnet</label>
                      <div className="flex flex-wrap gap-1.5">
                        {magnetColors.map((color) => (
                          <button
                            key={color.value}
                            title={color.name}
                            onClick={() => updateSelectedCategory({ magnetColor: color.value })}
                            style={{ backgroundColor: color.value }}
                            className={`w-5 h-5 rounded-full border shadow ${
                              selectedCategory.magnetColor === color.value
                                ? "ring-2 ring-sky-400 scale-110 border-white"
                                : "border-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KITCHEN BOARD PLACEMENT */}
          {activeTab === "whiteboard" && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-sky-400" />
                  Kitchen Board Box Placement
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Adjust where the magnetic Kitchen Whiteboard sits on the freezer door.
                </p>
              </div>

              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                {/* Y Position */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Vertical Position (Y % on Freezer Door)</span>
                    <span className="font-mono text-sky-400 font-bold">
                      {currentWhiteboardPos.y.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18.0"
                    max="32.0"
                    step="0.2"
                    value={currentWhiteboardPos.y}
                    onChange={(e) => updateWhiteboardPos({ y: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500">
                    Recommended: 21% to 24% (default: 22.8%)
                  </span>
                </div>

                {/* X Position */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Horizontal Center (X %)</span>
                    <span className="font-mono text-sky-400 font-bold">
                      {currentWhiteboardPos.x.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="46.0"
                    max="56.0"
                    step="0.2"
                    value={currentWhiteboardPos.x}
                    onChange={(e) => updateWhiteboardPos({ x: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500">
                    Centered on fridge door: 51.05%
                  </span>
                </div>

                {/* Width */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Board Width (%)</span>
                    <span className="font-mono text-sky-400 font-bold">
                      {currentWhiteboardPos.width.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="24.0"
                    max="33.0"
                    step="0.5"
                    value={currentWhiteboardPos.width}
                    onChange={(e) => updateWhiteboardPos({ width: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Reset button */}
                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => updateWhiteboardPos({ x: 51.05, y: 22.8, width: 29 })}
                    className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md"
                  >
                    Reset Board to Center
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTRO NOTE EDITING */}
          {activeTab === "intro" && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Intro Note (&ldquo;{settings.tagline}&rdquo;)
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Edit the handwritten quote note, adjust its placement, tilt, scale, or toggle visibility.
                </p>
              </div>

              {/* Hide / Unhide Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2">
                  {currentIntroNotePos.isHidden ? (
                    <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">
                      {currentIntroNotePos.isHidden ? "Hidden from Fridge" : "Visible on Fridge"}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {currentIntroNotePos.isHidden
                        ? "Draft mode (not displayed to visitors)"
                        : "Pinned on freezer with red magnet"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateIntroNotePos({ isHidden: !currentIntroNotePos.isHidden })}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                    currentIntroNotePos.isHidden
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                  }`}
                >
                  {currentIntroNotePos.isHidden ? "Unhide" : "Hide Note"}
                </button>
              </div>

              {/* Text Inputs */}
              <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tagline Quote *</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. A little taste of home"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Sub-Intro Description</label>
                  <textarea
                    rows={2}
                    value={settings.subIntro}
                    onChange={(e) => setSettings({ ...settings, subIntro: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Recipes, experiments and things worth making again."
                  />
                </div>
              </div>

              {/* Position and Scale Sliders */}
              <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Vertical Position (Y %)</span>
                    <span className="font-mono text-amber-400 font-bold">{currentIntroNotePos.y.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="18.0"
                    max="85.0"
                    step="0.5"
                    value={currentIntroNotePos.y}
                    onChange={(e) => updateIntroNotePos({ y: parseFloat(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Horizontal Center (X %)</span>
                    <span className="font-mono text-amber-400 font-bold">{currentIntroNotePos.x.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="36.0"
                    max="65.0"
                    step="0.5"
                    value={currentIntroNotePos.x}
                    onChange={(e) => updateIntroNotePos({ x: parseFloat(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Width (%)</span>
                      <span className="font-mono text-amber-400 font-bold">{currentIntroNotePos.width}%</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="28"
                      step="1"
                      value={currentIntroNotePos.width}
                      onChange={(e) => updateIntroNotePos({ width: parseInt(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Tilt (deg)</span>
                      <span className="font-mono text-amber-400 font-bold">{currentIntroNotePos.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.5"
                      value={currentIntroNotePos.rotation}
                      onChange={(e) => updateIntroNotePos({ rotation: parseFloat(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Note Scale</span>
                    <span className="font-mono text-amber-400 font-bold">{Math.round(currentIntroNotePos.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.35"
                    step="0.05"
                    value={currentIntroNotePos.scale}
                    onChange={(e) => updateIntroNotePos({ scale: parseFloat(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() => updateIntroNotePos({ x: 48, y: 35.8, scale: 1, rotation: -1, width: 19 })}
                    className="px-2 py-0.5 text-[10px] text-slate-300 bg-slate-900 hover:text-white rounded border border-slate-700"
                  >
                    Below Board
                  </button>
                  <button
                    type="button"
                    onClick={() => updateIntroNotePos({ x: 51.05, y: 36.5, scale: 1, rotation: 0, width: 22 })}
                    className="px-2 py-0.5 text-[10px] text-slate-300 bg-slate-900 hover:text-white rounded border border-slate-700"
                  >
                    Centered
                  </button>
                  <button
                    type="button"
                    onClick={() => updateIntroNotePos({ x: 58, y: 37, scale: 0.95, rotation: 2, width: 18 })}
                    className="px-2 py-0.5 text-[10px] text-slate-300 bg-slate-900 hover:text-white rounded border border-slate-700"
                  >
                    Right Shift
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FRIDGE STICKY TAGS (ADD / REMOVE / EDIT) */}
          {activeTab === "tags" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-400" />
                    Custom Fridge Sticky Tags
                  </h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Add, edit, move, or remove custom sticky reminder tags on the fridge.
                  </p>
                </div>
                <button
                  onClick={handleAddTag}
                  className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tag
                </button>
              </div>

              {/* Tag selector chips */}
              <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800 max-h-32 overflow-y-auto">
                {currentTags.map((t) => {
                  const isSel = selectedTag?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTagId(t.id)}
                      style={{
                        backgroundColor: isSel ? t.color || "#fef08a" : "#1e293b",
                        color: isSel ? "#0f172a" : "#cbd5e1",
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        isSel ? "border-amber-400 shadow ring-1 ring-amber-400" : "border-slate-800"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.magnetColor || "#ef4444" }}
                      />
                      <span className="truncate max-w-[120px]">{t.text}</span>
                    </button>
                  );
                })}
              </div>

              {selectedTag && (
                <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-semibold text-slate-300">Edit Selected Tag</span>
                    <button
                      onClick={() => handleDeleteTag(selectedTag.id)}
                      className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors"
                      title="Remove this tag"
                    >
                      <Trash2 className="w-3 h-3" /> Delete Tag
                    </button>
                  </div>

                  {/* Visibility Hide/Unhide Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {selectedTag.isHidden ? (
                        <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-slate-200 block text-xs">
                          {selectedTag.isHidden ? "Hidden from Fridge" : "Visible on Fridge"}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {selectedTag.isHidden ? "Draft mode (not shown on public fridge)" : "Stuck on public fridge door"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSelectedTag({ isHidden: !selectedTag.isHidden })}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                        selectedTag.isHidden
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                      }`}
                    >
                      {selectedTag.isHidden ? "Unhide" : "Hide Tag"}
                    </button>
                  </div>

                  {/* Text Input */}
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Tag Message *</label>
                    <input
                      type="text"
                      value={selectedTag.text}
                      onChange={(e) => updateSelectedTag({ text: e.target.value })}
                      placeholder="e.g. Milk expired on Tuesday! 🥛"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Position Sliders */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Horizontal (X %)</span>
                        <span className="font-mono text-amber-400">{selectedTag.xPos.toFixed(1)}%</span>
                      </div>
                      <input
                        type="range"
                        min="35.0"
                        max="66.0"
                        step="0.5"
                        value={selectedTag.xPos}
                        onChange={(e) => updateSelectedTag({ xPos: parseFloat(e.target.value) })}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Vertical (Y %)</span>
                        <span className="font-mono text-amber-400">{selectedTag.yPos.toFixed(1)}%</span>
                      </div>
                      <input
                        type="range"
                        min="18.0"
                        max="90.0"
                        step="0.5"
                        value={selectedTag.yPos}
                        onChange={(e) => updateSelectedTag({ yPos: parseFloat(e.target.value) })}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Rotation Slider */}
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Tilt Angle</span>
                      <span className="font-mono text-amber-400">{selectedTag.rotation ?? 0}°</span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.5"
                      value={selectedTag.rotation ?? 0}
                      onChange={(e) => updateSelectedTag({ rotation: parseFloat(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="text-slate-400 block mb-1">Paper Color</label>
                      <div className="flex flex-wrap gap-1">
                        {paperColors.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => updateSelectedTag({ color: c.value })}
                            style={{ backgroundColor: c.value }}
                            className={`w-5 h-5 rounded border ${
                              selectedTag.color === c.value ? "ring-2 ring-amber-400 border-white" : "border-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Magnet Pin</label>
                      <div className="flex flex-wrap gap-1">
                        {magnetColors.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => updateSelectedTag({ magnetColor: c.value })}
                            style={{ backgroundColor: c.value }}
                            className={`w-5 h-5 rounded-full border ${
                              selectedTag.magnetColor === c.value ? "ring-2 ring-amber-400 border-white" : "border-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
