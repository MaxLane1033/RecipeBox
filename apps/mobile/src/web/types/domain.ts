export type ExperienceLevel = 'Starter' | 'Home cook' | 'Skilled' | 'Chef';

export type RecipeVersionLink = {
  recipeName?: string;
  versionId?: string;
  versionName?: string;
  recipeSnapshot?: RecipeData;
};

export type PostData = RecipeVersionLink & {
  id?: string;
  name: string;
  title: string;
  photo?: string;
  stats: string[];
  reflection?: {
    worked: string;
    changed: string;
    learned: string;
  };
  note?: string;
  visibility?: 'public' | 'private';
};

export type RecipeVersion = {
  id: string;
  recipeName: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  snapshot: RecipeData;
  changed: string;
  removed?: boolean;
  restoredFromId?: string;
};

export type Challenge = {
  id: string;
  name: string;
  metric: string;
  goal: number;
  left: number;
  members: {
    name: string;
    count: number;
  }[];
};

export type MealLogEntry = RecipeVersionLink & {
  id: string;
  date: string;
  title: string;
  photo?: string;
  note?: string;
  stats?: string[];
  visibility?: 'public' | 'private';
};

export type RecipeData = {
  source?: string | null;
  cuisine: string;
  diet: string[];
  macro: string[];
  has: string[];
  dishes: number;
  blurb: string;
  ing: [number, string, string][];
  steps: [string, string, number][];
};

export type RecipeFilters = {
  ings: string[];
  time: number;
  dishes: number;
  cuisine: string[];
  diet: string[];
  levels: string[];
  macros: string[];
};

export type CommunityPost = {
  id?: string;
  name: string;
  title: string;
  text?: string;
};

export type CookingCommunity = {
  id: string;
  name: string;
  members: string;
  blurb: string;
  priv: boolean;
  status: 'none' | 'joined' | 'requested';
  cover: string;
  posts: CommunityPost[];
};

export type Cookbook = {
  name: string;
  recipes: string[];
};
