import { useRouter } from 'expo-router';
import { type AppScreen, isMainTab, type NavigationSelection, parentScreen } from '@/web/app/navigation';
import { useAppNavigate, useAppScreen } from '@/web/navigation/navigation';

/** Adapts existing screen callbacks to Expo Router navigation. */
export function useNavigation(selection: NavigationSelection) {
  const router = useRouter();
  const navigate = useAppNavigate();
  const screen = useAppScreen();

  const navigateScreen = (nextScreen: AppScreen, replace = false) => {
    switch (nextScreen) {
      case 'home':
        void navigate({ to: '/', replace });
        break;
      case 'discover':
      case 'explore':
        void navigate({ to: '/discover', replace });
        break;
      case 'learn':
        void navigate({
          to: '/discover',
          search: { tab: 'learn' },
          replace,
        });
        break;
      case 'profile':
        void navigate({ to: '/profile', replace });
        break;
      case 'recipe':
        void navigate({
          to: '/recipes/$recipeName',
          params: { recipeName: selection.recipeName },
          search: { view: selection.personalRecipe ? 'mine' : undefined },
          replace,
        });
        break;
      case 'cook':
        void navigate({
          to: '/recipes/$recipeName/cook',
          params: { recipeName: selection.recipeName },
          search: { version: selection.versionId },
          replace,
        });
        break;
      case 'recipeEdit':
        void navigate({
          to: '/recipes/$recipeName/edit',
          params: { recipeName: selection.recipeName },
          search: { version: selection.versionId },
          replace,
        });
        break;
      case 'recipeLogs':
        void navigate({
          to: '/recipes/$recipeName/logs',
          params: { recipeName: selection.recipeName },
          replace,
        });
        break;
      case 'versions':
      case 'splits':
        void navigate({
          to: '/recipes/$recipeName/versions',
          params: { recipeName: selection.recipeName },
          replace,
        });
        break;
      case 'versionDetail':
        void navigate({
          to: '/recipes/$recipeName/versions/$versionId',
          params: {
            recipeName: selection.recipeName,
            versionId: selection.versionId,
          },
          replace,
        });
        break;
      case 'cookbook':
        void navigate({ to: '/cookbook', replace });
        break;
      case 'cookbookDetail':
        void navigate({
          to: '/cookbooks/$bookName',
          params: { bookName: selection.bookName },
          replace,
        });
        break;
      case 'settings':
        void navigate({ to: '/settings', replace });
        break;
      case 'level':
        void navigate({ to: '/settings/level', replace });
        break;
      case 'import':
        void navigate({ to: '/recipes/import', replace });
        break;
      case 'challenge':
        void navigate({
          to: '/challenges/$challengeId',
          params: { challengeId: selection.challengeId },
          replace,
        });
        break;
      case 'createChallenge':
        void navigate({ to: '/challenges/new', replace });
        break;
      case 'filters':
        void navigate({ to: '/explore/filters', replace });
        break;
      case 'ask':
        void navigate({ to: '/explore/ask', replace });
        break;
      case 'scan':
        void navigate({ to: '/explore/scan', replace });
        break;
      case 'groups':
        void navigate({ to: '/groups', replace });
        break;
      case 'communities':
        void navigate({
          to: '/groups',
          search: { view: 'browse' },
          replace,
        });
        break;
      case 'community':
        void navigate({
          to: '/communities/$communityId',
          params: { communityId: selection.communityId },
          replace,
        });
        break;
      case 'createCommunity':
        void navigate({ to: '/communities/new', replace });
        break;
      case 'technique':
        void navigate({
          to: '/learn/techniques/$techniqueName',
          params: { techniqueName: selection.techniqueName },
          replace,
        });
        break;
      case 'course':
        void navigate({
          to: '/learn/courses/$courseName',
          params: { courseName: selection.courseName },
          replace,
        });
        break;
      case 'log':
        void navigate({
          to: '/log',
          search: {
            recipe: selection.recipeName,
            version: selection.versionId,
          },
          replace,
        });
        break;
    }
  };

  const back = () => {
    if (router.canGoBack()) router.back();
    else navigateScreen(parentScreen(screen), true);
  };

  return {
    screen,
    mainTab: isMainTab(screen) ? screen : 'home',
    isMain: isMainTab(screen),
    go: (nextScreen: AppScreen) => navigateScreen(nextScreen),
    back,
    replace: (nextScreen: AppScreen) => navigateScreen(nextScreen, true),
    resetHome: () => navigateScreen('home', true),
  };
}
