import { INITIAL_COOKBOOKS } from '@/web/data/cookbooks';
import { RECIPES } from '@/web/data/recipes';
import { createOriginalVersion, getOriginalVersionId, INITIAL_VERSIONS } from '@/web/data/versions';
import { hasOwnKey } from '@/web/lib/records';
import type { RecipeData, RecipeVersion } from '@/web/types/domain';

export type RecipeVersionState = {
  versions: RecipeVersion[];
  currentVersionIds: Record<string, string>;
  ownedRecipeNames: string[];
};

export type CreateVersionOptions = {
  name?: string;
  changed?: string;
  parentId?: string;
};

type VersionIdentity = {
  id?: string;
  createdAt?: string;
};

/** Stored snapshots cannot be changed through an editor or a retained log reference. */
function storedSnapshot(recipe: RecipeData): RecipeData {
  const snapshot = structuredClone(recipe);
  snapshot.ing.forEach(Object.freeze);
  snapshot.steps.forEach(Object.freeze);
  Object.freeze(snapshot.ing);
  Object.freeze(snapshot.steps);
  Object.freeze(snapshot.diet);
  Object.freeze(snapshot.macro);
  Object.freeze(snapshot.has);
  return Object.freeze(snapshot);
}

export function createInitialVersionState(): RecipeVersionState {
  const versions = INITIAL_VERSIONS.map((version) => ({
    ...version,
    snapshot: storedSnapshot(version.snapshot),
  }));
  return {
    versions,
    ownedRecipeNames: [...new Set(INITIAL_COOKBOOKS.flatMap((book) => book.recipes))],
    currentVersionIds: Object.fromEntries(versions.map((version) => [version.recipeName, version.id])),
  };
}

export function ownsRecipe(state: RecipeVersionState, recipeName: string) {
  return state.ownedRecipeNames.includes(recipeName);
}

/** Saving a source claims its personal snapshot without resetting later edits. */
export function saveRecipeCopy(state: RecipeVersionState, recipeName: string): RecipeVersionState {
  if (!hasOwnKey(RECIPES, recipeName)) return state;
  const owned = ownsRecipe(state, recipeName);
  const originalId = getOriginalVersionId(recipeName);
  const hasOriginal = state.versions.some(
    (version) => version.recipeName === recipeName && version.id === originalId,
  );
  if (owned && hasOriginal) return state;
  const original = hasOriginal ? undefined : createOriginalVersion(recipeName);
  return {
    ...state,
    ownedRecipeNames: owned ? state.ownedRecipeNames : [...state.ownedRecipeNames, recipeName],
    versions: original
      ? [...state.versions, { ...original, snapshot: storedSnapshot(original.snapshot) }]
      : state.versions,
    currentVersionIds: state.currentVersionIds[recipeName]
      ? state.currentVersionIds
      : { ...state.currentVersionIds, [recipeName]: originalId },
  };
}

export function findRecipeVersion(state: RecipeVersionState, recipeName: string, id: string) {
  return state.versions.find((version) => version.recipeName === recipeName && version.id === id);
}

export function visibleRecipeVersions(state: RecipeVersionState, recipeName: string) {
  return state.versions
    .filter((version) => version.recipeName === recipeName && !version.removed)
    .reverse()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function currentRecipeVersion(state: RecipeVersionState, recipeName: string): RecipeVersion {
  const current = findRecipeVersion(state, recipeName, state.currentVersionIds[recipeName]);
  if (current && !current.removed) return current;
  return (
    visibleRecipeVersions(state, recipeName)[0] || {
      ...createOriginalVersion(recipeName),
      snapshot: storedSnapshot(createOriginalVersion(recipeName).snapshot),
    }
  );
}

export function addRecipeVersion(
  state: RecipeVersionState,
  recipeName: string,
  snapshot: RecipeData,
  options: CreateVersionOptions = {},
  identity: VersionIdentity = {},
) {
  const current = currentRecipeVersion(state, recipeName);
  const parent = options.parentId
    ? findRecipeVersion(state, recipeName, options.parentId) || current
    : current;
  const number = state.versions.filter((version) => version.recipeName === recipeName).length;
  const version: RecipeVersion = {
    id: identity.id || crypto.randomUUID(),
    recipeName,
    name: options.name?.trim() || `Version ${Math.max(1, number)}`,
    parentId: parent.id,
    createdAt: identity.createdAt || new Date().toISOString(),
    snapshot: storedSnapshot(snapshot),
    changed: options.changed?.trim() || 'Recipe updated.',
  };
  const versions = state.versions.some((item) => item.recipeName === recipeName)
    ? state.versions
    : [...state.versions, current];
  return {
    version,
    state: {
      ...state,
      versions: [...versions, version],
      currentVersionIds: {
        ...state.currentVersionIds,
        [recipeName]: version.id,
      },
    },
  };
}

export function renameRecipeVersion(
  state: RecipeVersionState,
  recipeName: string,
  id: string,
  name: string,
): RecipeVersionState {
  const nextName = name.trim();
  if (!nextName) return state;
  return {
    ...state,
    versions: state.versions.map((version) =>
      version.recipeName === recipeName && version.id === id ? { ...version, name: nextName } : version,
    ),
  };
}

export function restoreRecipeVersion(
  state: RecipeVersionState,
  recipeName: string,
  id: string,
  identity: VersionIdentity = {},
) {
  const source = findRecipeVersion(state, recipeName, id);
  if (!source) throw new Error('Recipe version not found');
  const result = addRecipeVersion(
    state,
    recipeName,
    source.snapshot,
    {
      name: `Restored ${source.name}`,
      changed: `Restored from ${source.name}.`,
      parentId: currentRecipeVersion(state, recipeName).id,
    },
    identity,
  );
  const version = { ...result.version, restoredFromId: source.id };
  return {
    version,
    state: {
      ...result.state,
      versions: result.state.versions.map((item) =>
        item.id === result.version.id && item.recipeName === recipeName ? version : item,
      ),
    },
  };
}

export function removeRecipeVersion(
  state: RecipeVersionState,
  recipeName: string,
  id: string,
): RecipeVersionState {
  const selected = findRecipeVersion(state, recipeName, id);
  if (!selected || selected.parentId === null || selected.removed) return state;
  const next = {
    ...state,
    versions: state.versions.map((version) =>
      version.recipeName === recipeName && version.id === id ? { ...version, removed: true } : version,
    ),
  };
  if (state.currentVersionIds[recipeName] !== id) return next;
  const fallback = visibleRecipeVersions(next, recipeName)[0];
  return {
    ...next,
    currentVersionIds: {
      ...state.currentVersionIds,
      [recipeName]: fallback.id,
    },
  };
}
