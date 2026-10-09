#!/usr/bin/env node
/* Bouwt dist/vergelijken.html: het origineel en de nieuwe versie naast elkaar, per onderwerp,
   met keuzeknoppen en een download van de keuzes.
   Gebruik: node vergelijken/build.js   (leest vergelijken/origineel.html en vergelijken/nieuw.html) */
"use strict";
const fs = require("fs");
const path = require("path");
const DIR = __dirname;
const OUT = path.join(DIR, "..", "dist", "vergelijken.html");
const A = fs.readFileSync(path.join(DIR, "origineel.html"), "utf8");
const B = fs.readFileSync(path.join(DIR, "nieuw.html"), "utf8");

const data = (html) => JSON.parse(html.match(/<script type="application\/json" id="tegels">([\s\S]*?)<\/script>/)[1]);
const da = data(A), db = data(B);
const RENAME = { "Instructies": "Goed vragen", "Claude chat vs Claude Code": "Chat of Claude Code" };
const byTitle = new Map(db.tegels.map((t) => [t.titel, t]));
const NEWFORM = new Set(db.tegels.filter((t) => t.voorbeeld).map((t) => t.id));
const hint = (bt) => !bt ? "" : NEWFORM.has(bt.id)
  ? "Nieuw is al in de nieuwe vorm: kort, klikbaar, voorbeeld uit de inkoop."
  : "Nieuw is hier de tussenversie: nagespeelde gesprekken, nog niet ingekort.";

const topics = [{ key: "start", naam: "Startscherm en volgorde", niveau: 0, a: "#/", b: "#/", aLabel: "startscherm", bLabel: "startscherm", hint: "Kijk naar de indeling, de groepen en de volgorde van de tegels." }];
const used = new Set();
function tile(at) {
  const bt = byTitle.get(RENAME[at.titel] || at.titel);
  if (bt) used.add(bt.id);
  return { key: "t:" + at.titel, naam: at.titel + (bt && bt.titel !== at.titel ? " / " + bt.titel : ""), niveau: at.niveau,
    a: "#/tegel/" + at.id, aLabel: "tegel " + at.id, b: bt ? "#/tegel/" + bt.id : null, bLabel: bt ? "tegel " + bt.id : null, hint: hint(bt) };
}
function onlyNew(bt) {
  used.add(bt.id);
  return { key: "n:" + bt.titel, naam: bt.titel + " (alleen in nieuw)", niveau: bt.niveau, a: null, aLabel: null, b: "#/tegel/" + bt.id, bLabel: "tegel " + bt.id, hint: "Nieuwe tegel. Houden of weglaten?" };
}
for (const lvl of [1, 2, 3]) {
  da.tegels.filter((t) => t.niveau === lvl).forEach((t) => topics.push(tile(t)));
  // tegels die alleen in de nieuwe versie bestaan, aan het eind van hun niveau
  const mapped = new Set(da.tegels.map((t) => (byTitle.get(RENAME[t.titel] || t.titel) || {}).id));
  db.tegels.filter((t) => t.niveau === lvl && !mapped.has(t.id)).forEach((t) => topics.push(onlyNew(t)));
}
topics.push({ key: "over", naam: "Over deze app", niveau: 0, a: "#/over", b: "#/over", aLabel: "pagina Over", bLabel: "pagina Over", hint: "" });

const b64 = (s) => Buffer.from(s, "utf8").toString("base64").replace(/(.{120})/g, "$1\n");
let html = fs.readFileSync(path.join(DIR, "index.html"), "utf8")
  .replace("/*{{TOPICS}}*/", () => JSON.stringify(topics).replace(/</g, "\\u003c"))
  .replace("/*{{ORIG}}*/", () => b64(A))
  .replace("/*{{NIEUW}}*/", () => b64(B));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log("Gebouwd: " + path.relative(process.cwd(), OUT) + " (" + (Buffer.byteLength(html) / 1024).toFixed(0) + " kB, " + topics.length + " onderwerpen)");
