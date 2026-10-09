# claude-inwerken
AI_les

- `claude-inwerken.html`: de app (bron).
- `claude-inwerken-feedback.html`: dezelfde app met per tegel een feedbackveld voor Claude.
  Gebouwd met `python3 tools/bouw_feedbackversie.py` uit de app plus `feedback/`.

## Feedback geven

Open een tegel en klik rechtsonder op **Feedback** (of druk op `F`). Schrijf wat er anders moet;
de knoppen *Uitleg*, *Animatie*, *Quiz* enz. zetten een label voor je tekst, en *Citeer selectie*
plakt tekst die je op de pagina hebt geselecteerd. Klopt een tegel al, klik dan op **Prima zo**.
Met **Volgende ›** loop je zo alle tegels door.

Via **Feedback** in de bovenbalk zie je alles op een rij. **Kopieer alles voor Claude** zet de
feedback klaar om in de chat te plakken. Draait de pagina als artifact op claude.ai, dan wordt de
feedback ook online bewaard en kan Claude hem direct lezen.
