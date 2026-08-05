// Vestavěné skiny = JSONy z galerie skins/ (JEDINÁ kopie dat v repu).
// Načítá se přes validateSkin().clean — editor nikdy nepracuje s ničím,
// co neprošlo validátorem.
import { validateSkin } from '../../../validator/skin-validator.js';

const files = import.meta.glob('../../../skins/*.json', { eager: true });

export const BUILTINS = Object.entries(files)
  .map(([path, mod]) => {
    const id = path.split('/').pop().replace(/\.json$/, '');
    const r = validateSkin(mod.default ?? mod);
    if (!r.ok) throw new Error(`Vestavěný skin ${id} neprošel validátorem: ${r.errors.join(', ')}`);
    return { id, skin: r.clean };
  })
  .sort((a, b) => (a.id === 'indigo' ? -1 : b.id === 'indigo' ? 1 : a.skin.name.localeCompare(b.skin.name)));

// Indigo je 1:1 s výchozím vzhledem aplikace (index.css) → slouží jako
// fallback tokenů v náhledu: co skin nedefinuje, ukáže se z výchozího vzhledu,
// stejně jako v aplikaci.
export const DEFAULTS = BUILTINS.find((b) => b.id === 'indigo').skin;
