# PUBLISH checklist — zveřejnění galerie skinů + editoru

Repo je privátní do open bety killBottlenecku. Tohle je seznam pro den D,
ať se ve spěchu na nic nezapomene. Pořadí je záměrné.

## 0. Rozhodnutí předem (Richard)

- [ ] **Cílová organizace** — README tohoto repa říká „org `killbottleneck`",
      novější rozhodnutí (29. 7.) je org **`tengolabs`** (patří Tengo s.r.o.,
      veřejný produkt = `tengolabs/killbottleneck`). Sjednotit a podle toho
      opravit odkazy níže.
- [ ] **CC0 u validátoru potvrdit** — `validator/skin-validator.js` je
      byte-kopie produktového souboru (SUL); dual-licenci smí udělit jen
      držitel práv. Po potvrzení dopsat řádek do hlavičky souboru
      (⚠️ v PRODUKTU, pak byte-sync sem — jinak řve check-upstream).

## 1. Přesun a zveřejnění repa

- [ ] Přesunout repo pod cílovou org (Settings → Transfer ownership).
- [ ] Zapnout branch protection na `main` (vyžadovat zelené CI, žádný force-push).
- [ ] Zveřejnit repo (až PO bodech 2–3 — historie je čistá, ale odkazy ať sedí).

## 2. Ochrany PR flow (před prvním cizím PR)

- [ ] **Path-guard job** do `.github/workflows/validate.yml`: PR od cizích smí
      měnit JEN `skins/*.json` — jinak fail (zelený PR nesmí sahat na workflow,
      validátor ani editor).
- [ ] **PR šablona** (`.github/PULL_REQUEST_TEMPLATE.md`): jeden skin na PR,
      kebab-case název souboru, checkbox „souhlasím s vydáním pod CC0-1.0".
- [ ] Ověřit, že CI běží i na PR z forku a `permissions: contents: read` drží
      (fork-PR nemá dostat write token).

## 3. Obsah pro veřejnost

- [ ] **README přepsat EN-first** (CZ sekce ponechat níže) — publikum je
      mezinárodní, skiny už EN názvy mají. První odstavec smí říct „open
      source" jen u editoru (MIT); skiny = CC0; NEŘÍKAT to o produktu (fair-code).
- [ ] **Náhledové obrázky skinů** do README (mřížka light+dark, jde vyrobit
      screenshotem editoru per šablona).
- [ ] Aktualizovat odkazy na repo: `editor/src/components/ImportExport.jsx`
      (`GALLERY_URL`) + v PRODUKTU `SkinDialog.jsx` (GALLERY_URL) a oba README
      produktu — dnes míří na `tengosro/killbottleneck-skins`.

## 4. Nasazení editoru

- [ ] `cd editor && npm ci && npm run build` → `dist/` (base './', přenositelný).
- [ ] Varianta A: **killbottleneck.com/skin-editor/** — nasadit VZOREM
      `scripts/nasadit.sh` z repa webu (cesty od skriptu; ⚠️ ruční rsync
      s relativní cestou už jednou tiše selhal a curl hlásil úspěch — po
      nasazení VŽDY curl kontrola živé URL proti očekávanému obsahu).
- [ ] Varianta B: GitHub Pages tohoto repa (workflow deploy z `editor/dist`).
- [ ] Po nasazení: proklik na živé URL (import, export, přepnutí jazyka)
      + odkaz na editor z killbottleneck.com a z dialogu Vzhled v aplikaci.

## 5. Kontrola konzistence (poslední před oznámením)

- [ ] V produktu `bash tests/run-all.sh` zelený VČETNĚ kroku
      `check-upstream.mjs` (drift produkt ↔ galerie 0/0, `upstream.lock` aktuální).
- [ ] `node scripts/validate-all.mjs` 11/11 (nebo víc) na mainu.
- [ ] E2e editoru 32/32 na mainu.
- [ ] Odkazy v aplikaci (SkinDialog) vedou na NOVOU adresu repa a fungují
      odhlášenému uživateli.
