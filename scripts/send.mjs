#!/usr/bin/env node
// Invia una email via SMTP (Gmail) con allegato PDF opzionale.
// Uso: node scripts/send.mjs <to> <subject> <body-file.html> [allegato.pdf]
//      oppure: node scripts/send.mjs <cliente>  (usa i file in data/clients/<cliente>/)
import { loadEnv, loadAgency, clientDir } from "./lib.mjs";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createTransport } from "nodemailer";

loadEnv();
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error("Uso: node scripts/send.mjs <to> <subject> <body-file.html> [allegato]  |  node scripts/send.mjs <cliente>");
  process.exit(1);
}

let to, subject, bodyFile, attachment;
if (args.length === 1) {
  const name = args[0];
  const dir = clientDir(name);
  const clientFile = join(dir, "client.json");
  if (!existsSync(clientFile)) {
    console.error(`Cliente non trovato: ${name}`);
    process.exit(1);
  }
  const client = JSON.parse(readFileSync(clientFile, "utf8"));
  if (!client.contact?.email) {
    console.error(`Nessun contatto email per ${name}. Compila data/clients/${name}/client.json`);
    process.exit(1);
  }
  to = client.contact.email;
  subject = client.subject ?? "Proposta di collaborazione";
  bodyFile = join(dir, "email.html");
  const pdf = join(dir, "quote.pdf");
  if (existsSync(pdf)) attachment = pdf;
} else {
  [to, subject, bodyFile, attachment] = args;
}

if (!existsSync(bodyFile)) {
  console.error(`Body non trovato: ${bodyFile}`);
  process.exit(1);
}

const smtp = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: (process.env.SMTP_SECURE ?? "true") === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
};
const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
const html = readFileSync(bodyFile, "utf8");

const transporter = createTransport(smtp);
const mail = {
  from: `"${process.env.AGENCY_NAME ?? "Andrijus"}" <${from}>`,
  to,
  subject,
  html,
  attachments: attachment && existsSync(attachment)
    ? [{ path: attachment, filename: attachment.split("/").pop() }]
    : [],
};
await transporter.sendMail(mail);
console.log(`Email inviata a ${to}`);
console.log(`  Oggetto: ${subject}`);
console.log(`  Allegato: ${attachment ?? "(nessuno)"}`);