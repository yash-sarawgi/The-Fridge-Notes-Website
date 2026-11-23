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
  scale?: number;
  xPos?: number;
  yPos?: number;
  ingredients: Ingredient[];
  instructions: string[];
  kitchenNotes: string[];
  variations?: string[];
  storageTips?: string;
  isSpecial?: boolean;
  isFavorite?: boolean;
  isHidden?: boolean;
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
  xPos?: number;
  yPos?: number;
  scale?: number;
  displayOrder?: number;
  isHidden?: boolean;
}

export interface FridgeTag {
  id: string;
  text: string;
  subText?: string;
  color?: string;
  magnetColor?: string;
  xPos: number;
  yPos: number;
  rotation?: number;
  scale?: number;
  isHidden?: boolean;
}

export interface FridgeSettings {
  id: string;
  badgeText: string;
  tagline: string;
  subIntro: string;
  butterNoteText: string;
  moodNoteText: string;
  defaultAudioEnabled: boolean;
  notesScale?: number;
  whiteboardPos?: { x: number; y: number; width?: number };
  introNotePos?: { x: number; y: number; scale?: number; rotation?: number };
  butterNotePos?: { x: number; y: number; scale?: number; rotation?: number };
  moodNotePos?: { x: number; y: number; scale?: number; rotation?: number };
  customTags?: FridgeTag[];
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
