import { type Href, useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import { useCallback } from 'react';
import type { AppScreen } from '@/web/app/navigation';

export type AppLocation = {
  to?: string;
  params?: Record<string, string>;
  search?: Record<string, string | number | undefined>;
  replace?: boolean;
};

/** The browser URL remains owned by Expo Router; this adapter preserves screen callbacks. */
export function appHref(location: AppLocation): string {
  const pathname = (location.to === '/' ? '/home' : (location.to ?? '/home')).replace(
    /\$([A-Za-z][A-Za-z0-9]*)/g,
    (_, key: string) => encodeURIComponent(location.params?.[key] ?? ''),
  );
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(location.search ?? {})) {
    if (value !== undefined) query.set(key, String(value));
  }
  return `${pathname}${query.size ? `?${query.toString()}` : ''}`;
}

export function useAppNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  return useCallback(
    async (location: AppLocation) => {
      const href = appHref({ ...location, to: location.to ?? pathname }) as Href;
      if (location.replace) router.replace(href);
      else router.push(href);
    },
    [pathname, router],
  );
}

/** Global params update the persistent app provider when a nested screen changes. */
export function useRouteValues(): Record<string, string | undefined> {
  const values = useGlobalSearchParams();
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
}
export const useRecipeParams = useRouteValues;

export function screenForPath(path: string): AppScreen {
  if (path === '/' || path === '/home') return 'home';
  if (path === '/discover' || path === '/explore' || path === '/learn') return 'discover';
  if (path === '/cookbook') return 'cookbook';
  if (path === '/groups' || path === '/communities') return 'groups';
  if (path === '/profile') return 'profile';
  if (path === '/log') return 'log';
  if (path === '/settings/level') return 'level';
  if (path === '/settings') return 'settings';
  if (path === '/recipes/import') return 'import';
  if (/^\/recipes\/[^/]+\/versions\/[^/]+$/.test(path)) return 'versionDetail';
  if (/^\/recipes\/[^/]+\/versions$/.test(path)) return 'versions';
  if (/^\/recipes\/[^/]+\/edit$/.test(path)) return 'recipeEdit';
  if (/^\/recipes\/[^/]+\/logs$/.test(path)) return 'recipeLogs';
  if (/^\/recipes\/[^/]+\/cook$/.test(path)) return 'cook';
  if (/^\/recipes\/[^/]+$/.test(path)) return 'recipe';
  if (/^\/attempts\/[^/]+$/.test(path)) return 'attempt';
  if (/^\/cookbooks\/[^/]+$/.test(path)) return 'cookbookDetail';
  if (path === '/challenges/new') return 'createChallenge';
  if (/^\/challenges\/[^/]+$/.test(path)) return 'challenge';
  if (path === '/communities/new') return 'createCommunity';
  if (/^\/communities\/[^/]+$/.test(path)) return 'community';
  if (/^\/learn\/techniques\/[^/]+$/.test(path)) return 'technique';
  if (/^\/learn\/courses\/[^/]+$/.test(path)) return 'course';
  if (path === '/explore/filters') return 'filters';
  if (path === '/explore/ask') return 'ask';
  if (path === '/explore/scan') return 'scan';
  return 'home';
}

export function useAppScreen(): AppScreen {
  return screenForPath(usePathname());
}
