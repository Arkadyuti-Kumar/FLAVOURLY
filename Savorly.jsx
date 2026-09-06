import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Sparkles, ChefHat, Clock, Flame, Star, ArrowLeft, Users, Minus, Plus,
  PlayCircle, ExternalLink, ChevronDown, X, Send, TrendingUp, Utensils, Eye, Menu
} from "lucide-react";

/* ============================= DATA ============================= */

const CUISINES = [
  { id: "bengali", name: "Bengali", flag: "🐟", grad: ["#3F5C4E", "#7A9A6B"], tagline: "Mustard, hilsa, and the quiet poetry of a slow-cooked meal." },
  { id: "italian", name: "Italian", flag: "🍝", grad: ["#B5432A", "#E2963A"], tagline: "Simple ingredients, treated with total seriousness." },
  { id: "chinese", name: "Chinese", flag: "🥢", grad: ["#A6303E", "#E2963A"], tagline: "Wok heat, balance, and centuries of technique." },
  { id: "spanish", name: "Spanish", flag: "🥘", grad: ["#C1440E", "#E8A33D"], tagline: "Saffron, seafood, and unhurried afternoons." },
  { id: "indian", name: "Indian", flag: "🇮🇳", grad: ["#8C3B2E", "#D9822B"], tagline: "A spice cabinet's worth of regional traditions." },
  { id: "japanese", name: "Japanese", flag: "🍣", grad: ["#2E4A4A", "#6B8F8F"], tagline: "Precision and restraint, in every bowl." },
  { id: "korean", name: "Korean", flag: "🥢", grad: ["#8C2F39", "#D9635B"], tagline: "Ferment, char, and bold contrast." },
  { id: "mexican", name: "Mexican", flag: "🌮", grad: ["#B23A2E", "#E2963A"], tagline: "Char, lime, and chili in every direction." },
  { id: "thai", name: "Thai", flag: "🌶️", grad: ["#3F6B4E", "#8FAE6B"], tagline: "Sweet, sour, salty, spicy — all at once." },
  { id: "french", name: "French", flag: "🥖", grad: ["#4A3B2E", "#8C7355"], tagline: "Technique as a form of hospitality." },
];

const GENERIC_SUBS = {
  "spring onion": "scallion greens, chives, or a thin slice of regular onion",
  "soy sauce": "a splash of Worcestershire sauce with a pinch of salt, or tamari if you need it gluten-free",
  "egg": "a spoon of chickpea flour batter mixed with a little water, or just leave it out",
  "green chili": "a pinch of black pepper or a dash of any hot sauce you have",
  "ginger": "a pinch of ground ginger powder — use about a third of the amount",
  "garlic": "garlic powder, about a quarter of the fresh amount",
  "mustard oil": "any neutral oil with a few mustard seeds tempered in it first",
  "coconut milk": "heavy cream thinned with a splash of water",
  "poppy seeds": "cashew paste or sesame seed paste, blended smooth",
  "yogurt": "a mix of milk and a squeeze of lemon, or sour cream",
  "fish sauce": "soy sauce mixed with a tiny pinch of salt",
  "tamarind": "a squeeze of lime with a pinch of brown sugar",
  "parmesan": "any hard, salty aged cheese you have on hand",
  "white wine": "a splash of stock with a squeeze of lemon",
};

// The recipe catalog does not store verified YouTube video IDs. A YouTube search is
// reliable across regions and avoids sending visitors to fabricated/deleted videos.
const vid = (title, channel, views, date, duration, relevance) => ({
  title,
  channel,
  views,
  date,
  duration,
  relevance,
  url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${channel}`)}`,
});

let uid = 0;
const ing = (name, amount, unit) => ({ id: `i${uid++}`, name, amount, unit });

const mkRecipe = (r) => ({
  baseServings: 4,
  spice: 1,
  rating: 4.5,
  popularity: 60,
  trending: false,
  tips: [],
  substitutions: {},
  vegetarianAlt: null,
  storage: null,
  regionalVariations: null,
  nutrition: null,
  aliases: [],
  dietaryTags: [],
  ...r,
});

const RECIPES = [
  mkRecipe({
    id: "bn-chicken-biryani", cuisine: "bengali", title: "Chicken Biryani",
    description: "Calcutta-style biryani — fragrant basmati, tender chicken, and the famous potato.",
    difficulty: "Medium", prepTime: 30, cookTime: 60, baseServings: 4, spice: 2, rating: 4.8, popularity: 96, trending: true,
    dietaryTags: ["non-veg", "chicken"],
    ingredients: [ing("basmati rice", 500, "g"), ing("chicken pieces", 800, "g"), ing("potatoes, halved", 2, ""), ing("yogurt", 200, "ml"), ing("fried onions", 100, "g"), ing("ghee", 60, "ml"), ing("biryani masala", 2, "tbsp"), ing("saffron strands", 1, "pinch"), ing("mace and cardamom", 4, ""), ing("mint leaves", 1, "cup")],
    instructions: [
      { title: "Marinate the chicken", description: "Coat the chicken in yogurt, biryani masala, and half the fried onions. Rest at least 1 hour." },
      { title: "Par-cook rice and potato", description: "Boil the rice until 70% done. Separately shallow-fry the potato halves until golden." },
      { title: "Layer the pot", description: "Layer marinated chicken, potato, rice, saffron milk, mint, and remaining fried onions in a heavy pot." },
      { title: "Dum cook", description: "Seal the lid tightly (a dough seal works well) and cook on low heat for 40–45 minutes." },
      { title: "Rest and serve", description: "Let it rest 10 minutes off heat before opening, then fluff gently and serve with raita." },
    ],
    tips: ["Soak the rice for 30 minutes before cooking for longer, fluffier grains.", "A true dum seal traps the steam — foil under a tight lid works if you don't want to make a dough seal."],
    substitutions: { "chicken pieces": "bone-in mutton, adding about 20 extra minutes of cook time", "potatoes, halved": "sweet potato for a different, slightly sweet note" },
    vegetarianAlt: "Swap the chicken for soy chunks or paneer and use a vegetable stock in place of any meat stock.",
    storage: "Refrigerate up to 3 days in an airtight container; reheat with a splash of water to loosen the rice.",
    regionalVariations: "Kolkata biryani is lighter and milder than Lucknowi or Hyderabadi styles, with potato as its defining touch.",
    youtubeVideos: [vid("Authentic Kolkata Chicken Biryani", "Bong Eats", "3.1M views", "2 years ago", "18:22", 97, "bn001"), vid("Easy Chicken Biryani at Home", "Rumki's Kitchen", "890K views", "1 year ago", "14:05", 88, "bn002"), vid("Restaurant-Style Biryani Secrets", "Cook With Rupa", "410K views", "8 months ago", "21:10", 81, "bn003")],
  }),
  mkRecipe({
    id: "bn-fried-rice", cuisine: "bengali", title: "Bengali Fried Rice",
    aliases: ["bengali fried rice", "bangali fried rice", "calcutta fried rice", "kolkata fried rice", "indian chinese fried rice"],
    description: "The Kolkata Chinese-inflected fried rice — light, buttery, and studded with egg and vegetables.",
    difficulty: "Easy", prepTime: 15, cookTime: 15, baseServings: 4, spice: 1, rating: 4.6, popularity: 90, trending: true,
    dietaryTags: ["vegetarian", "contains-egg", "quick"],
    ingredients: [ing("cooked basmati rice", 3, "cup"), ing("eggs", 2, ""), ing("carrot, diced", 1, ""), ing("beans, chopped", 10, ""), ing("spring onion", 4, "stalk"), ing("soy sauce", 2, "tbsp"), ing("garlic, minced", 3, "clove"), ing("ginger, minced", 1, "inch"), ing("green chili", 2, ""), ing("oil", 3, "tbsp")],
    instructions: [
      { title: "Prepare the rice", description: "Use day-old cooked rice, breaking up any clumps with your fingers so the grains stay separate." },
      { title: "Prepare the vegetables", description: "Dice the carrot and beans small, and slice the spring onion, keeping the greens separate for garnish." },
      { title: "Cook the eggs", description: "Scramble the eggs lightly in hot oil, then push to one side of the pan or remove and set aside." },
      { title: "Combine everything", description: "Stir-fry garlic, ginger, and chili, add the vegetables, then the rice, soy sauce, and egg. Toss on high heat for 2–3 minutes and finish with spring onion greens." },
    ],
    tips: ["Day-old rice is non-negotiable — fresh rice turns mushy when fried.", "Keep the flame high the whole way through for that wok-charred flavor."],
    substitutions: { "spring onion": GENERIC_SUBS["spring onion"], "soy sauce": GENERIC_SUBS["soy sauce"], "eggs": GENERIC_SUBS["egg"], "green chili": GENERIC_SUBS["green chili"] },
    vegetarianAlt: "Already vegetarian — leave out the egg entirely for a fully vegan version.",
    storage: "Best fresh, but keeps 1 day refrigerated. Reheat in a hot pan rather than a microwave to avoid sogginess.",
    youtubeVideos: [vid("Kolkata-Style Egg Fried Rice", "Bong Eats", "2.4M views", "3 years ago", "9:41", 96, "bn101"), vid("Indian-Chinese Fried Rice Secrets", "Chinese Bhandar", "1.1M views", "1 year ago", "11:20", 90, "bn102"), vid("Restaurant Style Fried Rice at Home", "Get Curried", "670K views", "6 months ago", "8:15", 84, "bn103")],
  }),
  mkRecipe({
    id: "bn-kosha-mangsho", cuisine: "bengali", title: "Kosha Mangsho",
    description: "A slow, dry-roasted mutton curry — dark, rich, and deeply spiced.",
    difficulty: "Hard", prepTime: 20, cookTime: 90, baseServings: 4, spice: 3, rating: 4.9, popularity: 84, trending: true,
    dietaryTags: ["non-veg", "mutton"],
    ingredients: [ing("mutton, bone-in", 800, "g"), ing("onions, sliced", 3, ""), ing("yogurt", 150, "ml"), ing("ginger-garlic paste", 3, "tbsp"), ing("mustard oil", 100, "ml"), ing("bay leaves", 2, ""), ing("garam masala", 1, "tbsp"), ing("red chili powder", 2, "tsp"), ing("potatoes, halved", 2, "")],
    instructions: [
      { title: "Marinate", description: "Marinate the mutton in yogurt, ginger-garlic paste, and a little mustard oil for at least 2 hours." },
      { title: "Brown the onions", description: "Fry sliced onions in mustard oil until deeply caramelized — this builds the base color and flavor." },
      { title: "Sear the mutton", description: "Add the marinated mutton and cook uncovered on high heat, stirring often, until it browns and the oil separates." },
      { title: "Slow cook", description: "Add water, bay leaves, and spices, then simmer covered on low heat for 60–75 minutes until fork-tender." },
      { title: "Reduce and finish", description: "Uncover and cook down until the gravy clings thickly to the meat." },
    ],
    tips: ["The long dry-frying stage is what gives kosha mangsho its signature dark color — don't rush it.", "Mustard oil should be heated until lightly smoking first to mellow its sharpness."],
    substitutions: { "mutton, bone-in": "goat or lamb shoulder work identically", "mustard oil": GENERIC_SUBS["mustard oil"] },
    vegetarianAlt: "Try the same masala base with jackfruit or mushrooms for a similarly hearty texture.",
    storage: "Tastes even better the next day — refrigerate up to 4 days.",
    youtubeVideos: [vid("Kosha Mangsho — Bengali Mutton Curry", "Bong Eats", "2.8M views", "2 years ago", "16:30", 95, "bn201"), vid("Dhaba Style Kosha Mangsho", "Rumki's Kitchen", "540K views", "1 year ago", "13:12", 85, "bn202")],
  }),
  mkRecipe({
    id: "bn-shorshe-ilish", cuisine: "bengali", title: "Shorshe Ilish",
    description: "Hilsa fish simmered in a pungent, silky mustard-seed sauce.",
    difficulty: "Medium", prepTime: 20, cookTime: 25, baseServings: 4, spice: 2, rating: 4.7, popularity: 79,
    dietaryTags: ["non-veg", "seafood"],
    ingredients: [ing("hilsa fish steaks", 6, ""), ing("mustard seeds", 4, "tbsp"), ing("mustard oil", 60, "ml"), ing("green chilies", 4, ""), ing("turmeric powder", 1, "tsp"), ing("nigella seeds", 1, "tsp")],
    instructions: [
      { title: "Make the mustard paste", description: "Soak mustard seeds, then blend with green chili and a little water into a smooth paste." },
      { title: "Marinate the fish", description: "Rub the hilsa steaks with turmeric and salt and let sit for 10 minutes." },
      { title: "Build the sauce", description: "Temper nigella seeds in mustard oil, then stir in the mustard paste and a splash of water." },
      { title: "Simmer gently", description: "Slide in the fish and simmer uncovered on low heat for 12–15 minutes without stirring roughly, to keep the pieces intact." },
    ],
    tips: ["Never over-blend the mustard paste with warm water — it turns bitter.", "Simmer, don't boil — hilsa is delicate and falls apart easily."],
    substitutions: { "hilsa fish steaks": GENERIC_SUBS["hilsa"] || "shad or salmon steaks", "mustard oil": GENERIC_SUBS["mustard oil"] },
    storage: "Best eaten fresh; the sauce can separate on reheating.",
    youtubeVideos: [vid("Shorshe Ilish — Classic Recipe", "Bong Eats", "1.9M views", "3 years ago", "12:48", 94, "bn301"), vid("Mustard Hilsa Curry", "Cook With Rupa", "310K views", "1 year ago", "10:05", 80, "bn302")],
  }),
  mkRecipe({
    id: "bn-luchi-aloo-dum", cuisine: "bengali", title: "Luchi & Aloo Dum",
    description: "Puffed fried bread served alongside a spiced, tangy potato curry.",
    difficulty: "Easy", prepTime: 20, cookTime: 25, baseServings: 4, spice: 2, rating: 4.5, popularity: 75,
    dietaryTags: ["vegetarian"],
    ingredients: [ing("all-purpose flour", 2, "cup"), ing("ghee", 2, "tbsp"), ing("baby potatoes", 500, "g"), ing("tomatoes", 2, ""), ing("panch phoron", 1, "tsp"), ing("ginger paste", 1, "tbsp"), ing("oil for frying", 500, "ml")],
    instructions: [
      { title: "Make the dough", description: "Knead flour, ghee, and a pinch of salt with water into a firm dough. Rest 15 minutes." },
      { title: "Prepare the potatoes", description: "Boil the baby potatoes, peel, and lightly crush a few for texture." },
      { title: "Cook the curry", description: "Temper panch phoron in oil, add ginger paste and tomatoes, then the potatoes with water and simmer 10 minutes." },
      { title: "Fry the luchi", description: "Roll small dough balls into discs and deep-fry in hot oil until puffed and golden." },
    ],
    tips: ["Oil needs to be properly hot before the first luchi goes in, or it won't puff.", "Roll the dough evenly — thick spots stop the puff."],
    vegetarianAlt: "Already vegetarian.",
    storage: "Aloo dum keeps 2 days refrigerated; luchi are best fried fresh.",
    youtubeVideos: [vid("Luchi Aloo Dum — Bengali Breakfast", "Bong Eats", "1.5M views", "2 years ago", "15:00", 92, "bn401"), vid("Perfect Puffed Luchi", "Rumki's Kitchen", "420K views", "1 year ago", "9:30", 83, "bn402")],
  }),
  mkRecipe({
    id: "bn-mishti-doi", cuisine: "bengali", title: "Mishti Doi",
    description: "Sweetened, caramelized fermented yogurt with a custard-like set.",
    difficulty: "Easy", prepTime: 15, cookTime: 15, baseServings: 6, spice: 0, rating: 4.8, popularity: 85,
    dietaryTags: ["vegetarian", "dessert"],
    ingredients: [ing("whole milk", 1, "l"), ing("sugar", 150, "g"), ing("plain yogurt (starter)", 2, "tbsp"), ing("cardamom pods", 3, "")],
    instructions: [
      { title: "Caramelize the sugar", description: "Melt half the sugar in a heavy pan until deep amber — this gives mishti doi its color." },
      { title: "Reduce the milk", description: "Add the milk to the caramel, then simmer and reduce by about a third, stirring occasionally." },
      { title: "Cool and set the starter", description: "Cool the milk until warm (not hot), whisk in the yogurt starter and cardamom." },
      { title: "Ferment", description: "Pour into earthen or ceramic pots and leave undisturbed in a warm place for 6–8 hours to set." },
    ],
    tips: ["An earthen pot helps draw out excess whey for a firmer set, though ceramic works fine.", "Don't move the pots while setting — movement disrupts the custard-like texture."],
    storage: "Refrigerate once set; keeps well for 3–4 days and firms up further when chilled.",
    youtubeVideos: [vid("Mishti Doi — Bengali Sweet Yogurt", "Bong Eats", "1.2M views", "2 years ago", "10:15", 93, "bn501"), vid("No-Fail Mishti Doi", "Cook With Rupa", "280K views", "10 months ago", "7:40", 82, "bn502")],
  }),
  mkRecipe({
    id: "bn-chingri-malai", cuisine: "bengali", title: "Chingri Malai Curry",
    description: "Prawns simmered gently in a fragrant, coconut-milk-based curry.",
    difficulty: "Medium", prepTime: 15, cookTime: 30, baseServings: 4, spice: 2, rating: 4.7, popularity: 77,
    dietaryTags: ["non-veg", "seafood"],
    ingredients: [ing("large prawns", 500, "g"), ing("coconut milk", 300, "ml"), ing("onion paste", 2, "tbsp"), ing("ginger paste", 1, "tbsp"), ing("green chilies", 3, ""), ing("bay leaf", 1, ""), ing("mustard oil", 2, "tbsp")],
    instructions: [
      { title: "Sear the prawns", description: "Lightly sear the prawns in oil for 2 minutes per side, then set aside." },
      { title: "Build the base", description: "Sauté onion and ginger paste with bay leaf until fragrant and golden." },
      { title: "Add coconut milk", description: "Pour in coconut milk and simmer gently — do not boil hard, or it may split." },
      { title: "Finish", description: "Return the prawns to the pan and simmer 5 more minutes until just cooked through." },
    ],
    tips: ["Prawns turn rubbery fast — add them last and keep the final simmer short.", "A gentle simmer keeps the coconut milk from splitting."],
    substitutions: { "coconut milk": GENERIC_SUBS["coconut milk"] },
    storage: "Best fresh; reheat gently on the stovetop over low heat.",
    youtubeVideos: [vid("Chingri Malai Curry — Bengali Classic", "Bong Eats", "980K views", "2 years ago", "13:20", 91, "bn601"), vid("Prawn Malai Curry Recipe", "Get Curried", "350K views", "1 year ago", "9:05", 80, "bn602")],
  }),
  mkRecipe({
    id: "bn-dhokar-dalna", cuisine: "bengali", title: "Dhokar Dalna",
    description: "Steamed lentil cakes, fried golden and simmered in a light spiced gravy.",
    difficulty: "Medium", prepTime: 30, cookTime: 40, baseServings: 4, spice: 2, rating: 4.4, popularity: 62,
    dietaryTags: ["vegetarian"],
    ingredients: [ing("chana dal, soaked", 2, "cup"), ing("cumin seeds", 1, "tsp"), ing("ginger paste", 1, "tbsp"), ing("tomatoes", 2, ""), ing("turmeric powder", 1, "tsp"), ing("garam masala", 1, "tsp"), ing("oil", 3, "tbsp")],
    instructions: [
      { title: "Make the dal batter", description: "Grind the soaked chana dal coarsely with cumin and a little ginger paste." },
      { title: "Steam and set", description: "Spread the batter in a greased tray, steam for 15 minutes, then cool and cut into diamonds." },
      { title: "Fry the dhoka", description: "Shallow fry the pieces until golden on the surface." },
      { title: "Simmer in gravy", description: "Cook a tomato-based gravy with the spices, then gently add the fried dhoka and simmer 8–10 minutes." },
    ],
    tips: ["Let the steamed dal fully cool before cutting, or the pieces crumble.", "Add the fried dhoka near the end so they hold their shape."],
    vegetarianAlt: "Already vegetarian and can be made vegan by using oil throughout.",
    storage: "Refrigerate up to 2 days; the dhoka can soften slightly on reheating.",
    youtubeVideos: [vid("Dhokar Dalna — Bengali Lentil Cake Curry", "Bong Eats", "610K views", "2 years ago", "14:10", 89, "bn701"), vid("Niramish Dhokar Dalna", "Rumki's Kitchen", "190K views", "8 months ago", "11:00", 78, "bn702")],
  }),

  // Italian
  mkRecipe({
    id: "it-margherita", cuisine: "italian", title: "Margherita Pizza",
    description: "Just tomato, mozzarella, and basil — the standard every pizza is measured against.",
    difficulty: "Medium", prepTime: 90, cookTime: 10, baseServings: 2, spice: 0, rating: 4.8, popularity: 92, trending: true,
    dietaryTags: ["vegetarian"],
    ingredients: [ing("pizza dough", 250, "g"), ing("San Marzano tomatoes", 150, "g"), ing("fresh mozzarella", 125, "g"), ing("basil leaves", 8, ""), ing("olive oil", 2, "tbsp")],
    instructions: [
      { title: "Prepare the dough", description: "Stretch the rested dough into a thin round, keeping a slightly thicker rim." },
      { title: "Sauce and top", description: "Crush the tomatoes by hand and spread thinly, then tear the mozzarella over the top." },
      { title: "Bake hot", description: "Bake at the highest oven temperature possible, ideally on a preheated stone, for 6–10 minutes." },
      { title: "Finish", description: "Top with fresh basil and a drizzle of olive oil right after it comes out of the oven." },
    ],
    tips: ["The oven can't be too hot for this — high heat is what gives the crust its char."],
    substitutions: { "fresh mozzarella": "low-moisture mozzarella, though it won't be as creamy" },
    youtubeVideos: [vid("Neapolitan Margherita at Home", "Vincenzo's Plate", "4.2M views", "2 years ago", "12:30", 96, "it001"), vid("Home Oven Pizza Secrets", "Pasta Grammar", "1.3M views", "1 year ago", "15:45", 87, "it002")],
  }),
  mkRecipe({
    id: "it-mushroom-risotto", cuisine: "italian", title: "Creamy Mushroom Risotto",
    description: "Slow-stirred arborio rice, released into a rich, mushroom-laced creaminess.",
    difficulty: "Medium", prepTime: 15, cookTime: 35, baseServings: 4, spice: 0, rating: 4.6, popularity: 70,
    dietaryTags: ["vegetarian"],
    ingredients: [ing("arborio rice", 300, "g"), ing("mixed mushrooms", 300, "g"), ing("vegetable stock", 1, "l"), ing("white wine", 100, "ml"), ing("parmesan, grated", 60, "g"), ing("butter", 40, "g"), ing("onion, diced", 1, "")],
    instructions: [
      { title: "Sauté mushrooms", description: "Cook the mushrooms hard and fast in butter until browned, then set aside." },
      { title: "Toast the rice", description: "Sauté onion, add rice, and toast until translucent at the edges." },
      { title: "Add liquid gradually", description: "Deglaze with wine, then add hot stock one ladle at a time, stirring constantly." },
      { title: "Finish creamy", description: "Off heat, stir in butter, parmesan, and the mushrooms until glossy." },
    ],
    tips: ["Keep the stock at a gentle simmer nearby so it doesn't cool the rice each time you add it."],
    substitutions: { "white wine": GENERIC_SUBS["white wine"], "parmesan, grated": GENERIC_SUBS["parmesan"] },
    youtubeVideos: [vid("Perfect Mushroom Risotto", "Vincenzo's Plate", "2.1M views", "3 years ago", "14:00", 93, "it101"), vid("Risotto Technique Explained", "Pasta Grammar", "600K views", "1 year ago", "10:30", 82, "it102")],
  }),

  // Chinese
  mkRecipe({
    id: "cn-kung-pao", cuisine: "chinese", title: "Kung Pao Chicken",
    description: "Diced chicken, peanuts, and dried chilies in a sharp, sweet-savory sauce.",
    difficulty: "Medium", prepTime: 20, cookTime: 15, baseServings: 4, spice: 3, rating: 4.7, popularity: 85, trending: true,
    dietaryTags: ["non-veg", "chicken", "quick"],
    ingredients: [ing("chicken thigh, diced", 500, "g"), ing("roasted peanuts", 80, "g"), ing("dried red chilies", 8, ""), ing("soy sauce", 3, "tbsp"), ing("black vinegar", 1, "tbsp"), ing("garlic, sliced", 4, "clove"), ing("scallions", 3, "stalk")],
    instructions: [
      { title: "Marinate the chicken", description: "Toss chicken in soy sauce and a little cornstarch, resting 15 minutes." },
      { title: "Fry the aromatics", description: "Fry dried chilies and garlic in hot oil until fragrant, careful not to burn them." },
      { title: "Stir-fry the chicken", description: "Add chicken and stir-fry on high heat until just cooked through." },
      { title: "Sauce and finish", description: "Add the sauce, peanuts, and scallions, tossing quickly until glossy." },
    ],
    tips: ["Toast the dried chilies briefly, but pull them the moment they darken — burnt chili turns bitter."],
    substitutions: { "soy sauce": GENERIC_SUBS["soy sauce"] },
    vegetarianAlt: "Substitute firm tofu, pan-fried until crisp, for the chicken.",
    youtubeVideos: [vid("Real Kung Pao Chicken", "Chinese Cooking Demystified", "3.4M views", "3 years ago", "13:15", 97, "cn001"), vid("Restaurant-Style Kung Pao", "Souped Up Recipes", "1.6M views", "2 years ago", "9:50", 88, "cn002")],
  }),
  mkRecipe({
    id: "cn-hakka-noodles", cuisine: "chinese", title: "Vegetable Hakka Noodles",
    description: "Stir-fried noodles with crisp vegetables, ready in under 30 minutes.",
    difficulty: "Easy", prepTime: 15, cookTime: 12, baseServings: 4, spice: 1, rating: 4.5, popularity: 74,
    dietaryTags: ["vegetarian", "quick"],
    ingredients: [ing("hakka noodles", 300, "g"), ing("cabbage, shredded", 1, "cup"), ing("carrot, julienned", 1, ""), ing("capsicum, sliced", 1, ""), ing("soy sauce", 2, "tbsp"), ing("vinegar", 1, "tbsp"), ing("garlic, minced", 3, "clove")],
    instructions: [
      { title: "Boil the noodles", description: "Cook noodles just short of al dente, then rinse in cold water and toss with a little oil." },
      { title: "Prep vegetables", description: "Slice all vegetables thin so they cook fast and stay crisp." },
      { title: "Stir-fry hot", description: "Stir-fry garlic then vegetables on high heat for 2 minutes, keeping them crunchy." },
      { title: "Toss together", description: "Add noodles, soy sauce, and vinegar, tossing everything on high heat for 1–2 minutes." },
    ],
    tips: ["Rinsing the noodles in cold water stops them cooking further and keeps them from clumping."],
    youtubeVideos: [vid("Veg Hakka Noodles in 20 Minutes", "Get Curried", "1.4M views", "2 years ago", "8:20", 90, "cn101"), vid("Street-Style Hakka Noodles", "Your Food Lab", "720K views", "1 year ago", "10:05", 83, "cn102")],
  }),

  // Spanish
  mkRecipe({
    id: "es-paella", cuisine: "spanish", title: "Seafood Paella",
    description: "Saffron rice studded with shellfish, cooked wide and shallow for a crisp base.",
    difficulty: "Hard", prepTime: 25, cookTime: 35, baseServings: 4, spice: 1, rating: 4.7, popularity: 76,
    dietaryTags: ["non-veg", "seafood"],
    ingredients: [ing("bomba rice", 350, "g"), ing("prawns", 300, "g"), ing("mussels", 300, "g"), ing("saffron threads", 1, "pinch"), ing("fish stock", 900, "ml"), ing("tomato, grated", 2, ""), ing("olive oil", 3, "tbsp")],
    instructions: [
      { title: "Build the sofrito", description: "Cook grated tomato in olive oil until reduced and jammy." },
      { title: "Toast the rice", description: "Add rice and toast briefly in the sofrito before adding liquid." },
      { title: "Add stock and saffron", description: "Pour in hot saffron stock, spread the rice evenly, and do not stir again." },
      { title: "Finish uncovered", description: "Nestle seafood on top in the last 10 minutes and let a crust (socarrat) form on the bottom." },
    ],
    tips: ["Resist the urge to stir once the stock goes in — the crust on the bottom is the best part."],
    substitutions: { "bomba rice": "arborio or any short-grain rice in a pinch" },
    youtubeVideos: [vid("Authentic Seafood Paella", "Spain on a Fork", "2.9M views", "3 years ago", "14:40", 95, "es001"), vid("Paella Valenciana Technique", "Spanish Cooking", "780K views", "1 year ago", "16:00", 84, "es002")],
  }),
  mkRecipe({
    id: "es-patatas-bravas", cuisine: "spanish", title: "Patatas Bravas",
    description: "Crisp fried potatoes with a smoky, spiced tomato sauce and garlic aioli.",
    difficulty: "Easy", prepTime: 15, cookTime: 30, baseServings: 4, spice: 2, rating: 4.6, popularity: 68,
    dietaryTags: ["vegetarian", "quick"],
    ingredients: [ing("potatoes, cubed", 600, "g"), ing("smoked paprika", 1, "tbsp"), ing("crushed tomatoes", 200, "g"), ing("garlic", 3, "clove"), ing("mayonnaise", 4, "tbsp"), ing("olive oil", 3, "tbsp")],
    instructions: [
      { title: "Par-boil the potatoes", description: "Boil the potato cubes until just tender, then drain and dry thoroughly." },
      { title: "Fry until crisp", description: "Fry in hot oil until deeply golden and crisp on all sides." },
      { title: "Make the bravas sauce", description: "Simmer crushed tomatoes with smoked paprika and garlic until thickened." },
      { title: "Assemble", description: "Spoon the bravas sauce and garlic aioli over the hot, crisp potatoes." },
    ],
    tips: ["Drying the potatoes well before frying is the difference between crisp and soggy."],
    youtubeVideos: [vid("Best Patatas Bravas", "Spain on a Fork", "1.2M views", "2 years ago", "9:15", 91, "es101")],
  }),

  // Indian (pan-India)
  mkRecipe({
    id: "in-butter-chicken", cuisine: "indian", title: "Butter Chicken",
    description: "Tandoori chicken simmered in a velvety, tomato-and-butter gravy.",
    difficulty: "Medium", prepTime: 30, cookTime: 30, baseServings: 4, spice: 2, rating: 4.8, popularity: 94, trending: true,
    dietaryTags: ["non-veg", "chicken"],
    ingredients: [ing("chicken thigh", 600, "g"), ing("yogurt", 100, "ml"), ing("tomato puree", 400, "g"), ing("butter", 60, "g"), ing("cream", 100, "ml"), ing("kasuri methi", 1, "tsp"), ing("garam masala", 1, "tsp")],
    instructions: [
      { title: "Marinate and grill", description: "Marinate chicken in yogurt and spices, then grill or pan-sear until charred at the edges." },
      { title: "Build the gravy", description: "Simmer tomato puree with butter until it deepens in color and the rawness cooks off." },
      { title: "Combine", description: "Add the chicken to the gravy and simmer 10 minutes to absorb the sauce." },
      { title: "Finish rich", description: "Stir in cream, kasuri methi, and a final knob of butter off the heat." },
    ],
    tips: ["Char the chicken properly before adding it to the gravy — that smoky edge is essential to the flavor."],
    vegetarianAlt: "Use paneer cubes in place of chicken, added at the end so they stay soft.",
    youtubeVideos: [vid("Restaurant-Style Butter Chicken", "Get Curried", "5.1M views", "3 years ago", "12:00", 98, "in001"), vid("Butter Chicken Masterclass", "Your Food Lab", "1.8M views", "2 years ago", "15:30", 89, "in002")],
  }),
  mkRecipe({
    id: "in-chole-bhature", cuisine: "indian", title: "Chole Bhature",
    description: "Spiced chickpea curry with pillowy, deep-fried bread.",
    difficulty: "Medium", prepTime: 480, cookTime: 45, baseServings: 4, spice: 2, rating: 4.6, popularity: 73,
    dietaryTags: ["vegetarian"],
    ingredients: [ing("chickpeas, soaked overnight", 300, "g"), ing("all-purpose flour", 2, "cup"), ing("yogurt", 3, "tbsp"), ing("chole masala", 2, "tbsp"), ing("onion, chopped", 2, ""), ing("tea bags", 2, "")],
    instructions: [
      { title: "Cook the chickpeas", description: "Pressure cook soaked chickpeas with tea bags for a deep, dark color." },
      { title: "Make the bhature dough", description: "Knead flour with yogurt and a little oil into a soft dough, resting 3-4 hours." },
      { title: "Cook the chole", description: "Sauté onions with chole masala, then simmer with the cooked chickpeas until thick." },
      { title: "Fry the bhature", description: "Roll and deep-fry the dough in hot oil until puffed and golden." },
    ],
    tips: ["The tea bags aren't just for color — they add a subtle tannic depth to the chickpeas."],
    youtubeVideos: [vid("Punjabi Chole Bhature", "Get Curried", "2.2M views", "3 years ago", "16:45", 92, "in101")],
  }),

  // Japanese
  mkRecipe({
    id: "jp-katsu-curry", cuisine: "japanese", title: "Chicken Katsu Curry",
    description: "Crisp panko-breaded chicken over rice, draped in a mellow curry sauce.",
    difficulty: "Medium", prepTime: 20, cookTime: 25, baseServings: 4, spice: 1, rating: 4.7, popularity: 80,
    dietaryTags: ["non-veg", "chicken"],
    ingredients: [ing("chicken breast", 500, "g"), ing("panko breadcrumbs", 150, "g"), ing("curry roux blocks", 100, "g"), ing("carrot, chopped", 1, ""), ing("onion, chopped", 1, ""), ing("potato, chopped", 1, "")],
    instructions: [
      { title: "Bread the chicken", description: "Coat chicken in flour, egg, then panko, pressing firmly so the crumbs stick." },
      { title: "Fry until golden", description: "Deep or shallow fry until deeply golden and cooked through, then rest on a rack." },
      { title: "Make the curry", description: "Simmer onion, carrot, and potato in water until soft, then dissolve in the curry roux." },
      { title: "Plate", description: "Slice the katsu and serve over rice, curry sauce poured alongside so it stays crisp." },
    ],
    tips: ["Rest fried katsu on a wire rack, not paper towels, so the underside doesn't steam and go soggy."],
    substitutions: { "curry roux blocks": "a homemade roux of flour, butter, curry powder, and stock" },
    youtubeVideos: [vid("Chicken Katsu Curry from Scratch", "Just One Cookbook", "1.9M views", "2 years ago", "13:50", 94, "jp001")],
  }),
  mkRecipe({
    id: "jp-miso-ramen", cuisine: "japanese", title: "Miso Ramen",
    description: "A rich miso-based broth with springy noodles and classic toppings.",
    difficulty: "Medium", prepTime: 20, cookTime: 40, baseServings: 2, spice: 1, rating: 4.6, popularity: 71,
    dietaryTags: ["non-veg", "contains-egg"],
    ingredients: [ing("ramen noodles", 2, "portion"), ing("miso paste", 3, "tbsp"), ing("chicken or pork stock", 800, "ml"), ing("soft-boiled eggs", 2, ""), ing("scallions", 2, "stalk"), ing("nori sheets", 2, "")],
    instructions: [
      { title: "Build the tare", description: "Whisk miso paste with a little stock until smooth to avoid clumping later." },
      { title: "Heat the broth", description: "Bring the stock to a gentle simmer, then whisk in the miso tare off direct heat." },
      { title: "Cook the noodles", description: "Boil noodles separately according to package timing, then drain well." },
      { title: "Assemble", description: "Pour broth over noodles and top with egg, scallion, and nori." },
    ],
    tips: ["Never boil miso hard — it dulls the flavor and can turn the broth grainy."],
    vegetarianAlt: "Use a rich mushroom-kombu stock instead of meat stock, and skip the egg for vegan.",
    youtubeVideos: [vid("Miso Ramen at Home", "Just One Cookbook", "1.3M views", "2 years ago", "17:20", 90, "jp101")],
  }),

  // Korean
  mkRecipe({
    id: "kr-bibimbap", cuisine: "korean", title: "Bibimbap",
    description: "A composed bowl of rice, seasoned vegetables, and gochujang.",
    difficulty: "Medium", prepTime: 30, cookTime: 20, baseServings: 4, spice: 2, rating: 4.7, popularity: 78,
    dietaryTags: ["vegetarian", "contains-egg"],
    ingredients: [ing("cooked rice", 4, "cup"), ing("spinach", 200, "g"), ing("carrot, julienned", 1, ""), ing("shiitake mushrooms", 150, "g"), ing("bean sprouts", 150, "g"), ing("gochujang", 3, "tbsp"), ing("eggs", 4, "")],
    instructions: [
      { title: "Season each vegetable separately", description: "Blanch and season spinach, sauté carrot and mushrooms, each with a little sesame oil and salt." },
      { title: "Fry the eggs", description: "Fry eggs sunny-side up, keeping the yolk runny." },
      { title: "Assemble the bowl", description: "Arrange rice topped with each vegetable in its own section, egg in the center." },
      { title: "Finish and mix", description: "Add gochujang, then mix everything together at the table just before eating." },
    ],
    tips: ["Keep each vegetable's seasoning separate while cooking — that's what gives bibimbap its layered flavor."],
    vegetarianAlt: "Already vegetarian if the egg is left as is; omit egg for vegan.",
    youtubeVideos: [vid("Classic Bibimbap Recipe", "Maangchi", "2.6M views", "3 years ago", "11:40", 93, "kr001")],
  }),
  mkRecipe({
    id: "kr-kimchi-jjigae", cuisine: "korean", title: "Kimchi Jjigae",
    description: "A punchy, bubbling stew built on well-fermented kimchi.",
    difficulty: "Easy", prepTime: 10, cookTime: 20, baseServings: 3, spice: 3, rating: 4.6, popularity: 66,
    dietaryTags: ["non-veg", "quick"],
    ingredients: [ing("well-fermented kimchi", 2, "cup"), ing("pork belly, sliced", 200, "g"), ing("tofu, cubed", 200, "g"), ing("gochugaru", 1, "tbsp"), ing("scallions", 2, "stalk"), ing("anchovy or vegetable stock", 500, "ml")],
    instructions: [
      { title: "Render the pork", description: "Fry pork belly slices until the fat renders and edges crisp slightly." },
      { title: "Fry the kimchi", description: "Add kimchi and fry with the pork for a few minutes to deepen its flavor." },
      { title: "Simmer the stew", description: "Add stock and gochugaru and simmer 15 minutes until the flavors meld." },
      { title: "Finish", description: "Add tofu in the last few minutes and top with scallion before serving." },
    ],
    tips: ["Use kimchi that's been in the fridge a while — well-fermented, sour kimchi makes a far better stew than fresh."],
    vegetarianAlt: "Swap pork for extra mushrooms and use a kombu-based stock.",
    youtubeVideos: [vid("Kimchi Jjigae — Real Deal", "Maangchi", "1.7M views", "2 years ago", "10:15", 91, "kr101")],
  }),

  // Mexican
  mkRecipe({
    id: "mx-chicken-tacos", cuisine: "mexican", title: "Chicken Tacos",
    description: "Charred, marinated chicken folded into warm tortillas with bright toppings.",
    difficulty: "Easy", prepTime: 20, cookTime: 15, baseServings: 4, spice: 2, rating: 4.6, popularity: 82, trending: true,
    dietaryTags: ["non-veg", "chicken", "quick"],
    ingredients: [ing("chicken thigh", 500, "g"), ing("corn tortillas", 8, ""), ing("lime", 2, ""), ing("cilantro", 1, "cup"), ing("white onion, diced", 1, ""), ing("chili powder", 1, "tbsp"), ing("cumin", 1, "tsp")],
    instructions: [
      { title: "Marinate", description: "Marinate chicken in lime juice, chili powder, and cumin for at least 20 minutes." },
      { title: "Char the chicken", description: "Grill or sear on high heat until charred at the edges, then rest and slice." },
      { title: "Warm the tortillas", description: "Char tortillas briefly over an open flame or dry pan for flexibility and flavor." },
      { title: "Assemble", description: "Fill tortillas with chicken, onion, and cilantro, and finish with a squeeze of lime." },
    ],
    tips: ["Charring the tortillas directly over flame takes 10 seconds and makes a real difference."],
    vegetarianAlt: "Use grilled mushrooms or jackfruit marinated the same way.",
    youtubeVideos: [vid("Best Chicken Tacos", "Pailin's Kitchen", "1.5M views", "2 years ago", "10:50", 90, "mx001")],
  }),
  mkRecipe({
    id: "mx-veg-enchiladas", cuisine: "mexican", title: "Vegetarian Enchiladas",
    description: "Rolled tortillas filled with beans and vegetables, baked under red sauce and cheese.",
    difficulty: "Medium", prepTime: 25, cookTime: 25, baseServings: 4, spice: 2, rating: 4.5, popularity: 64,
    dietaryTags: ["vegetarian"],
    ingredients: [ing("corn tortillas", 10, ""), ing("black beans", 400, "g"), ing("bell peppers", 2, ""), ing("enchilada sauce", 400, "ml"), ing("shredded cheese", 150, "g"), ing("onion, diced", 1, "")],
    instructions: [
      { title: "Cook the filling", description: "Sauté onion and pepper, then mix with black beans and a little of the sauce." },
      { title: "Fill and roll", description: "Warm the tortillas so they don't crack, then fill and roll them tightly." },
      { title: "Sauce and bake", description: "Arrange rolled tortillas in a dish, cover with remaining sauce and cheese." },
      { title: "Bake", description: "Bake at 200°C for about 20 minutes until bubbling." },
    ],
    tips: ["Warm the tortillas before rolling — cold tortillas crack and fall apart."],
    youtubeVideos: [vid("Vegetarian Enchiladas", "Pailin's Kitchen", "600K views", "1 year ago", "12:10", 85, "mx101")],
  }),

  // Thai
  mkRecipe({
    id: "th-green-curry", cuisine: "thai", title: "Green Curry",
    description: "A fragrant, coconut-based curry built on fresh green chili paste.",
    difficulty: "Medium", prepTime: 20, cookTime: 25, baseServings: 4, spice: 3, rating: 4.7, popularity: 75,
    dietaryTags: ["non-veg", "chicken"],
    ingredients: [ing("green curry paste", 3, "tbsp"), ing("coconut milk", 400, "ml"), ing("chicken, sliced", 400, "g"), ing("thai eggplant", 150, "g"), ing("thai basil", 1, "cup"), ing("fish sauce", 2, "tbsp")],
    instructions: [
      { title: "Fry the paste", description: "Fry curry paste in the thick top layer of coconut milk until fragrant and the oil separates." },
      { title: "Add chicken", description: "Add chicken and cook until it's coated and starts to turn opaque." },
      { title: "Add liquid and vegetables", description: "Pour in remaining coconut milk and add eggplant, simmering until tender." },
      { title: "Finish", description: "Stir in fish sauce and finish with a generous handful of Thai basil." },
    ],
    tips: ["Frying the paste in coconut cream (not thin milk) is what really wakes up the aromatics."],
    substitutions: { "fish sauce": GENERIC_SUBS["fish sauce"], "coconut milk": GENERIC_SUBS["coconut milk"] },
    vegetarianAlt: "Use firm tofu and mushroom stock, and swap fish sauce for soy sauce.",
    youtubeVideos: [vid("Thai Green Curry From Scratch", "Pailin's Kitchen", "2.3M views", "3 years ago", "14:30", 95, "th001")],
  }),
  mkRecipe({
    id: "th-pad-thai", cuisine: "thai", title: "Pad Thai",
    description: "Stir-fried rice noodles balanced across sweet, sour, and salty.",
    difficulty: "Medium", prepTime: 20, cookTime: 15, baseServings: 2, spice: 1, rating: 4.6, popularity: 88, trending: true,
    dietaryTags: ["non-veg", "contains-egg", "quick"],
    ingredients: [ing("flat rice noodles", 200, "g"), ing("shrimp", 200, "g"), ing("eggs", 2, ""), ing("tamarind paste", 2, "tbsp"), ing("fish sauce", 2, "tbsp"), ing("palm sugar", 1, "tbsp"), ing("bean sprouts", 1, "cup"), ing("crushed peanuts", 3, "tbsp")],
    instructions: [
      { title: "Soak the noodles", description: "Soak dried noodles in warm water until pliable but firm, then drain." },
      { title: "Make the sauce", description: "Mix tamarind paste, fish sauce, and palm sugar into a balanced sweet-sour sauce." },
      { title: "Stir-fry", description: "Stir-fry shrimp and egg first, then add noodles and sauce, tossing on high heat." },
      { title: "Finish", description: "Add bean sprouts at the very end so they stay crunchy, and top with crushed peanuts." },
    ],
    tips: ["Have every ingredient prepped before you start — pad thai moves fast once the wok is hot."],
    substitutions: { "tamarind paste": GENERIC_SUBS["tamarind"], "fish sauce": GENERIC_SUBS["fish sauce"] },
    vegetarianAlt: "Use tofu instead of shrimp and swap fish sauce for soy sauce.",
    youtubeVideos: [vid("Real Pad Thai Recipe", "Pailin's Kitchen", "3.8M views", "3 years ago", "16:15", 97, "th101")],
  }),

  // French
  mkRecipe({
    id: "fr-ratatouille", cuisine: "french", title: "Ratatouille",
    description: "Provençal stewed vegetables, each cooked to bring out its own character.",
    difficulty: "Medium", prepTime: 25, cookTime: 45, baseServings: 4, spice: 0, rating: 4.5, popularity: 60,
    dietaryTags: ["vegetarian", "vegan"],
    ingredients: [ing("eggplant, sliced", 1, ""), ing("zucchini, sliced", 2, ""), ing("bell peppers", 2, ""), ing("tomatoes", 4, ""), ing("garlic", 3, "clove"), ing("herbes de Provence", 1, "tbsp"), ing("olive oil", 4, "tbsp")],
    instructions: [
      { title: "Cook vegetables separately", description: "Sauté each vegetable on its own until lightly colored, so none turns to mush." },
      { title: "Build the tomato base", description: "Cook down tomatoes with garlic and herbs into a thick sauce." },
      { title: "Layer and combine", description: "Fold the sautéed vegetables into the tomato base, or arrange them in overlapping slices." },
      { title: "Slow finish", description: "Bake or simmer gently for 20 minutes so the flavors meld without turning to puree." },
    ],
    tips: ["Cooking each vegetable separately first is the real secret — it keeps distinct textures instead of a single mush."],
    youtubeVideos: [vid("Classic Ratatouille", "French Cooking Academy", "1.1M views", "2 years ago", "13:40", 89, "fr001")],
  }),
  mkRecipe({
    id: "fr-creme-brulee", cuisine: "french", title: "Crème Brûlée",
    description: "Silky vanilla custard beneath a shattering layer of caramelized sugar.",
    difficulty: "Medium", prepTime: 15, cookTime: 45, baseServings: 4, spice: 0, rating: 4.8, popularity: 72,
    dietaryTags: ["vegetarian", "dessert", "contains-egg"],
    ingredients: [ing("heavy cream", 500, "ml"), ing("egg yolks", 5, ""), ing("vanilla bean", 1, ""), ing("granulated sugar", 100, "g"), ing("sugar for topping", 4, "tbsp")],
    instructions: [
      { title: "Infuse the cream", description: "Warm cream with the scraped vanilla bean, letting it steep 10 minutes." },
      { title: "Temper the yolks", description: "Whisk yolks and sugar, then slowly add the warm cream while whisking to avoid scrambling." },
      { title: "Bake in a water bath", description: "Pour into ramekins set in a water bath and bake low and slow until just set with a slight wobble." },
      { title: "Caramelize the top", description: "Chill fully, then sprinkle sugar on top and caramelize with a torch just before serving." },
    ],
    tips: ["The custard should still wobble slightly in the center when you pull it from the oven — it firms up as it chills."],
    youtubeVideos: [vid("Perfect Crème Brûlée", "French Cooking Academy", "1.4M views", "3 years ago", "11:20", 92, "fr101")],
  }),
];

const CUISINE_MAP = Object.fromEntries(CUISINES.map((c) => [c.id, c]));

/* ============================= SEARCH ============================= */

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

function tokenScore(query, target) {
  const qn = normalize(query);
  const tn = normalize(target);
  if (!qn) return 0;
  if (tn === qn) return 100;
  if (tn.includes(qn)) return 85;
  const qTokens = qn.split(/\s+/).filter(Boolean);
  const tTokens = tn.split(/\s+/).filter(Boolean);
  let hits = 0;
  qTokens.forEach((qt) => {
    if (tTokens.some((tt) => tt.includes(qt) || qt.includes(tt))) hits++;
  });
  return qTokens.length ? (hits / qTokens.length) * 70 : 0;
}

function searchRecipes(query, pool) {
  if (!query.trim()) return pool;
  const scored = pool.map((r) => {
    const candidates = [r.title, ...(r.aliases || [])];
    const best = Math.max(...candidates.map((c) => tokenScore(query, c)));
    return { r, score: best };
  });
  return scored.filter((s) => s.score > 25).sort((a, b) => b.score - a.score).map((s) => s.r);
}

/* ============================= CHEF AI ============================= */

function findIngredientMention(text, recipe) {
  const lower = text.toLowerCase();
  return (recipe.ingredients || []).find((ing) => lower.includes(ing.name.toLowerCase().split(",")[0]));
}

function generateChefResponse(text, recipe, allRecipes) {
  const lower = text.toLowerCase();

  if (recipe) {
    const mentioned = findIngredientMention(text, recipe);
    if ((lower.includes("don't have") || lower.includes("dont have") || lower.includes("no ") || lower.includes("out of") || lower.includes("only have")) && mentioned) {
      const key = Object.keys(recipe.substitutions || {}).find((k) => k.toLowerCase().includes(mentioned.name.toLowerCase().split(",")[0]));
      const sub = key ? recipe.substitutions[key] : GENERIC_SUBS[mentioned.name.toLowerCase().split(",")[0]];
      if (sub) return { text: `No ${mentioned.name}? You can use ${sub}. It'll shift the flavor slightly but the dish will still work.` };
      return { text: `You can often just leave out the ${mentioned.name} here — it'll change the dish a little but won't ruin it.` };
    }
    if (lower.includes("vegetarian") || lower.includes("vegan")) {
      if (recipe.vegetarianAlt) return { text: recipe.vegetarianAlt };
      return { text: "Swap any meat or fish for firm tofu, paneer, or extra mushrooms, and use a vegetable stock in place of any meat-based one." };
    }
    if (lower.includes("spicier") || lower.includes("more spicy") || lower.includes("more heat")) {
      return { text: `To turn up the heat on ${recipe.title}, add an extra green chili or a pinch more red chili powder toward the end of cooking, so you can taste as you go.` };
    }
    if (lower.includes("less spicy") || lower.includes("milder") || lower.includes("not spicy")) {
      return { text: `To make ${recipe.title} milder, cut the chili by half and stir in a spoon of yogurt or cream at the end to round out the heat.` };
    }
    const servesMatch = lower.match(/(\d+)\s*(people|servings|serves)/) || lower.match(/for\s+(\d+)/);
    if (servesMatch && (lower.includes("how much") || lower.includes("for"))) {
      const target = parseInt(servesMatch[1], 10);
      const scale = target / recipe.baseServings;
      const keyIng = recipe.ingredients[0];
      const scaledAmt = formatAmount(keyIng.amount * scale);
      return { text: `For ${target} people, scale everything by ${scale.toFixed(2)}×. For example you'd need about ${scaledAmt}${keyIng.unit ? " " + keyIng.unit : ""} of ${keyIng.name}. I've also updated the servings above so every ingredient is scaled for you.`, setServings: target };
    }
    if (lower.includes("similar") && lower.includes("easier")) {
      const alt = allRecipes.filter((r) => r.cuisine === recipe.cuisine && r.id !== recipe.id).sort((a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty))[0];
      if (alt) return { text: `Try ${alt.title} — it's a similar ${CUISINE_MAP[recipe.cuisine].name} dish but a bit more forgiving to cook.`, suggestions: [alt] };
    }
    // generic fallback using a tip
    const tip = recipe.tips && recipe.tips.length ? recipe.tips[Math.floor(Math.random() * recipe.tips.length)] : null;
    return { text: tip ? `Here's something that helps with ${recipe.title}: ${tip}` : `I'm all yours for ${recipe.title} — ask me about substitutions, spice level, or scaling servings.` };
  }

  // no recipe context — discovery mode
  const cuisineMatch = CUISINES.find((c) => lower.includes(c.id) || lower.includes(c.name.toLowerCase()));
  const wantsVeg = lower.includes("vegetarian") || lower.includes("veg ") || lower.includes("veg,");
  const wantsVegan = lower.includes("vegan");
  const wantsQuick = lower.includes("under 30") || lower.includes("quick") || lower.includes("fast") || lower.includes("easy");
  const wantsDessert = lower.includes("dessert") || lower.includes("sweet");
  const wantsSimple = lower.includes("not too complicated") || lower.includes("simple") || lower.includes("beginner");

  const mentionedIngredients = [];
  const knownIngredientWords = ["chicken", "mutton", "fish", "prawns", "shrimp", "potato", "onion", "egg", "paneer", "tofu", "rice", "noodles", "mushroom"];
  knownIngredientWords.forEach((w) => { if (lower.includes(w)) mentionedIngredients.push(w); });

  let pool = allRecipes;
  if (cuisineMatch) pool = pool.filter((r) => r.cuisine === cuisineMatch.id);
  if (wantsVegan) pool = pool.filter((r) => r.dietaryTags.includes("vegan") || r.dietaryTags.includes("vegetarian"));
  else if (wantsVeg) pool = pool.filter((r) => r.dietaryTags.includes("vegetarian"));
  if (wantsQuick) pool = pool.filter((r) => r.prepTime + r.cookTime <= 45);
  if (wantsDessert) pool = pool.filter((r) => r.dietaryTags.includes("dessert"));
  if (wantsSimple) pool = pool.filter((r) => r.difficulty === "Easy");
  if (mentionedIngredients.length) {
    pool = pool.filter((r) => r.ingredients.some((ing) => mentionedIngredients.some((m) => ing.name.toLowerCase().includes(m))));
  }

  pool = pool.slice(0, 3);

  if (pool.length) {
    return { text: `Here's what I'd point you toward:`, suggestions: pool };
  }
  return { text: "I couldn't find a close match for that — try naming a cuisine, an ingredient you have on hand, or how much time you've got, and I'll narrow it down." };
}

function difficultyRank(d) { return { Easy: 0, Medium: 1, Hard: 2 }[d] ?? 1; }

function formatAmount(n) {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
}

/* ============================= UI HELPERS ============================= */

function GradientArt({ colors, icon, size = "normal" }) {
  return (
    <div
      className="savorly-art"
      style={{
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        height: size === "hero" ? 280 : size === "small" ? 90 : 160,
      }}
    >
      <div className="savorly-art-shine" />
      <span style={{ fontSize: size === "hero" ? 64 : size === "small" ? 28 : 44 }}>{icon}</span>
    </div>
  );
}

function DifficultyBadge({ level }) {
  return <span className={`savorly-badge savorly-badge-${level.toLowerCase()}`}>{level}</span>;
}

function SpiceLevel({ level }) {
  return (
    <span className="savorly-spice" title={`Spice level ${level}/3`}>
      {[0, 1, 2].map((i) => (
        <Flame key={i} size={13} strokeWidth={2} fill={i < level ? "#B5432A" : "none"} color={i < level ? "#B5432A" : "#C9BBA8"} />
      ))}
    </span>
  );
}

function RecipeCard({ recipe, onClick }) {
  const cuisine = CUISINE_MAP[recipe.cuisine];
  return (
    <button className="savorly-card savorly-recipe-card" onClick={onClick}>
      <div className="savorly-card-media">
        <GradientArt colors={cuisine.grad} icon={cuisine.flag} />
        {recipe.trending && <span className="savorly-trend-pill"><TrendingUp size={11} /> Trending</span>}
      </div>
      <div className="savorly-card-body">
        <div className="savorly-card-top-row">
          <span className="savorly-cuisine-tag">{cuisine.name}</span>
          <span className="savorly-rating"><Star size={12} fill="#E2963A" color="#E2963A" /> {recipe.rating}</span>
        </div>
        <h3 className="savorly-card-title">{recipe.title}</h3>
        <p className="savorly-card-desc">{recipe.description}</p>
        <div className="savorly-card-meta">
          <span><Clock size={13} /> {recipe.prepTime + recipe.cookTime} min</span>
          <DifficultyBadge level={recipe.difficulty} />
          <SpiceLevel level={recipe.spice} />
        </div>
      </div>
    </button>
  );
}

function MiniRecipeCard({ recipe, onClick }) {
  const cuisine = CUISINE_MAP[recipe.cuisine];
  return (
    <button className="savorly-mini-card" onClick={onClick}>
      <div className="savorly-mini-thumb" style={{ background: `linear-gradient(135deg, ${cuisine.grad[0]}, ${cuisine.grad[1]})` }}>
        <span>{cuisine.flag}</span>
      </div>
      <div className="savorly-mini-info">
        <strong>{recipe.title}</strong>
        <span>{cuisine.name} · {recipe.prepTime + recipe.cookTime} min · {recipe.difficulty}</span>
      </div>
    </button>
  );
}

function Skeleton({ rows = 3 }) {
  return (
    <div className="savorly-skeleton-grid">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="savorly-skeleton-card" key={i}>
          <div className="savorly-skel savorly-skel-media" />
          <div className="savorly-skel savorly-skel-line" style={{ width: "70%" }} />
          <div className="savorly-skel savorly-skel-line" style={{ width: "40%" }} />
        </div>
      ))}
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="savorly-accordion">
      <button className="savorly-accordion-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{title}</span>
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && <div className="savorly-accordion-body">{children}</div>}
    </div>
  );
}

/* ============================= CHEF AI PANEL ============================= */

function ChefAI({ open, onClose, currentRecipe, onNavigateRecipe, allRecipes, onSetServings }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi, I'm Chef AI. Ask me about substitutions, spice level, servings, or tell me what you've got and I'll find something to cook." },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const lastRecipeId = useRef(currentRecipe?.id);

  useEffect(() => {
    if (currentRecipe && currentRecipe.id !== lastRecipeId.current) {
      setMessages((m) => [...m, { role: "ai", text: `Now looking at ${currentRecipe.title} — ask me anything about this one.` }]);
      lastRecipeId.current = currentRecipe.id;
    }
  }, [currentRecipe]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const send = (text) => {
    const t = text ?? input;
    if (!t.trim()) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      const res = generateChefResponse(t, currentRecipe, allRecipes);
      setMessages((m) => [...m, { role: "ai", text: res.text, suggestions: res.suggestions }]);
      if (res.setServings && onSetServings) onSetServings(res.setServings);
    }, 350);
  };

  const suggestionsChips = currentRecipe
    ? ["I don't have the main protein — what can I use?", "Can I make this vegetarian?", "Make this spicier"]
    : ["I have chicken, potatoes and onions — Bengali ideas?", "Chinese, vegetarian, under 30 minutes", "A simple Bengali dessert"];

  if (!open) return null;

  return (
    <div className="savorly-chef-panel">
      <div className="savorly-chef-head">
        <div className="savorly-chef-head-left">
          <span className="savorly-chef-icon"><ChefHat size={16} /></span>
          <div>
            <strong>Chef AI</strong>
            <div className="savorly-chef-context">{currentRecipe ? `Helping with ${currentRecipe.title}` : "General recipe discovery"}</div>
          </div>
        </div>
        <button className="savorly-icon-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="savorly-chef-messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`savorly-chat-row savorly-chat-${m.role}`}>
            <div className="savorly-chat-bubble">
              {m.text}
              {m.suggestions && (
                <div className="savorly-chat-suggestions">
                  {m.suggestions.map((r) => (
                    <MiniRecipeCard key={r.id} recipe={r} onClick={() => { onNavigateRecipe(r); }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="savorly-chef-chips">
        {suggestionsChips.map((c) => (
          <button key={c} className="savorly-chip" onClick={() => send(c)}>{c}</button>
        ))}
      </div>
      <div className="savorly-chef-input-row">
        <input
          aria-label="Ask Chef AI"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder={currentRecipe ? `Ask about ${currentRecipe.title}...` : "Tell me what you've got..."}
        />
        <button className="savorly-send-btn" onClick={() => send()} aria-label="Send message"><Send size={16} /></button>
      </div>
    </div>
  );
}

/* ============================= PAGES ============================= */

function HomePage({ onSelectCuisine, onSelectRecipe, onOpenChef, recentlyViewed }) {
  const trending = useMemo(() => RECIPES.filter((r) => r.trending), []);
  const quick = useMemo(() => RECIPES.filter((r) => r.prepTime + r.cookTime <= 30).slice(0, 4), []);
  const [query, setQuery] = useState("");

  return (
    <div className="savorly-page">
      <section className="savorly-hero">
        <h1>What do you feel like<br />cooking today?</h1>
        <p>Search any dish, or start from a cuisine you're craving.</p>
        <div className="savorly-hero-search">
          <Search size={18} />
          <input
            aria-label="Search recipes"
            placeholder="Search any recipe — try “Bengali Fried Rice”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) {
              const results = searchRecipes(query, RECIPES);
              if (results[0]) onSelectRecipe(results[0]);
            } }}
          />
        </div>
      </section>

      <section className="savorly-section" id="cuisines">
        <h2>Explore cuisines</h2>
        <div className="savorly-cuisine-grid">
          {CUISINES.map((c) => (
            <button key={c.id} className="savorly-cuisine-card" onClick={() => onSelectCuisine(c.id)}>
              <div className="savorly-cuisine-art" style={{ background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})` }}>
                <span>{c.flag}</span>
              </div>
              <div className="savorly-cuisine-info">
                <strong>{c.name}</strong>
                <span>{RECIPES.filter((r) => r.cuisine === c.id).length} recipes</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="savorly-section" id="trending">
        <div className="savorly-section-head"><h2>Trending recipes</h2></div>
        <div className="savorly-recipe-grid">
          {trending.map((r) => <RecipeCard key={r.id} recipe={r} onClick={() => onSelectRecipe(r)} />)}
        </div>
      </section>

      <section className="savorly-section">
        <div className="savorly-section-head"><h2>Quick &amp; easy</h2><span className="savorly-section-sub">Ready in 30 minutes or less</span></div>
        <div className="savorly-recipe-grid">
          {quick.map((r) => <RecipeCard key={r.id} recipe={r} onClick={() => onSelectRecipe(r)} />)}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="savorly-section" aria-labelledby="recently-viewed-heading">
          <div className="savorly-section-head"><h2 id="recently-viewed-heading">Recently viewed</h2></div>
          <div className="savorly-recipe-grid">
            {recentlyViewed.map((r) => <RecipeCard key={r.id} recipe={r} onClick={() => onSelectRecipe(r)} />)}
          </div>
        </section>
      )}

      <button className="savorly-ask-chef" onClick={onOpenChef}>
        <div className="savorly-ask-chef-icon"><Sparkles size={22} /></div>
        <div>
          <h3>Not sure what to make?</h3>
          <p>Tell Chef AI what's in your fridge, or how much time you've got, and get matched recipes instantly.</p>
        </div>
      </button>
    </div>
  );
}

function CuisinePage({ cuisineId, onBack, onSelectRecipe, onOpenChef }) {
  const cuisine = CUISINE_MAP[cuisineId];
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 420); return () => clearTimeout(t); }, [cuisineId]);

  const pool = useMemo(() => RECIPES.filter((r) => r.cuisine === cuisineId), [cuisineId]);
  const results = useMemo(() => searchRecipes(query, pool), [query, pool]);

  return (
    <div className="savorly-page">
      <button className="savorly-back" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <section className="savorly-cuisine-hero" style={{ background: `linear-gradient(120deg, ${cuisine.grad[0]}22, ${cuisine.grad[1]}22)` }}>
        <span className="savorly-cuisine-hero-flag">{cuisine.flag}</span>
        <h1>{cuisine.name} Cuisine</h1>
        <p>{cuisine.tagline}</p>
      </section>

      <div className="savorly-search-bar">
        <Search size={18} />
        <input aria-label={`Search ${cuisine.name} recipes`} placeholder={`Search ${cuisine.name} recipes...`} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <section className="savorly-section">
        <h2>{query ? "Search results" : `Trending in ${cuisine.name} cuisine`}</h2>
        {loading ? (
          <Skeleton rows={pool.length || 3} />
        ) : results.length ? (
          <div className="savorly-recipe-grid">
            {results.map((r) => <RecipeCard key={r.id} recipe={r} onClick={() => onSelectRecipe(r)} />)}
          </div>
        ) : (
          <div className="savorly-empty">
            <p>We couldn't find that recipe yet. Try another name, or ask Chef AI.</p>
            <button className="savorly-btn" onClick={onOpenChef}>Ask Chef AI</button>
          </div>
        )}
      </section>
    </div>
  );
}

function RecipePage({ recipe, onBack, forceServings, onOpenChef }) {
  const [servings, setServings] = useState(recipe.baseServings);
  useEffect(() => { setServings(recipe.baseServings); }, [recipe.id]);
  useEffect(() => { if (forceServings) setServings(forceServings); }, [forceServings]);

  const scale = servings / recipe.baseServings;
  const cuisine = CUISINE_MAP[recipe.cuisine];
  const bestVideo = recipe.youtubeVideos[0];
  const otherVideos = recipe.youtubeVideos.slice(1);

  const extraSections = [
    recipe.tips.length && { title: "Cooking tips", content: <ul>{recipe.tips.map((t, i) => <li key={i}>{t}</li>)}</ul> },
    Object.keys(recipe.substitutions).length && { title: "Ingredient substitutions", content: <ul>{Object.entries(recipe.substitutions).map(([k, v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}</ul> },
    recipe.vegetarianAlt && { title: "Vegetarian alternative", content: <p>{recipe.vegetarianAlt}</p> },
    recipe.storage && { title: "Storage instructions", content: <p>{recipe.storage}</p> },
    recipe.regionalVariations && { title: "Regional variations", content: <p>{recipe.regionalVariations}</p> },
  ].filter(Boolean);

  return (
    <div className="savorly-page">
      <button className="savorly-back" onClick={onBack}><ArrowLeft size={16} /> Back</button>

      <section className="savorly-recipe-hero" style={{ background: `linear-gradient(135deg, ${cuisine.grad[0]}, ${cuisine.grad[1]})` }}>
        <div className="savorly-recipe-hero-overlay">
          {recipe.trending && <span className="savorly-trend-pill">🔥 Trending</span>}
          <h1>{recipe.title}</h1>
          <p>{recipe.description}</p>
        </div>
      </section>

      <div className="savorly-recipe-meta-row">
        <div><Star size={15} fill="#E2963A" color="#E2963A" /> {recipe.rating} rating</div>
        <div><Clock size={15} /> {recipe.prepTime} min prep</div>
        <div><Utensils size={15} /> {recipe.cookTime} min cook</div>
        <div><DifficultyBadge level={recipe.difficulty} /></div>
        <div className="savorly-spice-meta">Spice <SpiceLevel level={recipe.spice} /></div>
      </div>

      <div className="savorly-recipe-columns">
        <aside className="savorly-ingredients-col">
          <div className="savorly-servings-control">
            <span><Users size={15} /> Servings</span>
            <div className="savorly-servings-stepper">
              <button onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="Decrease servings"><Minus size={14} /></button>
              <strong>{servings}</strong>
              <button onClick={() => setServings((s) => s + 1)} aria-label="Increase servings"><Plus size={14} /></button>
            </div>
          </div>
          <h3>Ingredients</h3>
          <ul className="savorly-ingredient-list">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                <span className="savorly-ing-amount">{formatAmount(ing.amount * scale)}{ing.unit ? ` ${ing.unit}` : ""}</span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="savorly-instructions-col">
          <h3>Instructions</h3>
          <ol className="savorly-steps">
            {recipe.instructions.map((step, i) => (
              <li key={i}>
                <span className="savorly-step-num">{i + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          {extraSections.length > 0 && (
            <div className="savorly-extras">
              {extraSections.map((s) => <Accordion key={s.title} title={s.title}>{s.content}</Accordion>)}
            </div>
          )}
        </main>
      </div>

      <section className="savorly-section">
        <h2>Recommended video search</h2>
        <div className="savorly-video-best">
          <div className="savorly-video-thumb" style={{ background: `linear-gradient(135deg, ${cuisine.grad[0]}, ${cuisine.grad[1]})` }}>
            <PlayCircle size={40} color="#fff" />
          </div>
          <div className="savorly-video-info">
            <strong>{bestVideo.title}</strong>
            <span>{bestVideo.channel} · {bestVideo.views} · {bestVideo.date}</span>
            <div className="savorly-video-meta-row">
              <span><Clock size={12} /> {bestVideo.duration}</span>
              <span className="savorly-relevance">{bestVideo.relevance}% relevant</span>
            </div>
            <a href={bestVideo.url} target="_blank" rel="noreferrer" className="savorly-btn savorly-btn-small">
              Find on YouTube <ExternalLink size={13} />
            </a>
          </div>
        </div>
        {otherVideos.length > 0 && (
          <>
            <h3 className="savorly-subhead">Other YouTube searches</h3>
            <div className="savorly-video-alts">
              {otherVideos.map((v, i) => (
                <a key={i} href={v.url} target="_blank" rel="noreferrer" className="savorly-video-alt">
                  <div className="savorly-video-alt-thumb"><PlayCircle size={20} /></div>
                  <div>
                    <strong>{v.title}</strong>
                    <span>{v.channel} · {v.views} · {v.duration}</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </section>

      <button className="savorly-recipe-chef-cta" onClick={onOpenChef}>
        <ChefHat size={20} />
        <span>Ask Chef AI about {recipe.title} — substitutions, spice, servings, anything.</span>
      </button>
    </div>
  );
}

/* ============================= APP ROOT ============================= */

export default function Savorly() {
  const [view, setView] = useState("home");
  const [cuisineId, setCuisineId] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [chefOpen, setChefOpen] = useState(false);
  const [forcedServings, setForcedServings] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const setRoute = (hash) => {
    if (window.location.hash !== hash) window.location.hash = hash;
  };

  const syncRoute = () => {
    const [kind, id] = window.location.hash.replace(/^#\/?/, "").split("/");
    if (kind === "recipe") {
      const nextRecipe = RECIPES.find((item) => item.id === id);
      if (nextRecipe) {
        setRecipe(nextRecipe); setCuisineId(nextRecipe.cuisine); setView("recipe");
        return;
      }
    }
    if (kind === "cuisine" && CUISINE_MAP[id]) {
      setCuisineId(id); setRecipe(null); setView("cuisine");
      return;
    }
    setView("home"); setCuisineId(null); setRecipe(null);
  };

  useEffect(() => {
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    const title = recipe ? `${recipe.title} | Savorly` : view === "cuisine" ? `${CUISINE_MAP[cuisineId]?.name ?? "Cuisine"} recipes | Savorly` : "Savorly | Find your next favorite recipe";
    document.title = title;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view, cuisineId, recipe]);

  const goHome = () => { setRoute(""); setView("home"); setCuisineId(null); setRecipe(null); setMobileNavOpen(false); };
  const goCuisine = (id) => { setRoute(`#cuisine/${id}`); setCuisineId(id); setRecipe(null); setView("cuisine"); setMobileNavOpen(false); };
  const goRecipe = (r) => {
    setRoute(`#recipe/${r.id}`); setRecipe(r); setForcedServings(null); setView("recipe"); setMobileNavOpen(false);
    setRecentlyViewed((prev) => [r, ...prev.filter((x) => x.id !== r.id)].slice(0, 4));
  };

  const navigateHomeSection = (sectionId) => {
    goHome();
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  return (
    <div className="savorly-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .savorly-app {
          --cream: #FBF6EE; --cream-deep: #F1E7D6; --ink: #2A2420; --ink-soft: #6B5D52;
          --saffron: #E2963A; --paprika: #B5432A; --basil: #3F5C4E;
          --glass: rgba(255,255,255,0.6); --glass-border: rgba(255,255,255,0.8);
          --shadow: rgba(60,40,20,0.10);
          font-family: 'Manrope', sans-serif; color: var(--ink); background: var(--cream);
          min-height: 100vh; position: relative;
        }
        .savorly-app h1, .savorly-app h2, .savorly-app h3 { font-family: 'Fraunces', serif; margin: 0; }
        .savorly-app * { box-sizing: border-box; }
        .savorly-app button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
        .savorly-app ul, .savorly-app ol { padding: 0; margin: 0; list-style: none; }
        .savorly-app a { color: inherit; text-decoration: none; }
        .savorly-skip-link { position: fixed; left: 16px; top: -48px; z-index: 100; padding: 10px 14px; border-radius: 8px; background: var(--ink); color: #fff; font-weight: 700; }
        .savorly-skip-link:focus { top: 16px; }
        .savorly-app button:focus-visible, .savorly-app a:focus-visible, .savorly-app input:focus-visible { outline: 3px solid var(--saffron); outline-offset: 3px; }

        .savorly-nav { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between;
          padding: 14px 28px; background: var(--glass); backdrop-filter: blur(16px); border-bottom: 1px solid var(--glass-border); }
        .savorly-logo { font-family: 'Fraunces', serif; font-weight: 600; font-size: 22px; letter-spacing: -0.02em; cursor: pointer; }
        .savorly-nav-links { display: flex; gap: 26px; font-size: 14.5px; font-weight: 500; color: var(--ink-soft); }
        .savorly-nav-links button:hover { color: var(--ink); }
        .savorly-nav-right { display: flex; align-items: center; gap: 10px; }
        .savorly-chef-btn { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 999px;
          background: linear-gradient(135deg, var(--saffron), var(--paprika)); color: white; font-weight: 600; font-size: 13.5px;
          box-shadow: 0 4px 14px rgba(181,67,42,0.25); }
        .savorly-icon-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; }
        .savorly-icon-btn:hover { background: rgba(0,0,0,0.05); }

        .savorly-page { max-width: 1180px; margin: 0 auto; padding: 36px 28px 100px; }
        .savorly-hero { text-align: center; padding: 60px 20px 40px; }
        .savorly-hero h1 { font-size: 44px; line-height: 1.15; font-weight: 600; }
        .savorly-hero p { color: var(--ink-soft); margin-top: 14px; font-size: 16px; }
        .savorly-hero-search { max-width: 560px; margin: 30px auto 0; display: flex; align-items: center; gap: 10px;
          background: var(--glass); border: 1px solid var(--glass-border); border-radius: 999px; padding: 14px 20px;
          backdrop-filter: blur(10px); box-shadow: 0 8px 24px var(--shadow); }
        .savorly-hero-search input { border: none; background: none; outline: none; width: 100%; font-size: 15px; color: var(--ink); }

        .savorly-section { margin-top: 52px; }
        .savorly-section h2 { font-size: 24px; font-weight: 600; margin-bottom: 18px; }
        .savorly-section-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 18px; }
        .savorly-section-sub { color: var(--ink-soft); font-size: 13.5px; }

        .savorly-cuisine-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        .savorly-cuisine-card { border-radius: 20px; overflow: hidden; background: var(--glass); border: 1px solid var(--glass-border);
          box-shadow: 0 6px 20px var(--shadow); transition: transform .25s ease, box-shadow .25s ease; text-align: left; }
        .savorly-cuisine-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px var(--shadow); }
        .savorly-cuisine-art { height: 90px; display: flex; align-items: center; justify-content: center; font-size: 30px; }
        .savorly-cuisine-info { padding: 12px 14px 14px; }
        .savorly-cuisine-info strong { display: block; font-size: 15px; }
        .savorly-cuisine-info span { font-size: 12px; color: var(--ink-soft); }

        .savorly-recipe-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .savorly-card { border-radius: 20px; overflow: hidden; text-align: left; background: var(--glass);
          border: 1px solid var(--glass-border); box-shadow: 0 6px 20px var(--shadow); transition: transform .25s ease, box-shadow .25s ease; }
        .savorly-recipe-card:hover { transform: translateY(-5px); box-shadow: 0 16px 34px var(--shadow); }
        .savorly-recipe-card:hover .savorly-art { transform: scale(1.06); }
        .savorly-card-media { position: relative; overflow: hidden; }
        .savorly-art { display: flex; align-items: center; justify-content: center; position: relative; transition: transform .4s ease; }
        .savorly-art-shine { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(255,255,255,0.25), transparent 55%); }
        .savorly-trend-pill { position: absolute; top: 10px; left: 10px; display: flex; align-items: center; gap: 4px;
          background: rgba(0,0,0,0.55); color: #fff; font-size: 11px; padding: 4px 9px; border-radius: 999px; backdrop-filter: blur(4px); }
        .savorly-card-body { padding: 14px 16px 16px; }
        .savorly-card-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .savorly-cuisine-tag { font-size: 11.5px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.04em; }
        .savorly-rating { display: flex; align-items: center; gap: 3px; font-size: 12.5px; font-weight: 600; }
        .savorly-card-title { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
        .savorly-card-desc { font-size: 12.8px; color: var(--ink-soft); line-height: 1.4; margin-bottom: 10px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .savorly-card-meta { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--ink-soft); }
        .savorly-card-meta > span { display: flex; align-items: center; gap: 4px; }

        .savorly-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
        .savorly-badge-easy { background: #E4EFE1; color: var(--basil); }
        .savorly-badge-medium { background: #FBEBD3; color: #9A6B1E; }
        .savorly-badge-hard { background: #F6DEDA; color: var(--paprika); }
        .savorly-spice { display: inline-flex; gap: 1px; }

        .savorly-ask-chef { margin-top: 56px; display: flex; align-items: center; gap: 20px; padding: 26px 28px; border-radius: 22px;
          background: linear-gradient(120deg, rgba(226,150,58,0.16), rgba(181,67,42,0.10)); border: 1px solid var(--glass-border); cursor: pointer;
          transition: transform .2s ease; text-align: left; width: 100%; }
        .savorly-ask-chef:hover { transform: translateY(-3px); }
        .savorly-ask-chef-icon { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--saffron), var(--paprika)); color: #fff; flex-shrink: 0; }
        .savorly-ask-chef h3 { font-size: 18px; margin-bottom: 4px; }
        .savorly-ask-chef p { margin: 0; font-size: 13.5px; color: var(--ink-soft); }

        .savorly-back { display: flex; align-items: center; gap: 6px; font-size: 13.5px; color: var(--ink-soft); margin-bottom: 22px; }
        .savorly-back:hover { color: var(--ink); }

        .savorly-cuisine-hero { text-align: center; padding: 44px 20px; border-radius: 24px; margin-bottom: 26px; }
        .savorly-cuisine-hero-flag { font-size: 40px; }
        .savorly-cuisine-hero h1 { font-size: 32px; margin-top: 8px; }
        .savorly-cuisine-hero p { color: var(--ink-soft); margin-top: 8px; max-width: 480px; margin-left: auto; margin-right: auto; }

        .savorly-search-bar { display: flex; align-items: center; gap: 10px; background: var(--glass); border: 1px solid var(--glass-border);
          border-radius: 999px; padding: 13px 20px; backdrop-filter: blur(10px); max-width: 480px; margin: 0 auto 8px; box-shadow: 0 6px 18px var(--shadow); }
        .savorly-search-bar input { border: none; outline: none; background: none; width: 100%; font-size: 14.5px; }

        .savorly-empty { text-align: center; padding: 50px 20px; color: var(--ink-soft); }
        .savorly-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 10px 20px; border-radius: 999px;
          background: linear-gradient(135deg, var(--saffron), var(--paprika)); color: #fff; font-weight: 600; font-size: 13.5px; }
        .savorly-btn-small { margin-top: 12px; padding: 9px 16px; font-size: 13px; }

        .savorly-skeleton-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .savorly-skeleton-card { border-radius: 20px; padding: 14px; background: var(--glass); border: 1px solid var(--glass-border); }
        .savorly-skel { background: linear-gradient(90deg, #ECE3D4 25%, #F5EEE2 37%, #ECE3D4 63%); background-size: 400% 100%;
          animation: savorly-shimmer 1.4s ease infinite; border-radius: 8px; }
        .savorly-skel-media { height: 130px; margin-bottom: 12px; border-radius: 14px; }
        .savorly-skel-line { height: 12px; margin-top: 8px; }
        @keyframes savorly-shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

        .savorly-recipe-hero { position: relative; border-radius: 26px; height: 260px; display: flex; align-items: flex-end; overflow: hidden; }
        .savorly-recipe-hero-overlay { padding: 30px; color: #fff; background: linear-gradient(0deg, rgba(0,0,0,0.45), transparent 70%); width: 100%; }
        .savorly-recipe-hero-overlay h1 { font-size: 34px; color: #fff; }
        .savorly-recipe-hero-overlay p { margin-top: 6px; opacity: 0.92; font-size: 14.5px; max-width: 520px; }

        .savorly-recipe-meta-row { display: flex; flex-wrap: wrap; gap: 22px; align-items: center; padding: 18px 4px; font-size: 13.5px;
          color: var(--ink-soft); border-bottom: 1px solid rgba(0,0,0,0.06); margin-bottom: 30px; }
        .savorly-recipe-meta-row > div { display: flex; align-items: center; gap: 6px; }
        .savorly-spice-meta { display: flex; align-items: center; gap: 6px; }

        .savorly-recipe-columns { display: grid; grid-template-columns: 300px 1fr; gap: 40px; }
        .savorly-ingredients-col h3, .savorly-instructions-col h3 { font-size: 18px; margin-bottom: 14px; }
        .savorly-servings-control { display: flex; align-items: center; justify-content: space-between; background: var(--glass);
          border: 1px solid var(--glass-border); border-radius: 14px; padding: 12px 16px; margin-bottom: 22px; font-size: 13.5px; font-weight: 600; }
        .savorly-servings-control span { display: flex; align-items: center; gap: 6px; }
        .savorly-servings-stepper { display: flex; align-items: center; gap: 12px; }
        .savorly-servings-stepper button { width: 26px; height: 26px; border-radius: 50%; background: rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; }
        .savorly-ingredient-list li { display: flex; justify-content: space-between; gap: 12px; padding: 9px 0; font-size: 14px;
          border-bottom: 1px dashed rgba(0,0,0,0.08); }
        .savorly-ing-amount { font-weight: 700; color: var(--basil); white-space: nowrap; }

        .savorly-steps li { display: flex; gap: 16px; margin-bottom: 22px; }
        .savorly-step-num { flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), var(--paprika));
          color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
        .savorly-steps strong { font-size: 15px; }
        .savorly-steps p { margin-top: 4px; font-size: 13.8px; color: var(--ink-soft); line-height: 1.5; }

        .savorly-extras { margin-top: 30px; }
        .savorly-accordion { border-top: 1px solid rgba(0,0,0,0.08); }
        .savorly-accordion:last-child { border-bottom: 1px solid rgba(0,0,0,0.08); }
        .savorly-accordion-head { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 14px 2px; font-weight: 600; font-size: 14.5px; }
        .savorly-accordion-body { padding: 0 2px 16px; font-size: 13.8px; color: var(--ink-soft); line-height: 1.6; }
        .savorly-accordion-body li { margin-bottom: 6px; }

        .savorly-subhead { font-size: 15px; margin: 22px 0 12px; }
        .savorly-video-best { display: flex; gap: 20px; background: var(--glass); border: 1px solid var(--glass-border); border-radius: 20px; padding: 18px; box-shadow: 0 8px 22px var(--shadow); }
        .savorly-video-thumb { width: 220px; height: 130px; border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .savorly-video-info { display: flex; flex-direction: column; gap: 4px; }
        .savorly-video-info strong { font-size: 16px; }
        .savorly-video-info span { font-size: 13px; color: var(--ink-soft); }
        .savorly-video-meta-row { display: flex; gap: 14px; font-size: 12.5px; color: var(--ink-soft); margin-top: 4px; }
        .savorly-video-meta-row span { display: flex; align-items: center; gap: 4px; }
        .savorly-relevance { color: var(--basil); font-weight: 700; }
        .savorly-video-alts { display: flex; flex-direction: column; gap: 10px; }
        .savorly-video-alt { display: flex; gap: 12px; align-items: center; padding: 10px 12px; border-radius: 14px; background: var(--glass);
          border: 1px solid var(--glass-border); }
        .savorly-video-alt:hover { background: rgba(255,255,255,0.85); }
        .savorly-video-alt-thumb { width: 40px; height: 40px; border-radius: 10px; background: var(--cream-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .savorly-video-alt strong { display: block; font-size: 13.5px; }
        .savorly-video-alt span { font-size: 11.5px; color: var(--ink-soft); }

        .savorly-recipe-chef-cta { margin-top: 40px; display: flex; align-items: center; gap: 12px; padding: 18px 22px; border-radius: 18px;
          background: rgba(63,92,78,0.10); border: 1px solid rgba(63,92,78,0.18); cursor: pointer; font-size: 14px; font-weight: 600; color: var(--basil); }

        .savorly-chef-panel { position: fixed; bottom: 24px; right: 24px; width: 380px; max-height: 620px; display: flex; flex-direction: column;
          background: var(--glass); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 22px; box-shadow: 0 20px 50px rgba(0,0,0,0.18);
          z-index: 50; overflow: hidden; }
        .savorly-chef-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .savorly-chef-head-left { display: flex; align-items: center; gap: 10px; }
        .savorly-chef-icon { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), var(--paprika));
          color: #fff; display: flex; align-items: center; justify-content: center; }
        .savorly-chef-context { font-size: 11.5px; color: var(--ink-soft); }
        .savorly-chef-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-height: 200px; }
        .savorly-chat-row { display: flex; }
        .savorly-chat-ai { justify-content: flex-start; }
        .savorly-chat-user { justify-content: flex-end; }
        .savorly-chat-bubble { max-width: 88%; padding: 10px 14px; border-radius: 16px; font-size: 13.5px; line-height: 1.5; }
        .savorly-chat-ai .savorly-chat-bubble { background: rgba(255,255,255,0.85); border: 1px solid var(--glass-border); border-bottom-left-radius: 4px; }
        .savorly-chat-user .savorly-chat-bubble { background: linear-gradient(135deg, var(--saffron), var(--paprika)); color: #fff; border-bottom-right-radius: 4px; }
        .savorly-chat-suggestions { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
        .savorly-mini-card { display: flex; gap: 10px; align-items: center; background: rgba(255,255,255,0.7); border: 1px solid var(--glass-border);
          border-radius: 12px; padding: 8px; text-align: left; }
        .savorly-mini-card:hover { background: #fff; }
        .savorly-mini-thumb { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .savorly-mini-info { display: flex; flex-direction: column; }
        .savorly-mini-info strong { font-size: 12.8px; }
        .savorly-mini-info span { font-size: 11px; color: var(--ink-soft); }
        .savorly-chef-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
        .savorly-chip { font-size: 11.5px; padding: 6px 11px; border-radius: 999px; background: rgba(0,0,0,0.05); color: var(--ink-soft); }
        .savorly-chip:hover { background: rgba(0,0,0,0.09); }
        .savorly-chef-input-row { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid rgba(0,0,0,0.06); }
        .savorly-chef-input-row input { flex: 1; border: 1px solid rgba(0,0,0,0.1); border-radius: 999px; padding: 10px 14px; font-size: 13px; outline: none; background: #fff; }
        .savorly-send-btn { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), var(--paprika)); color: #fff;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .savorly-chef-fab { position: fixed; bottom: 24px; right: 24px; display: flex; align-items: center; gap: 8px; padding: 14px 22px; border-radius: 999px;
          background: linear-gradient(135deg, var(--saffron), var(--paprika)); color: #fff; font-weight: 700; font-size: 14px; box-shadow: 0 10px 28px rgba(181,67,42,0.35);
          z-index: 40; }
        .savorly-chef-fab:hover { transform: translateY(-2px); }

        @media (max-width: 900px) {
          .savorly-nav-links { display: none; }
          .savorly-nav-links.savorly-nav-links-open { display: flex; position: absolute; top: calc(100% + 8px); right: 20px; flex-direction: column; align-items: stretch; min-width: 180px; padding: 8px; border: 1px solid var(--glass-border); border-radius: 14px; background: rgba(255,255,255,0.96); box-shadow: 0 12px 28px var(--shadow); }
          .savorly-nav-links.savorly-nav-links-open button { padding: 10px; text-align: left; }
          .savorly-mobile-menu { display: inline-flex; }
          .savorly-cuisine-grid { grid-template-columns: repeat(3, 1fr); }
          .savorly-recipe-grid, .savorly-skeleton-grid { grid-template-columns: repeat(2, 1fr); }
          .savorly-recipe-columns { grid-template-columns: 1fr; }
          .savorly-hero h1 { font-size: 32px; }
          .savorly-chef-panel { width: calc(100vw - 24px); right: 12px; left: 12px; bottom: 12px; max-height: 70vh; }
          .savorly-chef-fab { right: 16px; bottom: 16px; padding: 12px 18px; }
        }
        @media (max-width: 560px) {
          .savorly-cuisine-grid { grid-template-columns: repeat(2, 1fr); }
          .savorly-recipe-grid, .savorly-skeleton-grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 901px) { .savorly-mobile-menu { display: none; } }
        @media (prefers-reduced-motion: reduce) { .savorly-app *, .savorly-app *::before, .savorly-app *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      <a className="savorly-skip-link" href="#main-content">Skip to content</a>
      <nav className="savorly-nav">
        <button className="savorly-logo" onClick={goHome} aria-label="Savorly home">Savorly</button>
        <div className={`savorly-nav-links ${mobileNavOpen ? "savorly-nav-links-open" : ""}`}>
          <button onClick={goHome}>Explore</button>
          <button onClick={() => navigateHomeSection("cuisines")}>Cuisines</button>
          <button onClick={() => navigateHomeSection("trending")}>Trending</button>
        </div>
        <div className="savorly-nav-right">
          <button className="savorly-icon-btn" onClick={goHome} aria-label="Explore recipes"><Search size={18} /></button>
          <button className="savorly-chef-btn" onClick={() => setChefOpen(true)}><Sparkles size={14} /> Chef AI</button>
          <button className="savorly-icon-btn savorly-mobile-menu" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={mobileNavOpen}><Menu size={18} /></button>
        </div>
      </nav>

      <main id="main-content" tabIndex="-1">
      {view === "home" && <HomePage onSelectCuisine={goCuisine} onSelectRecipe={goRecipe} onOpenChef={() => setChefOpen(true)} recentlyViewed={recentlyViewed} />}
      {view === "cuisine" && <CuisinePage cuisineId={cuisineId} onBack={goHome} onSelectRecipe={goRecipe} onOpenChef={() => setChefOpen(true)} />}
      {view === "recipe" && recipe && (
        <RecipePage recipe={recipe} onBack={() => setView(cuisineId ? "cuisine" : "home")} forceServings={forcedServings} onOpenChef={() => setChefOpen(true)} />
      )}
      </main>

      {!chefOpen && (
        <button className="savorly-chef-fab" onClick={() => setChefOpen(true)}>
          <Sparkles size={16} /> Chef AI
        </button>
      )}
      <ChefAI
        open={chefOpen}
        onClose={() => setChefOpen(false)}
        currentRecipe={view === "recipe" ? recipe : null}
        onNavigateRecipe={(r) => { goRecipe(r); }}
        allRecipes={RECIPES}
        onSetServings={(s) => setForcedServings(s)}
      />
    </div>
  );
}
