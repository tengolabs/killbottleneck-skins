// Skin → inline CSS proměnné pro náhledový panel. Aplikace používá skinToCss()
// cílený na :root — editor potřebuje light a dark VEDLE SEBE, proto per-panel
// inline vars. Stejný princip jako theme.js: iteruje se WHITELIST, ne vstup,
// fonty skládá výhradně fontStack().
import { SKIN_COLOR_TOKENS, SKIN_FONT_TOKENS, fontStack } from '../../../validator/skin-validator.js';

function colorVars(section) {
  const out = {};
  if (!section) return out;
  SKIN_COLOR_TOKENS.forEach((k) => {
    if (section[k]) out[`--${k}`] = section[k];
  });
  return out;
}

// Zrcadlí chování aplikace: barvy per režim (co dark nedefinuje, zůstává
// z výchozího dark vzhledu), radius + fonty jsou GLOBÁLNÍ ze sekce light.
export function previewVars(skin, mode, defaults) {
  const defSection = mode === 'dark' ? (defaults.dark || defaults.light) : defaults.light;
  const skinSection = mode === 'dark' ? skin.dark : skin.light;
  const out = { ...colorVars(defSection), ...colorVars(skinSection) };

  const globalSrc = { ...(defaults.light || {}), ...(skin.light || {}) };
  SKIN_FONT_TOKENS.forEach((k) => {
    if (Array.isArray(globalSrc[k])) out[`--${k}`] = fontStack(globalSrc[k]);
  });
  if (globalSrc.radius) out['--radius'] = globalSrc.radius;
  return out;
}

// Efektivní hodnota tokenu pro UI (skin → fallback výchozí vzhled).
export function effectiveToken(skin, mode, token, defaults) {
  const skinSection = (mode === 'dark' ? skin.dark : skin.light) || {};
  if (skinSection[token] !== undefined) return { value: skinSection[token], own: true };
  const defSection = (mode === 'dark' ? (defaults.dark || defaults.light) : defaults.light) || {};
  return { value: defSection[token], own: false };
}
