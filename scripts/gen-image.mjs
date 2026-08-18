#!/usr/bin/env node
// Genera un'immagine con Cloudflare Workers AI (text-to-image).
// Salva di default in data/clients/<nome>/images/ (visualizzabile da browser).
// Uso: node scripts/gen-image.mjs "<prompt>" [--client <nome>] [--model <id>] [output.png]
//      [--aspect 16:9|1:1|4:3|3:4|9:16] [--width <px>] [--height <px>] [--steps <n>]
// Esempio:
//   node scripts/gen-image.mjs "Villa moderna, cancello in ferro battuto, luce serale" \
//     --client passelli-com --aspect 16:9
import { loadEnv, ROOT, clientDir } from "./lib.mjs";
import { join, dirname } from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";

loadEnv();
const args = process.argv.slice(2);

const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("--")) {
    flags[a.slice(2)] = args[i + 1];
    i += 1;
  } else {
    positional.push(a);
  }
}

const prompt = positional[0];
const outArg = positional[1];
const model = flags.model ?? process.env.CLOUDFLARE_IMAGE_MODEL;
const aspect = flags.aspect;
const client = flags.client;
const width = flags.width;
const height = flags.height;
const steps = flags.steps;

if (!prompt) {
  console.error('Uso: node scripts/gen-image.mjs "<prompt>" [output.png] --client <nome> [--model <id>] [--aspect 16:9] [--width <px>] [--height <px>] [--steps <n>]');
  process.exit(1);
}
if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
  console.error('Manca CLOUDFLARE_ACCOUNT_ID o CLOUDFLARE_API_TOKEN nel .env (permesso "Workers AI: Run").');
  process.exit(1);
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image";
}

let out = outArg;
if (out) {
  out = out.startsWith("~/") ? join(process.env.HOME ?? ROOT, out.slice(2)) : out;
} else if (client) {
  out = join(clientDir(client), "images", `${slug(prompt)}-${Date.now()}.png`);
} else {
  console.error("Specifica --client <nome> oppure un percorso di output.");
  process.exit(1);
}

const ASPECTS = { "16:9": [1280, 720], "1:1": [1024, 1024], "4:3": [1152, 864], "3:4": [864, 1152], "9:16": [720, 1280] };
const SIZE_CAPABLE = /leonardo|lucid|phoenix|stable-diffusion|dreamshaper/;
const canSize = SIZE_CAPABLE.test(model ?? "");
const [aw, ah] = ASPECTS[aspect] ?? [null, null];
let w = width ? Number(width) : null;
let h = height ? Number(height) : null;
if (aspect && aw) { w = w ?? aw; h = h ?? ah; }
if ((w || h) && !canSize) {
  console.warn(`Nota: ${model} non accetta width/height (output fisso 1024x1024). Usa @cf/leonardo/lucid-origin o @cf/black-forest-labs/flux-2-dev per dimensioni custom.`);
  w = h = null;
}

const body = { prompt };
if (w) body.width = w;
if (h) body.height = h;
if (steps && Number.isFinite(Number(steps))) body.steps = Number(steps);

const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;
const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  const text = await res.text();
  console.error(`Errore Cloudflare Workers AI (${res.status}): ${text}`);
  process.exit(1);
}

const data = await res.json();
const b64 = data?.result?.image;
if (!b64) {
  console.error(`Risposta senza immagine: ${JSON.stringify(data).slice(0, 500)}`);
  process.exit(1);
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(b64, "base64"));
console.log(`Immagine generata (${model}): ${out}`);