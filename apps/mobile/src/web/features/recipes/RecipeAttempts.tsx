import { Button } from '@/web/components/ui/Button';
import { AttemptRow, newestAttempts } from '@/web/features/logging/AttemptRow';
import type { MealLogEntry } from '@/web/types/domain';

type RecipeAttemptsProps = {
  attempts: MealLogEntry[];
  openAttempt: (id: string) => void;
  viewAll: () => void;
  logAttempt?: () => void;
};

export function RecipeAttempts({ attempts, openAttempt, viewAll, logAttempt }: RecipeAttemptsProps) {
  const recent = newestAttempts(attempts).slice(0, 2);
  return (
    <section className="mt-7" aria-labelledby="cooking-history-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="cooking-history-title" className="text-[17px]">
          Your latest attempts
        </h2>
        {attempts.length > 0 && (
          <button type="button" className="text-action shrink-0" onClick={viewAll}>
            View all ({attempts.length})
          </button>
        )}
      </div>
      {recent.length ? (
        <ul className="mt-1 mb-4">
          {recent.map((attempt) => (
            <li key={attempt.id}>
              <AttemptRow attempt={attempt} open={() => openAttempt(attempt.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 mb-4 text-[13px]">
          {logAttempt
            ? 'Log your first attempt to remember how this recipe went.'
            : 'No attempts were recorded for this version.'}
        </p>
      )}
      {logAttempt && (
        <Button secondary onClick={logAttempt}>
          Log an attempt
        </Button>
      )}
    </section>
  );
}
