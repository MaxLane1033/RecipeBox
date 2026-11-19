import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useGetProfile } from '@/api/generated/client';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { authClient } from '@/lib/auth-client';
import { queryClient } from '@/lib/query-client';
import { colors } from '@/lib/theme';

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const profile = useGetProfile({
    query: { enabled: !!session, queryKey: ['/api/profile', session?.user.id] },
  });
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setSigningOut(true);
    setError(null);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(result.error.message ?? 'Could not sign out. Try again.');
        return;
      }
      await queryClient.cancelQueries();
      queryClient.clear();
    } catch {
      setError('Cannot reach the server. Try signing out again when connected.');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Welcome, {session?.user.name}.</Text>
      <Text style={styles.description}>Your RecipeBox is ready for its first recipe.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Your account</Text>
        {profile.isPending && <ActivityIndicator color={colors.primary} />}
        {profile.error && (
          <>
            <Text accessibilityRole="alert" style={styles.error}>
              {profile.error.message}
            </Text>
            <Button
              title="Retry"
              secondary
              onPress={() => {
                void profile.refetch();
              }}
            />
          </>
        )}
        {profile.data && (
          <>
            <Text style={styles.name}>{profile.data.name}</Text>
            <Text style={styles.description}>{profile.data.email}</Text>
          </>
        )}
      </View>
      {error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      <Button
        title="Sign out"
        secondary
        loading={signingOut}
        onPress={() => {
          void signOut();
        }}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 30, fontWeight: '700', marginTop: 24 },
  description: { color: colors.muted, fontSize: 16 },
  card: {
    padding: 20,
    gap: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  label: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  name: { color: colors.text, fontSize: 20, fontWeight: '600' },
  error: { color: colors.error, fontSize: 14 },
});
