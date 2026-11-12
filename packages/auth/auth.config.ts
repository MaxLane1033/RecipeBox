// Schema generation only: this pool is lazy and the CLI does not need a running database.
// The schema import is intentionally omitted so generation also works before auth.ts exists.
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { authOptions } from './src/options.ts';

export const auth = betterAuth({
  ...authOptions,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET ?? 'recipebox-schema-generation-only-secret',
  database: drizzleAdapter(
    drizzle(process.env.DATABASE_URL ?? 'postgresql://recipebox:recipebox@localhost:5433/recipebox'),
    { provider: 'pg' },
  ),
});
