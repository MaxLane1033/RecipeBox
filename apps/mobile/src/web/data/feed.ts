import type { FeedEntry } from '@/web/features/feed/types';

// Illustrative social content; each author is marked as a sample cook in the UI.
export const FOLLOWING_POSTS: FeedEntry[] = [
  {
    id: 'following-jo-potatoes',
    name: 'Jo',
    title: 'Crispy smashed potatoes',
    note: 'Extra crispy at 450°! Letting them steam-dry before roasting made all the difference.',
    stats: ['28 min', 'Easy', 'Cooked 3x'],
    cheerCount: 12,
    timeLabel: '2h',
    sample: true,
  },
  {
    id: 'following-priya-noodles',
    name: 'Priya',
    title: 'Chili crisp noodles',
    note: 'A splash of noodle water brought the sauce together. Saving that little trick for next time.',
    stats: ['20 min', 'Easy', 'Cooked 2x'],
    cheerCount: 8,
    timeLabel: '3h',
    sample: true,
  },
];

export const SUGGESTED_POSTS: FeedEntry[] = [
  {
    id: 'suggested-dev-pasta',
    name: 'Dev',
    title: 'Garlic butter pasta',
    note: 'Kept the heat low and added pasta water a little at a time. Finally got that glossy sauce.',
    stats: ['35 min', 'Starter', 'Cooked 4x'],
    source: 'Budget bites',
    cheerCount: 6,
    sample: true,
  },
  {
    id: 'suggested-mina-rice',
    name: 'Mina',
    title: 'Veggie fried rice',
    note: 'Cold rice and a hot pan. I used the vegetables I already had, and dinner came together quickly. Cooking the vegetables first and adding them back at the end kept a little crunch.',
    stats: ['25 min', 'Home cook', 'One pan'],
    source: 'Budget bites',
    cheerCount: 9,
    sample: true,
  },
  {
    id: 'suggested-sam-chicken',
    name: 'Sam',
    title: 'Sheet pan chicken',
    note: 'Cut the potatoes smaller this time so everything finished together. One less thing to juggle.',
    stats: ['45 min', 'Home cook', 'One pan'],
    source: 'One-pan club',
    cheerCount: 5,
    sample: true,
  },
];
