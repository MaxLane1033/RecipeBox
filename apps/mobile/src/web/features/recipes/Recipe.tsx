import { History, Pencil } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import type { AppScreen } from '@/web/app/navigation';
import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { Icon } from '@/web/components/ui/Icon';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { SaveSheet } from '@/web/features/cookbooks/SaveSheet';
import { estimateRecipeMinutes, formatIngredient, getRecipe } from '@/web/lib/recipes';
import type { Cookbook, ExperienceLevel, RecipeData, RecipeVersion } from '@/web/types/domain';

type RecipeProps = {
  back: () => void;
  go: (s: AppScreen) => void;
  name: string;
  books: Cookbook[];
  saveRecipe: (b: string, r: string) => void;
  attempts?: ReactNode;
  level: ExperienceLevel;
  data?: RecipeData;
  version?: RecipeVersion;
  personal?: boolean;
  hasPersonalCopy?: boolean;
  sourceLabel?: string | null;
  snapshotView?: boolean;
  initialServings?: number;
  onOpenPersonal?: (servings?: number) => void;
  onOpenSource?: () => void;
  onEdit?: (servings: number) => void;
  onVersions?: () => void;
  onRestore?: () => void;
};
export function Recipe({
  back,
  go,
  name,
  books,
  saveRecipe,
  level,
  attempts,
  data,
  version,
  personal = false,
  hasPersonalCopy = false,
  sourceLabel = 'RecipeBox',
  snapshotView,
  initialServings = 2,
  onOpenPersonal,
  onOpenSource,
  onEdit,
  onVersions,
  onRestore,
}: RecipeProps) {
  const recipe = data ?? getRecipe(name);
  const [servings, setServings] = useState(initialServings);
  const [saveOpen, setSaveOpen] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  return (
    <>
      <Header
        title={snapshotView ? 'Recipe version' : personal ? 'My recipe' : 'Recipe'}
        back={back}
        trailingActions={[
          ...(personal && onEdit
            ? [
                {
                  label: 'Edit recipe',
                  icon: Pencil,
                  onClick: () => onEdit(servings),
                },
              ]
            : []),
          ...(personal && onVersions ? [{ label: 'Versions', icon: History, onClick: onVersions }] : []),
        ]}
      />
      <Photo className="hero-photo h-[230px]" name={name} />
      <div className="mt-5">
        <h1 className="mt-2 text-[29px]">{name}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          {sourceLabel &&
            (personal && onOpenSource ? (
              <button type="button" className="text-action text-[12px]" onClick={onOpenSource}>
                Adapted from {sourceLabel}
              </button>
            ) : (
              <p className="text-[12px] text-muted">
                {personal ? 'Adapted from' : 'From'} {sourceLabel}
              </p>
            ))}
          <Level level={RECIPE_LEVELS[name] || 'Starter'} />
        </div>
        <p className="mt-2">{recipe.blurb}</p>
        {personal && version && (snapshotView || version.parentId !== null) && (
          <div className="mt-3 rounded-control bg-dark px-3 py-2 text-[12px]">
            <b className="block">{version.name}</b>
            <span className="text-muted">
              {version.removed
                ? 'Removed version · kept for your cooking logs'
                : snapshotView
                  ? 'Saved recipe version'
                  : 'Current version'}
            </span>
            {version.changed && <p className="mt-1 text-[12px]">{version.changed}</p>}
            {onRestore && (
              <button type="button" className="text-action mt-1" onClick={onRestore}>
                Restore version
              </button>
            )}
          </div>
        )}
      </div>
      <div className="my-5 flex items-center gap-3 rounded-xl bg-dark p-4">
        <Icon name="timer" />
        <div>
          <b>About {estimateRecipeMinutes(recipe, level)} min</b>
          <p className="text-[12px]">A guide for cooks at your level</p>
        </div>
      </div>
      <div className="space-y-3">
        <Button disabled={personal && !!version?.removed} onClick={() => go('cook')}>
          Start cooking
        </Button>
        <Button
          secondary
          onClick={
            !personal && hasPersonalCopy && onOpenPersonal
              ? () => onOpenPersonal(servings)
              : () => setSaveOpen(true)
          }
        >
          {personal ? 'Cookbooks' : hasPersonalCopy ? 'Open my recipe' : 'Save to my recipes'}
        </Button>
      </div>
      <div className="section-heading">
        <h2>Ingredients</h2>
        <fieldset
          aria-label="Recipe servings"
          className="inline-flex shrink-0 items-center rounded-control border border-rule bg-white"
        >
          <button
            type="button"
            aria-label="Fewer servings"
            disabled={servings <= 2}
            className="grid h-control-small w-control-small place-items-center rounded-control-inner text-green hover:bg-dark disabled:opacity-30"
            onClick={() => setServings(servings - 1)}
          >
            <Icon name="minus" size={14} />
          </button>
          <output
            className="min-w-16 px-1 text-center text-[12px] font-semibold tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {servings} servings
          </output>
          <button
            type="button"
            aria-label="More servings"
            disabled={servings >= 4}
            className="grid h-control-small w-control-small place-items-center rounded-control-inner text-green hover:bg-dark disabled:opacity-30"
            onClick={() => setServings(servings + 1)}
          >
            <Icon name="plus" size={14} />
          </button>
        </fieldset>
      </div>
      <ul>
        {recipe.ing.map((ingredient, i) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: the recipe snapshot is immutable and checked ingredients intentionally use its fixed row positions.
            key={i}
          >
            <button
              type="button"
              aria-pressed={checked.includes(i)}
              className="flex min-h-12 w-full items-center gap-3 border-b border-rule py-3 text-left"
              onClick={() => setChecked((s) => (s.includes(i) ? s.filter((n) => n !== i) : [...s, i]))}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                  checked.includes(i) ? 'border-green bg-green text-white' : 'border-muted'
                }`}
              >
                {checked.includes(i) && <Icon name="check" size={14} />}
              </span>
              <span className={checked.includes(i) ? 'text-muted line-through' : ''}>
                {formatIngredient(ingredient, servings)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="section-heading">
        <h2>Method</h2>
        <span className="text-[12px] text-muted">{recipe.steps.length} steps</span>
      </div>
      <ol className="space-y-5">
        {recipe.steps.map(([heading, body], i) => (
          <li key={heading} className="flex gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-dark text-[12px] font-extrabold text-green">
              {i + 1}
            </span>
            <div>
              <h3>{heading}</h3>
              <p className="mt-1">{body}</p>
            </div>
          </li>
        ))}
      </ol>
      {attempts}
      {saveOpen && (
        <SaveSheet
          close={() => setSaveOpen(false)}
          recipe={name}
          books={books}
          onSave={saveRecipe}
          onOpenRecipe={
            !personal && onOpenPersonal
              ? () => {
                  setSaveOpen(false);
                  onOpenPersonal(servings);
                }
              : undefined
          }
        />
      )}
    </>
  );
}
