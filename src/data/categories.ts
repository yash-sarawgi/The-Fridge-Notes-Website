import { Category } from "@/types";

export const initialCategories: Category[] = [
  {
    id: "sandwiches",
    name: "Sandwiches",
    slug: "sandwiches",
    color: "#fed7aa", // warm butter peach
    magnetColor: "#ef4444", // cherry red
    rotation: -2.5,
    iconName: "sandwich",
    description: "Toasted, grilled, and layered between crisp artisan bread.",
    pinPosition: "top-center",
  },
  {
    id: "soups",
    name: "Soups",
    slug: "soups",
    color: "#fef08a", // soft butter yellow
    magnetColor: "#0284c7", // retro ocean blue
    rotation: 1.8,
    iconName: "soup",
    description: "Warm, simmering comfort in a bowl for rainy afternoons.",
    pinPosition: "top-left",
  },
  {
    id: "desserts",
    name: "Desserts",
    slug: "desserts",
    color: "#fbcfe8", // vintage dusty pink
    magnetColor: "#eab308", // mustard gold
    rotation: -3.2,
    iconName: "cake",
    description: "Sweet bites, baked treats, and nostalgic puddings.",
    pinPosition: "top-right",
  },
  {
    id: "snacks",
    name: "Snacks",
    slug: "snacks",
    color: "#bbf7d0", // soft sage green
    magnetColor: "#8b5cf6", // lavender purple
    rotation: 2.2,
    iconName: "cookie",
    description: "Quick cravings, crunchy bites, and finger food.",
    pinPosition: "top-center",
  },
  {
    id: "main-course",
    name: "Main Course",
    slug: "main-course",
    color: "#fed7aa", // apricot cream
    magnetColor: "#10b981", // emerald green
    rotation: -1.5,
    iconName: "utensils",
    description: "Hearty dinners and comforting weekend centrepieces.",
    pinPosition: "top-left",
  },
  {
    id: "breakfast",
    name: "Breakfast",
    slug: "breakfast",
    color: "#fef9c3", // pale morning yellow
    magnetColor: "#f97316", // sunny orange
    rotation: 2.8,
    iconName: "egg",
    description: "Lazy Sunday mornings, hot griddles, and fresh coffee.",
    pinPosition: "top-right",
  },
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    color: "#bae6fd", // powder sky blue
    magnetColor: "#ec4899", // strawberry pink
    rotation: -2.0,
    iconName: "coffee",
    description: "Infusions, coolers, spiced lattes, and comforting sips.",
    pinPosition: "top-center",
  },
  {
    id: "salads",
    name: "Salads",
    slug: "salads",
    color: "#d9f99d", // crisp spring lime/green
    magnetColor: "#06b6d4", // bright teal
    rotation: 1.6,
    iconName: "salad",
    description: "Fresh garden greens, tangy dressings, and crunchy nuts.",
    pinPosition: "top-left",
  },
  {
    id: "specials",
    name: "My Specials",
    slug: "specials",
    color: "#ddd6fe", // muted lavender
    magnetColor: "#dc2626", // bold scarlet
    rotation: -3.5,
    iconName: "sparkles",
    description: "Personal concoctions, late-night cravings, and family heirlooms.",
    pinPosition: "top-center",
  },
];
