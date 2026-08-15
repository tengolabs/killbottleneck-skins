# killBottleneck skins

A community gallery of visual skins for [killBottleneck](https://killbottleneck.com),
plus an open source **skin editor**. Skins are **free data under CC0** — take them,
change them, share them, no questions asked.

**🎨 Try the editor in your browser: <https://tengolabs.github.io/killbottleneck-skins/>**

## Using a skin

1. Download `skins/<name>.json`.
2. In the app: avatar menu → **Appearance** → **Import skin** → pick the file
   (or paste its content as text).
3. The skin is stored with your account and applies on every device, in light
   and dark mode and in the simplified (lite) view.

## Making your own

The easiest start: in the Appearance dialog hit **Export** on a skin you like and
tweak the values — or use the [skin editor](https://tengolabs.github.io/killbottleneck-skins/),
which edits every token with a live light + dark preview side by side.
The `kb-skin` v1 format:

```json
{
  "format": "kb-skin",
  "version": 1,
  "name": "My skin",
  "author": "Name",
  "license": "CC0-1.0",
  "description": "A short description.",
  "light": {
    "background": "210 40% 98%",
    "primary": "239 84% 67%",
    "radius": "0.5rem",
    "font-heading": ["Georgia", "serif"]
  },
  "dark": { "background": "222 16% 12%" }
}
```

Rules (enforced by the validator in the app and by CI here):

- **Colours** are bare HSL triples `"H S% L%"` (no hex, no `hsl()`, no alpha).
  The allowed tokens mirror the app's CSS variables — the complete list lives
  in `validator/skin-validator.js` (`SKIN_COLOR_TOKENS`).
- **Fonts** are arrays of family names; the last one must be a generic
  (`sans-serif` / `serif` / `monospace` / `system-ui`). Web fonts are **never
  downloaded** — use the fonts bundled with the app (Inter, Plus Jakarta Sans)
  or system ones; an unknown font harmlessly falls through to the next in line.
- **`radius`** is `0`–`2rem` or `0`–`32px`.
- The `light` section is required, `dark` is optional — whatever a skin does not
  define stays at the default look, token by token.
- The whole JSON is at most **8 192 B**; `name` ≤ 60 characters.
- A skin is **data only** — no CSS, no URLs, nothing executable. That is what
  makes it safe to share.

Validate locally:

```bash
node scripts/validate-all.mjs
```

## Submitting a skin to the gallery

Open a pull request with a single file `skins/<kebab-case-name>.json`. CI
validates it automatically. By submitting a skin you agree to release it under
**CC0-1.0** (credit stays in the `author` field). Pull requests from outside the
organisation may only touch `skins/*.json` — CI enforces that.

## The skin editor

The [`editor/`](editor/) folder holds a standalone open source (MIT) web app:
every token editable with a live preview (light and dark side by side),
import/export of `.kb-skin.json`, and any built-in template as a starting point.
It runs entirely in your browser and sends no data anywhere.
Live at <https://tengolabs.github.io/killbottleneck-skins/>; development and
build notes in [`editor/README.md`](editor/README.md).

## Licences

| What | Licence |
|---|---|
| `skins/*.json` (skin data) | [CC0 1.0](LICENSE) — public domain, just take it |
| `validator/`, `scripts/` | [CC0 1.0](LICENSE) |
| `editor/` (web app incl. the doodles) | [MIT](editor/LICENSE) |

The editor is deliberately **only about skins** — it renders a stylised mock-up,
not real maps. killBottleneck's product code (map components, nodes) is not in
this repository and never will be; it is licensed separately (Sustainable Use
License) in the app repository.

---

## Česky

Komunitní galerie grafických skinů pro [killBottleneck](https://killbottleneck.cz)
+ open source **editor skinů**. Skiny jsou **volná data pod CC0** — vezmi, uprav,
sdílej, bez ptaní.

**🎨 Editor běží v prohlížeči: <https://tengolabs.github.io/killbottleneck-skins/>**

### Jak skin použít

1. Stáhni si `skins/<název>.json`.
2. V aplikaci: menu pod avatarem → **Vzhled** → **Importovat skin** → vyber soubor
   (nebo obsah vlož jako text).
3. Skin se uloží k tvému účtu a platí na všech zařízeních, ve světlém i tmavém
   režimu i v lite zobrazení.

### Jak vytvořit vlastní

Nejjednodušší start: v dialogu Vzhled dej **Exportovat** u skinu, který se ti
líbí, a uprav hodnoty — nebo použij [editor skinů](https://tengolabs.github.io/killbottleneck-skins/)
s živým světlým i tmavým náhledem vedle sebe. Pravidla formátu `kb-skin` v1 jsou
popsaná výše v anglické části (vynucuje je validátor v aplikaci i CI tady);
ověření lokálně: `node scripts/validate-all.mjs`.

### Jak skin poslat do galerie

Pull request s jedním souborem `skins/<kebab-case-nazev>.json`. CI ho zvaliduje
automaticky. Posíláš-li skin, souhlasíš s vydáním pod **CC0-1.0** (kredit
zůstává v poli `author`). PR zvenku smí měnit jen `skins/*.json` — hlídá CI.

### Licence

Skiny + validátor = CC0, editor = MIT, produkt killBottleneck je licencován
zvlášť (Sustainable Use License) ve svém repu — viz tabulka výše.
