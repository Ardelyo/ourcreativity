// Runner uji unit: membundel tests/*.test.ts dengan esbuild (sudah ada lewat Vite) lalu menjalankannya dengan node:test.
// Cara ini jalan di Node 20 (CI) maupun 22 tanpa dependensi tambahan.
import { buildSync } from 'esbuild';
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = mkdtempSync(join(tmpdir(), 'oc-tests-'));
const entries = readdirSync(here).filter((f) => f.endsWith('.test.ts')).map((f) => join(here, f));

try {
  buildSync({ entryPoints: entries, bundle: true, platform: 'node', format: 'esm', outdir: out, outExtension: { '.js': '.mjs' }, logLevel: 'warning' });
  const files = readdirSync(out).filter((f) => f.endsWith('.mjs')).map((f) => join(out, f));
  const r = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
  process.exitCode = r.status ?? 1;
} finally {
  rmSync(out, { recursive: true, force: true });
}
