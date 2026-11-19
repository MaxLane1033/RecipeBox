import { FALLBACK_RECIPE, RECIPES } from '@/web/data/recipes';
import type { RecipeData, RecipeVersion } from '@/web/types/domain';

const PASTA = 'Garlic butter pasta';

export const getOriginalVersionId = (recipeName: string) =>
  recipeName === PASTA ? 'o' : `original-${encodeURIComponent(recipeName)}`;

export function createOriginalVersion(recipeName: string): RecipeVersion {
  return {
    id: getOriginalVersionId(recipeName),
    recipeName,
    name: 'Original',
    parentId: null,
    createdAt: '2026-05-01T12:00:00.000Z',
    snapshot: structuredClone(RECIPES[recipeName] || FALLBACK_RECIPE),
    changed: 'The original recipe.',
  };
}

function pastaVersion(
  id: string,
  name: string,
  parentId: string,
  day: number,
  changed: string,
  snapshot: RecipeData,
): RecipeVersion {
  return {
    id,
    recipeName: PASTA,
    name,
    parentId,
    createdAt: `2026-05-${String(day).padStart(2, '0')}T12:00:00.000Z`,
    snapshot,
    changed,
  };
}

const lessSalt = structuredClone(RECIPES[PASTA]);
lessSalt.steps[2][1] = 'Bring water to a rolling boil, using a third less salt than in the original recipe.';
const addLemon = structuredClone(lessSalt);
addLemon.ing.push([0.25, 'tsp', 'lemon zest']);
addLemon.steps[0][1] = 'Set out the spaghetti, butter, garlic, parmesan, and lemon zest.';
addLemon.steps[5][1] = 'Toss pasta with the butter and a splash of pasta water. Finish with lemon zest.';
const moreGarlic = structuredClone(addLemon);
moreGarlic.ing[2][0] *= 2;
const lessPasta = structuredClone(addLemon);
lessPasta.ing[0][0] = 66.7;
const perfected = structuredClone(lessPasta);
perfected.ing[4][0] = 0.5;
perfected.ing.push([0.25, 'cup', 'reserved pasta water']);
perfected.steps[5][1] =
  'Toss pasta with the garlic butter, lemon zest, and a full ladle of pasta water until glossy and saucy.';

export const INITIAL_VERSIONS: RecipeVersion[] = [
  ...Object.keys(RECIPES).map(createOriginalVersion),
  pastaVersion('v1', 'v1 Less salt', 'o', 2, 'Cut the salt in the pasta water by a third.', lessSalt),
  pastaVersion('v2', 'v2 Add lemon', 'v1', 8, 'Added lemon zest at the end.', addLemon),
  pastaVersion('v2b', 'v2b More garlic', 'v2', 10, 'Doubled the garlic.', moreGarlic),
  pastaVersion('v3', 'v3 Less pasta', 'v2', 12, 'A third less pasta.', lessPasta),
  pastaVersion(
    'v4',
    'v4 Perfected',
    'v3',
    18,
    'Less pasta, more lemon, and a full ladle of pasta water.',
    perfected,
  ),
];
