import { previewVars, effectiveToken } from '../lib/applyVars.js';
import MapMock from './MapMock.jsx';
import UiMock from './UiMock.jsx';

// Jeden náhledový panel (light NEBO dark). Tokeny skinu platí JEN uvnitř —
// inline CSS proměnné, žádný zásah do :root (panely stojí vedle sebe).
export default function PreviewPane({ skin, mode, defaults, t }) {
  const vars = previewVars(skin, mode, defaults);
  // pattern je globální ze sekce light (jako v aplikaci)
  const pattern = effectiveToken(skin, 'light', 'pattern', defaults).value;
  return (
    <section className="preview-pane" data-preview={mode} style={vars}>
      <div className="pane-label">{t(mode === 'dark' ? 'previewDark' : 'previewLight')}</div>
      <MapMock mode={mode} pattern={pattern} t={t} />
      <UiMock t={t} />
    </section>
  );
}
