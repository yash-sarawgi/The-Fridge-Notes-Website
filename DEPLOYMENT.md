# 🚀 The Fridge Notes — Hosting & Deployment Guide

This guide walks you through deploying **The Fridge Notes** on **GitHub + Vercel + Supabase**, setting up the Postgres database with Row Level Security (RLS), and logging into the **Admin CMS & Visual Fridge Arranger**.

---

## 🏗️ Architecture Overview

- **Frontend & App Router**: Next.js 16 (React 19, Tailwind CSS)
- **Deployment Platform**: Vercel (Edge network, global CDN, instant CI/CD)
- **Code Repository**: GitHub
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **CMS & Arranger**: Dedicated backend dashboard at `/admin` with live visual note resizing and arrangement on the fridge door

---

## Step 1: Set Up Supabase (Database + Auth)

1. Go to [https://supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **New Project**:
   - **Name**: `the-fridge-notes`
   - **Database Password**: Choose a strong password and save it securely.
   - **Region**: Choose the region closest to you (e.g., `East US`, `Central Europe`, etc.).
3. Once the database is provisioned (approx. 1-2 minutes):

### A. Run Database Schema & Security Policies
- In the Supabase sidebar, click **SQL Editor** -> **New query**.
- Open the [`supabase/schema.sql`](file:///d:/Yash%20Sarawgi/MY%20PROJECTS/The%20Fridge%20Notes/supabase/schema.sql) file from this repository, copy its entire contents, paste it into the SQL Editor, and click **Run**.
- This sets up:
  - `categories` table with display order, custom positions (`x_pos`, `y_pos`, `scale`, `rotation`).
  - `recipes` table with JSONB ingredients, instructions, kitchen notes, variations, and image URLs.
  - `fridge_settings` table for badge text, tagline, quote notes, and sound defaults.
  - Performance indexes and automated `updated_at` timestamps.
  - **Row Level Security (RLS)**: Public read access for visitors, strict authenticated-only access for inserts, updates, and deletes.

### B. Seed Initial Categories & 28 Recipes
- In the SQL Editor, click **New query**.
- Open the [`supabase/seed.sql`](file:///d:/Yash%20Sarawgi/MY%20PROJECTS/The%20Fridge%20Notes/supabase/seed.sql) file from this repository, copy its entire contents, paste it into the editor, and click **Run**.
- All 9 categories and 28 recipes will be inserted immediately.

### C. Create Your Admin User
- In the Supabase sidebar, click **Authentication** -> **Users**.
- Click **Add user** -> **Create user**.
- Enter your admin email (e.g., `admin@thefridgenotes.com`) and choose a secure password.
- Toggle **Auto Confirm User?** to `ON` (so you can log in immediately without email confirmation).
- Click **Create user**.

### D. Copy Your API Keys
- In the Supabase sidebar, go to **Project Settings** (gear icon) -> **API**.
- Copy:
  1. **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
  2. **Project API Keys** -> `anon` `public` key (e.g., `eyJhbGciOi...`)

---

## Step 2: Push Your Code to GitHub

1. In your project directory:
   ```bash
   git add .
   git commit -m "Add Supabase fullstack integration, Admin CMS, and Visual Fridge Arranger"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g. `the-fridge-notes`).
3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/the-fridge-notes.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository **`the-fridge-notes`** and click **Import**.
4. In the **Configure Project** screen:
   - Framework Preset: `Next.js` (detected automatically)
   - Root Directory: `./`
5. Expand the **Environment Variables** section and add:
   | Key | Value | Description |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Your Supabase Anon Public Key |
6. Click **Deploy**.
7. In ~60 seconds, Vercel will build and deploy your application to a production URL (e.g., `https://the-fridge-notes.vercel.app`).

---

## Step 4: Using the Admin CMS & Visual Fridge Arranger

1. Visit your live site or local server: `http://localhost:3000` (or `https://your-domain.vercel.app`).
2. Click the **Admin CMS** button on the Kitchen Whiteboard, or navigate directly to `/admin`.
3. Sign in using the Admin email and password created in Step 1C.
4. Explore the 4 Management Tabs:
   - **Visual Fridge Arranger**:
     - Click and drag any category sticky note directly on the fridge door canvas.
     - Use the sliders on the right to resize notes (scale 70% to 135%), tilt/rotate (-15° to +15°), or pick paper and magnet colors.
     - Notes are automatically constrained within the physical fridge door boundaries (`34.4%` to `67.7%`).
     - Click **Save Fridge Layout** to instantly save positions to Supabase.
   - **Recipes CMS**:
     - Search and filter all recipes.
     - Click **Add New Recipe** to open the modal with title, slug, ingredients dynamic builder, step-by-step instructions builder, tags, cooking times, and image preview.
     - Edit or delete recipes with instant database synchronization.
   - **Categories CMS**:
     - Add or modify categories, change their color themes, icons, and descriptions.
   - **Fridge Texts & Settings**:
     - Customize the 3D Smeg fridge chrome badge text, top quote tagline, butter reminder, mood note, and default audio settings.

---

## 🔒 Security Best Practices Implemented

- **Row Level Security (RLS)**: Enforced directly at the PostgreSQL layer. Anonymous visitors have read-only access to published recipes and categories. Write, update, and delete permissions require a verified Supabase Auth JWT token.
- **Fail-Safe Offline Mode**: If environment variables are not yet provided during initial local development, the application gracefully falls back to local data and `localStorage` so you are never blocked.
- **No Service Role Keys in Frontend**: Only public `anon` keys are exposed to the browser.
