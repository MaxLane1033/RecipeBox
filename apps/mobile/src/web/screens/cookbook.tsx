import { useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { CookbookRecipes } from '@/web/features/cookbooks/CookbookRecipes';
import { AppRedirect } from '@/web/navigation/AppRedirect';
import { useAppNavigate, useRouteValues } from '@/web/navigation/navigation';

type CookbookSearch = {
  q?: string;
  tab?: 'progress';
  section?: 'history' | 'goals';
};
const validateSearch = (search: Record<string, unknown>): CookbookSearch => ({
  q: typeof search.q === 'string' ? search.q : undefined,
  tab: search.tab === 'progress' ? 'progress' : undefined,
  section: search.section === 'history' || search.section === 'goals' ? search.section : undefined,
});

export default function CookbookPage() {
  const model = useRecipeBoxModel();
  const { q = '', tab, section } = validateSearch(useRouteValues());
  const navigate = useAppNavigate();
  if (tab === 'progress') return <AppRedirect to="/profile" search={{ tab: section }} />;
  return (
    <CookbookRecipes
      books={model.cookbooks.books}
      log={model.journal.log}
      query={q}
      setQuery={(query) => void navigate({ search: { q: query || undefined }, replace: true })}
      openBook={model.openBook}
      openRecipe={model.openMyRecipe}
      addBook={model.cookbooks.addBook}
      newRecipe={() => model.navigation.go('import')}
    />
  );
}
