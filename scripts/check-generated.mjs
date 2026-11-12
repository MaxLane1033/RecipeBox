import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
async function snapshot(directory) {
  const files = {};
  async function visit(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = join(path, entry.name);
      if (entry.isDirectory()) await visit(file);
      else
        files[file] = createHash('sha256')
          .update(await readFile(file))
          .digest('hex');
    }
  }
  await visit(join(root, directory));
  return files;
}
async function outputs() {
  return snapshot('apps/mobile/src/api/generated');
}
const before = await outputs();
const result = spawnSync(process.execPath, ['scripts/generate-api.mjs'], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const after = await outputs();
const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(
  (file) => before[file] !== after[file],
);
if (changed.length) {
  console.error('Generated files were stale. Review and include the regenerated outputs:');
  for (const file of changed) console.error(file.slice(root.length));
  process.exitCode = 1;
} else {
  console.log('Generated mobile API files match the running API.');
}
