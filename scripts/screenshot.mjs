#!/usr/bin/env node
// Guardia: verifica che Chromium/puppeteer funzioni. Utile dopo l'installazione.
// Uso: node scripts/screenshot.mjs <url> [output.png]
import { loadEnv, chromiumEnv, ROOT } from "./lib.mjs";
import { resolve } from "node:path";

loadEnv();
chromiumEnv();
const [url, outArg] = process.argv.slice(2);
if (!url) {
  console.error("Uso: node scripts/screenshot.mjs <url> [output.png]");
  process.exit(1);
}
const out = resolve(outArg ?? `${ROOT}/data/backups/screenshot-${Date.now()}.png`);
const { default: puppeteer } = await import("puppeteer");
const browser = await puppeteer.launch({ headless: "shell", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url.startsWith("http") ? url : `https://${url}`, { waitUntil: "networkidle2", timeout: 45000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: out });
  console.log(`Screenshot: ${out}`);
} finally {
  await browser.close();
}