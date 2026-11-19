import { useRef } from 'react';
import { RecipeRow } from '@/web/components/ui/RecipeRow';
import { SearchInput } from '@/web/components/ui/SearchInput';
import { CookbookAdd } from '@/web/features/cookbooks/CookbookAdd';
import { CookbookCover } from '@/web/features/cookbooks/CookbookCover';
import { RecentlyCooked } from '@/web/features/cookbooks/RecentlyCooked';
import type { Cookbook, MealLogEntry } from '@/web/types/domain';

type CookbookRecipesProps = {
  books: Cookbook[];
  log: MealLogEntry[];
  query: string;
  setQuery: (query: string) => void;
  openBook: (name: string) => void;
  addBook: (name: string) => void;
  openRecipe: (name: string) => void;
  newRecipe: () => void;
};

export function CookbookRecipes({
  books,
  log,
  query,
  setQuery,
  openBook,
  addBook,
  openRecipe,
  newRecipe,
}: CookbookRecipesProps) {
  const search = useRef<HTMLInputElement>(null);
  const term = query.trim().toLowerCase();
  const matchingBooks = term ? books.filter((book) => book.name.toLowerCase().includes(term)) : books;
  const matchingRecipes = term
    ? [...new Set(books.flatMap((book) => book.recipes))].filter((name) => name.toLowerCase().includes(term))
    : [];
  const clear = () => {
    setQuery('');
    search.current?.focus();
  };
  return (
    <>
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_40px] gap-2">
        <SearchInput
          inputRef={search}
          label="Search saved recipes and cookbooks"
          placeholder="Search your cookbook"
          value={query}
          onChange={setQuery}
        />
        <CookbookAdd
          books={books}
          addBook={(name) => {
            addBook(name);
            setQuery('');
          }}
          newRecipe={newRecipe}
        />
      </div>
      {!term && <RecentlyCooked log={log} openRecipe={openRecipe} />}
      <div aria-live="polite" className="sr-only">
        {term ? `${matchingBooks.length} cookbooks and ${matchingRecipes.length} recipes found.` : ''}
      </div>
      {term && matchingBooks.length > 0 && <h2 className="mb-3 text-[16px]">Cookbooks</h2>}
      <div className="books grid grid-cols-2 gap-x-4 gap-y-6">
        {matchingBooks.map((book) => (
          <button
            type="button"
            key={book.name}
            className="min-w-0 text-left hover:text-green"
            onClick={() => openBook(book.name)}
          >
            <CookbookCover recipes={book.recipes} />
            <b className="mt-2 block break-words text-[14px]">{book.name}</b>
            <span className="mt-0.5 block text-[12px] text-muted">
              {book.recipes.length} {book.recipes.length === 1 ? 'recipe' : 'recipes'}
            </span>
          </button>
        ))}
      </div>
      {term && matchingRecipes.length > 0 && (
        <section aria-label="Matching recipes" className={matchingBooks.length ? 'mt-6' : ''}>
          <h2 className="text-[16px]">Recipes</h2>
          {matchingRecipes.map((name) => (
            <RecipeRow key={name} name={name} open={() => openRecipe(name)} />
          ))}
        </section>
      )}
      {term && !matchingBooks.length && !matchingRecipes.length && (
        <div className="py-8 text-center">
          <h2 className="text-[19px]">No matches yet</h2>
          <p className="mt-2 text-[13px]">Try a saved recipe or cookbook name.</p>
          <button type="button" className="text-action mt-3" onClick={clear}>
            Clear search
          </button>
        </div>
      )}
      {!term && !books.length && (
        <p className="notice">
          Start your cookbook with a recipe you love. Use + to add a recipe or create a cookbook.
        </p>
      )}
    </>
  );
}
