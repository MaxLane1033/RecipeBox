import { useState } from 'react';
import { createInitialMealLog } from '@/web/data/meal-log';
import { formatDate } from '@/web/lib/format';
import type { MealLogEntry, PostData } from '@/web/types/domain';

export function useMealJournal() {
  const [log, setLog] = useState<MealLogEntry[]>(createInitialMealLog);
  const [attempts, setAttempts] = useState<PostData[]>([]);
  const [goals, setGoals] = useState<string[][]>([]);
  const [streak, setStreak] = useState(5);

  const recordMeal = (post: PostData) => {
    const id = crypto.randomUUID();
    const saved = structuredClone({ ...post, id });
    setAttempts((previous) => [saved, ...previous]);
    setStreak((previous) => Math.min(7, previous + 1));
    setLog((previous) => [
      ...previous,
      {
        id,
        date: formatDate(new Date()),
        title: post.title,
        photo: post.photo,
        note: saved.note,
        stats: saved.stats,
        visibility: saved.visibility,
        recipeName: saved.recipeName,
        versionId: saved.versionId,
        versionName: saved.versionName,
        recipeSnapshot: saved.recipeSnapshot,
      },
    ]);
  };

  const posts = attempts.filter((attempt) => attempt.visibility !== 'private');

  return { log, attempts, posts, streak, recordMeal, goals, setGoals };
}
