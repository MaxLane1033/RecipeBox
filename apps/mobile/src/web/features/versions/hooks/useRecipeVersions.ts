import { useRef, useState } from 'react';
import {
  addRecipeVersion,
  type CreateVersionOptions,
  createInitialVersionState,
  currentRecipeVersion,
  findRecipeVersion,
  ownsRecipe,
  type RecipeVersionState,
  removeRecipeVersion,
  renameRecipeVersion,
  restoreRecipeVersion,
  saveRecipeCopy,
  visibleRecipeVersions,
} from '@/web/features/versions/versionState';
import type { RecipeData } from '@/web/types/domain';

export function useRecipeVersions() {
  const [state, setState] = useState(createInitialVersionState);
  const latest = useRef(state);
  latest.current = state;
  const update = (next: RecipeVersionState) => {
    latest.current = next;
    setState(next);
  };

  return {
    versions: state.versions,
    currentVersionIds: state.currentVersionIds,
    isOwnedRecipe: (recipeName: string) => ownsRecipe(latest.current, recipeName),
    saveRecipeCopy: (recipeName: string) => update(saveRecipeCopy(latest.current, recipeName)),
    getVersion: (recipeName: string, id: string) => findRecipeVersion(latest.current, recipeName, id),
    getCurrentVersion: (recipeName: string) => currentRecipeVersion(latest.current, recipeName),
    getRecipeVersions: (recipeName: string) => visibleRecipeVersions(latest.current, recipeName),
    createVersion: (recipeName: string, snapshot: RecipeData, options?: CreateVersionOptions) => {
      const result = addRecipeVersion(latest.current, recipeName, snapshot, options);
      update(result.state);
      return result.version;
    },
    renameVersion: (recipeName: string, id: string, name: string) =>
      update(renameRecipeVersion(latest.current, recipeName, id, name)),
    restoreVersion: (recipeName: string, id: string) => {
      const result = restoreRecipeVersion(latest.current, recipeName, id);
      update(result.state);
      return result.version;
    },
    removeVersion: (recipeName: string, id: string) =>
      update(removeRecipeVersion(latest.current, recipeName, id)),
  };
}
