import { Recipe, Category, FridgeSettings } from "@/types";
import { initialCategories } from "@/data/categories";
import { initialRecipes } from "@/data/recipes";
import { siteConfig } from "@/config/siteConfig";
import { getSupabaseBrowserClient } from "./client";

export const defaultFridgeSettings: FridgeSettings = {
  id: "default",
  badgeText: siteConfig.fridgeBadgeText,
  tagline: siteConfig.tagline,
  subIntro: siteConfig.subIntro,
  butterNoteText: "Butter! 🧈",
  moodNoteText: "Good food = Good mood 🍓",
  defaultAudioEnabled: siteConfig.defaultAudioEnabled,
  notesScale: 1,
  introNotePos: { x: 48, y: 35.2, scale: 1, rotation: -1 },
  butterNotePos: { x: 60.5, y: 35.5, scale: 1, rotation: 3 },
  moodNotePos: { x: 60, y: 84.5, scale: 1, rotation: 2 },
};

// ============================================================
// DATA FETCHING (Public Read Access)
// ============================================================

export async function fetchFridgeData(): Promise<{
  categories: Category[];
  recipes: Recipe[];
  settings: FridgeSettings;
  isLive: boolean;
}> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    // Fallback to local storage or defaults when Supabase isn't configured yet
    return getLocalFridgeData();
  }

  try {
    const [categoriesRes, recipesRes, settingsRes] = await Promise.all([
      supabase.from("categories").select("*").order("display_order", { ascending: true }),
      supabase.from("recipes").select("*").order("created_at", { ascending: false }),
      supabase.from("fridge_settings").select("*").eq("id", "default").maybeSingle(),
    ]);

    const categories: Category[] =
      categoriesRes.data && categoriesRes.data.length > 0
        ? categoriesRes.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug || c.id,
            color: c.color,
            magnetColor: c.magnet_color,
            rotation: c.rotation ?? 0,
            iconName: c.icon_name || "sparkles",
            description: c.description || "",
            pinPosition: c.pin_position || "top-center",
            xPos: c.x_pos,
            yPos: c.y_pos,
            scale: c.scale ?? 1,
            displayOrder: c.display_order,
          }))
        : initialCategories;

    const recipes: Recipe[] =
      recipesRes.data && recipesRes.data.length > 0
        ? recipesRes.data.map((r: any) => ({
            id: r.id,
            slug: r.slug || r.id,
            title: r.title,
            categoryId: r.category_id,
            categoryName: r.category_name,
            description: r.description || "",
            prepTime: r.prep_time || "15 mins",
            cookTime: r.cook_time || "15 mins",
            totalTime: r.total_time || "30 mins",
            servings: r.servings || 2,
            difficulty: r.difficulty || "Easy",
            style: r.style || "text",
            image: r.image || undefined,
            paperColor: r.paper_color || "#fef08a",
            magnetColor: r.magnet_color || "#ef4444",
            rotation: r.rotation ?? 0,
            scale: r.scale ?? 1,
            xPos: r.x_pos,
            yPos: r.y_pos,
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
            instructions: Array.isArray(r.instructions) ? r.instructions : [],
            kitchenNotes: Array.isArray(r.kitchen_notes) ? r.kitchen_notes : [],
            variations: Array.isArray(r.variations) ? r.variations : [],
            storageTips: r.storage_tips || "",
            isSpecial: r.is_special || false,
            isFavorite: r.is_favorite || false,
            authorNote: r.author_note || "",
          }))
        : initialRecipes;

    const settings: FridgeSettings = settingsRes.data
      ? {
          id: settingsRes.data.id,
          badgeText: settingsRes.data.badge_text || defaultFridgeSettings.badgeText,
          tagline: settingsRes.data.tagline || defaultFridgeSettings.tagline,
          subIntro: settingsRes.data.sub_intro || defaultFridgeSettings.subIntro,
          butterNoteText: settingsRes.data.butter_note_text || defaultFridgeSettings.butterNoteText,
          moodNoteText: settingsRes.data.mood_note_text || defaultFridgeSettings.moodNoteText,
          defaultAudioEnabled: settingsRes.data.default_audio_enabled ?? false,
          introNotePos: settingsRes.data.intro_note_pos || defaultFridgeSettings.introNotePos,
          butterNotePos: settingsRes.data.butter_note_pos || defaultFridgeSettings.butterNotePos,
          moodNotePos: settingsRes.data.mood_note_pos || defaultFridgeSettings.moodNotePos,
        }
      : defaultFridgeSettings;

    return { categories, recipes, settings, isLive: true };
  } catch (error) {
    console.warn("Supabase fetch failed, falling back to local defaults:", error);
    return getLocalFridgeData();
  }
}

function getLocalFridgeData(): {
  categories: Category[];
  recipes: Recipe[];
  settings: FridgeSettings;
  isLive: boolean;
} {
  let categories = initialCategories;
  let recipes = initialRecipes;
  let settings = defaultFridgeSettings;

  if (typeof window !== "undefined") {
    try {
      const savedRecipes = localStorage.getItem("fridge_notes_custom_recipes");
      if (savedRecipes) recipes = JSON.parse(savedRecipes);

      const savedCategories = localStorage.getItem("fridge_notes_custom_categories");
      if (savedCategories) categories = JSON.parse(savedCategories);

      const savedSettings = localStorage.getItem("fridge_notes_settings");
      if (savedSettings) settings = { ...defaultFridgeSettings, ...JSON.parse(savedSettings) };
    } catch {
      // ignore
    }
  }

  return { categories, recipes, settings, isLive: false };
}

// ============================================================
// MUTATIONS (Authenticated Admin Operations)
// ============================================================

export async function saveRecipeToSupabase(recipe: Recipe): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    // Local fallback
    saveLocalRecipe(recipe);
    return true;
  }

  const payload = {
    id: recipe.id,
    slug: recipe.slug || recipe.id,
    title: recipe.title,
    category_id: recipe.categoryId,
    category_name: recipe.categoryName,
    description: recipe.description,
    prep_time: recipe.prepTime,
    cook_time: recipe.cookTime,
    total_time: recipe.totalTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    style: recipe.style,
    image: recipe.image || null,
    paper_color: recipe.paperColor || null,
    magnet_color: recipe.magnetColor || null,
    rotation: recipe.rotation ?? 0,
    scale: recipe.scale ?? 1,
    x_pos: recipe.xPos ?? null,
    y_pos: recipe.yPos ?? null,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    kitchen_notes: recipe.kitchenNotes,
    variations: recipe.variations || [],
    storage_tips: recipe.storageTips || null,
    is_special: recipe.isSpecial || false,
    is_favorite: recipe.isFavorite || false,
    author_note: recipe.authorNote || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("recipes").upsert(payload, { onConflict: "id" });
  if (error) {
    console.error("Failed to save recipe:", error);
    throw error;
  }
  return true;
}

export async function deleteRecipeFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    deleteLocalRecipe(id);
    return true;
  }

  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete recipe:", error);
    throw error;
  }
  return true;
}

export async function saveCategoryToSupabase(category: Category): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    saveLocalCategory(category);
    return true;
  }

  const payload = {
    id: category.id,
    name: category.name,
    slug: category.slug || category.id,
    color: category.color,
    magnet_color: category.magnetColor,
    rotation: category.rotation ?? 0,
    icon_name: category.iconName || "sparkles",
    description: category.description || "",
    pin_position: category.pinPosition || "top-center",
    x_pos: category.xPos ?? null,
    y_pos: category.yPos ?? null,
    scale: category.scale ?? 1,
    display_order: category.displayOrder ?? 0,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("categories").upsert(payload, { onConflict: "id" });
  if (error) {
    console.error("Failed to save category:", error);
    throw error;
  }
  return true;
}

export async function deleteCategoryFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return true;
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete category:", error);
    throw error;
  }
  return true;
}

export async function saveFridgeSettingsToSupabase(settings: FridgeSettings): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    if (typeof window !== "undefined") {
      localStorage.setItem("fridge_notes_settings", JSON.stringify(settings));
    }
    return true;
  }

  const payload = {
    id: "default",
    badge_text: settings.badgeText,
    tagline: settings.tagline,
    sub_intro: settings.subIntro,
    butter_note_text: settings.butterNoteText,
    mood_note_text: settings.moodNoteText,
    default_audio_enabled: settings.defaultAudioEnabled,
    intro_note_pos: settings.introNotePos,
    butter_note_pos: settings.butterNotePos,
    mood_note_pos: settings.moodNotePos,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("fridge_settings").upsert(payload, { onConflict: "id" });
  if (error) {
    console.error("Failed to save settings:", error);
    throw error;
  }
  return true;
}

// Batch save positions from visual Arranger
export async function saveArrangedLayoutToSupabase(params: {
  categories: Category[];
  recipes?: Recipe[];
  settings?: FridgeSettings;
}): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    if (typeof window !== "undefined") {
      localStorage.setItem("fridge_notes_custom_categories", JSON.stringify(params.categories));
      if (params.recipes) {
        localStorage.setItem("fridge_notes_custom_recipes", JSON.stringify(params.recipes));
      }
      if (params.settings) {
        localStorage.setItem("fridge_notes_settings", JSON.stringify(params.settings));
      }
    }
    return true;
  }

  // Update categories
  const categoryPromises = params.categories.map((c, index) =>
    supabase.from("categories").update({
      display_order: index,
      name: c.name,
      description: c.description,
      color: c.color,
      magnet_color: c.magnetColor,
      scale: c.scale ?? 1,
      rotation: c.rotation ?? 0,
      updated_at: new Date().toISOString(),
    }).eq("id", c.id)
  );

  const promises: Promise<unknown>[] = [...categoryPromises];

  if (params.settings) {
    promises.push(
      supabase.from("fridge_settings").upsert({
        id: "default",
        intro_note_pos: params.settings.introNotePos,
        butter_note_pos: params.settings.butterNotePos,
        mood_note_pos: params.settings.moodNotePos,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" })
    );
  }

  await Promise.all(promises);
  return true;
}

// Local storage helpers
function saveLocalRecipe(recipe: Recipe) {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("fridge_notes_custom_recipes");
    const list: Recipe[] = saved ? JSON.parse(saved) : initialRecipes;
    const idx = list.findIndex((r) => r.id === recipe.id);
    if (idx >= 0) {
      list[idx] = recipe;
    } else {
      list.unshift(recipe);
    }
    localStorage.setItem("fridge_notes_custom_recipes", JSON.stringify(list));
  } catch {
    // ignore
  }
}

function deleteLocalRecipe(id: string) {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("fridge_notes_custom_recipes");
    const list: Recipe[] = saved ? JSON.parse(saved) : initialRecipes;
    const filtered = list.filter((r) => r.id !== id);
    localStorage.setItem("fridge_notes_custom_recipes", JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

function saveLocalCategory(category: Category) {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("fridge_notes_custom_categories");
    const list: Category[] = saved ? JSON.parse(saved) : initialCategories;
    const idx = list.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      list[idx] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem("fridge_notes_custom_categories", JSON.stringify(list));
  } catch {
    // ignore
  }
}
