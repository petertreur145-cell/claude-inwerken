/* Claude inwerken — interactieve visuals.
   Drie soorten, gekozen met visual.type in tegels.json:
   - "scene": declaratieve animatie in stappen (elementen + stappen die eigenschappen wijzigen)
   - "desk":  het bureau dat volloopt (tegel 1.4)
   - "table": interactieve tabel met filters en uitleg per rij
   Alle animaties lopen één keer, hebben "Opnieuw afspelen" en staan stil bij prefers-reduced-motion. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var reduced = function () { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); };
  var md = function (s) { return window.mdInline ? window.mdInline(s) : String(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  function controlsHTML(withSteps) {
    return '<div class="stage-controls">' +
      '<button class="btn btn-primary btn-small" type="button" data-act="play">Afspelen</button>' +
      (withSteps ? '<button class="btn btn-small" type="button" data-act="prev" aria-label="Vorige stap">‹ Stap</button><button class="btn btn-small" type="button" data-act="next" aria-label="Volgende stap">Stap ›</button>' : '') +
      '<span class="spacer"></span><span class="dots" aria-hidden="true"></span></div>';
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
      '<div class="stage-caption"><span class="stage-step"></span><p class="stage-text" aria-live="polite"></p></div>' +
      '<ol class="stage-steps" hidden>' + steps.map(function (s) { return '<li>' + md(s.caption || "") + '</li>'; }).join("") + '</ol>' +
      controlsHTML(true);
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
    var cur = -1, timer = null;
    var capStep = root.querySelector(".stage-step"), capText = root.querySelector(".stage-text");
    var playBtn = root.querySelector('[data-act="play"]'), prevBtn = root.querySelector('[data-act="prev"]'), nextBtn = root.querySelector('[data-act="next"]');
    var dots = root.querySelector(".dots");
    dots.innerHTML = steps.map(function () { return "<i></i>"; }).join("");
    function show(k, instant) {
      cur = Math.max(0, Math.min(steps.length - 1, k));
      if (instant) stage.classList.add("no-anim");
      var st = stateAt(cur);
      for (var id in st) apply(id, st[id]);
      if (instant) { stage.getBoundingClientRect(); stage.classList.remove("no-anim"); }
      capStep.textContent = (cur + 1) + "/" + steps.length;
      capText.innerHTML = md(steps[cur].caption || "");
      prevBtn.disabled = cur === 0;
      nextBtn.disabled = cur === steps.length - 1;
      Array.prototype.forEach.call(dots.children, function (d, i) { d.className = i < cur ? "on" : (i === cur ? "now" : ""); });
      if (choices) Array.prototype.forEach.call(root.querySelectorAll(".choice"), function (b) { b.setAttribute("aria-pressed", String(choices[+b.getAttribute("data-choice")].step === cur)); });
      setLabel();
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function setLabel() { playBtn.textContent = (cur > 0 || timer) ? "Opnieuw afspelen" : "Afspelen"; }
    function play() {
      stop();
      show(0, true);
      if (reduced()) { show(steps.length - 1, true); return; }
      var i = 0;
      function tick() {
        i++;
        timer = null;
        show(i);
        if (i < steps.length - 1) { timer = setTimeout(tick, steps[i].dur || 2600); setLabel(); }
      }
      timer = setTimeout(tick, steps[0].dur || 2400);
      setLabel();
    }
    playBtn.addEventListener("click", play);
    prevBtn.addEventListener("click", function () { stop(); show(cur - 1); });
    nextBtn.addEventListener("click", function () { stop(); show(cur + 1); });
    if (choices) root.querySelector(".stage-choices").addEventListener("click", function (e) {
      var b = e.target.closest(".choice"); if (!b) return;
      stop(); show(choices[+b.getAttribute("data-choice")].step);
    });
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
    if (reduced()) {
      root.querySelector(".stage-steps").hidden = false;
      show(steps.length - 1, true);
    } else {
      show(0, true);
      if (def.autoplay !== false) timer = setTimeout(play, 600);
    }
    return { stop: function () { stop(); if (ro) ro.disconnect(); else window.removeEventListener("resize", fit); } };
  }

  /* ================= Bureau (1.4) ================= */
  function mountDesk(root) {
    root.innerHTML =
      '<div class="stage-wrap"><div class="stage-box" style="max-width:720px"><svg class="desk-svg" role="img" aria-label="Documenten vallen op het bureau van Claude; een meter toont hoeveel tokens het gesprek gebruikt, van 0 tot 1 miljoen." style="display:block;width:100%;height:auto"></svg></div></div>' +
      '<div class="stage-caption"><span class="stage-step">Stap 0</span><p class="stage-text" aria-live="polite">Een leeg bureau.</p></div>' +
      '<ol class="stage-steps" hidden><li>Elk bericht en elk bestand komt op het bureau en vult de meter.</li><li>Rond 80% worden de oudste stukken vaag: dat heet context rot.</li><li>Claude vat de oudste stukken samen in één map en er is weer ruimte.</li><li>Een nieuwe chat is een schoon bureau.</li></ol>' +
      '<div class="stage-controls"><button class="btn btn-primary btn-small" type="button" data-act="play">Afspelen</button>' +
      '<button class="btn btn-small" type="button" data-act="add">Leg document neer</button>' +
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
      root.querySelector('[data-act="play"]').textContent = step > 0 ? "Opnieuw afspelen" : "Afspelen";
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
      update(caption || "Een leeg bureau. Druk op Afspelen.");
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
    root.querySelector('[data-act="add"]').addEventListener("click", function () { stop(); addDoc(); if (total() / CAP >= 0.8 && rot.getAttribute("opacity") !== "1") rotOld(); });
    root.querySelector('[data-act="compact"]').addEventListener("click", function () { stop(); compact(); });
    root.querySelector('[data-act="clear"]').addEventListener("click", function () { clearAll("Nieuwe chat: een schoon bureau. Zijn notitieboekje en de projectmap neemt hij wel mee."); });
    update("Een leeg bureau. Druk op Afspelen.");
    if (reduced()) { root.querySelector(".stage-steps").hidden = false; while (addDoc()) {} rotOld(); }
    else timer = setTimeout(play, 600);
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

  window.Visuals = {
    mount: function (root, def) {
      if (!def) return { stop: function () {} };
      if (def.type === "desk") return mountDesk(root, def);
      if (def.type === "table") return mountTable(root, def);
      return mountScene(root, def);
    }
  };
})();
