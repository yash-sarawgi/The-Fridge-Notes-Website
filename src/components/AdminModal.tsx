"use client";

import React, { useState } from "react";
import { Recipe, Category, NoteStyle, DifficultyLevel } from "@/types";
import { X, Plus, Trash2, Edit2, RotateCcw, Image as ImageIcon, FileText, Check } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  categories: Category[];
  onAddRecipe: (recipe: Recipe) => void;
  onUpdateRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onResetDefaults: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  recipes,
  categories,
  onAddRecipe,
  onUpdateRecipe,
  onDeleteRecipe,
  onResetDefaults,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "sandwiches");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<NoteStyle>("photo");
  const [image, setImage] = useState("");
  const [prepTime, setPrepTime] = useState("15 mins");
  const [cookTime, setCookTime] = useState("10 mins");
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Easy");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [kitchenNotesText, setKitchenNotesText] = useState("");

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setTitle("");
    setCategoryId(categories[0]?.id || "sandwiches");
    setDescription("");
    setStyle("photo");
    setImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80");
    setPrepTime("15 mins");
    setCookTime("15 mins");
    setServings(2);
    setDifficulty("Easy");
    setIngredientsText("2 slices sourdough bread\n100g fresh cheddar cheese\n1 tbsp butter");
    setInstructionsText("Layer cheese between bread.\nGrill in melted butter until crisp and golden.");
    setKitchenNotesText("Use low heat to melt the cheese thoroughly without scorching.");
  };

  const handleStartEdit = (r: Recipe) => {
    setIsCreating(false);
    setEditingId(r.id);
    setTitle(r.title);
    setCategoryId(r.categoryId);
    setDescription(r.description);
    setStyle(r.style);
    setImage(r.image || "");
    setPrepTime(r.prepTime);
    setCookTime(r.cookTime);
    setServings(r.servings);
    setDifficulty(r.difficulty);
    setIngredientsText(r.ingredients.map((i) => `${i.amount} ${i.item}`).join("\n"));
    setInstructionsText(r.instructions.join("\n"));
    setKitchenNotesText(r.kitchenNotes.join("\n"));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCat = categories.find((c) => c.id === categoryId);

    const parsedIngredients = ingredientsText
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const parts = line.split(" ");
        const amount = parts[0] || "1";
        const item = parts.slice(1).join(" ") || line;
        return { amount, item };
      });

    const parsedInstructions = instructionsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedKitchenNotes = kitchenNotesText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (isCreating) {
      const newRecipe: Recipe = {
        id: `custom-${Date.now()}`,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title,
        categoryId,
        categoryName: matchedCat?.name || "Other",
        description,
        prepTime,
        cookTime,
        totalTime: `${parseInt(prepTime) + parseInt(cookTime) || 20} mins`,
        servings: Number(servings) || 2,
        difficulty,
        style,
        image: style === "photo" ? image : undefined,
        paperColor: matchedCat?.color || "#fef08a",
        magnetColor: matchedCat?.magnetColor || "#ef4444",
        rotation: (Math.random() * 4 - 2),
        ingredients: parsedIngredients,
        instructions: parsedInstructions,
        kitchenNotes: parsedKitchenNotes,
      };
      onAddRecipe(newRecipe);
    } else if (editingId) {
      const existing = recipes.find((r) => r.id === editingId);
      if (existing) {
        const updated: Recipe = {
          ...existing,
          title,
          categoryId,
          categoryName: matchedCat?.name || existing.categoryName,
          description,
          prepTime,
          cookTime,
          totalTime: `${parseInt(prepTime) + parseInt(cookTime) || 20} mins`,
          servings: Number(servings) || 2,
          difficulty,
          style,
          image: style === "photo" ? image : undefined,
          ingredients: parsedIngredients,
          instructions: parsedInstructions,
          kitchenNotes: parsedKitchenNotes,
        };
        onUpdateRecipe(updated);
      }
    }

    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#fbf9f4] rounded-lg shadow-2xl border border-stone-300 flex flex-col overflow-hidden text-stone-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#f4eee4]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📓</span>
            <div>
              <h2 className="font-heading text-xl font-bold text-stone-900 leading-tight">
                Chef&apos;s Notebook — Fridge Recipe Manager
              </h2>
              <p className="text-xs text-stone-600 font-handwriting">
                Frontend-Only Preview • Changes persist in your browser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetDefaults}
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors border border-rose-200"
              title="Reset all recipes back to factory defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/10 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Actions */}
          {!isCreating && !editingId && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-600">
                Total Recipes: {recipes.length}
              </span>
              <button
                onClick={handleStartCreate}
                className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-amber-900 text-white text-sm font-semibold hover:bg-amber-800 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add New Fridge Note
              </button>
            </div>
          )}

          {/* Form when Creating or Editing */}
          {(isCreating || editingId) ? (
            <form onSubmit={handleSave} className="bg-white p-5 rounded-md border border-stone-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-heading font-bold text-lg text-amber-950">
                  {isCreating ? "Pin a New Recipe Note" : `Edit: ${title}`}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Recipe Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Grandma's Apple Crisp"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Fridge Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Note Style Selection: Polaroid Photo vs Text Sticky Note */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Fridge Note Style
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="noteStyle"
                      checked={style === "photo"}
                      onChange={() => setStyle("photo")}
                    />
                    <span className="flex items-center gap-1 font-medium">
                      <ImageIcon className="w-4 h-4 text-amber-700" /> Polaroid Photo Note
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="noteStyle"
                      checked={style === "text"}
                      onChange={() => setStyle("text")}
                    />
                    <span className="flex items-center gap-1 font-medium">
                      <FileText className="w-4 h-4 text-amber-700" /> Coloured Sticky Note
                    </span>
                  </label>
                </div>
              </div>

              {style === "photo" && (
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Photo URL (Unsplash or direct image URL)
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short appetizing personal intro to this recipe..."
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Times & Servings */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-2.5 py-1 border border-stone-300 rounded-sm text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Cook Time</label>
                  <input
                    type="text"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    className="w-full px-2.5 py-1 border border-stone-300 rounded-sm text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Servings</label>
                  <input
                    type="number"
                    min={1}
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value) || 2)}
                    className="w-full px-2.5 py-1 border border-stone-300 rounded-sm text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-2.5 py-1 border border-stone-300 rounded-sm text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Ingredients & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Ingredients (one per line, e.g. &apos;2 cups flour&apos;)
                  </label>
                  <textarea
                    rows={4}
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-sm text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Instructions (one step per line)
                  </label>
                  <textarea
                    rows={4}
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-sm text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  My Kitchen Notes (tips, secrets, one per line)
                </label>
                <textarea
                  rows={2}
                  value={kitchenNotesText}
                  onChange={(e) => setKitchenNotesText(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-sm text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 rounded-sm border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-amber-900 text-white text-sm font-semibold hover:bg-amber-800 shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save to Fridge
                </button>
              </div>
            </form>
          ) : (
            /* Recipe List Table */
            <div className="border border-stone-200 rounded-md overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100 text-stone-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Dish Note</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Style</th>
                    <th className="px-4 py-3">Total Time</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recipes.map((r) => (
                    <tr key={r.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-stone-900">
                        {r.title}
                        {r.isSpecial && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Special
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-600">{r.categoryName}</td>
                      <td className="px-4 py-3 text-stone-500">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-stone-100">
                          {r.style === "photo" ? "Polaroid 📷" : "Sticky 📝"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600">{r.totalTime}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleStartEdit(r)}
                          className="p-1.5 rounded-sm hover:bg-amber-100 text-amber-900 transition-colors"
                          title="Edit recipe"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRecipe(r.id)}
                          className="p-1.5 rounded-sm hover:bg-rose-100 text-rose-700 transition-colors"
                          title="Delete recipe"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
