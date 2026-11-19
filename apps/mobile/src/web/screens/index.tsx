import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { Home } from '@/web/features/feed/Home';
import { appHref, useAppNavigate } from '@/web/navigation/navigation';

export default function HomePage() {
  const model = useRecipeBoxModel();
  const navigate = useAppNavigate();
  return (
    <Home
      openAttempt={(id) => void navigate({ to: '/attempts/$attemptId', params: { attemptId: id } })}
      name={model.profile.identity.name}
      posts={model.journal.posts}
      books={model.cookbooks.books}
      level={model.level}
      interactions={model.feed}
      saveRecipe={model.cookbooks.saveRecipe}
      recipeHref={(name) =>
        new URL(
          appHref({
            to: '/recipes/$recipeName',
            params: { recipeName: name },
          }),
          window.location.origin,
        ).href
      }
      openRecipe={model.openRecipe}
    />
  );
}
