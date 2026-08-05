// Maketa běžných UI prvků — tlačítka, karta, input, sloupečky grafů, mono text.
// Jen tokeny, žádný produktový kód.
export default function UiMock({ t }) {
  return (
    <div className="ui-mock" data-ui-mock>
      <div className="row">
        <button type="button" className="ui-btn" data-mock-primary>{t('uiButton')}</button>
        <button type="button" className="ui-btn secondary">{t('uiSecondary')}</button>
        <input className="ui-input" readOnly value={t('uiInput')} />
      </div>
      <div className="row">
        <div className="ui-card" style={{ flex: 1 }}>
          <h4>{t('uiCardTitle')}</h4>
          <p>{t('uiCardText')}</p>
        </div>
        <div className="ui-chart" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ height: `${i * 8}px`, background: `hsl(var(--chart-${i}))` }} />
          ))}
        </div>
      </div>
      <div className="ui-mono">$ kb-skin --preview</div>
    </div>
  );
}
