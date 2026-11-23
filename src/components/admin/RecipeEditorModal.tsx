"use client";

import React, { useState, useEffect } from "react";
import { Recipe, Category, NoteStyle, DifficultyLevel } from "@/types";
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Sparkles,
  Heart,
  Star,
  Clock,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";

interface RecipeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe | null; // if null => Add New mode
  categories: Category[];
  onSave: (recipe: Recipe) => Promise<void>;
}

export const RecipeEditorModal: React.FC<RecipeEditorModalProps> = ({
  isOpen,
  onClose,
  recipe,
  categories,
  onSave,
}) => {
  const isEditing = Boolean(recipe);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "sandwiches");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("15 mins");
  const [cookTime, setCookTime] = useState("15 mins");
  const [totalTime, setTotalTime] = useState("30 mins");
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Easy");
  const [style, setStyle] = useState<NoteStyle>("photo");
  const [image, setImage] = useState("");
  const [paperColor, setPaperColor] = useState("#fef08a");
  const [magnetColor, setMagnetColor] = useState("#ef4444");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [storageTips, setStorageTips] = useState("");
  const [authorNote, setAuthorNote] = useState("");

  // Ingredients and Instructions dynamic builders
  const [ingredients, setIngredients] = useState<{ item: string; amount: string }[]>([
    { item: "", amount: "" },
  ]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [kitchenNotes, setKitchenNotes] = useState<string[]>([""]);
  const [variations, setVariations] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setSlug(recipe.slug || recipe.id);
      setCategoryId(recipe.categoryId);
      setDescription(recipe.description || "");
      setPrepTime(recipe.prepTime || "15 mins");
      setCookTime(recipe.cookTime || "15 mins");
      setTotalTime(recipe.totalTime || "30 mins");
      setServings(recipe.servings || 2);
      setDifficulty(recipe.difficulty || "Easy");
      setStyle(recipe.style || "photo");
      setImage(recipe.image || "");
      setPaperColor(recipe.paperColor || "#fef08a");
      setMagnetColor(recipe.magnetColor || "#ef4444");
      setIsFavorite(recipe.isFavorite || false);
      setIsSpecial(recipe.isSpecial || false);
      setIsHidden(recipe.isHidden || false);
      setStorageTips(recipe.storageTips || "");
      setAuthorNote(recipe.authorNote || "");
      setIngredients(
        recipe.ingredients && recipe.ingredients.length > 0
          ? recipe.ingredients
          : [{ item: "", amount: "" }]
      );
      setInstructions(
        recipe.instructions && recipe.instructions.length > 0
          ? recipe.instructions
          : [""]
      );
      setKitchenNotes(
        recipe.kitchenNotes && recipe.kitchenNotes.length > 0
          ? recipe.kitchenNotes
          : [""]
      );
      setVariations(recipe.variations || []);
    } else {
      // Default clean form
      setTitle("");
      setSlug("");
      setCategoryId(categories[0]?.id || "sandwiches");
      setDescription("");
      setPrepTime("15 mins");
      setCookTime("15 mins");
      setTotalTime("30 mins");
      setServings(2);
      setDifficulty("Easy");
      setStyle("photo");
      setImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80");
      setPaperColor("#fef08a");
      setMagnetColor("#ef4444");
      setIsFavorite(false);
      setIsSpecial(false);
      setIsHidden(false);
      setStorageTips("");
      setAuthorNote("");
      setIngredients([
        { item: "Main ingredient", amount: "200g" },
        { item: "Seasoning / spices", amount: "1 tsp" },
      ]);
      setInstructions([
        "Prepare ingredients and heat the pan.",
        "Cook gently until fragrant and golden.",
      ]);
      setKitchenNotes(["Serve hot with a side of crispy fries or salad."]);
      setVariations([]);
    }
    setErrorMsg(null);
  }, [recipe, categories, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
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
    if (!title.trim()) {
      setErrorMsg("Recipe title is required.");
      return;
    }

    const matchedCategory = categories.find((c) => c.id === categoryId);

    const recipeData: Recipe = {
      id: recipe?.id || `recipe-${Date.now()}`,
      slug: slug.trim() || `recipe-${Date.now()}`,
      title: title.trim(),
      categoryId,
      categoryName: matchedCategory?.name || "Uncategorized",
      description: description.trim(),
      prepTime,
      cookTime,
      totalTime,
      servings: Number(servings) || 2,
      difficulty,
      style,
      image: image.trim() || undefined,
      paperColor,
      magnetColor,
      isFavorite,
      isSpecial,
      isHidden,
      storageTips: storageTips.trim() || undefined,
      authorNote: authorNote.trim() || undefined,
      ingredients: ingredients.filter((i) => i.item.trim().length > 0),
      instructions: instructions.filter((i) => i.trim().length > 0),
      kitchenNotes: kitchenNotes.filter((n) => n.trim().length > 0),
      variations: variations.filter((v) => v.trim().length > 0),
      rotation: recipe?.rotation ?? 0,
      scale: recipe?.scale ?? 1,
    };

    try {
      setIsSaving(true);
      setErrorMsg(null);
      await onSave(recipeData);
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to save recipe to Supabase.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {isEditing ? `Edit Recipe: ${recipe?.title}` : "Add New Recipe"}
            </h3>
            <p className="text-xs text-slate-400">
              Changes sync instantly to your Supabase Postgres database.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visibility Hide/Unhide Toggle */}
            <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2.5">
                {isHidden ? (
                  <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-slate-200 block text-xs">
                    {isHidden ? "Hidden from Public Fridge (Draft Mode)" : "Visible on Public Fridge"}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {isHidden
                      ? "Keep working on this recipe privately — visitors won't see it on the fridge until you unhide."
                      : "Visitors can browse, search, and view this recipe note on the fridge."}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHidden(!isHidden)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isHidden
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                }`}
              >
                {isHidden ? "Unhide Recipe" : "Hide Recipe"}
              </button>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recipe Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Grilled Peri Peri Paneer Sandwich"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short appetizing summary shown on the fridge note..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" /> Prep Time
              </label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" /> Cook Time
              </label>
              <input
                type="text"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-sky-400" /> Servings
              </label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Visual Presentation */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Visual Note Style & Media
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Card Style
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStyle("photo")}
                    className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                      style === "photo"
                        ? "bg-sky-500/20 border-sky-500 text-sky-300"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    Polaroid Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyle("text")}
                    className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                      style === "text"
                        ? "bg-sky-500/20 border-sky-500 text-sky-300"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    Sticky Note
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Image URL
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-8 h-8 rounded object-cover border border-slate-700"
                    />
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className="accent-pink-500 w-4 h-4 rounded"
                  />
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  Mark as Favorite
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={isSpecial}
                    onChange={(e) => setIsSpecial(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  Chef's Special
                </label>
              </div>
            </div>
          </div>

          {/* Dynamic Ingredients Builder */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Ingredients List ({ingredients.length})
              </h4>
              <button
                type="button"
                onClick={() => setIngredients([...ingredients, { item: "", amount: "" }])}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ingredient
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={ing.item}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[i].item = e.target.value;
                      setIngredients(updated);
                    }}
                    placeholder="Ingredient item (e.g. Sourdough bread)"
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
                  />
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[i].amount = e.target.value;
                      setIngredients(updated);
                    }}
                    placeholder="Amount (e.g. 2 slices)"
                    className="w-36 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Instructions Builder */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Step-by-Step Instructions ({instructions.length})
              </h4>
              <button
                type="button"
                onClick={() => setInstructions([...instructions, ""])}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>
            <div className="space-y-2">
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] flex items-center justify-center shrink-0 mt-1">
                    {i + 1}
                  </span>
                  <textarea
                    rows={2}
                    value={step}
                    onChange={(e) => {
                      const updated = [...instructions];
                      updated[i] = e.target.value;
                      setInstructions(updated);
                    }}
                    placeholder={`Step ${i + 1} details...`}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setInstructions(instructions.filter((_, idx) => idx !== i))}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Chef's Notes & Storage Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Kitchen Secrets & Notes
                </label>
                <textarea
                  rows={2}
                  value={kitchenNotes.join("\n")}
                  onChange={(e) => setKitchenNotes(e.target.value.split("\n"))}
                  placeholder="One tip per line..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Storage Tips
                </label>
                <textarea
                  rows={2}
                  value={storageTips}
                  onChange={(e) => setStorageTips(e.target.value)}
                  placeholder="e.g. Keep in airtight container for up to 2 days..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {isSaving ? "Saving to Supabase..." : isEditing ? "Update Recipe" : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
