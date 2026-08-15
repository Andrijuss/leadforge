# Analisi sito — Passelli Srl (infissi e serramenti, Trieste)

URL: https://www.passelli.com — Lingua: italiano — Settore: infissi e serramenti in alluminio/legno/alluminio (Sgonico, TS)

## 1. Sintesi

Passelli Srl è una realtà storica (da anni) nel mercato degli infissi a Trieste
e provincia: fornitura e posa in opera di serramenti in alluminio, legno/alluminio,
ferro battuto, sistemi oscuranti e cancelli. Il sito è su WordPress con template
basato su **Materialize CSS 1.0.0 (framework fermo al 2017)** e stili custom,
senza CMS aggiornato rilevato e con Google Analytics **Universal (UA-…)** (dismesso da Google).

## 2. Debolezze di design

1. **Stack obsoleto, look datato.** Materialize 1.0 è del 2017. Il tratto visivo
   generico (font "inherit", palette default del builder) non differenzia Passelli
   dai concorrenti: un'azienda che vende "pregio estetico" non comunica estetica.
2. **Tipografia non definita.** Nessun font system dichiarato nel CSS rilevato:
   il sito usa l'eredità del browser. Manca una gerarchia tipografica pulita
   (headline/serif vs testo) che trasmetta il "pregio" del prodotto.
3. **Hero testuale, nessun impatto visivo.** L'unico H1 è tutto maiuscolo e il
   messaggio premium (alluminio, legno pregiato) non è supportato da un'imagerie
   forte: 7 immagini totali, la metà senza alt, nessun video montato o progetto
   in evidenza. Per un settore "a vista" (porte, vetrate, scorrevoli) l'assenza
   di sezioni galleria/progetti di pregio è un freno alla conversione.
4. **Nessuna micro-interazione moderna.** Header non sticky, niente reveal
   on-scroll, niente hover state su schede prodotto, nessuna animazione sobria
   adatta a un brand di fascia medio-alta.

## 3. Debolezze di struttura e usabilità

1. **Navigazione affollata.** 26 voci di menu: contrasta con la semplicità di un
   catalogo infissi (che avrebbe 4-6 voci). Più menu = più dispersione, soprattutto
   su mobile.
2. **Percorso di conversione debole.** La CTA principale invita a "telefonare"
   in un H2 gridato in maiuscolo: buona per l'urgenza, ma manca un form/scheda
   "richiedi preventivo" strutturato (input email/telefono/modulo) ben visibile
   e manca una sezione dedicata alla richiesta misure. Il form `submit` esiste
   ma la pagina sembra pensata più per il telefono che per lead organici.
3. **Contatti non strutturati.** Telefono ed email compaiono solo nel footer di
   testo (passelli@passelli.it, +39 040 225 821), non come link `tel:` / `mailto:`
   e non in un blocco contatti ripetuto nelle pagine chiave. Su mobile "tocca per
   chiamare" è il gesto naturale che qui è assente.
4. **Footer ricco ma freddo.** Info legali e nav presenti, ma nessun richiamo a
   portfolio/galleria/progetti recenti e nessuna CTA secondaria.

## 4. Debolezze SEO

1. **`html lang` non dichiarato** — passaggio di base per Google e screen reader.
2. **Title a 66 caratteri** (ideale 50-60) e che ripete i termini: da compattare
   con localizzazione forte es. "Infissi in alluminio e legno/alluminio a Trieste | Passelli".
3. **6 immagini su 7 senza `alt`** — asset visivi chiave del sito invisibili alla ricerca immagini.
4. **Universal Analytics dismesso (UA-114857472-57)** — nessuna raccolta dati funzionante oggi; va migrato a GA4/tag manager.
5. **1 solo blocco JSON-LD** generico: manca Schema *LocalBusiness* con
   indirizzo/telefono/orari che qualifica la ricerca locale "infissi Trieste".
6. **Word count pagine molto basso** (391 parole homepage): poco contenuto
   semantico per i servizi; occasioni perse su long-tail come "cancelli trieste",
   "scorrevoli legno-alluminio", "sistemi oscuranti".
7. **Nessun link social** rilevato nel footer/nav.

## 5. Opportunità di automazione AI (differenziante)

Il settore infissi ha processi ripetitivi perfetti da delegare:

1. **Follow-up automatico delle richieste preventivo**: dopo la scheda "richiedi
   preventivo", un assistente AI conferma subito via email/WhatsApp la ricezione,
   raccoglie misure/anticipi e fissa il sopralluogo — niente lead persi nel weekend.
2. **Qualificazione dei lead h24**: chatbot AI sul sito che risponde a domande
   frequenti (tempi di posa, garanzie, materiali, finanziabili/detrazioni) e
   filtra i contatti già pronti all'acquisto per il team di vendita.
3. **Appuntamenti e sopralluoghi**: gestione automatica del calendario posa
   (sopralluogo → offerta → conferma) con reminder via email/WhatsApp.
4. **Risposte FAQ e preventivi "da catalogo"**: AI che dai listini prodotti genera
   preventivi preliminari coerenti prima dell'intervento umano.

## 6. Posizionamento proposta

> "Facciamo sì che il sito Passelli venda come il vostro prodotto: un design
> moderno e pulito da cui i lead arrivano al telefono, e un assistente AI che
> risponde 24/7 ai clienti che in questo momento restano senza risposta."