import { SKIN_PATTERNS } from '../../../validator/skin-validator.js';
import PatternArt from './PatternArt.jsx';

// Výběr malůvky — výčet jde z validátoru (jediná autorita), miniatury kreslí
// tatáž komponenta jako náhled.
export default function PatternPicker({ value, onChange, t }) {
  return (
    <fieldset data-pattern-picker>
      <legend>{t('groupPattern')}</legend>
      <div className="pattern-grid">
        <button type="button" className={!value ? 'active' : ''} onClick={() => onChange('pattern', undefined)}>
          <span className="none-label">{t('patternNone')}</span>
        </button>
        {SKIN_PATTERNS.map((p) => (
          <button key={p} type="button" title={p} className={value === p ? 'active' : ''}
            onClick={() => onChange('pattern', p)}>
            <PatternArt pattern={p} mode="light" />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
