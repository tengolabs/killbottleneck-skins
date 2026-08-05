// Malůvky skinů — MIT adaptace produktového souboru
// product/frontend/src/components/shared/SkinPattern.jsx (flowmap-local @ d6452ac;
// drift hlídá scripts/check-upstream.mjs přes upstream.lock). Uvolnění pod MIT
// schválil držitel práv 5. 8. 2026. Změny proti originálu: žádný getActiveSkin
// (pattern + mode jdou propem — editor kreslí světlý a tmavý panel vedle sebe),
// Tailwind opacity třídy → data { light, dark } v ART, sizing třídy → styles.css.
// SVG kresby jsou 1:1 s produktem, ať náhled odpovídá aplikaci.

const Wave = () => (
  <svg viewBox="0 0 1440 420" preserveAspectRatio="none" className="w-full h-72 block">
    <path d="M0,90 C240,20 480,160 720,90 C960,20 1200,160 1440,90 L1440,420 L0,420 Z" fill="currentColor" opacity="0.3" />
    <path d="M0,210 C240,140 480,280 720,210 C960,140 1200,280 1440,210 L1440,420 L0,420 Z" fill="currentColor" opacity="0.5" />
    <path d="M0,330 C240,270 480,390 720,330 C960,270 1200,390 1440,330 L1440,420 L0,420 Z" fill="currentColor" />
  </svg>
);

const Leaves = () => (
  <svg viewBox="0 0 420 320" className="w-72 h-56 ml-auto block">
    <g stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round">
      <path d="M400,320 C340,220 300,150 200,80" />
      <path d="M330,230 C300,200 280,190 240,180" />
      <path d="M360,270 C390,240 400,220 405,190" />
      <path d="M260,130 C230,110 210,105 180,105" />
      <path d="M290,165 C310,140 315,120 312,95" />
    </g>
    <g fill="currentColor">
      <path d="M240,180 C215,160 190,162 172,180 C190,198 220,198 240,180 Z" />
      <path d="M405,190 C412,160 400,135 378,122 C365,148 378,175 405,190 Z" />
      <path d="M180,105 C155,88 130,90 112,105 C130,124 160,122 180,105 Z" />
      <path d="M312,95 C318,68 308,44 288,30 C275,55 288,82 312,95 Z" />
      <path d="M200,80 C185,55 162,45 138,48 C145,75 170,88 200,80 Z" />
    </g>
  </svg>
);

// Indigo: terče — mapa cílů, zásah do černého
const Rings = () => (
  <svg viewBox="0 0 420 300" className="w-80 h-56 ml-auto block">
    <g fill="none" stroke="currentColor" strokeWidth="5">
      <circle cx="330" cy="215" r="88" />
      <circle cx="330" cy="215" r="58" />
      <circle cx="330" cy="215" r="28" />
      <circle cx="120" cy="255" r="48" opacity="0.6" />
      <circle cx="120" cy="255" r="24" opacity="0.6" />
      <circle cx="215" cy="110" r="34" opacity="0.4" />
      <circle cx="215" cy="110" r="13" opacity="0.4" />
    </g>
    <circle cx="330" cy="215" r="9" fill="currentColor" />
  </svg>
);

// Vysoký kontrast: ostré diagonální pruhy (radius 0 duch skinu)
const Stripes = () => (
  <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className="w-full h-40 block">
    <g stroke="currentColor" strokeWidth="26">
      <path d="M-100,300 L300,-40" />
      <path d="M60,300 L460,-40" opacity="0.55" />
      <path d="M220,300 L620,-40" opacity="0.3" />
      <path d="M1140,300 L1540,-40" />
      <path d="M980,300 L1380,-40" opacity="0.55" />
    </g>
  </svg>
);

// Terminál: prompt >_
const Prompt = () => (
  <svg viewBox="0 0 420 300" className="w-72 h-52 ml-auto block">
    <g fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
      <path d="M45,80 L95,120 L45,160" />
      <path d="M160,180 L210,220 L160,260" opacity="0.6" />
      <path d="M265,55 L315,95 L265,135" opacity="0.35" />
    </g>
    <rect x="115" y="150" width="62" height="13" fill="currentColor" />
    <rect x="230" y="250" width="62" height="13" fill="currentColor" opacity="0.6" />
    <rect x="335" y="125" width="62" height="13" fill="currentColor" opacity="0.35" />
  </svg>
);

// Papír: linky sešitu s okrajovou čarou
const Lines = () => (
  <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className="w-full h-40 block" stroke="currentColor">
    <line x1="0" y1="45" x2="1440" y2="45" strokeWidth="3" opacity="0.5" />
    <line x1="0" y1="98" x2="1440" y2="98" strokeWidth="3" opacity="0.65" />
    <line x1="0" y1="151" x2="1440" y2="151" strokeWidth="3" opacity="0.8" />
    <line x1="0" y1="204" x2="1440" y2="204" strokeWidth="3" />
    <line x1="110" y1="0" x2="110" y2="260" strokeWidth="5" opacity="0.7" />
  </svg>
);

// Půlnoc: měsíc a hvězdy
const Stars = () => (
  <svg viewBox="0 0 420 300" className="w-80 h-56 ml-auto block" fill="currentColor">
    <path d="M310,45 a82,82 0 1 0 80,124 a64,64 0 1 1 -80,-124 Z" />
    <path d="M120,90 l4,14 14,4 -14,4 -4,14 -4,-14 -14,-4 14,-4 Z" />
    <path d="M200,190 l3,11 11,3 -11,3 -3,11 -3,-11 -11,-3 11,-3 Z" opacity="0.7" />
    <path d="M70,220 l3,11 11,3 -11,3 -3,11 -3,-11 -11,-3 11,-3 Z" opacity="0.5" />
    <path d="M180,40 l2,8 8,2 -8,2 -2,8 -2,-8 -8,-2 8,-2 Z" opacity="0.5" />
  </svg>
);

// Švestka: květy
const Flower = () => (
  <>
    <ellipse cx="0" cy="-27" rx="13" ry="22" />
    <ellipse cx="0" cy="-27" rx="13" ry="22" transform="rotate(72)" />
    <ellipse cx="0" cy="-27" rx="13" ry="22" transform="rotate(144)" />
    <ellipse cx="0" cy="-27" rx="13" ry="22" transform="rotate(216)" />
    <ellipse cx="0" cy="-27" rx="13" ry="22" transform="rotate(288)" />
    <circle cx="0" cy="0" r="9" opacity="0.5" />
  </>
);
const Petals = () => (
  <svg viewBox="0 0 420 300" className="w-72 h-52 ml-auto block" fill="currentColor">
    <g transform="translate(320,205)"><Flower /></g>
    <g transform="translate(160,250) scale(0.7)" opacity="0.6"><Flower /></g>
    <g transform="translate(230,85) scale(0.5)" opacity="0.4"><Flower /></g>
  </svg>
);

// Broskev: východ slunce
const Arcs = () => (
  <svg viewBox="0 0 420 300" className="w-80 h-56 mr-auto block">
    <g fill="none" stroke="currentColor" strokeWidth="14">
      <path d="M-20,300 A190,190 0 0 1 360,300" opacity="0.3" />
      <path d="M35,300 A135,135 0 0 1 305,300" opacity="0.55" />
      <path d="M85,300 A85,85 0 0 1 255,300" opacity="0.8" />
    </g>
    <circle cx="170" cy="300" r="38" fill="currentColor" />
  </svg>
);

// Grafit: technický rastr
const Grid = () => (
  <svg viewBox="0 0 420 300" className="w-80 h-56 ml-auto block" stroke="currentColor">
    <g strokeWidth="2">
      <line x1="60" y1="0" x2="60" y2="300" /><line x1="150" y1="0" x2="150" y2="300" />
      <line x1="240" y1="0" x2="240" y2="300" /><line x1="330" y1="0" x2="330" y2="300" />
      <line x1="0" y1="75" x2="420" y2="75" /><line x1="0" y1="150" x2="420" y2="150" />
      <line x1="0" y1="225" x2="420" y2="225" />
    </g>
    <g fill="currentColor" stroke="none">
      <rect x="150" y="150" width="90" height="75" opacity="0.35" />
      <rect x="330" y="75" width="90" height="75" opacity="0.2" />
      <rect x="60" y="225" width="90" height="75" opacity="0.25" />
    </g>
  </svg>
);

// Rubín: zaměřovač dalekohledu (reticle)
const Scope = () => (
  <svg viewBox="0 0 420 300" className="w-80 h-56 ml-auto block">
    <g fill="none" stroke="currentColor" strokeWidth="5">
      <circle cx="290" cy="160" r="105" />
      <circle cx="290" cy="160" r="52" opacity="0.6" />
      <line x1="290" y1="20" x2="290" y2="80" />
      <line x1="290" y1="240" x2="290" y2="300" />
      <line x1="150" y1="160" x2="210" y2="160" />
      <line x1="370" y1="160" x2="430" y2="160" />
      <line x1="290" y1="108" x2="290" y2="132" opacity="0.6" />
      <line x1="238" y1="160" x2="262" y2="160" opacity="0.6" />
      <line x1="318" y1="160" x2="342" y2="160" opacity="0.6" />
      <line x1="290" y1="188" x2="290" y2="212" opacity="0.6" />
    </g>
    <circle cx="290" cy="160" r="6" fill="currentColor" />
  </svg>
);

// Průhlednost per malůvka { light, dark } — v tmavém je potřeba víc, primary
// na tmavém pozadí zaniká. Kontrast (stripes) a Grafit (grid) drží nízko —
// jsou to skiny na čitelnost, dekorace nesmí překážet. Hodnoty 1:1 s produktem.
export const PATTERN_ART = {
  wave: { Art: Wave, opacity: { light: 0.10, dark: 0.20 } },
  leaves: { Art: Leaves, opacity: { light: 0.08, dark: 0.14 } },
  rings: { Art: Rings, opacity: { light: 0.07, dark: 0.12 } },
  stripes: { Art: Stripes, opacity: { light: 0.05, dark: 0.09 } },
  prompt: { Art: Prompt, opacity: { light: 0.10, dark: 0.16 } },
  lines: { Art: Lines, opacity: { light: 0.10, dark: 0.15 } },
  stars: { Art: Stars, opacity: { light: 0.10, dark: 0.18 } },
  petals: { Art: Petals, opacity: { light: 0.08, dark: 0.14 } },
  arcs: { Art: Arcs, opacity: { light: 0.10, dark: 0.16 } },
  grid: { Art: Grid, opacity: { light: 0.06, dark: 0.10 } },
  scope: { Art: Scope, opacity: { light: 0.12, dark: 0.20 } },
};

export default function PatternArt({ pattern, mode = 'light', className = '', style }) {
  const entry = PATTERN_ART[pattern];
  if (!entry) return null;
  const { Art, opacity } = entry;
  return (
    <div
      aria-hidden
      data-skin-pattern={pattern}
      className={`pattern-art ${className}`}
      style={{ color: 'hsl(var(--primary))', opacity: opacity[mode], ...style }}
    >
      <Art />
    </div>
  );
}
