// Script per importare il CSV dell'Agenda di ClasseViva nel formato DATA del registro
// Struttura CSV attesa: Type,Date common.start,Date common.end,common.allDay,Notes,Author,Class,Subject

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === ',' || char === ';') && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCSVData(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];
  
  // Salta l'intestazione
  const rows = lines.slice(1);
  const events = [];

  rows.forEach((rowStr, index) => {
    const cols = parseCSVLine(rowStr);
    if (cols.length >= 5) {
      const startDateStr = cols[1]; // es. "09/24/2026, 09:00 AM"
      const notes = cols[4];        // es. "Homework: page 104-105..."
      const author = cols[5] || ''; // es. "PIERLORENZI GIULIA"

      // Estrai la data in formato YYYY-MM-DD supportando sia IT che ISO
      let dateFormatted = new Date().toISOString().split('T')[0];
      
      const matchISO = startDateStr.match(/(\d{4})-(\d{2})-(\d{2})/); // Es. 2026-10-24
      const matchIT = startDateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/); // Es. 24/10/2026

      if (matchISO) {
        dateFormatted = `${matchISO[1]}-${matchISO[2]}-${matchISO[3]}`;
      } else if (matchIT) {
        // Formato IT: matchIT[1]=Giorno, matchIT[2]=Mese, matchIT[3]=Anno
        dateFormatted = `${matchIT[3]}-${matchIT[2]}-${matchIT[1]}`;
      }

      // Determina se è verifica o compito in base alle note
      const noteLower = notes.toLowerCase();
      const isVerifica = noteLower.includes('verifica') || 
                         noteLower.includes('test') || 
                         noteLower.includes('interrogazione') || 
                         noteLower.includes('prova') ||
                         noteLower.includes('compito in classe');
      
      const tipo = isVerifica ? 'verifica' : 'compito';

      events.push({
        id: 'ev_csv_' + Date.now() + '_' + index,
        titolo: notes,
        tipo: tipo, // 'verifica' (rosso) o 'compito' (verde)
        data: dateFormatted,
        note: `Docente: ${author}`
      });
    }
  });

  return events;
}