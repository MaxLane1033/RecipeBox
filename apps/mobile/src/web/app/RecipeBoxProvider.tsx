import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { type RecipeBoxModel, useRecipeBox } from '@/web/app/useRecipeBox';
import { resetRecipeCatalogue } from '@/web/data/recipeSession';
import type { AccountIdentity } from '@/web/features/profile/hooks/useProfile';

const RecipeBoxContext = createContext<RecipeBoxModel | null>(null);

type RecipeBoxProviderProps = {
  children: ReactNode;
  user: AccountIdentity;
};

/** Keeps demo data alive while route components change. */
export function RecipeBoxProvider({ children, user }: RecipeBoxProviderProps) {
  // This provider is keyed by user ID. Reset before hooks or children read the catalogue.
  useState(() => {
    resetRecipeCatalogue();
    return true;
  });
  useEffect(() => resetRecipeCatalogue, []);
  const model = useRecipeBox(user);
  return <RecipeBoxContext.Provider value={model}>{children}</RecipeBoxContext.Provider>;
}

export function useRecipeBoxModel() {
  const model = useContext(RecipeBoxContext);
  if (!model) throw new Error('useRecipeBoxModel must be used within RecipeBoxProvider');
  return model;
}
