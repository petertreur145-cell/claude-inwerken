#!/usr/bin/env node
/* Bouwt dist/claude-inwerken.html uit de bronbestanden in src/.
   Gebruik: node build.js   (Node 16 of nieuwer, geen extra pakketten nodig) */
"use strict";
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "dist", "claude-inwerken.html");
const read = (f) => fs.readFileSync(path.join(SRC, f), "utf8");

const errors = [], warnings = [], report = [];
/* Woorden tellen zoals een lezer ze ziet (quiz niet meegeteld) */
function visualWords(v) {
  const out = [];
  if (v.type === "scene") {
    (v.steps || []).forEach((s) => { out.push(s.caption || ""); Object.values(s.set || {}).forEach((x) => { if (x.label) out.push(x.label); if (x.text) out.push(x.text); }); });
    (v.items || []).forEach((it) => { if (it.label) out.push(it.label); if (it.text) out.push(it.text); });
    (v.choices || []).forEach((c) => out.push(c.label));
  } else if (v.type === "chat" && v.steps) {
    out.push(...v.steps);
    (v.panes || []).forEach((p) => { out.push(p.label || "", p.title || ""); (p.events || []).forEach((e) => { out.push(e.text || "", e.name || "", e.note || ""); (e.files || []).forEach((f) => out.push(f.name)); }); if (p.verdict) out.push(p.verdict.text); });
  }
  return out.join(" ");
}
function countTile(t) {
  const W = (x) => String(x || "").replace(/[*`[\]()→]/g, " ").split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const v = t.voorbeeld || {};
  const c = { id: t.id, titel: W(t.titel), kort: W(t.kort), uitleg: W([].concat(t.uitleg).join(" ")), visual: W(visualWords(t.visual || {})),
    metafoor: W([].concat(t.metafoor).join(" ")), voorbeeld: W([v.titel, v.erin, v.claude, v.eruit].join(" ")), valkuil: W(t.valkuil),
    stappen: ((t.visual || {}).steps || []).length };
  c.totaal = c.titel + c.kort + c.uitleg + c.visual + c.metafoor + c.voorbeeld + c.valkuil;
  c.minuten = Math.max(1, Math.round(c.totaal / 200));
  return c;
}
let data;
try { data = JSON.parse(read("tegels.json")); }
catch (e) { console.error("tegels.json is geen geldige JSON: " + e.message); process.exit(1); }

/* ---------- Controle van de inhoud ---------- */
const ICONS = read("icons.js");
const iconNames = new Set([...ICONS.matchAll(/^\s{4}([a-z0-9]+):\s'/gm)].map((m) => m[1]));
const ids = new Set();
const words = (s) => String(s).replace(/[*`[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
const isUrl = (u) => /^https:\/\/[^\s]+$/.test(u || "");
const levelIds = new Set(data.niveaus.map((l) => l.id));
for (const t of data.tegels) {
  const where = "tegel " + (t.id || "?");
  if (!t.id || ids.has(t.id)) errors.push(where + ": id ontbreekt of is dubbel");
  ids.add(t.id);
  for (const f of ["titel", "kort", "uitleg", "visual", "metafoor", "valkuil", "quiz", "stand", "bronnen", "icoon", "minuten"])
    if (t[f] == null || t[f] === "") errors.push(where + ": veld '" + f + "' ontbreekt");
  if (!t.voorbeeld && !t.voorbeelden) errors.push(where + ": veld 'voorbeeld' ontbreekt");
  for (const f of ["probeer", "tips"]) if (t[f] != null) errors.push(where + ": veld '" + f + "' bestaat niet meer; haal het weg");
  if (t.voorbeeld && !(t.voorbeeld.titel && t.voorbeeld.erin && t.voorbeeld.claude && t.voorbeeld.eruit)) errors.push(where + ": voorbeeld heeft titel, erin, claude en eruit nodig");
  if (!levelIds.has(t.niveau)) errors.push(where + ": onbekend niveau " + t.niveau);
  if (t.groep && !(data.groepen || {})[t.groep]) errors.push(where + ": onbekende groep " + t.groep);
  if (t.icoon && !iconNames.has(t.icoon)) errors.push(where + ": onbekend icoon '" + t.icoon + "'");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.stand || "")) errors.push(where + ": 'stand' moet JJJJ-MM-DD zijn");
  if (!Array.isArray(t.bronnen) || !t.bronnen.length) errors.push(where + ": minstens één bron nodig");
  (t.bronnen || []).forEach((b) => { if (!b.label || !isUrl(b.url)) errors.push(where + ": bron zonder label of https-url"); });
  const w = words([].concat(t.uitleg || []).join(" "));
  if (t.voorbeeld) {
    const c = countTile(t);
    report.push(c);
    if (c.uitleg > 60) warnings.push(where + ": uitleg is " + c.uitleg + " woorden (max 60)");
    if (c.totaal > 250) errors.push(where + ": " + c.totaal + " woorden (max 250, quiz niet meegeteld)");
    if (c.stappen > 5) errors.push(where + ": visual heeft " + c.stappen + " stappen (max 5)");
    const maxV = (t.visual || {}).type === "chat" ? 75 : 60; // in chatvorm is het gesprek zelf de les
    if (c.visual > maxV) warnings.push(where + ": visual heeft " + c.visual + " woorden (richtlijn ~" + maxV + ")");
  } else if (w > 135) warnings.push(where + ": uitleg is " + w + " woorden (richtlijn: ±120)");
  if (!Array.isArray(t.quiz) || t.quiz.length < 1 || t.quiz.length > 2) errors.push(where + ": quiz moet 1 of 2 vragen hebben");
  (t.quiz || []).forEach((q, i) => {
    const qw = where + " quizvraag " + (i + 1);
    if (!Array.isArray(q.opties) || q.opties.length < 2) errors.push(qw + ": minstens twee opties");
    else {
      if (!Number.isInteger(q.goed) || q.goed < 0 || q.goed >= q.opties.length) errors.push(qw + ": 'goed' wijst niet naar één bestaande optie");
      if (new Set(q.opties).size !== q.opties.length) errors.push(qw + ": dubbele opties");
    }
    if (!q.goedUitleg || !q.foutUitleg) errors.push(qw + ": goedUitleg en foutUitleg nodig");
  });
  (t.voorbeelden || []).forEach((v, i) => {
    const vw = where + " voorbeeld " + (i + 1);
    if (!["echt", "numafa", "thuis"].includes(v.soort)) errors.push(vw + ": soort moet echt, numafa of thuis zijn");
    if (v.soort === "echt" && !(v.bron && isUrl(v.bron.url))) errors.push(vw + ": een echt voorbeeld heeft een bron nodig");
    if (!v.tekst && !(v.erin && v.claude && v.eruit)) errors.push(vw + ": tekst of erin/claude/eruit nodig");
  });
  if (t.voorbeelden && !t.voorbeelden.some((v) => v.soort === "numafa")) errors.push(where + ": minstens één Numafa-voorbeeld nodig");
  const v = t.visual || {};
  if (!["scene", "desk", "table", "chat"].includes(v.type)) errors.push(where + ": onbekend visual-type '" + v.type + "'");
  if (v.type === "scene") {
    const itemIds = new Set((v.items || []).map((it) => it.id));
    (v.items || []).forEach((it) => { if (it.icon && !iconNames.has(it.icon)) errors.push(where + ": scene-icoon '" + it.icon + "' bestaat niet"); });
    (v.steps || []).forEach((s, i) => {
      if (!s.caption) errors.push(where + ": stap " + (i + 1) + " heeft geen caption");
      Object.keys(s.set || {}).forEach((k) => {
        if (!itemIds.has(k)) errors.push(where + ": stap " + (i + 1) + " verwijst naar onbekend element '" + k + "'");
        const ic = s.set[k].icon; if (ic && !iconNames.has(ic)) errors.push(where + ": scene-icoon '" + ic + "' bestaat niet");
      });
    });
    (v.choices || []).forEach((c) => { if (!(c.step >= 0 && c.step < (v.steps || []).length)) errors.push(where + ": keuze '" + c.label + "' wijst naar een stap die niet bestaat"); });
  }
  if (v.type === "chat" && v.steps) {
    const n = v.steps.length;
    if (!n) errors.push(where + ": chat zonder stappen");
    (v.panes || []).forEach((p) => {
      (p.events || []).forEach((e, k) => { if (!(e.s >= 1 && e.s <= n)) errors.push(where + ": bericht " + (k + 1) + " heeft geen geldige stap (s)"); });
      if (p.verdict && p.verdict.s && !(p.verdict.s >= 1 && p.verdict.s <= n)) errors.push(where + ": oordeel met ongeldige stap");
    });
  }
  if (v.type === "chat" && !v.steps) {
    const EV = ["user", "thinking", "tool", "answer", "file", "diff", "code", "approve", "note", "memory", "card", "status", "side-add", "side-mark"];
    if (!Array.isArray(v.scenarios) || !v.scenarios.length) errors.push(where + ": chat heeft minstens één scenario nodig");
    (v.scenarios || []).forEach((s, i) => {
      const sw = where + " scenario " + (i + 1);
      if (!s.label || !s.caption) errors.push(sw + ": label en caption nodig");
      if (s.explain) {
        const x = s.explain;
        if (!Array.isArray(x.items) || x.items.length < 2) errors.push(sw + ": uitlegkaart heeft minstens twee items nodig");
        (x.items || []).forEach((o) => {
          if (!o.name) errors.push(sw + ": uitlegitem zonder naam");
          if (o.bars && (!Array.isArray(x.bars) || o.bars.length !== x.bars.length)) errors.push(sw + ": balkjes van '" + o.name + "' passen niet bij explain.bars");
        });
        return;
      }
      if (!Array.isArray(s.panes) || s.panes.length < 1 || s.panes.length > 2) errors.push(sw + ": 1 of 2 vensters (panes) nodig");
      (s.panes || []).forEach((p) => {
        const icons = (p.chips || []).map((c) => c.icon).concat((p.events || []).map((e) => e.icon));
        icons.forEach((ic) => { if (ic && !iconNames.has(ic)) errors.push(sw + ": icoon '" + ic + "' bestaat niet"); });
        (p.events || []).forEach((e, k) => {
          if (!EV.includes(e.t)) errors.push(sw + ": onbekende gebeurtenis '" + e.t + "'");
          if (e.t === "side-mark" && !(p.side && e.index >= 0 && e.index < (p.side.items || []).length + p.events.filter((x) => x.t === "side-add").length)) errors.push(sw + ": side-mark " + k + " wijst naar een onbekend item");
          if (e.t === "diff" && !(Array.isArray(e.lines) && e.lines.every((l) => Array.isArray(l) && l.length === 2))) errors.push(sw + ": diff-regels moeten [teken, tekst] zijn");
        });
      });
    });
  }
  if (t.tips && !(Array.isArray(t.tips) && t.tips.length && t.tips.every((x) => typeof x === "string" && x))) errors.push(where + ": tips moet een lijst met teksten zijn");
  if (v.type === "table") (v.rijen || []).forEach((r, i) => { if (r.cellen.length !== v.kolommen.length) errors.push(where + ": tabelrij " + (i + 1) + " heeft " + r.cellen.length + " cellen, verwacht " + v.kolommen.length); });
  if (t.tabel) t.tabel.rijen.forEach((r, i) => { if (r.length !== t.tabel.kolommen.length) errors.push(where + ": tabel rij " + (i + 1) + " klopt niet met de kolommen"); });
}
data.tegels.forEach((t) => { if (t.voorbeeld) { const m = countTile(t).minuten; if (t.minuten !== m) warnings.push("tegel " + t.id + ": minuten is " + t.minuten + ", leestijd is ~" + m); } });
warnings.forEach((w) => console.warn("let op: " + w));
if (report.length) {
  console.log("Nieuwe opbouw (woorden): tegel | totaal | uitleg | visual | stappen");
  report.forEach((c) => console.log("  " + c.id + " | " + c.totaal + " | " + c.uitleg + " | " + c.visual + " | " + c.stappen));
}

if (errors.length) { errors.forEach((e) => console.error("fout: " + e)); console.error(errors.length + " fout(en), niets gebouwd."); process.exit(1); }

/* ---------- Bundelen ---------- */
const json = JSON.stringify(data).replace(/</g, "\\u003c");
const safeJs = (s) => s.replace(/<\/script/gi, "<\\/script");
let html = read("index.html")
  .replace("/*{{CSS}}*/", () => read("styles.css"))
  .replace("/*{{DATA}}*/", () => json)
  .replace("/*{{ICONS}}*/", () => safeJs(ICONS))
  .replace("/*{{VISUALS}}*/", () => safeJs(read("visuals.js")))
  .replace("/*{{APP}}*/", () => safeJs(read("app.js")));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log("Gebouwd: " + path.relative(process.cwd(), OUT) + " (" + kb + " kB, " + data.tegels.length + " tegels)");
if (Buffer.byteLength(html) > 3 * 1024 * 1024) { console.error("Bestand is groter dan 3 MB."); process.exit(1); }
