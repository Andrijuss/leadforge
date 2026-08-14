# Leadforge

Sistema di lead generation B2B: analizza siti web di potenziali clienti,
trova debolezze di design/struttura/grafica/SEO e produce un'**email di
outreach** con **preventivo PDF** (nuova grafica proposta) in allegato.

Il motore dell'analisi è un agente AI (deepseek v4 flash via opencode).
La macchina (fetch, screenshot, PDF, invio, backup) vive qui.

## Requisiti

- Node.js ≥ 20, npm
- Chromium (auto-scaricato da puppeteer in `npm install`)
- Librerie di sistema per Chromium: su server senza root, vengono estratte in
  `.local/` e caricate via `PUPPETEER_LD_LIBRARY_PATH` (vedi `.env.example`)
- Gmail: una **App password** (2FA) in `.env` per l'invio email
- SSH key collegata a GitHub per il backup (`git@github.com:Andrijuss/leadforge.git`)

## Installazione

```bash
npm install
cp .env.example .env   # compila SMTP, agenzia, ecc.
```

## Workflow (guida dettagliata in AGENTS.md)

```bash
# 1. Nuovo cliente
node scripts/client-new.mjs <nome|url> [lingua]
node scripts/fetch-site.mjs <url> [nome] [lingua]

# 2. L'agente scrive analysis.md (analisi del sito)

# 3. L'agente scrive email.html (outreach, lingua del cliente)

# 4. L'agente scrive quote.html e genera il PDF
node scripts/html2pdf.mjs data/clients/<id>/quote.html data/clients/<id>/quote.pdf

# 5. REVIEW UMANA: l'utente guarda email+PDF e dà correzioni (loop)

# 6. Invio email con allegato PDF
node scripts/send.mjs <nome-cliente>

# Backup su GitHub
bash scripts/backup.sh
```

## Struttura

```
config/agency.json     # dati agenzia e listino servizi
templates/             # email e preventivo (mockup della nuova grafica)
scripts/               # client-new, fetch-site, html2pdf, send, backup, screenshot
data/
  sites.txt            # lista siti da analizzare (un URL per riga)
  clients/<id>/        # per cliente: client.json, site.json/md, analysis.md,
                       # email.html, quote.html/pdf, screenshot.png
```

## Segreti

`.env` non è versionato. Mai committare chiavi o password.
