import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { Cook } from '@/web/features/cooking/Cook';
import { hasOwnKey } from '@/web/lib/records';

export default function RouteComponent() {
  const model = useRecipeBoxModel();
  const { navigation } = model;
  const { back } = navigation;
  if (!hasOwnKey(RECIPE_LEVELS, model.recipeName)) return <RouteNotFound title="Recipe not found" />;
  const version = model.recipeVersions.getVersion(model.recipeName, model.versionId);
  if (!version || version.removed) return <RouteNotFound title="Version not available for cooking" />;
  return (
    <Cook
      key={version.id}
      name={model.recipeName}
      data={version.snapshot}
      back={back}
      finish={model.finishCooking}
    />
  );
}
