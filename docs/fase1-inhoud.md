# Claude inwerken: fase 1, onderzoek en inhoud

Stand per 8 oktober 2026. Alles wat over Claude gaat is opgezocht in de officiële bronnen (platform.claude.com, code.claude.com/docs, support.claude.com, claude.com, anthropic.com). Wat ik niet kon bevestigen staat onderaan bij **Te checken** en komt niet in de app tot het bevestigd is.

Per tegel staat hier: titel, one-liner, metafoor, kernfeiten (met bron), praktijkvoorbeelden en de gekozen visual of animatie. Valkuil, quiz en "probeer zelf"-prompt schrijf ik in fase 3 op basis van wat jij hier goedkeurt.

---

## Eerst even dit: zeven dingen die de inhoud raken

1. **Chat en Cowork zijn sinds 16 september 2026 één Claude.** Eén berichtvak; Claude kiest zelf of hij snel antwoordt of een klus uitvoert (bestanden maken, code draaien, doorwerken in de cloud). Uitrol: eerst Pro en Max, Enterprise in bèta (standaard uit), Team "volgt". Welke versie collega's zien hangt dus af van jullie abonnement.
2. **Fable en Mythos zijn hetzelfde model.** Fable 5.1 is de publieke versie mét extra veiligheidsregels voor cyber en biologie; Mythos 5.1 is dezelfde topexpert zónder die regels, alleen voor gescreende organisaties. Dat past precies in jouw metafoor.
3. **Claude in Chrome werkt alleen in Google Chrome**, niet in Edge en niet op mobiel. Als Numafa vooral Edge gebruikt, moet die tegel dat eerlijk zeggen.
4. **Claude Code op het web heeft geen terminal nodig, wel GitHub.** Het draait in de cloud van Anthropic, maar werkt met een GitHub-repository (voor een nieuw project maak je een lege repository aan).
5. **Outlook kan op twee manieren:** de Microsoft 365-connector in Claude (lezen, en schrijven als de beheerder dat aanzet) en de add-in *Claude for Outlook* (onderdeel van Claude for Microsoft 365), die nooit zelf mailt: elk concept blijft onverzonden staan tot jij op Verzenden drukt. Beide vragen eenmalige toestemming van een Microsoft-beheerder (Entra Global Admin).
6. **Het menu "Stijlen" lijkt uitgefaseerd.** Volgens Claude Academy doe je schrijfstijl nu via instructies of een skill. Staat bij *te checken*.
7. **Fast mode bestaat alleen in Claude Code** (en het modelmenu op claude.ai/code), alleen voor Opus, en wordt betaald uit usage credits. In de gewone chat niet.

Kleine nuance bij de rode draad: Anthropic zegt letterlijk *"Think of Claude as a brilliant but new employee who lacks context on your norms and workflows"*. Het geheugenverlies komt uit hun artikel over lang lopende agents: elke nieuwe sessie is als een collega in een ploegendienst die niets weet van de vorige dienst. De metafoor klopt dus, alleen staat het geheugenverlies-deel in een ander stuk.

---

## Vragen aan jou (graag bij je akkoord)

1. **Huiskleuren en logo van Numafa?** Graag hex-codes en het logo als SVG (of PNG). Heb je ze niet, dan kies ik een rustig neutraal palet dat je op één plek in de CSS aanpast.
2. **Welk Claude-abonnement heeft Numafa?** (Free, Pro, Team of Enterprise.) Dat bepaalt o.a. of Fable erin zit, of er organisatie-instructies zijn, en of collega's al de samengevoegde chat zien.
3. **Edge of Chrome op de werkplekken?** (Zie punt 3 hierboven.)
4. **GitHub:** hebben IT of engineering een GitHub-organisatie? Zo niet, dan beschrijf ik Claude Code als "kan, maar vraag eerst IT".
5. **Agentic-subsectie:** ik stel 10 korte tegels voor (één per commandogroep plus een tabel). Liever samenvoegen tot ±5 grotere?
6. **De twee extra's** (beeld/video met AI, en modellen blind vergelijken): meenemen of schrappen?

---

## Overzicht

35 tegels, ±2 minuten per stuk (samen ruim een uur). De twee tabellen-tegels lezen in ±3 minuten.

| # | Niveau | Tegel | One-liner |
|---|---|---|---|
| 1.1 | Basics | Wat is Claude | Slimme nieuwe collega die elke chat zijn eerste werkdag heeft |
| 1.2 | Basics | Modellen | Vier ervaringsniveaus, van snelle junior tot topexpert |
| 1.3 | Basics | Thinking, effort en fast mode | Direct antwoorden of eerst nadenken, en hoe lang |
| 1.4 | Basics | Context window | Zijn bureau: wat erop ligt ziet hij |
| 1.5 | Basics | Claude chat vs Claude Code | Meedenken aan jouw bureau of zelf aan de slag op een eigen werkplek |
| 1.6 | Basics | Alle bouwstenen op een rij | Negen bouwstenen, één vraag: wanneer weet Claude het? |
| 2.1 | Inrichten | Voorkeuren en stijl | Eén keer zeggen hoe je het wilt, elke chat raak |
| 2.2 | Inrichten | Instructies | Een goede briefing: rol, doel, context, vorm, voorbeeld |
| 2.3 | Inrichten | Projects | Projectmap met vaste instructies en documenten |
| 2.4 | Inrichten | Memory | Zijn notitieboekje, en jij mag meelezen |
| 2.5 | Inrichten | Skills | Werkinstructies die hij zelf uit de kast pakt |
| 2.6 | Inrichten | Artifacts | Opgeleverd werk dat blijft liggen |
| 2.7 | Inrichten | Ontwerpen in Claude | Ontwerpen en prototypes in je eigen huisstijl |
| 2.8 | Inrichten | Langere taken laten doorlopen | Hij werkt door in de cloud, ook als jouw laptop dicht is |
| 2.9 | Inrichten | Connectors: mail en agenda | Toegangspas tot Outlook of Gmail |
| 2.10 | Inrichten | Claude in Chrome | Meekijken en meeklikken in je browser |
| 2.11 | Inrichten | Geplande taken | Vaste afspraak in zijn agenda |
| 3.1 | Bouwen | Claude Code: wat en waar | Eigen werkplek in terminal, app, browser of telefoon |
| 3.2 | Bouwen | Handige commando's (tabel) | De knoppen op het bedieningspaneel |
| 3.3 | Bouwen | MCP | De USB-C-stekker die op elke app past |
| 3.4 | Bouwen | Plugins | Complete gereedschapskist in één keer |
| 3.5 | Bouwen | Workflows: n8n, Power Automate, geplande taken | Vaste procedure of collega die zelf nadenkt |
| 3.6 | Bouwen | VPS | Eigen kantoortje dat 24/7 open is |
| 3.7.1 | Agentic | Wat is agentic? | Plannen, doen, checken, en door tot het af is |
| 3.7.2 | Agentic | Eerst plannen: /plan | Eerst de tekening, dan pas de zaag |
| 3.7.3 | Agentic | Doorwerken: /goal en /loop | Pas klaar als de keurmeester tekent |
| 3.7.4 | Agentic | Hulpjes: subagents, /subtask, /agents | Hij schakelt zelf hulpjes in |
| 3.7.5 | Agentic | Achtergrond: /background, /fork, /tasks | Werk loopt door terwijl jij verder gaat |
| 3.7.6 | Agentic | Parallel: /batch, /workflows, /deep-research | Een heel team tegelijk aan één grote klus |
| 3.7.7 | Agentic | Tweede mening: /advisor | Even binnenlopen bij de senior |
| 3.7.8 | Agentic | Terug in de tijd: /rewind | Ongedaan maken voor het hele werk |
| 3.7.9 | Agentic | Op schema in de cloud: /schedule | Vaste afspraak, ook als jouw pc uit staat |
| 3.7.10 | Agentic | Alle agentic commando's (tabel) | Commando, wat, metafoor, wanneer |
| 3.8 | Extra | Beeld en video met AI | Claude schrijft het draaiboek, een videotool filmt |
| 3.9 | Extra | Modellen blind vergelijken | Blinde proeverij voor AI |

Legenda bij de voorbeelden: **Echt** = gedocumenteerde toepassing met bron. **Numafa** = herkenbaar werkvoorbeeld (verzonnen, zonder echte prijzen of klantnamen), steeds als *erin → Claude doet → eruit*. **Thuis** = dagelijks leven.

---

## Niveau 1: Claude basics

### 1.1 Wat is Claude

- **One-liner:** Claude is de AI-assistent van Anthropic die leest, schrijft, rekent en steeds vaker zelf klussen afmaakt: slim, maar elke chat weer zijn eerste werkdag.
- **Metafoor:** de briljante nieuwe collega. Weet veel over de wereld, niets over Numafa, tenzij je het vertelt. Morgen is hij het weer vergeten.
- **Kernfeiten:**
  - Anthropic: *"Think of Claude as a brilliant but new employee who lacks context on your norms and workflows."* ([prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices))
  - Elke nieuwe sessie begint zonder herinnering aan de vorige, als een ploegendienst zonder overdracht. ([Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)) Memory en projects (niveau 2) lossen dat deels op.
  - Kennis loopt tot juni 2026; voor nieuwer nieuws zoekt hij op het web. ([models overview](https://platform.claude.com/docs/en/about-claude/models/overview))
  - Sinds 16 september 2026 zijn chat en Cowork één Claude. ([support](https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude))
- **Echt:** *Project Vend.* Claude runde een maand een winkeltje op het kantoor van Anthropic. Hij verzon een betaalrekening, deelde kortingscodes uit, wees $100 voor een sixpack Irn-Bru af en beweerde op 1 april in blazer met stropdas te komen bezorgen. Conclusie van Anthropic: (nog) niet aannemen. In fase twee, met betere hulpmiddelen en een "CEO-agent", ging het een stuk beter. Les: slim is niet hetzelfde als ingewerkt. ([fase 1](https://www.anthropic.com/research/project-vend-1), [fase 2](https://www.anthropic.com/research/project-vend-2))
- **Echt (getal):** van alle gesprekken op Claude.ai gaat 46% over werk, 19% over studie en 35% over privézaken. ([Economic Index, jan 2026](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report))
- **Numafa (inkoop):** drie offertes van leveranciers erin → Claude zet levertijd, garantie en voorwaarden naast elkaar → tabel plus vijf vragen om na te bellen.
- **Thuis:** "Wat kan ik maken met prei, eieren en een restje kaas?" → recept voor vanavond.
- **Visual:** *De eerste werkdag.* Een poppetje zit aan een leeg bureau. Jij schuift een briefingkaartje toe (wie, wat, waarom) en een kwaliteitsmeter boven het antwoord loopt op. Knop "Nieuwe chat": bureau leeg, poppetje zwaait weer "Hoi, ik ben nieuw".

### 1.2 Modellen: Haiku, Sonnet, Opus en Fable

- **One-liner:** Claude heeft vier ervaringsniveaus. Hoe zwaarder de klus, hoe hoger het niveau, maar ook hoe trager en duurder.
- **Metafoor:** Haiku = snelle junior, Sonnet = ervaren allrounder, Opus = senior specialist, Fable = topexpert met extra veiligheidsregels. Mythos = dezelfde topexpert zonder die regels, alleen achter een beveiligde deur, op uitnodiging.
- **Kernfeiten** ([models overview](https://platform.claude.com/docs/en/about-claude/models/overview)):
  - De huidige reeks: Fable 5.1 (1 sep 2026), Opus 5.5 (22 sep), Sonnet 5.5 (28 sep), Haiku 5.5 (7 okt).
  - Haiku: *"high-volume, latency-sensitive tasks such as classification, extraction, and routing"*, de snelste. Sonnet: *"the best combination of speed and intelligence"*. Opus: lang lopend programmeer- en kenniswerk; advies van Anthropic: *"start with Claude Opus 5.5 for most workloads"*. Fable: *"demanding reasoning and long-horizon agentic work"*, de traagste.
  - Alle vier kunnen 1 miljoen tokens aan context aan (zie 1.4).
  - Fable in de Claude-app: op alle betaalde abonnementen. Max en premium Team-plekken mogen tot de helft van hun weeklimiet aan Fable besteden; Pro en standaard Team-plekken betalen Fable met usage credits. ([support](https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan))
  - **Waarom Mythos niet publiek is:** Mythos 5.1 is *"the same underlying model"* als Fable 5.1, maar zonder de veiligheidsregels voor cybersecurity en biologie. Anthropic: *"Because Mythos 5.1 is highly capable for cybersecurity and biology research, it could be used both for good and for harm."* Alleen gescreende organisaties krijgen toegang (Cyber Verification Program, Life Sciences Verification Program, Project Glasswing). Fable stuurt riskante vragen, zoals over het maken van exploits, door naar een Opus-model. ([Mythos](https://www.anthropic.com/claude/mythos), [aankondiging 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1))
- **Echt:** Mythos Preview vond een 27 jaar oude fout in OpenBSD, een van de best beveiligde besturingssystemen ter wereld, waarmee je elke OpenBSD-server via het netwerk kon laten crashen. De fout is inmiddels gedicht. Daarom niet voor iedereen. ([red.anthropic.com](https://red.anthropic.com/2026/mythos-preview/))
- **Echt:** Ramp liet Fable 5.1 38 uur onbeheerd doorwerken; 's nachts draaide hij zes experimenten tegelijk. HubSpot zag Haiku 5.5 bij een CRM-controle het snelst klaar zijn, met de meeste treffers. (Klantcitaten op [Fable 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) en [Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5).)
- **Numafa (magazijn):** 400 rommelige artikelomschrijvingen erin → Haiku deelt ze per productgroep in → nieuwe kolom voor Excel. **Numafa (engineering):** storingslogs en schema van een complexe machine erin → Opus of Fable redeneert over mogelijke oorzaken → lijst met hypotheses en wat je eerst meet.
- **Thuis:** Haiku vertaalt een menukaart, Opus plant een rondreis van drie weken.
- **Visual:** vier toegangspasjes op een schuif van *snel* naar *denkkracht*. Sleep een taakkaartje ("100 mails sorteren", "offerte nalopen", "storingsanalyse") op een pasje en drie meters tonen tijd, kosten en kwaliteit. Het Mythos-pasje ligt achter glas met een slot.

### 1.3 Thinking, effort en fast mode

- **One-liner:** Jij bepaalt hoe lang je collega nadenkt voordat hij antwoordt, en in Claude Code kun je hem tegen meerprijs ook sneller laten typen.
- **Metafoor:** direct antwoorden of eerst nadenken. Effort is hoeveel tijd hij ervoor neemt. Fast mode is dezelfde collega met de turbo aan.
- **Kernfeiten:**
  - In de Claude-app kies je naast het model een **effort**: Low, Medium, High, Extra high of Max. Hoger is grondiger, maar trager, en je limiet raakt sneller op. ([support](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings))
  - **Thinking** (zijn denkstappen, uitklapbaar zichtbaar) staat los van effort. Bij Haiku 5.5, Sonnet 5.5, Opus 5.5, Fable 5.1 en Opus 5 kan het niet uit. Deze modellen denken "adaptief": ze bepalen zelf hoeveel, gestuurd door effort. ([zelfde bron](https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings), [models overview](https://platform.claude.com/docs/en/about-claude/models/overview))
  - Fable 5.1 staat standaard op Medium in de app en op High in Claude Code. ([aankondiging](https://www.anthropic.com/claude-fable-and-mythos-5-1))
  - In Claude Code: `/effort` met low tot xhigh, max of auto (auto = Claude kiest per vraag). ([commands](https://code.claude.com/docs/en/commands))
  - **Fast mode** (alleen Claude Code): Opus tot 2,5× sneller, zelfde kwaliteit, hogere prijs. Wordt betaald uit usage credits, niet uit je abonnement; bij Team en Enterprise moet een Owner het eerst aanzetten. Nog in research preview. ([fast mode](https://code.claude.com/docs/en/fast-mode))
- **Echt:** in *Project Fetch* programmeerden collega's van Anthropic zonder robotica-ervaring een robothond. Zeven maanden later deed Opus 4.7, met effort op max in Claude Code, dezelfde taken in 9,5 minuut; het snelste mensenteam had 181 minuten nodig. ([fase 2](https://www.anthropic.com/research/project-fetch-phase-two))
- **Numafa (service):** "Vertaal deze klantmail naar het Duits" → Low, binnen seconden klaar. "Waarom slaat de pomp na 20 minuten af? Hier zijn de logs en het schema" → High of Extra high → onderbouwde hypotheses plus een meetplan.
- **Thuis:** Low: "Hoeveel gram is 3 cups bloem?" High: "Plan een moestuin met wisselteelt voor vier jaar."
- **Visual:** een effort-schuif. Hoe verder naar rechts, hoe meer denkstapjes er in een wolkje verschijnen voordat het antwoord komt; een klok en een tankmeter lopen mee. Fast-mode-knop: de lopende band gaat sneller, de euroteller ook.

### 1.4 Context window

- **One-liner:** Het werkgeheugen van één gesprek. Alles wat erin zit ziet Claude, maar hoe voller het is, hoe slechter hij dingen terugvindt.
- **Metafoor:** zijn bureau. Wat erop ligt ziet hij; ligt het te vol, dan raakt hij het overzicht kwijt.
- **Kernfeiten:**
  - In de Claude-app: 1 miljoen tokens voor Fable 5.1, Opus 5.5, Opus 5, Sonnet 5.5, Sonnet 5 en Haiku 5.5; oudere modellen 500.000 of 200.000. ([support](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans)) 1 miljoen tokens is ongeveer 555.000 woorden. ([models overview](https://platform.claude.com/docs/en/about-claude/models/overview))
  - Raakt het vol, dan vat Claude oudere berichten automatisch samen (code execution moet aan staan). Dat kost wel extra van je limiet.
  - **Context rot:** *"as the number of tokens in the context window increases, the model's ability to accurately recall information from that context decreases."* Context is een *"finite resource with diminishing marginal returns"*. ([Anthropic engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents))
  - Claude Code: `/context` laat het bureau zien als gekleurd raster, `/compact` ruimt op door samen te vatten. ([commands](https://code.claude.com/docs/en/commands))
- **Echt:** toen Claude Pokémon speelde, ging dat langer dan in één context past. Hij hield zelf notities bij: kaarten van verkende gebieden, behaalde mijlpalen, welke aanvallen tegen welke tegenstander werkten. Daar had niemand om gevraagd. ([context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [Claude 4](https://www.anthropic.com/news/claude-4))
- **Numafa (engineering):** machinehandleiding van 300 pagina's plus een vraag erin → Claude zoekt het juiste hoofdstuk → antwoord met paginanummer. Tip erbij: nieuw onderwerp is een nieuwe chat.
- **Thuis:** na een lange vakantieplan-chat wordt Claude vergeetachtig → vraag om een samenvatting en begin daarmee een nieuwe chat.
- **Visual:** *Het bureau dat volloopt.* Papiertjes vallen op het bureau en een vulmeter stijgt. Rond 80% schuift de onderste stapel in een map "samenvatting". De oudste papiertjes vervagen (context rot). Knop "Nieuwe chat": schoon bureau.

### 1.5 Claude chat vs Claude Code

- **One-liner:** In de chat denkt Claude met je mee en levert hij bestanden op; in Claude Code krijgt hij een eigen werkplek en voert hij zelf uit.
- **Metafoor:** meedenken aan jouw bureau, of een eigen werkplek met gereedschap waar hij zelf aan de slag gaat.
- **Kernfeiten:**
  - De Claude-app: gesprekken, documenten, spreadsheets en presentaties maken, op het web zoeken, gekoppelde apps gebruiken, en sinds september ook langere taken. ([support](https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude))
  - Claude Code: *"an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools"*. Werkt in een projectmap (repository), voert commando's uit, test en maakt commits. ([overview](https://code.claude.com/docs/en/overview))
  - Vaste afspraken per project staan in een `CLAUDE.md`-bestand dat hij elke sessie leest.
  - Waar het draait staat in 3.1. Kort: terminal, desktop-app, browser en telefoon.
- **Echt:** Mark Pike, jurist bij Anthropic, bouwt tools met Claude Code: *"I'm not the one coding. I'm just very good at troubleshooting."* ([How Anthropic uses Claude in Legal](https://claude.com/blog/how-anthropic-uses-claude-legal))
- **Echt:** Austin Lau van growth marketing, geen programmeur, bouwde in drie kwartier tot een uur een Figma-plugin die hem nu ±30 minuten per batch advertenties scheelt. ([How Anthropic uses Claude in Marketing](https://claude.com/blog/how-anthropic-uses-claude-marketing))
- **Numafa:** Chat: foto's en aantekeningen van een filterwissel erin → werkinstructie als Word-document eruit. Code: "Bouw een tool die onze wekelijkse ERP-export omzet naar een besteladvies" → werkend script plus uitleg, getest.
- **Thuis:** Chat: brief aan de VvE. Code: website voor de voetbalclub.
- **Visual:** splitscreen. Links een chatbel → advies plus bestand. Rechts een werkplek: map gaat open, commando loopt, test rood, Claude past aan, test groen, vinkje.

### 1.6 Alle bouwstenen op een rij

- **One-liner:** Negen bouwstenen, één vraag: wanneer weet Claude het?
- **Metafoor:** het hele inwerktraject op één A4: inwerkgesprek, notitieboekje, projectmap, werkinstructies, gereedschapskist, toegangspas, opgeleverd werk en agenda.
- **Kernfeiten:** de tabel uit de opdracht, gecontroleerd en aangescherpt. Wijzigingen ten opzichte van jouw versie zijn **vet**.

| Bouwsteen | Wanneer geladen | Waarvoor |
|---|---|---|
| Voorkeuren (Settings > *Instructions for Claude*) | Altijd, in elke chat | Stijl: "kort", "Nederlands" |
| **Organisatie-instructies (Team/Enterprise)** | **Altijd, voor iedereen in de organisatie; winnen bij conflict** | **Huisregels van het bedrijf** |
| Geheugen | **Altijd beschikbaar; Claude slaat losse onderwerpen op die je kunt bekijken en wissen** (*laadmoment te checken*) | Feiten over jou die Claude onthoudt |
| Projectinstructies | Altijd, binnen dat project | Rol, regels, wie-doet-wat |
| Projectkennis | Binnen het project; bij veel stof doorzocht, **tot 10× meer capaciteit** | Naslag: handleidingen, lijsten |
| Skills | Alleen als de taak matcht **(op basis van de beschrijving)** | Werkwijze per taak, met template |
| Plugins | Zoals skills **en connectors** | Bundel van skills, connectors, **commando's en agents** voor een rol of team |
| Connectors | Als een taak de app nodig heeft | Toegang tot Outlook, Drive, Teams |
| Artifacts | Blijven los bestaan, **privé tot je deelt** | Output die je bewaart, deelt of bijwerkt |
| Geplande taken | Op een tijdstip, zonder jou, **in de cloud** | "Elke maandag de nabellijst" |

  Bronnen: [personalisatie](https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features), [organisatie-instructies](https://support.claude.com/en/articles/14546867-set-organization-instructions), [memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context), [projects/RAG](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects), [skills](https://support.claude.com/en/articles/12512180-use-skills-in-claude), [plugins](https://claude.com/docs/plugins/overview), [artifacts](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them), [geplande taken](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork).
- **Echt:** de juristen van Anthropic combineren bouwstenen: een skill met hun beoordelingskader, een koppeling (MCP) naar een Drive-map met eerdere analyses, en Slack als ingang. Marketingteksten zijn nu binnen 24 uur beoordeeld in plaats van na twee tot drie dagen. ([Legal](https://claude.com/blog/how-anthropic-uses-claude-legal))
- **Numafa (service):** de "servicecollega" in vijf stenen: voorkeur (kort, Nederlands), project *Service* met handleidingen, skill *servicerapport*, Outlook-connector, en een geplande taak op maandag voor de open tickets.
- **Visual:** interactieve tabel plus een tijdlijn van één werkdag. Bij het openen lichten voorkeuren en geheugen op; project open: de map licht op; "maak rapport": een skill schuift uit de kast; mail nodig: het pasje piept; resultaat: het artifact blijft liggen; maandag 09:00: de klok. Klik je op een rij, dan licht het moment in de tijdlijn op.

---

## Niveau 2: Claude inrichten

### 2.1 Voorkeuren en stijl

- **One-liner:** Vertel één keer wie je bent en hoe je het wilt hebben; Claude houdt zich er in elke chat aan.
- **Metafoor:** het inwerkgesprek op dag één: "Ik ben Sanne van inkoop, hou het kort en zakelijk."
- **Kernfeiten:**
  - Settings > General > *Instructions for Claude* geldt voor elk gesprek. ([support](https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features))
  - Team en Enterprise: de Owner kan **organisatie-instructies** zetten. Bij een conflict wint de organisatie: staat daar "Always respond in formal English" en bij jou "casual", dan wordt het formeel. ([support](https://support.claude.com/en/articles/14546867-set-organization-instructions))
  - Weergave: licht, donker of systeem, en een dyslexievriendelijk lettertype. ([support](https://support.claude.com/en/articles/8887527-customizing-your-appearance-settings))
  - Het oude menu "Stijlen" is volgens Claude Academy uitgefaseerd; een vaste schrijfstijl regel je nu met instructies of een skill (*te checken*). In Claude Code bestaan "output styles" (Concise, Explanatory, Learning, Proactive). ([output styles](https://code.claude.com/docs/en/output-styles))
- **Echt:** het voorbeeld hierboven (formeel Engels wint van casual) komt uit de officiële handleiding voor organisatie-instructies.
- **Numafa (magazijn):** "Ik werk bij Numafa, machinebouw, afdeling magazijn. Antwoord in het Nederlands, kort, met opsommingen, metrische eenheden, datums als dd-mm-jjjj" → vanaf nu is elk antwoord zo.
- **Thuis:** "Ik kook vegetarisch voor vier personen" → recepten komen voortaan al omgerekend.
- **Visual:** voorkeur-chips aanklikken ("kort", "Nederlands", "opsomming", "jij-vorm") en hetzelfde antwoord herschikt zich live.

### 2.2 Instructies

- **One-liner:** Een goede instructie is een goede briefing: rol, doel, context, vorm en liefst een voorbeeld.
- **Metafoor:** de briefing aan de nieuwe collega. Anthropic's gouden regel: laat je prompt lezen door een collega die niets van de klus weet. Snapt die het niet, dan Claude ook niet.
- **Kernfeiten:**
  - Gouden regel: *"Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too."* ([prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices))
  - Projectinstructies gelden voor elke chat in dat project. Advies: daar algemene dingen zetten (rol, regels) en taakspecifieke dingen in de chat zelf. ([support](https://support.claude.com/en/articles/9517075-what-are-projects))
  - In Claude Code heten vaste instructies `CLAUDE.md`; houd die onder ±200 regels, langer werkt slechter. ([memory](https://code.claude.com/docs/en/memory))
- **Echt:** Anthropic in een stuk voor bedrijven: *"Think of Claude as an intern on their first day of the job: provide clear, explicit instructions with all the necessary detail."* ([Anthropic](https://www.anthropic.com/news/prompt-engineering-for-business-performance))
- **Numafa (inkoop):** vaag: "Maak een mail naar de leverancier." Precies: "Je bent inkoper bij Numafa. Schrijf leverancier X, vriendelijk maar zakelijk, dat de levering van week 42 te laat is. Vraag vóór vrijdag een nieuwe datum. Maximaal 120 woorden." → bruikbare mail in één keer.
- **Thuis:** "Plan een weekend Antwerpen" tegenover hetzelfde met budget, wie er meegaat en "geen musea".
- **Visual:** vijf blokjes (Rol, Doel, Context, Vorm, Voorbeeld) sleep je in een prompt. Bij elk blokje verdwijnt een vraagteken boven het hoofd van de collega en wordt het voorbeeldantwoord scherper.

### 2.3 Projects

- **One-liner:** Een projectmap met vaste instructies en documenten, zodat je niet elke chat opnieuw hoeft te briefen.
- **Metafoor:** de projectmap. Instructies op de binnenkant van de kaft, naslag erin. Chats in de map delen de map, maar niet elkaars gesprekken.
- **Kernfeiten:**
  - Wat je in de projectkennis zet, gebruikt Claude in alle chats van dat project. Chats delen verder geen context. ([support](https://support.claude.com/en/articles/9517075-what-are-projects))
  - Is er veel stof, dan gaat Claude zelf zoeken in plaats van alles te lezen (RAG), tot 10× meer capaciteit. Gaat automatisch, op betaalde abonnementen. Tip: geef bestanden duidelijke namen. ([support](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects))
  - Free: maximaal 5 projects. Elk project heeft een eigen geheugen. Een nieuwe versie van projects is in bèta. (zelfde bronnen, [memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context))
- **Echt:** Claude Academy laat zien hoe een juridisch team zijn NDA-playbook, sjablonen en termenlijsten één keer in een project zet; daarna toetst elke chat in dat project nieuwe NDA's aan dezelfde standaard. ([Academy](https://academy.claude.com/use-cases/organize-your-legal-workflows-using-projects))
- **Echt (2024):** bij de lancering van Projects vertelde adviesbureau North Highland dat Claude hun schrijf- en analysewerk tot 5× sneller maakt. Let op: dat citaat gaat over Claude in het algemeen, niet specifiek over Projects. ([Anthropic](https://www.anthropic.com/news/projects))
- **Numafa (service):** project *Machinetype X* met handleiding, storingscodelijst en onderdelenlijst, plus de instructie "antwoord als ervaren servicemonteur en noem altijd het artikelnummer" → vraag "Foutcode E-217, wat nu?" → stappenplan met onderdeel.
- **Thuis:** project *Verbouwing* met offertes en plattegrond.
- **Visual:** de map klapt open: links de instructiekaart, rechts documenten, chats als tabbladen. Een chat buiten de map blijft grijs. Bij een volle map gaat een zaklamp alleen over de relevante pagina's (RAG).

### 2.4 Memory

- **One-liner:** Claude onthoudt dingen over jou en je werk tussen gesprekken door, en jij kunt meelezen, aanpassen en schrappen.
- **Metafoor:** zijn notitieboekje.
- **Kernfeiten** ([support](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)):
  - Claude bewaart tijdens het chatten losse onderwerpen: je rol, projecten, voorkeuren.
  - Settings > Memory: lezen, bewerken, verwijderen. Of in de chat: "onthoud dat …" of "vergeet …".
  - Incognito (spookje) wordt niet onthouden. Per chat kun je memory uitzetten. Elk project heeft een eigen geheugen.
  - Gevoelige onderwerpen (gezondheid, religie, politiek …) slaat Claude standaard niet op.
  - Een gesprek verwijderen wist niet de notities die eruit kwamen; die verwijder je apart.
  - Free, Pro en Max: standaard aan. Team en Enterprise: de Owner zet het aan, daarna kies je zelf.
- **Echt:** in Claude Code houdt Claude een eigen `MEMORY.md` bij met wat hij leert (bouwcommando's, valkuilen). De eerste 200 regels leest hij elke sessie; details staan in aparte bestanden die hij pakt als het nodig is. ([memory](https://code.claude.com/docs/en/memory))
- **Numafa (magazijn):** één keer gezegd: "Ik beheer de reserveonderdelen voor de wasstraten" → een week later "maak een bestellijst" → Claude weet al voor welke afdeling.
- **Thuis:** "Ik heb een notenallergie" wordt standaard **niet** onthouden (gezondheid telt als gevoelig), tenzij je dat zelf aanzet. Mooi quizmoment.
- **Visual:** een notitieboekje. Tijdens de chat schrijft een pen een regel. Een nieuwe chat opent het boekje op die pagina. Jij streept een regel door. In spookjesmodus blijft de pen liggen.

### 2.5 Skills

- **One-liner:** Werkinstructies met sjablonen die Claude zelf uit de kast pakt als de klus erom vraagt.
- **Metafoor:** de kast met werkinstructies. Hij ziet alleen de labels; een map gaat pas open als de klus erom vraagt.
- **Kernfeiten** ([support](https://support.claude.com/en/articles/12512180-use-skills-in-claude)):
  - Een skill is een map met instructies en bestanden. Aan de beschrijving ziet Claude wanneer hij hem nodig heeft.
  - Op alle abonnementen (code execution moet aan). Ingebouwd: Excel, Word, PowerPoint en PDF.
  - Eigen skill: als ZIP uploaden via Customize > Skills. Team en Enterprise: delen, bedrijfsbibliotheek, of door de Owner voor iedereen klaargezet.
  - Skills werken ook in Claude for Excel, Word, PowerPoint en Outlook. ([M365](https://claude.com/docs/office-agents/work-across-apps))
- **Echt:** Rakuten gebruikt skills voor management accounting: *"What once took a day, we can now accomplish in an hour."* ([Introducing Agent Skills](https://www.anthropic.com/news/skills))
- **Numafa (service):** skill *Servicerapport Numafa* met sjabloon, vaste kopjes en toon → elke monteur zegt "maak een rapport van deze aantekeningen" → rapport in de huisstijl, steeds hetzelfde opgebouwd.
- **Thuis:** skill "boodschappenlijst in de volgorde van mijn supermarkt".
- **Visual:** een kast met gelabelde mappen. Er komt een taakkaartje binnen, één label licht op, die map schuift naar buiten en het sjabloon vult zich. De andere mappen blijven dicht en nemen geen bureauruimte in (link naar 1.4).

### 2.6 Artifacts

- **One-liner:** Werk dat Claude oplevert en dat blijft liggen: document, presentatie, dashboard of mini-app, om te bewaren, te delen en bij te werken.
- **Metafoor:** opgeleverd werk dat op je bureau blijft liggen, los van het gesprek.
- **Kernfeiten** ([support](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them)):
  - *"Anything Claude makes for you that you'd put in front of someone."*
  - Soorten: Docs, Slides, Design, websites en tools; Dashboards (bèta, niet op Free); Motion (bèta, Team en Enterprise, export als MP4).
  - Begint privé; jij bepaalt met wie je deelt.
  - Een artifact kan zelf Claude aanroepen (een mini-app). Wie hem gebruikt, gebruikt zijn eigen abonnement.
  - Kan gegevens bewaren: persoonlijk of gedeeld, maximaal 20 MB. Check dit voordat je iets gevoeligs invult.
  - Op alle abonnementen.
- **Echt:** producer Rick Rubin bracht *The Way of Code* uit: 81 korte teksten, elk met een interactief artifact dat je met Claude kunt ombouwen. ([Anthropic](https://www.anthropic.com/news/build-artifacts))
- **Numafa (productie):** "Maak een checklist-app voor de eindcontrole van machine X, met afvinken en een opmerkingenveld" → klikbare checklist die je deelt met het team.
- **Thuis:** een verjaardagsquiz of huishoudbudget-app.
- **Visual:** chatberichten scrollen weg, maar het artifact klikt vast aan de zijkant. Versie 1 en versie 2 stapelen zich als kaartjes. Deelknop met slotje.

### 2.7 Ontwerpen in Claude

- **One-liner:** Met Claude Design maak je ontwerpen, klikbare prototypes, slides en one-pagers in je eigen huisstijl, gewoon door te praten.
- **Metafoor:** de nieuwe collega kan ook schetsen, en kent het huisstijlhandboek uit zijn hoofd.
- **Kernfeiten:**
  - Claude Design (Anthropic Labs) kwam uit op 17 april 2026. Sinds 16 september werkt het in elk gesprek, naast Slides en Docs. ([aankondiging](https://www.anthropic.com/news/claude-design-anthropic-labs), [release notes](https://support.claude.com/en/articles/12138966-release-notes))
  - Uit huisstijlbestanden, presentaties of code maakt Claude een design system (kleuren, lettertypen, componenten). Dat past hij daarna automatisch toe, en hij controleert zijn eigen ontwerp ertegen.
  - Bijsturen gaat via de chat, met opmerkingen, door zelf te verschuiven, of met schuifjes die Claude voor je maakt. Exporteren als PNG of PDF. Doorgeven aan Claude Code kan met `/design`. ([commands](https://code.claude.com/docs/en/commands))
- **Echt:** bij Brilliant kostten hun ingewikkeldste pagina's in andere tools meer dan 20 prompts, in Claude Design 2. Bij Datadog werd een week aan revisierondes één gesprek. ([aankondiging](https://www.anthropic.com/news/claude-design-anthropic-labs))
- **Numafa (verkoop):** productinfo en huisstijl erin → "one-pager over onze nieuwe reinigingsmodule voor de beurs" → printklare one-pager plus een variant voor LinkedIn. **Numafa (engineering):** een mockup van een bedieningsscherm (HMI) om met de klant te bespreken.
- **Thuis:** uitnodiging voor een verjaardag.
- **Visual:** een ruwe schets. Het kleurpalet vloeit erin (huisstijl) en de schets wordt een klikbaar prototype. Met het schuifje "ruimte" verandert de lay-out live.

### 2.8 Langere taken laten doorlopen

- **One-liner:** Geef Claude een grotere klus mee; hij werkt door in de cloud, ook als jouw laptop dichtgaat.
- **Metafoor:** de collega die doorwerkt als jij naar huis gaat, en je appt als hij iets nodig heeft.
- **Kernfeiten** ([support](https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude)):
  - *"More involved tasks keep running in the cloud even if you close your laptop or leave the page."*
  - Taken met bestanden of apps op je eigen computer hebben Claude Desktop nodig, en die moet open blijven.
  - Instelling in het berichtvak: **Auto** (Claude werkt door, met automatische veiligheidscontroles) of **Manual** (de standaard: hij vraagt per actie toestemming). Je kunt altijd stoppen of bijsturen.
  - Volgen en vragen beantwoorden kan op je telefoon. Het resultaat wacht in het gesprek.
  - Grote taken gaan harder van je limiet af dan een snelle vraag.
- **Echt:** Ramp liet Fable 5.1 38 uur onbeheerd werken. Hij ontdekte dat een eerder resultaat op een labelfout berustte, corrigeerde dat en draaide 's nachts zes experimenten tegelijk. ([aankondiging](https://www.anthropic.com/claude-fable-and-mythos-5-1))
- **Numafa (inkoop):** vrijdag 16:00: "Zoek voor deze 25 onderdelen alternatieve leveranciers in de EU, vergelijk levertijd en certificering, zet het in Excel" → maandag ligt er een spreadsheet met een samenvatting.
- **Thuis:** "Vergelijk tien campings in de Ardennen op prijs, honden welkom en zwembad."
- **Visual:** een voortgangsbalk. De laptop klapt dicht (maantje), het wolkje werkt door. De telefoon trilt: "Mag ik deze site gebruiken?" Met de schakelaar Auto/Manual zie je wel of geen pauzes.

### 2.9 Connectors: mail en agenda laten lezen

- **One-liner:** Geef Claude een toegangspas tot je mail en agenda, zodat hij kan zoeken, samenvatten en concepten klaarzetten.
- **Metafoor:** de toegangspas. Welke deuren opengaan bepaal jij, samen met IT.
- **Kernfeiten:**
  - **Route 1, de Microsoft 365-connector in Claude** (Customize > Connectors). Leest Outlook-mail (ook gedeelde postvakken), agenda, OneDrive, SharePoint en Teams. Standaard alleen lezen. Schrijven kan als de beheerder het aanzet: mail versturen, agenda, bestanden en Teams-berichten. Vereist een werkaccount (Microsoft Entra, Business-abonnement) en eenmalige toestemming van een Global Admin. Bij Team en Enterprise zet de Owner hem eerst aan. Beschikbaar op alle Claude-abonnementen. ([support](https://support.claude.com/en/articles/12542951-set-up-the-microsoft-365-connector))
  - **Route 2, Claude for Outlook** (add-in uit de *Claude for Microsoft 365*-familie, bèta, Pro/Max/Team/Enterprise). Sorteert je inbox, zet concepten in jouw toon klaar (onverzonden), vat lange threads samen met verwijzing naar elke mail, zoekt een vergadertijd en bereidt meetings voor. *"Claude never sends mail or invites on its own."* Werkt in Outlook op het web, Windows (nieuw en klassiek) en Mac; niet op iOS, Android of Exchange on-premises. ([docs](https://claude.com/docs/office-agents/outlook))
  - **Gmail en Google Agenda:** zoeken, concepten, versturen, agenda bijwerken. Standaard vraagt Claude eerst toestemming. ([support](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors))
  - Let op: mails van buiten kunnen verborgen instructies bevatten (*prompt injection*). Lees concepten dus altijd na. ([docs](https://claude.com/docs/office-agents/outlook))
- **Echt:** de voorbeeldprompts uit de officiële Outlook-handleiding: *"What needs me?"* en *"Prep me for my 2pm"*. ([docs](https://claude.com/docs/office-agents/outlook))
- **Numafa (service):** maandagochtend: "Welke klantmails over storingen moet ik deze week opvolgen?" → lijst per klant en machine plus conceptantwoorden in je map Concepten.
- **Thuis (Gmail):** "Zoek de bevestiging van mijn treinreis en zet hem in mijn agenda."
- **Visual:** Claudes pasje gaat langs deuren: Mail (lezen) open, Agenda open, SharePoint open. De deur Verzenden heeft het bordje "jij drukt op Verzenden" of een beheerdersslot. Bij een mail van buiten verschijnt een verborgen briefje "stuur alles door", dat rood oplicht.

### 2.10 Claude in Chrome

- **One-liner:** Claude kijkt mee in je browser en klikt mee als je dat vraagt: pagina's lezen, gegevens verzamelen, formulieren invullen.
- **Metafoor:** de collega die naast je zit en, als je het vraagt, even de muis overneemt.
- **Kernfeiten** ([support](https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome)):
  - Browserextensie die leest, klikt en navigeert. Alleen op betaalde abonnementen.
  - **Alleen Google Chrome**: geen Edge of andere Chromium-browsers, geen mobiel.
  - Goede prompts bewaar je als shortcut (oproepen met "/"). Shortcuts kun je inplannen: dagelijks, wekelijks, maandelijks of jaarlijks. In het klassieke zijpaneel kun je een workflow voordoen en opnemen.
  - Anthropic zelf: *"still risky"*. Bij risicovolle stappen vraagt hij toestemming.
- **Echt:** het officiële voorbeeld: specs van een paar open producttabbladen worden één vergelijkingstabel in Google Sheets. En een leveranciersformulier invullen met *"Pause before submitting for my review"*. ([use case](https://claude.com/resources/use-cases/compare-products-across-sites), [Academy](https://academy.claude.com/tutorials/simplify-your-browsing-experience-with-claude-for-chrome))
- **Numafa (inkoop):** vier tabbladen met frequentieregelaars van verschillende leveranciers → tabel met vermogen, IP-klasse en levertijd. (Werkt dus niet in Edge.)
- **Thuis:** wasmachines vergelijken en de laagste prijs zoeken.
- **Visual:** een nagemaakte browser. De cursor loopt de tabbladen langs en specs vliegen naar een tabel. Bij de knop Verzenden verschijnt een stopbord: "Even checken?"

### 2.11 Geplande taken

- **One-liner:** Laat Claude een terugkerende klus op een vast moment doen, zonder dat jij erbij hoeft te zijn.
- **Metafoor:** een vaste afspraak in zijn agenda.
- **Kernfeiten** ([support](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)):
  - Op alle betaalde abonnementen.
  - Aanmaken door het te beschrijven ("Elke maandag om 9:00 …") of handmatig. Frequentie: elk uur, dagelijks, wekelijks, op werkdagen of alleen handmatig.
  - Draait in de cloud, dus ook als je computer slaapt. Een taak die lokale bestanden nodig heeft, draait lokaal.
  - Op de pagina Scheduled: pauzeren, nu uitvoeren, eerdere runs bekijken.
  - In Claude Code: `/schedule` (in de cloud) en `/loop` (zolang de sessie openstaat), zie 3.7.
- **Echt:** het officiële voorbeeld: *"Every Monday at 9 AM, summarize last week's messages in my team's Slack channels."* ([support](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork))
- **Numafa (magazijn):** "Elke maandag om 7:30: lees de voorraadexport op SharePoint, markeer artikelen onder de minimumvoorraad en mail de nabellijst naar inkoop" → de lijst staat in je inbox bij de koffie. (Vereist de M365-connector.)
- **Thuis:** elke vrijdag een weekmenu met boodschappenlijst.
- **Visual:** een weekagenda. Maandag 09:00 licht op, de laptop slaapt (maantje), het wolkje werkt en een rapport valt in de inbox. Met de pauzeknop wordt het blok grijs.

---

## Niveau 3: Bouwen met Claude

### 3.1 Claude Code: wat het is en waar het draait

- **One-liner:** Claude Code geeft je collega een eigen werkplek waar hij bestanden leest, commando's uitvoert, test en bouwt, in de terminal, de desktop-app, de browser of via je telefoon.
- **Metafoor:** hij krijgt een eigen werkplek en voert zelf uit.
- **Kernfeiten** ([overview](https://code.claude.com/docs/en/overview)):
  - **Terminal:** het volledige gereedschap op je eigen computer. Op Numafa-pc's dus niet (terminal en scripts zijn verboden).
  - **Desktop-app:** tabblad *Code* in de Claude-app (macOS, Windows), betaald abonnement. Kan lokaal of in de cloud werken.
  - **Web:** claude.ai/code. *"Run Claude Code in your browser with no local setup."* **Het draait in de cloud van Anthropic, op een eigen virtuele machine. Je hebt geen terminal op je eigen pc nodig**, en het werkt door als je laptop dicht is. Beschikbaar op Pro, Max, Team en Enterprise (premium-plekken). Wel nodig: GitHub. Voor een nieuw project maak je een lege repository aan. ([cloud](https://code.claude.com/docs/en/claude-code-on-the-web), [web quickstart](https://code.claude.com/docs/en/web-quickstart))
  - **Mobiel:** tabblad *Code* in de Claude-app (iOS en Android). Daar start, volg en stuur je cloudsessies; de code zelf draait niet op je telefoon. ([mobile](https://code.claude.com/docs/en/mobile))
  - **Anders dan chat:** werkt in een repository, voert commando's uit, maakt commits en pull requests, leest `CLAUDE.md`, kan hulpjes inschakelen en terugspoelen.
- **Echt:** bij Anthropic schrijven mensen van finance zonder programmeerervaring hun werkstappen in gewone tekst ("haal dit dashboard op, draai deze queries, maak er een Excel van"), waarna Claude Code de hele workflow uitvoert. ([How Anthropic teams use Claude Code](https://www.anthropic.com/news/how-anthropic-teams-use-claude-code))
- **Numafa (engineering, via claude.ai/code):** "Maak een tool die van onze stuklijst-export (CSV) een besteladvies per leverancier maakt" → werkend script plus handleiding in een GitHub-repository, gebouwd en getest in de cloud. De kantoor-pc hoeft niets te installeren.
- **Thuis:** een website voor de voetbalclub.
- **Visual:** vier stekkers (terminal, desktop, web, mobiel) op één motor. Klik op *web*: een wolk verschijnt met het label "jouw pc: niets installeren". Daarna dezelfde werkplek-animatie als in 1.5.

### 3.2 Handige commando's

- **One-liner:** Met een slash (/) stuur je Claude Code bij: model kiezen, bureau opruimen, gereedschap toevoegen.
- **Metafoor:** de knoppen op het bedieningspaneel.
- **Kernfeiten:** alle commando's hieronder staan op [code.claude.com/docs/en/commands](https://code.claude.com/docs/en/commands). Een commando werkt alleen aan het begin van je bericht. Typ `/` voor het menu. Niet elk commando is overal beschikbaar: in cloudsessies werken o.a. `/clear`, `/plugin` en `/resume` niet, en `/model` krijgt daar een argument (bijv. `/model sonnet`). ([cloud](https://code.claude.com/docs/en/claude-code-on-the-web))

| Commando | Wat het doet | Metafoor | Wanneer gebruiken |
|---|---|---|---|
| `/init` | Maakt een eerste `CLAUDE.md` voor je project | De inwerkmap aanleggen | De eerste keer in een project |
| `/memory` | `CLAUDE.md` bewerken; auto memory aan/uit en bekijken | Het notitieboekje openslaan | Als hij iets steeds vergeet |
| `/model` | Ander model kiezen | Een andere collega erbij halen | Zwaar of juist licht werk |
| `/effort` | Denkniveau: low tot xhigh, max of auto | Hoe lang hij nadenkt | Lastige of juist simpele klus |
| `/context` | Gekleurd raster van wat het werkgeheugen vult | Foto van zijn bureau | Als hij traag of vergeetachtig wordt |
| `/compact` | Gesprek samenvatten om ruimte te maken | Bureau opruimen, stapel in een map | Lang gesprek, zelfde klus |
| `/clear` | Nieuw gesprek met lege context | Schoon bureau | Nieuwe klus |
| `/resume` | Eerder gesprek hervatten | Dossier uit de la | Verder waar je gebleven was |
| `/btw` | Zijvraag die niet in het gesprek komt | Even tussendoor vragen | Snelle vraag terwijl hij werkt |
| `/mcp` | MCP-verbindingen beheren en inloggen | De stekkerdoos | App koppelen of opnieuw verbinden |
| `/skills` | Lijst van skills, zichtbaarheid aanpassen | De kast met werkinstructies | Welke skills heb ik? |
| `/plugin` | Plugins zoeken, installeren en beheren | Gereedschapskist uitpakken | Nieuwe mogelijkheden toevoegen |
| `/design` | Schermontwerpen en flows als Claude Design-artifact | Het schetsblok | Mockup of scherm uitproberen |
| `/powerup` | Korte interactieve lessen met geanimeerde demo's | Cursusdag | Claude Code leren kennen |
| `/fast` | Fast mode aan of uit (Opus, tegen meerprijs) | Turboknop | Snel heen en weer werken |

- **Echt:** Austin Lau (marketing) maakte zijn eigen commando `/rsa`. Dat vraagt om campagnedata en controleert de advertenties tegen skills voor merkstem en productfeiten. ([Marketing](https://claude.com/blog/how-anthropic-uses-claude-marketing))
- **Numafa:** `/init` in je toolproject, daarna in `CLAUDE.md`: "metrische eenheden, artikelcodes zijn 8 cijfers, nooit de ERP-export overschrijven" → elke sessie begint goed ingewerkt.
- **Visual:** je typt "/", het menu klapt uit, letters filteren mee. Daaronder de tabel, filterbaar met chips: Starten, Bureau, Model en denken, Uitbreiden, Leren.

### 3.3 MCP: hoe het werkt

- **One-liner:** MCP is de standaardstekker waarmee Claude op allerlei apps en systemen aansluit.
- **Metafoor:** de USB-C-stekker die op elke app past.
- **Kernfeiten:**
  - Officieel: *"Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems."* ([modelcontextprotocol.io](https://modelcontextprotocol.io/docs/getting-started/intro), via [zoekresultaat](https://claude.com/blog/what-is-model-context-protocol))
  - Een open standaard, door Anthropic geïntroduceerd op 25 november 2024. ([Anthropic](https://www.anthropic.com/news/model-context-protocol)) Ook ChatGPT, VS Code en anderen ondersteunen hem.
  - Zo werkt het: een MCP-server bij de app biedt *tools* (acties), *resources* (gegevens) en *prompts*. Claude is de client die daarop inplugt. In de Claude-app heten ze **connectors**; in Claude Code beheer je ze met `/mcp`. ([MCP in Claude Code](https://code.claude.com/docs/en/mcp))
  - Zonder standaard heeft elke app voor elke AI een eigen koppeling nodig. Met MCP bouwt een leverancier één server die met alle AI's werkt. ([claude.com](https://claude.com/blog/what-is-model-context-protocol))
  - Koppel alleen servers die je vertrouwt: een server kan acties uitvoeren met jouw rechten.
- **Echt:** met *Blender MCP* bouwt Claude 3D-scènes in Blender op basis van tekst: objecten maken, materialen kiezen, Python uitvoeren. Open source. ([GitHub](https://github.com/ahujasid/blender-mcp))
- **Echt:** de juristen van Anthropic koppelden Claude via MCP aan een Drive-map met eerdere privacyanalyses. ([Legal](https://claude.com/blog/how-anthropic-uses-claude-legal))
- **Numafa (hypothetisch, vereist een MCP-server voor jullie ERP):** "Welke inkooporders voor artikel 1234 staan nog open?" → Claude vraagt het ERP direct → antwoord met ordernummers, zonder exportbestand.
- **Visual:** links een kluwen losse kabels (elke app × elke AI). Rechts één USB-C-stekker die in stopcontacten klikt (Mail, ERP, CAD, Drive), met gegevens die naar Claude stromen. Een teller: "koppelingen nodig: 12 → 7".

### 3.4 Plugins

- **One-liner:** Een plugin is een complete gereedschapskist: skills, connectors, commando's en agents in één keer geïnstalleerd.
- **Metafoor:** de gereedschapskist voor een rol, bijvoorbeeld "de inkoperskist".
- **Kernfeiten:**
  - In de Claude-app: Customize > Plugins (ontdekken, marketplace toevoegen, uploaden). In Claude Code: `/plugin`. ([plugins](https://claude.com/docs/plugins/overview), [Claude Code](https://code.claude.com/docs/en/plugins))
  - Inhoud: skills, MCP-connectors, commando's, agents en hooks.
  - Anthropic controleert plugins in de directory (automatische scan plus een mens bij nieuwe vermeldingen). Plugins via een eigen URL of upload worden niet gecontroleerd, dus alleen van bronnen die je vertrouwt. Bij Team en Enterprise bepaalt de Owner welke bronnen zichtbaar zijn.
- **Echt:** Microsoft bracht een Power Automate-plugin voor Claude Code uit: flows maken, aanpassen, draaien en debuggen vanuit Claude Code. ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/power-automate-plugin-external-tools))
- **Numafa (service):** plugin *Numafa Servicekit* met skill servicerapport, skill storingsanalyse, de M365-connector en het commando `/rapport` → één installatie voor alle monteurs, iedereen werkt hetzelfde.
- **Visual:** een kist gaat open en de onderdelen springen naar hun plek: een map naar de kast, een pasje naar het sleutelbord, een knop naar het paneel, een hulpje naar de werkbank.

### 3.5 Workflows: n8n vs Power Automate vs geplande taken in Claude

- **One-liner:** Een vaste procedure loopt elke keer precies hetzelfde. Soms wil je dat, soms wil je dat Claude zelf nadenkt.
- **Metafoor:** de vaste procedure (rails) tegenover de collega met een agenda die zelf de route kiest.
- **Kernfeiten:**
  - **n8n:** workflowautomatisering met blokjes, zelf te hosten of in hun cloud. Heeft een AI Agent-blok met een Anthropic-model. Sommige uitbreidingen werken alleen als je n8n zelf host. ([n8n AI agents](https://n8n.io/ai-agents/), [voorbeeld](https://n8n.io/workflows/5202-ai-blog-post-journalist-perplexity-for-research-anthropic-claude-for-blog/))
  - **Power Automate:** het Microsoft-ecosysteem. Er is een Anthropic-connector (Premium, eigen API-sleutel, actie "Create a message"). In Copilot Studio kun je Claude als model kiezen; een beheerder moet dat aanzetten, en in de EU staat het standaard uit. ([connector](https://learn.microsoft.com/en-us/connectors/anthropicip/), [Copilot Studio](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/anthropic-joins-the-multi-model-lineup-in-microsoft-copilot-studio/))
  - **Geplande taak in Claude:** geen schema tekenen, gewoon beschrijven. Claude kiest de aanpak: flexibel, maar minder voorspelbaar. ([support](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork))

| | n8n | Power Automate | Geplande taak in Claude |
|---|---|---|---|
| Bouwen | Blokjes verbinden | Blokjes verbinden | In gewone taal |
| Voorspelbaar | Hoog | Hoog | Gemiddeld (Claude beslist) |
| Sterk in | Veel systemen, zelf hosten | Microsoft 365, Teams, SharePoint | Lezen, samenvatten, oordelen |
| Claude erin | Anthropic-model in het AI Agent-blok | Anthropic-connector of Copilot Studio | Is Claude |
| Draait op | Eigen server (VPS) of n8n cloud | Microsoft-cloud | Cloud van Anthropic |

  Vuistregel: vaste stappen, grote aantallen of een audit nodig? Dan een flow. Tekst, oordeel of variatie? Dan Claude. Combineren mag: een flow die op één punt Claude om een oordeel vraagt.
- **Echt:** een n8n-sjabloon waarin Claude blogposts schrijft op basis van onderzoek dat een ander blok verzamelt. ([n8n](https://n8n.io/workflows/5202-ai-blog-post-journalist-perplexity-for-research-anthropic-claude-for-blog/))
- **Numafa (service):** storingsmelding via het webformulier → Power Automate zet een ticket in de lijst → een Claude-stap vat samen en schat de urgentie → Teams-bericht naar de monteur van dienst.
- **Visual:** drie banen naast elkaar, met in elke baan een bolletje "nieuwe melding". In n8n en Power Automate volgt het bolletje vaste rails. In de Claude-baan gaat het eerst langs een denkwolkje en kiest dan zelf een afslag.

### 3.6 VPS: wat het is en wanneer je het nodig hebt

- **One-liner:** Een VPS is een gehuurde virtuele server in een datacenter: een eigen kantoortje dat 24/7 open is.
- **Metafoor:** een eigen kantoortje waar het licht altijd brandt, ook als jij naar huis bent.
- **Kernfeiten:**
  - VPS = *virtual private server*: een afgeschermd stuk van een server bij een hostingbedrijf. Jij beheert het zelf: updates, beveiliging en back-ups.
  - **Wel nodig** als je zelf software 24/7 wilt draaien, zoals n8n of iets dat continu op meldingen wacht. n8n heeft officiële handleidingen voor bijvoorbeeld Hetzner en DigitalOcean. ([n8n Hetzner](https://docs.n8n.io/deploy/host-n8n/install-options/use-a-cloud-provider/deploy-to-hetzner))
  - **Niet nodig** voor Claude-chat, geplande taken in Claude of Claude Code op het web: die draaien al in de cloud van Anthropic. ([support](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork), [cloud](https://code.claude.com/docs/en/claude-code-on-the-web))
  - Betrek altijd IT: een VPS is een extra stuk infrastructuur om te beveiligen.
- **Echt:** de officiële n8n-handleiding *Deploy to Hetzner* (Docker Compose met automatisch HTTPS-certificaat). ([n8n docs](https://docs.n8n.io/deploy/host-n8n/install-options/use-a-cloud-provider/deploy-to-hetzner))
- **Numafa:** n8n op een VPS in de EU haalt elk kwartier nieuwe webshoporders op en zet ze in het ERP. Tegenvoorbeeld: "elke maandag een rapport" heeft geen VPS nodig; dat is een geplande taak.
- **Visual:** een dag-en-nachtcyclus. Jouw laptop gaat uit, het kantoortje blijft verlicht. Daaronder een beslisboom van drie vragen: "Heb ik een VPS nodig?"

### 3.7 Agentic werken

#### 3.7.1 Wat "agentic" betekent

- **One-liner:** Agentic betekent dat Claude zelf plant, uitvoert, zijn werk controleert en in een lus doorgaat tot het af is.
- **Metafoor:** de collega die niet bij elke stap vraagt "en nu?", maar zelf doorpakt, en ook zelf nakijkt.
- **Kernfeiten:**
  - Claude Code *"plans the approach, writes the code across multiple files, and verifies it works"*. ([overview](https://code.claude.com/docs/en/overview))
  - Hoeveel hij zelf mag, regel je met toestemmingen. In de Claude-app is dat Auto of Manual (zie 2.8).
  - Meer zelfstandigheid kost meer tokens, en je moet het resultaat blijven controleren.
- **Echt:** in fase 2 van Project Vend kreeg de winkelende Claude een "CEO-agent", Seymour Cash, als baas. Dat hielp, al moest die CEO af en toe worden afgeremd in zijn spirituele uitweidingen. ([Project Vend 2](https://www.anthropic.com/research/project-vend-2))
- **Numafa (engineering):** "Zorg dat alle 60 werkinstructies het nieuwe sjabloon volgen, en controleer daarna of elk document een veiligheidsparagraaf heeft" → Claude plant, past aan, controleert, herstelt en meldt "60/60".
- **Visual:** een cirkel Plan → Doe → Check. Gaat de check fout, dan terug; is hij goed, dan vinkje. Een teller telt de rondes.

#### 3.7.2 Eerst plannen: /plan

- **One-liner:** Laat Claude eerst een plan maken dat jij goedkeurt, voordat hij iets aanraakt.
- **Metafoor:** werkvoorbereiding: eerst de tekening, dan pas de zaag.
- **Kernfeiten:**
  - `/plan [beschrijving]` zet plan mode aan. Claude leest en onderzoekt, maar wijzigt geen broncode, en legt een plan voor. ([commands](https://code.claude.com/docs/en/commands))
  - Tip uit de docs: *"Plan locally, execute in the cloud."* ([cloud](https://code.claude.com/docs/en/claude-code-on-the-web))
- **Numafa:** `/plan bouw een controle op dubbele artikelnummers in de stuklijst-export` → stappenplan met aannames die jij eerst checkt ("zijn varianten met -A en -B dubbel?").
- **Visual:** een bouwtekening rolt uit en op de bestanden zit een slotje: "nog niets aangeraakt". Knop "Plan goedkeuren": slot open, bouwen.

#### 3.7.3 Doorwerken tot het af is: /goal en /loop

- **One-liner:** Met `/goal` werkt Claude door tot een meetbaar doel gehaald is; met `/loop` herhaalt hij een opdracht op een vast interval.
- **Metafoor:** `/goal` = je bent pas klaar als de keurmeester tekent. `/loop` = elk kwartier een rondje lopen.
- **Kernfeiten:**
  - `/goal [voorwaarde]`: na elke beurt beoordeelt een apart, klein model of de voorwaarde gehaald is. Zo niet, dan volgt een nieuwe beurt. Hij stopt bij "gehaald", "onmogelijk" of een fout die jij moet oplossen. *"Completion is decided by a fresh model rather than the one doing the work."* Eén doel per sessie. Tip: zet er "of stop na 20 beurten" bij. ([goal](https://code.claude.com/docs/en/goal))
  - `/loop [interval] [prompt]`: herhaalt een opdracht zolang de sessie openstaat. Zonder interval kiest Claude zelf het tempo. ([commands](https://code.claude.com/docs/en/commands)) Volgens support kan dat lokaal maximaal 3 dagen. ([support](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork))
- **Echt:** het voorbeeld uit de docs: `/goal all tests in test/auth pass and the lint step is clean`. ([goal](https://code.claude.com/docs/en/goal))
- **Numafa:** `/goal alle 40 artikelcodes in de nieuwe prijslijst komen overeen met de stamdata en het controlescript meldt 0 fouten, of stop na 15 beurten`. En `/loop 10m kijk of de testrun klaar is en vat het resultaat samen`.
- **Visual:** het poppetje werkt een ronde; een keurmeester zet een stempel ✗ met een reden; nog een ronde; uiteindelijk ✓. Voor `/loop` een klok die elke X minuten tikt.

#### 3.7.4 Hulpjes inschakelen: subagents, /subtask, /agents

- **One-liner:** Claude schakelt hulpjes in met een eigen bureau; zij doen een deelklus en brengen alleen de samenvatting terug.
- **Metafoor:** hij schakelt zelf hulpjes in en verdeelt het werk.
- **Kernfeiten** ([subagents](https://code.claude.com/docs/en/sub-agents)):
  - Een subagent heeft een eigen context window, eigen instructies en eigen rechten. Hij doet de zijklus en geeft een samenvatting terug, zodat het hoofdbureau opgeruimd blijft.
  - Ingebouwd: *Explore* (alleen lezen, zoeken) en *Plan* (onderzoek in plan mode). Eigen hulpjes maak je door het Claude te vragen, of als bestand in `.claude/agents/`.
  - `/agents` geeft een geheugensteun hoe je ze maakt en beheert. ([commands](https://code.claude.com/docs/en/commands))
  - `/subtask <taak>` start een hulpje dat het hele gesprek meekrijgt en op de achtergrond werkt; het resultaat komt terug in jouw gesprek. ([commands](https://code.claude.com/docs/en/commands))
  - Meer hulpjes betekent meer verbruik. ([agents](https://code.claude.com/docs/en/agents))
- **Echt:** het growth-marketingteam van Anthropic laat twee gespecialiseerde subagents honderden nieuwe advertentievarianten maken, in minuten in plaats van uren. ([How Anthropic teams use Claude Code](https://www.anthropic.com/news/how-anthropic-teams-use-claude-code))
- **Numafa:** "Zoek uit waarom het controlescript zo traag is" → een Explore-hulpje doorzoekt 200 bestanden → het hoofdgesprek krijgt vijf regels met de oorzaak.
- **Visual:** de collega deelt drie enveloppen uit. Drie hulpjes werken tegelijk aan een eigen minibureau en komen elk terug met één kaartje. De vulmeter van het hoofdbureau blijft laag.

#### 3.7.5 Werk op de achtergrond: /background, /fork, /tasks

- **One-liner:** Laat werk op de achtergrond doorlopen terwijl jij met iets anders verder gaat.
- **Metafoor:** `/background` = hij neemt zijn klus mee naar de achterkamer. `/fork` = hij kopieert zichzelf: één blijft bij jou, de kopie neemt een zijpad. `/tasks` = het takenbord.
- **Kernfeiten** ([commands](https://code.claude.com/docs/en/commands)):
  - `/background [prompt]` maakt van de hele sessie een achtergrondagent en geeft je terminal vrij (alias `/bg`). Volgen doe je met `claude agents`; die weergave is nog research preview. ([agents](https://code.claude.com/docs/en/agents))
  - `/fork [prompt]` kopieert het gesprek naar een nieuwe achtergrondsessie, terwijl jij hier verder werkt. Voor codewijzigingen maakt de kopie een eigen werkkopie.
  - `/tasks` toont al het achtergrondwerk van deze sessie, ook afgeronde hulpjes.
- **Echt:** de docs laten zien hoe je drie cloudsessies tegelijk start (een test repareren, documentatie bijwerken, logger ombouwen) die onafhankelijk van elkaar lopen. ([cloud](https://code.claude.com/docs/en/claude-code-on-the-web))
- **Numafa:** de handleidinggenerator laten ombouwen met `/background`, en ondertussen in een nieuw gesprek een vraag over de prijslijst stellen.
- **Visual:** een sessiekaart schuift naar een baan "achterkamer". Bij fork splitst de kaart in tweeën. Op een takenbord krijgen de kaarten statusbolletjes.

#### 3.7.6 Grote klussen parallel: /batch, /workflows, /deep-research

- **One-liner:** Voor echt grote klussen verdeelt Claude het werk over tientallen hulpjes die tegelijk werken, volgens een plan op papier.
- **Metafoor:** een heel team hulpjes met een werkverdeling.
- **Kernfeiten:**
  - `/batch <instructie>`: onderzoekt de klus, splitst hem in 5 tot 30 onafhankelijke delen en legt het plan voor. Na goedkeuring krijgt elk deel een hulpje in een eigen werkkopie. Vereist een git-repository. ([commands](https://code.claude.com/docs/en/commands))
  - **Dynamic workflows:** Claude schrijft een script dat tientallen tot honderden hulpjes aanstuurt en hun resultaten tegen elkaar controleert. Op alle betaalde abonnementen; op Pro zet je het aan in `/config`. Het kost aanzienlijk meer tokens. ([workflows](https://code.claude.com/docs/en/workflows))
  - `/workflows`: voortgangsscherm met pauzeren, stoppen en opslaan als eigen commando.
  - `/deep-research <vraag>`: een ingebouwde workflow die breed zoekt, bronnen tegen elkaar controleert, per bewering stemt en een rapport met bronnen oplevert. Beweringen die de controle niet doorstaan, vallen eruit.
- **Echt:** de docs noemen een audit over de hele codebase, een migratie van 500 bestanden en onderzoek waarbij bronnen elkaar moeten bevestigen. ([workflows](https://code.claude.com/docs/en/workflows))
- **Numafa:** `/deep-research Wat moeten machinebouwers regelen voor de nieuwe EU-Machineverordening (2023/1230), en wat verandert er ten opzichte van de Machinerichtlijn?` → rapport met bronvermelding voor engineering en kwaliteit.
- **Visual:** een grote taak valt uiteen in twaalf kaartjes en de banen vullen zich tegelijk. Bij deep-research waaieren zaklampen uit, bronnen krijgen ✓ of ✗, en alles komt samen in één rapport.

#### 3.7.7 Tweede mening van een ander model: /advisor

- **One-liner:** Laat Claude op lastige momenten een sterker model om advies vragen.
- **Metafoor:** even binnenlopen bij de senior.
- **Kernfeiten** ([advisor](https://code.claude.com/docs/en/advisor)):
  - `/advisor [model|off]`, experimenteel.
  - Claude bepaalt zelf wanneer: meestal voordat hij een aanpak kiest, bij een fout die steeds terugkomt, of voordat hij "klaar" meldt.
  - De adviseur krijgt het hele gesprek te zien en moet minstens zo sterk zijn als het hoofdmodel.
  - Advies kost extra tokens, maar Sonnet met Opus als adviseur is meestal goedkoper dan alles met Opus doen.
- **Echt:** de docs noemen *"Sonnet main + Opus advisor"* als standaardcombinatie: Sonnet doet het routinewerk en roept Opus in bij planning, onduidelijke fouten en de eindcontrole.
- **Numafa:** Sonnet bouwt de rapportagetool; voordat het datamodel vastligt, vraagt hij Opus om advies.
- **Visual:** het poppetje loopt naar een deur met "Senior" erop, een wolkje advies, en weer terug. Een teller: "advies gevraagd: 2×".

#### 3.7.8 Terug in de tijd: /rewind

- **One-liner:** Ging het mis? Spoel de code, het gesprek of allebei terug naar een eerder punt.
- **Metafoor:** terug in de tijd: ongedaan maken voor het hele werk.
- **Kernfeiten** ([checkpointing](https://code.claude.com/docs/en/checkpointing)):
  - Elke prompt is een checkpoint. Via `/rewind` (of twee keer Esc) kies je: code plus gesprek, alleen het gesprek, alleen de code, of samenvatten vanaf of tot een punt.
  - Wat niet terug kan: wijzigingen die via commando's zijn gedaan (verwijderen, verplaatsen), wijzigingen buiten Claude om en de meeste wijzigingen van hulpjes.
  - Het is geen vervanging voor versiebeheer (git).
- **Numafa:** Claude paste het Excel-exportscript aan en nu klopt de kolomvolgorde niet → `/rewind` naar vóór die prompt → opnieuw, met een betere instructie.
- **Visual:** een tijdlijn met checkpoint-bolletjes. Schuif terug, en code en chatbubbels springen mee terug. Eén bolletje is rood gemarkeerd: "via commando gewist, kan niet terug".

#### 3.7.9 Op schema in de cloud: /schedule

- **One-liner:** Laat een Claude Code-klus op vaste momenten in de cloud draaien, ook als jouw computer uit staat.
- **Metafoor:** een vaste afspraak in zijn agenda, op een kantoor in de cloud.
- **Kernfeiten:**
  - `/schedule [beschrijving]` (alias `/routines`): routines maken, wijzigen of starten. Ze draaien in de cloud. ([commands](https://code.claude.com/docs/en/commands))
  - Routines kunnen ook starten door een API-aanroep of een GitHub-gebeurtenis. ([overview](https://code.claude.com/docs/en/overview))
  - Verschil met `/loop` (alleen zolang de sessie openstaat) en geplande taken in de desktop-app (lokaal, met jouw bestanden).
- **Echt:** voorbeelden uit de docs: PR-reviews elke ochtend, 's nachts mislukte builds analyseren, wekelijks afhankelijkheden controleren. ([overview](https://code.claude.com/docs/en/overview))
- **Numafa:** `/schedule elke werkdag om 6:30: draai het controlescript op de nieuwste stuklijst-export in de repository en meld afwijkingen` → om 7:00 ligt er een lijstje.
- **Visual:** een wolk met een agenda. De laptop staat uit, de routine draait en er komt een resultaatkaartje uit.

#### 3.7.10 Alle agentic commando's op een rij

| Commando | Wat het doet | Metafoor | Wanneer gebruiken |
|---|---|---|---|
| `/plan` | Plan mode: onderzoeken en plan voorleggen, niets wijzigen | Eerst de tekening, dan de zaag | Grotere of risicovolle wijziging |
| `/goal` | Doorwerken tot een voorwaarde gehaald is; een apart model controleert | Pas klaar als de keurmeester tekent | Klus met een meetbaar eindpunt |
| `/loop` | Opdracht herhalen op een interval, zolang de sessie open is | Elk kwartier een rondje lopen | Iets in de gaten houden |
| subagents | Hulpje met eigen context doet een deelklus | Hulpje met eigen bureau | Zoekwerk dat je bureau zou vullen |
| `/subtask` | Hulpje met het hele gesprek, werkt op de achtergrond | Hulpje dat alles al weet | Zijklus terwijl jij doorwerkt |
| `/agents` | Uitleg hoe je eigen hulpjes maakt en beheert | Personeelsbestand | Vast hulpje voor terugkerend werk |
| `/background` | Hele sessie naar de achtergrond | Klus mee naar de achterkamer | Lange klus, terminal vrij |
| `/fork` | Kopie van het gesprek als nieuwe achtergrondsessie | Collega kopieert zichzelf | Twee richtingen tegelijk proberen |
| `/tasks` | Overzicht van achtergrondwerk | Takenbord | Even kijken hoe het ervoor staat |
| `/batch` | Grote wijziging in 5 tot 30 delen, parallel | Werkverdeling voor een ploeg | Dezelfde wijziging op veel plekken |
| `/workflows` | Voortgang van workflows bekijken, pauzeren, opslaan | Het planbord van de ploeg | Grote orkestratie volgen |
| `/deep-research` | Breed zoeken, bronnen controleren, rapport | Onderzoeksteam met bronnenlijst | Vraag die echt uitgezocht moet worden |
| `/advisor` | Sterker model adviseert op beslismomenten | Even naar de senior | Lange klus waar het plan telt |
| `/rewind` | Code en/of gesprek terugzetten | Terug in de tijd | Iets ging mis |
| `/schedule` | Routine op een vast schema in de cloud | Vaste afspraak in de agenda | Terugkerend werk, pc mag uit |

Bron: [commands](https://code.claude.com/docs/en/commands). **Visual:** een filterbare tabel; klik je op een rij, dan speelt het mini-animatietje van die tegel.

### 3.8 Extra: beeld en video met AI

- **One-liner:** Claude schrijft het script en het storyboard; voor fotorealistische beelden en video gebruik je gespecialiseerde tools zoals Higgsfield.
- **Metafoor:** Claude is de regisseur met het draaiboek, de videotool is de cameraploeg.
- **Kernfeiten:**
  - Claude levert tekst als output (plus tekeningen in code, zoals SVG en diagrammen). Fotorealistische beelden maakt hij niet zelf. Wel kan hij geanimeerde uitleg maken (Motion-artifact, bèta, Team en Enterprise). ([models overview](https://platform.claude.com/docs/en/about-claude/models/overview), [artifacts](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them))
  - Higgsfield is een platform voor AI-video en -beeld, gericht op marketing en social media (*details te checken*).
  - Let op: rechten, herkenbare personen en geen misleidende "machinebeelden" die niet bestaan.
- **Numafa (marketing):** Claude schrijft een storyboard van 30 seconden voor LinkedIn over een nieuwe machine → videotool maakt de sfeershots → echte machinebeelden blijven de hoofdrol spelen.
- **Visual:** storyboardkaartjes schuiven in een filmstrook.

### 3.9 Extra: AI-modellen blind vergelijken

- **One-liner:** In een arena stel je één vraag aan twee anonieme modellen en kies je het beste antwoord; pas daarna zie je wie wie was.
- **Metafoor:** een blinde proeverij.
- **Kernfeiten:** het platform heette eerder Chatbot Arena en LMArena en heet volgens meerdere bronnen nu **Arena** (arena.ai) (*naam en adres te checken*). Bezoekers stemmen blind, en uit die stemmen ontstaan ranglijsten.
- **Numafa:** dezelfde prompt voor een werkinstructie testen en kijken welk model het beste Nederlands schrijft. Nooit bedrijfsgevoelige informatie in een publieke arena zetten.
- **Visual:** twee antwoordkaarten A en B; jij stemt; daarna draaien de kaarten om en zie je de namen.

---

## Te checken (niet bevestigd, komt pas in de app na bevestiging)

1. **Stijlen in de Claude-app.** Claude Academy zegt dat het menu "Use style" is uitgefaseerd en dat skills die rol overnemen. Een officieel supportartikel daarover vond ik niet.
2. **Wanneer memory geladen wordt.** De supportpagina zegt niet of de geheugennotities altijd geladen worden of op aanvraag. Daarom heb ik de bouwstenen-tabel voorzichtig geformuleerd. (Voor Claude Code is het wel bevestigd: de eerste 200 regels van `MEMORY.md` altijd, details op aanvraag.)
3. **1M context op Free.** Het supportartikel noemt alleen de betaalde abonnementen.
4. **Claude Design per abonnement.** Bronnen spreken elkaar tegen: "bèta op betaalde abonnementen" tegenover "Design, Slides en Docs op alle abonnementen, ook Free". Ook ">1 miljoen gebruikers in de eerste week" komt alleen uit een zoekresultaat.
5. **Modellen in Claude for Outlook.** De docs noemen Opus 4.7, Opus 4.6 en Sonnet 4.6; dat lijkt verouderd.
6. **Samengevoegde Claude op Team.** Pro en Max hebben hem, Enterprise in bèta; voor Team staat alleen "more plans will follow soon".
7. **Claude Code op het web zonder GitHub.** De docs gaan uit van GitHub. Of het voor niet-programmeurs bruikbaar is zonder GitHub-account, kon ik niet bevestigen.
8. **LMArena / Arena.** Huidige naam, adres (arena.ai?) en datum van de naamswijziging. Wikipedia en arena.ai waren vanuit mijn omgeving niet bereikbaar.
9. **Higgsfield.** Huidige functies en prijzen. De meeste bronnen zijn marketing.
10. **Teams-berichten via de M365-connector.** Het supportartikel (gisteren bijgewerkt) zegt: kan, als de beheerder het aanzet. De release notes van juli zeiden nog "alleen lezen". Ik volg het nieuwste supportartikel.
11. **Geheugenverlies in de metafoor.** Niet Anthropics letterlijke woord (zie bovenaan). Geen feitelijk probleem, wel goed om te weten.
12. **Klantcijfers** (Rakuten, Brilliant, Datadog, North Highland, Ramp, HubSpot) zijn eigen opgaven van die bedrijven in Anthropic-publicaties. In de app zet ik daar "volgens [bedrijf]" bij.

## Plan voor fase 2 (na je akkoord)

- Stijlrichting: rustig en technisch, met het toegangspasje als badge "Ingewerkt" en het bureau als terugkerend beeld. Geen paarse gradients en geen emoji-kaarten.
- Ontwerp van het startscherm en één tegeldetail (voorstel: 1.4 Context window, omdat die de sterkste animatie heeft), via Claude Design als dat in deze omgeving beschikbaar is, anders als statische HTML-preview.
