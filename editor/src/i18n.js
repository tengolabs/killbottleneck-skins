// Mini i18n bez knihovny: ~50 klíčů, EN default (produkt je EN-first),
// volba v localStorage 'kb-skin-editor-lang'.
import { useState, useCallback } from 'react';

const DICT = {
  en: {
    title: 'killBottleneck Skin Editor',
    subtitle: 'Everything runs in your browser — nothing is uploaded anywhere.',
    template: 'Start from template',
    metaHeading: 'Skin info',
    name: 'Name',
    author: 'Author',
    description: 'Description',
    license: 'License',
    sectionLight: 'Light',
    sectionDark: 'Dark',
    copyLightToDark: 'Copy light → dark',
    groupBase: 'Base',
    groupSurfaces: 'Cards & popovers',
    groupBrand: 'Brand & state colors',
    groupCharts: 'Charts',
    groupSidebar: 'Sidebar',
    groupCanvas: 'Map canvas',
    groupFonts: 'Fonts',
    groupRadius: 'Corner radius',
    groupPattern: 'Pattern',
    patternNone: 'None',
    fontFamilies: 'families (comma separated)',
    fontGeneric: 'generic',
    fontInvalid: 'Invalid family name — letters, digits, spaces and dashes only (max 41 chars, 8 families).',
    radiusUnset: 'default',
    reset: 'reset',
    previewLight: 'Light preview',
    previewDark: 'Dark preview',
    mapGoal: 'Launch the product',
    mapNode1: 'Website ready',
    mapNode2: 'First customers',
    mapNode3: 'Pricing decided',
    mapNodeDesc: 'Next step of the plan',
    uiButton: 'Primary action',
    uiSecondary: 'Secondary',
    uiCardTitle: 'Card title',
    uiCardText: 'Body text with a muted note.',
    uiInput: 'Input field',
    uiBadge: 'blocking',
    importHeading: 'Import',
    importPick: 'Choose file…',
    importPaste: 'or paste .kb-skin.json here',
    importApply: 'Import',
    importOk: 'Skin imported.',
    importWarnings: 'Warnings (unknown tokens were dropped):',
    exportHeading: 'Export',
    exportButton: 'Download .kb-skin.json',
    exportError: 'Export blocked — fix these first:',
    contribute: 'Share your skin: open a pull request in the gallery',
    err: {
      'not-an-object': 'Not a JSON object.',
      'too-big': 'Skin is too big (max 8192 B).',
      'bad-format': 'Missing or wrong "format" (must be "kb-skin").',
      'unsupported-version': 'Unsupported "version" (must be 1).',
      'bad-name': 'Missing or invalid "name" (max 60 chars).',
      'bad-author': 'Invalid "author" (max 80 chars).',
      'bad-description': 'Invalid "description" (max 200 chars).',
      'bad-license': 'Invalid "license" (max 40 chars).',
      'missing-light': 'Section "light" is required with at least one token.',
      'bad-section': 'Section is not an object',
      'bad-color': 'Invalid color (bare HSL triple "H S% L%" required)',
      'bad-font': 'Invalid font list (array of families, last one generic)',
      'bad-radius': 'Invalid radius (0, up to 2rem or 32px)',
      'bad-pattern': 'Unknown pattern name',
    },
  },
  cs: {
    title: 'killBottleneck — editor skinů',
    subtitle: 'Všechno běží v prohlížeči — nic se nikam neodesílá.',
    template: 'Začít ze šablony',
    metaHeading: 'Údaje o skinu',
    name: 'Název',
    author: 'Autor',
    description: 'Popis',
    license: 'Licence',
    sectionLight: 'Světlý',
    sectionDark: 'Tmavý',
    copyLightToDark: 'Zkopírovat světlý → tmavý',
    groupBase: 'Základ',
    groupSurfaces: 'Karty a vyskakovací okna',
    groupBrand: 'Značkové a stavové barvy',
    groupCharts: 'Grafy',
    groupSidebar: 'Boční lišta',
    groupCanvas: 'Plátno mapy',
    groupFonts: 'Písma',
    groupRadius: 'Zaoblení rohů',
    groupPattern: 'Malůvka',
    patternNone: 'Žádná',
    fontFamilies: 'rodiny (oddělené čárkou)',
    fontGeneric: 'generika',
    fontInvalid: 'Neplatný název rodiny — jen písmena, číslice, mezery a pomlčky (max 41 znaků, 8 rodin).',
    radiusUnset: 'výchozí',
    reset: 'vrátit',
    previewLight: 'Světlý náhled',
    previewDark: 'Tmavý náhled',
    mapGoal: 'Vydat produkt',
    mapNode1: 'Web hotový',
    mapNode2: 'První zákazníci',
    mapNode3: 'Ceník rozhodnut',
    mapNodeDesc: 'Další krok plánu',
    uiButton: 'Hlavní akce',
    uiSecondary: 'Vedlejší',
    uiCardTitle: 'Titulek karty',
    uiCardText: 'Běžný text s tlumenou poznámkou.',
    uiInput: 'Vstupní pole',
    uiBadge: 'blokuje',
    importHeading: 'Import',
    importPick: 'Vybrat soubor…',
    importPaste: 'nebo sem vlož .kb-skin.json',
    importApply: 'Importovat',
    importOk: 'Skin naimportován.',
    importWarnings: 'Varování (neznámé tokeny byly zahozeny):',
    exportHeading: 'Export',
    exportButton: 'Stáhnout .kb-skin.json',
    exportError: 'Export zablokován — nejdřív oprav:',
    contribute: 'Sdílej svůj skin: pošli pull request do galerie',
    err: {
      'not-an-object': 'Není to JSON objekt.',
      'too-big': 'Skin je moc velký (max 8192 B).',
      'bad-format': 'Chybí nebo je špatně „format" (musí být „kb-skin").',
      'unsupported-version': 'Nepodporovaná „version" (musí být 1).',
      'bad-name': 'Chybí nebo je neplatný „name" (max 60 znaků).',
      'bad-author': 'Neplatný „author" (max 80 znaků).',
      'bad-description': 'Neplatný „description" (max 200 znaků).',
      'bad-license': 'Neplatná „license" (max 40 znaků).',
      'missing-light': 'Sekce „light" je povinná, aspoň jeden token.',
      'bad-section': 'Sekce není objekt',
      'bad-color': 'Neplatná barva (nutná holá HSL trojice „H S% L%")',
      'bad-font': 'Neplatný seznam písem (pole rodin, poslední generika)',
      'bad-radius': 'Neplatný radius (0, max 2rem nebo 32px)',
      'bad-pattern': 'Neznámé jméno malůvky',
    },
  },
};

const LANG_KEY = 'kb-skin-editor-lang';

export function useLang() {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === 'cs' || stored === 'en') return stored;
    } catch { /* private mode */ }
    return 'en';
  });
  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* private mode */ }
  }, []);
  const t = useCallback((key) => DICT[lang][key] ?? DICT.en[key] ?? key, [lang]);
  return { lang, setLang, t };
}

// Kód chyby validátoru ("bad-color:light.primary") → lidská hláška + cesta.
export function errorMessage(t, code) {
  const [kind, path] = code.split(':');
  const base = t('err')[kind] ?? code;
  return path ? `${base} — ${path}` : base;
}
