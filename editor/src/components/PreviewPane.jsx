import { previewVars } from '../lib/applyVars.js';
import MapMock from './MapMock.jsx';
import UiMock from './UiMock.jsx';

// Jeden náhledový panel (light NEBO dark). Tokeny skinu platí JEN uvnitř —
// inline CSS proměnné, žádný zásah do :root (panely stojí vedle sebe).
export default function PreviewPane({ skin, mode, defaults, t }) {
  const vars = previewVars(skin, mode, defaults);
  // pattern VÝHRADNĚ ze skinu, BEZ fallbacku na výchozí vzhled — aplikace čte
  // jen getActiveSkin().light.pattern; skin bez patternu nekreslí nic.
  const pattern = skin.light?.pattern;
  return (
    <section className="preview-pane" data-preview={mode} style={vars}>
      <div className="pane-label">{t(mode === 'dark' ? 'previewDark' : 'previewLight')}</div>
      <MapMock mode={mode} pattern={pattern} t={t} />
      <UiMock t={t} />
    </section>
  );
}
