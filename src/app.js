/* Claude inwerken — app: navigatie, zoeken, voortgang, quiz, kopiëren.
   Alle inhoud komt uit het JSON-blok #tegels (bron: src/tegels.json). */
(function () {
  "use strict";

  /* ---------- Data ---------- */
  var DATA;
  try { DATA = JSON.parse(document.getElementById("tegels").textContent); }
  catch (e) {
    document.getElementById("main").innerHTML = '<div class="about"><h1>Er ging iets mis</h1><p class="prose">De inhoud kon niet worden gelezen: ' + String(e.message) + '. Controleer tegels.json en bouw opnieuw.</p></div>';
    return;
  }
  var TILES = DATA.tegels, LEVELS = DATA.niveaus, GROUPS = DATA.groepen || {};
  var byId = {};
  TILES.forEach(function (t, i) { t._i = i; byId[t.id] = t; });
  function tilesOf(n) { return TILES.filter(function (t) { return t.niveau === n; }); }
  function levelOf(t) { for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === t.niveau) return LEVELS[i]; return LEVELS[0]; }

  /* ---------- Hulpjes ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // mini-markdown: **vet**, *schuin*, `code`, [tekst](https://…)
  function mdInline(s) {
    var out = esc(s);
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return out;
  }
  window.mdInline = mdInline;
  var icon = function (n) { return window.iconSVG(n); };
  var reducedMotion = function () { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); };
  function fmtDate(iso) {
    var m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return iso || "";
    var maanden = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
    return (+m[3]) + " " + maanden[+m[2] - 1] + " " + m[1];
  }
  function tint(t) { return t.groep === "extra" ? "var(--lvl-x)" : "var(--lvl-" + t.niveau + ")"; }

  /* ---------- Voortgang (localStorage, mag mislukken) ---------- */
  var KEY = "claude-inwerken:v1";
  var state = { read: [], quiz: {}, medals: [] };
  var storageOk = true;
  try { var raw = localStorage.getItem(KEY); if (raw) { var p = JSON.parse(raw); if (p && p.read) state = { read: p.read || [], quiz: p.quiz || {}, medals: p.medals || [] }; } }
  catch (e) { storageOk = false; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { storageOk = false; } }
  function isRead(id) { return state.read.indexOf(id) !== -1; }
  function markRead(id) { if (!isRead(id)) { state.read.push(id); save(); return true; } return false; }
  function countRead(n) { return tilesOf(n).filter(function (t) { return isRead(t.id); }).length; }
  function levelDone(n) { return countRead(n) === tilesOf(n).length; }
  function quizTotals() {
    var good = 0, answered = 0;
    for (var id in state.quiz) for (var q in state.quiz[id]) { answered++; if (state.quiz[id][q]) good++; }
    return { good: good, answered: answered };
  }

  /* ---------- Thema ---------- */
  var root = document.documentElement, themeBtn = document.getElementById("theme");
  var THEMES = ["system", "light", "dark"], theme = "system";
  try { theme = localStorage.getItem("claude-inwerken:theme") || "system"; } catch (e) {}
  function applyTheme() {
    if (theme === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", theme);
    var names = { system: "systeem", light: "licht", dark: "donker" };
    var svg = {
      system: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/>',
      light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
      dark: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'
    }[theme];
    themeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' + svg + '</svg>';
    themeBtn.setAttribute("aria-label", "Weergave: " + names[theme] + ". Klik om te wisselen.");
    themeBtn.title = "Weergave: " + names[theme];
  }
  themeBtn.addEventListener("click", function () {
    theme = THEMES[(THEMES.indexOf(theme) + 1) % 3];
    try { localStorage.setItem("claude-inwerken:theme", theme); } catch (e) {}
    applyTheme();
  });
  applyTheme();

  /* ---------- Elementen ---------- */
  var main = document.getElementById("main"), searchEl = document.getElementById("q"), subnavHost = document.getElementById("subnav");
  var active = []; // lopende visuals
  function stopVisuals() { active.forEach(function (v) { try { v.stop(); } catch (e) {} }); active = []; }
  var endObserver = null;

  /* ---------- Tegelkaart ---------- */
  function highlight(text, q) {
    if (!q) return mdInline(text);
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return mdInline(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  }
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  function card(t, q, note) {
    var read = isRead(t.id);
    return '<a class="tile' + (read ? " read" : "") + (t.breed && !q ? " wide" : "") + '" href="#/tegel/' + t.id + '" style="--tint:' + tint(t) + '" data-tile="' + t.id + '">' +
      '<span class="squircle" data-vt="' + t.id + '">' + icon(t.icoon) + '</span>' +
      '<span class="tile-text"><h3 class="tile-title">' + highlight(t.titel, q) + '</h3>' +
      '<span class="tile-line">' + highlight(t.kort, q) + (note ? ' <em>' + esc(note) + '</em>' : '') + '</span>' +
      '<span class="tile-foot"><span><span class="tile-num">' + t.id + '</span> · ' + t.minuten + ' min</span>' +
      '<span class="tile-state">' + (read ? CHECK + "Gelezen" : "Nieuw") + '</span></span></span></a>';
  }
  function meterBar(n, color) {
    var tot = tilesOf(n).length, r = countRead(n);
    return '<div class="meter-bar" role="progressbar" aria-label="Voortgang niveau ' + n + '" aria-valuemin="0" aria-valuemax="' + tot + '" aria-valuenow="' + r + '"><i style="width:' + (r / tot * 100) + '%;background:' + color + '"></i></div>';
  }

  /* ---------- Startscherm ---------- */
  function ringsSVG() {
    var r = [40, 31, 22], out = '<svg class="rings" viewBox="0 0 96 96" aria-hidden="true">';
    LEVELS.forEach(function (l, i) {
      var c = 2 * Math.PI * r[i], frac = countRead(l.id) / tilesOf(l.id).length;
      out += '<circle class="track" cx="48" cy="48" r="' + r[i] + '" stroke-width="7"/>' +
        '<circle class="val" cx="48" cy="48" r="' + r[i] + '" stroke-width="7" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + (c * (1 - frac)).toFixed(2) + '" transform="rotate(-90 48 48)" style="opacity:' + (0.55 + 0.15 * (2 - i)) + '"/>';
    });
    return out + '</svg>';
  }
  function passHTML(fresh) {
    var qt = quizTotals();
    var medals = LEVELS.filter(function (l) { return levelDone(l.id); });
    return '<div class="pass" aria-label="Je toegangspas">' +
      '<div class="pass-top"><span class="pass-logo"><span>N</span>' + esc(DATA.app.organisatieKort || "Numafa") + '</span><span class="pass-kind">Toegangspas</span></div>' +
      '<div class="pass-main"><div><div class="pass-label">Nieuwe collega</div><div class="pass-name">Claude</div></div>' + ringsSVG() + '</div>' +
      '<div class="pass-fields">' +
        '<div><div class="pass-label">Gelezen</div><div class="pass-value">' + state.read.length + ' / ' + TILES.length + '</div></div>' +
        '<div><div class="pass-label">Quiz goed</div><div class="pass-value">' + qt.good + ' / ' + qt.answered + '</div></div>' +
        '<div><div class="pass-label">Stand per</div><div class="pass-value">' + esc(fmtDate(DATA.app.stand)) + '</div></div>' +
      '</div>' +
      '<div class="pass-badges">' + (medals.length ? medals.map(function (l) {
        return '<span class="medal' + (fresh.indexOf(l.id) !== -1 ? " fresh" : "") + '">' + icon("medal") + 'Ingewerkt · ' + esc(l.kort) + '</span>';
      }).join("") : '<span class="pass-empty">Rond een niveau af en je krijgt hier je eerste stempel: Ingewerkt.</span>') + '</div>' +
    '</div>';
  }
  function renderHome() {
    var next = TILES.filter(function (t) { return !isRead(t.id); })[0];
    var started = state.read.length > 0;
    var medalsNow = LEVELS.filter(function (l) { return levelDone(l.id); }).map(function (l) { return l.id; });
    var fresh = medalsNow.filter(function (id) { return state.medals.indexOf(id) === -1; });
    if (fresh.length) { state.medals = state.medals.concat(fresh); save(); }
    var h = '<section class="hero wrap" aria-labelledby="hero-title">' +
      '<p class="eyebrow">' + esc(DATA.app.eyebrow) + '</p>' +
      '<h1 id="hero-title">Je nieuwe collega heet <span>Claude</span>.</h1>' +
      '<p class="hero-lead">' + mdInline(DATA.app.intro) + '</p>' +
      '<div class="hero-cta">' +
        (next ? '<a class="btn btn-primary" href="#/tegel/' + next.id + '">' + (started ? "Ga verder met " + esc(next.id) + " " + esc(next.titel) : "Begin bij 1.1") + '</a>' : '<a class="btn btn-primary" href="#/over">Alles gelezen. Wat nu?</a>') +
        '<a class="chevron-link" href="#niveau-1">Bekijk alle tegels</a>' +
      '</div></section>';
    h += '<section class="pass-section wrap" aria-labelledby="pass-title">' + passHTML(fresh) +
      '<div class="pass-copy"><h2 id="pass-title">Je toegangspas.</h2><p>Elke tegel die je uitleest, vult een ring. Rond je een niveau af, dan krijg je de stempel <strong>Ingewerkt</strong>. Je voortgang blijft in deze browser bewaard.</p>' +
      '<div class="level-meters">' + LEVELS.map(function (l) {
        return '<div class="meter"><span class="meter-name">' + esc(l.naam) + '</span>' + meterBar(l.id, "var(--lvl-" + l.id + ")") + '<span class="meter-num">' + countRead(l.id) + '/' + tilesOf(l.id).length + '</span></div>';
      }).join("") + '</div>' +
      (storageOk ? (started ? '<p class="demo-note"><button class="link-btn" type="button" id="reset">Voortgang wissen</button></p>' : '') : '<p class="demo-note">Je browser bewaart hier niets, dus je voortgang verdwijnt als je dit venster sluit. De app werkt verder gewoon.</p>') +
      '</div></section>';
    LEVELS.forEach(function (l) {
      var ts = tilesOf(l.id);
      h += '<section class="level wrap" id="niveau-' + l.id + '" aria-labelledby="lh' + l.id + '">' +
        '<div class="level-head"><div><p class="eyebrow" style="color:var(--lvl-' + l.id + ')">Niveau ' + l.id + '</p><h2 id="lh' + l.id + '">' + esc(l.naam) + '.</h2><p>' + mdInline(l.intro) + '</p></div>' +
        '<div class="level-progress">' + meterBar(l.id, "var(--lvl-" + l.id + ")") + '<span>' + countRead(l.id) + ' van ' + ts.length + ' gelezen' + (levelDone(l.id) ? ' · ingewerkt' : '') + '</span></div></div>' +
        '<div class="grid">' + ts.filter(function (t) { return !t.groep; }).map(function (t) { return card(t); }).join("") + '</div>';
      Object.keys(GROUPS).forEach(function (g) {
        var gs = ts.filter(function (t) { return t.groep === g; });
        if (!gs.length) return;
        h += '<div class="group-head"><h3>' + esc(GROUPS[g].naam) + '</h3><span>' + mdInline(GROUPS[g].intro || "") + '</span></div><div class="grid">' + gs.map(function (t) { return card(t); }).join("") + '</div>';
      });
      h += '</section>';
    });
    main.innerHTML = '<div class="view-in">' + h + '</div>';
    var r = document.getElementById("reset");
    if (r) r.addEventListener("click", function () {
      if (r.getAttribute("data-confirm")) { state = { read: [], quiz: {}, medals: [] }; save(); renderHome(); return; }
      r.setAttribute("data-confirm", "1"); r.textContent = "Zeker weten? Klik nog een keer om alles te wissen";
    });
  }

  /* ---------- Zoeken ---------- */
  function haystack(t) {
    return [t.id, t.titel, t.kort, t.inEenZin, (t.uitleg || []).join(" "), (t.metafoor || []).join(" "), (t.zoekwoorden || []).join(" "), t.valkuil].join(" ").toLowerCase();
  }
  function renderSearch(q) {
    var ql = q.toLowerCase();
    var hits = TILES.filter(function (t) { return haystack(t).indexOf(ql) !== -1; });
    var h = '<section class="search-head wrap"><h1>' + hits.length + (hits.length === 1 ? " tegel" : " tegels") + ' over “' + esc(q) + '”</h1><p>Esc wist de zoekopdracht.</p></section>';
    h += hits.length ? '<div class="wrap"><div class="grid" role="list">' + hits.map(function (t) {
      var inFront = (t.titel + " " + t.kort).toLowerCase().indexOf(ql) !== -1;
      return card(t, q, inFront ? "" : "(gevonden in de uitleg)");
    }).join("") + '</div></div>'
      : '<div class="wrap"><div class="empty">Niets gevonden. Probeer een ander woord, zoals “agenda”, “stekker” of een commando als “/goal”.</div></div>';
    main.innerHTML = '<div>' + h + '</div>';
  }

  /* ---------- Tegeldetail ---------- */
  function subnav(t) {
    var prev = TILES[t._i - 1], next = TILES[t._i + 1], l = levelOf(t);
    return '<div class="subnav"><div class="subnav-inner">' +
      '<a class="btn btn-small" href="#/" data-back="' + t.id + '">‹ Overzicht</a>' +
      '<span class="subnav-title">' + esc(l.naam) + '</span>' + meterBar(l.id, "var(--lvl-" + l.id + ")") +
      '<span class="subnav-pager">' +
        '<a class="btn btn-small" ' + (prev ? 'href="#/tegel/' + prev.id + '"' : 'aria-disabled="true"') + ' aria-label="Vorige tegel' + (prev ? ": " + esc(prev.titel) : "") + '">‹<span>&nbsp;Vorige</span></a>' +
        '<a class="btn btn-small" ' + (next ? 'href="#/tegel/' + next.id + '"' : 'aria-disabled="true"') + ' aria-label="Volgende tegel' + (next ? ": " + esc(next.titel) : "") + '"><span>Volgende&nbsp;</span>›</a>' +
      '</span></div></div>';
  }
  function exampleHTML(v) {
    var kinds = { echt: "Echt gebeurd", numafa: "Bij Numafa" + (v.afdeling ? " · " + v.afdeling : ""), thuis: "Thuis" };
    var body = v.erin
      ? '<dl class="flow"><div><dt>Erin</dt><dd>' + mdInline(v.erin) + '</dd></div><div><dt>Claude</dt><dd>' + mdInline(v.claude) + '</dd></div><div><dt>Eruit</dt><dd>' + mdInline(v.eruit) + '</dd></div></dl>'
      : '<p>' + mdInline(v.tekst) + '</p>';
    return '<article class="case"><span class="case-kind ' + v.soort + '">' + esc(kinds[v.soort] || v.soort) + '</span><h3>' + mdInline(v.titel) + '</h3>' + body +
      (v.bron ? '<p class="src">Bron: <a href="' + esc(v.bron.url) + '" target="_blank" rel="noopener noreferrer">' + esc(v.bron.label) + '</a></p>' : '') + '</article>';
  }
  function staticTable(tb) {
    return '<div class="static-table"><div class="tbl-scroll"><table class="tbl"><thead><tr>' + tb.kolommen.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join("") + '</tr></thead><tbody>' +
      tb.rijen.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + mdInline(c) + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table></div></div>';
  }
  function quizHTML(t) {
    return (t.quiz || []).map(function (q, qi) {
      var name = "q-" + t.id.replace(/\./g, "-") + "-" + qi;
      return '<fieldset class="q" data-q="' + qi + '"><legend>' + mdInline(q.vraag) + '</legend><div class="q-list">' +
        q.opties.map(function (o, oi) {
          return '<label class="q-opt" for="' + name + '-' + oi + '"><input type="radio" id="' + name + '-' + oi + '" name="' + name + '" value="' + oi + '"><span>' + mdInline(o) + '</span><span class="q-mark" aria-hidden="true"></span></label>';
        }).join("") + '</div><p class="q-fb" aria-live="polite"></p></fieldset>';
    }).join("");
  }
  function renderTile(id) {
    var t = byId[id];
    if (!t) { location.replace("#/"); return; }
    var l = levelOf(t), prev = TILES[t._i - 1], next = TILES[t._i + 1];
    subnavHost.innerHTML = subnav(t);
    var h = '<article class="view-in" aria-labelledby="tile-title" style="--tint:' + tint(t) + ';--tint-text:' + (t.groep === "extra" ? "var(--text-2)" : "var(--lvl-" + t.niveau + ")") + '">' +
      '<div class="article"><header class="article-head">' +
        '<span class="squircle" data-vt="' + t.id + '">' + icon(t.icoon) + '</span>' +
        '<p class="article-eyebrow">' + t.id + ' · ' + esc(l.naam) + (t.groep ? ' · ' + esc(GROUPS[t.groep].naam) : '') + '</p>' +
        '<h1 id="tile-title">' + esc(t.titel) + '</h1>' +
        '<p class="oneliner">' + mdInline(t.inEenZin) + '</p>' +
        '<div class="chips"><span class="chip">' + t.minuten + ' min lezen</span><span class="chip">Stand per ' + esc(fmtDate(t.stand)) + '</span><span class="chip' + (isRead(t.id) ? " ok" : "") + '" id="read-chip">' + (isRead(t.id) ? CHECK + "Gelezen" : "Nog niet gelezen") + '</span></div>' +
      '</header>' +
      '<section class="sec" aria-labelledby="s-uitleg"><h2 class="sec-title" id="s-uitleg">Hoe het werkt</h2><div class="prose">' + t.uitleg.map(function (p) { return '<p>' + mdInline(p) + '</p>'; }).join("") + '</div>' +
        (t.tabel ? staticTable(t.tabel) : '') + '</section></div>' +
      '<section class="sec wide-sec" aria-labelledby="s-visual"><div style="max-width:760px;margin:0 auto"><p class="sec-kicker">Zie het gebeuren</p><h2 class="sec-title" id="s-visual">' + esc(t.visualTitel || "Zo werkt het") + '</h2></div>' +
        '<div class="stage-card" id="visual"></div></section>' +
      '<div class="article" style="padding-top:0">' +
      '<section class="sec" aria-labelledby="s-meta"><h2 class="sec-title" id="s-meta">De nieuwe collega</h2><div class="metaphor"><span class="squircle">' + icon("person") + '</span><div class="prose">' + t.metafoor.map(function (p) { return '<p>' + mdInline(p) + '</p>'; }).join("") + '</div></div></section>' +
      '</div>' +
      '<section class="sec wide-sec" aria-labelledby="s-cases"><div style="max-width:760px;margin:0 auto"><h2 class="sec-title" id="s-cases">In de praktijk</h2></div><div class="cases">' + t.voorbeelden.map(exampleHTML).join("") + '</div></section>' +
      '<div class="article" style="padding-top:0">' +
      '<section class="sec" aria-labelledby="s-try"><h2 class="sec-title" id="s-try">Probeer zelf</h2><div class="prompt">' +
        '<div class="prompt-head"><span class="eyebrow">Kant-en-klare prompt</span><span><span class="copy-status" aria-live="polite"></span><button class="btn btn-primary btn-small" type="button" data-copy>Kopieer</button></span></div>' +
        '<pre class="prompt-text" tabindex="0">' + esc(t.probeer.prompt) + '</pre>' +
        (t.probeer.tip ? '<p class="prompt-tip">' + mdInline(t.probeer.tip) + '</p>' : '') + '</div></section>' +
      '<section class="sec" aria-labelledby="s-pit"><h2 class="sec-title" id="s-pit">Valkuil</h2><div class="pitfall">' + icon("warn") + '<p>' + mdInline(t.valkuil) + '</p></div></section>' +
      '<section class="sec" aria-labelledby="s-quiz"><h2 class="sec-title" id="s-quiz">Mini-quiz<span class="quiz-score" id="quiz-score"></span></h2><form class="quiz" novalidate>' + quizHTML(t) + '</form></section>' +
      '<footer class="sources" id="end-marker"><p><span class="stand">Stand per ' + esc(fmtDate(t.stand)) + '.</span> Bronnen:</p><ul>' +
        t.bronnen.map(function (b) { return '<li><a href="' + esc(b.url) + '" target="_blank" rel="noopener noreferrer">' + esc(b.label) + '</a></li>'; }).join("") + '</ul></footer>' +
      '</div>' +
      '<nav class="next-prev" aria-label="Vorige en volgende tegel">' +
        (prev ? '<a class="np" href="#/tegel/' + prev.id + '"><span>‹ Vorige · ' + prev.id + '</span><strong>' + esc(prev.titel) + '</strong></a>' : '<span></span>') +
        (next ? '<a class="np next" href="#/tegel/' + next.id + '"><span>Volgende · ' + next.id + ' ›</span><strong>' + esc(next.titel) + '</strong></a>' : '<a class="np next" href="#/"><span>Klaar met dit niveau?</span><strong>Terug naar het overzicht</strong></a>') +
      '</nav></article>';
    main.innerHTML = h;
    try { active.push(window.Visuals.mount(document.getElementById("visual"), t.visual)); }
    catch (e) { document.getElementById("visual").innerHTML = '<p class="stage-caption">Deze animatie kon niet starten. De uitleg hierboven en hieronder is compleet.</p>'; if (window.console) console.error(e); }
    setupCopy(main.querySelector(".prompt"));
    setupQuiz(t);
    observeEnd(t);
  }
  function observeEnd(t) {
    if (endObserver) { endObserver.disconnect(); endObserver = null; }
    var end = document.getElementById("end-marker");
    var done = function () {
      if (markRead(t.id)) {
        var c = document.getElementById("read-chip");
        if (c) { c.className = "chip ok"; c.innerHTML = CHECK + "Gelezen"; }
        var bar = subnavHost.querySelector(".meter-bar");
        if (bar) bar.outerHTML = meterBar(t.niveau, "var(--lvl-" + t.niveau + ")");
      }
    };
    if (!end) return;
    if (!("IntersectionObserver" in window)) { done(); return; }
    endObserver = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { done(); endObserver.disconnect(); endObserver = null; } }); });
    endObserver.observe(end);
  }
  function setupQuiz(t) {
    var form = main.querySelector(".quiz"); if (!form) return;
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    var scoreEl = document.getElementById("quiz-score");
    function score() {
      var s = state.quiz[t.id] || {}, n = 0, g = 0;
      for (var k in s) { n++; if (s[k]) g++; }
      scoreEl.textContent = n ? " · " + g + " van " + t.quiz.length + " goed" : "";
    }
    Array.prototype.forEach.call(form.querySelectorAll(".q"), function (fs) {
      var qi = +fs.getAttribute("data-q"), q = t.quiz[qi];
      fs.addEventListener("change", function (e) {
        var val = +e.target.value, good = val === q.goed;
        Array.prototype.forEach.call(fs.querySelectorAll(".q-opt"), function (lab, i) {
          lab.classList.remove("right", "wrong");
          var mark = lab.querySelector(".q-mark");
          mark.innerHTML = "";
          if (i === q.goed) { lab.classList.add("right"); mark.innerHTML = CHECK; }
          else if (i === val) { lab.classList.add("wrong"); mark.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>'; }
        });
        fs.querySelector(".q-fb").innerHTML = "<strong>" + (good ? "Goed." : "Niet helemaal.") + "</strong> " + mdInline(good ? q.goedUitleg : q.foutUitleg);
        state.quiz[t.id] = state.quiz[t.id] || {};
        if (!(("v" + qi) in state.quiz[t.id])) { state.quiz[t.id]["v" + qi] = good; save(); }
        score();
      });
    });
    score();
  }

  /* ---------- Kopiëren met terugval ---------- */
  function setupCopy(box) {
    if (!box) return;
    var btn = box.querySelector("[data-copy]"), pre = box.querySelector(".prompt-text"), st = box.querySelector(".copy-status");
    function selectText() { var r = document.createRange(); r.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
    function ok() { st.className = "copy-status"; st.textContent = "Gekopieerd"; }
    function fallback() {
      selectText();
      var done = false;
      try { done = document.execCommand("copy"); } catch (e) { done = false; }
      if (done) ok(); else { st.className = "copy-status warn"; st.textContent = "Tekst is geselecteerd: druk op Ctrl+C"; }
    }
    btn.addEventListener("click", function () {
      st.textContent = "";
      try {
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(pre.textContent).then(ok, fallback);
        else fallback();
      } catch (e) { fallback(); }
    });
  }

  /* ---------- Over deze app ---------- */
  function renderAbout() {
    var o = DATA.over;
    var allSources = {}, list = [];
    TILES.forEach(function (t) { t.bronnen.forEach(function (b) { if (!allSources[b.url]) { allSources[b.url] = 1; list.push(b); } }); });
    list.sort(function (a, b) { return a.label.localeCompare(b.label, "nl"); });
    main.innerHTML = '<div class="about view-in">' +
      '<p class="eyebrow">Over deze app</p><h1>' + esc(DATA.app.titel) + '.</h1>' +
      '<div class="prose" style="margin-top:18px">' + o.intro.map(function (p) { return '<p>' + mdInline(p) + '</p>'; }).join("") + '</div>' +
      '<h2>Stand per ' + esc(fmtDate(DATA.app.stand)) + '</h2><div class="prose">' + o.stand.map(function (p) { return '<p>' + mdInline(p) + '</p>'; }).join("") + '</div>' +
      '<h2>Een tegel voorstellen of verbeteren</h2><div class="prose">' + o.voorstel.map(function (p) { return '<p>' + mdInline(p) + '</p>'; }).join("") + '</div>' +
      '<div class="prompt" style="margin-top:16px"><div class="prompt-head"><span class="eyebrow">Sjabloon voor een voorstel</span><span><span class="copy-status" aria-live="polite"></span><button class="btn btn-primary btn-small" type="button" data-copy>Kopieer</button></span></div><pre class="prompt-text" tabindex="0">' + esc(o.sjabloon) + '</pre></div>' +
      '<h2>Bediening</h2><div class="kbd-list"><kbd>/</kbd><span>Zoeken</span><kbd>←</kbd><span>Vorige tegel</span><kbd>→</kbd><span>Volgende tegel</span><kbd>Esc</kbd><span>Zoekopdracht wissen of terug naar het overzicht</span><kbd>Tab</kbd><span>Door alle knoppen en links</span></div>' +
      '<h2>Je voortgang</h2><div class="prose"><p>' + mdInline(o.voortgang) + '</p></div>' +
      '<h2>Alle bronnen</h2><ul class="src-list">' + list.map(function (b) { return '<li><a href="' + esc(b.url) + '" target="_blank" rel="noopener noreferrer">' + esc(b.label) + '</a></li>'; }).join("") + '</ul>' +
      '</div>';
    setupCopy(main.querySelector(".prompt"));
  }

  /* ---------- Router met korte overgangen ---------- */
  var lastTile = null;
  function render() {
    stopVisuals();
    if (endObserver) { endObserver.disconnect(); endObserver = null; }
    var hsh = location.hash || "#/";
    var q = searchEl.value.trim();
    var m = hsh.match(/^#\/tegel\/([\d.]+)$/);
    if (m) {
      if (q) { searchEl.value = ""; }
      renderTile(m[1]);
      document.title = byId[m[1]] ? byId[m[1]].titel + " · " + DATA.app.titel : DATA.app.titel;
      window.scrollTo(0, 0);
      return { tile: m[1] };
    }
    subnavHost.innerHTML = "";
    if (q) { renderSearch(q); document.title = "Zoeken · " + DATA.app.titel; return {}; }
    if (hsh === "#/over") { renderAbout(); document.title = "Over · " + DATA.app.titel; window.scrollTo(0, 0); return {}; }
    renderHome();
    document.title = DATA.app.titel;
    var anchor = hsh.length > 2 && hsh.indexOf("#/") !== 0 ? document.getElementById(hsh.slice(1)) : null;
    if (anchor) anchor.scrollIntoView();
    else if (lastTile) {
      var el = main.querySelector('[data-tile="' + lastTile + '"]');
      if (el) { var r = el.getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top - window.innerHeight / 3); }
      else window.scrollTo(0, 0);
    } else window.scrollTo(0, 0);
    return {};
  }
  function route() {
    var target = (location.hash.match(/^#\/tegel\/([\d.]+)$/) || [])[1] || null;
    var shared = target || lastTile;
    var doRender = function () {
      var info = render();
      if (info.tile) lastTile = info.tile;
      return info;
    };
    if (!document.startViewTransition || reducedMotion()) { doRender(); focusMain(target); return; }
    var old = shared ? document.querySelector('[data-vt="' + shared + '"]') : null;
    if (old) old.style.viewTransitionName = "shared-squircle";
    var vt = document.startViewTransition(function () {
      if (old) old.style.viewTransitionName = "";
      doRender();
      var nw = shared ? document.querySelector('[data-vt="' + shared + '"]') : null;
      if (nw) nw.style.viewTransitionName = "shared-squircle";
    });
    vt.finished.then(function () {
      var n = document.querySelector('[style*="shared-squircle"]');
      if (n) n.style.viewTransitionName = "";
      focusMain(target);
    }, function () {});
  }
  function focusMain(target) { if (target) main.focus({ preventScroll: true }); }
  window.addEventListener("hashchange", route);

  /* ---------- Zoeken en toetsenbord ---------- */
  var searchTimer = null;
  searchEl.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      if (searchEl.value.trim() && location.hash.indexOf("#/tegel/") === 0) { history.replaceState(null, "", "#/"); }
      stopVisuals(); subnavHost.innerHTML = "";
      if (searchEl.value.trim()) renderSearch(searchEl.value.trim()); else render();
    }, 120);
  });
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;
    if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); searchEl.focus(); searchEl.select(); return; }
    if (e.key === "Escape") {
      if (searchEl.value) { searchEl.value = ""; render(); searchEl.blur(); return; }
      if (location.hash.indexOf("#/tegel/") === 0 || location.hash === "#/over") location.hash = "#/";
      return;
    }
    if (typing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var m = (location.hash || "").match(/^#\/tegel\/([\d.]+)$/);
    if (!m || !byId[m[1]]) return;
    var t = byId[m[1]];
    if (e.key === "ArrowLeft" && TILES[t._i - 1]) location.hash = "#/tegel/" + TILES[t._i - 1].id;
    if (e.key === "ArrowRight" && TILES[t._i + 1]) location.hash = "#/tegel/" + TILES[t._i + 1].id;
  });

  render();
})();
