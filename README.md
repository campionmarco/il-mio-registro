# Il Mio Registro — Registro Personale Scolastico

**Il Mio Registro** è una Single Page Application (SPA) web leggera e moderna, pensata per studenti. Permette di tenere traccia del proprio rendimento scolastico, calcolare le medie automatiche per periodo e per materia, simulare l'impatto di nuovi voti e gestire un'agenda con compiti e verifiche.

I dati vengono sincronizzati in remoto tramite l'integrazione con **Supabase (REST API)**, consentendo l'accesso continuo al proprio registro da qualsiasi dispositivo.

---

## Foto

<table>
  <tr>
    <td align="center">
      <img width="200" alt="Screenshot 4" src="https://github.com/user-attachments/assets/b0fd9061-edf9-4da4-8390-1be39276ed11" />
    </td>
    <td align="center">
      <img width="200" alt="Screenshot 6" src="https://github.com/user-attachments/assets/a102dc7d-79e9-455c-a454-0d453a05d415" />
    </td>
    <td align="center">
      <img width="200" alt="Screenshot 1" src="https://github.com/user-attachments/assets/85dd886c-cdcc-415e-8d44-e09eb4b13b3c" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img width="200" alt="Screenshot 2" src="https://github.com/user-attachments/assets/06288b18-1034-428a-8d69-9c54f1dae76e" />
    </td>
    <td align="center">
      <img width="200" alt="Screenshot 3" src="https://github.com/user-attachments/assets/a0a5c430-16ed-4192-99b6-fa740786c6a2" />
    </td>
    <td align="center">
      <img width="200" alt="Screenshot 5" src="https://github.com/user-attachments/assets/4b89df42-965f-4a05-8154-9916150ca151" />
    </td>
  </tr>
</table>


---

## Struttura del Progetto

Il codice è organizzato in un'architettura modulare basata su Vanilla JavaScript, HTML5 e CSS3, senza la necessità di framework o build-tool complessi:

```text
IL-MIO-REGISTRO/
├── css/
│   └── style.css           # Design system, variabili CSS (Dark Theme), layout e modali
├── js/
│   ├── api.js              # Chiamate REST (GET/PATCH) verso Supabase per la persistenza dati
│   ├── app.js              # Logica di render per le schermate (Home, Voti, Materia, Agenda, Stats)
│   ├── charts.js           # Gestione e configurazione dei grafici con Chart.js
│   ├── config.js           # Stato globale (DATA) e credenziali Supabase (da sostituire con le proprie)
│   ├── import_csv.js       # Parser CSV per importazione agenda da ClasseViva
│   └── ui.js               # Gestione navigazione SPA, modali interattivi e simulatore voto
├── index.html              # Struttura Single Page Application e modali
├── PRIVACY.md              # Privacy Policy (GDPR)
└── .gitignore              # Esclude file sensibili
```

---

## Scopo del Progetto

Lo scopo principale dell'applicazione è offrire uno strumento semplice, veloce e privo di distrazioni per:

- **Monitorare la media voto**: Avere sempre chiara la propria situazione scolastica complessiva e suddivisa per primo/secondo periodo.
- **Pianificare lo studio**: Organizzare verifiche e compiti a casa con un calendario visivo chiaro.
- **Simulare scenari di voto**: Comprendere preventivamente quale voto è necessario prendere per alzare o mantenere la media di una materia.
- **Visualizzare i progressi**: Analizzare il trend dei voti e la loro distribuzione statistica tramite grafici dinamici.

---

## Spiegazione Dettagliata delle Funzionalità

### 1. Home Screen (Dashboard)

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

### 6. Login con Credenziali Personali e RLS Database (Supabase)
---

## Sincronizzazione Dati (Supabase REST)

L'applicazione comunica con Supabase senza librerie pesanti, utilizzando la Fetch API nativa (js/api.js):

- **loadData()**: Scarica lo stato remoto dall'endpoint REST all'avvio.
- **saveData()**: Invia gli aggiornamenti dello stato (DATA) tramite chiamata PATCH JSON per garantire che ogni voto o evento sia salvato in modo permanente.

---

## Crea il tuo registro personale

Ogni persona usa **il proprio database e il proprio login**: i dati di ciascuno restano separati e privati. Tempo necessario: circa 20 minuti. Costo: 0€ (piani gratuiti di GitHub, Supabase e Vercel).

> **Importante:** il file `js/config.js` di questo repository contiene l'URL e la chiave del *mio* progetto Supabase. Al passo 5 devi sostituirli con i tuoi. Non usare i miei: non funzionerebbero e non avresti accesso ai tuoi dati (e neanche ai miei).

### 1. Copia il progetto

1. Clicca su **Use this template**.
2. Il progetto viene copiato nel tuo account GitHub.

### 2. Crea il database su Supabase

1. Vai su [supabase.com](https://supabase.com) e registrati (anche con GitHub).
2. Crea un'organizzazione (tipo **Personal**, piano **Free**) e poi un nuovo progetto.
3. Scegli un nome, genera una password del database e **salvala in un password manager**.
4. Regione: la più vicina a te (es. *Europe*).
5. Aspetta 1-2 minuti che il progetto sia pronto.

### 3. Crea la tabella

Vai su **SQL Editor** > **New query**, incolla questo codice ed esegui con **Run**:

```sql
create table registro (
  id int8 generated by default as identity primary key,
  created_at timestamptz default now(),
  data jsonb
);

insert into registro (data)
values ('{"grades":[],"events":[],"subjects":[]}');

alter table registro enable row level security;

create policy "solo autenticati" on registro
  for all to authenticated using (true) with check (true);
```

Questo crea la tabella con una riga unica e **blocca l'accesso a chi non ha fatto il login**.

### 4. Crea il tuo utente e chiudi le registrazioni

1. Vai su **Authentication > Users > Add user > Create new user**.
2. Inserisci la tua email e una password, e **spunta "Auto Confirm User"**.
3. Vai su **Authentication > Sign In / Providers**, apri **Email** e **disattiva "Allow new users to sign up"**: così nessun altro può registrarsi sul tuo database.

### 5. Inserisci le tue chiavi

1. Su Supabase vai su **Project Settings > API Keys** e copia la **Publishable key** (inizia con `sb_publishable_`).
2. Vai su **Project Settings > General** e copia il **Project ID**: l'URL del progetto è `https://<PROJECT_ID>.supabase.co`.
3. Apri `js/config.js` e sostituisci i due valori:

```javascript
const SUPABASE_URL = 'https://IL-TUO-PROJECT-ID.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LA-TUA-CHIAVE';
```

> Usa **solo** la chiave *publishable*. Non inserire mai la chiave `sb_secret_...`: aggira la protezione del database e non deve stare nel codice.

Fai il commit e il push delle modifiche:

```bash
git add js/config.js
git commit -m "chore: configure own Supabase project"
git push
```

### 6. Pubblica su Vercel

1. Vai su [vercel.com](https://vercel.com) e accedi con GitHub.
2. **Add New > Project**, scegli il tuo repository.
3. Lascia le impostazioni di default (nessun build command) e clicca **Deploy**.
4. Dopo circa un minuto ottieni un indirizzo tipo `il-tuo-registro.vercel.app`.

### 7. Primo accesso

1. Apri l'indirizzo Vercel: compare la schermata di login.
2. Entra con l'email e la password create al passo 4.
3. Aggiungi un voto di prova, ricarica la pagina e controlla che resti salvato.

Per usarlo come un'app sul telefono, apri l'indirizzo dal browser e scegli **Aggiungi a schermata Home**.

### Verifica la sicurezza (consigliato)

Apri il sito in una **finestra privata**, premi **F12 > Console** e incolla:

```javascript
fetch(`${SUPABASE_URL}/rest/v1/registro?select=data`, {
  headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
}).then(r => r.json()).then(console.log)
```

Se il risultato è `[]`, senza login nessuno può leggere i tuoi dati. Se vedi dei dati, controlla di aver eseguito tutto l'SQL del passo 3.

### Problemi comuni

| Problema | Soluzione |
|---|---|
| "Email o password non corretti" | Controlla di aver creato l'utente con **Auto Confirm User** spuntato |
| Dopo il login l'app è vuota o dà errore | Controlla URL e chiave in `js/config.js` e che la riga `id=1` esista nella tabella |
| "Salvataggio non riuscito" | Verifica di aver eseguito l'SQL con la policy `solo autenticati` e di essere loggato |
| Sul sito vedi ancora i dati di un altro | Stai usando URL e chiave sbagliati: sostituiscili con i tuoi (passo 5) |

---

## Licenza

Distribuito con licenza MIT. Vedi il file [LICENSE](LICENSE).

---

Sviluppato da **Marco Campion**
