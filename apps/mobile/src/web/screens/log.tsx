import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { LogFlow } from '@/web/features/logging/LogFlow';
import { hasOwnKey } from '@/web/lib/records';
import { useRouteValues } from '@/web/navigation/navigation';

type LogSearch = {
  recipe?: string;
  version?: string;
};
const validateSearch = (search: Record<string, unknown>): LogSearch => ({
  recipe: typeof search.recipe === 'string' ? search.recipe : undefined,
  version: typeof search.version === 'string' ? search.version : undefined,
});

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { version } = validateSearch(useRouteValues());
  const { navigation, journal } = model;
  const { back } = navigation;
  if (model.recipeName && !hasOwnKey(RECIPE_LEVELS, model.recipeName))
    return <RouteNotFound title="Recipe not found" />;
  if (version) {
    const selected = model.recipeVersions.getVersion(model.recipeName, version);
    if (!selected || selected.removed) return <RouteNotFound title="Version unavailable for logging" />;
  }
  return (
    <LogFlow
      key={`${model.recipeName}-${model.versionId}`}
      close={back}
      minutes={model.cookingMinutes}
      recipe={model.recipeName}
      streak={journal.streak}
      finish={model.finishMeal}
      versions={model.recipeVersions.versions.filter(
        (item) => item.parentId === null || model.recipeVersions.isOwnedRecipe(item.recipeName),
      )}
      currentVersionIds={model.recipeVersions.currentVersionIds}
      initialVersionId={model.versionId}
    />
  );
}
