#!/usr/bin/env node
// Converte un file HTML in PDF usando Chromium headless.
// Uso: node scripts/html2pdf.mjs <input.html> [output.pdf]
import { loadEnv, chromiumEnv, ROOT } from "./lib.mjs";
import { resolve, join, dirname, basename } from "node:path";
import { existsSync, mkdirSync, readFileSync } from "node:fs";

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

const FONT_DIR = process.env.PUPPETEER_FONTS_DIR ?? join(ROOT, ".local", "fonts");

function fontFace(family, file, weight, style) {
  const p = join(FONT_DIR, file);
  if (!existsSync(p)) return "";
  const b64 = readFileSync(p).toString("base64");
  const mime = p.endsWith(".ttf") ? "font/ttf" : p.endsWith(".otf") ? "font/otf" : "font/woff2";
  return `@font-face{font-family:'${family}';src:url(data:${mime};base64,${b64}) format('truetype');font-weight:${weight};font-style:${style};}`;
}

const fontCss = [
  fontFace("LFSans", "DejaVuSans.ttf", 400, "normal"),
  fontFace("LFSans", "DejaVuSans-Bold.ttf", 700, "normal"),
  fontFace("LFSans", "DejaVuSans.ttf", 400, "italic"),
  fontFace("LFSans", "DejaVuSans-Bold.ttf", 700, "italic"),
  fontFace("LFSerif", "DejaVuSerif.ttf", 400, "normal"),
  fontFace("LFSerif", "DejaVuSerif-Bold.ttf", 700, "normal"),
].filter(Boolean).join("\n");

const { default: puppeteer } = await import("puppeteer");
const browser = await puppeteer.launch({
  headless: "shell",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none", "--disable-gpu"],
});
try {
  const page = await browser.newPage();
  await page.goto(`file://${input}`, { waitUntil: "networkidle0", timeout: 60000 });
  if (fontCss) {
    await page.addStyleTag({ content: fontCss });
    await page.evaluate(() => document.fonts?.ready);
  }
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