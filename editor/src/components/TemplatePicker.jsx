import { BUILTINS } from '../lib/builtins.js';

// Start z vestavěného skinu — nahradí celý rozpracovaný stav (šablona, ne merge).
export default function TemplatePicker({ onPick, t }) {
  return (
    <div className="row" style={{ marginBottom: 12 }}>
      <label style={{ margin: 0, whiteSpace: 'nowrap' }}>{t('template')}</label>
      <select
        data-template-picker
        defaultValue=""
        onChange={(e) => {
          const found = BUILTINS.find((b) => b.id === e.target.value);
          if (found) onPick(structuredClone(found.skin));
          e.target.value = '';
        }}
      >
        <option value="" disabled>—</option>
        {BUILTINS.map((b) => <option key={b.id} value={b.id}>{b.skin.name}</option>)}
      </select>
    </div>
  );
}
