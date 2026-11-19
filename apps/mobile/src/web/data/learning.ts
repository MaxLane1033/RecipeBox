import type { ExperienceLevel } from '@/web/types/domain';

export const TECHNIQUES: Record<
  string,
  {
    time: string;
    len: string;
    lead: string;
    steps: string[];
    tip: string;
  }
> = {
  'Dice an onion': {
    time: '3 min',
    len: '03:12',
    lead: 'Small, even pieces cook at the same speed.',
    steps: [
      'Cut the onion in half through the root.',
      'Make horizontal and vertical cuts, stopping before the root.',
      'Slice across your cuts, then discard the root.',
    ],
    tip: 'Keep your fingertips curled like a claw.',
  },
  'Crack an egg': {
    time: '2 min',
    len: '02:05',
    lead: 'A clean crack keeps shell out of your food.',
    steps: [
      'Tap the egg firmly on a flat surface, not the bowl edge.',
      'Press your thumbs into the crack and pull the halves apart.',
      'Drop the egg into a small bowl first, then add it to the pan.',
    ],
    tip: 'Fish out stray shell with a larger piece of shell.',
  },
};

export const COURSES: Record<
  string,
  {
    level: ExperienceLevel;
    blurb: string;
    cover: string;
    done: number;
    lessons: string[];
    recipes: string[];
  }
> = {
  'Italian basics': {
    level: 'Starter',
    blurb: 'Six practical lessons for better weeknight pasta.',
    cover: 'Italian basics',
    done: 2,
    lessons: [
      'Build a flavor base',
      'Make a glossy pasta sauce',
      'Shape fresh pasta',
      'Balance a tomato sauce',
      'Risotto without stress',
      'Your final pasta dinner',
    ],
    recipes: [
      'Garlic butter pasta',
      'Garlic butter pasta',
      'Garlic butter pasta',
      'Shakshuka',
      'Egg fried rice',
      'Garlic butter pasta',
    ],
  },
  'Knife skills': {
    level: 'Starter',
    blurb: 'Safe, steady cuts for every recipe.',
    cover: 'Dice an onion',
    done: 1,
    lessons: [
      'Hold the knife',
      'Dice an onion',
      'Slice and mince',
      'Cut herbs',
      'Prep a stir-fry',
      'Put it all together',
    ],
    recipes: [
      'Veggie fried rice',
      'Veggie fried rice',
      'Veggie fried rice',
      'Crispy smashed potatoes',
      'Veggie fried rice',
      'Sheet pan chicken',
    ],
  },
  'Weeknight Mexican': {
    level: 'Home cook',
    blurb: 'Fast, flavorful dinners with pantry staples.',
    cover: 'Veggie fried rice',
    done: 2,
    lessons: [
      'Toast spices',
      'Warm tortillas',
      'Make quick salsa',
      'Sheet pan fajitas',
      'Egg tacos',
      'Taco night',
    ],
    recipes: [
      'Shakshuka',
      'Egg fried rice',
      'Veggie fried rice',
      'Sheet pan chicken',
      'Shakshuka',
      'Sheet pan chicken',
    ],
  },
};
