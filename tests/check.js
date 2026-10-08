#!/usr/bin/env node
/* Controle van het gebouwde bestand (fase 4).
   Opent dist/claude-inwerken.html via file:// in headless Chromium en klikt elke tegel door,
   op 375 en 1440 px, licht en donker, en met prefers-reduced-motion.
   Gebruik: node tests/check.js [map-voor-screenshots]
   Vereist Playwright (npm i -D playwright) of een globale installatie. */
"use strict";
const path = require("path");
const fs = require("fs");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { console.error("Playwright niet gevonden. Installeer met: npm i -D playwright"); process.exit(2); }

const FILE = "file://" + path.resolve(__dirname, "..", "dist", "claude-inwerken.html");
const SHOTS = process.argv[2] || null;
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", "tegels.json"), "utf8"));
const ids = data.tegels.map((t) => t.id);

const runs = [
  { name: "1440-licht", width: 1440, height: 900, colorScheme: "light", reducedMotion: "no-preference" },
  { name: "375-donker", width: 375, height: 812, colorScheme: "dark", reducedMotion: "no-preference" },
  { name: "1440-donker-reduced", width: 1440, height: 900, colorScheme: "dark", reducedMotion: "reduce" },
  { name: "375-licht-reduced", width: 375, height: 812, colorScheme: "light", reducedMotion: "reduce" }
];

(async () => {
  const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find((p) => fs.existsSync(p));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const problems = [];
  const external = new Set();
  for (const r of runs) {
    const ctx = await browser.newContext({ viewport: { width: r.width, height: r.height }, colorScheme: r.colorScheme, reducedMotion: r.reducedMotion });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
    page.on("request", (q) => { const u = q.url(); if (!u.startsWith("file:") && !u.startsWith("data:") && !u.startsWith("about:")) external.add(u); });
    await page.goto(FILE);
    await page.waitForTimeout(400);
    const check = async (label) => {
      const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (o > 0) problems.push(`${r.name} ${label}: ${o}px horizontaal scrollen`);
      const clipped = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll(".s-card .lbl, .s-text").forEach((el) => {
          const it = el.closest(".s-item") || el;
          if (getComputedStyle(it).opacity === "0") return;
          if (it.scrollWidth > it.clientWidth + 2 || it.scrollHeight > it.clientHeight + 2) out.push((el.textContent || "").slice(0, 40));
        });
        return out;
      });
      clipped.forEach((c) => problems.push(`${r.name} ${label}: tekst past niet in scene-element: “${c}”`));
    };
    await check("start");
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${r.name}-start.png`), fullPage: true });
    for (const id of ids) {
      await page.evaluate((h) => { location.hash = h; }, "#/tegel/" + id);
      await page.waitForTimeout(r.reducedMotion === "reduce" ? 150 : 350);
      const ok = await page.evaluate((id) => !!document.getElementById("tile-title") && document.querySelector(".article-eyebrow").textContent.startsWith(id), id);
      if (!ok) problems.push(`${r.name}: tegel ${id} opent niet goed`);
      // speel door alle stappen van de animatie en check telkens
      const steps = await page.evaluate(() => { const d = document.querySelectorAll("#visual .dots i"); return d.length; });
      for (let s = 0; s < steps; s++) {
        await page.evaluate((s) => { const b = document.querySelectorAll("#visual .dots i"); const next = document.querySelector('#visual [data-act="next"]'); const prev = document.querySelector('#visual [data-act="prev"]'); if (s === 0) { for (let i = 0; i < 12; i++) prev && !prev.disabled && prev.click(); } else next && next.click(); }, s);
        await page.waitForTimeout(r.reducedMotion === "reduce" ? 30 : 650);
        await check(`tegel ${id} stap ${s + 1}`);
      }
      // quiz: kies het goede antwoord bij de eerste vraag
      await page.evaluate((id) => {
        const t = JSON.parse(document.getElementById("tegels").textContent).tegels.find((x) => x.id === id);
        const fs = document.querySelector('.q[data-q="0"]');
        if (fs) fs.querySelectorAll("input")[t.quiz[0].goed].click();
      }, id);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(80);
      await check(`tegel ${id}`);
      if (SHOTS && ["1.1", "1.2", "1.4", "1.6", "2.9", "3.3", "3.7.3", "3.7.10"].includes(id)) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(SHOTS, `${r.name}-tegel-${id}.png`), fullPage: true });
      }
    }
    // zoeken en over
    await page.evaluate(() => { location.hash = "#/"; });
    await page.waitForTimeout(200);
    await page.fill("#q", "goal");
    await page.waitForTimeout(300);
    const hits = await page.evaluate(() => document.querySelectorAll(".tile").length);
    if (!hits) problems.push(`${r.name}: zoeken op “goal” geeft niets`);
    await page.fill("#q", "");
    await page.evaluate(() => { location.hash = "#/over"; });
    await page.waitForTimeout(300);
    await check("over");
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${r.name}-over.png`), fullPage: false });
    // voortgang terug op het startscherm
    await page.evaluate(() => { location.hash = "#/"; });
    await page.waitForTimeout(400);
    const read = await page.evaluate(() => JSON.parse(localStorage.getItem("claude-inwerken:v1") || "{}").read || []);
    if (read.length !== ids.length) problems.push(`${r.name}: ${read.length} van ${ids.length} tegels als gelezen gemarkeerd`);
    const medals = await page.evaluate(() => document.querySelectorAll(".medal").length);
    if (medals !== data.niveaus.length) problems.push(`${r.name}: ${medals} stempels zichtbaar, verwacht ${data.niveaus.length}`);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${r.name}-start-na.png`), fullPage: false });
    errs.forEach((e) => problems.push(`${r.name} console: ${e}`));
    await ctx.close();
  }
  // opslag geblokkeerd: app moet blijven werken
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("geblokkeerd"); } }); });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(FILE + "#/tegel/1.4");
  await page.waitForTimeout(500);
  const ok = await page.evaluate(() => !!document.getElementById("tile-title"));
  if (!ok || errs.length) problems.push("zonder localStorage werkt de app niet: " + errs.join("; "));
  await ctx.close();
  await browser.close();

  // inhoud
  for (const t of data.tegels) {
    t.quiz.forEach((q, i) => { if (!(Number.isInteger(q.goed) && q.goed >= 0 && q.goed < q.opties.length)) problems.push(`tegel ${t.id} vraag ${i + 1}: niet precies één goed antwoord`); });
    if (!t.stand) problems.push(`tegel ${t.id}: geen stand-per-datum`);
    if (!t.bronnen || !t.bronnen.length) problems.push(`tegel ${t.id}: geen bron`);
  }
  console.log("Externe aanvragen: " + (external.size ? [...external].join(", ") : "geen"));
  if (external.size) problems.push("externe aanvragen gevonden");
  if (problems.length) { console.log(problems.length + " probleem/problemen:\n- " + problems.join("\n- ")); process.exit(1); }
  console.log("Alles in orde: " + ids.length + " tegels, " + runs.length + " weergaven, geen consolefouten.");
})();
