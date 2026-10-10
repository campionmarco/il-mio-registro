# Il Mio Registro — Registro Personale Scolastico

**Il Mio Registro** è una Single Page Application (SPA) web leggera e moderna, pensata per studenti. Permette di tenere traccia del proprio rendimento scolastico, calcolare le medie automatiche per periodo e per materia, simulare l'impatto di nuovi voti e gestire un'agenda con compiti e verifiche.

I dati vengono sincronizzati in remoto tramite l'integrazione con **Supabase (REST API)**, consentendo l'accesso continuo al proprio registro da qualsiasi dispositivo.

---

## Struttura del Progetto

Il codice è organizzato in un'architettura modulare basata su Vanilla JavaScript, HTML5 e CSS3, senza la necessità di framework o build-tool complessi:

```text
REGISTRO-PERSONALE/
├── css/
│   └── style.css           # Design system, variabili CSS (Dark Theme), layout e modali
├── js/
│   ├── api.js              # Chiamate REST (GET/PATCH) verso Supabase per la persistenza dati
│   ├── app.js              # Logica di render per le schermate (Home, Voti, Materia, Agenda, Stats)
│   ├── charts.js           # Gestione e configurazione dei grafici con Chart.js
│   ├── config.js           # Stato globale (DATA), credenziali Supabase (NON committato, vedi .gitignore)
│   ├── config.example.js   # Template di configurazione — copiare in config.js e inserire le proprie chiavi
│   ├── import_csv.js       # Parser CSV per importazione agenda da ClasseViva
│   └── ui.js               # Gestione navigazione SPA, modali interattivi e simulatore voto
├── index.html              # Struttura Single Page Application e modali
├── PRIVACY.md              # Privacy Policy (GDPR)
└── .gitignore              # Esclude js/config.js e file sensibili
```

---

## Scopo del Progetto

Lo scopo principale dell'applicazione è offrire uno strumento semplice, veloce e privo di distrazioni per:

- **Monitorare la media voto**: Avere sempre chiara la propria situazione scolastica complessiva e suddivisa per trimestre/pentamestre.
- **Pianificare lo studio**: Organizzare verifiche e compiti a casa con un calendario visivo chiaro.
- **Simulare scenari di voto**: Comprendere preventivamente quale voto è necessario prendere per alzare o mantenere la media di una materia.
- **Visualizzare i progressi**: Analizzare il trend dei voti e la loro distribuzione statistica tramite grafici dinamici.

---

## Spiegazione Dettagliata delle Funzionalità

### 1. < Home Screen (Dashboard)

- **Saluto dinamico e Data**: Mostra un messaggio di saluto personalizzato in base all'ora (Buongiorno / Buon pomeriggio / Buonasera) e la data attuale.
- **Grafico Trend**: Grafico a linee dell'andamento temporale degli ultimi 10 voti inseriti.
- **Metriche Rapide**: Schede sintetiche con la Media Generale e il numero totale di voti registrati.
- **Ultimi Voti ed Eventi Imminenti**: Anteprima rapida delle ultime 5 valutazioni e dei prossimi impegni in agenda.

### 2. Sezione Voti e Dettaglio Materia

- **Filtro per Periodo**: Selezione rapida tra Generale, 1° periodo e 2° periodo.
- **Grafici andamento per periodo**: Nella sezione Voti, 3 grafici a linee identici a quello della Home mostrano l'andamento temporale dei voti per "Generale", "1° periodo" e "2° periodo", visibili a seconda del chip selezionato.
- **Elenco Materie**: Lista automatica delle materie con badge circolare colorato in base alla media:
  - Verde: Media ≥ 6.0
  - Giallo: Media tra 5.0 e 5.9
  - Rosso: Media < 5.0
- **Dettaglio per Tipologia**: Calcolo separato della media per valutazioni Scritte, Orali e Pratiche.
- **Simulatore di Voto**: Inserendo un voto ipotetico, il sistema calcola istantaneamente la nuova media della materia e la differenza (↑ / ↓) rispetto a quella attuale, senza salvare il dato nel DB.
- **Gestione Voti**: Storico completo con possibilità di eliminazione singola di un voto.

### 3. Agenda Scolastica

- **Calendario Mensile**: Griglia interattiva con navigazione tra i mesi.
- **Indicatori Visivi (Dots)**:
  - Pallino Verde: Compiti a casa scritti/orali.
  - Pallino Rosso: Verifiche o test.
- **Gestione Eventi per Giorno**: Selezione di una data per visualizzare o rimuovere gli eventi programmati.
- **Import CSV**: Pulsante per importare eventi da file CSV esportati da ClasseViva.

### 4. Statistiche Avanzate

- **Report Rendimento**: Identificazione automatica della Materia migliore, Materia peggiore e del numero di materie insufficienti.
- **Grafico a Torta (Doughnut)**: Ripartizione percentuale delle valutazioni in tre fasce (Insufficienti, Sufficienti, Buoni/Ottimi).
- **Confronto Periodi**: Confronto sintetico tra le medie complessive del 1° e del 2° periodo.

### 5. Interfaccia e Pulsante Flottante (FAB)

- **Pulsante FAB (+)**: Si adatta alla sezione attiva:
  - Nella sezione Agenda: apre il modulo "Aggiungi evento".
  - Nelle altre sezioni: apre il modulo "Aggiungi voto".
- **Supporto Touch/Mobile**: Layout responsive nativo per smartphone, con navbar fissa e modali a scomparsa.

---

## Sincronizzazione Dati (Supabase REST)

L'applicazione comunica con Supabase senza librerie pesanti, utilizzando la Fetch API nativa (js/api.js):

- **loadData()**: Scarica lo stato remoto dall'endpoint REST all'avvio.
- **saveData()**: Invia gli aggiornamenti dello stato (DATA) tramite chiamata PATCH JSON per garantire che ogni voto o evento sia salvato in modo permanente.

---

## Idee e Sviluppi Futuri (Cosa Implementare)

Per evolvere ulteriormente il progetto, ecco alcune funzionalità che potresti aggiungere al codice attuale:

1. **Autenticazione e Multi-utente**
   - Stato attuale: L'app richiede e modifica un record fisso (id=eq.1).
   - Miglioramento: Integrare Supabase Auth (email/password o Google Login) per permettere a più utenti di registrare il proprio profilo ed elaborare solo i propri dati.

2. **PWA (Progressive Web App) e Funzionamento Offline**
   - Aggiungere un file manifest.json e un Service Worker per rendere la web app installabile su smartphone (Android/iOS) come app nativa e abilitare una cache locale per l'utilizzo anche in assenza di connessione internet.

3. **Voti con Pesi e Lodi**
   - Permettere di assegnare un peso a ciascun voto (es. voto da 100% o da 50% per i test brevi) e gestire le lodi (es. 10+).

4. **Import / Export e Backup JSON**
   - Aggiungere un pulsante nelle impostazioni per scaricare un file di backup .json dei propri dati o per incollarne uno e ripristinare le informazioni.

5. **Parser per Importazione da Registro Elettronico**
   - Creare un modale con una casella di testo "Incolla dati" dove poter incollare la tabella voti formattata da registri come ClasseViva o Spaggiari, popolando automaticamente materie e voti.

6. **Esportazione Agenda in Calendario (.ics)**
   - Aggiungere una funzione per esportare gli eventi o le verifiche in un file .ics sincronizzabile con Google Calendar o Apple Calendar.