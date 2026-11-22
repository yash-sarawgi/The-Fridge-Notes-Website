"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Info,
  SlidersHorizontal,
} from "lucide-react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategories(initialCategoriesProp);
  }, [initialCategoriesProp]);

  useEffect(() => {
    setSettings(initialSettingsProp);
  }, [initialSettingsProp]);

  // Ensure every category has initialized xPos and yPos within the fridge door
  useEffect(() => {
    setCategories((prev) =>
      prev.map((cat, idx) => {
        if (cat.xPos !== undefined && cat.yPos !== undefined) return cat;
        // Default 3x3 layout inside lower door (x: 36% to 64%, y: 50% to 88%)
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const defaultX = 36.5 + col * 9.8;
        const defaultY = 50.5 + row * 13.5;
        return {
          ...cat,
          xPos: defaultX,
          yPos: defaultY,
          scale: cat.scale || 1,
          rotation: cat.rotation || (col === 0 ? -2 : col === 1 ? 1 : -1),
        };
      })
    );
  }, []);

  const selectedCategory = categories.find((c) => c.id === selectedId);

  // Mouse drag handling on the canvas
  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !selectedId) return;
      const rect = containerRef.current.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

      // Constrain within the lower fridge door boundaries
      // Door X: ~35% to 66%, Door Y: ~49% to 94%
      const clampedX = Math.max(34.5, Math.min(64.5, parseFloat(xPercent.toFixed(1))));
      const clampedY = Math.max(47.0, Math.min(91.0, parseFloat(yPercent.toFixed(1))));

      setCategories((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, xPos: clampedX, yPos: clampedY } : c))
      );
    },
    [isDragging, selectedId]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Parameter adjustments for selected category
  const updateSelected = (updates: Partial<Category>) => {
    if (!selectedId) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, ...updates } : c))
    );
  };

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
    { name: "Fresh White", value: "#ffffff" },
  ];

  const magnetColors = [
    { name: "Ruby Red", value: "#ef4444" },
    { name: "Ocean Blue", value: "#0284c7" },
    { name: "Sun Yellow", value: "#eab308" },
    { name: "Emerald", value: "#10b981" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Silver Metal", value: "#64748b" },
  ];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Move className="w-5 h-5 text-sky-400" />
            Visual Fridge Note Arranger
          </h2>
          <p className="text-sm text-slate-400">
            Click, drag, resize, rotate, and recolor sticky notes directly on the fridge surface.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onResetLayout}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Grid
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : savedSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {savedSuccess ? "Saved to Supabase!" : isSaving ? "Saving..." : "Save Fridge Layout"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Fridge Interactive Canvas */}
        <div className="lg:col-span-8 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center">
          <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 self-start">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Fridge Canvas — Drag notes with your mouse or use the controls on the right</span>
          </div>

          <div
            ref={containerRef}
            className="relative w-full aspect-square max-w-[700px] select-none rounded-xl overflow-hidden border border-slate-700/50 shadow-inner bg-[#ea580c]/10"
            style={{
              backgroundImage: "url(/smeg-fridge-bg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Guide overlay on the fridge door */}
            <div
              className="absolute pointer-events-none border border-sky-400/25 rounded-md"
              style={{
                left: "34.4%",
                top: "46.0%",
                width: "33.3%",
                height: "48.5%",
              }}
            >
              <span className="absolute top-1 right-2 text-[10px] text-sky-300 font-mono tracking-wider bg-slate-950/60 px-1.5 py-0.5 rounded">
                Door Zone
              </span>
            </div>

            {/* Render Category Sticky Notes */}
            {categories.map((cat) => {
              const isSelected = cat.id === selectedId;
              const x = cat.xPos ?? 45;
              const y = cat.yPos ?? 60;
              const scale = cat.scale ?? 1;
              const rotation = cat.rotation ?? 0;

              return (
                <div
                  key={cat.id}
                  onMouseDown={(e) => handleMouseDown(cat.id, e)}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
                    zIndex: isSelected ? 40 : 20,
                    cursor: isDragging && isSelected ? "grabbing" : "grab",
                  }}
                  className={`group transition-transform active:scale-95`}
                >
                  <div
                    style={{ backgroundColor: cat.color || "#fef08a" }}
                    className={`relative w-28 h-28 md:w-32 md:h-32 p-2.5 rounded-sm shadow-md text-slate-800 flex flex-col justify-between select-none ${
                      isSelected
                        ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950 shadow-xl"
                        : "hover:shadow-lg"
                    }`}
                  >
                    {/* Magnet */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none">
                      <Magnet color={cat.magnetColor || "#ef4444"} size="sm" />
                    </div>

                    {/* Note Content */}
                    <div className="mt-2 text-center">
                      <p className="font-serif font-bold text-xs md:text-sm leading-tight text-slate-900 truncate">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-slate-600 line-clamp-2 mt-1 leading-tight font-sans">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-900/10">
                      <span>{Math.round(scale * 100)}%</span>
                      <span>{rotation > 0 ? `+${rotation}°` : `${rotation}°`}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white rounded-full p-1 shadow">
                        <Move className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Note Inspector & Controls */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" />
              Note Customizer
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any sticky note to adjust size, angle, colors and door position.
            </p>
          </div>

          {/* Note Selector Pills */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Active Sticky Note
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  style={{
                    backgroundColor: c.id === selectedId ? c.color : "#1e293b",
                    color: c.id === selectedId ? "#0f172a" : "#cbd5e1",
                    fontWeight: c.id === selectedId ? "bold" : "normal",
                  }}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-700 transition-all flex items-center gap-1.5 truncate"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.magnetColor }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {selectedCategory ? (
            <div className="space-y-4 pt-2 border-t border-slate-800 text-sm">
              {/* Quick Text Edit */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={selectedCategory.description}
                  onChange={(e) => updateSelected({ description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Sliders */}
              <div className="space-y-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {/* Scale / Resize */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                      Size / Scale
                    </span>
                    <span className="font-mono text-sky-400 font-bold">
                      {Math.round((selectedCategory.scale || 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.35"
                    step="0.05"
                    value={selectedCategory.scale || 1}
                    onChange={(e) => updateSelected({ scale: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                      Tilt / Rotation
                    </span>
                    <span className="font-mono text-sky-400 font-bold">
                      {selectedCategory.rotation ?? 0}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    step="0.5"
                    value={selectedCategory.rotation ?? 0}
                    onChange={(e) => updateSelected({ rotation: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* X Position */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="font-medium">Horizontal (Door X)</span>
                    <span className="font-mono text-slate-400">{selectedCategory.xPos?.toFixed(1) ?? "50.0"}%</span>
                  </div>
                  <input
                    type="range"
                    min="35.0"
                    max="65.0"
                    step="0.2"
                    value={selectedCategory.xPos ?? 50}
                    onChange={(e) => updateSelected({ xPos: parseFloat(e.target.value) })}
                    className="w-full accent-slate-400 cursor-pointer"
                  />
                </div>

                {/* Y Position */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="font-medium">Vertical (Door Y)</span>
                    <span className="font-mono text-slate-400">{selectedCategory.yPos?.toFixed(1) ?? "60.0"}%</span>
                  </div>
                  <input
                    type="range"
                    min="48.0"
                    max="92.0"
                    step="0.2"
                    value={selectedCategory.yPos ?? 60}
                    onChange={(e) => updateSelected({ yPos: parseFloat(e.target.value) })}
                    className="w-full accent-slate-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  Paper Sticky Color
                </label>
                <div className="flex gap-2">
                  {paperColors.map((color) => (
                    <button
                      key={color.value}
                      title={color.name}
                      onClick={() => updateSelected({ color: color.value })}
                      style={{ backgroundColor: color.value }}
                      className={`w-6 h-6 rounded-md border transition-transform ${
                        selectedCategory.color === color.value
                          ? "ring-2 ring-sky-400 scale-110 border-white"
                          : "border-slate-600 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Magnet Color */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Magnet Pin Color
                </label>
                <div className="flex gap-2">
                  {magnetColors.map((color) => (
                    <button
                      key={color.value}
                      title={color.name}
                      onClick={() => updateSelected({ magnetColor: color.value })}
                      style={{ backgroundColor: color.value }}
                      className={`w-6 h-6 rounded-full border transition-transform shadow ${
                        selectedCategory.magnetColor === color.value
                          ? "ring-2 ring-sky-400 scale-110 border-white"
                          : "border-slate-600 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-6 text-center">
              Click any note on the fridge canvas to inspect and edit its size, position, and colors.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
