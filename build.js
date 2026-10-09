#!/usr/bin/env node
/* Bouwt dist/claude-inwerken.html uit de bronbestanden in src/ en controleert de inhoud.
   Gebruik: node build.js   (Node 16 of nieuwer, geen extra pakketten nodig) */
"use strict";
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "dist", "claude-inwerken.html");
const read = (f) => fs.readFileSync(path.join(SRC, f), "utf8");

const MAX = { tegels: 16, woorden: 50, stappen: 4, zin: 20, punten: 3, puntWoorden: 8 };
// vaste kopjes die een visual zelf op het scherm zet (tellen mee als zichtbare woorden)
const LABELS = { toepassing: ["Probleem", "Bestanden", "Claude", "Waarom", "Nu", "Straks"], chat: [] };
const TYPES = ["chat", "toepassing"];

const errors = [], warnings = [], report = [];
const W = (x) => [].concat(x || []).join(" ").replace(/[*`]/g, " ").split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
// alle teksten in een visual (geen sleutels als type, icoon of stap)
const SKIP = new Set(["type", "icoon", "soort", "toon", "stap", "van"]);
function strings(v, out = []) {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") for (const k in v) if (!SKIP.has(k)) strings(v[k], out);
  return out;
}
function stepsOf(v) {
  if (v.type === "toepassing") return 4;
  if (v.type === "chat") return Math.max(0, ...v.vensters.flatMap((w) => w.berichten.map((b) => b.stap || 0)));
  return 0;
}

let data;
try { data = JSON.parse(read("tegels.json")); }
catch (e) { console.error("tegels.json is geen geldige JSON: " + e.message); process.exit(1); }

/* ---------- Controle van de inhoud ---------- */
const ICONS = read("icons.js");
const iconNames = new Set([...ICONS.matchAll(/^\s{4}([a-z0-9]+):\s'/gm)].map((m) => m[1]));
const icon = (where, n) => { if (n && !iconNames.has(n)) errors.push(where + ": onbekend icoon '" + n + "'"); };
const blokIds = new Set((data.blokken || []).map((b) => b.id));
if (!data.app || !data.app.titel) errors.push("app.titel ontbreekt");
(data.blokken || []).forEach((b) => { if (!b.naam || !["1", "2", "3"].includes(b.kleur)) errors.push("blok " + b.id + ": naam en kleur (1, 2 of 3) nodig"); });
if (data.tegels.length > MAX.tegels) errors.push(data.tegels.length + " tegels (max " + MAX.tegels + ")");
const ids = new Set();
for (const t of data.tegels) {
  const where = "tegel " + (t.id || "?");
  if (!t.id || ids.has(t.id)) errors.push(where + ": id ontbreekt of is dubbel");
  ids.add(t.id);
  if (!blokIds.has(t.blok)) errors.push(where + ": onbekend blok " + t.blok);
  if (!t.titel) errors.push(where + ": titel ontbreekt");
  if (!t.visual) { warnings.push(where + " (" + t.titel + "): nog geen visual, staat alleen op de agenda"); continue; }
  const v = t.visual;
  if (!t.zin) errors.push(where + ": zin ontbreekt");
  if (W(t.zin) > MAX.zin) errors.push(where + ": zin is " + W(t.zin) + " woorden (max " + MAX.zin + ")");
  if (t.punten) {
    if (!Array.isArray(t.punten) || t.punten.length > MAX.punten) errors.push(where + ": max " + MAX.punten + " punten");
    [].concat(t.punten).forEach((p, i) => { if (W(p) > MAX.puntWoorden) errors.push(where + ": punt " + (i + 1) + " is " + W(p) + " woorden (max " + MAX.puntWoorden + ")"); });
  }
  if (!TYPES.includes(v.type)) { errors.push(where + ": onbekend visual-type '" + v.type + "'"); continue; }
  if (v.type === "chat") {
    if (!Array.isArray(v.vensters) || v.vensters.length < 1 || v.vensters.length > 2) errors.push(where + ": 1 of 2 vensters nodig");
    (v.vensters || []).forEach((w, i) => (w.berichten || []).forEach((b, k) => {
      const bw = where + " venster " + (i + 1) + " bericht " + (k + 1);
      if (!["jij", "claude", "oordeel"].includes(b.van)) errors.push(bw + ": 'van' moet jij, claude of oordeel zijn");
      if (!(b.stap >= 1 && b.stap <= MAX.stappen)) errors.push(bw + ": stap moet 1 tot en met " + MAX.stappen + " zijn");
      if (!b.tekst && !b.briefing && !b.regels) errors.push(bw + ": tekst, briefing of regels nodig");
    }));
  }
  if (v.type === "toepassing") {
    for (const f of ["probleem", "bestanden", "claude", "waarom", "nu", "straks"]) if (!v[f]) errors.push(where + ": veld '" + f + "' ontbreekt");
    [v.probleem, v.claude, v.waarom].forEach((x) => x && icon(where, x.icoon));
  }
  const c = { id: t.id, titel: t.titel, woorden: W([t.titel, t.zin, t.punten, strings(v), LABELS[v.type]].flat(2)), stappen: stepsOf(v) };
  report.push(c);
  if (c.woorden > MAX.woorden) errors.push(where + ": " + c.woorden + " zichtbare woorden (max " + MAX.woorden + ")");
  if (c.stappen > MAX.stappen) errors.push(where + ": " + c.stappen + " stappen (max " + MAX.stappen + ")");
}
const perBlok = {};
(data.quizzen || []).forEach((q, i) => {
  const qw = "quiz " + (i + 1);
  if (!blokIds.has(q.blok)) errors.push(qw + ": onbekend blok");
  if (perBlok[q.blok]) errors.push(qw + ": blok " + q.blok + " heeft al een quiz (één per blok)");
  perBlok[q.blok] = true;
  if (!q.vraag || !Array.isArray(q.opties) || q.opties.length < 2) errors.push(qw + ": vraag en minstens twee opties nodig");
  else if (!Number.isInteger(q.goed) || q.goed < 0 || q.goed >= q.opties.length) errors.push(qw + ": 'goed' wijst niet naar een bestaande optie");
});

warnings.forEach((w) => console.warn("let op: " + w));
if (report.length) {
  console.log("\ntegel | zichtbare woorden | stappen");
  report.forEach((c) => console.log("  " + c.id + " " + c.titel + " | " + c.woorden + " | " + c.stappen));
  console.log("");
}
if (errors.length) { errors.forEach((e) => console.error("fout: " + e)); console.error(errors.length + " fout(en), niets gebouwd."); process.exit(1); }

/* ---------- Bundelen ---------- */
const json = JSON.stringify(data).replace(/</g, "\\u003c");
const safeJs = (s) => s.replace(/<\/script/gi, "<\\/script");
const html = read("index.html")
  .replace("/*{{CSS}}*/", () => read("styles.css"))
  .replace("/*{{DATA}}*/", () => json)
  .replace("/*{{ICONS}}*/", () => safeJs(ICONS))
  .replace("/*{{VISUALS}}*/", () => safeJs(read("visuals.js")))
  .replace("/*{{APP}}*/", () => safeJs(read("app.js")));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log("Gebouwd: " + path.relative(process.cwd(), OUT) + " (" + kb + " kB, " + report.length + " van " + data.tegels.length + " tegels klaar)");
