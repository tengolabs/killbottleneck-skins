# killBottleneck Skin Editor

Samostatná open source (**MIT**, viz [LICENSE](LICENSE)) webová aplikace pro
tvorbu skinů formátu `kb-skin` v1. Běží celá v prohlížeči — **žádný backend,
žádná data se nikam neodesílají.**

- editace všech tokenů: 35 barev (světlá + tmavá sekce), 4 písma, zaoblení,
  malůvka
- živý náhled: světlý a tmavý panel vedle sebe — stylizovaná maketa mapy
  + běžné UI prvky
- import a export `.kb-skin.json` (vše prochází validátorem), start
  z kterékoliv vestavěné šablony z [`../skins/`](../skins/)

## Hranice vůči produktu (vědomé rozhodnutí)

Náhled mapy je **maketa kreslená od nuly jen z CSS tokenů skinu**. Produktový
kód killBottlenecku (komponenty map, uzly) v editoru **není a nebude** — je
licencován zvlášť (Sustainable Use License) v repu aplikace. Jediný převzatý
vizuální kus jsou dekorativní malůvky (`src/components/PatternArt.jsx`),
uvolněné držitelem práv pod MIT; jejich drift vůči produktu hlídá
`../scripts/check-upstream.mjs` přes `../upstream.lock`.

Validátor ani data skinů se nekopírují — editor importuje
`../validator/skin-validator.js` a `../skins/*.json` přímo (jediná kopie
v repu, viz `vite.config.js` `fs.allow`).

## Vývoj

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build a test

```bash
npm run build      # dist/ — statický, base './' → funguje z libovolné podcesty
npm run test:e2e   # puppeteer proti vite preview (:20621), sbírá console errors
```

Test potřebuje Chrome (`CHROME_PATH`, výchozí `/usr/bin/google-chrome`).

## Nasazení (až po zveřejnění repa)

`dist/` je čistě statický a díky `base: './'` přenositelný beze změny:

- **killbottleneck.com/skin-editor/** — nasazení vzorem `scripts/nasadit.sh`
  z repa webu (cesty od skriptu, po nasazení curl kontrola živé URL), NEBO
- **GitHub Pages** tohoto repa.

Do open bety se nikam nenasazuje (repo je privátní).
