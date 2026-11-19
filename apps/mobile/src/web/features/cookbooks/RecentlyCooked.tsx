import { Photo } from '@/web/components/ui/Photo';
import { RECIPE_LEVELS } from '@/web/data/recipes';
import { formatDate } from '@/web/lib/format';
import { hasOwnKey } from '@/web/lib/records';
import type { MealLogEntry } from '@/web/types/domain';

function cookedDate(date: string) {
  const today = new Date();
  if (date === formatDate(today)) return 'Cooked today';
  today.setDate(today.getDate() - 1);
  if (date === formatDate(today)) return 'Cooked yesterday';
  return `Cooked ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`))}`;
}

type RecentlyCookedProps = {
  log: MealLogEntry[];
  openRecipe: (name: string) => void;
};

export function RecentlyCooked({ log, openRecipe }: RecentlyCookedProps) {
  const seen = new Set<string>();
  const recent = [...log]
    .reverse()
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((entry) => {
      if (seen.has(entry.title) || !hasOwnKey(RECIPE_LEVELS, entry.title)) return false;
      seen.add(entry.title);
      return true;
    })
    .slice(0, 6);
  if (!recent.length) return null;
  return (
    <section aria-labelledby="recently-cooked-title" className="mb-5 border-b border-rule pb-4">
      <h2 id="recently-cooked-title" className="mb-3 text-[14px]">
        Recently cooked
      </h2>
      <div className="scrollbar-none flex snap-x gap-4 overflow-x-auto pb-2">
        {recent.map((entry) => (
          <button
            type="button"
            key={entry.id}
            className="flex w-48 shrink-0 snap-start items-center gap-3 text-left"
            onClick={() => openRecipe(entry.title)}
          >
            <span aria-hidden="true" className="shrink-0 [&_.photo]:min-h-0">
              <Photo name={entry.title} src={entry.photo} className="h-12 w-12" />
            </span>
            <span className="min-w-0">
              <b className="line-clamp-2 text-[12px] leading-snug">{entry.title}</b>
              <span className="mt-1 block text-[11px] text-muted">{cookedDate(entry.date)}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
