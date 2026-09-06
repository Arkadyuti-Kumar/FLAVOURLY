# Flavourly — AI-Powered Cookbook & Recipe Discovery

A premium, interactive recipe discovery app: pick a cuisine, search for a dish, watch the best-matched YouTube recipe video, and ask **Chef AI** for substitutions, spice adjustments, or servings scaling — all bound to whatever recipe you're currently viewing.

This build is a **working front-end demo** in a single React file (`Flavourly.jsx`), with realistic mock data standing in for the YouTube Data API and an LLM, so the entire app runs with zero API keys.

---

## Features

- **Landing page** — "What do you feel like cooking today?" hero with global search and a cuisine grid
- **10 cuisines** — Bengali, Italian, Chinese, Spanish, Indian, Japanese, Korean, Mexican, Thai, French (Bengali is the richest, with all 8 signature dishes: Chicken Biryani, Bengali Fried Rice, Kosha Mangsho, Shorshe Ilish, Luchi & Aloo Dum, Mishti Doi, Chingri Malai Curry, Dhokar Dalna)
- **Fuzzy recipe search** — matches variants like "Bengali Fried Rice," "Kolkata fried rice," "Calcutta fried rice" to the same dish
- **Recipe pages** — hero, ratings, prep/cook time, difficulty, spice level, a live servings stepper that rescales every ingredient, step-by-step instructions, and collapsible sections (tips, substitutions, vegetarian alternative, storage, regional variations) that only appear when there's real content
- **YouTube video matching** — a "best match" video plus alternatives per recipe, structured exactly like a real YouTube Data API response (channel, views, upload date, duration, relevance score)
- **Chef AI** — a floating glass chat panel that:
  - Is **recipe-aware**: "I don't have spring onions," "make this spicier," "how much for 6 people" (this one actually rescales the servings control)
  - Has a **discovery mode** when no recipe is open: "Chinese, vegetarian, under 30 minutes," "I have chicken, potatoes and onions — Bengali ideas?"
- **Design** — warm, restrained glassmorphism: cream/charcoal base, saffron-to-paprika accent, Fraunces serif + Manrope sans, fully responsive to mobile

---

## What's mocked (by design)

There are no real API calls yet, so the app runs with zero configuration:

| Feature | Currently | Where to swap in the real thing |
|---|---|---|
| YouTube videos | Deterministic mock data (`vid()` helper) | Replace with a server-side call to the YouTube Data API, keyed by `YOUTUBE_API_KEY` |
| Chef AI | Rule-based responses (`generateChefResponse()`) | Replace with a server-side LLM call (e.g. `OPENAI_API_KEY`), passing the current recipe as context |
| Data | In-memory `RECIPES` / `CUISINES` arrays | Replace with a database (Postgres/Supabase) |

Because the mock logic is isolated in its own functions, swapping in real APIs later shouldn't require touching the UI components.

---

## Running it locally

The file is plain React (JSX), so it needs a build tool — it will **not** run by opening it directly or serving it with a static file server like VS Code's Live Server.

**Fastest option (no install):** paste `Flavourly.jsx` into [CodeSandbox](https://codesandbox.io) or [StackBlitz](https://stackblitz.com) using their React template — you'll get a live preview and shareable URL immediately.

**Local setup with Vite:**

```bash
npm create vite@latest flavourly -- --template react
cd flavourly
npm install
npm install lucide-react
```

Then:
1. Replace the contents of `src/App.jsx` with the full contents of `Flavourly.jsx`.
2. Empty out `src/index.css` and `src/App.css` so Vite's default styles don't clash with Flavourly's own CSS.
3. Run the dev server:

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

---

## Deploying

Once `npm run build` works locally:

- **Netlify** — drag the generated `dist/` folder into [Netlify Drop](https://app.netlify.com/drop) for an instant URL, or connect the repo via GitHub for auto-deploys.
- **Vercel** — import the GitHub repo directly; it auto-detects a Vite/React project.

---

## Project structure (current single-file demo)

```
Flavourly.jsx        # Entire app: data, search, Chef AI logic, all page components, styles
```

A production version would typically split this into:

```
components/   Navbar, CuisineCard, RecipeCard, SearchBar, RecipeHero,
              IngredientList, InstructionSteps, ChefAI, VideoRecommendation
lib/          youtube.js, ai.js, recipes.js, search.js
data/         cuisines.js, recipes.js
```

---

## Tech stack

- React (JSX)
- [lucide-react](https://lucide.dev) for icons
- Plain CSS (custom properties + a scoped stylesheet) — no Tailwind/CSS framework dependency
