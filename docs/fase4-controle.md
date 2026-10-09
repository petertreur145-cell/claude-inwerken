# Fase 4: controle vóór oplevering

Stand per 9 oktober 2026. Gecontroleerd bestand: `dist/claude-inwerken.html` (365 kB, 37 tegels).

## Wat er is getest

Met `tests/check.js` (Playwright, headless Chromium, geopend via `file://`):

| Controle | Resultaat |
|---|---|
| Elke tegel geopend, elke animatiestap en elk chatscenario doorlopen (scene-stappen, chatscenario's en uitlegkaarten), eerste quizvraag beantwoord | Geen consolefouten |
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
| Elke tegel heeft een “stand per”-datum en minstens één bron | Ja (75 unieke bronnen) |
| Uitleg per tegel | Originele tegels ±120 woorden; tegels in de korte vorm maximaal 60 |
| Bestandsgrootte onder 3 MB | 365 kB |

## Tweede ronde (9 oktober): niveau 1 en 2 concreter

Na feedback (“visuals beter, niet per se langer”, “simpel houden”, “te snel in een meeting”):

- **Nagespeelde gesprekken.** De meeste animaties van niveau 1 en 2 zijn nu een gesprek in een Claude-venster, vaak twee naast elkaar. Bijvoorbeeld: dezelfde kleine vraag op effort Low en Max (Max gaat overdenken, doet er lang over en past veel meer aan dan gevraagd), een vage vraag tegenover een goede briefing, een skill die wel of niet gepakt wordt door zijn beschrijving.
- **Eerst uitleggen, dan laten zien.** 1.2, 1.3, 1.4, 2.2, 2.3, 2.5, 2.6, 2.8 en 2.10 beginnen met een klikbare uitlegkaart: de vijf ingrediënten van een briefing, de vier modellen, thinking en de vijf effort-standen, wat voorkeuren, een `.md`-bestand en een skill zijn, wat er in een project zit, enzovoort. Niet alles is een chat: alleen waar een gesprek de boodschap beter laat zien.
- **Niets speelt vanzelf af.** Een gesprek start met **Afspelen**; stappen en situaties gaan met **Volgende**. Het tempo is rustiger. Het bureau (1.5) vult zich per klik.
- **Meetingmodus** (knop rechtsonder bij elk gesprek, onthouden in de browser): elke klik toont het volgende bericht, ook een klik in het venster. Na het laatste bericht gaat de klik naar de volgende situatie.
- **Simpeler.** Scenario's die weinig toevoegden zijn eruit; “zonder” en “met” staan naast elkaar in één vergelijking.
- **Slimmere volgorde.** Goed vragen (1.2) staat nu in niveau 1. Het overzicht van de bouwstenen opent niveau 2 (2.1). Niveau 2 is verdeeld in vier groepen van drie: Claude leert jou kennen, Gereedschap en toegang, Claude maakt iets, Claude werkt zelfstandig. Chat of Claude Code (2.10) en Automatiseren (2.13) zijn de opstap naar niveau 3. Omdat de nummers veranderd zijn, begint de voortgang opnieuw (nieuwe opslagnaam).
- **Nieuwe tegels:** 1.6 Losse vraag of vaste route en 2.13 Automatiseren: kies je route (losse chat, project of skill, geplande taak, formules of Power Query, een script dat daarna zonder AI draait, een flow, een agent).
- **Spiekbriefje** (nieuw veld `tips`) bij 1.2, 1.4, 1.6, 2.5 en 2.13.
- **Nieuw gecontroleerd** en als bron toegevoegd: effort (Max “can lead to overthinking”, lagere effort doet niet meer dan gevraagd), ultracode, hallucinaties verminderen (laat Claude “ik weet het niet” zeggen) en skills (alleen de beschrijving staat altijd klaar; de rest laadt pas bij gebruik).
- **Correctie in 2.3:** chats in een project delen niet vanzelf hun inhoud, maar op betaalde abonnementen kan Claude eerdere chats in het project doorzoeken als je ernaar vraagt.
- De gesprekken zijn nagespeeld. Tijden, verbruik, bestandsnamen en machinetypes (zoals de RX-40) zijn verzonnen ter illustratie; dat staat onder elke animatie.

## Eindversie (9 oktober): jouw keuzes

Met `dist/vergelijken.html` is per onderwerp gekozen tussen het origineel (versie 1) en de nieuwe versie. De eindversie volgt die keuzes:

| Keuze | Tegels |
|---|---|
| Nieuw | Startscherm en volgorde, 1.1 Wat is Claude, 1.2 Goed vragen, 1.6 Losse vraag of vaste route, 2.1 Bouwstenen, 2.2 Voorkeuren en stijl, 2.7 Claude in Chrome, 2.13 Automatiseren, 3.1 Claude Code, 3.2 Handige commando's |
| Origineel | 1.3 Modellen, 1.4 Thinking en effort, 1.5 Context window, 2.4 Memory, 2.5 Skills, 2.6 Connectors, 2.9 Ontwerpen, 2.11 Langere taken, 2.12 Geplande taken, de rest van niveau 3, pagina Over |
| Versie uit ronde 2 | 2.10 Chat of Claude Code (opmerking: “versie 2 was beter”) |
| Opnieuw geschreven | 2.3 Projects en 2.8 Artifacts (“allebei slecht”): korte vorm, simpel schema in 4 stappen, voorbeeld uit de inkoop |

Aanvullingen volgens de opmerkingen:

- **2.4 Memory:** je kunt Claude ook opdragen iets te onthouden (“onthoud dat een OB een orderbevestiging is”); in een project onthoudt hij het voor dat project. Ook als extra stap in de visual.
- **2.13 Automatiseren:** onder elke route staat een schema: wie doet wat, wanneer, en of er AI aan te pas komt.

Wat voor alle tegels geldt:

- Originele tegels hebben hun eigen tekst, voorbeelden en “Probeer zelf” terug; verwijzingen naar andere tegels zijn omgezet naar de nieuwe nummers.
- **Niets speelt vanzelf af**, ook niet in de originele tegels: stappen gaan op klik (of rechtsklik, pijl rechts, spatie), gesprekken starten met Afspelen. Dit volgt je eerdere wens; het origineel speelde automatisch.

Gecontroleerd: `tests/check.js` (alle 37 tegels, elke stap, 375 en 1440 px, licht en donker, met en zonder *reduced motion*, opslag geblokkeerd): geen consolefouten, geen externe aanvragen. De nieuwe visuals zijn ook doorgeklikt met klik, rechtsklik, pijltjes en spatie; zonder klik beweegt er niets.

## Wat ik niet kon testen

- **Echte Windows-pc's met Edge en Chrome.** Getest is Chromium op Linux. Edge en Chrome gebruiken dezelfde motor, maar het lettertype verschilt: op Windows 11 is het Segoe UI Variable. Even dubbelklikken op een werkplek is een goede laatste check.
- **Openen vanaf een netwerkmap** (`\\server\map\…`). Dat werkt in Chromium net als een lokaal bestand, maar ik kon het hier niet nabootsen. Ook hoe de browser daar de voortgang bewaart, kon ik niet testen. Lukt opslaan niet, dan werkt de app gewoon, alleen zonder voortgang.

## Niet kunnen verifiëren

Deze punten staan in de app met voorzichtige formulering (“lijkt”, “volgens bronnen”), of ze staan er niet in.

1. **Menu Stijlen.** Claude Academy zegt dat het menu “Use style” is uitgefaseerd. Een officieel supportartikel vond ik niet. Tegel 2.2 werkt hoe dan ook: stijl via een `.md`-bestand of een skill.
2. **Wanneer memory geladen wordt in de Claude-app** (altijd een samenvatting, of op aanvraag). Niet gedocumenteerd; de bouwstenen-tabel (2.1) is daarom voorzichtig geformuleerd. Voor Claude Code is het wel bevestigd.
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
- **Edge of Chrome:** tegel 2.9 zegt duidelijk dat Claude in Chrome niet in Edge werkt.
- **Agentic werken:** 10 korte tegels, waaronder een tabel met alle commando's.
- **Extra's** (beeld/video, blind vergelijken): meegenomen als groep “Extra”.
- **Ontwerp:** na feedback omgezet naar Apple-stijl (zie `docs/fase2-ontwerp.md`).
