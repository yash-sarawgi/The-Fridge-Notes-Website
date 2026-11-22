-- ==============================================================
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
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('sandwiches', 'Sandwiches', 'sandwiches', '#fed7aa', '#ef4444', -2.5, 'sandwich', 'Toasted, grilled, and layered between crisp artisan bread.', 'top-center', 0)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('soups', 'Soups', 'soups', '#fef08a', '#0284c7', 1.8, 'soup', 'Warm, simmering comfort in a bowl for rainy afternoons.', 'top-left', 1)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('desserts', 'Desserts', 'desserts', '#fbcfe8', '#eab308', -3.2, 'cake', 'Sweet bites, baked treats, and nostalgic puddings.', 'top-right', 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('snacks', 'Snacks', 'snacks', '#bbf7d0', '#8b5cf6', 2.2, 'cookie', 'Quick cravings, crunchy bites, and finger food.', 'top-center', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('main-course', 'Main Course', 'main-course', '#fed7aa', '#10b981', -1.5, 'utensils', 'Hearty dinners and comforting weekend centrepieces.', 'top-left', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('breakfast', 'Breakfast', 'breakfast', '#fef9c3', '#f97316', 2.8, 'egg', 'Lazy Sunday mornings, hot griddles, and fresh coffee.', 'top-right', 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('beverages', 'Beverages', 'beverages', '#bae6fd', '#ec4899', -2, 'coffee', 'Infusions, coolers, spiced lattes, and comforting sips.', 'top-center', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('salads', 'Salads', 'salads', '#d9f99d', '#06b6d4', 1.6, 'salad', 'Fresh garden greens, tangy dressings, and crunchy nuts.', 'top-left', 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;
INSERT INTO public.categories (id, name, slug, color, magnet_color, rotation, icon_name, description, pin_position, display_order)
VALUES ('specials', 'My Specials', 'specials', '#ddd6fe', '#dc2626', -3.5, 'sparkles', 'Personal concoctions, late-night cravings, and family heirlooms.', 'top-center', 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  magnet_color = EXCLUDED.magnet_color;

-- 3. Insert Recipes
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'sand-1',
  'grilled-peri-peri-paneer-sandwich',
  'Grilled Peri Peri Paneer Sandwich',
  'sandwiches',
  'Sandwiches',
  'Spicy marinated paneer slices with mint mayo, crisp bell peppers, and bubbling mozzarella in toasted sourdough.',
  '15 mins',
  '10 mins',
  '25 mins',
  2,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  '#fffbeb',
  '#ef4444',
  -2,
  true,
  true,
  'Best eaten fresh off the grill. You can prep the marinated paneer up to 24 hours in advance.',
  NULL,
  '[{"item":"Fresh Paneer (cut into rectangular slabs)","amount":"200g"},{"item":"Artisan sourdough or crusty sandwich bread","amount":"4 thick slices"},{"item":"Peri-peri seasoning spice mix","amount":"1.5 tbsp"},{"item":"Fresh garlic herb butter (softened)","amount":"2 tbsp"},{"item":"Mozzarella or sharp cheddar cheese","amount":"1/2 cup (shredded)"},{"item":"Red bell pepper & thinly sliced red onion","amount":"1/2 cup"},{"item":"Coriander-mint mayo spread","amount":"2 tbsp"},{"item":"Extra virgin olive oil","amount":"1 tsp"}]'::jsonb,
  '["Toss the paneer slabs with olive oil, peri-peri spice mix, and a pinch of sea salt. Let rest for 5 minutes.","Sear the paneer slices in a hot cast-iron skillet for 1.5 minutes per side until charred on the edges.","Spread mint mayo generously on the inside of the sourdough slices. Layer with the charred peri-peri paneer, sliced bell peppers, and pickled red onions.","Top with generous shredded mozzarella and close the sandwiches.","Spread garlic butter on the outside bread surfaces. Grill on medium-low heat until the crust is deep golden brown and the cheese oozes out."]'::jsonb,
  '["Use softened butter mixed with a pinch of garlic powder on the outer bread for that nostalgic cafe-style crunch.","Don''t slice the paneer too thick, otherwise the seasoning won''t penetrate to the core."]'::jsonb,
  '["Tofu Swap: Firm pressed tofu works identically for a vegan version.","Chilli Honey Drizzle: Add a small swirl of hot chilli honey right over the cheese before grilling."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'sand-2',
  'cheesy-corn-sandwich',
  'Cheesy Corn Sandwich',
  'sandwiches',
  'Sandwiches',
  'Sweet golden corn kernels folded into creamy béchamel-style cheese, green chillies, and oregano.',
  '10 mins',
  '8 mins',
  '18 mins',
  2,
  'Easy',
  'text',
  NULL,
  '#fef08a',
  '#0284c7',
  2.5,
  false,
  false,
  'Filling can be made a day prior and kept chilled in a sealed jar.',
  NULL,
  '[{"item":"Sweet corn kernels (steamed)","amount":"1 cup"},{"item":"White or brown sandwich bread","amount":"4 slices"},{"item":"Processed cheese or Colby Jack","amount":"3/4 cup (grated)"},{"item":"Finely chopped green capsicum","amount":"3 tbsp"},{"item":"Minced green chillies","amount":"1 tsp"},{"item":"Dried oregano & chilli flakes","amount":"1 tsp each"},{"item":"Salted butter for toasting","amount":"2 tbsp"},{"item":"Freshly cracked black pepper","amount":"1/2 tsp"}]'::jsonb,
  '["In a mixing bowl, combine steamed warm corn, grated cheese, chopped capsicum, green chillies, oregano, chilli flakes, and black pepper.","Divide the creamy corn mixture evenly between two slices of bread.","Cover with the remaining slices. Butter the top and bottom of each sandwich generously.","Toast in a preheated sandwich press or stovetop skillet until the bread is crisp and golden and the cheese melts completely into the corn.","Slice diagonally and serve immediately with tomato ketchup."]'::jsonb,
  '["Make sure the boiled corn is well-drained and patted dry so the sandwich doesn''t become soggy.","A pinch of roasted cumin powder gives this an irresistible street-style twist."]'::jsonb,
  '["Add finely diced jalapeños for an extra kick."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'sand-3',
  'mexican-focaccia-sandwich',
  'Mexican Sandwich',
  'sandwiches',
  'Sandwiches',
  'Rosemary focaccia stuffed with black beans, pickled jalapeños, avocado crema, crunchy slaw, and pepper jack.',
  '20 mins',
  '7 mins',
  '27 mins',
  2,
  'Medium',
  'photo',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
  '#fed7aa',
  '#10b981',
  -1.8,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Rosemary olive oil focaccia (sliced horizontally)","amount":"2 squares"},{"item":"Seasoned Mexican refried black beans","amount":"1/2 cup"},{"item":"Ripe avocado (mashed with lime and cilantro)","amount":"1 large"},{"item":"Pepper jack cheese slices","amount":"4 slices"},{"item":"Pickled jalapeño rounds","amount":"2 tbsp"},{"item":"Cabbage and cilantro slaw","amount":"1/2 cup"},{"item":"Chipotle crema","amount":"2 tbsp"}]'::jsonb,
  '["Lightly toast the cut sides of the focaccia bread on a griddle.","Spread the bottom half with warm seasoned black beans and top with pepper jack cheese.","Place under a broiler for 2 minutes until the pepper jack is melted and bubbling.","Top with the avocado mash, pickled jalapeños, crispy cabbage slaw, and a generous drizzle of smoky chipotle crema.","Close with the top bun, slice in half, and enjoy warm."]'::jsonb,
  '["Warm the black beans with a dash of smoked paprika and lime juice before spreading."]'::jsonb,
  '["Add grilled sweet corn relish for extra texture."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'sand-4',
  'homemade-club-sandwich',
  'Homemade Club Sandwich',
  'sandwiches',
  'Sandwiches',
  'The classic triple-decker with crisp heirloom lettuce, juicy vine tomatoes, house dressing, and golden toasted bread.',
  '15 mins',
  '5 mins',
  '20 mins',
  2,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=80',
  '#fff7ed',
  '#eab308',
  1.5,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"White farmhouse bread","amount":"6 slices"},{"item":"Heirloom tomato slices","amount":"2 medium"},{"item":"Crisp butterhead lettuce leaves","amount":"4 leaves"},{"item":"Sharp cheddar cheese slices","amount":"4 slices"},{"item":"Dijon mustard & homemade mayonnaise","amount":"2 tbsp each"},{"item":"Thinly sliced cucumber & pickles","amount":"1/2 cup"}]'::jsonb,
  '["Toast all 6 slices of bread to a light golden brown.","Mix mayonnaise and Dijon mustard; spread over one side of each toasted slice.","On the first slice, layer lettuce, tomato slices seasoned with salt, and cheese.","Add the second toasted slice (mayo side down), then spread mayo on top.","Layer with cucumbers, pickles, and another slice of cheese.","Top with the third slice, secure with wooden sandwich picks, and slice diagonally into triangles."]'::jsonb,
  '["Salt the tomato slices on paper towels 5 minutes before assembling to avoid soggy layers."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'soup-1',
  'roasted-tomato-basil-soup',
  'Roasted Tomato & Basil Soup',
  'soups',
  'Soups',
  'Slow-roasted Roma tomatoes and whole garlic cloves blended with sweet basil and a splash of heavy cream.',
  '15 mins',
  '35 mins',
  '50 mins',
  4,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  '#fef08a',
  '#dc2626',
  -2.8,
  false,
  true,
  'Keeps refrigerated for up to 4 days or frozen for 3 months.',
  NULL,
  '[{"item":"Ripe Roma tomatoes (halved)","amount":"1 kg"},{"item":"Whole head of garlic (top sliced off)","amount":"1 head"},{"item":"Yellow onion (roughly sliced)","amount":"1 large"},{"item":"Fresh sweet basil leaves","amount":"1 packed cup"},{"item":"Vegetable broth","amount":"2 cups"},{"item":"Heavy cream or coconut cream","amount":"1/3 cup"},{"item":"Extra virgin olive oil","amount":"3 tbsp"},{"item":"Balsamic glaze or vinegar","amount":"1 tsp"}]'::jsonb,
  '["Preheat oven to 200°C (400°F). Arrange tomatoes, onions, and the garlic bulb cut-side up on a rimmed baking sheet.","Drizzle liberally with olive oil, salt, and freshly cracked black pepper.","Roast for 35 minutes until the tomato skins are blistered and charred in spots.","Squeeze roasted garlic cloves into a soup pot with the roasted tomatoes and onions. Add vegetable broth and simmer for 10 minutes.","Toss in fresh basil and blend with an immersion blender until velvety smooth.","Stir in heavy cream and balsamic glaze. Taste and adjust salt."]'::jsonb,
  '["Roasting the garlic whole makes it sweet, nutty, and completely mellow.","Serve accompanied by miniature grilled cheese croutons!"]'::jsonb,
  '["Vegan: Substitute cashew cream or rich coconut milk."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'soup-2',
  'creamy-wild-mushroom-soup',
  'Creamy Wild Mushroom Soup',
  'soups',
  'Soups',
  'Caramelised cremini, shiitake, and thyme simmered in vegetable stock with a silky crème fraîche finish.',
  '15 mins',
  '25 mins',
  '40 mins',
  4,
  'Medium',
  'text',
  NULL,
  '#fef9c3',
  '#0284c7',
  1.8,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Assorted mushrooms (cremini, shiitake, oyster)","amount":"500g"},{"item":"French shallots (finely diced)","amount":"2"},{"item":"Garlic cloves (minced)","amount":"3"},{"item":"Fresh thyme sprigs","amount":"4"},{"item":"Dry white wine (or extra broth with splash of lemon)","amount":"1/3 cup"},{"item":"Vegetable stock","amount":"3 cups"},{"item":"Butter & olive oil","amount":"2 tbsp each"},{"item":"Heavy cream","amount":"1/2 cup"}]'::jsonb,
  '["Sauté sliced mushrooms in hot olive oil and butter in batches until deeply browned (do not crowd the pan). Set aside a handful for garnish.","Add diced shallots and garlic to the pot; cook until fragrant and translucent.","Deglaze the pan with white wine, scraping up the browned bits.","Pour in vegetable stock and thyme leaves. Simmer gently for 15 minutes.","Blend half the soup for silky body while leaving half textured.","Stir in cream, season with sea salt and cracked pepper, and top with reserved crispy mushrooms."]'::jsonb,
  '["Do NOT salt the mushrooms until they have browned; salt draws out moisture early and steams them instead of browning."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'soup-3',
  'spiced-pumpkin-coconut-soup',
  'Spiced Pumpkin & Coconut Soup',
  'soups',
  'Soups',
  'Roasted butternut squash, warming ginger, Thai red curry notes, and creamy coconut milk topped with toasted pepitas.',
  '15 mins',
  '30 mins',
  '45 mins',
  4,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80',
  '#fed7aa',
  '#f97316',
  -1.2,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Butternut squash or sugar pumpkin (cubed)","amount":"750g"},{"item":"Coconut milk (full fat)","amount":"1 can (400ml)"},{"item":"Thai red curry paste","amount":"1.5 tbsp"},{"item":"Fresh ginger (grated)","amount":"1 tbsp"},{"item":"Vegetable broth","amount":"2 cups"},{"item":"Maple syrup","amount":"1 tbsp"},{"item":"Toasted pumpkin seeds (pepitas)","amount":"2 tbsp"}]'::jsonb,
  '["Roast squash cubes at 200°C for 25 minutes until caramelized and tender.","In a pot, warm 2 tablespoons of coconut milk and sizzle the red curry paste and ginger until fragrant.","Add roasted squash and vegetable broth. Simmer for 10 minutes.","Puree until silky smooth with remaining coconut milk and maple syrup.","Ladle into bowls, swirl with extra coconut cream, and scatter crunchy toasted pepitas."]'::jsonb,
  '["A squeeze of fresh lime juice right at the end cuts the sweetness of the pumpkin and makes the flavor sing."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'des-1',
  'fudgy-espresso-brownies',
  'Fudgy Espresso Brownies',
  'desserts',
  'Desserts',
  'Decadent dark chocolate brownies with crackly shiny tops, infused with espresso and sprinkled with flaky Maldon salt.',
  '20 mins',
  '26 mins',
  '46 mins',
  12,
  'Medium',
  'photo',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  '#fbcfe8',
  '#8b5cf6',
  -2.2,
  true,
  true,
  NULL,
  NULL,
  '[{"item":"70% dark bittersweet chocolate (chopped)","amount":"200g"},{"item":"Unsalted European butter","amount":"150g"},{"item":"Fine espresso powder","amount":"1.5 tbsp"},{"item":"Granulated cane sugar","amount":"1 cup"},{"item":"Light brown sugar","amount":"1/2 cup"},{"item":"Large eggs (room temperature)","amount":"3"},{"item":"Dutch-process cocoa powder","amount":"1/3 cup"},{"item":"All-purpose flour","amount":"1/2 cup"},{"item":"Flaky sea salt (Maldon)","amount":"1 tsp"}]'::jsonb,
  '["Melt dark chocolate, butter, and espresso powder together in a heatproof bowl set over simmering water. Let cool slightly.","In a stand mixer or bowl, whip eggs and both sugars on high for 5-7 minutes until pale, thick, and doubled in volume (this creates the paper-thin shiny crust!).","Gently fold the melted chocolate mixture into the whipped eggs.","Sift in cocoa powder and flour, folding just until no streaks remain.","Pour into an 8x8 inch parchment-lined baking pan. Bake at 175°C (350°F) for 24-26 minutes.","Sprinkle immediately with flaky sea salt. Allow to cool completely before slicing into squares."]'::jsonb,
  '["The secret to the crinkly brownie top is beating the eggs with the sugar until completely ribboned and dissolved.","Chill in the fridge for 2 hours before cutting with a hot chef''s knife for clean bakery edges."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'des-2',
  'grandmas-spiced-apple-crisp',
  'Grandma''s Spiced Apple Crisp',
  'desserts',
  'Desserts',
  'Tender cinnamon-kissed Honeycrisp apples baked under a golden brown buttery rolled-oat crumble.',
  '20 mins',
  '40 mins',
  '60 mins',
  6,
  'Easy',
  'text',
  NULL,
  '#fef08a',
  '#ef4444',
  1.5,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Honeycrisp or Granny Smith apples (peeled & sliced)","amount":"6 large"},{"item":"Cinnamon & fresh nutmeg","amount":"1.5 tsp"},{"item":"Lemon juice","amount":"1 tbsp"},{"item":"Old-fashioned rolled oats","amount":"1 cup"},{"item":"All-purpose flour","amount":"1/2 cup"},{"item":"Dark brown sugar","amount":"1/2 cup"},{"item":"Cold unsalted butter (cubed)","amount":"100g"},{"item":"Pecan pieces","amount":"1/3 cup"}]'::jsonb,
  '["Toss sliced apples with lemon juice, 1 tsp cinnamon, nutmeg, and 1 tbsp brown sugar. Place into a baking dish.","In a bowl, combine rolled oats, flour, remaining brown sugar, and pecans.","Work cold butter into the oat mixture using your fingertips until clumpy crumbs form.","Scatter crumble topping generously over the apples.","Bake at 180°C (350°F) for 35-40 minutes until fruit is bubbly and topping is crisp and toasted.","Serve warm with a scoop of vanilla bean ice cream."]'::jsonb,
  '["Use a blend of sweet Honeycrisp and tart Granny Smith for balanced flavour."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'des-3',
  'lemon-posset-with-shortbread',
  'Lemon Posset with Shortbread',
  'desserts',
  'Desserts',
  'An unbelievable 3-ingredient British classic: heavy cream, sugar, and lemon juice magic into silky custard.',
  '10 mins',
  '5 mins',
  '15 mins (+ chill)',
  4,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  '#fef9c3',
  '#06b6d4',
  -1.7,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Heavy whipping cream (double cream)","amount":"2 cups (480ml)"},{"item":"Granulated sugar","amount":"2/3 cup"},{"item":"Freshly squeezed lemon juice","amount":"1/3 cup (about 2 lemons)"},{"item":"Zest of organic lemons","amount":"1 tbsp"},{"item":"Raspberries or mint for serving","amount":"A few"}]'::jsonb,
  '["Heat cream, sugar, and lemon zest in a saucepan over medium heat, stirring until sugar dissolves.","Bring to a gentle boil and simmer for 3 minutes, stirring continuously.","Remove from heat and whisk in the fresh lemon juice (the acid will naturally set the cream).","Strain through a fine-mesh sieve and pour into small glasses or vintage teacups.","Chill in refrigerator for at least 4 hours until firmly set."]'::jsonb,
  '["No gelatin or cornstarch needed! The citric acid reacts with the milk fats to naturally create luscious custard."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'brk-1',
  'fluffy-buttermilk-pancakes',
  'Fluffy Buttermilk Pancakes',
  'breakfast',
  'Breakfast',
  'Cloud-soft diner-style pancakes with golden griddled crusts, whipped salted butter, and warm maple syrup.',
  '10 mins',
  '15 mins',
  '25 mins',
  4,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
  '#fef9c3',
  '#f97316',
  2.2,
  false,
  true,
  NULL,
  NULL,
  '[{"item":"All-purpose flour","amount":"2 cups"},{"item":"Baking powder","amount":"2 tsp"},{"item":"Baking soda","amount":"1 tsp"},{"item":"Sugar","amount":"2 tbsp"},{"item":"Fine sea salt","amount":"1/2 tsp"},{"item":"Cultured buttermilk","amount":"2 cups"},{"item":"Large eggs (separated)","amount":"2"},{"item":"Melted butter","amount":"4 tbsp"}]'::jsonb,
  '["Whisk dry ingredients together in a large bowl.","In a separate bowl, whisk buttermilk, egg yolks, and melted butter.","Whip egg whites to soft peaks (this makes them ultra-fluffy!).","Stir wet ingredients into dry until just combined (lumps are totally okay, don''t overmix!). Gently fold in whipped egg whites.","Ladle 1/3 cup batter onto a buttered hot griddle. Flip when bubbles form and edges look matte.","Stack high with a square of salted butter and warm maple syrup."]'::jsonb,
  '["Separating the eggs and whipping the whites takes 2 minutes but gives you Japanese soufflé-level cloudiness."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'brk-2',
  'shakshuka-with-feta',
  'Shakshuka with Crumbled Feta',
  'breakfast',
  'Breakfast',
  'Eggs gently poached in a spiced bell pepper and tomato ragù, crowned with salty feta and fresh herbs.',
  '15 mins',
  '20 mins',
  '35 mins',
  3,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80',
  '#fed7aa',
  '#dc2626',
  -1.9,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Olive oil","amount":"2 tbsp"},{"item":"Red bell pepper & yellow onion (thinly sliced)","amount":"1 each"},{"item":"Garlic cloves (minced)","amount":"3"},{"item":"Ground cumin, smoked paprika, coriander","amount":"1 tsp each"},{"item":"Crushed San Marzano tomatoes","amount":"1 can (400g)"},{"item":"Farm fresh eggs","amount":"4 to 5"},{"item":"Crumbled Greek feta cheese","amount":"1/2 cup"},{"item":"Fresh coriander and parsley","amount":"Handful"}]'::jsonb,
  '["Sauté onions and bell peppers in olive oil until soft and sweet (8 mins).","Add garlic, cumin, paprika, and coriander; cook for 1 minute until fragrant.","Pour in crushed tomatoes, season with salt, and simmer for 10 minutes until thick.","Use a spoon to create small wells in the sauce. Crack an egg into each well.","Cover the skillet and cook on low heat for 5-8 minutes until whites are set but yolks remain runny.","Scatter crumbled feta and fresh herbs on top. Serve with warm crusty bread."]'::jsonb,
  '["Covering the pan with a transparent glass lid lets you watch the yolk firmness without letting steam escape."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'brk-3',
  'avocado-poached-egg-toast',
  'Avocado & Poached Egg Toast',
  'breakfast',
  'Breakfast',
  'Thick sourdough, creamy lime avocado, jammy poached egg, microgreens, and everything bagel seasoning.',
  '10 mins',
  '6 mins',
  '16 mins',
  2,
  'Easy',
  'text',
  NULL,
  '#bbf7d0',
  '#10b981',
  2.1,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Country sourdough bread","amount":"2 thick slices"},{"item":"Ripe Hass avocados","amount":"2"},{"item":"Fresh lime juice","amount":"1 tbsp"},{"item":"Fresh organic eggs","amount":"2"},{"item":"Everything bagel seasoning","amount":"1 tbsp"},{"item":"Chilli flakes & microgreens","amount":"To garnish"}]'::jsonb,
  '["Toast sourdough until golden and crisp.","Mash avocados with lime juice, sea salt, and a dash of olive oil.","Poach eggs in simmering water with 1 tbsp vinegar for 3 minutes until whites are firm and yolk is runny.","Spread avocado over toast, crown with poached egg, and sprinkle bagel seasoning and microgreens."]'::jsonb,
  '["Using very fresh eggs is the only real trick to tidy poached eggs that don''t fray in the water."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'snk-1',
  'crispy-truffle-parmesan-fries',
  'Crispy Truffle Parmesan Fries',
  'snacks',
  'Snacks',
  'Double-cooked hand-cut Russet fries tossed with black truffle oil, aged Parmigiano-Reggiano, and fresh parsley.',
  '25 mins',
  '15 mins',
  '40 mins',
  3,
  'Medium',
  'photo',
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
  '#fef9c3',
  '#8b5cf6',
  -1.4,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Russet potatoes (cut into 1/4 inch sticks)","amount":"4 large"},{"item":"Black truffle oil","amount":"1.5 tbsp"},{"item":"Aged Parmigiano-Reggiano (finely microplaned)","amount":"1/2 cup"},{"item":"Fresh flat-leaf parsley (chopped)","amount":"2 tbsp"},{"item":"Flaky sea salt & black pepper","amount":"To taste"},{"item":"Oil for frying","amount":"4 cups"}]'::jsonb,
  '["Soak potato batons in ice water for 30 minutes to wash away surface starch, then dry thoroughly with a clean towel.","First fry: at 160°C (325°F) for 5-6 minutes until soft but not browned. Drain and cool.","Second fry: at 190°C (375°F) for 3-4 minutes until deeply golden and shattering crisp.","Immediately transfer to a bowl, drizzle with truffle oil, and toss with Parmesan, parsley, and flaky salt."]'::jsonb,
  '["Drying the soaked potatoes completely before dropping into hot oil is critical for supreme crunch and safety."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'snk-2',
  'stuffed-jalapeno-poppers',
  'Stuffed Jalapeño Poppers',
  'snacks',
  'Snacks',
  'Fresh halved jalapeños packed with cream cheese, sharp cheddar, scallions, and breaded in panko breadcrumbs.',
  '20 mins',
  '15 mins',
  '35 mins',
  4,
  'Easy',
  'text',
  NULL,
  '#bbf7d0',
  '#dc2626',
  2.7,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Fresh jalapeño peppers (halved and deseeded)","amount":"10"},{"item":"Cream cheese (softened)","amount":"200g"},{"item":"Sharp cheddar (shredded)","amount":"1 cup"},{"item":"Garlic powder & smoked paprika","amount":"1/2 tsp each"},{"item":"Japanese panko breadcrumbs","amount":"1 cup"},{"item":"Eggs & flour for dredging","amount":"Standard setup"}]'::jsonb,
  '["Combine cream cheese, cheddar, garlic powder, paprika, and minced scallions.","Stuff each jalapeño cavity with the cheese filling.","Dip in flour, beaten egg, then roll into crunchy panko crumbs.","Bake at 200°C for 18 minutes or air-fry for 12 minutes until crunchy and molten."]'::jsonb,
  '["Wear gloves when cutting the peppers so you don''t accidentally rub your eyes later!"]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'snk-3',
  'garlic-parmesan-knots',
  'Garlic Parmesan Knots',
  'snacks',
  'Snacks',
  'Tied pizza dough knots baked golden, then brushed generously with hot roasted garlic butter and herbs.',
  '15 mins',
  '12 mins',
  '27 mins',
  4,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
  '#fff7ed',
  '#eab308',
  -2.3,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Fresh pizza dough","amount":"450g (1 lb)"},{"item":"Unsalted butter (melted)","amount":"4 tbsp"},{"item":"Fresh garlic (grated or pressed)","amount":"4 cloves"},{"item":"Parmesan cheese (grated)","amount":"1/3 cup"},{"item":"Dried oregano & fresh parsley","amount":"1 tbsp"},{"item":"Warm marinara sauce for dipping","amount":"1 cup"}]'::jsonb,
  '["Roll dough into ropes and tie into loose knots. Place on a baking sheet.","Bake at 200°C (400°F) for 12-14 minutes until puffy and golden.","Simmer butter and grated garlic for 2 minutes to take the raw bite off the garlic.","Toss hot baked knots directly into the garlic butter, parmesan, and herbs.","Serve hot with warm marinara dipping sauce."]'::jsonb,
  '["Gently heating the garlic in butter first prevents that bitter raw garlic punch."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'main-1',
  'rich-butter-paneer',
  'Rich Butter Paneer',
  'main-course',
  'Main Course',
  'Succulent cottage cheese cubes simmered in a velvety, buttery tomato cashew gravy perfumed with kasuri methi.',
  '20 mins',
  '25 mins',
  '45 mins',
  4,
  'Medium',
  'photo',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  '#fed7aa',
  '#ef4444',
  1.6,
  true,
  false,
  NULL,
  NULL,
  '[{"item":"Soft malai paneer (cubed)","amount":"300g"},{"item":"Ripe plum tomatoes (blanched & pureed)","amount":"5 large"},{"item":"Raw cashews (soaked in warm water)","amount":"15-18 pieces"},{"item":"Ginger-garlic paste","amount":"1.5 tbsp"},{"item":"Kashmiri red chilli powder","amount":"1.5 tsp"},{"item":"Garam masala & crushed kasuri methi","amount":"1 tsp each"},{"item":"Salted butter & fresh cream","amount":"3 tbsp + 2 tbsp"},{"item":"Honey or sugar","amount":"1/2 tsp"}]'::jsonb,
  '["Blend soaked cashews with 3 tbsp water into a silk-smooth paste.","Melt 2 tbsp butter in a heavy kadai. Add ginger-garlic paste and Kashmiri chilli powder; cook for 1 minute.","Pour in tomato puree and simmer until the butter begins to separate on the edges.","Stir in cashew paste and 1/2 cup warm water. Simmer on low for 8 minutes until glossy.","Add soft paneer cubes, crushed roasted kasuri methi, garam masala, and honey.","Finish with fresh cream and remaining butter. Rest for 5 minutes before serving with garlic naan."]'::jsonb,
  '["Lightly toast the dried fenugreek leaves (kasuri methi) in a dry pan for 10 seconds before crushing between your palms for maximum restaurant aroma."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'main-2',
  'creamy-tuscan-garlic-pasta',
  'Creamy Tuscan Garlic Pasta',
  'main-course',
  'Main Course',
  'Fettuccine swirled in sun-dried tomato cream sauce, baby spinach, toasted pine nuts, and freshly grated Pecorino.',
  '15 mins',
  '15 mins',
  '30 mins',
  4,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80',
  '#fef9c3',
  '#0284c7',
  -2.1,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Fettuccine or tagliatelle pasta","amount":"350g"},{"item":"Sun-dried tomatoes in oil (sliced)","amount":"1/2 cup"},{"item":"Baby spinach","amount":"3 packed cups"},{"item":"Garlic (thinly sliced)","amount":"4 cloves"},{"item":"Heavy cream","amount":"1 cup"},{"item":"Vegetable broth or pasta water","amount":"1/2 cup"},{"item":"Pecorino Romano or Parmesan (grated)","amount":"3/4 cup"}]'::jsonb,
  '["Boil pasta in generously salted water until al dente.","Heat 1 tbsp oil from the sun-dried tomato jar. Sauté sliced garlic until fragrant (do not burn).","Add sun-dried tomatoes, cream, and broth; bring to a gentle bubble.","Fold in baby spinach until wilted, then toss in hot drained pasta and grated cheese.","Toss vigorously until the sauce clings to every strand."]'::jsonb,
  '["The oil in the sun-dried tomato jar is liquid gold infused with herbs—use it to start the sauce!"]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'main-3',
  'wild-mushroom-risotto',
  'Wild Mushroom Risotto',
  'main-course',
  'Main Course',
  'Arborio rice slowly cooked in rich simmering vegetable broth with porcini, white wine, and butter.',
  '15 mins',
  '28 mins',
  '43 mins',
  4,
  'Medium',
  'text',
  NULL,
  '#fed7aa',
  '#10b981',
  1.9,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Arborio or Carnaroli rice","amount":"1.5 cups"},{"item":"Dried porcini mushrooms (soaked in 1 cup warm water)","amount":"20g"},{"item":"Fresh cremini & king oyster mushrooms","amount":"300g"},{"item":"Vegetable broth (warm)","amount":"4.5 cups"},{"item":"Shallots & garlic","amount":"2 shallots, 2 cloves"},{"item":"Dry white wine","amount":"1/2 cup"},{"item":"Cold unsalted butter & Parmesan","amount":"3 tbsp + 1/2 cup"}]'::jsonb,
  '["Strain soaked porcini mushrooms, reserving the dark soaking liquor. Sauté fresh and rehydrated mushrooms in butter.","In a wide pot, sweat shallots in olive oil. Add arborio rice and toast for 2 minutes until translucent on edges.","Pour in white wine and stir until absorbed.","Add warm broth ladle by ladle, stirring frequently, allowing liquid to absorb before adding more.","Once rice is tender with a slight bite (al dente), take off heat. Vigorously beat in cold butter and Parmesan."]'::jsonb,
  '["Vigorously beating cold butter into the hot risotto off the heat creates the famous Italian ''all''onda'' wave texture."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'bev-1',
  'iced-cardamom-chai-latte',
  'Iced Cardamom Chai Latte',
  'beverages',
  'Beverages',
  'Slow-brewed Assam black tea infused with cracked green cardamom pods, cinnamon, and frothy oat milk over ice.',
  '5 mins',
  '10 mins',
  '15 mins',
  2,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  '#bae6fd',
  '#ec4899',
  -1.7,
  false,
  true,
  NULL,
  NULL,
  '[{"item":"Strong Assam black CTC tea leaves","amount":"2.5 tbsp"},{"item":"Green cardamom pods (lightly cracked)","amount":"6 pods"},{"item":"Cinnamon stick","amount":"1 small"},{"item":"Fresh ginger (crushed)","amount":"1 inch piece"},{"item":"Water","amount":"1.5 cups"},{"item":"Brown sugar or jaggery","amount":"2 tbsp"},{"item":"Creamy oat milk or whole milk (frothed)","amount":"1.5 cups"},{"item":"Ice cubes","amount":"Generous"}]'::jsonb,
  '["Boil water with cracked cardamom, cinnamon, and ginger for 4 minutes to release spice oils.","Add Assam tea leaves and sugar; simmer gently for 3-4 minutes until deep amber.","Strain chai concentrate through a fine mesh strainer and chill for 10 minutes.","Fill two glasses with plenty of ice.","Pour tea concentrate halfway up, then top with cold frothy milk for a stunning gradient layer."]'::jsonb,
  '["Crack open the cardamom pods with a mortar and pestle just before brewing to capture the vibrant volatile oils."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'bev-2',
  'fresh-mint-lime-cooler',
  'Fresh Mint Lime Cooler',
  'beverages',
  'Beverages',
  'Crisp garden spearmint muddled with raw sugar, tart key limes, and fizzy sparkling soda.',
  '8 mins',
  '0 mins',
  '8 mins',
  2,
  'Easy',
  'text',
  NULL,
  '#d9f99d',
  '#0284c7',
  2.3,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Fresh garden mint leaves","amount":"1 cup"},{"item":"Juicy limes (juiced & sliced)","amount":"3"},{"item":"Turbinado sugar or simple syrup","amount":"2 tbsp"},{"item":"Black salt (kala namak) or pink salt","amount":"Pinch"},{"item":"Chilled sparkling mineral water","amount":"2 cups"},{"item":"Crushed ice","amount":"Plenty"}]'::jsonb,
  '["Muddle mint leaves, lime slices, and sugar in a cocktail shaker or pitcher.","Add fresh lime juice and a tiny pinch of black salt.","Pack tall glasses with crushed ice.","Strain muddled mixture into glasses and top with sparkling soda water.","Garnish with a slapped mint bouquet."]'::jsonb,
  '["A pinch of Indian black salt provides a refreshing mineral complexity that elevates this beyond an ordinary limeade."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'bev-3',
  'hot-spiced-apple-cider',
  'Hot Spiced Apple Cider',
  'beverages',
  'Beverages',
  'Pressed unfiltered apple cider mulled with orange rounds, whole cloves, star anise, and cinnamon quills.',
  '5 mins',
  '20 mins',
  '25 mins',
  4,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  '#fed7aa',
  '#f97316',
  -2,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Unfiltered honeycrisp apple cider","amount":"1 litre"},{"item":"Navel orange (sliced into rounds)","amount":"1"},{"item":"Cinnamon sticks","amount":"3"},{"item":"Whole cloves & star anise","amount":"8 cloves, 2 stars"},{"item":"Maple syrup","amount":"2 tbsp"}]'::jsonb,
  '["Combine all ingredients in a saucepan over medium-low heat.","Bring to a gentle simmer for 20 minutes (do not boil).","Ladle through a strainer into ceramic mugs.","Garnish with fresh cinnamon sticks and an orange slice."]'::jsonb,
  '["Your kitchen will smell like the holidays within 10 minutes of simmering this on the stove."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'sal-1',
  'mediterranean-quinoa-salad',
  'Mediterranean Quinoa Salad',
  'salads',
  'Salads',
  'Fluffy tri-color quinoa tossed with crisp Persian cucumbers, Kalamata olives, creamy feta, and lemon oregano vinaigrette.',
  '15 mins',
  '15 mins',
  '30 mins',
  4,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  '#d9f99d',
  '#06b6d4',
  1.4,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Tri-color quinoa (rinsed)","amount":"1 cup"},{"item":"Persian cucumbers (diced)","amount":"2"},{"item":"Cherry tomatoes (halved)","amount":"1 cup"},{"item":"Pitted Kalamata olives (sliced)","amount":"1/2 cup"},{"item":"Authentic block feta (crumbled)","amount":"100g"},{"item":"Fresh parsley & dill (chopped)","amount":"1/2 cup"},{"item":"Dressing: Olive oil, lemon juice, Dijon, oregano","amount":"1/3 cup"}]'::jsonb,
  '["Simmer quinoa in 1.75 cups water with a pinch of salt for 15 minutes. Fluff with a fork and cool.","Whisk olive oil, lemon juice, Dijon mustard, dried oregano, salt, and pepper in a small bowl.","In a wide salad bowl, combine cooled quinoa, cucumbers, tomatoes, olives, and herbs.","Pour dressing over and toss gently. Crown with crumbled feta before serving."]'::jsonb,
  '["This salad holds up incredibly well in the fridge for up to 3 days without getting soggy."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'sal-2',
  'crispy-halloumi-and-fig-salad',
  'Crispy Halloumi & Fig Salad',
  'salads',
  'Salads',
  'Seared golden halloumi cheese with ripe sweet figs, baby arugula, toasted walnuts, and a sticky balsamic reduction.',
  '10 mins',
  '6 mins',
  '16 mins',
  2,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  '#fbcfe8',
  '#ef4444',
  -2.6,
  true,
  false,
  NULL,
  NULL,
  '[{"item":"Cypriot Halloumi cheese (sliced 1/3 inch thick)","amount":"200g"},{"item":"Fresh black mission figs (quartered)","amount":"4 to 5"},{"item":"Baby arugula or rocket","amount":"4 packed cups"},{"item":"Toasted walnut halves","amount":"1/3 cup"},{"item":"Aged balsamic glaze & extra virgin olive oil","amount":"2 tbsp each"}]'::jsonb,
  '["Sear halloumi slices in a dry non-stick skillet over medium-high heat for 2-3 minutes per side until deeply golden and crisp.","Arrange baby arugula on a platter. Scatter sliced fresh figs and toasted walnuts.","Place warm seared halloumi right on top.","Drizzle with cold-pressed olive oil and aged balsamic glaze."]'::jsonb,
  '["Serve immediately while the halloumi is still warm, soft, and slightly squeaky inside."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'sal-3',
  'classic-caesar-salad',
  'Classic Caesar with Brioche Croutons',
  'salads',
  'Salads',
  'Crisp romaine hearts coated in homemade garlic parmesan dressing with buttery golden brioche croutons.',
  '15 mins',
  '10 mins',
  '25 mins',
  2,
  'Easy',
  'text',
  NULL,
  '#fef9c3',
  '#10b981',
  2,
  false,
  false,
  NULL,
  NULL,
  '[{"item":"Romaine lettuce hearts (chopped)","amount":"2 large heads"},{"item":"Brioche bread cubes","amount":"2 cups"},{"item":"Garlic clove, egg yolk, Dijon, lemon juice","amount":"Dressing base"},{"item":"Parmigiano-Reggiano shavings","amount":"1/2 cup"},{"item":"Olive oil & butter for croutons","amount":"2 tbsp"}]'::jsonb,
  '["Toss brioche cubes in melted butter and bake at 190°C until crunchy.","Whisk egg yolk, minced garlic, lemon juice, Dijon, and stream in olive oil until emulsified.","Toss crisp romaine with dressing, top with warm croutons and parmesan shavings."]'::jsonb,
  '["Wash and spin the romaine dry—water droplets will dilute the dressing and ruin the cling."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'spec-1',
  'the-midnight-grilled-cheese',
  'The Midnight Grilled Cheese',
  'specials',
  'My Specials',
  'Sourdough smeared with hot honey butter, three-cheese blend (gruyère, aged cheddar, gouda), and pickled jalapeños.',
  '5 mins',
  '8 mins',
  '13 mins',
  1,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  '#fed7aa',
  '#dc2626',
  -3,
  true,
  true,
  NULL,
  NULL,
  '[{"item":"Artisan sourdough bread","amount":"2 thick slices"},{"item":"Aged Gruyère (grated)","amount":"1/3 cup"},{"item":"Sharp white cheddar (grated)","amount":"1/3 cup"},{"item":"Smoked Gouda (grated)","amount":"1/3 cup"},{"item":"Hot honey (honey infused with habanero/chilli)","amount":"1 tbsp"},{"item":"Salted European butter & mayonnaise","amount":"1 tbsp each"}]'::jsonb,
  '["Spread mayonnaise thinly on the outer bread surfaces (mayo has a higher smoke point than butter for that golden glass-like crust!).","Layer the three cheeses evenly between the bread slices with a drizzle of hot honey in the center.","Cook low and slow in a skillet, weighted with a small plate, for 4 minutes per side until the cheese is completely molten.","Slice across and pull apart slowly to admire the legendary cheese pull."]'::jsonb,
  '["The combination of sharp cheddar for bite, gruyère for nuttiness, and gouda for meltability is unbeatable."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'spec-2',
  'moms-secret-saffron-kheer',
  'Mom''s Secret Saffron Kheer',
  'specials',
  'My Specials',
  'Slow-reduced creamy rice pudding infused with Kashmiri saffron strands, green cardamom, and slivered pistachios.',
  '15 mins',
  '45 mins',
  '60 mins',
  4,
  'Medium',
  'text',
  NULL,
  '#ddd6fe',
  '#eab308',
  2.2,
  true,
  false,
  NULL,
  NULL,
  '[{"item":"Basmati or Gobindobhog rice (soaked)","amount":"1/4 cup"},{"item":"Full cream buffalo/cow milk","amount":"1 litre"},{"item":"Pure Kashmiri saffron strands","amount":"15-20 strands"},{"item":"Cardamom pods (crushed)","amount":"4"},{"item":"Sweetened condensed milk or sugar","amount":"1/3 cup"},{"item":"Slivered pistachios and almonds","amount":"3 tbsp"}]'::jsonb,
  '["Coarsely crush the soaked rice with the back of a spoon.","Bring milk to a boil in a heavy-bottomed pot. Add the rice and saffron.","Simmer on lowest heat for 35-40 minutes, scraping the clotted cream from the sides back into the milk.","Once thick and luscious, stir in sugar/condensed milk and cardamom powder.","Chill thoroughly in the fridge before serving in clay bowls."]'::jsonb,
  '["Soaking saffron in 2 tablespoons of warm milk for 15 minutes before adding yields that glorious royal golden hue."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
INSERT INTO public.recipes (id, slug, title, category_id, category_name, description, prep_time, cook_time, total_time, servings, difficulty, style, image, paper_color, magnet_color, rotation, is_special, is_favorite, storage_tips, author_note, ingredients, instructions, kitchen_notes, variations)
VALUES (
  'spec-3',
  'chilli-crisp-scallion-noodles',
  'Chilli Crisp Scallion Noodles',
  'specials',
  'My Specials',
  'Chewy knife-cut noodles tossed in sizzling garlic scallion oil, homemade chilli crisp, Chinkiang black vinegar, and sesame.',
  '10 mins',
  '10 mins',
  '20 mins',
  2,
  'Easy',
  'photo',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  '#fff7ed',
  '#ef4444',
  -1.5,
  true,
  false,
  NULL,
  NULL,
  '[{"item":"Handmade or knife-cut wheat noodles","amount":"200g"},{"item":"Scallions (cut into 2-inch batons)","amount":"4 stalks"},{"item":"Garlic cloves (finely minced)","amount":"4"},{"item":"Crunchy chilli crisp oil","amount":"2 tbsp"},{"item":"Light soy sauce & dark soy sauce","amount":"1.5 tbsp + 1 tsp"},{"item":"Chinkiang black vinegar","amount":"1 tbsp"},{"item":"Toasted white sesame seeds","amount":"1 tsp"}]'::jsonb,
  '["Boil knife-cut noodles until chewy al dente. Drain and place in two bowls.","In a small pan, heat 3 tbsp oil and fry the scallion batons until golden brown and aromatic. Discard or keep scallions as garnish.","Pour the sizzling scallion oil directly over the garlic, chilli crisp, soy sauces, and black vinegar.","Toss the hot noodles with the sauce until every ribbon is coated in red savory gloss.","Top with sesame seeds and fresh scallions."]'::jsonb,
  '["The splash of Chinkiang black vinegar balances the heavy chilli oil with a mellow fruity acidity."]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions;
