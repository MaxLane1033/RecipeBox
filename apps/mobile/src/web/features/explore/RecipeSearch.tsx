import { useState } from 'react';
import type { AppScreen } from '@/web/app/navigation';
import { Button } from '@/web/components/ui/Button';
import { Chip } from '@/web/components/ui/Chip';
import { RecipeRow } from '@/web/components/ui/RecipeRow';
import { SearchInput } from '@/web/components/ui/SearchInput';
import { COOKING_LEVELS, RECIPE_LEVELS } from '@/web/data/recipes';
import { matchesFilters } from '@/web/lib/recipes';
import type { ExperienceLevel, RecipeFilters } from '@/web/types/domain';

type RecipeSearchProps = {
  openRecipe: (name?: string) => void;
  go: (screen: AppScreen) => void;
  level: ExperienceLevel;
  filters: RecipeFilters;
};
export function RecipeSearch({ openRecipe, go, level, filters }: RecipeSearchProps) {
  const [q, setQ] = useState('');
  const [showAll, setShowAll] = useState(true);
  const index = COOKING_LEVELS.indexOf(level);
  const ranked = Object.keys(RECIPE_LEVELS)
    .filter(
      (r) =>
        r.toLowerCase().includes(q.toLowerCase().trim()) &&
        (showAll || RECIPE_LEVELS[r] === level) &&
        matchesFilters(r, filters, level),
    )
    .sort(
      (a, b) =>
        Math.abs(COOKING_LEVELS.indexOf(RECIPE_LEVELS[a]) - index) -
        Math.abs(COOKING_LEVELS.indexOf(RECIPE_LEVELS[b]) - index),
    );
  return (
    <>
      <SearchInput label="Search recipes" placeholder="What do you want to cook?" value={q} onChange={setQ} />
      <div className="scrollbar-none my-4 flex gap-2 overflow-x-auto pb-1">
        <Chip selected={showAll} onClick={() => setShowAll(!showAll)}>
          All levels
        </Chip>
        {(
          [
            ['Level', filters.levels.length],
            ['Time', filters.time < 90 ? 1 : 0],
            ['Cuisine', filters.cuisine.length],
            ['Diet', filters.diet.length],
            ['Macros', filters.macros.length],
            ['Dishes', filters.dishes < 6 ? 1 : 0],
          ] as [string, number][]
        ).map(([label, n]) => (
          <span className="shrink-0" key={label}>
            <Chip selected={n > 0} onClick={() => go('filters')}>
              {label}
              {n ? ` · ${n}` : ''}
            </Chip>
          </span>
        ))}
      </div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2>{q ? 'Search results' : 'Find your next favorite'}</h2>
        <span className="text-[12px] text-muted" aria-live="polite">
          {ranked.length} recipes
        </span>
      </div>
      <p className="mb-1 text-[12px]">Closest to your {level.toLowerCase()} level first.</p>
      {ranked.map((name) => (
        <RecipeRow key={name} name={name} level={level} open={() => openRecipe(name)} />
      ))}
      {!ranked.length && (
        <div className="my-6 rounded-xl bg-dark p-5">
          <h3>No recipes found</h3>
          <p className="my-3">Try a different search or adjust your filters.</p>
          <Button
            secondary
            onClick={() => {
              setQ('');
              setShowAll(true);
              go('filters');
            }}
          >
            Adjust filters
          </Button>
        </div>
      )}
      <div className="section-heading">
        <h2>Start with what you have</h2>
      </div>
      <p className="mb-4 text-[13px]">A few ingredients can be enough.</p>
      <div className="grid grid-cols-2 gap-3">
        <Button secondary onClick={() => go('scan')}>
          Scan fridge
        </Button>
        <Button secondary onClick={() => go('ask')}>
          Ask RecipeBox
        </Button>
      </div>
    </>
  );
}
