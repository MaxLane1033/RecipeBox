import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/index.ts';

// The API loads and validates DATABASE_URL at startup. The shared pool opens
// connections only when a query runs.
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export type Database = typeof db;
export * from './schema/index.ts';
export { schema };
