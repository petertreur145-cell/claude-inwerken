# Claude inwerken

Presentatie over Claude voor collega's van Numafa inkoop. Drie blokken, max 16 tegels; elke tegel is één slide. Het scherm ondersteunt, de presentator vertelt.

> **Stand: preview.** Startscherm, Prompting (1.1) en OB automatisch controleren (3.1) zijn af. De overige tegels staan alleen op de agenda (grijs) en worden overgeslagen.

## Gebruiken

**Dubbelklik op `dist/claude-inwerken.html`.** Werkt in Edge en Chrome via `file://`, zonder internet en zonder externe aanvragen.

| Toets of muis | Doet |
|---|---|
| `→`, spatie, PageDown, klik, rechtsklik | volgende stap, daarna volgende tegel |
| `←`, PageUp | vorige stap of tegel |
| `Esc` | terug naar het overzicht |
| `F` of de knop rechtsonder | volledig scherm |
| `1` `2` `3` (op het overzicht) | blok openen |

Niets speelt vanzelf af. Na het laatste scherm van een blok kom je terug op het overzicht, met het volgende blok gemarkeerd.

## Mappen

| Bestand | Wat |
|---|---|
| `dist/claude-inwerken.html` | Het gebundelde bestand. Dit deel je. |
| `src/tegels.json` | Alle inhoud: blokken, tegels, quizvragen. |
| `src/app.js` | Volgorde, stappen, bediening, schalen. |
| `src/visuals.js` | De visuals per soort. |
| `src/styles.css` | De stijl; kleuren bovenaan. |
| `src/icons.js` | Iconen (inline SVG). |
| `build.js` | Controleert de inhoud en bundelt naar `dist/`. |

## Een tegel

```json
{ "id": "3.1", "blok": 3, "titel": "…", "zin": "…", "punten": ["…"], "visual": { "type": "toepassing", … } }
```

- `zin`: max 20 woorden. `punten`: optioneel, max 3, elk max 8 woorden.
- Totaal max 50 zichtbare woorden en max 4 stappen; `node build.js` weigert te bouwen als het meer is en toont per tegel de telling.
- Een tegel zonder `visual` staat alleen op de agenda van het startscherm.

Soorten visual:
- `chat`: twee vensters (`vensters`), met `berichten` per `stap`. `van` is `jij`, `claude` of `oordeel` (met `toon` `ok` of `bad`). Een bericht heeft `tekst`, `regels` (lijst) of `briefing` (lijst van `[kopje, tekst]`). Alleen voor Prompting.
- `toepassing`: vast format voor de inkooptegels. Velden `probleem` en `waarom` (`icoon`, `tekst`), `bestanden` (lijst met `soort` `sheet`/`pdf`/`mail` en `naam`), `claude` (`icoon`, `tekst`, `chips`), `nu`, `straks`. Stap 1 tot 4 vullen de vier vakjes; de balk nu → straks komt bij stap 4.

Opmaak in teksten: `**vet**`, `*schuin*`, `` `code` ``.

## Bouwen

```
node build.js
```

Node.js 16 of nieuwer, geen extra pakketten.
