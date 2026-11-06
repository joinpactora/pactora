// Checks the static site: every module parses, and every local file the HTML, CSS and JS point at exists.
// node scripts/check.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'site');
const problems = [];

const files = fs.readdirSync(SITE, { recursive: true }).map(String).filter((f) => /\.(html|css|js)$/.test(f));
for (const f of files.filter((x) => x.endsWith('.js'))) {
  try { execFileSync(process.execPath, ['--check', path.join(SITE, f)], { stdio: 'pipe' }); }
  catch (e) { problems.push(`${f}: ${e.stderr.toString().trim()}`); }
}

const ref = /(?:src|href)="([^"#:?]+)"|url\(['"]?([^'")#:?]+)['"]?\)|['"`](art\/[^'"`$?]+|brand\/[^'"`$?]+)['"`]/g;
for (const f of files) {
  const text = fs.readFileSync(path.join(SITE, f), 'utf8');
  for (const m of text.matchAll(ref)) {
    const target = m[1] || m[2] || m[3];
    if (!target || target.includes('${') || target.startsWith('data') || target.startsWith('//')) continue;
    const abs = path.join(SITE, path.dirname(f), target);
    if (!fs.existsSync(abs)) problems.push(`${f}: missing ${target}`);
  }
}

// role photos are built from ids in main.js
const main = fs.readFileSync(path.join(SITE, 'main.js'), 'utf8');
for (const [, id] of main.matchAll(/\{ id: '([a-z]+)'/g)) {
  if (!fs.existsSync(path.join(SITE, 'art', 'roles', `${id}.webp`))) problems.push(`main.js: missing art/roles/${id}.webp`);
}

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`ok: ${files.length} files checked`);
