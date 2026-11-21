export type NoteStyle = 'photo' | 'text';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Ingredient {
  item: string;
  amount: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: DifficultyLevel;
  style: NoteStyle;
  image?: string;
  paperColor?: string;
  magnetColor?: string;
  rotation?: number;
  ingredients: Ingredient[];
  instructions: string[];
  kitchenNotes: string[];
  variations?: string[];
  storageTips?: string;
  isSpecial?: boolean;
  isFavorite?: boolean;
  authorNote?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  magnetColor: string;
  rotation: number;
  iconName: string;
  description: string;
  pinPosition?: 'top-center' | 'top-left' | 'top-right';
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  subIntro: string;
  fridgeBadgeText: string;
  authorName: string;
  defaultAudioEnabled: boolean;
  colors: {
    fridgeCream: string;
    fridgeCreamLight: string;
    fridgeCreamDark: string;
    chromeAccent: string;
  };
}
