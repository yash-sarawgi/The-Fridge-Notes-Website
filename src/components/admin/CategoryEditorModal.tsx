"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types";
import { X, Check, Sparkles, Palette, Eye, EyeOff } from "lucide-react";

interface CategoryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (category: Category) => Promise<void>;
}

export const CategoryEditorModal: React.FC<CategoryEditorModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const isEditing = Boolean(category);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#fef08a");
  const [magnetColor, setMagnetColor] = useState("#ef4444");
  const [iconName, setIconName] = useState("sparkles");
  const [isHidden, setIsHidden] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug || category.id);
      setDescription(category.description || "");
      setColor(category.color || "#fef08a");
      setMagnetColor(category.magnetColor || "#ef4444");
      setIconName(category.iconName || "sparkles");
      setIsHidden(category.isHidden || false);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setColor("#fef08a");
      setMagnetColor("#ef4444");
      setIconName("sparkles");
      setIsHidden(false);
    }
    setErrorMsg(null);
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }

    const catData: Category = {
      id: category?.id || slug.trim() || `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || category?.id || `cat-${Date.now()}`,
      description: description.trim(),
      color,
      magnetColor,
      iconName,
      rotation: category?.rotation ?? 0,
      scale: category?.scale ?? 1,
      xPos: category?.xPos,
      yPos: category?.yPos,
      pinPosition: category?.pinPosition || "top-center",
      displayOrder: category?.displayOrder ?? 99,
      isHidden,
    };

    try {
      setIsSaving(true);
      setErrorMsg(null);
      await onSave(catData);
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            {isEditing ? `Edit Category: ${category?.name}` : "Add New Category"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {/* Visibility Hide/Unhide Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2">
              {isHidden ? (
                <EyeOff className="w-4 h-4 text-amber-400" />
              ) : (
                <Eye className="w-4 h-4 text-emerald-400" />
              )}
              <div>
                <span className="font-semibold text-slate-200 block text-xs">
                  {isHidden ? "Hidden from Public Fridge (Draft Mode)" : "Visible on Public Fridge"}
                </span>
                <span className="text-[10.5px] text-slate-400 block">
                  {isHidden
                    ? "Keep editing privately — visitors won't see this category note on the fridge."
                    : "Visitors can see and browse recipes in this category note."}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsHidden(!isHidden)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                isHidden
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
              }`}
            >
              {isHidden ? "Unhide" : "Hide Note"}
            </button>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Pasta & Noodles"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Slug / Identifier</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One line description displayed on the sticky note..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-400" /> Sticky Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-slate-400">{color}</span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Magnet Pin Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={magnetColor}
                  onChange={(e) => setMagnetColor(e.target.value)}
                  className="w-8 h-8 rounded-full border border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-slate-400">{magnetColor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {isSaving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
