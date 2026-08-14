import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const DATA_DIR = join(ROOT, "data");
export const CLIENTS_DIR = join(DATA_DIR, "clients");
export const TEMPLATES_DIR = join(ROOT, "templates");
export const SCRIPTS_DIR = join(ROOT, "scripts");

export function loadEnv() {
  const envFile = join(ROOT, ".env");
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  }
}

export function loadAgency() {
  const raw = readFileSync(join(ROOT, "config", "agency.json"), "utf8");
  return JSON.parse(raw);
}

export function clientDir(name) {
  const safe = name.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const dir = join(CLIENTS_DIR, safe);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function ensureDirs() {
  for (const d of [DATA_DIR, CLIENTS_DIR, join(DATA_DIR, "backups")]) {
    mkdirSync(d, { recursive: true });
  }
}

export function chromiumEnv() {
  const ld = process.env.PUPPETEER_LD_LIBRARY_PATH;
  if (ld && existsSync(ld)) {
    process.env.LD_LIBRARY_PATH = `${ld}:${process.env.LD_LIBRARY_PATH ?? ""}`;
  }
}

export function langCode(label) {
  const map = {
    it: "it",
    italian: "it",
    en: "en",
    english: "en",
    es: "es",
    spanish: "es",
    de: "de",
    german: "de",
    fr: "fr",
    french: "fr",
    pt: "pt",
    portuguese: "pt",
  };
  return map[String(label).toLowerCase()] ?? "it";
}
