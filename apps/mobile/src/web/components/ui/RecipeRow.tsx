import { Icon } from '@/web/components/ui/Icon';
import { Level } from '@/web/components/ui/Level';
import { Photo } from '@/web/components/ui/Photo';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { estimateMinutes, getRecipe } from '@/web/lib/recipes';
import type { ExperienceLevel } from '@/web/types/domain';

type RecipeRowProps = {
  name: string;
  level?: ExperienceLevel;
  compact?: boolean;
  open: () => void;
};
export function RecipeRow({ name, level = 'Starter', compact = false, open }: RecipeRowProps) {
  return (
    <button
      type="button"
      className={`flex w-full items-center border-b border-rule text-left hover:text-green ${
        compact ? 'gap-3 py-2.5 [&_.photo]:min-h-0' : 'gap-4 py-4'
      }`}
      onClick={open}
    >
      <Photo name={name} className={`shrink-0 ${compact ? 'h-16 w-16' : 'h-28 w-24'}`} />
      <div className="min-w-0 flex-1">
        <Level level={RECIPE_LEVELS[name] || 'Starter'} />
        <h3 className={`break-words ${compact ? 'mt-0.5 text-[14px]' : 'mt-1 text-[16px]'}`}>{name}</h3>
        <p className={compact ? 'mt-0.5 text-[11px]' : 'mt-2 text-[12px]'}>
          {estimateMinutes(name, level)} min · {getRecipe(name).ing.length} ingredients
        </p>
      </div>
      <span aria-hidden="true" className="text-green">
        <Icon name="forward" size={16} />
      </span>
    </button>
  );
}
