// Build: copy src -> public, minify CSS/JS, and fingerprint /assets/* references (cache-busting).
import { build } from 'esbuild';
import { cp, mkdir, rm, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';

const SRC = 'src', OUT = 'public';
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(SRC, OUT, { recursive: true });

// Minify (overwrites the copied files in public/assets)
await build({ entryPoints: [`${SRC}/assets/style.css`, `${SRC}/assets/404.css`, `${SRC}/assets/app.js`], outdir: `${OUT}/assets`, minify: true, target: 'es2018', allowOverwrite: true, legalComments: 'none', logLevel: 'warning' });

// Fingerprint: append ?v=<content-hash> to every /assets/... reference in HTML
const hash = async (p) => createHash('sha256').update(await readFile(p)).digest('hex').slice(0, 10);
for (const f of (await readdir(OUT)).filter((n) => n.endsWith('.html'))) {
  let html = await readFile(`${OUT}/${f}`, 'utf8');
  const refs = [...new Set([...html.matchAll(/\/assets\/[A-Za-z0-9_./-]+/g)].map((m) => m[0]))];
  for (const ref of refs) {
    const file = `${OUT}${ref}`;
    if (!existsSync(file)) { console.warn(`  ! missing asset referenced in ${f}: ${ref}`); continue; }
    html = html.replaceAll(new RegExp(`${ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_./-])(\\?v=[a-f0-9]+)?`, 'g'), `${ref}?v=${await hash(file)}`);
  }
  await writeFile(`${OUT}/${f}`, html);
}
console.log('Build complete → public/');
