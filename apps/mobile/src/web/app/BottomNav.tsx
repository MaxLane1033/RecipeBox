import type { AppScreen, MainTab } from '@/web/app/navigation';
import { Icon } from '@/web/components/ui/Icon';

type BottomNavProps = {
  tab: MainTab;
  go: (screen: AppScreen) => void;
};
const tabs: [MainTab, string, string][] = [
  ['home', 'Home', 'home'],
  ['discover', 'Discover', 'search'],
  ['cookbook', 'Cookbook', 'book'],
  ['groups', 'Groups', 'users'],
  ['profile', 'Profile', 'user'],
];
export function BottomNav({ tab, go }: BottomNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="bottom-nav z-10 grid min-h-[calc(64px_+_env(safe-area-inset-bottom))] shrink-0 grid-cols-5 border-t border-rule bg-card pb-[env(safe-area-inset-bottom)]"
    >
      {tabs.map(([id, label, icon]) => (
        <button
          type="button"
          key={id}
          className={`flex min-w-0 flex-col items-center justify-center gap-0.5 py-1 ${
            tab === id ? 'active font-extrabold text-green' : 'text-muted'
          }`}
          aria-current={tab === id ? 'page' : undefined}
          onClick={() => go(id)}
        >
          <span className="grid h-7 w-12 place-items-center">
            <Icon name={icon} size={24} />
          </span>
          <small className="text-[11px]">{label}</small>
        </button>
      ))}
    </nav>
  );
}
