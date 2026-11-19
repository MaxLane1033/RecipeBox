import { Button } from '@/web/components/ui/Button';
import { Header } from '@/web/components/ui/Header';
import { AttemptRow, newestAttempts } from '@/web/features/logging/AttemptRow';
import type { MealLogEntry } from '@/web/types/domain';

type CookingLogProps = {
  recipeName: string;
  attempts: MealLogEntry[];
  back: () => void;
  openAttempt: (id: string) => void;
  logAttempt?: () => void;
};

export function CookingLog({ recipeName, attempts, back, openAttempt, logAttempt }: CookingLogProps) {
  const recent = newestAttempts(attempts);
  return (
    <>
      <Header
        title="Cooking log"
        back={back}
        trailingAction={
          logAttempt
            ? {
                label: 'Log an attempt',
                icon: Plus,
                onClick: logAttempt,
              }
            : undefined
        }
      />
      <h2 className="break-words text-[24px]">{recipeName}</h2>
      <p className="mt-1 text-[12px]">
        {attempts.length} {attempts.length === 1 ? 'attempt' : 'attempts'}
      </p>
      {recent.length ? (
        <ul className="mt-4" aria-label={`Cooking attempts for ${recipeName}`}>
          {recent.map((attempt) => (
            <li key={attempt.id}>
              <AttemptRow attempt={attempt} open={() => openAttempt(attempt.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-xl bg-dark p-5">
          <h3>No attempts yet</h3>
          <p className="mt-2 mb-4 text-[13px]">
            {logAttempt
              ? 'Keep a photo or a note from the next time you cook this recipe.'
              : 'No attempts were recorded for this version.'}
          </p>
          {logAttempt && <Button onClick={logAttempt}>Log your first attempt</Button>}
        </div>
      )}
    </>
  );
}

import { Plus } from 'lucide-react';
