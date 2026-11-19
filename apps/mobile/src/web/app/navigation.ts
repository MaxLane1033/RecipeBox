export const MAIN_TABS = ['home', 'discover', 'cookbook', 'groups', 'profile'] as const;

export type MainTab = (typeof MAIN_TABS)[number];

export type AppScreen =
  | MainTab
  | 'explore'
  | 'learn'
  | 'cookbookDetail'
  | 'attempt'
  | 'recipe'
  | 'recipeEdit'
  | 'recipeLogs'
  | 'log'
  | 'cook'
  | 'versions'
  | 'versionDetail'
  | 'splits'
  | 'settings'
  | 'level'
  | 'import'
  | 'challenge'
  | 'createChallenge'
  | 'filters'
  | 'ask'
  | 'scan'
  | 'communities'
  | 'community'
  | 'createCommunity'
  | 'technique'
  | 'course';

export function isMainTab(screen: AppScreen): screen is MainTab {
  return MAIN_TABS.some((tab) => tab === screen);
}

/** Entity names used when a legacy screen action needs a parameterized URL. */
export type NavigationSelection = {
  recipeName: string;
  communityId: string;
  challengeId: string;
  techniqueName: string;
  courseName: string;
  bookName: string;
  versionId: string;
  personalRecipe?: boolean;
};

export function parentScreen(screen: AppScreen): AppScreen {
  switch (screen) {
    case 'recipe':
    case 'filters':
    case 'ask':
    case 'scan':
      return 'discover';
    case 'cook':
    case 'versions':
    case 'recipeEdit':
    case 'recipeLogs':
    case 'splits':
    case 'log':
      return 'recipe';
    case 'versionDetail':
      return 'versions';
    case 'communities':
    case 'challenge':
    case 'createChallenge':
    case 'community':
    case 'createCommunity':
      return 'groups';
    case 'technique':
    case 'course':
      return 'learn';
    case 'attempt':
      return 'profile';
    case 'cookbookDetail':
    case 'import':
      return 'cookbook';
    case 'settings':
      return 'profile';
    case 'level':
      return 'settings';
    default:
      return 'home';
  }
}
