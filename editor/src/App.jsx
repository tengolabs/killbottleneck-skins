import { useMemo, useState } from 'react';
import { SKIN_FONT_TOKENS } from '../../validator/skin-validator.js';
import { useLang } from './i18n.js';
import { BUILTINS, DEFAULTS } from './lib/builtins.js';
import { effectiveToken } from './lib/applyVars.js';
import TemplatePicker from './components/TemplatePicker.jsx';
import ColorSection from './components/ColorSection.jsx';
import FontField from './components/FontField.jsx';
import RadiusField from './components/RadiusField.jsx';
import PatternPicker from './components/PatternPicker.jsx';
import PreviewPane from './components/PreviewPane.jsx';
import ImportExport from './components/ImportExport.jsx';

// Fonty, radius a malůvka se editují jen v záložce Světlý; Tmavý = jen barvy.
// V aplikaci platí radius+fonty globálně z light, ale dark sekce je SMÍ přebít
// (skinToCss) — editor to v UI nenabízí (vzácný případ z importu), náhled ale
// dark override zobrazí správně (previewVars).
export default function App() {
  const { lang, setLang, t } = useLang();
  const [skin, setSkin] = useState(() => structuredClone(BUILTINS[0].skin)); // indigo
  const [tab, setTab] = useState('light');

  const updateToken = (mode) => (token, value) => {
    setSkin((prev) => {
      const next = structuredClone(prev);
      const section = { ...(next[mode] || {}) };
      if (value === undefined) delete section[token];
      else section[token] = value;
      next[mode] = section;
      return next;
    });
  };

  const updateMeta = (key) => (e) => {
    const v = e.target.value;
    setSkin((prev) => ({ ...prev, [key]: v }));
  };

  const copyLightToDark = () => {
    setSkin((prev) => {
      const next = structuredClone(prev);
      const colors = {};
      Object.entries(next.light || {}).forEach(([k, v]) => {
        if (typeof v === 'string' && !['radius', 'pattern'].includes(k)) colors[k] = v;
      });
      next.dark = { ...colors };
      return next;
    });
  };

  // Sestavený skin pro export: prázdná meta pole a prázdný dark se vynechají.
  const assembled = useMemo(() => {
    const out = { format: 'kb-skin', version: 1 };
    ['name', 'author', 'description', 'license'].forEach((k) => {
      if (typeof skin[k] === 'string' && skin[k].trim()) out[k] = skin[k].trim();
    });
    out.light = skin.light || {};
    if (skin.dark && Object.keys(skin.dark).length > 0) out.dark = skin.dark;
    return out;
  }, [skin]);

  return (
    <div className="layout">
      <div className="panel-edit">
        <div className="app-header">
          <h1>{t('title')}</h1>
          <div className="lang-switch" data-lang-switch>
            <button type="button" className={lang === 'cs' ? 'active' : ''} onClick={() => setLang('cs')}>CS</button>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
        <p className="subtitle">{t('subtitle')}</p>

        <TemplatePicker onPick={(s) => { setSkin(s); setTab('light'); }} t={t} />

        <fieldset data-meta>
          <legend>{t('metaHeading')}</legend>
          <div className="meta-grid">
            <div className="full">
              <label>{t('name')}</label>
              <input type="text" maxLength={60} value={skin.name ?? ''} onChange={updateMeta('name')} data-meta-name />
            </div>
            <div>
              <label>{t('author')}</label>
              <input type="text" maxLength={80} value={skin.author ?? ''} onChange={updateMeta('author')} />
            </div>
            <div>
              <label>{t('license')}</label>
              <input type="text" maxLength={40} value={skin.license ?? ''} onChange={updateMeta('license')} placeholder="CC0-1.0" />
            </div>
            <div className="full">
              <label>{t('description')}</label>
              <input type="text" maxLength={200} value={skin.description ?? ''} onChange={updateMeta('description')} />
            </div>
          </div>
        </fieldset>

        <div className="tabs" data-section-tabs>
          <button type="button" className={tab === 'light' ? 'active' : ''} onClick={() => setTab('light')} data-tab-light>
            {t('sectionLight')}
          </button>
          <button type="button" className={tab === 'dark' ? 'active' : ''} onClick={() => setTab('dark')} data-tab-dark>
            {t('sectionDark')}
          </button>
          <button type="button" className="copy" onClick={copyLightToDark}>{t('copyLightToDark')}</button>
        </div>

        <ColorSection skin={skin} mode={tab} defaults={DEFAULTS} onChangeToken={updateToken(tab)} t={t} />

        {tab === 'light' && (
          <>
            <fieldset data-fonts>
              <legend>{t('groupFonts')}</legend>
              {SKIN_FONT_TOKENS.map((token) => {
                const { value, own } = effectiveToken(skin, 'light', token, DEFAULTS);
                return (
                  <FontField key={token} token={token} value={value} own={own}
                    onChange={updateToken('light')} t={t} />
                );
              })}
            </fieldset>
            <RadiusField
              value={effectiveToken(skin, 'light', 'radius', DEFAULTS).value}
              own={effectiveToken(skin, 'light', 'radius', DEFAULTS).own}
              onChange={updateToken('light')} t={t}
            />
            <PatternPicker value={skin.light?.pattern} onChange={updateToken('light')} t={t} />
          </>
        )}

        <ImportExport skin={assembled} onImport={(clean) => { setSkin(clean); setTab('light'); }} t={t} />
      </div>

      <div className="panel-preview">
        <div className="previews">
          <PreviewPane skin={skin} mode="light" defaults={DEFAULTS} t={t} />
          <PreviewPane skin={skin} mode="dark" defaults={DEFAULTS} t={t} />
        </div>
      </div>
    </div>
  );
}
