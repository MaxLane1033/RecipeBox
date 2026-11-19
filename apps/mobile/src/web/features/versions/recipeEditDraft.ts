/** Match the rounded quantities displayed on the recipe page. */
export function displayIngredientAmount(amount: number, servings: number) {
  return amount ? String(Number((amount * servings).toFixed(1))) : '';
}

/** Keep untouched canonical values precise even when their display was rounded. */
export function savedIngredientAmount(
  amount: string,
  servings: number,
  originalAmount: number | null,
  initialDisplayAmount: string,
) {
  const entered = amount.trim();
  const unchanged =
    entered === initialDisplayAmount ||
    (entered !== '' && initialDisplayAmount !== '' && Number(entered) === Number(initialDisplayAmount));
  if (originalAmount !== null && unchanged) return originalAmount;
  return Number((Number(entered) / servings).toFixed(12));
}
