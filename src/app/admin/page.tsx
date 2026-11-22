"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Recipe, Category, FridgeSettings } from "@/types";
import {
  fetchFridgeData,
  saveRecipeToSupabase,
  deleteRecipeFromSupabase,
  saveCategoryToSupabase,
  deleteCategoryFromSupabase,
  saveFridgeSettingsToSupabase,
  saveArrangedLayoutToSupabase,
  defaultFridgeSettings,
} from "@/lib/supabase/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { FridgeVisualArranger } from "@/components/admin/FridgeVisualArranger";
import { RecipeEditorModal } from "@/components/admin/RecipeEditorModal";
import { CategoryEditorModal } from "@/components/admin/CategoryEditorModal";
import {
  Move,
  BookOpen,
  FolderOpen,
  Settings,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ExternalLink,
  Lock,
  ShieldCheck,
  Check,
  Search,
  Heart,
  Star,
  Clock,
  Sparkles,
  Layers,
  Database,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

type ActiveTab = "arranger" | "recipes" | "categories" | "settings";

export default function AdminPage() {
  const [supabase] = useState(() => getSupabaseBrowserClient());

  // Auth State
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Data State
  const [activeTab, setActiveTab] = useState<ActiveTab>("arranger");
  const [categories, setCategories] = useState<Category[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [settings, setSettings] = useState<FridgeSettings>(defaultFridgeSettings);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSavingLayout, setIsSavingLayout] = useState(false);

  // Filter & Search in Recipes CMS
  const [recipeSearch, setRecipeSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Modals
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check auth session
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      if (!supabase) {
        // No keys configured yet -> default to demo mode prompt
        if (mounted) {
          setAuthLoading(false);
        }
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (mounted && data.session?.user) {
          setUser({ email: data.session.user.email, id: data.session.user.id });
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    }

    checkAuth();

    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event: unknown, session: { user?: { email?: string; id?: string } } | null) => {
        if (session?.user) {
          setUser({ email: session.user.email, id: session.user.id });
        } else {
          setUser(null);
        }
      });
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, [supabase]);

  // Load fridge data
  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchFridgeData();
      setCategories(data.categories);
      setRecipes(data.recipes);
      setSettings(data.settings);
      setIsLiveConnected(data.isLive);
    } catch (err) {
      console.error("Failed to load fridge data:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (user || isDemoMode) {
      loadData();
    }
  }, [user, isDemoMode, loadData]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!supabase) {
      setLoginError(
        "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are not detected in .env.local. Click 'Enter Local Preview Mode' below to test the CMS dashboard."
      );
      return;
    }

    try {
      setLoginSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser({ email: data.user.email, id: data.user.id });
        setIsDemoMode(false);
        showToast("Welcome back to The Fridge Notes CMS!");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setLoginError(error.message || "Invalid login credentials.");
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemoMode(false);
  };

  // Recipe Operations
  const handleSaveRecipe = async (saved: Recipe) => {
    await saveRecipeToSupabase(saved);
    setRecipes((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    showToast(`Recipe "${saved.title}" saved successfully!`);
  };

  const handleDeleteRecipe = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteRecipeFromSupabase(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      showToast(`Recipe "${title}" deleted.`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe.");
    }
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    const updated = { ...recipe, isFavorite: !recipe.isFavorite };
    await saveRecipeToSupabase(updated);
    setRecipes((prev) => prev.map((r) => (r.id === recipe.id ? updated : r)));
    showToast(updated.isFavorite ? "Added to favorites ❤️" : "Removed from favorites");
  };

  // Category Operations
  const handleSaveCategory = async (saved: Category) => {
    await saveCategoryToSupabase(saved);
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
    showToast(`Category "${saved.name}" saved!`);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategoryFromSupabase(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast(`Category "${name}" removed.`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    }
  };

  // Arranger Save
  const handleSaveArrangedLayout = async (
    updatedCategories: Category[],
    updatedSettings: FridgeSettings
  ) => {
    try {
      setIsSavingLayout(true);
      await saveArrangedLayoutToSupabase({
        categories: updatedCategories,
        settings: updatedSettings,
      });
      setCategories(updatedCategories);
      setSettings(updatedSettings);
      showToast("Fridge layout & note positions saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save layout.");
    } finally {
      setIsSavingLayout(false);
    }
  };

  const handleResetArranger = () => {
    if (!window.confirm("Reset note positions to standard 3x3 layout on the fridge?")) return;
    const reset = categories.map((cat, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      return {
        ...cat,
        xPos: 36.5 + col * 9.8,
        yPos: 50.5 + row * 13.5,
        scale: 1,
        rotation: col === 0 ? -2 : col === 1 ? 1 : -1,
      };
    });
    setCategories(reset);
    showToast("Layout reset. Click 'Save Fridge Layout' to apply.");
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveFridgeSettingsToSupabase(settings);
      showToast("Fridge text & settings saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    }
  };

  // Loading screen
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-sky-400 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-400 font-mono">Loading Fridge Notes CMS...</p>
        </div>
      </div>
    );
  }

  // Not Logged In View
  if (!user && !isDemoMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1120] to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Logo / Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-amber-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Lock className="w-7 h-7 text-slate-950" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">The Fridge Notes</h1>
            <p className="text-xs text-slate-400">
              Backend Content Management & Visual Fridge Arranger
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@thefridgenotes.com"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {loginSubmitting ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {loginSubmitting ? "Authenticating..." : "Sign In with Supabase Auth"}
            </button>
          </form>

          {/* Quick Demo Preview Mode Button */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-3">
            <button
              onClick={() => setIsDemoMode(true)}
              className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Enter Local Preview Mode (No Login Required)
            </button>
            <p className="text-[11px] text-slate-500">
              Protected by Supabase Row Level Security (RLS). Only authenticated admins can write to database.
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Return to Public Fridge
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered recipes
  const filteredRecipes = recipes.filter((r) => {
    const matchesCat =
      selectedCategoryFilter === "all" || r.categoryId === selectedCategoryFilter;
    const matchesSearch =
      !recipeSearch ||
      r.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.description?.toLowerCase().includes(recipeSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-sky-500/50 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-amber-400 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              The Fridge Notes
              <span className="text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                CMS Dashboard
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Admin content editor & visual fridge arranger
            </p>
          </div>
        </div>

        {/* Right Status & Actions */}
        <div className="flex items-center gap-3 text-xs">
          {/* Connection status badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono ${
              isLiveConnected
                ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-300"
                : "bg-amber-950/40 border-amber-700/50 text-amber-300"
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{isLiveConnected ? "Supabase Live" : "Local Mode"}</span>
          </div>

          {/* User info */}
          <span className="text-slate-400 hidden sm:inline font-mono">
            {user?.email || "Local Admin Preview"}
          </span>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">View Fridge</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("arranger")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "arranger"
                ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Move className="w-4 h-4" />
            Visual Fridge Arranger
          </button>

          <button
            onClick={() => setActiveTab("recipes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "recipes"
                ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Recipes CMS ({recipes.length})
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "categories"
                ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "settings"
                ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            Fridge Texts & Settings
          </button>
        </div>

        {/* Tab 1: Visual Fridge Arranger */}
        {activeTab === "arranger" && (
          <FridgeVisualArranger
            categories={categories}
            settings={settings}
            onSaveLayout={handleSaveArrangedLayout}
            onResetLayout={handleResetArranger}
            isSaving={isSavingLayout}
          />
        )}

        {/* Tab 2: Recipes CMS */}
        {activeTab === "recipes" && (
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    placeholder="Search dishes or ingredients..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="all">All Categories ({recipes.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (
                      {recipes.filter((r) => r.categoryId === c.id).length})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingRecipe(null);
                  setRecipeModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-sky-500/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Recipe
              </button>
            </div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all group hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-800/40">
                        {recipe.categoryName}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleFavorite(recipe)}
                          className="p-1 text-slate-500 hover:text-pink-400 transition-colors"
                          title="Toggle Favorite"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              recipe.isFavorite ? "fill-pink-500 text-pink-500" : ""
                            }`}
                          />
                        </button>
                        {recipe.isSpecial && (
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-800"
                        />
                      ) : (
                        <div
                          style={{ backgroundColor: recipe.paperColor || "#fef08a" }}
                          className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center text-slate-800 font-serif font-bold text-xs shadow-inner"
                        >
                          Note
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                          {recipe.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                          {recipe.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {recipe.totalTime}
                      </span>
                      <span>•</span>
                      <span>{recipe.difficulty}</span>
                      <span>•</span>
                      <span>{recipe.servings} Servings</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setEditingRecipe(recipe);
                        setRecipeModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-950/40 rounded transition-colors"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id, recipe.title)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Categories CMS */}
        {activeTab === "categories" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Categories Management</h3>
                <p className="text-xs text-slate-400">
                  Manage the categories that appear as sticky notes on the fridge door.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div
                      style={{ backgroundColor: c.color }}
                      className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center shadow"
                    >
                      <span
                        style={{ backgroundColor: c.magnetColor }}
                        className="w-3 h-3 rounded-full shadow"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                      <p className="text-[11px] font-mono text-slate-500 mt-1">
                        {recipes.filter((r) => r.categoryId === c.id).length} recipes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setEditingCategory(c);
                        setCategoryModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-sky-400 hover:text-sky-300 rounded"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-red-400 rounded"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Fridge Content & Settings */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-400" />
                Fridge Global Content & Settings
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize the texts and default behaviors shown on the fridge refrigerator surface.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Smeg Fridge Badge Text
                </label>
                <input
                  type="text"
                  value={settings.badgeText}
                  onChange={(e) => setSettings({ ...settings, badgeText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-serif tracking-widest text-sm focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Tagline (Intro Sticky Note)
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Sub-Intro (Intro Sticky Note)
                </label>
                <input
                  type="text"
                  value={settings.subIntro}
                  onChange={(e) => setSettings({ ...settings, subIntro: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Butter Note Reminder
                  </label>
                  <input
                    type="text"
                    value={settings.butterNoteText}
                    onChange={(e) =>
                      setSettings({ ...settings, butterNoteText: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Mood Note Text
                  </label>
                  <input
                    type="text"
                    value={settings.moodNoteText}
                    onChange={(e) =>
                      setSettings({ ...settings, moodNoteText: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={settings.defaultAudioEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultAudioEnabled: e.target.checked })
                    }
                    className="accent-sky-500 w-4 h-4 rounded"
                  />
                  <span>Enable audio sound effects by default for visitors</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Recipe Editor Modal */}
      <RecipeEditorModal
        isOpen={recipeModalOpen}
        onClose={() => {
          setRecipeModalOpen(false);
          setEditingRecipe(null);
        }}
        recipe={editingRecipe}
        categories={categories}
        onSave={handleSaveRecipe}
      />

      {/* Category Editor Modal */}
      <CategoryEditorModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
