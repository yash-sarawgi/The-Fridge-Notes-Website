const fs = require('fs');
const ts = require('typescript');

// Read files
const catFile = fs.readFileSync('src/data/categories.ts', 'utf8');
const recipeFile = fs.readFileSync('src/data/recipes.ts', 'utf8');

// Transpile with TypeScript to CJS
const transpileOptions = {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    removeComments: false
  }
};

const catJs = ts.transpileModule(catFile, transpileOptions).outputText;
const recipeJs = ts.transpileModule(recipeFile, transpileOptions).outputText;

// Evaluate in isolated context
const catModule = { exports: {} };
const catFn = new Function('module', 'exports', catJs);
catFn(catModule, catModule.exports);
const categories = catModule.exports.initialCategories || [];

const recipeModule = { exports: {} };
const recipeFn = new Function('module', 'exports', recipeJs);
recipeFn(recipeModule, recipeModule.exports);
const recipes = recipeModule.exports.initialRecipes || [];

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- ==============================================================
-- THE FRIDGE NOTES — SUPABASE INITIAL SEED DATA
-- Run this in your Supabase SQL Editor after running schema.sql
-- ==============================================================

-- 1. Insert Default Fridge Settings
INSERT INTO public.fridge_settings (id, badge_text, tagline, sub_intro, butter_note_text, mood_note_text, default_audio_enabled)
VALUES ('default', 'THE FRIDGE NOTES', 'A little taste of home.', 'Recipes, experiments and things worth making again.', 'Butter! 🧈', 'Good food = Good mood 🍓', false)
ON CONFLICT (id) DO UPDATE SET
  badge_text = EXCLUDED.badge_text,
  tagline = EXCLUDED.tagline,
  sub_intro = EXCLUDED.sub_intro;

-- 2. Insert Categories
`;

categories.forEach((c, idx) => {
  sql += `INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.color)}, ${escapeSql(c.magnetColor)}, ${c.rotation || 0}, ${escapeSql(c.iconName)}, ${escapeSql(c.description)}, ${escapeSql(c.pinPosition || 'top-center')}, ${idx})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;\n`;
});

sql += `\n-- 3. Insert Recipes\n`;

recipes.forEach((r) => {
  const ingJson = escapeSql(JSON.stringify(r.ingredients || []));
  const instJson = escapeSql(JSON.stringify(r.instructions || []));
  const notesJson = escapeSql(JSON.stringify(r.kitchenNotes || []));
  const varJson = escapeSql(JSON.stringify(r.variations || []));

  sql += `INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  ${escapeSql(r.id)},
  ${escapeSql(r.slug || r.id)},
  ${escapeSql(r.title)},
  ${escapeSql(r.categoryId)},
  ${escapeSql(r.categoryName)},
  ${escapeSql(r.description)},
  ${escapeSql(r.prepTime)},
  ${escapeSql(r.cookTime)},
  ${escapeSql(r.totalTime)},
  ${r.servings || 2},
  ${escapeSql(r.difficulty || 'Easy')},
  ${escapeSql(r.style || 'photo')},
  ${escapeSql(r.image || null)},
  ${escapeSql(r.paperColor || '#fef08a')},
  ${escapeSql(r.magnetColor || '#ef4444')},
  ${r.rotation || 0},
  ${r.isSpecial ? 'true' : 'false'},
  ${r.isFavorite ? 'true' : 'false'},
  ${escapeSql(r.storageTips || null)},
  ${escapeSql(r.authorNote || null)},
  ${ingJson}::jsonb,
  ${instJson}::jsonb,
  ${notesJson}::jsonb,
  ${varJson}::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;\n`;
});

fs.writeFileSync('supabase/seed.sql', sql);
console.log('Successfully generated supabase/seed.sql with', categories.length, 'categories and', recipes.length, 'recipes.');
