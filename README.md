# Informativa sulla privacy — Il Mio Registro

**Ultimo aggiornamento:** 31-10-2026

---

## 1. Natura dell'applicazione

Il Mio Registro è un'applicazione **personale**: la usa una sola persona, che è anche la titolare dei dati. Non è distribuita ad altri utenti e non raccoglie dati di terzi per conto proprio. Il codice è pubblico a scopo di documentazione.

---

## 2. Dati trattati

- **Voti**: materia, valore (1–10), tipo (Orale/Scritto/Pratico), periodo (1°/2°), data, note opzionali.
- **Eventi e agenda**: tipo (Compito/Verifica), materia, data, descrizione. Se gli eventi vengono importati da un file CSV di ClasseViva, la descrizione può contenere anche il nome del docente.
- **Materie**: create automaticamente a partire dai voti e dagli eventi inseriti.
- **Credenziali di accesso**: email e password, gestite da Supabase Auth. La password è conservata solo come hash.

L'app non richiede altri dati identificativi (nome, posizione, contatti).

---

## 3. Dove sono salvati i dati

I dati sono salvati sul progetto **Supabase** del titolare (database PostgreSQL), tramite API REST su HTTPS. L'accesso richiede il login e la tabella è protetta da Row Level Security. L'app non effettua copie dei dati su altri servizi.

---

## 4. Finalità

I dati servono solo per calcolare e mostrare medie, andamenti e statistiche, per visualizzare l'agenda e per simulare l'effetto di nuovi voti.

Non sono usati per profilazione, pubblicità, analytics, addestramento di sistemi AI o vendita a terzi.

---

## 5. Servizi terzi

| Servizio | Ruolo | Dati che riceve |
|---|---|---|
| **Supabase** | Database e autenticazione | Email e password di accesso, voti ed eventi |
| **Vercel** | Hosting del sito | Dati tecnici di connessione nei log (es. indirizzo IP) |
| **cdnjs (Cloudflare)** | Distribuzione della libreria Chart.js | Dati tecnici di connessione (es. indirizzo IP) al caricamento della pagina |

Nessun altro servizio terzo è coinvolto.

---

## 6. Cookie e archiviazione locale

L'app non imposta cookie e non usa strumenti di tracciamento (analytics, pixel, fingerprinting).

Nel `localStorage` del browser viene salvato solo il **token di sessione** del login. Viene rimosso premendo **Esci**.

---

## 7. Sicurezza

- Comunicazione solo su HTTPS.
- Login obbligatorio e Row Level Security attivo: senza autenticazione la tabella risulta vuota e le scritture vengono rifiutate.
- Registrazioni pubbliche disattivate: accede solo l'utente creato dal titolare.
- Nel codice è presente solo la chiave *publishable* di Supabase, pensata per il frontend. Nessuna chiave *secret* o *service role* è usata dall'app.

---

## 8. Conservazione e cancellazione

I dati restano sul database finché il titolare non li cancella. Non c'è alcuna scadenza automatica.

- **Dall'app**: si eliminano voti ed eventi uno alla volta.
- **Per svuotare il registro** da Supabase (SQL Editor), senza eliminare la riga di cui l'app ha bisogno:

```sql
update registro
set data = '{"grades":[],"events":[],"subjects":[]}'
where id = 1;
```

- **Account**: si elimina da Supabase, in Authentication > Users.
- **Sul dispositivo**: il token di sessione si cancella con **Esci** o svuotando i dati del sito dal browser.

---

## 9. Modifiche a questa informativa

Se l'app venisse distribuita ad altri utenti (registrazione, più account, analytics, backup su altri servizi), questa informativa sarà riscritta di conseguenza. La data in alto indica l'ultima revisione.

---

## 10. Contatto

Per domande su questa informativa apri una **Issue** nel repository GitHub del progetto.