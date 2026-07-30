// Zvaliduje všechny skins/*.json proti formátu kb-skin v1 + hlídá unikátní názvy.
// Spuštění: node scripts/validate-all.mjs   (exit 0 = vše OK)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { validateSkin } = require('../validator/skin-validator.cjs');

const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '../skins');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
let fail = 0;
const names = new Set();

for (const f of files) {
  let obj;
  try {
    obj = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  } catch (e) {
    console.log(`❌ ${f}: není validní JSON (${e.message})`);
    fail++;
    continue;
  }
  const r = validateSkin(obj);
  if (!r.ok) {
    console.log(`❌ ${f}: ${r.errors.join(', ')}`);
    fail++;
    continue;
  }
  if (names.has(obj.name)) {
    console.log(`❌ ${f}: duplicitní název „${obj.name}"`);
    fail++;
    continue;
  }
  names.add(obj.name);
  const warn = r.warnings.length ? `  ⚠️ ${r.warnings.join(', ')}` : '';
  console.log(`✅ ${f} (${obj.name})${warn}`);
}

console.log(`\n${fail === 0 ? '🟢' : '🔴'} ${files.length - fail}/${files.length} skinů validních`);
process.exit(fail ? 1 : 0);
