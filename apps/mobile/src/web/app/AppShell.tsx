import { Plus, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { BottomNav } from '@/web/app/BottomNav';
import type { AppScreen, MainTab } from '@/web/app/navigation';
import { BottomBarHost } from '@/web/components/ui/BottomBar';
import { Header, HeaderHost } from '@/web/components/ui/Header';

type AppShellProps = {
  children: ReactNode;
  onboarding: boolean;
  isMain: boolean;
  mainTab: MainTab;
  go: (screen: AppScreen) => void;
};
const titles: Record<MainTab, string> = {
  home: 'RecipeBox',
  discover: 'Discover',
  cookbook: 'Cookbook',
  groups: 'Groups',
  profile: 'Profile',
};
export function AppShell({ children, onboarding, isMain, mainTab, go }: AppShellProps) {
  return (
    <main className="recipebox-app stage flex min-h-dvh w-full justify-center bg-dark sm:py-6">
      <div className="phone relative flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-paper sm:h-[min(900px,calc(100dvh-48px))] sm:rounded-[28px] sm:shadow-xl">
        <BottomBarHost>
          <HeaderHost>
            {isMain && !onboarding && (
              <Header
                title={titles[mainTab]}
                divider={mainTab !== 'groups' && mainTab !== 'discover'}
                leadingAction={
                  mainTab === 'home' || mainTab === 'profile'
                    ? {
                        label: 'Log a meal',
                        icon: Plus,
                        onClick: () => go('log'),
                      }
                    : undefined
                }
                trailingAction={
                  mainTab === 'profile'
                    ? {
                        label: 'Settings',
                        icon: Settings,
                        onClick: () => go('settings'),
                      }
                    : undefined
                }
              />
            )}
            <div
              id="page-content"
              className={`screen min-h-0 flex-1 bg-surface overflow-y-auto overscroll-contain px-5 pt-4 pb-8 ${
                isMain && !onboarding ? 'with-nav' : ''
              } ${onboarding ? 'fit' : ''}`}
            >
              {children}
            </div>
            {isMain && !onboarding && <BottomNav tab={mainTab} go={go} />}
          </HeaderHost>
        </BottomBarHost>
      </div>
    </main>
  );
}
