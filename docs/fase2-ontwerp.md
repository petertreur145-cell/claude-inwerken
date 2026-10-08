# Fase 2: ontwerp

## Tweede ronde: Apple-stijl (definitief)

Na feedback op de eerste preview (“meer Apple style”) is het ontwerp omgezet. De eerste preview, “de technische tekening”, staat nog in de git-geschiedenis (commit `bc368cb`).

- **Typografie:** het systeemlettertype, net als bij Apple: San Francisco op de Mac, Segoe UI Variable op Windows 11. Grote, strakke koppen met een punt erachter (“Claude basics.”), lopende tekst op 17 tot 19 px.
- **Kleur:** lichtgrijze achtergrond (#F5F5F7) met witte kaarten; in donkere modus zwart met donkergrijze kaarten. Eén accentkleur (Apple-blauw, te vervangen door de Numafa-kleur) en een eigen kleur per niveau: blauw, groen en oranje.
- **Navigatie:** een doorschijnende balk met vervaging, zoekveld in iOS-stijl, pil-vormige knoppen.
- **Tegels:** witte kaarten met ronde hoeken en een gekleurd app-icoon (squircle), zoals in Instellingen op de iPhone. Op de telefoon worden het rijen.
- **Toegangspas:** een kaart in de stijl van Apple Wallet, met drie voortgangsringen (één per niveau, zoals de activiteitsringen) en een medaille “Ingewerkt” per afgerond niveau. Zo blijft de rode draad (het toegangspasje) zichtbaar.
- **Tegeldetail:** één leeskolom zoals een artikel op apple.com, met een brede “stage” voor de animatie, voorbeelden als kaarten, de quiz als iOS-lijst met vinkjes.
- **Overgangen:** korte crossfade tussen schermen en een morph van het tegelicoon naar het detailscherm (View Transitions, alleen waar de browser het kan en zonder *reduced motion*). Alle overgangen duren minder dan 0,4 seconde.

## Huiskleuren

Bovenaan `src/styles.css` staan `--accent` en de niveaukleuren `--lvl-1` tot en met `--lvl-3`. Pas die aan (plus hun donkere tegenhangers in de blokken eronder) en de hele app kleurt mee. Het logo is een placeholder (de letter N); zie de README.
