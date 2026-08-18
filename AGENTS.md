# Leadforge — Brief operativo per l'agente AI

Leadforge è un sistema di lead generation B2B: analizza siti web di potenziali
clienti, individua debolezze (design, struttura, grafica, SEO), e produce un
**email di outreach** con allegato un **preventivo PDF** con la nuova proposta
grafica. Un essere umano rivisita e approva prima dell'invio.

## Ruolo dell'agente

Tu sei **l'agente AI** (deepseek v4 flash, via opencode). La tua intelligenza è
il motore dell'analisi, della copywriting e del design. Il progetto ti fornisce
solo la meccanica: fetch del sito, screenshot, rendering PDF, invio email,
backup git.

## File `md` per cliente (leggili prima di modificare)

Ogni cliente ha una propria cartella in `data/clients/<id>/` con file `.md`
che raccontano la storia del lavoro e le decisioni prese, incluso un
`HANDOFF.md` di ripristino (usato per riprendere se la chat si chiude, con
stato attuale, prezzo deciso e prossimi passi).

- Prima di modificare email/preventivo di un cliente, **leggi sempre il
  `HANDOFF.md` e l'`analysis.md`** della sua cartella: lì stanno lingua, prezzi
  decisi, debolezze e il "punto di partenza".
- Se una sessione futura deve riprendere quel cliente, parti da essi.
- Quando una decisione di prezzo/offerta cambia, aggiorna il `HANDOFF.md` di
  quel cliente.

## Flusso di lavoro (seguilo in ordine)

### Step 1 — Ingresso cliente

L'utente ti fornisce uno o più siti (URL), in chat o in `data/sites.txt`
(un URL per riga). Per ogni sito:

```
node scripts/client-new.mjs <nome|url> [lingua]
node scripts/fetch-site.mjs <url> [nome] [lingua]
```

`fetch-site` scarica HTML, estrae `site.json`/`site.md` (SEO + struttura +
contenuto) e `screenshot.png` (design attuale). Leggi **entrambi**: la
screenshot è il dato principale per il design, `site.md` per SEO/struttura.

> Su server senza root il browser richiede librerie locali: se puppeteer fallisce,
> esporta `LD_LIBRARY_PATH=/opt/leadforge/.local/usr/lib/x86_64-linux-gnu` e riprova.

### Step 2 — Analisi (analisi del sito)

Scrivi `data/clients/<id>/analysis.md` con:
1. **Sintesi** — chi è, settore, cosa vende, pubblico.
2. **Debolezze di design** — confronta lo screenshot con gli standard 2025/26:
   hero, tipografia, gerarchia visiva, palette, whitespace, responsive, CTA,
   coerenza brand, immagini, micro-interazioni.
3. **Debolezze di struttura/usabilità** — navigazione, footer, sezioni chiave,
   form di contatto, percorso di conversione, mobile.
4. **Debolezze SEO** — title/meta/h1/alt/schema/speed da `site.json`.
5. **Opportunità AI** — processi ripetitivi del loro settore automatizzabili
   (risposte clienti, preventivi, ordini, calendario, FAQ, lead capture...).
6. **Posizionamento proposta** — frase "we/vi aiutiamo a..." in 1 riga.

Sempre in **`client.lang`** (lingua del cliente). Aggiorna
`client.json.status = "analyzed"`.

### Step 3 — Email di outreach

Scrivi `data/clients/<id>/email.html` usando `templates/email-template.html`
come base, sostituendo i placeholder `{{...}}`. Regole:

- **Lingua** = `client.lang` (il cliente va contattato nella sua lingua: it/en
  a seconda della zona).
- **Oggetto**: da 1 a 2 punti deboli concreti, esempio "il tuo sito perde
  visitatori su mobile" — no clickbait.
- **Apertura** personalizzata: cita qualcosa di reale del loro sito.
- **3 debolezze** specifiche con valore per loro (mai tecnicismi puri).
- **Offerta**: restyling + SEO + **automazione processi con AI** (differenziante).
- **CTA chiara** ({{CTA_URL}}/{{CTA_TEXT}}): es. "preventivo gratuito".
- **Breve, umana, senza toni da venditore**: 120-180 parole di corpo.
- Salva il soggetto in `client.subject`.

### Step 4 — Preventivo PDF

Scrivi `data/clients/<id>/quote.html` da `templates/quote-template.html`.
Il cuore è **{{DESIGN_PREVIEW}}**: un mockup HTML/CSS inline della **nuova
homepage proposta** (hero, palette, tipografia, CTA) — lo scegli in base a:
- il settore del cliente,
- le tendenze di design 2025/26 per quel settore,
- cosa fanno i competitor migliori (benchmark mentale di mercato).

Riempi tutti i placeholder; usa prezzi da `config/agency.json`. Poi:

```
node scripts/html2pdf.mjs data/clients/<id>/quote.html data/clients/<id>/quote.pdf
```

Aggiorna `client.json.status = "quote-ready"`.

### Step 5 — Review umana (obbligatoria)

Mai inviare prima della review. Fai vedere all'utente:
1. `analysis.md` (il perché della proposta),
2. `email.html` (aprendolo nel browser o mostrandolo),
3. `quote.pdf`.

Chiedi feedback e applica le correzioni richieste (in stile "correggi X nell'email
e Y nel preventivo"). **Loop finché l'utente non approva.** Aggiorna
`client.json.status = "reviewed"` e aggiungi una nota con l'esito.

### Step 6 — Invio email

Dopo l'approvazione, l'utente fornisce l'email di contatto del cliente (se non
già in `client.json.contact`):

```
node scripts/send.mjs <nome-cliente>
```

L'email verrà inviata con il PDF allegato. Aggiorna `client.json.status = "sent"`
e registra data/ora di invio.

## Backup su GitHub

Dopo ogni milestone (analisi, email, preventivo, invio):

```
bash scripts/backup.sh
```

Fa commit e push su `git@github.com:Andrijuss/leadforge.git`. I segreti
(`.env`) e gli artefatti pesanti (screenshot/PDF) sono in `.gitignore`.

## Regole trasversali

- **Lingua**: ogni output verso il cliente (analisi, email, preventivo) è in
  `client.lang`. Tu comunichi con l'utente umano in italiano.
- **Non inventare** contatti, prezzi o servizi del cliente: usa solo dati da
  `site.json`/`site.md`/screenshot.
- **Non promettere** tempi o risultati SEO specifici ("prima pagina in 2
  settimane" è vietato).
- **Design della proposta** = restyling moderno, non "website nuovo da zero"
  (a meno che l'utente umano non lo chieda).
- Gli artefatti finali devono essere **pronti all'invio**: HTML email completo
  (no placeholder residui), PDF ben reso, contatti corretti.

## Prima di chiudere ogni sessione

Ogni volta che stai per chiudere la sessione, fai SEMPRE questi passi:

1. **Aggiorna il `HANDOFF.md` del cliente** attivo (in `data/clients/<id>/`) con
   stato corrente, decisioni e i prossimi 2-3 passi concreti, così un agente
   "freddo" può riprendere senza chat.
2. **Aggiorna `client.json`** (status + nota) se lo stato è cambiato.
3. **Commit e push** su git come da "Backup su GitHub" sopra (`.env`,
   `screenshot.png`, `*.pdf` sono ignorati: non committarli).
4. **Non toccare il repo `nexu-io/open-design`**: il file
   `deploy/docker-compose.linux.yml` è una personalizzazione locale e NON va
   committato/pushato altrove.

### Generazione PDF su questo server

Il server non ha le lib di sistema per Chromium. Per generare un PDF servono:

```bash
export LD_LIBRARY_PATH=/tmp/opencode/pdf-libs/rootfs/usr/lib/x86_64-linux-gnu
node scripts/html2pdf.mjs data/clients/<id>/quote.html data/clients/<id>/quote.pdf
```

Se `/tmp/opencode/pdf-libs` non esiste più (es. dopo riavvio), ricostruiscilo
scaricando con `apt-get download` le lib necessarie a Chromium (glib, atk,
pango, cairo, nss, avahi, …), estraendole con `dpkg-deb -x` in una cartella e
usandola come `LD_LIBRARY_PATH`.

### Generazione immagini reali (Cloudflare Workers AI)

Per immagini **fotografiche** dentro il mockup del preventivo (hero, foto
prodotti/servizi, texture) usa Cloudflare Workers AI. La "screenshot" della
nuova homepage deve invece restare il **mockup HTML** renderizzato (testo UI
leggibile): i modelli text-to-image scrivono male navbar/titoli/bottoni.

```bash
node scripts/gen-image.mjs "<descrizione dettagliata e realistica>" \
  --client <nome> --aspect 16:9
```

L'immagine viene salvata in `data/clients/<nome>/images/` (una cartella
`images` per cliente, visualizzabile da browser). Per un percorso custom basta
passare l'output come secondo argomento posizionale.

- Chiavi in `.env`: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`
  (permesso "Workers AI: Run"), `CLOUDFLARE_IMAGE_MODEL`.
- Modelli: default gratis `@cf/black-forest-labs/flux-1-schnell` (free tier,
  ~230 img/giorno); `@cf/leonardo/lucid-origin` (testo accurato, product
  mockup); `@cf/black-forest-labs/flux-2-dev` (più qualità/fotorealismo).
- L'immagine prodotta va incrociata nel `quote.html` come
  `file://`/realtive path o incorporata in data-URI prima del
  `html2pdf` (il PDF non deve dipendere da URL remoti).
- Collegamento con open-design: Open Design non ha un provider Cloudflare
  nativo; usare invece gli script di leadforge per la generazione, oppure il
  pattern "external media orchestration" con un tool MCP (vedi
  `docs/external-media-orchestration.md` nel repo open-design).

## Checklist di qualità prima della review

- [ ] `analysis.md` cita almeno 3 debolezze specifiche (con screenshot come prova)
- [ ] `email.html`: lingua cliente, oggetto specifico, corpo <180 parole, CTA
- [ ] `quote.html`: mockup della nuova grafica coerente con il settore, prezzi coerenti con `config/agency.json` **e** con il `HANDOFF.md` del cliente (quest'ultimo vince se diverge)
- [ ] `quote.pdf` generato e visivamente pulito (niente overflow/taglio)
- [ ] `client.json` aggiornato (status, subject, contact)
