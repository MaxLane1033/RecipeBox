import type { Dispatch, SetStateAction } from 'react';
import type { AppScreen } from '@/web/app/navigation';
import { History } from '@/web/features/profile/History';
import { Insights } from '@/web/features/progress/Insights';
import { PersonalGoals } from '@/web/features/progress/PersonalGoals';
import type { MealLogEntry } from '@/web/types/domain';

type ProgressProps = {
  log: MealLogEntry[];
  goals: string[][];
  setGoals: Dispatch<SetStateAction<string[][]>>;
  section: 'Insights' | 'History' | 'Goals';
  go: (screen: AppScreen) => void;
  openAttempt: (id: string) => void;
};

export function Progress({ log, goals, setGoals, section, go, openAttempt }: ProgressProps) {
  if (section === 'History') return <History log={log} openAttempt={openAttempt} />;
  if (section === 'Goals') return <PersonalGoals extra={goals} setExtra={setGoals} />;
  return <Insights go={go} />;
}
