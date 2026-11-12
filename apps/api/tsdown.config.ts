import { globSync } from 'node:fs';
import { relative, sep } from 'node:path';
import { defineConfig } from 'tsdown';

// Autoload discovers these files at runtime, so they must also be build entries.
const autoloadEntries = Object.fromEntries(
  globSync(['src/plugins/**/*.ts', 'src/modules/**/*.controller.ts'], {
    exclude: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts'],
  }).map((file) => [relative('src', file).split(sep).join('/').replace(/\.ts$/, ''), file]),
);

export default defineConfig({
  entry: { server: 'src/server.ts', app: 'src/app.ts', ...autoloadEntries },
  // Keep shared chunks beside app.js so import.meta.dirname resolves to dist/.
  outputOptions: { chunkFileNames: '[name]-[hash].js' },
  format: 'esm',
  platform: 'node',
  target: 'node24',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  fixedExtension: false,
  deps: {
    // Bundle only our source packages. All third-party runtime dependencies remain external.
    alwaysBundle: [/^@recipebox\//],
  },
});
