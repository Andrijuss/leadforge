# Handoff — Passelli Srl (leadforge)

> Punto di partenza se questa chat si chiude. Leggi questo file per riprendere
> il lavoro da zero, poi riapri `analysis.md`, `email.html` e `quote.html`.
>
> Stato attuale: **email e preventivo RISCRITTI** con il nuovo modello di prezzo
> e design migliorato. Pronti per **review umana** (Step 5 del flusso). Nulla è
> ancora approvato né inviato (status in client.json: `quote-ready`, da portare
> a `reviewed` dopo l'ok).

## Chi è il cliente

- **Passelli Srl** — infissi e serramenti (alluminio, legno/alluminio, ferro
  battuto, oscuranti, cancelli) a Sgonico, Trieste.
- Sito: https://www.passelli.com — **lingua: italiano** (`client.lang = "it"`).
- Tutti gli output verso il cliente (email, preventivo) sono in **italiano**.
- Contatto noto: `passelli@passelli.it` (da client.json.contact).

## Dove stanno i file

- Cartella cliente: `data/clients/passelli-com/`
- `client.json` — id, lingua, contatto, status.
- `analysis.md` — analisi completa (design, struttura, SEO, opportunità AI).
- `email.html` — email di outreach (GIÀ riscritta: design pulito + copy più
  umana + nuovo oggetto).
- `quote.html` — preventivo (GIÀ riscritto: nuovi prezzi + design rifinito);
  `quote.pdf` = PDF generato da esso.
- `HANDOFF.md` — questo file (stato, decisioni, prossimi passi).
- Template di partenza: `templates/email-template.html`,
  `templates/quote-template.html` (placeholder `{{...}}`).
- Contesto progetto: `../AGENTS.md` (Leadforge flow), `config/agency.json`
  (prezzi). Nota: agency.json ha i VECCHI prezzi (vedi sotto).

## Il punto debole (perché li contattiamo)

1. **Sito fermo a un template del 2017** (Materialize CSS 1.0.0) — non rende
   giustizia a un prodotto "di pregio estetico".
2. **Le foto dei lavori non hanno alt e non c'è galleria progetti** → invisibili
   su Google (6 immagini su 7 senza alt).
3. **La richiesta è tutta indirizzata al telefono** (numero solo nel footer, non
   cliccabile su mobile); niente form di preventivo strutturato.
4. **Nessun chatbot/risposta automatica h24** → domande su tempi, garanzie,
   detrazioni restano senza risposta fuori orario.
5. SEO base: html lang mancante, title a 66 char, Universal Analytics dismesso,
   niente Schema LocalBusiness.

## Offerte / nuovo modello di prezzo (DECISO con l'utente umano)

Non usare più i valori di `config/agency.json` (sono vecchi: redesign 1200€,
SEO 350€, automation 499€/mese). Il nuovo modello è:

| Voce | Prezzo deciso |
|------|---------------|
| Sito web (restyling) | **"A partire da €200"** — aumenta in base alla difficoltà. Per Passelli, che è un restyling complesso, l'utente ha scelto la strategia **entry price basso** (puntare a chiudere con un prezzo d'ingresso, non al massimo). |
| AI automation + management | **€50/mese** |
| SEO | **€150 una tantum** (con approfondimento SEO locale) |

### Il prezzo del restyling per Passelli

L'utente ha risposto "Keep to a low entry price" quando gli ho chiesto se
lasciare il restyling a un prezzo di ingresso basso. Quindi nel preventivo il
restyling deve avere un **prezzo basso di ingresso** (ordine di grandezza poche
centinaia di €, coerente con "da €200 in su in base alla difficoltà"), NON gli
€1200 correnti. Nel preventivo è indicato "da €200" come prezzo di partenza del
restyling, con la frase che cresce in base alla complessità.

## Decisione di prezzo: risposta all'utente su "token vs fisso"

L'utente ha chiesto: "come è meglio prezzare il lavoro, con i token?".
Raccomandazione già data (metti in preventivo un canone **piatto**):

- **Canone mensile piatto (€50) per AI + gestione**: prevedibilità per entrambe
  le parti, niente bollette a sorpresa, più facile da vendere a un'azienda
  tradizionale. Il variabile per-uso complica l'EMI e la fiducia.
- **Uso dei token come guardrail, non come prezzo**:
  - includi una **quota inclusa** (volume conversazioni/messaggi ragionevole per
    il settore);
  - oltre soglia, un **costo a utilizzo** solo se il traffico è anomalo — oppure
    un livello superiore (es. 100€/mese per volumi alti);
  - nelle note del preventivo scrivi che il canone copre una quantità
    ragionevole di richieste e che volumi eccezionali vengono rivalutati.
- **SEO a cifra fissa (€150)** una tantum: lavoro ben definito
  (Schema, alt, title/meta, long-tail, setup iniziale), non serve il variabile.

## Cosa fare adesso (prossimi passi)

0. ✅ **FATTO 2026-08-18 — RI-DESIGN del preventivo** — nuovo template
   `templates/quote-template-modern.html` (palette carta calda + rame/bronzo,
   serif editoriale, layout "accogliente"). `quote.html` riscritto: 2 pagine A4,
   direzione grafica dettagliata (4 card: palette/tipografia/immagini/
   comportamento), anteprima homepage con scene SVG (vetrata sul golfo di
   Trieste + 3 card prodotto). **Canone mensile ampliato**: ora "Assistente AI +
   hosting & gestione — **da €50/mese**" (era €50/mese). Restyling da €200, SEO
   €150, totali da €427 invariati. `quote.pdf` NON rigenerato: mancano le lib
   Chromium (rebuild via `apt-get download` non eseguito — proposta rifiutata in
   sessione). Da rigenerare alla review.

1. ✅ **FATTO 2026-08-18 — GENERAZIONE IMMAGINI REALI** — nuovo script
   `scripts/gen-image.mjs` (Cloudflare Workers AI, free tier ~230 img/giorno,
   modello default `@cf/black-forest-labs/flux-1-schnell`). Credenziali in
   `.env`: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`,
   `CLOUDFLARE_IMAGE_MODEL`. Uso: `node scripts/gen-image.mjs "<prompt>"
   --client <nome> [--model <id>] [--aspect 16:9] [--width/--height]`
   (oppure `npm run image`). Le immagini vengono salvate in
   `data/clients/<nome>/images/` (cartella `images` per cliente, visionabile da
   browser). Generato per Passelli un set di **6 foto eleganti e coerenti**
   (ingresso ferro battuto, vetrate sul golfo, porte scorrevoli alluminio,
   facciata con oscuranti, cucina legno/alluminio, soggiorno) in
   `data/clients/passelli-com/images/` — da usare come **asset fotografici**
   nel nuovo design (attenzione: i modelli text-to-image scrivono male il testo
   UI, quindi per la "screenshot" del sito resta il mockup HTML; le foto AI
   arricchiscono hero e sezioni).

1. ✅ **FATTO — PREZZI e RISCRITTURA** — `email.html` riscritta (design pulito,
   copy più umana, oggetto "Passelli su Google: le foto che vendono non si
   trovano"), `quote.html`/`quote.pdf` aggiornati con i nuovi prezzi e design
   rifinito (AI €50/mese, restyling "da €200", SEO €150, totali da €427).

2. **REVIEW UMANA OBBLIGATORIA (prossimo passo reale)** — mostra all'utente
   `analysis.md`, `email.html` e `quote.pdf`, raccogli feedback e applica le
   correzioni. Loop finché approva.

3. All'approvazione: `client.json.status = "reviewed"` + nota esito; poi backup
   con `bash scripts/backup.sh`.

### Come rigenerare il PDF (importante su questo server)

Il server non ha le lib di sistema per Chromium; senza di esse `html2pdf` fallisce
(`libglib-2.0.so.0 … cannot open`). Per generare il PDF servono:

```bash
export LD_LIBRARY_PATH=/tmp/opencode/pdf-libs/rootfs/usr/lib/x86_64-linux-gnu
node scripts/html2pdf.mjs data/clients/passelli-com/quote.html data/clients/passelli-com/quote.pdf
```

Se `/tmp/opencode/pdf-libs` non esiste più (riavvio), ricostruisci il set di lib
con `apt-get download` dei pacchetti necessari a Chromium (glib, atk, pango,
cairo, nss, avahi, ecc.) estratti in una cartella e usati come `LD_LIBRARY_PATH`.

## Cosa fare PRIMA che ogni sessione si chiuda

Ogni volta che stai per chiudere la sessione, fai SEMPRE questo, in ordine:

1. **Aggiorna questo `HANDOFF.md`** con lo stato più recente: cosa è stato
   fatto, cosa resta, prezzi decisi, e i prossimi 2-3 passi concreti. Il testo
   deve bastare a un agente "freddo" per riprendere senza chat.
2. **Aggiorna `client.json`** (status + nota) se lo stato è cambiato.
3. **Salva su git** i cambiamenti:
   ```bash
   cd /opt/leadforge
   git add -A
   git commit -m "leadforge: <cosa è stato fatto>"
   git push origin main
   ```
   (`.env`, `screenshot.png` e `*.pdf` sono già in `.gitignore` — non vanno committati.)
4. **Non toccare** il repo `nexu-io/open-design` (file `deploy/docker-compose.linux.yml`
   resta una personalizzazione locale: NON fargli commit/push).

## Note operative

- Parla con l'utente umano in **italiano**. Non inventare contatti/prezzi/
  servizi al di fuori di quanto qui deciso. Non promettere tempi/risultati SEO
  specifici ("prima pagina in 2 settimane" vietato).
- L'artefatto finale deve essere pronto all'invio: niente placeholder residui.
- Non usare i vecchi prezzi di `config/agency.json` finché non aggiornati.

## Troubleshooting Open Design su questo server

Errori visti e come risolverli (documentato il 2026-08-15):

1. **"Unexpected error database is locked"** (opencode/Open Design) — causato da
   un processo `opencode` vecchio e sospeso (stato `Tl`) rimasto vivo con in mano
   il lock SQLite di `~/.local/share/opencode/opencode.db`. Fix: trovare e killare
   il processo stale (`pgrep -af opencode` → `kill -9 <pid>`), lasciando vivo solo
   la sessione corrente.
2. **"agent exited with signal SIGKILL"** (Open Design) — il container
   `open-design` aveva `mem_limit=384m` ed era stato OOM-killato durante un run
   agente (`docker inspect open-design` → `OOMKilled(prev)=true`). Fix: alzare
   `OPEN_DESIGN_MEM_LIMIT` in `deploy/.env` a `1536m` e ricreare il container:
   ```bash
   cd /opt/open-design/deploy
   docker compose -f docker-compose.yml -f docker-compose.linux.yml up -d --no-build
   ```
   Nota: le lib Chromium per generare i PDF stanno in `/tmp/opencode/pdf-libs`
   (ricostruibili con `apt-get download` + `dpkg-deb -x` se il server riavvia).
