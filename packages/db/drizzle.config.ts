import { defineConfig } from 'drizzle-kit';
import { z } from 'zod';

const databaseUrl = z
  .url()
  .parse(process.env.DATABASE_URL ?? 'postgresql://recipebox:recipebox@localhost:5433/recipebox');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dbCredentials: { url: databaseUrl },
});
