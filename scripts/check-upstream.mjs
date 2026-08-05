// Anti-drift kontrola vůči produktu (flowmap-local). Spouští se LOKÁLNĚ tam,
// kde je checkout produktu; v CI se přeskočí (produkt je jiné privátní repo).
//
// Spuštění:  FLOWMAP_DIR=/cesta/k/flowmap-local node scripts/check-upstream.mjs
//            node scripts/check-upstream.mjs --update-lock   (zapíše nový upstream.lock)
//
// Kontroly:
//   a) validator/skin-validator.js musí být BYTE-IDENTICKÝ s produktovou ESM kopií
//      (jedna logika, žádná mutace — kontrola je prostý diff)          → chyba
//   b) light/dark sekce skins/*.json == BUILTIN_SKINS v produktu       → chyba
//   c) hash produktového SkinPattern.jsx vs upstream.lock — editor má ADAPTOVANOU
//      kopii (PatternArt.jsx), byte-diff nedává smysl; změna jen upozorní,
//      že je potřeba adaptaci přenést a lock aktualizovat               → varování
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const flowmapDir = process.env.FLOWMAP_DIR || '/home/holly/Claude_Holly/flowmap-local';
const updateLock = process.argv.includes('--update-lock');
const lockPath = path.join(root, 'upstream.lock');

const SRC = {
  validator: path.join(flowmapDir, 'product/frontend/src/lib/skinValidator.js'),
  skins: path.join(flowmapDir, 'product/frontend/src/lib/skins.js'),
  pattern: path.join(flowmapDir, 'product/frontend/src/components/shared/SkinPattern.jsx'),
};

if (!fs.existsSync(SRC.validator)) {
  console.log(`⏭️ produkt nenalezen (${flowmapDir}) — kontrola přeskočena (CI). Lokálně nastav FLOWMAP_DIR.`);
  process.exit(0);
}

const sha256 = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
let fail = 0;
let warn = 0;

// a) validátor byte-diff
const oursValidator = path.join(root, 'validator/skin-validator.js');
if (sha256(oursValidator) === sha256(SRC.validator)) {
  console.log('✅ validátor je byte-identický s produktem');
} else {
  console.log('❌ validator/skin-validator.js se liší od produktové ESM kopie — zkopíruj ji sem 1:1 (cp, ne úpravy)');
  fail++;
}

// b) skiny: light/dark sekce proti BUILTIN_SKINS
const { BUILTIN_SKINS } = await import(SRC.skins);
const skinsDir = path.join(root, 'skins');
const galleryIds = fs.readdirSync(skinsDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
for (const builtin of BUILTIN_SKINS) {
  const file = path.join(skinsDir, `${builtin.id}.json`);
  if (!fs.existsSync(file)) {
    console.log(`❌ vestavěný skin „${builtin.id}" nemá soubor v skins/`);
    fail++;
    continue;
  }
  const gallery = JSON.parse(fs.readFileSync(file, 'utf8'));
  const diffs = [];
  for (const section of ['light', 'dark']) {
    if (JSON.stringify(builtin[section] ?? null) !== JSON.stringify(gallery[section] ?? null)) diffs.push(section);
  }
  if (diffs.length) {
    console.log(`❌ ${builtin.id}.json: sekce ${diffs.join('+')} se liší od produktu`);
    fail++;
  } else {
    console.log(`✅ ${builtin.id}.json == produkt (light+dark)`);
  }
  if (builtin.name !== gallery.name) {
    console.log(`   ℹ️ název se liší: produkt „${builtin.name}" vs galerie „${gallery.name}" (jen informativně)`);
  }
}
for (const id of galleryIds) {
  if (!BUILTIN_SKINS.some((b) => b.id === id)) {
    console.log(`ℹ️ ${id}.json je jen v galerii (není vestavěný) — v pořádku, jen pro přehled`);
  }
}

// c) SkinPattern hash vs lock (jen varování)
const lock = fs.existsSync(lockPath) ? JSON.parse(fs.readFileSync(lockPath, 'utf8')) : null;
const patternHash = sha256(SRC.pattern);
if (updateLock) {
  let commit = 'unknown';
  try { commit = execFileSync('git', ['-C', flowmapDir, 'rev-parse', '--short', 'HEAD']).toString().trim(); } catch {}
  fs.writeFileSync(lockPath, JSON.stringify({
    comment: 'Otisky produktových zdrojů při posledním syncu — aktualizuje scripts/check-upstream.mjs --update-lock',
    flowmapCommit: commit,
    'product/frontend/src/lib/skinValidator.js': sha256(SRC.validator),
    'product/frontend/src/components/shared/SkinPattern.jsx': patternHash,
  }, null, 2) + '\n');
  console.log(`📝 upstream.lock zapsán (produkt @ ${commit})`);
} else if (!lock) {
  console.log('⚠️ upstream.lock neexistuje — spusť s --update-lock');
  warn++;
} else if (lock['product/frontend/src/components/shared/SkinPattern.jsx'] !== patternHash) {
  console.log('⚠️ SkinPattern.jsx se v produktu změnil — přenes změnu do editor/src/components/PatternArt.jsx a spusť --update-lock');
  warn++;
} else {
  console.log('✅ SkinPattern.jsx beze změny od posledního syncu');
}

console.log(`\n${fail ? '🔴' : warn ? '🟡' : '🟢'} check-upstream: ${fail} chyb, ${warn} varování`);
process.exit(fail ? 1 : 0);
