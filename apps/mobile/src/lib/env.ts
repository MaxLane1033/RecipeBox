import { z } from 'zod';

// Expo inlines public variables only when accessed with this exact dot notation.
const parsed = z.url().safeParse(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000');
if (!parsed.success) throw new Error('EXPO_PUBLIC_API_URL must be an absolute URL');
export const apiUrl = parsed.data.replace(/\/$/, '');
