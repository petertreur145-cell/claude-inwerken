/* Claude inwerken — presentatie.
   Volgorde: overzicht → tegels van blok 1 (→ quiz) → overzicht → blok 2 → … Elke positie is één scherm (slide).
   Volgende: pijl rechts, spatie, PageDown, klik of rechtsklik. Eerst de stappen van de visual, dan de volgende tegel.
   Vorige: pijl links of PageUp. Esc: overzicht. F: volledig scherm. Niets speelt vanzelf af: geen timers.
   Het podium is 1600 × 900 en schaalt mee met het venster, zodat de opmaak op elk scherm gelijk blijft. */
(function () {
  "use strict";
  var W = 1600, H = 900;
  var data = JSON.parse(document.getElementById("tegels").textContent);
  var md = window.mdInline, esc = window.esc;
  var deck = document.getElementById("deck"), slide = document.getElementById("slide");
  var whereEl = document.getElementById("where"), dotsEl = document.getElementById("dots");
  var SVG = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var BTN = {
    home: SVG('<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'),
    prev: SVG('<path d="m15 5-7 7 7 7"/>'),
    next: SVG('<path d="m9 5 7 7-7 7"/>'),
    full: SVG('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    exit: SVG('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>')
  };

  /* ---------- Volgorde ---------- */
  var blokken = data.blokken;
  var klaar = function (t) { return !!t.visual; }; // een tegel zonder visual staat alleen nog op de agenda
  var seq = [];
  blokken.forEach(function (b, i) {
    var tegels = data.tegels.filter(function (t) { return t.blok === b.id && klaar(t); });
    var quiz = (data.quizzen || []).filter(function (q) { return q.blok === b.id; })[0];
    if (!tegels.length && !quiz) return;
    seq.push({ kind: "home", hl: i });
    tegels.forEach(function (t, k) { seq.push({ kind: "tile", tile: t, blok: b, nr: k + 1, van: tegels.length }); });
    if (quiz) seq.push({ kind: "quiz", quiz: quiz, blok: b });
  });
  seq.push({ kind: "home", hl: blokken.length }); // alles gehad

  var pos = 0, step = 0, steps = 0;

  /* ---------- Schermen ---------- */
  function homeHTML(hl) {
    return '<div class="home">' +
      '<header class="home-head"><span class="logo" aria-hidden="true">N</span><div><p class="eyebrow">' + esc(data.app.ondertitel) + '</p><h1>' + esc(data.app.titel) + '</h1></div></header>' +
      '<nav class="home-grid" aria-label="Blokken">' + blokken.map(function (b, i) {
        var tegels = data.tegels.filter(function (t) { return t.blok === b.id; });
        var open = tegels.some(klaar);
        var cls = "blk c-" + esc(b.kleur) + (i === hl ? " is-hl" : "") + (i < hl ? " is-done" : "") + (open ? "" : " is-todo");
        return '<a class="' + cls + '" href="#/' + esc((tegels.filter(klaar)[0] || {}).id || "") + '" data-blok="' + b.id + '"' + (open ? "" : ' aria-disabled="true"') + '>' +
          '<span class="blk-num">' + (i < hl ? window.iconSVG("check") : b.id) + '</span>' +
          '<h2>' + esc(b.naam) + '</h2>' +
          '<ol>' + tegels.map(function (t) { return '<li' + (klaar(t) ? "" : ' class="is-todo"') + '>' + esc(t.titel) + '</li>'; }).join("") + '</ol>' +
        '</a>';
      }).join("") + '</nav>' +
      '<p class="home-hint">Klik op een blok <span>·</span> → volgende <span>·</span> F volledig scherm</p>' +
    '</div>';
  }
  function tileHTML(p) {
    var t = p.tile, v = t.visual, render = window.VISUALS[v.type];
    var punten = t.punten && t.punten.length ? '<ul class="punten">' + t.punten.map(function (x) { return '<li>' + md(x) + '</li>'; }).join("") + '</ul>' : "";
    return '<article class="tile c-' + esc(p.blok.kleur) + (punten ? " has-punten" : "") + '">' +
      '<header class="tile-head"><span class="tile-mark" aria-hidden="true"></span><h1>' + md(t.titel) + '</h1>' + (t.zin ? '<p class="zin">' + md(t.zin) + '</p>' : '') + '</header>' +
      '<div class="tile-main"><div class="tile-visual v-' + esc(v.type) + '-wrap">' + render(v) + '</div>' + punten + '</div>' +
    '</article>';
  }

  function render(atEnd) {
    var p = seq[pos];
    slide.innerHTML = p.kind === "home" ? homeHTML(p.hl) : tileHTML(p);
    slide.classList.add("no-anim");
    steps = 0;
    Array.prototype.forEach.call(slide.querySelectorAll("[data-s]"), function (el) { steps = Math.max(steps, +el.getAttribute("data-s")); });
    step = atEnd ? steps : 0;
    applyStep();
    slide.getBoundingClientRect(); // eerste beeld zonder overgang
    slide.classList.remove("no-anim");
    if (location.hash !== hashOf(p)) location.hash = hashOf(p);
    document.title = (p.kind === "home" ? "" : p.tile.titel.replace(/[*`]/g, "") + " · ") + data.app.titel;
  }
  function applyStep() {
    Array.prototype.forEach.call(slide.querySelectorAll("[data-s]"), function (el) {
      var k = +el.getAttribute("data-s");
      el.classList.toggle("is-on", step >= k);
      el.classList.toggle("is-cur", step === k);
    });
    var p = seq[pos];
    whereEl.textContent = p.kind === "home" ? "Overzicht" : p.blok.naam + "  " + p.nr + "/" + p.van;
    dotsEl.innerHTML = steps ? new Array(steps + 1).join("<i></i>") : "";
    Array.prototype.forEach.call(dotsEl.children, function (d, i) { d.className = i < step ? "on" : ""; });
  }

  /* ---------- Navigatie ---------- */
  function next() {
    if (step < steps) { step++; applyStep(); return; }
    if (pos < seq.length - 1) { pos++; render(false); }
  }
  function prev() {
    if (step > 0) { step--; applyStep(); return; }
    if (pos > 0) { pos--; render(true); }
  }
  function home() {
    var p = seq[pos];
    if (p.kind === "home") return;
    var i = blokken.indexOf(p.blok);
    for (var k = 0; k < seq.length; k++) if (seq[k].kind === "home" && seq[k].hl === i) { pos = k; render(false); return; }
  }
  function openBlok(id) {
    for (var k = 0; k < seq.length; k++) if (seq[k].kind === "tile" && seq[k].blok.id === id) { pos = k; render(false); return; }
  }
  function goHash(first) {
    var id = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    for (var k = 0; k < seq.length; k++) if (seq[k].kind === "tile" && seq[k].tile.id === id) { pos = k; render(false); return; }
    if (first || seq[pos].kind !== "home") { pos = 0; render(false); }
  }
  function hashOf(p) { return p.kind === "home" ? "#/" : "#/" + p.tile.id; }
  // alleen reageren als iemand zelf het adres wijzigt (niet op ons eigen bijwerken)
  window.addEventListener("hashchange", function () { if (location.hash !== hashOf(seq[pos])) goHash(); });

  /* ---------- Volledig scherm ---------- */
  var fullBtn = document.querySelector('[data-act="full"]');
  function isFull() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function toggleFull() {
    try {
      if (isFull()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else {
        var r = (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen).call(document.documentElement);
        if (r && r.catch) r.catch(function () {});
      }
    } catch (e) { /* volledig scherm niet toegestaan: gewoon doorgaan */ }
  }
  function syncFull() { fullBtn.innerHTML = isFull() ? BTN.exit : BTN.full; fullBtn.setAttribute("aria-label", isFull() ? "Volledig scherm sluiten (F)" : "Volledig scherm (F)"); }
  document.addEventListener("fullscreenchange", syncFull);
  document.addEventListener("webkitfullscreenchange", syncFull);

  /* ---------- Bediening ---------- */
  var ACT = { home: home, prev: prev, next: next, full: toggleFull };
  Array.prototype.forEach.call(document.querySelectorAll(".bar-btn"), function (b) {
    var a = b.getAttribute("data-act");
    if (BTN[a]) b.innerHTML = BTN[a];
    b.addEventListener("click", function (e) { e.stopPropagation(); ACT[a](); b.blur(); });
  });
  document.addEventListener("click", function (e) {
    if (e.button !== 0) return;
    var blk = e.target.closest && e.target.closest(".blk");
    if (blk) { e.preventDefault(); if (!blk.hasAttribute("aria-disabled")) openBlok(+blk.getAttribute("data-blok")); return; }
    if (e.target.closest && e.target.closest("button, a, input, select, textarea")) return;
    next();
  });
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); next(); });
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key, onCtl = e.target.closest && e.target.closest("button, a");
    if ((k === " " || k === "Enter") && onCtl) return; // knop of link met het toetsenbord bedienen
    if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Spacebar" || k === "Enter") { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") { e.preventDefault(); prev(); }
    else if (k === "Escape" || k === "Esc" || k === "Home") { e.preventDefault(); home(); }
    else if (k === "f" || k === "F") { e.preventDefault(); toggleFull(); }
    else if (/^[1-9]$/.test(k) && seq[pos].kind === "home") { e.preventDefault(); openBlok(+k); }
  });

  /* ---------- Schalen ---------- */
  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var s = Math.min(vw / W, vh / H);
    deck.style.transform = "translate(" + Math.round((vw - W * s) / 2) + "px," + Math.round((vh - H * s) / 2) + "px) scale(" + s + ")";
  }
  window.addEventListener("resize", fit);
  fit();
  syncFull();
  goHash(true);
})();
