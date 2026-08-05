import { useEffect, useState } from 'react';
import { parseHsl, hslToHex, hexToHsl } from '../lib/hsl.js';

// Jeden barevný token: picker (hex pomůcka) + HSL text (zdroj pravdy).
// `own=false` = hodnota zděděná z výchozího vzhledu (šedě); psaním/pickerem
// se token stane vlastním, křížkem se vrátí na výchozí.
export default function ColorField({ token, value, own, onChange, resetTitle }) {
  const [draft, setDraft] = useState(value ?? '');
  useEffect(() => { setDraft(value ?? ''); }, [value]);

  const commitText = (text) => {
    setDraft(text);
    if (parseHsl(text)) onChange(token, text.trim());
  };

  return (
    <div className="color-field" data-token={token}>
      <input
        type="color"
        value={hslToHex(draft)}
        onChange={(e) => {
          const hsl = hexToHsl(e.target.value);
          if (hsl) commitText(hsl);
        }}
      />
      <span className="name" title={token}>{token}</span>
      <input
        type="text"
        className={own ? '' : 'inherited'}
        value={draft}
        spellCheck={false}
        onChange={(e) => commitText(e.target.value)}
        onBlur={() => setDraft(value ?? '')}
      />
      {own
        ? <button type="button" className="clear" title={resetTitle} onClick={() => onChange(token, undefined)}>×</button>
        : <span />}
    </div>
  );
}
