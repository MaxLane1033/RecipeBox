import { Platform } from 'react-native';
import { authClient } from './auth-client';
import { apiUrl } from './env';

export class ApiError<T = unknown> extends Error {
  constructor(
    public status: number,
    public data: T,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
export type ErrorType<T> = ApiError<T>;
export type BodyType<T> = T;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (Platform.OS !== 'web') {
    const cookie = await authClient.getCookie();
    if (cookie) headers.set('Cookie', cookie);
  }
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
    credentials: Platform.OS === 'web' ? 'include' : 'omit',
  });
  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }
  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string'
        ? data.message
        : `Request failed (${response.status})`;
    if (response.status === 401) authClient.$store.notify('$sessionSignal');
    throw new ApiError(response.status, data, message);
  }
  return data as T;
}
