// E2E test editoru skinů — REÁLNĚ spustí build ve vite preview a proklikne ho
// puppeteerem (vzor: product/tests/ui-skins.js). Console errors se sbírají po
// celou dobu; jediná chyba = fail.
// Spuštění: npm run build && npm run test:e2e   (z editor/)
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { validateSkin } from '../../validator/skin-validator.js';

const editorDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 20621;
const URL_BASE = `http://127.0.0.1:${PORT}/`;
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome';

let pass = 0;
let fail = 0;
const expect = (cond, label, detail = '') => {
  if (cond) { pass++; console.log(`  ✅ ${label}`); }
  else { fail++; console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ''}`); }
};

// React kontrolované inputy: hodnotu nastavit nativním setterem + input event,
// jinak React změnu nevidí.
async function setReactValue(page, selector, value) {
  await page.$eval(selector, (el, v) => {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

const cssVar = (page, mode, name) =>
  page.$eval(`[data-preview="${mode}"]`, (el, n) => getComputedStyle(el).getPropertyValue(n).trim(), name);

// Přímo binárka vite (ne npx): kill pak zabíjí skutečný server, žádný osiřelý
// proces držící port — jinak by příští běh tiše testoval starý build.
// ⚠️ `--host 127.0.0.1` je nutné: bez něj vite poslouchá na `localhost`, které se
// na GitHub runnerech přeloží nejdřív na IPv6 (::1) — server tedy naskočí, ale
// kontrola na http://127.0.0.1 se ho nedovolá a test spadne na „preview nenaběhl".
// Lokálně to nikdo nepozná, protože tam localhost míří na IPv4. (CI 5. 8. 2026)
const preview = spawn(path.join(editorDir, 'node_modules/.bin/vite'),
  ['preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
  { cwd: editorDir, stdio: 'pipe' });
const previewOut = [];
preview.stdout.on('data', (d) => previewOut.push(d.toString()));
preview.stderr.on('data', (d) => previewOut.push(d.toString()));

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(URL_BASE);
      if (r.ok) return;
    } catch { /* ještě nenaběhl */ }
    await new Promise((res) => setTimeout(res, 250));
  }
  throw new Error(`vite preview nenaběhl na ${URL_BASE}\n${previewOut.join('')}`);
}

let browser;
try {
  await waitForServer();
  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  console.log('▶ načtení stránky');
  await page.goto(URL_BASE, { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-template-picker]');
  expect(await page.$('[data-preview="light"]') !== null, 'světlý náhledový panel existuje');
  expect(await page.$('[data-preview="dark"]') !== null, 'tmavý náhledový panel existuje');

  console.log('▶ šablona Paper (sepia) — přišpendlené hodnoty');
  await page.select('[data-template-picker]', 'sepia');
  expect(await cssVar(page, 'light', '--background') === '40 30% 96%', 'light --background = 40 30% 96%',
    await cssVar(page, 'light', '--background'));
  expect(await cssVar(page, 'dark', '--background') === '30 12% 11%', 'dark --background = 30 12% 11%',
    await cssVar(page, 'dark', '--background'));
  const nameVal = await page.$eval('[data-meta-name]', (el) => el.value);
  expect(nameVal === 'Paper', 'meta name = Paper', nameVal);

  console.log('▶ malůvka (sepia = lines) v obou panelech, různá průhlednost');
  const patLight = await page.$eval('[data-preview="light"] [data-map-mock] [data-skin-pattern]',
    (el) => ({ p: el.dataset.skinPattern, o: getComputedStyle(el).opacity }));
  const patDark = await page.$eval('[data-preview="dark"] [data-map-mock] [data-skin-pattern]',
    (el) => ({ p: el.dataset.skinPattern, o: getComputedStyle(el).opacity }));
  expect(patLight.p === 'lines' && patDark.p === 'lines', 'pattern lines v obou panelech', JSON.stringify([patLight, patDark]));
  expect(parseFloat(patDark.o) > parseFloat(patLight.o), `dark opacity (${patDark.o}) > light (${patLight.o})`);

  console.log('▶ pattern „None" → v maketě NIC (aplikace fallback nemá)');
  await page.click('.pattern-grid button:first-child');
  expect(await page.$('[data-preview="light"] [data-map-mock] [data-skin-pattern]') === null,
    'None: žádná malůvka ve světlé maketě');
  expect(await page.$('[data-preview="dark"] [data-map-mock] [data-skin-pattern]') === null,
    'None: žádná malůvka v tmavé maketě');
  await page.click('.pattern-grid button[title="lines"]');
  expect(await page.$('[data-preview="light"] [data-map-mock] [data-skin-pattern="lines"]') !== null,
    'lines: malůvka je zpět');

  console.log('▶ změna primary přes HSL text');
  await setReactValue(page, '.color-field[data-token="primary"] input[type="text"]', '0 100% 50%');
  const btnColor = await page.$eval('[data-preview="light"] [data-mock-primary]',
    (el) => getComputedStyle(el).backgroundColor);
  expect(btnColor === 'rgb(255, 0, 0)', 'tlačítko v náhledu zčervenalo', btnColor);
  const ringColor = await page.$eval('[data-preview="light"] .apex-node',
    (el) => getComputedStyle(el).backgroundImage);
  expect(ringColor.includes('conic-gradient'), 'prstenec vrcholu je conic-gradient', ringColor);

  console.log('▶ picker round-trip nemění HSL text');
  const before = await page.$eval('.color-field[data-token="primary"] input[type="text"]', (el) => el.value);
  await page.$eval('.color-field[data-token="primary"] input[type="color"]', (el) => {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const after = await page.$eval('.color-field[data-token="primary"] input[type="text"]', (el) => el.value);
  expect(before === after, 'HSL text beze změny po prázdném round-tripu', `${before} → ${after}`);

  console.log('▶ radius');
  await page.$eval('[data-radius] input[type="range"]', (el) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, '0');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  let nodeRadius = await page.$eval('[data-preview="light"] .goal-node', (el) => getComputedStyle(el).borderRadius);
  expect(nodeRadius === '0px', 'radius 0 → uzel 0px', nodeRadius);
  await page.$eval('[data-radius] input[type="range"]', (el) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, '1');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  nodeRadius = await page.$eval('[data-preview="light"] .goal-node', (el) => getComputedStyle(el).borderRadius);
  expect(nodeRadius === '16px', 'radius 1rem → uzel 16px', nodeRadius);

  console.log('▶ fonty');
  await setReactValue(page, '[data-font-token="font-heading"] input[type="text"]', 'Courier New');
  const headingFont = await page.$eval('[data-preview="light"] .goal-node .node-title',
    (el) => getComputedStyle(el).fontFamily);
  expect(headingFont.includes('Courier New'), 'font-heading se propsal do titulku uzlu', headingFont);
  await setReactValue(page, '[data-font-token="font-mono"] input[type="text"]', 'Bad"Quote');
  expect(await page.$('[data-font-token="font-mono"] .error-box') !== null, 'neplatná rodina ukáže chybu');
  await setReactValue(page, '[data-font-token="font-mono"] input[type="text"]', '');

  console.log('▶ import nevalidního skinu (hex barva + velký radius)');
  const bgBefore = await cssVar(page, 'light', '--background');
  const badSkin = JSON.stringify({
    format: 'kb-skin', version: 1, name: 'Bad',
    light: { primary: '#ff0000', radius: '99rem' },
  });
  await setReactValue(page, '[data-import-text]', badSkin);
  await page.click('[data-import-apply]');
  await page.waitForSelector('[data-import-errors]');
  const errText = await page.$eval('[data-import-errors]', (el) => el.textContent);
  expect(errText.includes('bad-color:light.primary'), 'hláška obsahuje bad-color:light.primary', errText);
  expect(errText.includes('bad-radius:light'), 'hláška obsahuje bad-radius:light', errText);
  expect(await cssVar(page, 'light', '--background') === bgBefore, 'stav editoru se nezměnil');

  console.log('▶ import validního skinu');
  const goodSkin = JSON.stringify({
    format: 'kb-skin', version: 1, name: 'E2E Test', author: 'Robot',
    light: { background: '200 50% 50%', pattern: 'stars' },
    dark: { background: '200 60% 10%' },
  });
  await setReactValue(page, '[data-import-text]', goodSkin);
  await page.click('[data-import-apply]');
  await page.waitForSelector('[data-import-ok]');
  expect(await cssVar(page, 'light', '--background') === '200 50% 50%', 'light --background z importu');
  expect(await cssVar(page, 'dark', '--background') === '200 60% 10%', 'dark --background z importu');
  expect(await page.$eval('[data-meta-name]', (el) => el.value) === 'E2E Test', 'meta name z importu');

  console.log('▶ dark sekce smí přebít radius (jako v aplikaci)');
  const darkRadiusSkin = JSON.stringify({
    format: 'kb-skin', version: 1, name: 'DarkR',
    light: { background: '0 0% 98%', radius: '0' },
    dark: { radius: '1rem' },
  });
  await setReactValue(page, '[data-import-text]', darkRadiusSkin);
  await page.click('[data-import-apply]');
  await page.waitForSelector('[data-import-ok]');
  const lightR = await page.$eval('[data-preview="light"] .goal-node', (el) => getComputedStyle(el).borderRadius);
  const darkR = await page.$eval('[data-preview="dark"] .goal-node', (el) => getComputedStyle(el).borderRadius);
  expect(lightR === '0px', 'light radius 0 → 0px', lightR);
  expect(darkR === '16px', 'dark override 1rem → 16px', darkR);

  console.log('▶ export + round-trip');
  await page.click('[data-export]');
  const exported = await page.evaluate(() => window.__kbLastExport);
  expect(typeof exported === 'string' && exported.length > 0, 'export vyprodukoval obsah');
  const exportedObj = JSON.parse(exported);
  const revalidated = validateSkin(exportedObj);
  expect(revalidated.ok, 'exportovaný skin projde validátorem (node)', revalidated.errors?.join(','));
  expect(Buffer.byteLength(exported) <= 8192, `export ≤ 8192 B (${Buffer.byteLength(exported)} B)`);
  await setReactValue(page, '[data-import-text]', exported);
  await page.click('[data-import-apply]');
  await page.click('[data-export]');
  const exported2 = await page.evaluate(() => window.__kbLastExport);
  expect(exported === exported2, 'round-trip import→export je identický');

  console.log('▶ přepínač jazyka přežije reload');
  await page.click('[data-lang-switch] button:first-child'); // CS
  let h1 = await page.$eval('h1', (el) => el.textContent);
  expect(h1.includes('editor skinů'), 'UI přepnuté do češtiny', h1);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('h1');
  h1 = await page.$eval('h1', (el) => el.textContent);
  expect(h1.includes('editor skinů'), 'čeština přežila reload', h1);

  console.log('▶ konzole');
  expect(consoleErrors.length === 0, 'žádné console/page errors', consoleErrors.slice(0, 3).join(' | '));
} catch (e) {
  fail++;
  console.error(`❌ test spadl: ${e.message}`);
} finally {
  if (browser) await browser.close();
  preview.kill('SIGTERM');
}

console.log(`\n${fail === 0 ? '🟢' : '🔴'} e2e: ${pass}/${pass + fail} kontrol prošlo`);
process.exit(fail ? 1 : 0);
