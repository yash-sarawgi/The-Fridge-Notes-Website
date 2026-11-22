-- ==============================================================
-- THE FRIDGE NOTES — SUPABASE PRODUCTION DATABASE SCHEMA
-- Row Level Security (RLS) + Automated Timestamps + Full Indexes
-- ==============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#fed7aa',
    magnet_color TEXT NOT NULL DEFAULT '#ef4444',
    rotation REAL DEFAULT 0,
    icon_name TEXT DEFAULT 'sparkles',
    description TEXT DEFAULT '',
    pin_position TEXT DEFAULT 'top-center',
    x_pos REAL DEFAULT NULL,
    y_pos REAL DEFAULT NULL,
    scale REAL DEFAULT 1,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Recipes Table
CREATE TABLE IF NOT EXISTS public.recipes (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL,
    description TEXT DEFAULT '',
    prep_time TEXT DEFAULT '15 mins',
    cook_time TEXT DEFAULT '15 mins',
    total_time TEXT DEFAULT '30 mins',
    servings INT DEFAULT 2,
    difficulty TEXT DEFAULT 'Easy',
    style TEXT DEFAULT 'photo',
    image TEXT DEFAULT NULL,
    paper_color TEXT DEFAULT '#fef08a',
    magnet_color TEXT DEFAULT '#ef4444',
    rotation REAL DEFAULT 0,
    scale REAL DEFAULT 1,
    x_pos REAL DEFAULT NULL,
    y_pos REAL DEFAULT NULL,
    ingredients JSONB DEFAULT '[]'::jsonb,
    instructions JSONB DEFAULT '[]'::jsonb,
    kitchen_notes JSONB DEFAULT '[]'::jsonb,
    variations JSONB DEFAULT '[]'::jsonb,
    storage_tips TEXT DEFAULT NULL,
    is_special BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    author_note TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Fridge Settings Table
CREATE TABLE IF NOT EXISTS public.fridge_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    badge_text TEXT NOT NULL DEFAULT 'THE FRIDGE NOTES',
    tagline TEXT NOT NULL DEFAULT 'A little taste of home.',
    sub_intro TEXT NOT NULL DEFAULT 'Recipes, experiments and things worth making again.',
    butter_note_text TEXT NOT NULL DEFAULT 'Butter! 🧈',
    mood_note_text TEXT NOT NULL DEFAULT 'Good food = Good mood 🍓',
    default_audio_enabled BOOLEAN DEFAULT FALSE,
    intro_note_pos JSONB DEFAULT '{"x": 48, "y": 35.2, "scale": 1, "rotation": -1}'::jsonb,
    butter_note_pos JSONB DEFAULT '{"x": 60.5, "y": 35.5, "scale": 1, "rotation": 3}'::jsonb,
    mood_note_pos JSONB DEFAULT '{"x": 60, "y": 84.5, "scale": 1, "rotation": 2}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Helpful Performance Indexes
CREATE INDEX IF NOT EXISTS idx_recipes_category_id ON public.recipes(category_id);
CREATE INDEX IF NOT EXISTS idx_recipes_is_favorite ON public.recipes(is_favorite);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- 6. Trigger for Auto-Updating updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_recipes_updated_at ON public.recipes;
CREATE TRIGGER trigger_recipes_updated_at
BEFORE UPDATE ON public.recipes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_fridge_settings_updated_at ON public.fridge_settings;
CREATE TRIGGER trigger_fridge_settings_updated_at
BEFORE UPDATE ON public.fridge_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES — VERY SECURE
-- Public users have READ ONLY access.
-- Only authenticated users (via Supabase Auth) can modify data.
-- ==============================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fridge_settings ENABLE ROW LEVEL SECURITY;

-- Categories RLS Policies
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories"
ON public.categories FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated Manage Categories" ON public.categories;
CREATE POLICY "Authenticated Manage Categories"
ON public.categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Recipes RLS Policies
DROP POLICY IF EXISTS "Public Read Recipes" ON public.recipes;
CREATE POLICY "Public Read Recipes"
ON public.recipes FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated Manage Recipes" ON public.recipes;
CREATE POLICY "Authenticated Manage Recipes"
ON public.recipes FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Fridge Settings RLS Policies
DROP POLICY IF EXISTS "Public Read Fridge Settings" ON public.fridge_settings;
CREATE POLICY "Public Read Fridge Settings"
ON public.fridge_settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated Manage Fridge Settings" ON public.fridge_settings;
CREATE POLICY "Authenticated Manage Fridge Settings"
ON public.fridge_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
