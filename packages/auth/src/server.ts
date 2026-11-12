import type { Database } from '@recipebox/db';
import { schema } from '@recipebox/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { authOptions } from './options.ts';

type AuthConfig = {
  db: Database;
  secret: string;
  baseURL: string;
  trustedOrigins?: string[];
  development?: boolean;
};

export function createAuth(config: AuthConfig) {
  return betterAuth({
    ...authOptions,
    baseURL: config.baseURL,
    secret: config.secret,
    database: drizzleAdapter(config.db, { provider: 'pg', schema }),
    trustedOrigins: [
      'recipebox://',
      'recipebox://*',
      ...(config.development ? ['exp://', 'exp://**'] : []),
      ...(config.trustedOrigins ?? []),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth['$Infer']['Session'];
