# Privacy Policy — Il Mio Registro

**Ultimo aggiornamento:** 11-10-2026

---

## 1. Titolare del trattamento

Questa è un'applicazione personale open source. Il titolare del trattamento dei dati sei **tu** (l'utente che usa l'app sul proprio dispositivo / account Supabase). Nessun terzo raccoglie, controlla o processa i tuoi dati per conto proprio.

---

## 2. Quali dati vengono raccolti

L'app memorizza **solo** i dati che inserisci volontariamente:

- **Voti**: materia, valore (1–10), tipo (Orale/Scritto/Pratico), periodo (1°/2°), data, note opzionali
- **Eventi/Agenda**: tipo (Compito/Verifica), materia, data, descrizione opzionale
- **Materie**: lista fissa dichiarata in "ui.js"

**Nessun dato personale identificativo** (nome, email, IP, posizione, contatti) viene richiesto o salvato dall'app.

---

## 3. Dove vengono salvati i dati

I dati vengono salvati **esclusivamente** sul tuo progetto **Supabase** (database PostgreSQL), tramite API REST HTTPS.

- L'app usa una **chiave anonima (publishable key)** con Row Level Security attivo
- I dati non transitano su server terzi diversi da Supabase
- Nessun backup automatico su cloud esterni (Google Drive, iCloud, ecc.)

---
## 4. Finalità del trattamento

I dati servono **solo** per:

- Calcolare e mostrarti medie, trend, statistiche
- Visualizzare l'agenda e i promemoria
- Simulare l'impatto di nuovi voti

**Non** vengono usati per: profilazione, pubblicità, analytics, training AI, vendita a terzi.

---

## 5. Base giuridica (GDPR Art. 6)

Trattamento basato sul **consenso** (art. 6.1.a): usi l'app volontariamente, inserisci i dati, confermi il salvataggio premendo "Salva" nei modali.

---

## 6. Conservazione

I dati restano sul tuo database Supabase **finché non li cancelli tu** (singolarmente o svuotando la tabella `registro`). Nessuna scadenza automatica.

---

## 7. I tuoi diritti (GDPR Artt. 15–22)

Puoi esercitare in autonomia:

- **Accesso**: apri l'app → vedi tutti i tuoi dati
- **Rettifica**: modifica/elimina singoli voti o eventi dall'interfaccia
- **Cancellazione (Diritto all'oblio)**: 
  - Da UI: elimina ogni voto/evento uno a uno
  - Da Supabase Dashboard: `TRUNCATE registro;` o `DELETE FROM registro WHERE id=eq.1;`
  - In locale: cancella `localStorage`/`sessionStorage` del browser
- **Portabilità**: funzione "Esporta JSON" (da implementare) o query Supabase → CSV/JSON
- **Opposizione / Limitazione**: smetti di usare l'app; i dati restano fermi sul tuo DB

---

## 8. Cookie e tracciamento

**Zero cookie.** L'app non usa:
- Cookie tecnici / di sessione
- Cookie analytics (Google Analytics, Matomo, ecc.)
- Pixel / fingerprinting
- localStorage per tracking (solo stato UI temporaneo: schermo attivo, mese calendario)

---

## 9. Servizi terzi

| Servizio | Ruolo | Dati ricevuti |
|----------|-------|---------------|
| **Supabase** | Database + Auth (opzionale) | Solo i JSON che invii via REST (voti, eventi) |
| **Chart.js (CDN)** | Libreria grafici | Nessuno (gira lato client, nessun beacon) |

Nessun altro servizio terzo è coinvolto.

---

## 10. Sicurezza

- Comunicazione solo **HTTPS** (TLS 1.2+)
- Chiave Supabase anonima con **RLS (Row Level Security)** — ogni utente vede solo il proprio record (`id=eq.1`)
- Nessun segreto lato client (nessuna service role key)

---

## 11. Minori

L'app è pensata per studenti. Se hai **meno di 16 anni** (soglia GDPR Italia), serve il **consenso di un genitore/tutore** prima di inserire dati. L'app non verifica l'età: responsabilità dell'utente/genitore.

---

## 12. Modifiche a questa policy

Se l'app evolve (es. aggiunta auth multi-utente, analytics, backup cloud), questa policy sarà aggiornata. Controlla la data in alto.

---

## 13. Contatto

Per domande su questa policy o sui tuoi dati: apri una **Issue su GitHub** del repository del progetto.

---

*Questa policy copre l'app "Il Mio Registro" come distribuita nel repository pubblico. Se fai un fork e la modifichi, adatta la policy di conseguenza.*