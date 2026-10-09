# Fase 4: controle vóór oplevering

Stand per 9 oktober 2026. Gecontroleerd bestand: `dist/claude-inwerken.html` (366 kB, 37 tegels).

## Wat er is getest

Met `tests/check.js` (Playwright, headless Chromium, geopend via `file://`):

| Controle | Resultaat |
|---|---|
| Elke tegel geopend, elke animatiestap en elk chatscenario doorlopen (88 stappen, 49 scenario's), eerste quizvraag beantwoord | Geen consolefouten |
| Op 1440 px licht, 375 px donker, 1440 px donker met *reduced motion*, 375 px licht met *reduced motion* | Overal in orde |
| Externe aanvragen (scripts, lettertypen, afbeeldingen, analytics) | Geen. Een Content-Security-Policy in het bestand blokkeert ze bovendien. Alleen bronlinks openen, en pas als je erop klikt |
| Horizontaal scrollen van de pagina | Nergens. Brede tabellen scrollen binnen hun eigen kader |
| Tekst die niet in een animatievakje past | Geen (de tekst krimpt automatisch waar nodig) |
| Voortgang: alle 37 tegels gelezen, drie stempels “Ingewerkt” | Klopt |
| Opslag geblokkeerd (localStorage gooit een fout) | App werkt, zonder voortgang |
| Zoeken (“goal”, “outlook”) | Vindt de juiste tegels |
| Toetsenbord: Tab naar tegels, Enter, ← →, Esc, / | Werkt, met zichtbare focusrand |
| Kopieerknop | Kopieert; valt anders terug op selecteren + Ctrl+C |
| Elke quizvraag heeft precies één goed antwoord | Ja (69 vragen; afgedwongen door het dataformaat en gecontroleerd bij het bouwen) |
| Elke tegel heeft een “stand per”-datum en minstens één bron | Ja (82 unieke bronnen) |
| Uitleg per tegel ±120 woorden | Ja (maximaal 110, gemiddeld 92) |
| Bestandsgrootte onder 3 MB | 366 kB |

## Tweede ronde (9 oktober): niveau 1 en 2 concreter

Na feedback (“visuals beter, niet per se langer”) zijn de animaties van niveau 1 en 2 vervangen door nagespeelde gesprekken in een Claude-venster, vaak twee naast elkaar. Voorbeelden: dezelfde kleine vraag op effort Low en Max (Max gaat overdenken, doet er lang over en past veel meer aan dan gevraagd), een vage vraag tegenover een goede briefing, een skill die wel of niet gepakt wordt door zijn beschrijving.

- Nieuw veld `tips` (Spiekbriefje) bij 1.3, 1.7, 2.2, 2.5 en 2.12.
- Nieuwe tegels: **1.7 Losse vraag of vaste route** en **2.12 Automatiseren: kies je route** (losse chat, project of skill, geplande taak, formules of Power Query, script, flow, agent).
- Nieuw gecontroleerd en toegevoegd als bron: de pagina’s over effort (Max “can lead to overthinking”, lagere effort doet niet meer dan gevraagd), ultracode, het verminderen van hallucinaties (laat Claude “ik weet het niet” zeggen) en skills (alleen de beschrijving staat altijd klaar; de rest laadt pas bij gebruik).
- Correctie in 2.3: chats in een project delen niet vanzelf hun inhoud, maar op betaalde abonnementen kan Claude eerdere chats in het project doorzoeken als je ernaar vraagt.
- De gesprekken zijn nagespeeld. Tijden, verbruik, bestandsnamen en machinetypes (zoals de RX-40) zijn verzonnen ter illustratie; dat staat onder elke animatie.

## Wat ik niet kon testen

- **Echte Windows-pc's met Edge en Chrome.** Getest is Chromium op Linux. Edge en Chrome gebruiken dezelfde motor, maar het lettertype verschilt: op Windows 11 is het Segoe UI Variable. Even dubbelklikken op een werkplek is een goede laatste check.
- **Openen vanaf een netwerkmap** (`\\server\map\…`). Dat werkt in Chromium net als een lokaal bestand, maar ik kon het hier niet nabootsen. Ook hoe de browser daar de voortgang bewaart, kon ik niet testen. Lukt opslaan niet, dan werkt de app gewoon, alleen zonder voortgang.

## Niet kunnen verifiëren

Deze punten staan in de app met voorzichtige formulering (“lijkt”, “volgens bronnen”), of ze staan er niet in.

1. **Menu Stijlen.** Claude Academy zegt dat het menu “Use style” is uitgefaseerd. Een officieel supportartikel vond ik niet. Tegel 2.1 werkt hoe dan ook: stijl via een `.md`-bestand of een skill.
2. **Wanneer memory geladen wordt in de Claude-app** (altijd een samenvatting, of op aanvraag). Niet gedocumenteerd; de bouwstenen-tabel (1.6) is daarom voorzichtig geformuleerd. Voor Claude Code is het wel bevestigd.
3. **1 miljoen tokens context op het Free-abonnement.** Het supportartikel noemt alleen de betaalde abonnementen.
4. **Claude Design per abonnement.** De bronnen spreken elkaar tegen (bèta op betaalde abonnementen tegenover ook Free). De tegel zegt: “beschikbaarheid verschilt per abonnement”.
5. **Samengevoegde chat en Cowork op het Team-abonnement.** Pro en Max hebben het, Enterprise in bèta, Team “volgt”.
6. **Claude Code op het web zonder GitHub.** De documentatie gaat uit van een GitHub-repository; de tegel noemt GitHub als vereiste.
7. **Modellen in Claude for Outlook.** De handleiding noemt Opus 4.7, Opus 4.6 en Sonnet 4.6; dat lijkt verouderd en staat niet in de app.
8. **Arena (voorheen LMArena).** De huidige naam en het adres (arena.ai) komen uit secundaire bronnen; Wikipedia en arena.ai waren vanuit mijn omgeving niet bereikbaar. Tegel 3.9 heeft daarom geen “echt gebeurd”-voorbeeld en de bronlink is gemarkeerd als te checken.
9. **Higgsfield.** Functies en prijzen niet geverifieerd (de meeste bronnen zijn marketing). Tegel 3.8 noemt alleen wat het in grote lijnen is.
10. **Klantcijfers** (Rakuten, Brilliant, Datadog, Ramp, Project Fetch) zijn eigen opgaven, gepubliceerd door Anthropic.
11. **MCP-citaat.** De USB-C-zin komt van modelcontextprotocol.io; die site kon ik niet direct openen, wel via zoekresultaten en de blog van claude.com bevestigen.

## Keuzes die ik zelf heb gemaakt (vragen uit fase 1 bleven open)

- **Huiskleuren en logo:** niet ontvangen. Apple-blauw als accent, één plek om te wijzigen; logo als placeholder (letter N).
- **Abonnement van Numafa:** onbekend. De tegels noemen per functie voor welke abonnementen het geldt.
- **Edge of Chrome:** tegel 2.10 zegt duidelijk dat Claude in Chrome niet in Edge werkt.
- **Agentic werken:** 10 korte tegels, waaronder een tabel met alle commando's.
- **Extra's** (beeld/video, blind vergelijken): meegenomen als groep “Extra”.
- **Ontwerp:** na feedback omgezet naar Apple-stijl (zie `docs/fase2-ontwerp.md`).
