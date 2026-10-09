/* Claude inwerken — feedbacklaag (alleen in de feedbackversie).
   Per tegel feedback geven voor Claude. Alles wordt bewaard in deze browser. Draait de pagina
   als artifact op claude.ai, dan gaat het ook naar de gedeelde opslag van de pagina
   (collectie "feedback", één document per tegel-id plus "algemeen"), zodat Claude het direct leest.
   De app zelf blijft ongewijzigd: deze laag kijkt mee via hashchange en een MutationObserver op #main. */
(function () {
  "use strict";
  if (!document.documentElement.lang) document.documentElement.lang = "nl";

  /* ---------- Data ---------- */
  var DATA;
  try { DATA = JSON.parse(document.getElementById("tegels").textContent); } catch (e) { return; }
  var TILES = DATA.tegels, LEVELS = DATA.niveaus;
  var byId = {};
  TILES.forEach(function (t, i) { byId[t.id] = { t: t, i: i }; });
  var GENERAL = "algemeen";
  var ORDER = [GENERAL].concat(TILES.map(function (t) { return t.id; }));

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function titleOf(id) { return id === GENERAL ? "Algemeen (hele app)" : (byId[id] ? byId[id].t.titel : id); }
  function labelOf(id) { return id === GENERAL ? titleOf(id) : id + " " + titleOf(id); }
  function fmtDate(iso) {
    var m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return iso || "";
    var maanden = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
    return (+m[3]) + " " + maanden[+m[2] - 1] + " " + m[1];
  }
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  var SVG = function (p, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var BUBBLE = SVG('<path d="M4 5.5h16v10.5H9.5L5 19.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>');
  var CHECK = SVG('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 2.4);

  /* ---------- Opslag ---------- */
  // items[id] = { tekst, akkoord, bijgewerkt, status ("open" | "verwerkt"), antwoord, synced }
  var LKEY = "claude-inwerken:feedback:v1";
  var items = {};
  try { var raw = localStorage.getItem(LKEY); if (raw) { var p = JSON.parse(raw); if (p && p.items && typeof p.items === "object") items = p.items; } } catch (e) {}
  function saveLocal() { try { localStorage.setItem(LKEY, JSON.stringify({ items: items })); } catch (e) {} }
  function text(id) { return items[id] && items[id].tekst ? String(items[id].tekst) : ""; }
  function hasText(id) { return !!text(id).trim(); }
  function isOk(id) { return !!(items[id] && items[id].akkoord); }
  function isEmpty(id) { return !hasText(id) && !isOk(id); }
  function stateOf(id) {
    if (hasText(id)) return items[id].status === "verwerkt" ? "done" : "fb";
    return isOk(id) ? "ok" : "none";
  }
  var TAG = {
    fb: function () { return '<span class="fb-tag fb">' + BUBBLE + 'Feedback</span>'; },
    ok: function () { return '<span class="fb-tag ok">' + CHECK + 'Prima zo</span>'; },
    done: function () { return '<span class="fb-tag done">' + CHECK + 'Verwerkt</span>'; },
    none: function () { return '<span class="fb-tag none">Geen reactie</span>'; }
  };
  function counts() {
    var c = { fb: 0, ok: 0, none: 0, done: 0 };
    ORDER.forEach(function (id) { var s = stateOf(id); if (id === GENERAL && s === "none") return; c[s]++; });
    return c;
  }

  /* ---------- Gedeelde opslag op claude.ai (db-capability) ---------- */
  var db = null, dbMode = "pending", readOnly = false; // dbMode: pending | on | off
  var timers = {}, dirty = {}, chains = {}, seq = {};
  function docBody(id) {
    var it = items[id];
    return { tegel: id, titel: titleOf(id), tekst: text(id), akkoord: !!it.akkoord, bijgewerkt: it.bijgewerkt || new Date().toISOString(), status: it.status === "verwerkt" ? "verwerkt" : "open", antwoord: it.antwoord || "" };
  }
  function edited(id) {
    var it = items[id] || (items[id] = { tekst: "", akkoord: false });
    it.bijgewerkt = new Date().toISOString();
    it.status = "open";
    it.synced = false;
    return it;
  }
  function scheduleWrite(id, delay) {
    dirty[id] = true;
    if (timers[id]) clearTimeout(timers[id]);
    timers[id] = setTimeout(function () { flush(id); }, delay == null ? 700 : delay);
    showStatus("saving");
  }
  function flush(id) {
    if (timers[id]) { clearTimeout(timers[id]); delete timers[id]; }
    if (!dirty[id]) return;
    if (isEmpty(id) && items[id] && !items[id].antwoord && (!db || readOnly)) delete items[id];
    saveLocal();
    if (!db || readOnly) { delete dirty[id]; showStatus(); return; }
    var token = seq[id] = (seq[id] || 0) + 1;
    chains[id] = (chains[id] || Promise.resolve()).then(function () {
      if (seq[id] !== token) return; // er staat al een nieuwere versie klaar
      var ref = db.collection("feedback").doc(id);
      var gone = !items[id] || isEmpty(id);
      return (gone ? ref.delete() : ref.set(docBody(id))).then(function () {
        if (gone) delete items[id]; else if (items[id]) items[id].synced = true;
        if (seq[id] === token && !timers[id]) delete dirty[id];
        saveLocal(); showStatus();
      }, function (e) {
        if (e && (e.code === "invalid_argument" || e.code === "revoked" || e.code === "not_granted")) readOnly = true;
        if (seq[id] === token && !timers[id]) delete dirty[id];
        showStatus(e && e.code === "quota_exceeded" ? "quota" : "error");
      });
    });
  }
  function flushAll() { Object.keys(timers).forEach(flush); }
  window.addEventListener("pagehide", flushAll);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flushAll(); });

  function initDb() {
    var c = window.claude;
    if (!c || typeof c.use !== "function") { dbMode = "off"; showStatus(); return; }
    c.use("db").then(function (d) {
      if (!d) { dbMode = "off"; showStatus(); return; }
      db = d; dbMode = "on"; showStatus();
      var first = true;
      d.collection("feedback").onSnapshot(function (snap) {
        var seen = {};
        snap.docs.forEach(function (doc) {
          var v = doc.data() || {};
          seen[doc.id] = 1;
          if (dirty[doc.id]) return;
          items[doc.id] = {
            tekst: typeof v.tekst === "string" ? v.tekst : "", akkoord: !!v.akkoord, bijgewerkt: v.bijgewerkt || "",
            status: v.status === "verwerkt" ? "verwerkt" : "open", antwoord: typeof v.antwoord === "string" ? v.antwoord : "", synced: true
          };
        });
        Object.keys(items).forEach(function (id) {
          if (seen[id] || dirty[id]) return;
          if (items[id].synced) delete items[id];          // elders gewist
          else if (first && !isEmpty(id)) { dirty[id] = true; flush(id); } // eerder alleen lokaal bewaard
        });
        first = false;
        saveLocal(); refresh(true);
      }, function () { db = null; dbMode = "off"; showStatus(); });
    }, function () { dbMode = "off"; showStatus(); });
  }

  /* ---------- Waar zijn we? ---------- */
  var main = document.getElementById("main");
  function currentTarget() {
    var m = (location.hash || "").match(/^#\/tegel\/([\d.]+)$/);
    return m && byId[m[1]] ? m[1] : GENERAL;
  }
  var target = currentTarget();

  /* ---------- Opbouw ---------- */
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }

  var navInner = document.querySelector(".nav-inner"), themeBtn = document.getElementById("theme");
  var navBtn = el('<button class="fb-navbtn" type="button" id="fb-navbtn" aria-haspopup="dialog">' + BUBBLE + '<span class="fb-navlabel">Feedback</span><span class="fb-count" id="fb-count">0</span></button>');
  if (navInner) navInner.insertBefore(navBtn, themeBtn || null);

  var banner = el('<div class="fb-banner" id="fb-banner" hidden><div class="wrap fb-banner-inner"><strong>Feedbackversie.</strong>' +
    '<span>Open een tegel en schrijf rechtsonder wat er anders moet. Klopt een tegel al? Klik dan op ‘Prima zo’.</span>' +
    '<button class="link-btn" type="button" id="fb-banner-all">Alle feedback bekijken</button></div></div>');
  var header = document.querySelector("header.nav");
  if (header && header.parentNode) header.parentNode.insertBefore(banner, header.nextSibling);

  var fab = el('<button class="fb-fab" type="button" id="fb-fab" aria-controls="fb-panel" aria-expanded="false">' + BUBBLE +
    '<span>Feedback</span><span class="fb-fab-id" id="fb-fab-id"></span><span class="fb-fab-dot" id="fb-fab-dot" hidden></span></button>');
  var panel = el('<section class="fb-panel" id="fb-panel" aria-labelledby="fb-title" hidden>' +
    '<div class="fb-head"><div><p class="fb-kicker" id="fb-kicker"></p><h2 class="fb-title" id="fb-title"></h2></div>' +
      '<button class="icon-btn fb-close" type="button" id="fb-close" aria-label="Paneel inklappen">' + SVG('<path d="m7 7 10 10M17 7 7 17"/>', 2) + '</button></div>' +
    '<div class="fb-reply" id="fb-reply" hidden></div>' +
    '<div class="fb-chips" id="fb-chips"></div>' +
    '<label class="sr-only" for="fb-text">Je feedback</label>' +
    '<textarea class="fb-text" id="fb-text" rows="7" spellcheck="true"></textarea>' +
    '<p class="fb-status" id="fb-status" aria-live="polite"></p>' +
    '<div class="fb-foot">' +
      '<button class="btn btn-small fb-okbtn" type="button" id="fb-ok" aria-pressed="false">' + CHECK + 'Prima zo</button>' +
      '<span class="fb-pager" id="fb-pager"><button class="btn btn-small" type="button" id="fb-prev" aria-label="Vorige tegel">‹</button>' +
      '<button class="btn btn-small btn-primary" type="button" id="fb-next">Volgende ›</button></span>' +
    '</div>' +
    '<button class="link-btn fb-all" type="button" id="fb-all">Alle feedback bekijken</button>' +
    '<p class="fb-hint">Tip: selecteer tekst op de pagina en klik op ‘Citeer selectie’. Sneltoets <kbd>F</kbd> opent dit paneel.</p>' +
  '</section>');
  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var dialog = el('<dialog class="fb-dialog" id="fb-dialog" aria-labelledby="fb-dlg-title"><div class="fb-dlg">' +
    '<div class="fb-dlg-head">' +
      '<div class="fb-dlg-top"><div><h2 id="fb-dlg-title">Alle feedback</h2><p id="fb-dlg-sub"></p></div>' +
        '<button class="icon-btn" type="button" id="fb-dlg-close" aria-label="Sluiten">' + SVG('<path d="m7 7 10 10M17 7 7 17"/>', 2) + '</button></div>' +
      '<div class="fb-sum" id="fb-sum"></div>' +
      '<div class="fb-actions"><span class="fb-seg" role="group" aria-label="Filter">' +
        '<button type="button" id="fb-f-all" aria-pressed="true">Alle tegels</button><button type="button" id="fb-f-fb" aria-pressed="false">Alleen met feedback</button></span>' +
        '<span class="fb-copy-status" id="fb-copy-status" aria-live="polite"></span>' +
        '<button class="btn btn-primary btn-small" type="button" id="fb-copy">Kopieer alles voor Claude</button></div>' +
      '<p class="fb-note" id="fb-note"></p>' +
    '</div>' +
    '<div class="fb-dlg-body" id="fb-dlg-body"></div>' +
  '</div></dialog>');
  document.body.appendChild(dialog);

  var $ = function (id) { return document.getElementById(id); };
  var ta = $("fb-text"), statusEl = $("fb-status");

  /* ---------- Paneel ---------- */
  var panelOpen = false;
  try { panelOpen = localStorage.getItem("claude-inwerken:feedback:open") === "1"; } catch (e) {}
  function setOpen(open, focus) {
    panelOpen = open;
    try { localStorage.setItem("claude-inwerken:feedback:open", open ? "1" : "0"); } catch (e) {}
    panel.hidden = !open; fab.hidden = open;
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { renderPanel(); if (focus) ta.focus(); }
    else { flush(target); if (focus) fab.focus(); }
  }
  var SECTIONS = function (id) {
    if (id === GENERAL) return ["Startscherm", "Volgorde", "Toon", "Vormgeving", "Ontbreekt"];
    var t = byId[id].t, s = ["Titel", "Uitleg", "Animatie"];
    if (t.probeer) s.push("Probeer zelf");
    s.push("Valkuil");
    if (t.quiz && t.quiz.length) s.push("Quiz");
    return s;
  };
  var lastSel = "";
  function renderPanel() {
    var id = target, info = byId[id];
    $("fb-kicker").textContent = id === GENERAL ? "Feedback voor Claude · over de hele app" : "Feedback voor Claude · tegel " + (info.i + 1) + " van " + TILES.length;
    $("fb-title").innerHTML = id === GENERAL ? "Algemeen" : '<span class="fb-num">' + esc(id) + '</span>' + esc(titleOf(id));
    ta.placeholder = id === GENERAL
      ? "Wat moet er anders aan de hele app? Bijvoorbeeld de volgorde, de toon, de vormgeving of een onderwerp dat mist."
      : "Wat moet er anders aan deze tegel? Bijvoorbeeld: ‘Animatie gaat te snel’, ‘Voorbeeld uit de schoonmaak toevoegen’ of ‘Quizvraag 2 is te makkelijk’.";
    if (!dirty[id] || document.activeElement !== ta) { if (ta.value !== text(id)) ta.value = text(id); }
    $("fb-chips").innerHTML = '<span class="fb-chips-label">Over:</span>' + SECTIONS(id).map(function (s) {
      return '<button class="fb-chip" type="button" data-tag="' + esc(s) + '">' + esc(s) + '</button>';
    }).join("") + '<button class="fb-chip quote" type="button" id="fb-quote"' + (lastSel ? '' : ' disabled') + ' title="Selecteer eerst tekst op de pagina">Citeer selectie</button>';
    var it = items[id], reply = $("fb-reply");
    if (it && it.antwoord) {
      reply.hidden = false;
      reply.innerHTML = '<strong>' + (it.status === "verwerkt" ? "Verwerkt door Claude" : "Eerder antwoord van Claude") + '</strong><p>' + esc(it.antwoord) + '</p>';
    } else if (it && it.status === "verwerkt" && hasText(id)) {
      reply.hidden = false; reply.innerHTML = '<strong>Verwerkt door Claude</strong><p>Schrijf hieronder als er nog iets anders moet.</p>';
    } else reply.hidden = true;
    var okBtn = $("fb-ok");
    okBtn.hidden = id === GENERAL;
    okBtn.setAttribute("aria-pressed", isOk(id) ? "true" : "false");
    $("fb-pager").hidden = id === GENERAL;
    if (info) {
      $("fb-prev").disabled = info.i === 0;
      var nx = TILES[info.i + 1];
      $("fb-next").disabled = !nx;
      $("fb-next").setAttribute("aria-label", nx ? "Volgende tegel: " + nx.titel : "Dit is de laatste tegel");
    }
    showStatus();
  }
  function showStatus(kind) {
    var msg = "", warn = false;
    if (kind === "saving" || Object.keys(timers).length) msg = "Opslaan…";
    else if (kind === "error") { msg = "Opslaan online lukte niet. Je tekst staat wel in deze browser; kopieer hem straks via ‘Alle feedback’."; warn = true; }
    else if (kind === "quota") { msg = "De online opslag is vol. Je tekst staat wel in deze browser; kopieer hem via ‘Alle feedback’."; warn = true; }
    else if (readOnly) { msg = "Je kunt hier niet online opslaan. Je tekst blijft in deze browser; kopieer hem via ‘Alle feedback’."; warn = true; }
    else if (dbMode === "on") msg = isEmpty(target) ? "Wat je typt, wordt opgeslagen en kan Claude direct lezen." : "Opgeslagen. Claude kan dit lezen.";
    else msg = isEmpty(target) ? "Wat je typt, blijft bewaard in deze browser." : "Bewaard in deze browser. Kopieer straks alles voor Claude.";
    statusEl.textContent = msg;
    statusEl.className = "fb-status" + (warn ? " warn" : "");
    if (dialog.open) dialogNote();
  }
  function insertLine(s) {
    var v = ta.value;
    ta.value = v + (v && !/\n$/.test(v) ? "\n" : "") + s;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    onInput();
  }
  function onInput() {
    var it = edited(target);
    it.tekst = ta.value;
    scheduleWrite(target);
    refresh(false);
  }
  ta.addEventListener("input", onInput);
  ta.addEventListener("blur", function () { flush(target); });
  $("fb-chips").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "fb-quote") { insertLine("> “" + lastSel + "”\n"); lastSel = ""; renderQuote(); return; }
    insertLine("[" + b.getAttribute("data-tag") + "] ");
  });
  function renderQuote() { var q = $("fb-quote"); if (q) q.disabled = !lastSel; }
  document.addEventListener("selectionchange", function () {
    var s = window.getSelection && window.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount || !main.contains(s.anchorNode)) return;
    var str = s.toString().replace(/\s+/g, " ").trim();
    if (!str) return;
    lastSel = str.length > 400 ? str.slice(0, 400) + "…" : str;
    renderQuote();
  });
  $("fb-ok").addEventListener("click", function () {
    var it = edited(target);
    it.akkoord = !it.akkoord;
    it.tekst = ta.value;
    scheduleWrite(target, 0);
    refresh(false);
  });
  var refocus = false;
  function go(delta) {
    var info = byId[target]; if (!info) return;
    var t = TILES[info.i + delta]; if (!t) return;
    flush(target);
    refocus = true; setTimeout(function () { refocus = false; }, 2000);
    location.hash = "#/tegel/" + t.id;
  }
  $("fb-prev").addEventListener("click", function () { go(-1); });
  $("fb-next").addEventListener("click", function () { go(1); });
  main.addEventListener("focus", function () { if (refocus && panelOpen) { refocus = false; ta.focus({ preventScroll: true }); } });
  fab.addEventListener("click", function () { setOpen(true, true); });
  $("fb-close").addEventListener("click", function () { setOpen(false, true); });
  panel.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); setOpen(false, true); }
  });
  document.addEventListener("keydown", function (e) {
    if ((e.key !== "f" && e.key !== "F") || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable || dialog.open) return;
    e.preventDefault();
    if (!panelOpen) setOpen(true, true); else ta.focus();
  });

  /* ---------- Overzicht ---------- */
  var filterFb = false;
  function openDialog() {
    flush(target);
    renderDialog();
    $("fb-copy-status").textContent = "";
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }
  function closeDialog() { if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); }
  function dialogNote() {
    $("fb-note").textContent = dbMode === "on" && !readOnly
      ? "Je feedback staat ook online bij deze pagina. Zeg in de chat ‘verwerk de feedback’ en Claude leest hem direct. Kopiëren mag ook."
      : "Klik op ‘Kopieer alles voor Claude’ en plak de tekst in de chat. Claude past de tegels dan aan.";
  }
  function renderDialog() {
    var c = counts();
    $("fb-dlg-sub").textContent = DATA.app.titel + " · stand per " + fmtDate(DATA.app.stand) + " · " + TILES.length + " tegels";
    $("fb-sum").innerHTML =
      '<span class="fb-tag fb">' + BUBBLE + c.fb + ' met feedback</span>' +
      (c.done ? '<span class="fb-tag done">' + CHECK + c.done + ' verwerkt</span>' : '') +
      '<span class="fb-tag ok">' + CHECK + c.ok + ' prima zo</span>' +
      '<span class="fb-tag none">' + c.none + ' nog zonder reactie</span>';
    $("fb-f-all").setAttribute("aria-pressed", filterFb ? "false" : "true");
    $("fb-f-fb").setAttribute("aria-pressed", filterFb ? "true" : "false");
    dialogNote();
    var show = function (id) { return !filterFb || hasText(id); };
    var row = function (id) {
      var s = stateOf(id), it = items[id];
      return '<li class="fb-item ' + s + '"><a href="#/tegel/' + esc(id) + '" data-goto="' + esc(id) + '">' +
        '<span class="fb-item-num">' + (id === GENERAL ? "" : esc(id)) + '</span><span class="fb-item-title">' + esc(id === GENERAL ? "Algemeen (hele app)" : titleOf(id)) + '</span>' + TAG[s]() +
        (hasText(id) ? '<span class="fb-item-text">' + esc(text(id).trim()) + '</span>' : '') +
        (it && it.antwoord ? '<span class="fb-item-reply">Claude: ' + esc(it.antwoord) + '</span>' : '') +
        '</a></li>';
    };
    var h = "";
    if (show(GENERAL)) h += '<p class="fb-group">Hele app</p><ul class="fb-list">' + row(GENERAL) + '</ul>';
    LEVELS.forEach(function (l) {
      var ids = TILES.filter(function (t) { return t.niveau === l.id; }).map(function (t) { return t.id; }).filter(show);
      if (ids.length) h += '<p class="fb-group">Niveau ' + l.id + ' · ' + esc(l.naam) + '</p><ul class="fb-list">' + ids.map(row).join("") + '</ul>';
    });
    if (!h) h = '<p class="fb-empty">Nog geen feedback. Open een tegel en klik rechtsonder op Feedback.</p>';
    h += '<details class="fb-export" id="fb-export"><summary>Tekst voor Claude bekijken</summary><label class="sr-only" for="fb-export-text">Tekst voor Claude</label><textarea id="fb-export-text" readonly></textarea></details>';
    var body = $("fb-dlg-body"), wasOpen = $("fb-export") && $("fb-export").open;
    body.innerHTML = h;
    $("fb-export-text").value = exportText();
    if (wasOpen) $("fb-export").open = true;
  }
  function exportText() {
    var c = counts(), out = [];
    out.push("# Feedback op " + DATA.app.titel);
    out.push("App: stand per " + fmtDate(DATA.app.stand) + ". Feedback bijgewerkt op " + fmtDate(today()) + ".");
    out.push(c.fb + " met feedback, " + c.ok + " prima zo, " + c.none + " nog zonder reactie" + (c.done ? ", " + c.done + " al verwerkt" : "") + " (" + TILES.length + " tegels).");
    out.push("Pas de tegels aan op basis van onderstaande feedback. [Uitleg], [Animatie] enz. geeft aan over welk deel van de tegel het gaat; regels met > zijn citaten uit de tegel.");
    ORDER.filter(function (id) { return stateOf(id) === "fb"; }).forEach(function (id) {
      out.push(""); out.push("## " + labelOf(id)); out.push(text(id).trim());
    });
    var ok = TILES.filter(function (t) { return stateOf(t.id) === "ok"; });
    if (ok.length) { out.push(""); out.push("## Prima zo, niets aanpassen"); out.push(ok.map(function (t) { return t.id + " " + t.titel; }).join("; ")); }
    var done = ORDER.filter(function (id) { return stateOf(id) === "done"; });
    if (done.length) { out.push(""); out.push("## Al verwerkt"); out.push(done.map(labelOf).join("; ")); }
    var none = TILES.filter(function (t) { return stateOf(t.id) === "none"; });
    if (none.length) { out.push(""); out.push("## Nog zonder reactie"); out.push(none.map(function (t) { return t.id; }).join(", ")); }
    return out.join("\n");
  }
  function copyAll() {
    var txt = exportText(), st = $("fb-copy-status");
    function ok() { st.className = "fb-copy-status"; st.textContent = "Gekopieerd. Plak het in de chat met Claude."; }
    function fallback() {
      var det = $("fb-export"), area = $("fb-export-text");
      det.open = true; area.value = txt; area.focus(); area.select();
      var done = false;
      try { done = document.execCommand("copy"); } catch (e) { done = false; }
      if (done) ok(); else { st.className = "fb-copy-status warn"; st.textContent = "Tekst is geselecteerd: druk op Ctrl+C (Cmd+C op een Mac)."; }
    }
    try {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(ok, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }
  navBtn.addEventListener("click", openDialog);
  $("fb-all").addEventListener("click", openDialog);
  $("fb-banner-all").addEventListener("click", openDialog);
  $("fb-dlg-close").addEventListener("click", closeDialog);
  $("fb-copy").addEventListener("click", copyAll);
  $("fb-f-all").addEventListener("click", function () { filterFb = false; renderDialog(); });
  $("fb-f-fb").addEventListener("click", function () { filterFb = true; renderDialog(); });
  dialog.addEventListener("keydown", function (e) { if (e.key === "Escape") e.stopPropagation(); });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) { closeDialog(); return; } // klik op de achtergrond
    var a = e.target.closest("[data-goto]"); if (!a) return;
    e.preventDefault();
    var id = a.getAttribute("data-goto");
    closeDialog();
    if (id === GENERAL) { if (currentTarget() !== GENERAL) location.hash = "#/"; }
    else location.hash = "#/tegel/" + id;
    setOpen(true, false);
  });

  /* ---------- Bijwerken na elke weergave ---------- */
  function decorateCards() {
    Array.prototype.forEach.call(main.querySelectorAll(".tile[data-tile]"), function (card) {
      var old = card.querySelector(".fb-tag"); if (old) old.remove();
      var s = stateOf(card.getAttribute("data-tile"));
      if (s === "none") return;
      var host = card.querySelector(".tile-foot > span");
      if (host) host.insertAdjacentHTML("beforeend", TAG[s]());
    });
  }
  function refresh(full) {
    var c = counts(), n = c.fb + c.done, cnt = $("fb-count");
    cnt.textContent = n;
    if (n) cnt.removeAttribute("data-zero"); else cnt.setAttribute("data-zero", "");
    navBtn.setAttribute("aria-label", "Feedback: " + n + (n === 1 ? " onderdeel" : " onderdelen") + " met feedback. Open het overzicht.");
    $("fb-fab-id").textContent = target === GENERAL ? "" : target;
    $("fb-fab-dot").hidden = isEmpty(target);
    fab.setAttribute("aria-label", "Feedback geven" + (target === GENERAL ? " over de hele app" : " op tegel " + target + ", " + titleOf(target)));
    if (full) { decorateCards(); if (panelOpen) renderPanel(); }
    else {
      $("fb-ok").setAttribute("aria-pressed", isOk(target) ? "true" : "false");
      showStatus();
    }
    if (dialog.open) renderDialog();
  }
  function onView() {
    var nt = currentTarget();
    if (nt !== target) { flush(target); target = nt; lastSel = ""; }
    var hsh = location.hash || "#/";
    banner.hidden = !(hsh === "#/" || hsh === "#" || /^#niveau-/.test(hsh)) || !!(document.getElementById("q") && document.getElementById("q").value.trim());
    refresh(true);
  }
  new MutationObserver(onView).observe(main, { childList: true });
  window.addEventListener("hashchange", onView);

  setOpen(panelOpen, false);
  onView();
  initDb();
})();
