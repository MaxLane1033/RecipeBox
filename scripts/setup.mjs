import { randomBytes } from 'node:crypto';
import { access, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
for (const path of ['.env', 'apps/mobile/.env']) {
  const target = new URL(path, root);
  try {
    await access(target);
    console.log(`Kept existing ${path}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    let content = await readFile(new URL(`${path}.example`, root), 'utf8');
    if (path === '.env') {
      content = content.replace(
        'replace-with-a-random-secret-of-at-least-32-characters',
        randomBytes(32).toString('hex'),
      );
    }
    await writeFile(target, content, { flag: 'wx', mode: 0o600 });
    console.log(`Created ${path}`);
  }
}
console.log('Next: pnpm db:up && pnpm db:migrate, then start API and mobile in separate terminals.');
