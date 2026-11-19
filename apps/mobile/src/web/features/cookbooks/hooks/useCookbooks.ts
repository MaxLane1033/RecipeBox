import { useState } from 'react';
import { INITIAL_COOKBOOKS } from '@/web/data/cookbooks';
import type { Cookbook } from '@/web/types/domain';

export function useCookbooks() {
  const [books, setBooks] = useState<Cookbook[]>(INITIAL_COOKBOOKS);

  const saveRecipe = (bookName: string, recipe: string) => {
    setBooks((previous) =>
      previous.some((book) => book.name === bookName)
        ? previous.map((book) =>
            book.name === bookName && !book.recipes.includes(recipe)
              ? { ...book, recipes: [...book.recipes, recipe] }
              : book,
          )
        : [...previous, { name: bookName, recipes: [recipe] }],
    );
  };

  const addBook = (name: string) => {
    setBooks((previous) =>
      previous.some((book) => book.name === name) ? previous : [...previous, { name, recipes: [] }],
    );
  };

  return { books, saveRecipe, addBook };
}
