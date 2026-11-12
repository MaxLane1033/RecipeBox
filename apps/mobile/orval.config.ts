import { defineConfig } from 'orval';

const input = process.env.API_SCHEMA_URL ?? 'http://localhost:3000/openapi.json';

export default defineConfig({
  recipebox: {
    input,
    output: {
      target: './src/api/generated/client.ts',
      schemas: './src/api/generated/models',
      mode: 'single',
      client: 'react-query',
      httpClient: 'fetch',
      formatter: 'biome',
      override: {
        mutator: { path: './src/lib/http.ts', name: 'apiFetch' },
        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
  recipeboxZod: {
    input,
    output: {
      target: './src/api/generated/schemas.zod.ts',
      mode: 'single',
      client: 'zod',
      formatter: 'biome',
    },
  },
});
