import {
  COOKING_LEVELS,
  FALLBACK_RECIPE,
  LEVEL_TIME_FACTORS,
  RECIPE_LEVELS,
  RECIPES,
} from '@/web/data/recipes';
import type { ExperienceLevel, RecipeData, RecipeFilters } from '@/web/types/domain';

export const getRecipe = (n: string) => RECIPES[n] || FALLBACK_RECIPE;

export const estimateRecipeMinutes = (recipe: RecipeData, l: ExperienceLevel) =>
  Math.max(
    5,
    Math.round(
      (recipe.steps.reduce((a, x) => a + x[2], 0) * LEVEL_TIME_FACTORS[COOKING_LEVELS.indexOf(l)]) / 5,
    ) * 5,
  );

export const estimateMinutes = (n: string, l: ExperienceLevel) => estimateRecipeMinutes(getRecipe(n), l);

export const formatIngredient = (i: [number, string, string], sv: number) =>
  i[0] ? `${Number((i[0] * sv).toFixed(1))}${i[1] ? ` ${i[1]}` : ''} ${i[2]}` : i[2];

export const matchesFilters = (n: string, f: RecipeFilters, l: ExperienceLevel) => {
  const r = getRecipe(n);
  return (
    (!f.ings.length || f.ings.some((i) => r.has.includes(i))) &&
    estimateMinutes(n, l) <= f.time &&
    r.dishes <= f.dishes &&
    (!f.cuisine.length || f.cuisine.includes(r.cuisine)) &&
    f.diet.every((d) => r.diet.includes(d)) &&
    f.macros.every((m) => r.macro.includes(m)) &&
    (!f.levels.length || f.levels.includes(RECIPE_LEVELS[n]))
  );
};
