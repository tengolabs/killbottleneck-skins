import PatternArt from './PatternArt.jsx';

// STYLIZOVANÁ maketa mapy — kreslená od nuly, jen z CSS tokenů skinu.
// Vědomé rozhodnutí (5. 8. 2026): ŽÁDNÝ produktový kód uzlů (GoalNode/
// ApexGoalNode zůstávají pod SUL v aplikaci) — editor je MIT a mapy v něm
// nejsou. Tvary jen naznačují: kruhový vrchol s prstencem pokroku a malůvkou,
// obdélníkové uzly, hrany, tečkované plátno.
export default function MapMock({ mode, pattern, t }) {
  return (
    <div className="map-mock" data-map-mock>
      <PatternArt pattern={pattern} mode={mode} />
      <svg className="map-edges" aria-hidden>
        <path d="M 150 100 C 150 160, 90 170, 90 200" />
        <path d="M 150 100 C 150 160, 230 170, 230 195" />
        <path d="M 230 235 C 230 265, 300 260, 310 275" />
      </svg>
      <div className="apex-node" style={{ left: 86, top: 8 }}>
        <div className="apex-inner">
          <PatternArt pattern={pattern} mode={mode} />
          <span className="apex-title">{t('mapGoal')}</span>
        </div>
      </div>
      <div className="goal-node" style={{ left: 16, top: 200 }} data-mock-node>
        <div className="node-title"><span className="dot" style={{ background: 'hsl(var(--chart-1))' }} />{t('mapNode1')}</div>
        <div className="node-desc">{t('mapNodeDesc')}</div>
      </div>
      <div className="goal-node selected" style={{ left: 185, top: 195 }}>
        <div className="node-title"><span className="dot" style={{ background: 'hsl(var(--chart-2))' }} />{t('mapNode2')}</div>
        <div className="node-desc">{t('mapNodeDesc')}</div>
        <span className="badge">! {t('uiBadge')}</span>
      </div>
      <div className="goal-node" style={{ left: 300, top: 272 }}>
        <div className="node-title"><span className="dot" style={{ background: 'hsl(var(--canvas-node))' }} />{t('mapNode3')}</div>
      </div>
    </div>
  );
}
