import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { getOriginalVersionId } from '@/web/data/versions';
import { Recipe } from '@/web/features/recipes/Recipe';
import { RecipeAttempts } from '@/web/features/recipes/RecipeAttempts';
import { hasOwnKey } from '@/web/lib/records';
import { useAppNavigate } from '@/web/navigation/navigation';

type RecipePageProps = {
  snapshotId?: string;
  servings?: number;
  view?: 'mine';
};

export function RecipePage({ snapshotId, servings = 2, view }: RecipePageProps) {
  const model = useRecipeBoxModel();
  const navigate = useAppNavigate();
  const name = model.recipeName;
  if (!hasOwnKey(RECIPE_LEVELS, name)) return <RouteNotFound title="Recipe not found" />;
  const owned = model.recipeVersions.isOwnedRecipe(name);
  const personal = owned && (!!snapshotId || view === 'mine');
  const version = snapshotId
    ? model.recipeVersions.getVersion(name, snapshotId)
    : personal
      ? model.recipeVersions.getCurrentVersion(name)
      : model.recipeVersions.getVersion(name, getOriginalVersionId(name));
  if (!version) return <RouteNotFound title="Version not found" />;
  const attempts = model.journal.log.filter(
    (attempt) =>
      (attempt.recipeName ?? attempt.title) === name &&
      ((personal && !snapshotId) || attempt.versionId === version.id),
  );
  const openLog = () =>
    void navigate({
      to: '/log',
      search: { recipe: name, version: version.id },
    });
  return (
    <Recipe
      key={`${personal ? 'mine' : 'source'}:${version.id}:${servings}`}
      name={name}
      data={version.snapshot}
      version={version}
      personal={personal}
      hasPersonalCopy={owned}
      sourceLabel={version.snapshot.source}
      onOpenPersonal={(count = servings) =>
        void navigate({
          to: '/recipes/$recipeName',
          params: { recipeName: name },
          search: { view: 'mine', servings: count },
        })
      }
      onOpenSource={() =>
        void navigate({
          to: '/recipes/$recipeName',
          params: { recipeName: name },
          search: { servings },
        })
      }
      snapshotView={!!snapshotId}
      initialServings={servings}
      back={model.navigation.back}
      go={(screen) => {
        if (screen === 'cook')
          void navigate({
            to: '/recipes/$recipeName/cook',
            params: { recipeName: name },
            search: { version: version.id },
          });
        else if (screen === 'log') openLog();
        else model.navigation.go(screen);
      }}
      onEdit={
        !personal || version.removed
          ? undefined
          : async (count) => {
              if (snapshotId)
                await navigate({
                  to: '/recipes/$recipeName/versions/$versionId',
                  params: { recipeName: name, versionId: snapshotId },
                  search: { servings: count },
                  replace: true,
                });
              else
                await navigate({
                  to: '/recipes/$recipeName',
                  params: { recipeName: name },
                  search: { servings: count, view: 'mine' },
                  replace: true,
                });
              await navigate({
                to: '/recipes/$recipeName/edit',
                params: { recipeName: name },
                search: { version: version.id, servings: count },
              });
            }
      }
      onVersions={
        personal
          ? () =>
              void navigate({
                to: '/recipes/$recipeName/versions',
                params: { recipeName: name },
              })
          : undefined
      }
      onRestore={
        personal && version.removed
          ? () => {
              model.recipeVersions.restoreVersion(name, version.id);
              void navigate({
                to: '/recipes/$recipeName',
                params: { recipeName: name },
                search: { view: 'mine', servings },
                replace: true,
              });
            }
          : undefined
      }
      books={model.cookbooks.books}
      saveRecipe={model.cookbooks.saveRecipe}
      level={model.level}
      attempts={
        personal || attempts.length ? (
          <RecipeAttempts
            attempts={attempts}
            openAttempt={(id) =>
              void navigate({
                to: '/attempts/$attemptId',
                params: { attemptId: id },
              })
            }
            viewAll={() =>
              void navigate({
                to: '/recipes/$recipeName/logs',
                params: { recipeName: name },
                search: snapshotId || !personal ? { version: version.id } : {},
              })
            }
            logAttempt={version.removed ? undefined : openLog}
          />
        ) : undefined
      }
    />
  );
}
