import { Slot } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { AppShell } from '@/web/app/AppShell';
import { RecipeBoxProvider, useRecipeBoxModel } from '@/web/app/RecipeBoxProvider';
import { ScrollRestoration } from '@/web/navigation/ScrollRestoration';

function MainAppLayout() {
  const model = useRecipeBoxModel();

  return (
    <AppShell
      onboarding={false}
      isMain={model.navigation.isMain}
      mainTab={model.navigation.mainTab}
      go={model.navigation.go}
    >
      <ScrollRestoration />
      <Slot />
    </AppShell>
  );
}

export function AuthenticatedApp() {
  const { data: session } = authClient.useSession();
  if (!session) return null;

  return (
    <div className="recipebox-app">
      <RecipeBoxProvider key={session.user.id} user={session.user}>
        <MainAppLayout />
      </RecipeBoxProvider>
    </div>
  );
}
