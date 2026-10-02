# AGENTS.md — contesto per agenti AI (Cursor, Claude Code, ecc.)

Questo file dà contesto operativo a qualsiasi agente AI che lavora su questo repo. Leggilo prima di generare o modificare codice.

## Cos'è questo progetto

**Il Mio Registro** è una Web App Single Page Application (SPA) mobile-first leggera, moderna e responsive, progettata per consentire agli studenti di tracciare voti, medie scolastiche, simulazioni di rendimento e un'agenda di compiti e verifiche.

* **Obiettivo**: Offrire uno strumento ad alte prestazioni, privo di distrazioni e di boilerplate superfluo per la gestione del rendimento scolastico.
* **Architettura**: Single Page Application (SPA) modulare scritta in **Vanilla JavaScript (ES6+)**, **HTML5** e **CSS3** puro (Dark Theme nativo con variabili CSS). Non usa framework pesanti (no React/Vue) né bundler (no Vite/Webpack).
* **Struttura Modulare**:
  * `index.html`: Struttura della SPA e dei modali overlay.
  * `css/style.css`: Stili globali, variabili CSS e componenti.
  * `js/config.js`: Stato globale (`DATA`), credenziali API ed helper matematici.
  * `js/api.js`: Integrazione REST API nativa (`fetch`) con **Supabase** per il caricamento/salvataggio dati.
  * `js/charts.js`: Configurazione e rendering dei grafici tramite **Chart.js** (incluso via CDN).
  * `js/ui.js`: Navigazione tra sezioni, apertura/chiusura modali e simulatore di voto.
  * `js/app.js`: Logica di render delle schermate (*Home*, *Voti*, *Materia*, *Agenda*, *Stats*).
* **Backend & Persistenza**: Comunicazione remota tramite chiamate HTTP REST native (GET e PATCH JSON) dirette verso l'endpoint Supabase (`/rest/v1/registro`).

## Stack e convenzioni

### 🛠️ Tech Stack
* **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 puro (senza framework né bundler tipo Vite/Webpack)[cite: 12].
* **Visualizzazione Dati**: Chart.js (importato via CDN).
* **Backend & Database**: Supabase REST API (comunicazione HTTP nativa tramite `fetch`).
* **Architettura**: Single Page Application (SPA) con stato locale sincronizzato (`DATA`) e moduli JS divisi per responsabilità (`config.js`, `api.js`, `charts.js`, `ui.js`, `app.js`).

## Regole importanti quando modifichi questo codice

* **Attivazione Plan Mode**: Attiva la modalità *Plan Mode* per pianificare i passaggi chiave prima di scrivere codice per nuove funzionalità o refactoring complesse.
* **Zero Framework e Zero Dipendenze**: Mantieni la struttura modulare in Vanilla JavaScript (ES6+), HTML5 e CSS3 puro, senza installare pacchetti `npm` o introdurre framework come React o Vue.
* **Gestione dello Stato (`DATA`) e Sincronizzazione**:
  * Ogni modifica ai dati deve aggiornare direttamente l'oggetto globale `DATA`.
  * Ogni mutazione dello stato deve essere seguita dall'invocazione di `saveData()` per persistere i dati su Supabase e dal successivo `render()` per aggiornare l'interfaccia.
* **Design System e Variabili CSS**:
  * Utilizza esclusivamente le variabili CSS definite in `:root` all'interno di `css/style.css` (es. `var(--accent)`, `var(--bg-card)`)[cite: 14].
  * Evita l'uso di stili inline nel codice HTML o generati via JS.
* **Stile di Risposta dell'Agente**: Fornisci risposte dirette, sintetiche ed essenziali, focalizzate unicamente sulle modifiche al codice e prive di preamboli superflui.
* **Performance, Accessibilità e Sicurezza**:
  * Verifica che i componenti e i colori rispettino i requisiti base di contrasto e accessibilità.
  * Valida sempre i dati inseriti dall'utente nei moduli prima di eseguire le chiamate API REST verso il database Supabase.
* **Convenzioni per i Commit**: Utilizza lo standard *Conventional Commits* per descrivere ciascun aggiornamento (es. `feat: ...`, `fix: ...`, `style: ...`).

## Cosa NON fare mai

### 🚫 Architettura e Dipendenze
* **Non installare pacchetti `npm`** e non introdurre framework JavaScript (come React, Vue, Angular o Svelte).
* **Non aggiungere bundler o build tool** (come Vite, Webpack, Parcel o Babel): il progetto deve rimanere in Vanilla JS nativo, eseguibile direttamente dal browser.
* **Non aggiungere librerie CSS esterne** (come Tailwind CSS o Bootstrap): l'interfaccia deve basarsi su CSS3 puro e sulle variabili definite nel Design System in `css/style.css`.

### 🔄 Gestione dello Stato e Persistenza
* **Non manipolare direttamente il DOM ignorando lo stato**: qualsiasi aggiornamento di dati deve sempre seguire il flusso: modifica dell'oggetto globale `DATA` $\rightarrow$ invocazione di `saveData()` $\rightarrow$ esecuzione di `render()`.
* **Non bypassare il modulo `js/api.js`**: tutte le chiamate HTTP (GET/PATCH) verso l'endpoint REST di Supabase devono passare unicamente per le funzioni centralizzate di gestione API.
* **Non hardcodare credenziali Supabase** o URL di connessione in file diversi da `js/config.js`.

### 🎨 Stile e Struttura del Codice
* **Non usare stili inline** (es. `style="..."` in HTML o `element.style.color` in JS): applica sempre le classi CSS e rispetta le variabili definite in `:root` dentro `css/style.css` (es. `var(--accent)`, `var(--bg-card)`).
* **Non unire la logica di calcolo con il rendering**: i calcoli matematici (medie, differenze, simulazioni) vanno definiti come funzioni helper in `js/config.js`, mantenendo `js/app.js` e `js/ui.js` focalizzati solo sulla presentazione.
* **Non unificare i file JS**: mantieni la netta separazione dei moduli (`config.js`, `api.js`, `charts.js`, `ui.js`, `app.js`).

## Nota per agenti AI locali (Qwen3/Ollama e simili con "thinking mode")

Se stai utilizzando un modello AI locale con capacità di ragionamento / thinking mode (es. Qwen3, DeepSeek-R1 o Qwen2.5-Coder gestiti via Ollama)[cite: 12], rispetta le seguenti direttive durante la fase di pensiero interno e nella generazione della risposta:

### 🧠 Nella fase di ragionamento interno (`<think>`):
1. **Verifica Architetturale**:
   * Controlla tassativamente di **NON introdurre** librerie external, pacchetti `npm`, bundler o framework (React, Vue, Tailwind, ecc.)[cite: 12].
   * Conferma che la soluzione utilizzi esclusivamente **Vanilla JavaScript (ES6+)**, **CSS3 nativo** e la **Fetch API**[cite: 12, 14].
2. **Tracciamento dello Stato e Sincronizzazione**:
   * Pianifica ogni modifica accertandoti che segua il flusso obbligatorio:
     $$\text{Modifica dell'oggetto } \texttt{DATA} \longrightarrow \texttt{saveData()} \longrightarrow \texttt{render()}$$
3. **Verifica delle Variabili CSS**:
   * Assicurati che eventuali nuovi elementi grafici utilizzino i token di design definiti in `css/style.css` (es. `var(--accent)`, `var(--bg-card)`).

### 📤 Nell'output finale (Risposta):
* **Sintesi Assoluta**: Non ripetere la logica di ragionamento già sviluppata nel blocco di pensiero.
* **Solo Codice e Modifiche**: Fornisci direttamente il codice modificato o le istruzioni esecutive passo-passo, senza convenevoli, preamboli o spiegazioni ridondanti.

## Riferimento

Per il contesto di business più ampio (roadmap, pricing, strategia commerciale di Marco Digital Solutions) questo repo è indipendente e non contiene quei documenti — chi lavora qui non ha bisogno di conoscerli per contribuire al codice.