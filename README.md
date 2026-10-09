# Claude inwerken

Interactieve leerapp voor collega's van Numafa Cleaning & Automation B.V. In 37 tegels van ±2 minuten leer je wat Claude kan, waarvoor je het gebruikt en hoe je het zelf probeert. Rode draad: Claude is een briljante nieuwe collega die elke chat zijn eerste werkdag heeft.

Stand per 9 oktober 2026.

## Gebruiken

**Dubbelklik op `dist/claude-inwerken.html`.** Dat is het enige bestand dat collega's nodig hebben.

- Werkt in Edge en Chrome, ook vanaf een netwerkmap.
- Geen internet nodig. De app doet zelf geen enkele aanvraag naar buiten; alleen als je op een bronlink klikt, opent die in je browser.
- Voortgang (gelezen tegels, quizscores, stempels) blijft in de opslag van de browser op die computer. Lukt opslaan niet, dan werkt de app gewoon, alleen zonder geheugen.
- Toetsenbord: `/` zoeken, `←` `→` vorige/volgende tegel, `Esc` terug.

## Mappen

| Map of bestand | Wat |
|---|---|
| `dist/claude-inwerken.html` | Het gebundelde bestand (±380 kB). Dit deel je. |
| `src/tegels.json` | **Alle inhoud**: tegels, niveaus, teksten van de pagina Over. |
| `src/index.html` | Het sjabloon van de pagina. |
| `src/styles.css` | De stijl. Kleuren staan bovenaan. |
| `src/app.js` | Navigatie, zoeken, voortgang, quiz, kopiëren. |
| `src/visuals.js` | De animaties (chatvenster, scene, bureau, tabel). |
| `src/icons.js` | De iconen (inline SVG). |
| `build.js` | Maakt van `src/` het ene bestand in `dist/`, en controleert de inhoud. |
| `tests/check.js` | Klikt in een browser alle tegels door en controleert alles (fase 4). |
| `docs/` | Onderzoek (fase 1), ontwerp (fase 2) en controle (fase 4). |

## Een tegel aanpassen of toevoegen

Alle inhoud staat in **`src/tegels.json`**. Je hoeft de app niet te verbouwen.

1. Open `src/tegels.json` in een teksteditor (Kladblok werkt, VS Code is fijner).
2. Pas een tekst aan, of kopieer een bestaande tegel (alles tussen `{` en de bijbehorende `}`), plak hem op de juiste plek en pas hem aan. De volgorde in het bestand is de volgorde in de app.
3. Bouw opnieuw: `node build.js` (zie hieronder). Het bouwscript controleert of alles klopt en noemt anders precies wat er mis is.

Velden van een tegel:

| Veld | Betekenis |
|---|---|
| `id` | Nummer, bijvoorbeeld `"2.12"`. Uniek. |
| `niveau` | `1`, `2` of `3`. |
| `groep` | Optioneel: subsectie binnen een niveau, bijvoorbeeld `"kennen"` (niveau 2) of `"agentic"` (niveau 3). De groepen staan bovenaan `tegels.json` onder `groepen`. |
| `titel`, `kort` | Titel en de zin op de voorkant van de tegel. |
| `icoon` | Naam van een icoon uit `src/icons.js`, bijvoorbeeld `"folder"`. |
| `minuten` | Leestijd. |
| `breed` | Optioneel `true`: tegel over de hele breedte (voor tabellen). |
| `inEenZin` | “In één zin” bovenaan het detailscherm. |
| `uitleg` | Lijst van alinea's, samen ±120 woorden. |
| `tabel` | Optioneel: vaste tabel onder de uitleg (`kolommen`, `rijen`). |
| `visualTitel`, `visual` | De animatie. Zie hieronder. |
| `tips` | Optioneel: lijst met korte regels, getoond als **Spiekbriefje** onder de animatie. |
| `metafoor` | Lijst van alinea's: de nieuwe-collega-metafoor. |
| `voorbeelden` | 1 tot 4 voorbeelden. `soort` is `"echt"` (met `bron`), `"numafa"` of `"thuis"`. Gebruik `tekst`, of `erin` / `claude` / `eruit`. Minstens één Numafa-voorbeeld. |
| `probeer` | `prompt` (wordt kopieerbaar) en `tip`. |
| `valkuil` | Eén alinea. |
| `quiz` | 1 of 2 vragen: `vraag`, `opties`, `goed` (het nummer van het goede antwoord, tellend vanaf 0), `goedUitleg`, `foutUitleg`. Zo heeft elke vraag precies één goed antwoord. |
| `stand` | Datum als `"JJJJ-MM-DD"`. |
| `bronnen` | Lijst met `label` en `url` (https). Minstens één. |
| `zoekwoorden` | Extra woorden waarop de zoekfunctie de tegel vindt. |

Opmaak in teksten: `**vet**`, `*schuin*`, `` `code` `` en `[linktekst](https://…)`.

### Animaties (`visual`)

- `{ "type": "chat", "scenarios": [...] }`: een nagespeeld gesprek in een Claude-venster. Zo zie je concreet wat er gebeurt: wat je vraagt, hoe lang hij nadenkt, wat hij aanpast. Gebruikt in de meeste tegels van niveau 1 en 2.
  - Elk scenario heeft een `label` (de knop), een `caption` (de uitleg eronder) en `panes`: één venster, of twee naast elkaar om te vergelijken (bijvoorbeeld effort Low tegenover Max).
  - Een venster (`pane`) heeft `title`, `model`, optioneel `label` (kopje erboven), `chips` (bijvoorbeeld een connector), `side` (zijpaneel met `title` en `items`, zoals memory of skills), `meter` (`sec` en `usage` van 0 tot 1, plus `extra`) en `verdict` (`tone` `ok`, `warn` of `bad`, en `text`).
  - `events` speelt het gesprek af, in volgorde. Soorten (`t`): `user` (met optioneel `files`), `thinking` (`lines`, `secs`), `tool`, `answer` (regels gescheiden door `\n`), `file`, `diff` (`lines` als `["+", "tekst"]`), `code`, `approve`, `card`, `note`, `memory`, `status`, `side-add` en `side-mark` (`index` van een item in het zijpaneel).
  - Met `ms` bij een gebeurtenis bepaal je zelf hoe lang die duurt.
  - In plaats van `panes` kan een scenario een `explain` hebben: een klikbare uitlegkaart, bijvoorbeeld de vijf effort-standen. Velden: `title`, `items` (elk met `name`, en optioneel `sub`, `text`, `bars`, `example`, `use`), `bars` (namen van de balkjes, zoals `["Nadenken", "Tijd", "Verbruik"]`), `foot`. Zet zo'n kaart vóór de vergelijkingen: eerst uitleggen, dan laten zien.
- Niets speelt vanzelf af. Een gesprek start pas na een klik op **Afspelen**; **Volgende** gaat naar het volgende scenario of de volgende stap.
- **Meetingmodus** (knop bij elk gesprek): elke klik toont het volgende bericht, zodat je er rustig bij kunt vertellen. De keuze blijft bewaard in de browser.
- `{ "type": "desk" }`: het bureau dat volloopt (tegel 1.5).
- `{ "type": "table", "kolommen": [...], "rijen": [{ "cellen": [...], "tags": [...], "uitleg": "..." }], "filters": [{ "label": "...", "tag": "..." }] }`: interactieve tabel.
- `{ "type": "scene", "items": [...], "steps": [...], "choices": [...] }`: animatie in stappen op een canvas van 420 × 260.
  - `items`: elementen met `id`, `type` (`card`, `icon`, `glyph`, `text`, `bar`, `dot`, `zone`, `line`), positie `x`, `y`, maat `w`, `h` (of `size`, `r`), en `label`, `text`, `icon`, `tone` (`accent`, `soft`, `ok`, `warn`, `bad`, `muted`, `ghost`, `dark`), `opacity`, `scale`.
  - `steps`: per stap een `caption` en in `set` per element wat er verandert. Elke stap bouwt voort op de vorige.
  - `choices`: optionele knoppen die naar een stap springen.
  - Kijk naar een bestaande tegel en pas die aan; dat is het snelst.

## Bouwen

Op een computer waar dat mag (niet op de werkplekken; daar zijn terminal en scripts verboden):

```
node build.js
```

Nodig: Node.js 16 of nieuwer. Geen extra pakketten. Het resultaat komt in `dist/claude-inwerken.html`.

Geen computer met Node? Laat Claude Code op het web (claude.ai/code) het voor je doen: “pas tegel 2.4 aan en bouw opnieuw”.

Snel een tikfout verbeteren kan ook direct in `dist/claude-inwerken.html`: de inhoud staat daar als JSON in het blok `<script type="application/json" id="tegels">`. Neem de wijziging daarna ook over in `src/tegels.json`, anders is hij bij de volgende build weg.

## Vergelijken: origineel of nieuw

`dist/vergelijken.html` zet per onderwerp het origineel (versie 1) en de nieuwe versie naast elkaar. Klik per onderwerp welke beter is, eventueel met een opmerking, en download onderaan je keuzes als `keuzes-claude-inwerken.md`. Je keuzes blijven bewaard in de browser tot je klaar bent.

Opnieuw bouwen: `node vergelijken/build.js` (gebruikt `vergelijken/origineel.html` en `vergelijken/nieuw.html`).

## Huiskleuren en logo

- Kleuren: bovenaan `src/styles.css`, het blok `:root`. `--accent` is de hoofdkleur (knoppen, pas, ringen); `--lvl-1`, `--lvl-2`, `--lvl-3` zijn de niveaukleuren. De donkere varianten staan in de twee blokken eronder.
- Logo: nu een placeholder (de letter N in een blokje), op twee plekken: `src/index.html` (`wordmark-logo`) en de pas in `src/app.js` (`pass-logo`). Vervang die door een inline SVG van het logo.

## Controleren (fase 4)

```
npm install
npm run check
```

Opent het gebouwde bestand via `file://` in headless Chromium en klikt alle tegels en animatiestappen door, op 375 en 1440 px, licht en donker, met en zonder *reduced motion*, en ook met geblokkeerde opslag. Meldt consolefouten, externe aanvragen, horizontaal scrollen en tekst die niet in een animatie past.

## Bronnen en actualiteit

Alle feiten over Claude komen uit de officiële bronnen van Anthropic (platform.claude.com, code.claude.com/docs, support.claude.com, claude.com, anthropic.com), opgezocht op 8 en 9 oktober 2026. Wat niet bevestigd kon worden, staat in `docs/fase4-controle.md` onder *Niet kunnen verifiëren*.
