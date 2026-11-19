import { RECIPE_LEVELS } from '@/web/data/recipes';
import { getOriginalVersionId } from '@/web/data/versions';
import { formatDate } from '@/web/lib/format';
import { getRecipe } from '@/web/lib/recipes';
import type { MealLogEntry } from '@/web/types/domain';

export const createInitialMealLog = (): MealLogEntry[] => {
  const out: MealLogEntry[] = [];
  const t = new Date();
  const names = Object.keys(RECIPE_LEVELS);
  for (let d = 1; d < 200 && out.length < 24; d++) {
    const dt = new Date(t.getFullYear(), t.getMonth(), t.getDate() - d);
    const n = d <= 5 ? 1 : (d * 5) % 7 < 3 ? (d % 4 === 0 ? 2 : 1) : 0;
    for (let k = 0; k < n && out.length < 24; k++)
      out.push({
        id: `seed-${d}-${k}`,
        date: formatDate(dt),
        title: names[(d + k) % names.length],
        recipeName: names[(d + k) % names.length],
        versionId: getOriginalVersionId(names[(d + k) % names.length]),
        versionName: 'Original',
        recipeSnapshot: structuredClone(getRecipe(names[(d + k) % names.length])),
      });
  }
  return out;
};
