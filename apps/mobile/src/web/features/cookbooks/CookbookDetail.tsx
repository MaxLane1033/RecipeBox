import type { AppScreen } from '@/web/app/navigation';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { RecipeRow } from '@/web/components/ui/RecipeRow';
import type { Cookbook } from '@/web/types/domain';

type CookbookDetailProps = {
  back: () => void;
  book: Cookbook;
  openRecipe: (n?: string) => void;
  go: (s: AppScreen) => void;
};
export function CookbookDetail({ back, book, openRecipe, go }: CookbookDetailProps) {
  return (
    <>
      <Header title="Your cookbook" back={back} />
      <h1 className="break-words text-[24px]">{book.name}</h1>
      <p className="mt-1 mb-2 text-[12px]">
        {book.recipes.length} saved {book.recipes.length === 1 ? 'recipe' : 'recipes'}
      </p>
      {book.recipes.map((name) => (
        <RecipeRow compact key={name} name={name} open={() => openRecipe(name)} />
      ))}
      {!book.recipes.length && (
        <p className="notice my-3">
          Make room for your next favorite. Save a recipe from its detail page or add one of your own.
        </p>
      )}
      <div className="mt-4">
        <Button secondary onClick={() => go('import')}>
          Add recipe
        </Button>
      </div>
    </>
  );
}
