import { Button } from '@/web/components/ui/Button';
import { Chip } from '@/web/components/ui/Chip';
import { Header } from '@/web/components/ui/Header';
import { DEFAULT_FILTERS, RECIPE_LEVELS } from '@/web/data/recipes';
import { matchesFilters } from '@/web/lib/recipes';
import type { ExperienceLevel, RecipeFilters } from '@/web/types/domain';

export function Filters({
  back,
  filters,
  setFilters,
  level,
}: {
  back: () => void;
  filters: RecipeFilters;
  setFilters: (f: RecipeFilters) => void;
  level: ExperienceLevel;
}) {
  type K = 'ings' | 'cuisine' | 'diet' | 'levels' | 'macros';
  const toggle = (k: K, x: string) =>
    setFilters({
      ...filters,
      [k]: filters[k].includes(x) ? filters[k].filter((y) => y !== x) : [...filters[k], x],
    });
  const group = (title: string, k: K, items: string[]) => (
    <>
      <b className="filter-label block text-[12px] mt-5">{title}</b>
      <div className="chip-row filter-group flex gap-1.5 flex-wrap mt-2.5">
        {items.map((x) => (
          <Chip key={x} selected={filters[k].includes(x)} onClick={() => toggle(k, x)}>
            {x}
          </Chip>
        ))}
      </div>
    </>
  );
  const count = Object.keys(RECIPE_LEVELS).filter((r) => matchesFilters(r, filters, level)).length;
  return (
    <>
      <Header title="Filters" back={back} />
      <button type="button" className="text-action underline" onClick={() => setFilters(DEFAULT_FILTERS)}>
        Reset filters
      </button>
      {group('Ingredients I have', 'ings', [
        'Eggs',
        'Rice',
        'Tomatoes',
        'Pasta',
        'Chicken',
        'Potatoes',
        'Garlic',
      ])}
      <div className="range-head flex justify-between items-center mt-5.5 text-[12px] [&>span]:text-muted">
        <b>Time at my level</b>
        <span>{filters.time >= 90 ? 'Any time' : `Up to ${filters.time} min`}</span>
      </div>
      <input
        className="range w-full accent-green my-[15px] mx-0"
        aria-label="Maximum cooking time"
        type="range"
        min="15"
        max="90"
        step="5"
        value={filters.time}
        onChange={(e) => setFilters({ ...filters, time: +e.target.value })}
      />
      <div className="range-head flex justify-between items-center mt-5.5 text-[12px] [&>span]:text-muted">
        <b>Dishes to wash</b>
        <div className="stepper flex items-center rounded-control border border-rule [&_button]:bg-transparent [&_button]:w-control [&_button]:h-control [&_button]:border-0">
          <button
            type="button"
            onClick={() =>
              setFilters({
                ...filters,
                dishes: Math.max(1, filters.dishes - 1),
              })
            }
          >
            −
          </button>
          <b>{filters.dishes >= 6 ? 'Any' : filters.dishes}</b>
          <button
            type="button"
            onClick={() =>
              setFilters({
                ...filters,
                dishes: Math.min(6, filters.dishes + 1),
              })
            }
          >
            +
          </button>
        </div>
      </div>
      {group('Cuisine', 'cuisine', ['Italian', 'Asian', 'Middle Eastern', 'American'])}
      {group('Dietary', 'diet', ['Vegetarian', 'Vegan', 'Gluten-free'])}
      {group('Level', 'levels', ['Starter', 'Home cook', 'Skilled', 'Chef'])}
      {group('Macros', 'macros', ['High protein', 'High fiber', 'Under 500 cal'])}
      <div className="sticky-action sticky -bottom-8 bg-paper pt-3 pb-2 px-0">
        <Button onClick={back}>
          Show {count} {count === 1 ? 'recipe' : 'recipes'}
        </Button>
      </div>
    </>
  );
}
