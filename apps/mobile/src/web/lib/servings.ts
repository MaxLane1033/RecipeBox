/** Only accept the serving counts supported by the recipe page's stepper. */
export function parseRecipeServings(value: unknown): number | undefined {
  const count =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value)
        : Number.NaN;
  return Number.isInteger(count) && count >= 2 && count <= 4 ? count : undefined;
}

export type RecipeServingsSearch = {
  servings?: number;
};
