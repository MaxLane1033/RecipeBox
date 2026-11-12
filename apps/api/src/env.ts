import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  CORS_ORIGINS: z
    .string()
    .default('')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
});

export function readEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    // Report names and validation issues without echoing environment values.
    throw new Error(
      `Invalid API environment: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
    );
  }
  if (result.data.BETTER_AUTH_SECRET.startsWith('replace-with-')) {
    throw new Error('Set BETTER_AUTH_SECRET in .env to a random secret before starting the API.');
  }
  return result.data;
}
