import type { Challenge } from '@/web/types/domain';

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    name: '7-day streak with Jo',
    metric: 'Streak',
    goal: 7,
    left: 2,
    members: [
      { name: 'Jo', count: 6 },
      { name: 'Alex', count: 5 },
    ],
  },
  {
    id: 'c2',
    name: 'Meal prep Sunday',
    metric: 'Meals cooked',
    goal: 10,
    left: 2,
    members: [
      { name: 'Jo', count: 6 },
      { name: 'Alex', count: 5 },
      { name: 'Sam', count: 4 },
      { name: 'Dev', count: 2 },
    ],
  },
];
