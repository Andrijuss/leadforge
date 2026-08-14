#!/usr/bin/env node
// Crea la cartella di un nuovo cliente.
// Uso: node scripts/client-new.mjs <nome|url> [lingua]
import { loadEnv, loadAgency, clientDir, langCode } from "./lib.mjs";
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

loadEnv();
const [name, langRaw] = process.argv.slice(2);
if (!name) {
  console.error("Uso: node scripts/client-new.mjs <nome|url> [lingua]");
  process.exit(1);
}
const agency = loadAgency();
const lang = langRaw ? langCode(langRaw) : (process.env.LANG ?? "it");
const dir = clientDir(name);
const now = new Date().toISOString();
const client = {
  id: dir.split("/").pop(),
  name,
  url: name.includes("://") ? name : "",
  lang,
  sector: "",
  contact: { name: "", email: "", phone: "" },
  created: now,
  status: "new", // new | analyzed | email-written | quote-ready | reviewed | sent
  notes: [],
};
const file = join(dir, "client.json");
if (existsSync(file)) {
  console.error(`Cliente già esistente: ${file}`);
  process.exit(1);
}
writeFileSync(file, JSON.stringify(client, null, 2));
console.log(`Creato cliente: ${file}`);
console.log(`Step successivo: node scripts/fetch-site.mjs ${name}`);