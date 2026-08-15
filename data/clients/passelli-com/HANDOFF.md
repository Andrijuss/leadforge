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
- `email.html` — email di outreach (da riscrivere).
- `quote.html` — preventivo (da riscrivere); `quote.pdf` = PDF generato da esso.
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

0. ✅ **PREZZI e RISCRITTURA** — `email.html` riscritta (design pulito, copy più
   umana, oggetto "Passelli su Google: le foto che vendono non si trovano"),
   `quote.html`/`quote.pdf` aggiornati con i nuovi prezzi e design rifinito
   (AI €50/mese, restyling "da €200", SEO €150, totali da €427). Nota: per
   rigenerare il PDF su questo server serve
   `LD_LIBRARY_PATH=/tmp/opencode/pdf-libs/rootfs/usr/lib/x86_64-linux-gnu`
   (lib di sistema per Chromium, assenti di default).

1. **REVIEW UMANA OBBLIGATORIA** — mostra all'utente `analysis.md`,
   `email.html` e `quote.pdf`, raccogli feedback e applica le correzioni.
   Loop finché approva.
   venditore, in italiano, con la proposta AI + restyling + SEO. Oggetto
   specifico su 1-2 debolezze concrete. CTA chiara. ~120-180 parole di corpo.
   Aggiornare `client.subject` in client.json con l'oggetto scelto.
2. **Riscrivere `quote.html`** — design migliore, nuovi prezzi (entry price
   basso per il restyling, €50/mese AI, €150 SEO), mockup della nuova grafica
   "Artigiano premium" (antracite + rame/bronzo). Poi rigenerare
   `quote.pdf` con `node scripts/html2pdf.mjs data/clients/passelli-com/quote.html data/clients/passelli-com/quote.pdf`.
3. **Mostrare all'utente** `analysis.md`, `email.html`, `quote.pdf` (review
   obbligatoria, loop finché approva).
4. All'approvazione: `client.json.status = "reviewed"` + nota esito; poi backup
   con `bash scripts/backup.sh`.

## Note operative

- Parla con l'utente umano in **italiano**. Non inventare contatti/prezzi/
  servizi al di fuori di quanto qui deciso. Non promettere tempi/risultati SEO
  specifici ("prima pagina in 2 settimane" vietato).
- L'artefatto finale deve essere pronto all'invio: niente placeholder residui.
- Non usare i vecchi prezzi di `config/agency.json` finché non aggiornati.
