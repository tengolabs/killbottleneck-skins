// Konverze "H S% L%" ↔ #hex pro <input type="color">.
// HSL TEXT je zdroj pravdy (formát skinu) — hex je jen pomůcka pickeru;
// round-trip přes hex se do HSL textu propíše jen při reálné změně barvy.

export function parseHsl(text) {
  const m = /^(\d{1,3}(?:\.\d+)?)\s+(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%$/.exec((text || '').trim());
  if (!m) return null;
  const h = parseFloat(m[1]);
  const s = parseFloat(m[2]);
  const l = parseFloat(m[3]);
  if (h > 360 || s > 100 || l > 100) return null;
  return { h, s, l };
}

export function formatHsl({ h, s, l }) {
  const r = (n) => Math.round(n * 10) / 10;
  return `${r(h)} ${r(s)}% ${r(l)}%`;
}

export function hslToHex(text) {
  const v = parseHsl(text);
  if (!v) return '#000000';
  const { h, s, l } = v;
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexToHsl(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return formatHsl({ h, s: s * 100, l: l * 100 });
}
