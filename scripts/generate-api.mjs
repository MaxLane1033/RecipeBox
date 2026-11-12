import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('../', import.meta.url));
const schemaUrl = process.env.API_SCHEMA_URL ?? 'http://localhost:3000/openapi.json';

// Check the live schema before cleaning generated clients. No schema file is written.
try {
  const response = await fetch(schemaUrl, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const schema = await response.json();
  if (!schema || typeof schema !== 'object' || !('openapi' in schema)) {
    throw new Error('Expected an OpenAPI document');
  }
} catch (error) {
  console.error(
    `Cannot read ${schemaUrl}: ${error.message}. Start pnpm dev:api first, or set API_SCHEMA_URL.`,
  );
  process.exit(1);
}

rmSync(new URL('../apps/mobile/src/api/generated/', import.meta.url), { recursive: true, force: true });
const result = spawnSync('pnpm', ['--filter', '@recipebox/mobile', 'generate:api'], {
  cwd,
  stdio: 'inherit',
  env: { ...process.env, API_SCHEMA_URL: schemaUrl },
  shell: process.platform === 'win32',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
