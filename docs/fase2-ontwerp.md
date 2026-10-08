# Fase 2: ontwerp

Preview: [`design/preview.html`](../design/preview.html). Dubbelklik om te openen; werkt via `file://`, zonder internet.

## Stijlrichting: "de technische tekening"

Numafa bouwt machines, dus de app leent de taal van de werkvoorbereiding.

- **Elke tegel is een tekenblad** met een titelhoek: bladnummer (1.4), niveau, leestijd en *stand per* (de revisiedatum). Op het detailscherm staat de titelhoek rechtsboven, net als op een tekening.
- **De toegangspas is je voortgang.** Per niveau een strookje dat volloopt; rond je een niveau af, dan landt er een stempel *Ingewerkt*.
- **Lettertypen zitten al op Windows:** Bahnschrift (DIN, de Duitse industrienorm) voor koppen, Segoe UI voor tekst, Cascadia Mono / Consolas voor labels en commando's. Er wordt niets gedownload.
- **Kleur:** papierwit en grafiet met één merkkleur (technisch blauw) en één signaalkleur (oranje) voor valkuilen, de 80%-grens en de stempel. Geen gradients.
- **Licht en donker** volgen het systeem; de knop rechtsboven wisselt systeem / licht / donker.

## Huiskleuren aanpassen

Bovenin `<style>` staan `--brand` en `--signal`. Pas die twee aan (en hun donkere varianten in de blokken eronder), dan kleurt de hele app mee. Het logo is nu een placeholder (`N` in een blokje).

## Wat de preview laat zien

- **Startscherm:** hero, toegangspas met voorbeeldvoortgang, zoeken (toets `/`), drie niveaus met voortgangsbalk per niveau, alle 35 tegels. De voortgang is een voorbeeld; "Begin met een lege pas" wist hem.
- **Tegeldetail 1.4 Context window:** alle negen onderdelen, met *het bureau dat volloopt*. Start bij openen, stopt vanzelf, knop "Opnieuw afspelen", en zelf documenten neerleggen, `/compact` en "Nieuwe chat". Op de telefoon krijgt het bureau een eigen indeling; met *reduced motion* staat het meteen stil op "bijna vol", met de uitleg in stappen.
- **Doorspelen:** lees 1.4 tot onderaan en ga terug naar het overzicht: niveau 1 is af en de stempel landt op de pas.
- **Toetsenbord:** Tab door alles, `/` zoeken, `←` `→` vorige/volgende tegel, `Esc` terug.

## Getest

Headless Chromium via `file://`, op 1440 px en 375 px, licht en donker, en met *reduced motion*: geen consolefouten, geen externe aanvragen, geen horizontaal scrollen.
