#!/usr/bin/env node
// Converte un file HTML in PDF usando Chromium headless.
// Uso: node scripts/html2pdf.mjs <input.html> [output.pdf]
import { loadEnv, chromiumEnv, ROOT } from "./lib.mjs";
import { resolve, join, dirname, basename } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

loadEnv();
chromiumEnv();
const [inArg, outArg] = process.argv.slice(2);
if (!inArg) {
  console.error("Uso: node scripts/html2pdf.mjs <input.html> [output.pdf]");
  process.exit(1);
}
const input = resolve(inArg);
if (!existsSync(input)) {
  console.error(`File non trovato: ${input}`);
  process.exit(1);
}
const output = resolve(outArg ?? input.replace(/\.html$/i, ".pdf"));
mkdirSync(dirname(output), { recursive: true });

const { default: puppeteer } = await import("puppeteer");
const browser = await puppeteer.launch({
  headless: "shell",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none", "--disable-gpu"],
});
try {
  const page = await browser.newPage();
  await page.goto(`file://${input}`, { waitUntil: "networkidle0", timeout: 60000 });
  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    preferCSSPageSize: true,
  });
  console.log(`PDF scritto: ${output}`);
} finally {
  await browser.close();
}