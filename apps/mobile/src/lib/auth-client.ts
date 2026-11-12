import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { apiUrl } from './env';

export const authClient = createAuthClient({
  baseURL: apiUrl,
  plugins: [expoClient({ scheme: 'recipebox', storagePrefix: 'recipebox', storage: SecureStore })],
});
