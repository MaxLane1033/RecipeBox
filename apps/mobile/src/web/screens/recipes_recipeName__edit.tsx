import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { RecipeEditor } from '@/web/features/versions/RecipeEditor';
import { hasOwnKey } from '@/web/lib/records';
import { parseRecipeServings } from '@/web/lib/servings';
import { AppRedirect } from '@/web/navigation/AppRedirect';
import { useAppNavigate, useRouteValues } from '@/web/navigation/navigation';

type RecipeEditSearch = {
  version?: string;
  servings?: number;
};
const validateSearch = (search: Record<string, unknown>): RecipeEditSearch => ({
  version: typeof search.version === 'string' ? search.version : undefined,
  servings: parseRecipeServings(search.servings),
});

export default function EditRecipePage() {
  const model = useRecipeBoxModel();
  const navigate = useAppNavigate();
  const { version, servings = 2 } = validateSearch(useRouteValues());
  const name = model.recipeName;
  if (!hasOwnKey(RECIPE_LEVELS, name)) return <RouteNotFound title="Recipe not found" />;
  if (!model.recipeVersions.isOwnedRecipe(name))
    return <AppRedirect to="/recipes/$recipeName" params={{ recipeName: name }} replace />;
  const base = version
    ? model.recipeVersions.getVersion(name, version)
    : model.recipeVersions.getCurrentVersion(name);
  if (!base || base.removed) return <RouteNotFound title="Version not available for editing" />;
  return (
    <RecipeEditor
      key={`${name}:${base.id}:${servings}`}
      back={model.navigation.back}
      recipeName={name}
      baseVersion={base}
      servings={servings}
      save={(snapshot, options) => {
        model.recipeVersions.createVersion(name, snapshot, {
          ...options,
          parentId: base.id,
        });
        void navigate({
          to: '/recipes/$recipeName',
          params: { recipeName: name },
          search: { servings, view: 'mine' },
          replace: true,
        });
      }}
    />
  );
}
