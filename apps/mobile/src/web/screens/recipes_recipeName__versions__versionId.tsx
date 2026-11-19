import { RecipePage } from '@/web/features/recipes/RecipePage';
import { parseRecipeServings, type RecipeServingsSearch } from '@/web/lib/servings';
import { useRouteValues } from '@/web/navigation/navigation';

const validateSearch = (search: Record<string, unknown>): RecipeServingsSearch => ({
  servings: parseRecipeServings(search.servings),
});

export default function VersionPage() {
  const { versionId } = useRouteValues();
  const { servings } = validateSearch(useRouteValues());
  return <RecipePage snapshotId={versionId} servings={servings} />;
}
