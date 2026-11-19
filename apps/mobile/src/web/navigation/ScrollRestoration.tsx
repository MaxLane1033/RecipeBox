import { usePathname } from 'expo-router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouteValues } from './navigation';

/** Expo owns browser history; this restores the app's independently scrolling body. */
export function ScrollRestoration() {
  const pathname = usePathname();
  const values = useRouteValues();
  const key = `${pathname}?${JSON.stringify(Object.entries(values).sort(([a], [b]) => a.localeCompare(b)))}`;
  const positions = useRef(new Map<string, number>());
  const traversing = useRef(false);

  useEffect(() => {
    const markTraversal = () => {
      traversing.current = true;
    };
    window.addEventListener('popstate', markTraversal);
    return () => window.removeEventListener('popstate', markTraversal);
  }, []);

  useLayoutEffect(() => {
    const content = document.getElementById('page-content');
    if (!content) return;
    content.scrollTop = traversing.current ? (positions.current.get(key) ?? 0) : 0;
    traversing.current = false;
    const remember = () => positions.current.set(key, content.scrollTop);
    content.addEventListener('scroll', remember, { passive: true });
    return () => {
      remember();
      content.removeEventListener('scroll', remember);
    };
  }, [key]);

  return null;
}
