# killBottleneck skins

Komunitní galerie grafických skinů pro [killBottleneck](https://killbottleneck.com).
Skiny jsou **volná data pod CC0** — vezmi, uprav, sdílej, bez ptaní.

> ⚠️ **Zatím privátní.** Repo se zveřejní společně s oficiálním vydáním
> killBottlenecku a přesune pod organizaci — kroky viz [PUBLISH-CHECKLIST.md](PUBLISH-CHECKLIST.md).

## Jak skin použít

1. Stáhni si `skins/<název>.json`.
2. V aplikaci: menu pod avatarem → **Vzhled** → **Importovat skin** → vyber soubor
   (nebo obsah vlož jako text).
3. Skin se uloží k tvému účtu a platí na všech zařízeních, ve světlém i tmavém
   režimu i v lite zobrazení.

## Jak vytvořit vlastní

Nejjednodušší start: v dialogu Vzhled dej **Exportovat** u skinu, který se ti
líbí, a uprav hodnoty. Formát `kb-skin` v1:

```json
{
  "format": "kb-skin",
  "version": 1,
  "name": "Můj skin",
  "author": "Jméno",
  "license": "CC0-1.0",
  "description": "Krátký popis.",
  "light": {
    "background": "210 40% 98%",
    "primary": "239 84% 67%",
    "radius": "0.5rem",
    "font-heading": ["Georgia", "serif"]
  },
  "dark": { "background": "222 16% 12%" }
}
```

Pravidla (vynucuje je validátor v aplikaci i tady v CI):

- **Barvy** = holé HSL trojice `"H S% L%"` (žádné hex, žádné `hsl()`, žádná alfa).
  Povolené tokeny odpovídají CSS proměnným aplikace — kompletní seznam
  v `validator/skin-validator.js` (`SKIN_COLOR_TOKENS`).
- **Fonty** = pole názvů rodin, poslední musí být generika
  (`sans-serif` / `serif` / `monospace` / `system-ui`). Webfonty se **nestahují** —
  použij písma zabalená v aplikaci (Inter, Plus Jakarta Sans) nebo systémová;
  neznámé písmo neškodně spadne na další v řadě.
- **`radius`** = `0`–`2rem` nebo `0`–`32px`.
- Sekce `light` je povinná, `dark` volitelná — co skin nedefinuje, zůstává
  z výchozího vzhledu (po jednotlivých tokenech).
- Celý JSON max **8 192 B**; `name` ≤ 60 znaků.
- Skin je **jen data** — žádné CSS, žádné URL, nic spustitelného. Proto se dá
  bezpečně sdílet.

Ověření lokálně:

```bash
node scripts/validate-all.mjs
```

## Jak skin poslat do galerie

Pull request s jedním souborem `skins/<kebab-case-nazev>.json`. CI ho zvaliduje
automaticky. Posíláš-li skin, souhlasíš s vydáním pod **CC0-1.0** (kredit
zůstává v poli `author`).

## Editor skinů

Ve složce [`editor/`](editor/) je samostatná open source (MIT) webová aplikace:
editace všech tokenů s živým náhledem (světlý i tmavý režim vedle sebe),
import/export `.kb-skin.json` a start z kterékoliv vestavěné šablony.
Běží celá v prohlížeči, žádná data nikam neposílá. Vývoj a build viz
[`editor/README.md`](editor/README.md).

## Licence

| Co | Licence |
|---|---|
| `skins/*.json` (data skinů) | [CC0 1.0](LICENSE) — public domain, ber bez ptaní |
| `validator/`, `scripts/` | [CC0 1.0](LICENSE) |
| `editor/` (webová aplikace vč. malůvek) | [MIT](editor/LICENSE) |

Editor je vědomě **jen o skinech** — vykresluje stylizovanou maketu, nikoli
skutečné mapy. Produktový kód killBottlenecku (komponenty map, uzly) v tomto
repu není a nebude; ten je licencován zvlášť (Sustainable Use License)
v repu aplikace.
