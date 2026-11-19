import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { Versions } from '@/web/features/versions/Versions';
import { hasOwnKey } from '@/web/lib/records';
import { AppRedirect } from '@/web/navigation/AppRedirect';

export default function VersionsPage() {
  const model = useRecipeBoxModel();
  const name = model.recipeName;
  if (!hasOwnKey(RECIPE_LEVELS, name)) return <RouteNotFound title="Recipe not found" />;
  if (!model.recipeVersions.isOwnedRecipe(name))
    return <AppRedirect to="/recipes/$recipeName" params={{ recipeName: name }} replace />;
  return (
    <Versions
      key={name}
      back={model.navigation.back}
      recipeName={name}
      versions={model.recipeVersions.getRecipeVersions(name)}
      currentVersionId={model.recipeVersions.currentVersionIds[name]}
      detail={model.openVersion}
      rename={(id, nextName) => model.recipeVersions.renameVersion(name, id, nextName)}
      restore={(id) => {
        model.recipeVersions.restoreVersion(name, id);
      }}
      remove={(id) => model.recipeVersions.removeVersion(name, id)}
    />
  );
}
