import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, AppState, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button } from '@/components/button';
import { authClient } from '@/lib/auth-client';
import { queryClient } from '@/lib/query-client';
import { colors } from '@/lib/theme';

function Navigation() {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const userId = session?.user.id;
  useEffect(() => {
    if (!isPending && !userId) {
      void queryClient.cancelQueries();
      queryClient.clear();
    }
  }, [isPending, userId]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      focusManager.setFocused(state === 'active');
      if (state === 'active') void refetch();
    });
    return () => subscription.remove();
  }, [refetch]);

  if (isPending)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text>Opening RecipeBox…</Text>
      </View>
    );
  if (error && !session)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          Cannot restore your session. Check that the API is running and the mobile API URL is reachable.
        </Text>
        <Button
          title="Try again"
          onPress={() => {
            void refetch();
          }}
        />
      </View>
    );

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Navigation />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.background, padding: 32, justifyContent: 'center', gap: 20 },
  error: { color: colors.error, fontSize: 16 },
});
