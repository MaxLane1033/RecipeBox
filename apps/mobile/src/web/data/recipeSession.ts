import { RECIPE_LEVELS, RECIPES } from '@/web/data/recipes';

// Import/write flows add entries at runtime. Keep their scope to the signed-in account.
const originalRecipes = new Map(Object.entries(RECIPES));
const originalLevels = new Map(Object.entries(RECIPE_LEVELS));

function restoreEntries<T>(catalogue: Record<string, T>, original: Map<string, T>) {
  for (const name of Object.keys(catalogue)) {
    if (!original.has(name)) delete catalogue[name];
  }
  for (const [name, value] of original) {
    Object.defineProperty(catalogue, name, {
      value,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  }
}

/** Idempotent across account remounts and React StrictMode effect replays. */
export function resetRecipeCatalogue() {
  restoreEntries(RECIPES, originalRecipes);
  restoreEntries(RECIPE_LEVELS, originalLevels);
}
