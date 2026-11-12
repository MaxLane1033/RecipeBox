import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { authClient } from '@/lib/auth-client';
import { colors } from '@/lib/theme';
import { Button } from './button';
import { Screen } from './screen';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const signup = mode === 'signup';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (submitting) return;
    if (!email.trim() || !password || (signup && !name.trim())) {
      setError('Please complete all fields.');
      return;
    }
    if (signup && password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const credentials = { email: email.trim(), password };
      const result = signup
        ? await authClient.signUp.email({ ...credentials, name: name.trim() })
        : await authClient.signIn.email(credentials);
      if (result.error) setError(result.error.message ?? 'Unable to sign in. Please try again.');
      // The root route guard navigates when Better Auth updates the session.
    } catch {
      setError('Cannot reach the server. Check your connection and API URL.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <View style={styles.heading}>
        <Text style={styles.brand}>RecipeBox</Text>
        <Text style={styles.title}>{signup ? 'Create your account' : 'Welcome back'}</Text>
        <Text style={styles.description}>
          {signup ? 'A place for your favorite recipes.' : 'Sign in to your RecipeBox.'}
        </Text>
      </View>
      {signup && (
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            accessibilityLabel="Name"
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            textContentType="name"
            editable={!submitting}
          />
        </View>
      )}
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          editable={!submitting}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          accessibilityLabel="Password"
          style={styles.input}
          placeholder={signup ? 'At least 8 characters' : 'Your password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={signup ? 'new-password' : 'current-password'}
          textContentType={signup ? 'newPassword' : 'password'}
          editable={!submitting}
          returnKeyType="go"
          onSubmitEditing={() => {
            void submit();
          }}
        />
      </View>
      {error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      <Button
        title={signup ? 'Create account' : 'Sign in'}
        loading={submitting}
        onPress={() => {
          void submit();
        }}
      />
      <Link href={signup ? '/login' : '/signup'} replace style={styles.link}>
        {signup ? 'Already have an account? Sign in' : 'New here? Create an account'}
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 12, marginTop: 24, marginBottom: 12 },
  brand: { color: colors.primary, fontSize: 18, fontWeight: '700' },
  title: { color: colors.text, fontSize: 30, fontWeight: '700' },
  description: { color: colors.muted, fontSize: 16 },
  field: { gap: 8 },
  label: { color: colors.text, fontSize: 15, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    minHeight: 50,
  },
  error: { color: colors.error, fontSize: 14 },
  link: { color: colors.primary, fontSize: 15, textAlign: 'center', paddingVertical: 12 },
});
