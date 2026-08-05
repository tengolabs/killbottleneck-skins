// Zaoblení rohů: slider + jednotka. Limity validátoru (≤2rem / ≤32px)
// vynucuje přímo UI — mimo rozsah se nedá dostat.
export default function RadiusField({ value, own, onChange, t }) {
  const m = /^(\d+(?:\.\d+)?)(rem|px)$/.exec(value || '');
  const num = value === '0' ? 0 : m ? parseFloat(m[1]) : 0.5;
  const unit = m ? m[2] : 'rem';
  const max = unit === 'rem' ? 2 : 32;
  const step = unit === 'rem' ? 0.05 : 1;

  const commit = (n, u) => {
    const lim = u === 'rem' ? 2 : 32;
    const clamped = Math.max(0, Math.min(lim, n));
    onChange('radius', clamped === 0 ? '0' : `${clamped}${u}`);
  };

  return (
    <fieldset data-radius>
      <legend>{t('groupRadius')}</legend>
      <div className="row">
        <input
          type="range" min="0" max={max} step={step} value={num} style={{ flex: 1 }}
          onChange={(e) => commit(parseFloat(e.target.value), unit)}
        />
        <span style={{ minWidth: 58, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}
          className={own ? '' : 'inherited'} data-radius-value>
          {own ? (value === '0' ? '0' : value) : `(${t('radiusUnset')})`}
        </span>
        <select value={unit} style={{ width: 70 }}
          onChange={(e) => {
            const u = e.target.value;
            // převod hodnoty, ať zaoblení vizuálně nepoklesne (1rem = 16px)
            const converted = u === 'px' ? Math.round(num * 16) : Math.round((num / 16) * 100) / 100;
            commit(converted, u);
          }}>
          <option value="rem">rem</option>
          <option value="px">px</option>
        </select>
        {own && <button type="button" className="clear" title={t('reset')} onClick={() => onChange('radius', undefined)}>×</button>}
      </div>
    </fieldset>
  );
}
