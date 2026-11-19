import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { RouteNotFound } from '@/web/app/RouteNotFound';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { AttemptDetail } from '@/web/features/logging/AttemptDetail';
import { hasOwnKey } from '@/web/lib/records';
import { useAppNavigate, useRouteValues } from '@/web/navigation/navigation';

export default function AttemptPage() {
  const model = useRecipeBoxModel();
  const navigate = useAppNavigate();
  const { attemptId } = useRouteValues();
  const attempt = model.journal.log.find((item) => item.id === attemptId);
  const post = model.journal.attempts.find((item) => item.id === attemptId);
  if (!attempt) return <RouteNotFound title="Attempt not found" />;
  const name = attempt.recipeName ?? attempt.title;
  const linked = hasOwnKey(RECIPE_LEVELS, name);
  const versionId = attempt.versionId;
  return (
    <AttemptDetail
      attempt={attempt}
      post={post}
      back={model.navigation.back}
      openRecipe={linked ? () => model.openMyRecipe(name) : undefined}
      openVersion={
        linked && versionId
          ? () =>
              void navigate({
                to: '/recipes/$recipeName/versions/$versionId',
                params: { recipeName: name, versionId },
              })
          : undefined
      }
    />
  );
}
