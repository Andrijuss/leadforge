#!/usr/bin/env node
// Analizza un sito: scarica HTML, estrae struttura SEO, testo e screenshot.
// Uso: node scripts/fetch-site.mjs <url> [nome-cliente] [lingua]
import { loadEnv, clientDir, langCode, chromiumEnv } from "./lib.mjs";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

loadEnv();
chromiumEnv();
const [urlRaw, clientNameArg, langRaw] = process.argv.slice(2);
if (!urlRaw) {
  console.error("Uso: node scripts/fetch-site.mjs <url> [nome-cliente] [lingua]");
  process.exit(1);
}
const url = urlRaw.startsWith("http") ? urlRaw : `https://${urlRaw}`;
const name = clientNameArg ?? url.replace(/^https?:\/\//, "").split("/")[0];
const lang = langRaw ? langCode(langRaw) : (process.env.LANG ?? "it");
const dir = clientDir(name);

const clientFile = join(dir, "client.json");
let client = existsSync(clientFile) ? JSON.parse(readFileSync(clientFile, "utf8")) : null;
if (!client) {
  client = { id: dir.split("/").pop(), name, url: "", lang, sector: "", contact: {}, created: new Date().toISOString(), status: "new", notes: [] };
}

async function fetchHtml() {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; LeadforgeBot/0.1; +https://andrijus.example.com)",
      "accept-language": "it-IT,it;q=0.9,en;q=0.8",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} per ${url}`);
  return res.text();
}

async function screenshot(pageUrl, out) {
  const { default: puppeteer } = await import("puppeteer");
  const browser = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(pageUrl, { waitUntil: "networkidle2", timeout: 45000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: out, fullPage: false });
  } finally {
    await browser.close();
  }
}

const html = await fetchHtml();
const $ = cheerio.load(html);

const title = $("title").first().text().trim();
const metaDesc = $('meta[name="description"]').attr("content")?.trim() ?? "";
const canonical = $('link[rel="canonical"]').attr("href") ?? "";
const hreflangs = $('link[rel="alternate"][hreflang]').map((_, el) => $(el).attr("hreflang")).get();
const htmlLang = $("html").attr("lang") ?? "";

const h1 = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean);
const h2 = $("h2").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 30);
const h3 = $("h3").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 30);

const imgs = $("img").toArray();
const imgsNoAlt = imgs.filter((el) => !$(el).attr("alt")).length;
const imgsTotal = imgs.length;

const links = $("a[href]").map((_, el) => $(el).attr("href")).get();
const internalLinks = links.filter((l) => l.startsWith("/") || l.startsWith(url)).length;
const mailto = links.filter((l) => l.startsWith("mailto:")).map((l) => l.replace("mailto:", "")).filter(Boolean);
const tel = links.filter((l) => l.startsWith("tel:")).map((l) => l.replace("tel:", "")).filter(Boolean);
const social = links.filter((l) => /(facebook|instagram|linkedin|twitter|x\.com|tiktok|youtube|whatsapp)/i.test(l)).length;

const generators = $('meta[name="generator"]').attr("content") ?? "";
const hasViewport = !!$('meta[name="viewport"]').attr("content");
const hasOg = !!$('meta[property="og:title"]').attr("content");
const hasSchema = !!$('script[type="application/ld+json"]').length;
const hasFavicon = !!($('link[rel="icon"]').length || $('link[rel="shortcut icon"]').length);

const bodyText = $("body").text().replace(/\s+/g, " ").trim();
const words = bodyText.split(" ").filter(Boolean).length;

const navText = $("nav").first().text().replace(/\s+/g, " ").trim().slice(0, 500);
const footerText = $("footer").first().text().replace(/\s+/g, " ").trim().slice(0, 800);

const security = { https: url.startsWith("https://"), hasFavicon, hasViewport, hasOg, hasSchema };

const report = {
  url,
  fetchedAt: new Date().toISOString(),
  basic: {
    title,
    metaDescription: metaDesc,
    htmlLang,
    hreflangs,
    canonical,
    wordCount: words,
    navText,
    footerText,
  },
  structure: {
    h1: h1.slice(0, 5),
    h2: h2.slice(0, 15),
    h3: h3.slice(0, 15),
    internalLinks,
    socialLinks: social,
    contacts: { emails: [...new Set(mailto)].slice(0, 5), phones: [...new Set(tel)].slice(0, 5) },
  },
  seo: {
    titleLength: title.length,
    hasMetaDescription: metaDesc.length > 0,
    metaDescriptionLength: metaDesc.length,
    h1Count: h1.length,
    h2Count: h2.length,
    imagesTotal: imgsTotal,
    imagesWithoutAlt: imgsNoAlt,
    generator: generators,
    https: security.https,
    hasViewport: security.hasViewport,
    hasOpenGraph: security.hasOg,
    hasSchemaMarkup: security.hasSchema,
    hasFavicon: security.hasFavicon,
  },
  content: bodyText.slice(0, 6000),
};

writeFileSync(join(dir, "site.json"), JSON.stringify(report, null, 2));
writeFileSync(join(dir, "site.html"), html);
writeFileSync(join(dir, "site.md"), renderMarkdown(report));

console.log("Screenshot del sito (design attuale)...");
try {
  await screenshot(url, join(dir, "screenshot.png"));
  console.log(`Screenshot: ${dir}/screenshot.png`);
} catch (e) {
  console.warn(`Screenshot fallito: ${e.message}`);
}

client.url = url;
client.lang = lang;
client.status = "analyzed";
writeFileSync(clientFile, JSON.stringify(client, null, 2));

console.log(`
Analisi salvata in ${dir}/
- site.json (dati SEO/struttura)
- site.html (sorgente)
- site.md (riassunto leggibile)
- screenshot.png (design attuale)

Lingua rilevata cliente: ${htmlLang || lang}
Step successivo: leggere site.md + screenshot.png e scrivere l'analisi in analysis.md
`);

function renderMarkdown(r) {
  const rows = [];
  rows.push(`# Analisi sito: ${r.basic.title}`);
  rows.push(`\nURL: ${r.url}  |  Scaricato: ${r.fetchedAt}`);
  rows.push(`\n## Meta & base\n- Title: ${r.basic.title} (${r.seo.titleLength} caratteri)`);
  rows.push(`- Meta description: ${r.basic.metaDescription ? r.basic.metaDescription.slice(0, 200) : "ASSENTE"}`);
  rows.push(`- html lang: ${r.basic.htmlLang || "non dichiarato"}`);
  rows.push(`- Word count: ${r.basic.wordCount}`);
  rows.push(`- Generator/CMS: ${r.seo.generator || "non rilevato"}`);
  rows.push(`\n## Struttura\n- H1: ${r.structure.h1.join(" | ") || "(nessuno)"}`);
  rows.push(`- H2 (primi 15): ${r.structure.h2.join(" | ") || "(nessuno)"}`);
  rows.push(`- Link interni: ${r.structure.internalLinks} | Link social: ${r.structure.socialLinks}`);
  rows.push(`- Contatti trovati: ${JSON.stringify(r.structure.contacts)}`);
  rows.push(`\n## SEO\n- Title ${r.seo.titleLength} char (ideale 50-60): ${r.seo.titleLength >= 50 && r.seo.titleLength <= 60 ? "OK" : "DA SISTEMARE"}`);
  rows.push(`- Meta description presente: ${r.seo.hasMetaDescription ? "sì" : "NO"} (${r.seo.metaDescriptionLength} char)`);
  rows.push(`- H1 count: ${r.seo.h1Count} (ideale 1)`);
  rows.push(`- Immagini senza alt: ${r.seo.imagesWithoutAlt}/${r.seo.imagesTotal}`);
  rows.push(`- HTTPS: ${r.seo.https ? "sì" : "NO"} | Viewport: ${r.seo.hasViewport ? "sì" : "NO"} | OpenGraph: ${r.seo.hasOpenGraph ? "sì" : "NO"} | Schema: ${r.seo.hasSchemaMarkup ? "sì" : "NO"} | Favicon: ${r.seo.hasFavicon ? "sì" : "NO"}`);
  rows.push(`\n## Navigazione (primo nav)\n${r.basic.navText || "(nessuna nav rilevata)"}`);
  rows.push(`\n## Footer\n${r.basic.footerText || "(nessun footer rilevato)"}`);
  rows.push(`\n## Contenuto (primi 6000 char)\n${r.content}`);
  return rows.join("\n");
}