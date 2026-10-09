/* Claude inwerken — visuals per tegel.
   Elke visual is een stuk HTML. Elementen met data-s="k" verschijnen bij stap k (1, 2, 3 of 4);
   de app zet daarvoor de klassen is-on (stap bereikt) en is-cur (huidige stap). Niets speelt vanzelf af.
   Soorten (visual.type in tegels.json):
   - "chat":       twee Claude-vensters naast elkaar, berichten per stap (alleen bij Prompting)
   - "toepassing": vast format van de inkooptegels: probleem, bestanden, Claude, waarom + balk nu → straks */
(function () {
  "use strict";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // opmaak in teksten: **vet**, *schuin*, `code`
  function md(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }
  window.esc = esc;
  window.mdInline = md;
  var icon = function (n) { return window.iconSVG(n); };
  var FILEICON = { sheet: "sheet", pdf: "doc", doc: "doc", mail: "mail", md: "doc" };
  function s(k) { return k ? ' data-s="' + k + '"' : ""; }

  /* ---------- Chat: vaag tegenover gebriefd ---------- */
  function bericht(b) {
    if (b.van === "jij") {
      var body = b.briefing
        ? '<dl class="brief">' + b.briefing.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + md(r[1]) + '</dd></div>'; }).join("") + '</dl>'
        : md(b.tekst);
      return '<div class="cw-user' + (b.briefing ? " is-brief" : "") + '"' + s(b.stap) + '>' + body + '</div>';
    }
    if (b.van === "claude") {
      var lines = b.regels || [b.tekst];
      return '<div class="cw-answer"' + s(b.stap) + '>' + lines.map(function (l) { return '<p>' + md(l) + '</p>'; }).join("") + '</div>';
    }
    if (b.van === "oordeel") {
      var t = b.toon || "ok";
      return '<div class="cw-verdict t-' + esc(t) + '"' + s(b.stap) + '>' + icon(t === "ok" ? "check" : "cross") + '<span>' + md(b.tekst) + '</span></div>';
    }
    return "";
  }
  function chat(v) {
    return '<div class="v-chat">' + v.vensters.map(function (w) {
      return '<div class="cw-pane"><div class="cw-label">' + md(w.label) + '</div>' +
        '<div class="cw"><div class="cw-bar"><span class="cw-lights" aria-hidden="true"><i></i><i></i><i></i></span></div>' +
        '<div class="cw-msgs">' + w.berichten.map(bericht).join("") + '</div></div></div>';
    }).join("") + '</div>';
  }

  /* ---------- Toepassing: vier vakjes + balk ---------- */
  function vak(k, kop, ic, inhoud) {
    return '<section class="app-box"' + s(k) + '><header><span class="app-num" aria-hidden="true">' + k + '</span>' + esc(kop) + '</header>' +
      '<div class="app-body">' + (ic ? '<span class="app-icon">' + icon(ic) + '</span>' : '') + inhoud + '</div></section>';
  }
  function chips(list, cls) {
    return '<ul class="chips ' + (cls || "") + '">' + list.map(function (c) {
      return typeof c === "string" ? '<li>' + md(c) + '</li>' : '<li>' + icon(FILEICON[c.soort] || "doc") + '<span>' + md(c.naam) + '</span></li>';
    }).join("") + '</ul>';
  }
  function toepassing(v) {
    var arrow = '<span class="app-sep" aria-hidden="true">' + icon("arrow") + '</span>';
    return '<div class="v-app"><div class="app-row">' +
      vak(1, "Probleem", v.probleem.icoon, '<p>' + md(v.probleem.tekst) + '</p>') + arrow +
      vak(2, "Bestanden", null, chips(v.bestanden, "files")) + arrow +
      vak(3, "Claude", v.claude.icoon, '<p>' + md(v.claude.tekst) + '</p>' + (v.claude.chips ? chips(v.claude.chips, "warn") : "")) + arrow +
      vak(4, "Waarom", v.waarom.icoon, '<p>' + md(v.waarom.tekst) + '</p>') +
      '</div><div class="app-bar"' + s(4) + '>' +
        '<span class="app-now"><b>Nu</b>' + md(v.nu) + '</span>' +
        '<span class="app-to" aria-hidden="true">' + icon("arrow") + '</span>' +
        '<span class="app-next"><b>Straks</b>' + md(v.straks) + '</span>' +
      '</div></div>';
  }

  window.VISUALS = { chat: chat, toepassing: toepassing };
})();
