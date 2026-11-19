import { RecipePage } from '@/web/features/recipes/RecipePage';
import { parseRecipeServings } from '@/web/lib/servings';
import { useRouteValues } from '@/web/navigation/navigation';

type RecipeSearch = {
  servings?: number;
  view?: 'mine';
};
const validateSearch = (search: Record<string, unknown>): RecipeSearch => ({
  servings: parseRecipeServings(search.servings),
  view: search.view === 'mine' ? 'mine' : undefined,
});

export default function RecipeRoutePage() {
  const { servings, view } = validateSearch(useRouteValues());
  return <RecipePage servings={servings} view={view} />;
}
