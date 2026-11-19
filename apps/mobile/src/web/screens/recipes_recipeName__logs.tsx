import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { CookingLog } from '@/web/features/logging/CookingLog';
import { hasOwnKey } from '@/web/lib/records';
import { useAppNavigate, useRouteValues } from '@/web/navigation/navigation';

const validateSearch = (search: Record<string, unknown>): { version?: string } => ({
  version: typeof search.version === 'string' ? search.version : undefined,
});

export default function CookingLogPage() {
  const model = useRecipeBoxModel();
  const navigate = useAppNavigate();
  const { version: versionId } = validateSearch(useRouteValues());
  const name = model.recipeName;
  if (!hasOwnKey(RECIPE_LEVELS, name)) return <RouteNotFound title="Recipe not found" />;
  const version = versionId ? model.recipeVersions.getVersion(name, versionId) : undefined;
  if (versionId && !version) return <RouteNotFound title="Version not found" />;
  return (
    <CookingLog
      recipeName={version ? `${name} · ${version.name}` : name}
      attempts={model.journal.log.filter(
        (attempt) =>
          (attempt.recipeName ?? attempt.title) === name && (!version || attempt.versionId === version.id),
      )}
      back={model.navigation.back}
      openAttempt={(id) => void navigate({ to: '/attempts/$attemptId', params: { attemptId: id } })}
      logAttempt={
        version?.removed
          ? undefined
          : () =>
              void navigate({
                to: '/log',
                search: {
                  recipe: name,
                  version: version?.id ?? model.recipeVersions.currentVersionIds[name],
                },
              })
      }
    />
  );
}
