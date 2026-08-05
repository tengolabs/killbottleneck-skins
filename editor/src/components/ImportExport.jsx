import { useRef, useState } from 'react';
import { validateSkin } from '../../../validator/skin-validator.js';
import { errorMessage } from '../i18n.js';
import { downloadSkin } from '../lib/download.js';

const GALLERY_URL = 'https://github.com/tengosro/killbottleneck-skins';

// Import (soubor / vložený text) a export. VŠE prochází validátorem:
// import bere jen `clean`, export se před stažením znovu validuje.
export default function ImportExport({ skin, onImport, t }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null); // {ok, errors, warnings}
  const fileRef = useRef(null);

  const doImport = (raw) => {
    let obj;
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      setResult({ ok: false, errors: ['not-an-object'], warnings: [] });
      return;
    }
    const r = validateSkin(obj);
    setResult({ ok: r.ok, errors: r.errors, warnings: r.warnings });
    if (r.ok) {
      onImport(r.clean);
      setText('');
    }
  };

  const doExport = () => {
    const r = validateSkin(skin);
    if (!r.ok) {
      setResult({ ok: false, errors: r.errors, warnings: r.warnings, fromExport: true });
      return;
    }
    setResult(null);
    downloadSkin(r.clean.name, JSON.stringify(r.clean, null, 2) + '\n');
  };

  return (
    <fieldset data-import-export>
      <legend>{t('importHeading')} / {t('exportHeading')}</legend>
      <div className="row" style={{ marginBottom: 6 }}>
        <button type="button" className="btn secondary" onClick={() => fileRef.current?.click()}>
          {t('importPick')}
        </button>
        <input
          ref={fileRef} type="file" accept=".json,application/json" style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            f.text().then(doImport).catch(() => setResult({ ok: false, errors: ['not-an-object'], warnings: [] }));
            e.target.value = '';
          }}
        />
        <button type="button" className="btn" data-export onClick={doExport}>{t('exportButton')}</button>
      </div>
      <textarea
        rows={3} placeholder={t('importPaste')} value={text} data-import-text
        onChange={(e) => setText(e.target.value)}
      />
      {text.trim() && (
        <button type="button" className="btn secondary" style={{ marginTop: 6 }} data-import-apply
          onClick={() => doImport(text)}>
          {t('importApply')}
        </button>
      )}
      {result && !result.ok && (
        <div className="error-box" data-import-errors>
          {result.fromExport ? t('exportError') : null}
          <ul>{result.errors.map((c) => <li key={c}>{errorMessage(t, c)} <code>({c})</code></li>)}</ul>
        </div>
      )}
      {result?.ok && result.warnings.length > 0 && (
        <div className="warning-box" data-import-warnings>
          {t('importWarnings')}
          <ul>{result.warnings.map((c) => <li key={c}><code>{c}</code></li>)}</ul>
        </div>
      )}
      {result?.ok && result.warnings.length === 0 && (
        <div className="ok-box" data-import-ok>{t('importOk')}</div>
      )}
      <p className="contribute">
        <a href={GALLERY_URL} target="_blank" rel="noreferrer">{t('contribute')}</a>
      </p>
    </fieldset>
  );
}
