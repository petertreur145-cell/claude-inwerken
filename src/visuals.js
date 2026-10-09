/* Claude inwerken — interactieve visuals.
   Vier soorten, gekozen met visual.type in tegels.json:
   - "scene": declaratieve animatie in stappen (elementen + stappen die eigenschappen wijzigen)
   - "desk":  het bureau dat volloopt (tegel 1.4)
   - "table": interactieve tabel met filters en uitleg per rij
   - "chat":  een nagespeeld gesprek in een Claude-venster, eventueel twee naast elkaar om te vergelijken
   Niets speelt vanzelf af: elke stap gaat op klik (ook handig bij een presentatie).
   Bij prefers-reduced-motion verschijnt alles zonder beweging. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var reduced = function () { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); };
  var md = function (s) { return window.mdInline ? window.mdInline(s) : String(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // kind "scene": Volgende stap is de hoofdknop; kind "chat": Afspelen speelt het gekozen gesprek af
  function controlsHTML(kind) {
    var prev = '<button class="btn btn-small" type="button" data-act="prev">‹ Vorige</button>';
    if (kind === "scene") return '<div class="stage-controls">' + prev +
      '<button class="btn btn-primary btn-small" type="button" data-act="next">Volgende stap ›</button>' +
      '<span class="spacer"></span><span class="dots" aria-hidden="true"></span>' +
      '<button class="btn btn-small" type="button" data-act="play">Opnieuw</button></div>';
    return '<div class="stage-controls">' +
      '<button class="btn btn-primary btn-small" type="button" data-act="play">▶ Afspelen</button>' + prev +
      '<button class="btn btn-small" type="button" data-act="next">Volgende ›</button>' +
      '<span class="spacer"></span><span class="dots" aria-hidden="true"></span>' +
      '<button class="btn btn-small meet-toggle" type="button" data-act="meet" aria-pressed="false">Meetingmodus</button></div>';
  }
  // Meetingmodus: gesprekken meteen helemaal tonen. Onthouden in de browser (als dat mag).
  var MEET_KEY = "claude-inwerken:meeting";
  function getMeet() { try { return window.localStorage.getItem(MEET_KEY) === "1"; } catch (e) { return false; } }
  function setMeet(on) { try { window.localStorage.setItem(MEET_KEY, on ? "1" : "0"); } catch (e) {} }

  /* ================= Stapbediening (voor elke visual) =================
     Niets loopt vanzelf. Volgende stap: klik of rechtsklik in de visual, pijl rechts, spatie of PageDown.
     Vorige stap: pijl links of PageUp. Home of "Opnieuw": terug naar stap 1. Geen timers. */
  function stepBarHTML() {
    return '<div class="step-bar">' +
      '<span class="step-count" aria-hidden="true"></span>' +
      '<p class="stage-text" aria-live="polite"></p>' +
      '<span class="step-btns">' +
        '<button class="btn btn-small btn-icon" type="button" data-act="prev" aria-label="Vorige stap">‹</button>' +
        '<button class="btn btn-small btn-icon" type="button" data-act="next" aria-label="Volgende stap">›</button>' +
        '<button class="btn btn-small" type="button" data-act="restart">Opnieuw</button>' +
      '</span></div><p class="step-hint"></p>';
  }
  function stepper(root, n, show, captions) {
    var cur = 0;
    var count = root.querySelector(".step-count"), text = root.querySelector(".step-bar .stage-text"), hint = root.querySelector(".step-hint");
    var prevB = root.querySelector('[data-act="prev"]'), nextB = root.querySelector('[data-act="next"]'), restartB = root.querySelector('[data-act="restart"]');
    root.tabIndex = 0;
    root.setAttribute("role", "group");
    root.classList.add("stepper");
    function go(k) {
      cur = Math.max(0, Math.min(n - 1, k));
      show(cur);
      count.textContent = (cur + 1) + "/" + n;
      text.innerHTML = md(captions[cur] || "");
      prevB.disabled = cur === 0; nextB.disabled = cur === n - 1; restartB.disabled = cur === 0;
      hint.textContent = cur < n - 1 ? "Klik in het beeld of druk op → voor de volgende stap." : (n > 1 ? "Laatste stap. Met Opnieuw begin je bij stap 1." : "");
      root.setAttribute("aria-label", "Animatie, stap " + (cur + 1) + " van " + n + ". Klik of pijl rechts: volgende stap. Pijl links: vorige stap.");
    }
    function interactive(t) { return t.closest && t.closest("button, a, input, label, select, textarea, summary, .step-btns, .stage-choices"); }
    function focusRoot() { try { root.focus({ preventScroll: true }); } catch (e) { root.focus(); } }
    root.addEventListener("click", function (e) { if (interactive(e.target)) return; go(cur + 1); focusRoot(); });
    root.addEventListener("contextmenu", function (e) { if (interactive(e.target)) return; e.preventDefault(); go(cur + 1); focusRoot(); });
    root.addEventListener("keydown", function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var k = e.key, onBtn = interactive(e.target);
      if ((k === " " || k === "Enter") && onBtn) return;
      var to = null;
      if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Spacebar") to = cur + 1;
      else if (k === "ArrowLeft" || k === "PageUp") to = cur - 1;
      else if (k === "Home") to = 0;
      if (to === null) return;
      e.preventDefault(); e.stopPropagation();
      go(to);
    });
    function btn(b, fn) { b.addEventListener("click", function () { fn(); if (b.disabled) focusRoot(); }); }
    btn(prevB, function () { go(cur - 1); });
    btn(nextB, function () { go(cur + 1); });
    btn(restartB, function () { go(0); });
    go(0);
    return { go: go };
  }

  /* ================= Scene ================= */
  function mountScene(root, def) {
    var W = def.w || 420, H = def.h || 260;
    var steps = def.steps || [{ caption: "" }];
    var choices = def.choices || null;
    var items = def.items || [];
    root.innerHTML =
      '<div class="stage-wrap"><div class="stage-box"><div class="stage" style="width:' + W + 'px;height:' + H + 'px"></div></div></div>' +
      (choices ? '<div class="stage-choices" role="group" aria-label="Kies een situatie">' + choices.map(function (c, i) { return '<button type="button" class="choice" data-choice="' + i + '" aria-pressed="false">' + esc(c.label) + '</button>'; }).join("") + '</div>' : '') +
      stepBarHTML();
    var box = root.querySelector(".stage-box"), stage = root.querySelector(".stage");
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "s-svg"); svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("aria-hidden", "true");
    stage.appendChild(svg);
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", def.alt || "Animatie, uitgelegd in de tekst eronder");

    var els = {};
    items.forEach(function (it) {
      var e;
      if (it.type === "line") {
        e = document.createElementNS(NS, "path");
        e.setAttribute("pathLength", "1");
        svg.appendChild(e);
      } else {
        e = document.createElement("div");
        stage.appendChild(e);
        if (it.type === "bar") e.appendChild(document.createElement("i"));
      }
      els[it.id] = { el: e, def: it };
    });

    function stateAt(k) {
      var st = {};
      items.forEach(function (it) { st[it.id] = Object.assign({}, it); });
      for (var i = 0; i <= k && i < steps.length; i++) {
        var set = steps[i].set || {};
        for (var id in set) if (st[id]) Object.assign(st[id], set[id]);
      }
      return st;
    }
    function tone(p) { return p.tone ? " t-" + p.tone : ""; }
    function apply(id, p) {
      var rec = els[id]; if (!rec) return;
      var e = rec.el, t = p.type;
      var op = p.opacity == null ? 1 : p.opacity;
      if (t === "line") {
        var d = p.d || ("M" + p.x1 + " " + p.y1 + " L" + p.x2 + " " + p.y2);
        if (p.arrow && !p.d) { // pijlpunt aan het eind
          var ang = Math.atan2(p.y2 - p.y1, p.x2 - p.x1), al = 9;
          d += " M" + (p.x2 + al * Math.cos(ang + 2.6)).toFixed(1) + " " + (p.y2 + al * Math.sin(ang + 2.6)).toFixed(1) + " L" + p.x2 + " " + p.y2 +
            " L" + (p.x2 + al * Math.cos(ang - 2.6)).toFixed(1) + " " + (p.y2 + al * Math.sin(ang - 2.6)).toFixed(1);
        }
        e.setAttribute("d", d);
        e.setAttribute("class", "s-line" + tone(p) + (p.dash ? " dash" : ""));
        if (!p.dash) { e.style.strokeDasharray = "1"; e.style.strokeDashoffset = String(1 - (p.draw == null ? 1 : p.draw)); }
        else { e.style.strokeDasharray = ""; e.style.strokeDashoffset = ""; }
        e.style.opacity = op;
        if (p.width) e.style.strokeWidth = p.width;
        return;
      }
      var cls = "s-item ";
      if (t === "card") cls += "s-card" + (p.center ? " center" : "") + (p.col ? " col" : "") + (p.big ? " big" : "");
      else if (t === "icon") cls += "s-icon" + (p.round ? " round" : "");
      else if (t === "glyph") cls += "s-glyph";
      else if (t === "text") cls += "s-text" + (p.align ? " " + p.align : "") + (p.bold ? " b" : "") + (p.head ? " h" : "") + (p.mono ? " mono" : "");
      else if (t === "bar") cls += "s-bar";
      else if (t === "dot") cls += "s-dot";
      else if (t === "zone") cls += "s-zone";
      e.className = cls + tone(p);
      var w = p.w, h = p.h;
      if (t === "icon" || t === "glyph") { w = h = p.size || 36; }
      if (t === "dot") { w = h = (p.r || 6) * 2; }
      if (w != null) e.style.width = w + "px";
      if (h != null) e.style.height = h + "px";
      if (t === "text" && p.size) e.style.fontSize = p.size + "px";
      e.style.opacity = op;
      e.style.transform = "translate(" + (p.x || 0) + "px," + (p.y || 0) + "px)" + (p.scale != null && p.scale !== 1 ? " scale(" + p.scale + ")" : "") + (p.rotate ? " rotate(" + p.rotate + "deg)" : "");
      var key = (p.icon || "") + "|" + (p.label != null ? p.label : "") + "|" + (p.text != null ? p.text : "");
      if (rec.key !== key) {
        rec.key = key;
        if (t === "card") e.innerHTML = (p.icon ? window.iconSVG(p.icon) : "") + (p.label != null ? '<span class="lbl">' + md(p.label) + '</span>' : "");
        else if (t === "icon" || t === "glyph") e.innerHTML = window.iconSVG(p.icon || "doc");
        else if (t === "text") e.innerHTML = md(p.text || "");
      }
      if (t === "bar") e.firstChild.style.width = Math.max(0, Math.min(1, p.value || 0)) * 100 + "%";
      if (t === "card" || (t === "text" && h)) fitText(rec, p, w, h);
    }
    // tekst die niet past krimpt stapsgewijs, zodat het op elk lettertype goed gaat
    function fitText(rec, p, w, h) {
      var e = rec.el, sig = rec.key + "|" + w + "|" + h;
      if (rec.fitSig === sig) return;
      rec.fitSig = sig;
      var size = p.size || (p.big ? 15 : 14);
      e.style.fontSize = size + "px";
      for (var i = 0; i < 10 && ((w && e.scrollWidth > w + 1) || (h && e.scrollHeight > h + 1)); i++) {
        size -= 0.5;
        e.style.fontSize = size + "px";
      }
    }
    var first = true;
    function show(k) {
      if (first) stage.classList.add("no-anim");
      var st = stateAt(k);
      for (var id in st) apply(id, st[id]);
      if (first) { stage.getBoundingClientRect(); stage.classList.remove("no-anim"); first = false; }
      if (choices) Array.prototype.forEach.call(root.querySelectorAll(".choice"), function (b) { b.setAttribute("aria-pressed", String(choices[+b.getAttribute("data-choice")].step === k)); });
    }
    // schalen naar de breedte, tekst blijft leesbaar
    function fit() {
      var bw = box.clientWidth || W;
      var s = Math.min(bw / W, def.maxScale || 1.45);
      stage.style.transform = "scale(" + s + ")";
      stage.style.left = Math.max(0, (bw - W * s) / 2) + "px";
      box.style.height = Math.ceil(H * s) + "px";
    }
    fit();
    var ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(fit); ro.observe(box); } else window.addEventListener("resize", fit);
    var nav = stepper(root, steps.length, show, steps.map(function (x) { return x.caption || ""; }));
    if (choices) root.querySelector(".stage-choices").addEventListener("click", function (e) {
      var b = e.target.closest(".choice"); if (!b) return;
      nav.go(choices[+b.getAttribute("data-choice")].step);
    });
    return { stop: function () { if (ro) ro.disconnect(); else window.removeEventListener("resize", fit); } };
  }

  /* ================= Bureau (1.4) ================= */
  function mountDesk(root) {
    root.innerHTML =
      '<div class="stage-wrap"><div class="stage-box" style="max-width:720px"><svg class="desk-svg" role="img" aria-label="Documenten vallen op het bureau van Claude; een meter toont hoeveel tokens het gesprek gebruikt, van 0 tot 1 miljoen." style="display:block;width:100%;height:auto"></svg></div></div>' +
      '<div class="stage-caption"><span class="stage-step">Stap 0</span><p class="stage-text" aria-live="polite">Een leeg bureau.</p></div>' +
      '<ol class="stage-steps" hidden><li>Elk bericht en elk bestand komt op het bureau en vult de meter.</li><li>Rond 80% worden de oudste stukken vaag: dat heet context rot.</li><li>Claude vat de oudste stukken samen in één map en er is weer ruimte.</li><li>Een nieuwe chat is een schoon bureau.</li></ol>' +
      '<div class="stage-controls"><button class="btn btn-primary btn-small" type="button" data-act="add">Leg document neer</button>' +
      '<button class="btn btn-small" type="button" data-act="play">Alles afspelen</button>' +
      '<button class="btn btn-small" type="button" data-act="compact"><span class="mono">/compact</span></button>' +
      '<span class="spacer"></span><button class="btn btn-small" type="button" data-act="clear">Nieuwe chat</button></div>';
    var svg = root.querySelector("svg");
    var capStep = root.querySelector(".stage-step"), capText = root.querySelector(".stage-text");
    var CAP = 1000000;
    var DOCS = [["Jouw vraag", 2000], ["Antwoord", 6000], ["Mailthread", 40000], ["Handleiding", 260000], ["Excel-export", 180000], ["Foto’s storing", 90000], ["Antwoord", 12000], ["Logbestand", 240000], ["Nog een vraag", 3000]];
    var narrow = (root.clientWidth || 700) < 560;
    var L = narrow ? {
      vw: 360, vh: 470, desk: [8, 8, 344, 384], label: [22, 30], folder: [22, 44],
      cols: 3, cw: 104, ch: 56, x0: 22, y0: 120, gx: 8, gy: 12, rot: [22, 380],
      g: { x: 20, y: 420, w: 320, h: 10 }, ticks: [0, 500000, 1000000], below: true
    } : {
      vw: 680, vh: 290, desk: [16, 10, 648, 176], label: [32, 32], folder: [32, 92],
      cols: 5, cw: 96, ch: 56, x0: 140, y0: 54, gx: 10, gy: 16, rot: [140, 178],
      g: { x: 40, y: 236, w: 600, h: 10 }, ticks: [0, 250000, 500000, 750000, 1000000], below: false
    };
    svg.setAttribute("viewBox", "0 0 " + L.vw + " " + L.vh);
    var G = L.g, items = [], summary = 0, placed = 0, step = 0, timer = null;
    function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
    function fmt(n) { return n.toLocaleString("nl-NL"); }
    function kTok(n) { return n >= 1000 ? Math.round(n / 1000) + "k" : String(n); }
    el("rect", { x: L.desk[0], y: L.desk[1], width: L.desk[2], height: L.desk[3], rx: 16, "class": "desk-top" }, svg);
    el("text", { x: L.label[0], y: L.label[1], "class": "desk-label" }, svg).textContent = "BUREAU · DIT GESPREK";
    var folder = el("g", { "class": "folder", opacity: 0, transform: "translate(" + L.folder[0] + " " + L.folder[1] + ")" }, svg);
    el("path", { d: "M0 6a6 6 0 0 1 6-6h24l6 7h50a6 6 0 0 1 6 6v50a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z" }, folder);
    el("text", { x: 10, y: 34 }, folder).textContent = "Samenvatting";
    el("text", { x: 10, y: 52, "class": "tok" }, folder).textContent = "60k tokens";
    var docsG = el("g", {}, svg);
    var rot = el("text", { x: L.rot[0], y: L.rot[1], "class": "rot-note", opacity: 0 }, svg);
    rot.textContent = "Oudste stukken worden vaag: context rot";
    el("rect", { x: G.x, y: G.y, width: G.w, height: G.h, rx: 5, "class": "gauge-bg" }, svg);
    var fill = el("rect", { x: G.x, y: G.y, width: 0, height: G.h, rx: 5, "class": "gauge-fill" }, svg);
    L.ticks.forEach(function (v) {
      var x = G.x + G.w * v / CAP;
      el("line", { x1: x, y1: G.y + G.h + 3, x2: x, y2: G.y + G.h + 8, "class": "gauge-tick" }, svg);
      el("text", { x: x, y: G.y + G.h + 21, "text-anchor": v === 0 ? "start" : (v === CAP ? "end" : "middle"), "class": "gauge-text" }, svg).textContent = v === CAP ? "1M tokens" : kTok(v);
    });
    var lx = G.x + G.w * 0.8;
    el("line", { x1: lx, y1: G.y - 8, x2: lx, y2: G.y + G.h + (L.below ? 26 : 3), "class": "gauge-limit" }, svg);
    el("text", L.below ? { x: lx - 6, y: G.y + G.h + 38, "text-anchor": "end", "class": "gauge-text" } : { x: lx - 6, y: G.y - 4, "text-anchor": "end", "class": "gauge-text" }, svg).textContent = "80%: hier gaat hij samenvatten";
    var used = el("text", { x: G.x, y: G.y - (L.below ? 10 : 16), "class": "gauge-strong" }, svg);
    function slot(i) { return { x: L.x0 + (i % L.cols) * (L.cw + L.gx), y: L.y0 + Math.floor(i / L.cols) * (L.ch + L.gy) }; }
    function total() { return items.reduce(function (s, d) { return s + d.t; }, 0) + summary; }
    function makeDoc(label, t) {
      var g = el("g", { "class": "desk-doc" }, docsG);
      var layers = t > 150000 ? 3 : (t > 30000 ? 2 : 1);
      for (var k = layers - 1; k > 0; k--) el("rect", { x: k * 4, y: -k * 4, width: L.cw - 8, height: L.ch - 8, rx: 6, "class": "under" }, g);
      el("rect", { x: 0, y: 0, width: L.cw - 8, height: L.ch - 8, rx: 6, "class": "paper" }, g);
      el("line", { x1: 9, y1: 27, x2: L.cw - 24, y2: 27 }, g);
      el("text", { x: 9, y: 17 }, g).textContent = label;
      el("text", { x: 9, y: L.ch - 15, "class": "tok" }, g).textContent = kTok(t) + " tokens";
      return g;
    }
    function layout() { items.forEach(function (d, i) { var p = slot(i); d.g.style.transform = "translate(" + p.x + "px," + p.y + "px)"; }); }
    function update(caption) {
      var tot = total(), pct = tot / CAP;
      fill.setAttribute("width", Math.min(1, pct) * G.w);
      fill.setAttribute("class", "gauge-fill" + (pct >= 0.8 ? " hot" : ""));
      used.textContent = fmt(tot) + " / " + fmt(CAP) + " tokens · " + Math.round(pct * 100) + "%";
      if (caption) capText.textContent = caption;
      capStep.textContent = "Stap " + step;
      root.querySelector('[data-act="add"]').disabled = placed >= DOCS.length;
      root.querySelector('[data-act="compact"]').disabled = items.length < 3;
      root.querySelector('[data-act="play"]').textContent = step > 0 ? "Alles opnieuw" : "Alles afspelen";
    }
    function addDoc() {
      if (placed >= DOCS.length) return false;
      var d = DOCS[placed++], g = makeDoc(d[0], d[1]);
      items.push({ t: d[1], g: g });
      var p = slot(items.length - 1);
      if (!reduced()) {
        g.style.transition = "none"; g.style.opacity = "0";
        g.style.transform = "translate(" + p.x + "px," + (p.y - 44) + "px)";
        g.getBoundingClientRect();
        g.style.transition = ""; g.style.opacity = "";
      }
      g.style.transform = "translate(" + p.x + "px," + p.y + "px)";
      step++;
      update(d[0] + " erbij: +" + fmt(d[1]) + " tokens. " + (total() / CAP >= 0.8 ? "Het bureau is bijna vol." : "Er is nog ruimte."));
      return true;
    }
    function rotOld() {
      var n = Math.max(1, items.length - 4);
      items.forEach(function (d, i) { d.g.classList.toggle("faded", i < n); });
      rot.setAttribute("opacity", 1);
      step++;
      update("Bijna vol. De oudste stukken worden vaag: details daaruit vindt hij slechter terug. Dat heet context rot.");
    }
    function compact() {
      if (items.length < 3) return;
      var n = Math.max(2, items.length - 4), old = items.slice(0, n);
      items = items.slice(n);
      old.forEach(function (d) {
        d.g.style.transform = "translate(" + (L.folder[0] + 20) + "px," + (L.folder[1] + 20) + "px) scale(0.3)";
        d.g.style.opacity = "0";
        setTimeout(function () { if (d.g.parentNode) d.g.parentNode.removeChild(d.g); }, reduced() ? 0 : 520);
      });
      summary = 60000;
      items.forEach(function (d) { d.g.classList.remove("faded"); });
      folder.setAttribute("opacity", 1); rot.setAttribute("opacity", 0);
      layout(); step++;
      update("Claude vat de oudste " + n + " stukken samen in één map van 60.000 tokens. Er is weer ruimte, maar kleine details uit die stukken kunnen weg zijn.");
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function clearAll(caption) {
      stop();
      items.forEach(function (d) { if (d.g.parentNode) d.g.parentNode.removeChild(d.g); });
      items = []; summary = 0; placed = 0; step = 0;
      folder.setAttribute("opacity", 0); rot.setAttribute("opacity", 0);
      update(caption || "Een leeg bureau. Leg er een document op.");
    }
    function play() {
      clearAll("Afspelen…");
      if (reduced()) { while (addDoc()) {} rotOld(); compact(); return; }
      var seq = DOCS.map(function () { return [addDoc, 700]; });
      seq.push([rotOld, 2200]); seq.push([compact, 0]);
      var i = 0;
      (function next() { if (i >= seq.length) { timer = null; return; } var s = seq[i++]; s[0](); timer = setTimeout(next, s[1]); })();
    }
    root.querySelector('[data-act="play"]').addEventListener("click", play);
    root.querySelector('[data-act="add"]').addEventListener("click", function () {
      stop();
      if (!addDoc()) { update("Alle documenten liggen er. Klik op /compact: Claude vat de oudste stukken samen."); return; }
      if (total() / CAP >= 0.8 && rot.getAttribute("opacity") !== "1") rotOld();
    });
    root.querySelector('[data-act="compact"]').addEventListener("click", function () { stop(); compact(); });
    root.querySelector('[data-act="clear"]').addEventListener("click", function () { clearAll("Nieuwe chat: een schoon bureau. Zijn notitieboekje en de projectmap neemt hij wel mee."); });
    update("Een leeg bureau. Klik op Leg document neer, steeds één document erbij.");
    if (reduced()) root.querySelector(".stage-steps").hidden = false;
    return { stop: stop };
  }

  /* ================= Tabel ================= */
  function mountTable(root, def) {
    var cols = def.kolommen, rows = def.rijen, filters = def.filters || null;
    root.innerHTML =
      (filters ? '<div class="tbl-filters" role="group" aria-label="Filter">' + filters.map(function (f, i) { return '<button type="button" class="choice" data-f="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(f.label) + '</button>'; }).join("") + '</div>' : '') +
      '<div class="tbl-scroll"><table class="tbl"><thead><tr>' + cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join("") + '</tr></thead><tbody>' +
      rows.map(function (r, i) { return '<tr data-i="' + i + '"' + (r.uitleg ? ' tabindex="0" aria-describedby="tbl-detail"' : '') + '>' + r.cellen.map(function (c, j) { return (j === 0 ? '<th scope="row">' : '<td>') + md(c) + (j === 0 ? '</th>' : '</td>'); }).join("") + '</tr>'; }).join("") +
      '</tbody></table></div>' +
      '<div class="tbl-detail" id="tbl-detail" aria-live="polite">' + md(def.hint || "Klik op een rij voor meer uitleg.") + '</div>';
    var trs = root.querySelectorAll("tbody tr"), detail = root.querySelector(".tbl-detail");
    function select(tr) {
      Array.prototype.forEach.call(trs, function (t) { t.classList.toggle("sel", t === tr); });
      var r = rows[+tr.getAttribute("data-i")];
      if (r.uitleg) detail.innerHTML = '<strong>' + md(r.cellen[0]) + '.</strong> ' + md(r.uitleg);
    }
    Array.prototype.forEach.call(trs, function (tr) {
      if (!rows[+tr.getAttribute("data-i")].uitleg) return;
      tr.addEventListener("click", function (e) { if (e.target.closest("a")) return; select(tr); });
      tr.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(tr); } });
    });
    if (filters) root.querySelector(".tbl-filters").addEventListener("click", function (e) {
      var b = e.target.closest(".choice"); if (!b) return;
      var f = filters[+b.getAttribute("data-f")];
      Array.prototype.forEach.call(root.querySelectorAll(".tbl-filters .choice"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      Array.prototype.forEach.call(trs, function (tr) {
        var tags = rows[+tr.getAttribute("data-i")].tags || [];
        tr.classList.toggle("dim", !!f.tag && tags.indexOf(f.tag) === -1);
      });
      detail.innerHTML = f.tag && f.uitleg ? md(f.uitleg) : md(def.hint || "Klik op een rij voor meer uitleg.");
    });
    return { stop: function () {} };
  }


  /* ================= Chat (nagebootst Claude-venster) =================
     def.scenarios: [{ label, caption, panes: [pane, pane?] }]
     pane: { label, title, model, chips: [{text, off}], side: {title, items: [{text, tone, hidden}]},
             events: [...], meter: {sec, usage, extra}, verdict: {tone, text} }
     events: user, thinking, tool, answer, file, diff, code, approve, note, memory, card, status, side-add, side-mark */
  function fmtDur(sec) {
    sec = Math.round(sec);
    if (sec < 60) return sec + " s";
    var m = Math.floor(sec / 60), r = sec % 60;
    if (m < 60) return m + " min" + (r ? " " + r + " s" : "");
    var h = Math.floor(m / 60); m = m % 60;
    return h + " u" + (m ? " " + m + " min" : "");
  }
  var FILEICON = { doc: "doc", sheet: "sheet", slides: "slides", pdf: "doc", md: "doc", code: "terminal", img: "camera", mail: "mail", artifact: "artifact", web: "globe" };
  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  function dot(s) { return /[.?!:]$/.test(s) ? s : s + "."; }
  // Schema onder een scenario: blokjes met pijlen. Soorten: you (jij), ai (Claude), once (Claude, één keer), code (zonder AI), time (moment), out (resultaat)
  var FLOWICON = { you: "person", ai: "chat", once: "pen", code: "gear", time: "clock", out: "check" };
  function flowHTML(f) {
    if (!f || !f.length) return "";
    return '<div class="flow-strip"><p class="flow-title">Schema</p><ol class="flow">' + f.map(function (b) {
      return '<li class="fl-' + esc(b.kind) + '">' + window.iconSVG(FLOWICON[b.kind] || "doc") + '<span>' + md(b.text) + '</span></li>';
    }).join("") + '</ol><p class="flow-legend"><span class="fl-key fl-ai"></span>Claude (AI) <span class="fl-key fl-once"></span>Claude, één keer <span class="fl-key fl-code"></span>zonder AI</p></div>';
  }
  function mountChat(root, def) {
    var scen = def.scenarios || [];
    root.innerHTML =
      '<div class="cw-wrap"></div>' +
      (scen.length > 1 ? '<div class="stage-choices" role="group" aria-label="Kies een situatie">' + scen.map(function (s, i) { return '<button type="button" class="choice" data-choice="' + i + '" aria-pressed="false">' + esc(s.label) + '</button>'; }).join("") + '</div>' : '') +
      '<div class="stage-caption"><span class="stage-step"></span><p class="stage-text" aria-live="polite"></p></div>' +
      '<ol class="stage-steps" hidden>' + scen.map(function (s) { return '<li><strong>' + esc(dot(s.label)) + '</strong> ' + md(s.caption || "") + '</li>'; }).join("") + '</ol>' +
      controlsHTML("chat") +
      '<p class="cw-foot">Nagespeeld voorbeeld. Tijden en verbruik zijn een indicatie.</p>';
    var host = root.querySelector(".cw-wrap");
    var capStep = root.querySelector(".stage-step"), capText = root.querySelector(".stage-text");
    var playBtn = root.querySelector('[data-act="play"]'), prevBtn = root.querySelector('[data-act="prev"]'), nextBtn = root.querySelector('[data-act="next"]');
    var dots = root.querySelector(".dots");
    dots.innerHTML = scen.map(function () { return "<i></i>"; }).join("");
    var cur = -1, timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function evHTML(e, k) {
      var c = ' class="cw-el cw-hide ';
      var a = ' data-k="' + k + '"';
      switch (e.t) {
        case "user":
          return '<div' + c + 'cw-user-wrap"' + a + '>' +
            (e.files ? '<div class="cw-files">' + e.files.map(function (f) { return '<span class="cw-filechip">' + window.iconSVG(FILEICON[f.kind] || "doc") + esc(f.name) + '</span>'; }).join("") + '</div>' : '') +
            '<div class="cw-user">' + md(e.text) + '</div></div>';
        case "thinking":
          return '<div' + c + 'cw-think"' + a + '><div class="cw-think-head">' + window.iconSVG("thought") + '<span>Denkt na…</span></div>' +
            (e.lines || []).map(function (l) { return '<div class="cw-think-line cw-hide">' + md(l) + '</div>'; }).join("") + '</div>';
        case "tool":
          return '<div' + c + 'cw-tool' + (e.tone ? " t-" + e.tone : "") + '"' + a + '><span class="cw-spin"></span>' + (e.icon ? window.iconSVG(e.icon) : "") + '<span>' + md(e.text) + '</span></div>';
        case "answer":
          return '<div' + c + 'cw-answer"' + a + '>' + String(e.text).split("\n").map(function (l) { return l === "" ? '<div class="cw-gap"></div>' : '<p class="cw-hide">' + md(l) + '</p>'; }).join("") + '</div>';
        case "file":
          return '<div' + c + 'cw-file"' + a + '>' + window.iconSVG(FILEICON[e.kind] || "doc") + '<span><strong>' + esc(e.name) + '</strong>' + (e.note ? '<small>' + md(e.note) + '</small>' : '') + '</span></div>';
        case "diff":
          return '<div' + c + 'cw-diff"' + a + '>' + (e.title ? '<div class="cw-blocktitle">' + md(e.title) + '</div>' : '') +
            e.lines.map(function (l) { return '<div class="cw-dl ' + (l[0] === "+" ? "add" : l[0] === "-" ? "del" : "") + '">' + esc((l[0] === "+" || l[0] === "-") ? l[0] + " " + l[1] : "  " + l[1]) + '</div>'; }).join("") + '</div>';
        case "code":
          return '<div' + c + 'cw-code"' + a + '>' + (e.title ? '<div class="cw-blocktitle">' + window.iconSVG("doc") + esc(e.title) + '</div>' : '') + '<pre>' + esc(e.text) + '</pre></div>';
        case "approve":
          return '<div' + c + 'cw-approve"' + a + '><div>' + md(e.text) + '</div><div class="cw-btns"><span class="cw-btn">' + esc(e.no || "Weigeren") + '</span><span class="cw-btn primary">' + esc(e.yes || "Toestaan") + '</span></div></div>';
        case "note":
          return '<div' + c + 'cw-note t-' + (e.tone || "warn") + '"' + a + '>' + window.iconSVG(e.tone === "ok" ? "check" : e.tone === "info" ? "eye" : "warn") + '<span>' + md(e.text) + '</span></div>';
        case "memory":
          return '<div' + c + 'cw-memory' + (e.tone ? " t-" + e.tone : "") + '"' + a + '>' + window.iconSVG("notebook") + '<span>' + md(e.text) + '</span></div>';
        case "card":
          return '<div' + c + 'cw-card"' + a + '><div class="cw-card-title">' + esc(e.title) + '</div><dl>' + (e.rows || []).map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + md(r[1]) + '</dd></div>'; }).join("") + '</dl>' + (e.button ? '<span class="cw-btn primary">' + esc(e.button) + '</span>' : '') + '</div>';
        case "status":
          return '<div' + c + 'cw-status' + (e.tone ? " t-" + e.tone : "") + '"' + a + '>' + (e.icon ? window.iconSVG(e.icon) : "") + '<span>' + md(e.text) + '</span></div>';
        default: return "";
      }
    }
    function paneHTML(p, pi) {
      var side = p.side ? (function () {
        var items = (p.side.items || []).slice();
        (p.events || []).forEach(function (e, k) { if (e.t === "side-add") items.push({ text: e.text, tone: e.tone, add: k }); });
        return '<aside class="cw-side"><h4>' + esc(p.side.title || "") + '</h4><ul>' + items.map(function (it, i) {
          return '<li data-si="' + i + '"' + (it.add != null ? ' data-add="' + it.add + '"' : '') + ' class="' + (it.tone ? "t-" + it.tone : "") + (it.add != null ? " cw-hide" : "") + (it.strike ? " strike" : "") + '">' + md(it.text) + '</li>';
        }).join("") + '</ul></aside>';
      })() : "";
      var meter = p.meter ? '<div class="cw-meter"><span>' + window.iconSVG("clock") + '<b class="cw-time">0 s</b></span><span class="cw-use-wrap">Verbruik <i class="cw-use"><i></i></i></span>' + (p.meter.extra ? '<span class="cw-extra cw-hide">' + md(p.meter.extra) + '</span>' : '') + '</div>' : "";
      return '<div class="cw-pane">' +
        (p.label ? '<div class="cw-label">' + md(p.label) + '</div>' : '') +
        '<div class="cw">' +
          '<div class="cw-bar"><span class="cw-lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="cw-title">' + esc(p.title || "Claude") + '</span>' + (p.model ? '<span class="cw-model">' + esc(p.model) + '</span>' : '') + '</div>' +
          (p.chips && p.chips.length ? '<div class="cw-chips">' + p.chips.map(function (ch) { return '<span class="cw-chip' + (ch.off ? " off" : "") + (ch.tone ? " t-" + ch.tone : "") + '">' + (ch.icon ? window.iconSVG(ch.icon) : "") + esc(ch.text) + '</span>'; }).join("") + '</div>' : '') +
          '<div class="cw-body' + (p.side ? " has-side" : "") + '"><div class="cw-msgs">' + (p.events || []).map(evHTML).join("") + '</div>' + side + '</div>' +
          meter +
        '</div>' +
        (p.verdict ? '<div class="cw-verdict cw-el cw-hide t-' + (p.verdict.tone || "ok") + '">' + window.iconSVG(p.verdict.tone === "warn" || p.verdict.tone === "bad" ? "warn" : "check") + '<span>' + md(p.verdict.text) + '</span></div>' : '') +
      '</div>';
    }
    var PACE = 1.3; // rustig tempo: >1 is trager
    function dur(e) { return Math.round((e.ms || baseDur(e)) * PACE); }
    function baseDur(e) {
      switch (e.t) {
        case "user": return 900;
        case "thinking": return 500 + 800 * (e.lines || []).length;
        case "tool": return 1000;
        case "answer": return 500 + 420 * String(e.text).split("\n").filter(Boolean).length;
        case "diff": return 500 + 140 * e.lines.length;
        case "code": return 1500;
        case "approve": case "card": return 1700;
        case "side-add": case "side-mark": return 450;
        default: return 800;
      }
    }
    function show(el) { if (el) el.classList.remove("cw-hide"); }
    // speelt events from..to af (standaard alles); instant = zonder wachttijden
    function runPane(paneEl, p, instant, from, to) {
      var evs = p.events || [], t = 0, total = 0;
      if (from == null) from = 0;
      if (to == null || to > evs.length - 1) to = evs.length - 1;
      evs.forEach(function (e) { total += dur(e); });
      var timeEl = paneEl.querySelector(".cw-time"), useEl = paneEl.querySelector(".cw-use > i");
      function meterAt(frac) {
        if (!p.meter) return;
        timeEl.textContent = fmtDur((p.meter.sec || 0) * frac);
        useEl.style.width = Math.min(1, (p.meter.usage || 0) * frac) * 100 + "%";
      }
      var at = instant ? function (fn) { fn(); } : function (fn, ms) { later(fn, ms); };
      evs.forEach(function (e, k) {
        var d = dur(e), start = t;
        if (k < from || k > to) { t += d; return; }
        var el = paneEl.querySelector('[data-k="' + k + '"]');
        at(function () {
          show(el);
          if (e.t === "side-add") show(paneEl.querySelector('.cw-side [data-add="' + k + '"]'));
          if (e.t === "side-mark") {
            var li = paneEl.querySelectorAll(".cw-side li")[e.index];
            if (li) { if (e.tone) li.className = "t-" + e.tone; if (e.strike) li.classList.add("strike"); if (e.text) li.innerHTML = md(e.text); }
          }
          if (!instant) meterAt((start + d * 0.5) / total);
        }, start);
        if (e.t === "thinking") {
          var lines = el.querySelectorAll(".cw-think-line"), head = el.querySelector(".cw-think-head span");
          Array.prototype.forEach.call(lines, function (ln, i) { at(function () { show(ln); }, start + (400 + i * 800) * PACE); });
          at(function () { head.textContent = "Dacht " + (e.label || fmtDur(e.secs || 2)) + " na"; el.classList.add("done"); }, start + d - 200);
        }
        if (e.t === "answer") {
          Array.prototype.forEach.call(el.querySelectorAll("p"), function (ln, i) { at(function () { show(ln); }, start + (250 + i * 420) * PACE); });
        }
        if (e.t === "tool") at(function () { el.classList.add("done"); }, start + d * 0.75);
        if (e.t === "approve" || e.t === "card") at(function () {
          var b = el.querySelector(".cw-btn.primary");
          if (b) { b.classList.add("pressed"); b.innerHTML = TICK + esc(e.done || (e.t === "card" ? "Ingepland" : "Toegestaan")); }
          var n = el.querySelector(".cw-btn:not(.primary)"); if (n) n.classList.add("gone");
        }, start + d * 0.7);
        t += d;
      });
      if (to < evs.length - 1) { if (instant) meterAt(evs.length ? (to + 1) / evs.length : 0); return total; }
      at(function () {
        meterAt(1);
        show(paneEl.querySelector(".cw-extra"));
        show(paneEl.querySelector(".cw-verdict"));
      }, total);
      return total;
    }
    function explainHTML(x) {
      var it = x.items || [];
      return '<div class="ex">' + (x.title ? '<p class="ex-title">' + md(x.title) + '</p>' : '') +
        '<div class="ex-seg" role="group" aria-label="' + esc(x.title || "Kies") + '">' + it.map(function (o, i) {
          return '<button type="button" data-ex="' + i + '" aria-pressed="false"><span>' + esc(o.name) + '</span>' + (o.bars ? '<i><b style="width:' + Math.round(o.bars[0] * 100) + '%"></b></i>' : '') + '</button>';
        }).join("") + '</div><div class="ex-card" aria-live="polite"></div>' + (x.foot ? '<p class="ex-foot">' + md(x.foot) + '</p>' : '') + '</div>';
    }
    function explainShow(x, i) {
      var o = x.items[i], card = host.querySelector(".ex-card");
      Array.prototype.forEach.call(host.querySelectorAll(".ex-seg button"), function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-ex") === i)); });
      card.innerHTML = '<div class="ex-head"><strong class="ex-name">' + esc(o.name) + '</strong>' + (o.sub ? '<span class="ex-sub">' + md(o.sub) + '</span>' : '') + '</div>' +
        (o.text ? '<p class="ex-text">' + md(o.text) + '</p>' : '') +
        (o.bars ? '<div class="ex-bars">' + (x.bars || []).map(function (lbl, j) { return '<div><span>' + esc(lbl) + '</span><span class="ex-track"><span class="ex-fill" style="width:0"></span></span></div>'; }).join("") + '</div>' : '') +
        (o.code ? '<div class="ex-code"><span>' + esc(x.codeLabel || "Zo ziet het eruit") + '</span><pre>' + esc(o.code) + '</pre></div>' : '') +
        (o.example ? '<p class="ex-box"><strong>' + esc(x.exampleLabel || "Voorbeeld") + ':</strong> ' + md(o.example) + '</p>' : '') +
        (o.use ? '<p class="ex-box"><strong>' + esc(x.useLabel || "Gebruik het voor") + ':</strong> ' + md(o.use) + '</p>' : '');
      var fills = card.querySelectorAll(".ex-fill");
      card.getBoundingClientRect();
      Array.prototype.forEach.call(fills, function (f, j) { f.style.width = Math.round((o.bars[j] || 0) * 100) + "%"; });
    }
    // idle: toon alleen het begin (tot en met de eerste vraag); play: speel het gesprek af; instant: alles meteen
    function render(k, opts) {
      opts = opts || {};
      clearTimers();
      cur = Math.max(0, Math.min(scen.length - 1, k));
      var s = scen[cur];
      capStep.textContent = (cur + 1) + "/" + scen.length;
      capText.innerHTML = "<strong>" + esc(dot(s.label)) + "</strong> " + md(s.caption || "");
      prevBtn.disabled = cur === 0;
      nextBtn.disabled = cur === scen.length - 1;
      Array.prototype.forEach.call(dots.children, function (d, i) { d.className = i < cur ? "on" : (i === cur ? "now" : ""); });
      Array.prototype.forEach.call(root.querySelectorAll(".choice"), function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-choice") === cur)); });
      if (s.explain) {
        host.className = "cw-wrap";
        host.innerHTML = explainHTML(s.explain);
        explainShow(s.explain, s.explain.start || 0);
        playBtn.hidden = true;
        return;
      }
      playBtn.hidden = !!opts.meet;
      var instant = opts.instant || reduced();
      host.className = "cw-wrap" + (s.panes.length > 1 ? " compare" : "") + (instant ? " cw-instant" : "");
      host.innerHTML = s.panes.map(paneHTML).join("") + flowHTML(s.flow);
      var paneEls = host.querySelectorAll(".cw-pane");
      // beginstand: tot en met de eerste vraag (of alleen het eerste bericht)
      var starts = s.panes.map(function (p) { var u = (p.events || []).map(function (e) { return e.t; }).indexOf("user"); return u < 0 ? 0 : u; });
      if (opts.meet) {
        mstep = 0;
        mgroups = s.panes.map(function (p, i) { return meetGroups(p, starts[i]); });
        mmax = Math.max.apply(null, mgroups.map(function (g) { return g.length; }).concat([0]));
        s.panes.forEach(function (p, i) { runPane(paneEls[i], p, true, 0, starts[i]); });
        syncNext();
        return;
      }
      if (opts.idle && !instant) {
        s.panes.forEach(function (p, i) { runPane(paneEls[i], p, true, 0, starts[i]); });
        host.insertAdjacentHTML("beforeend", '<button class="cw-bigplay" type="button" data-act="bigplay">▶ Afspelen</button>');
        // midden op de chatvensters, niet op het schema eronder
        var bp = host.querySelector(".cw-bigplay"), hr = host.getBoundingClientRect(), top = Infinity, bot = -Infinity;
        Array.prototype.forEach.call(paneEls, function (pe) { var r = pe.getBoundingClientRect(); top = Math.min(top, r.top); bot = Math.max(bot, r.bottom); });
        if (bot > top && hr.height) bp.style.top = Math.round((top + bot) / 2 - hr.top) + "px";
        playBtn.innerHTML = "▶ Afspelen";
        return;
      }
      var end = 0;
      s.panes.forEach(function (p, i) { end = Math.max(end, runPane(paneEls[i], p, instant)); });
      playBtn.innerHTML = opts.played ? "↻ Opnieuw afspelen" : "▶ Afspelen";
    }
    // Meetingmodus: elke klik toont het volgende bericht; na het laatste bericht gaat een klik naar de volgende situatie
    var inst = reduced(), meet = getMeet(), meetBtn = root.querySelector('[data-act="meet"]'), mstep = 0, mmax = 0, mgroups = [];
    // per klik één bericht; zijpaneel-effecten (side-add, side-mark) horen bij het bericht erna
    function meetGroups(p, start) {
      var evs = p.events || [], g = [], from = start + 1;
      for (var k = start + 1; k < evs.length; k++) {
        if (evs[k].t === "side-mark" || evs[k].t === "side-add") continue;
        g.push([from, k]); from = k + 1;
      }
      if (from <= evs.length - 1) g.push([from, evs.length - 1]);
      return g;
    }
    function go(k) { render(k, meet ? { meet: true } : { idle: true, instant: inst }); syncNext(); }
    function syncNext() {
      var more = meet && !scen[cur].explain && mstep < mmax;
      nextBtn.classList.toggle("btn-primary", meet);
      nextBtn.textContent = !meet ? "Volgende ›" : more ? "Volgend bericht ›" : "Volgende situatie ›";
      nextBtn.disabled = !more && cur === scen.length - 1;
    }
    function stepMeet() {
      var s = scen[cur], paneEls = host.querySelectorAll(".cw-pane");
      if (s.explain || mstep >= mmax) { go(cur + 1); return; }
      mstep++;
      s.panes.forEach(function (p, i) {
        var g = mgroups[i][mstep - 1];
        if (g) runPane(paneEls[i], p, true, g[0], g[1]);
      });
      syncNext();
    }
    function syncMeet() { meetBtn.setAttribute("aria-pressed", String(meet)); meetBtn.innerHTML = (meet ? "✓ " : "") + "Meetingmodus"; }
    syncMeet();
    meetBtn.addEventListener("click", function () { meet = !meet; setMeet(meet); syncMeet(); go(cur); });
    meetBtn.title = "Elke klik toont het volgende bericht, zodat jij het tempo bepaalt";
    playBtn.addEventListener("click", function () { render(cur, { instant: inst, played: true }); });
    prevBtn.addEventListener("click", function () { go(cur - 1); });
    nextBtn.addEventListener("click", function () { if (meet) stepMeet(); else go(cur + 1); });
    var ch = root.querySelector(".stage-choices");
    if (ch) ch.addEventListener("click", function (e) { var b = e.target.closest(".choice"); if (!b) return; go(+b.getAttribute("data-choice")); });
    host.addEventListener("click", function (e) {
      if (e.target.closest(".cw-bigplay")) { render(cur, { instant: inst, played: true }); return; }
      var b = e.target.closest(".ex-seg button");
      if (!b) { if (meet && !scen[cur].explain && mstep < mmax) stepMeet(); return; }
      explainShow(scen[cur].explain, +b.getAttribute("data-ex"));
    });
    if (inst) root.querySelector(".stage-steps").hidden = false;
    go(0);
    return { stop: clearTimers };
  }

  /* ================= Chat in stappen =================
     def: { type: "chat", steps: ["bijschrift stap 1", ...], panes: [{ label, title, events: [{ t, s, ... }], verdict: { tone, text, s } }] }
     Elk bericht verschijnt bij stap s (1 = eerste stap). Soorten: user (text, files), answer (text, gaps), note (tone, text),
     file (name, note), divider (text, dim: eerdere berichten worden vaag). */
  function gaps(html) { return html.replace(/\[([^\]<]+)\](?!\()/g, '<mark class="cw-gap">[$1]</mark>'); }
  function mountChatSteps(root, def) {
    var panes = def.panes || [], n = (def.steps || []).length || 1;
    function ev(e, pi, k) {
      var a = ' class="cw-el cw-hide ', d = ' data-s="' + (e.s || 1) + '" data-k="' + k + '"';
      switch (e.t) {
        case "user":
          return '<div' + a + 'cw-user-wrap"' + d + '>' + (e.files ? '<div class="cw-files">' + e.files.map(function (f) { return '<span class="cw-filechip">' + window.iconSVG(FILEICON[f.kind] || "doc") + esc(f.name) + '</span>'; }).join("") + '</div>' : '') +
            '<div class="cw-user">' + md(e.text) + '</div></div>';
        case "answer":
          var h = String(e.text).split("\n").map(function (l) { return l === "" ? '<div class="cw-gap"></div>' : '<p>' + md(l) + '</p>'; }).join("");
          return '<div' + a + 'cw-answer"' + d + '>' + (e.gaps ? gaps(h) : h) + '</div>';
        case "note":
          return '<div' + a + 'cw-note t-' + (e.tone || "warn") + '"' + d + '>' + window.iconSVG(e.tone === "ok" ? "check" : e.tone === "info" ? "eye" : "warn") + '<span>' + md(e.text) + '</span></div>';
        case "file":
          return '<div' + a + 'cw-file"' + d + '>' + window.iconSVG(FILEICON[e.kind] || "doc") + '<span><strong>' + esc(e.name) + '</strong>' + (e.note ? '<small>' + md(e.note) + '</small>' : '') + '</span></div>';
        case "divider":
          return '<div' + a + 'cw-divider"' + d + (e.dim ? ' data-dim="1"' : '') + '><span>' + md(e.text) + '</span></div>';
        default: return "";
      }
    }
    root.innerHTML = '<div class="cw-wrap' + (panes.length > 1 ? " compare" : "") + '">' + panes.map(function (p, pi) {
      return '<div class="cw-pane">' + (p.label ? '<div class="cw-label">' + md(p.label) + '</div>' : '') +
        '<div class="cw"><div class="cw-bar"><span class="cw-lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="cw-title">' + esc(p.title || "Claude") + '</span></div>' +
        '<div class="cw-body"><div class="cw-msgs">' + (p.events || []).map(function (e, k) { return ev(e, pi, k); }).join("") + '</div></div></div>' +
        (p.verdict ? '<div class="cw-verdict cw-el cw-hide t-' + (p.verdict.tone || "ok") + '" data-s="' + (p.verdict.s || n) + '">' + window.iconSVG(p.verdict.tone === "ok" ? "check" : "warn") + '<span>' + md(p.verdict.text) + '</span></div>' : '') +
        '</div>';
    }).join("") + '</div>' + stepBarHTML();
    var wrap = root.querySelector(".cw-wrap"), first = true;
    function show(k) {
      if (first) wrap.classList.add("cw-instant");
      Array.prototype.forEach.call(root.querySelectorAll("[data-s]"), function (el) { el.classList.toggle("cw-hide", +el.getAttribute("data-s") > k + 1); });
      Array.prototype.forEach.call(root.querySelectorAll(".cw-msgs"), function (box) {
        var dimFrom = -1;
        Array.prototype.forEach.call(box.querySelectorAll("[data-dim]"), function (dv) { if (!dv.classList.contains("cw-hide")) dimFrom = +dv.getAttribute("data-k"); });
        Array.prototype.forEach.call(box.children, function (el) { el.classList.toggle("cw-dim", dimFrom >= 0 && +el.getAttribute("data-k") < dimFrom); });
      });
      if (first) { wrap.getBoundingClientRect(); wrap.classList.remove("cw-instant"); first = false; }
    }
    stepper(root, n, show, def.steps || []);
    return { stop: function () {} };
  }

  window.Visuals = {
    mount: function (root, def) {
      if (!def) return { stop: function () {} };
      if (def.type === "desk") return mountDesk(root, def);
      if (def.type === "table") return mountTable(root, def);
      if (def.type === "chat") return def.steps ? mountChatSteps(root, def) : mountChat(root, def);
      return mountScene(root, def);
    }
  };
})();
