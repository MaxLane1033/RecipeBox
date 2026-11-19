import type { ExperienceLevel, RecipeData, RecipeFilters } from '@/web/types/domain';

export const FEATURED_RECIPES = [
  'Garlic butter pasta',
  'Chili crisp noodles',
  'Veggie fried rice',
  'Shakshuka',
];

export const RECIPE_PHOTOS: Record<string, string> = {
  'Garlic butter pasta':
    'https://images.unsplash.com/photo-1606568151065-da701d323255?auto=format&fit=crop&w=900&q=80',
  'Chili crisp noodles':
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80',
  'Veggie fried rice':
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80',
  'Egg fried rice':
    'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&w=900&q=80',
  Shakshuka: 'https://images.unsplash.com/photo-1682622110419-b671026a4536?auto=format&fit=crop&w=900&q=80',
  'Crispy smashed potatoes':
    'https://images.unsplash.com/photo-1777229987480-d19f32acc68f?auto=format&fit=crop&w=900&q=80',
  'Dice an onion':
    'https://images.pexels.com/photos/7140315/pexels-photo-7140315.jpeg?auto=compress&cs=tinysrgb&w=900',
  'Crack an egg':
    'https://images.pexels.com/photos/7525037/pexels-photo-7525037.jpeg?auto=compress&cs=tinysrgb&w=900',
  Fridge: 'https://images.unsplash.com/photo-1737363625030-164e39339156?auto=format&fit=crop&w=900&q=80',
  'Sheet pan chicken':
    'https://images.unsplash.com/photo-1523813301608-f54a198f6b5f?auto=format&fit=crop&w=900&q=80',
  'Italian basics':
    'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&w=900&q=80',
};

export const COOKING_LEVELS = ['Starter', 'Home cook', 'Skilled', 'Chef'] as const;

export const RECIPE_LEVELS: Record<string, ExperienceLevel> = {
  'Garlic butter pasta': 'Starter',
  'Chili crisp noodles': 'Starter',
  'Egg fried rice': 'Starter',
  'Crispy smashed potatoes': 'Starter',
  'Veggie fried rice': 'Home cook',
  'Sheet pan chicken': 'Home cook',
  Shakshuka: 'Skilled',
};

export const PASTA_STEPS: [string, string, number][] = [
  ['Gather ingredients', 'Set out the spaghetti, butter, garlic, and parmesan.', 3],
  ['Mince the garlic', 'Chop the garlic finely and evenly so it cooks gently.', 4],
  ['Boil the water', 'Bring well-salted water to a rolling boil.', 8],
  ['Cook the pasta', 'Cook until just tender, then save a cup of pasta water.', 10],
  ['Make the garlic butter', 'Gently cook the garlic in melted butter until fragrant. Keep the heat low.', 5],
  ['Toss and serve', 'Toss pasta with the butter and a splash of pasta water.', 3],
];

export const defineRecipe = (
  cuisine: string,
  diet: string[],
  macro: string[],
  has: string[],
  dishes: number,
  blurb: string,
  ing: [number, string, string][],
  steps: [string, string, number][],
): RecipeData => ({ cuisine, diet, macro, has, dishes, blurb, ing, steps });

export const RECIPES: Record<string, RecipeData> = {
  'Garlic butter pasta': defineRecipe(
    'Italian',
    ['Vegetarian'],
    [],
    ['Pasta', 'Garlic'],
    2,
    'Silky, simple, and hard to get wrong.',
    [
      [100, 'g', 'spaghetti'],
      [1, 'tbsp', 'butter'],
      [1, '', 'garlic cloves'],
      [0, '', 'Parmesan and black pepper to taste'],
    ],
    PASTA_STEPS,
  ),
  'Chili crisp noodles': defineRecipe(
    'Asian',
    ['Vegetarian', 'Vegan'],
    [],
    ['Garlic'],
    2,
    'Spicy, savory noodles in ten minutes of real work.',
    [
      [100, 'g', 'wheat noodles'],
      [1, 'tbsp', 'chili crisp'],
      [1, 'tbsp', 'soy sauce'],
      [1, '', 'scallions'],
    ],
    [
      ['Boil the noodles', 'Cook noodles until just tender, then drain.', 8],
      ['Mix the sauce', 'Stir chili crisp, soy sauce, and a little sugar.', 3],
      ['Toss', 'Toss hot noodles with the sauce.', 2],
      ['Top and serve', 'Add scallions and a soft egg if you like.', 3],
    ],
  ),
  'Egg fried rice': defineRecipe(
    'Asian',
    ['Vegetarian', 'Gluten-free'],
    ['High protein', 'Under 500 cal'],
    ['Eggs', 'Rice'],
    2,
    'The best way to use leftover rice.',
    [
      [1, 'cup', 'cooked rice'],
      [1, '', 'eggs'],
      [1, 'tbsp', 'soy sauce'],
      [1, '', 'scallions'],
    ],
    [
      ['Prep', 'Chop scallions and beat the eggs.', 5],
      ['Scramble the eggs', 'Cook eggs softly in a hot pan, then set aside.', 3],
      ['Fry the rice', 'Fry cold rice until it starts to crisp.', 6],
      ['Combine', 'Stir in eggs, soy sauce, and scallions.', 3],
    ],
  ),
  'Crispy smashed potatoes': defineRecipe(
    'American',
    ['Vegetarian', 'Vegan', 'Gluten-free'],
    ['High fiber'],
    ['Potatoes'],
    2,
    'Crunchy edges, fluffy middles.',
    [
      [200, 'g', 'baby potatoes'],
      [1, 'tbsp', 'olive oil'],
      [0, '', 'Flaky salt and pepper'],
    ],
    [
      ['Boil the potatoes', 'Simmer until a knife slides in easily.', 20],
      ['Smash', 'Press each potato flat with a mug or glass.', 4],
      ['Season', 'Brush with oil and sprinkle with salt.', 2],
      ['Roast', 'Bake hot until the edges are deeply golden.', 25],
    ],
  ),
  'Veggie fried rice': defineRecipe(
    'Asian',
    ['Vegetarian', 'Vegan', 'Gluten-free'],
    ['High fiber', 'Under 500 cal'],
    ['Rice'],
    2,
    'A fridge-cleanout dinner that always works.',
    [
      [1, 'cup', 'cooked rice'],
      [1, '', 'carrots'],
      [0.5, '', 'bell peppers'],
      [1, 'tbsp', 'soy sauce'],
    ],
    [
      ['Chop the vegetables', 'Dice carrot, pepper, and onion small and even.', 8],
      ['Cook the vegetables', 'Stir-fry until just tender.', 6],
      ['Add the rice', 'Fry cold rice with the vegetables.', 6],
      ['Season', 'Finish with soy sauce and sesame oil.', 2],
    ],
  ),
  'Sheet pan chicken': defineRecipe(
    'American',
    ['Gluten-free'],
    ['High protein'],
    ['Chicken', 'Potatoes'],
    1,
    'One pan, almost no cleanup.',
    [
      [1, '', 'chicken thighs'],
      [150, 'g', 'potatoes'],
      [1, '', 'carrots'],
      [1, 'tbsp', 'olive oil'],
    ],
    [
      ['Prep the chicken', 'Pat chicken dry and season well.', 5],
      ['Chop the vegetables', 'Cut vegetables into even, bite-size pieces.', 8],
      ['Roast', 'Roast everything on one pan until golden.', 30],
      ['Rest and serve', 'Rest the chicken before slicing.', 5],
    ],
  ),
  Shakshuka: defineRecipe(
    'Middle Eastern',
    ['Vegetarian', 'Gluten-free'],
    ['High protein', 'High fiber', 'Under 500 cal'],
    ['Eggs', 'Tomatoes', 'Garlic'],
    2,
    'Eggs poached in a spiced tomato sauce.',
    [
      [1, 'can', 'crushed tomatoes (400g)'],
      [1, '', 'eggs'],
      [1, '', 'garlic cloves'],
      [1, 'tsp', 'cumin'],
    ],
    [
      ['Chop and sauté', 'Soften onion and pepper in olive oil.', 8],
      ['Build the sauce', 'Add garlic, spices, and canned tomatoes.', 8],
      ['Simmer', 'Cook until thickened.', 10],
      ['Add the eggs', 'Make wells, crack in eggs, cover, and cook until set.', 8],
    ],
  ),
};

export const FALLBACK_RECIPE: RecipeData = defineRecipe(
  'Other',
  [],
  [],
  [],
  2,
  'A recipe you added.',
  [[0, '', 'Your ingredients']],
  [
    ['Prep', 'Get everything ready.', 10],
    ['Cook', 'Cook as written.', 15],
    ['Serve', 'Plate and enjoy.', 5],
  ],
);

export const LEVEL_TIME_FACTORS = [1.15, 1, 0.9, 0.8];

export const DEFAULT_FILTERS: RecipeFilters = {
  ings: [],
  time: 90,
  dishes: 6,
  cuisine: [],
  diet: [],
  levels: [],
  macros: [],
};
