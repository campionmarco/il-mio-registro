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

function parseCSVDate(str) {
  const iso = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const m = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;

  const a = parseInt(m[1], 10);
  const b = parseInt(m[2], 10);
  let day, month;
  if (a > 12) { day = a; month = b; }        // GG/MM/AAAA
  else if (b > 12) { month = a; day = b; }   // MM/GG/AAAA
  else { month = a; day = b; }               // ambiguo: assumo formato ClasseViva (MM/GG)

  return `${m[3]}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseCSVData(csvText) {
  const lines = csvText.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const events = [];
  lines.slice(1).forEach((line, index) => {
    const cols = parseCSVLine(line).map(c => c.trim());
    if (cols.length < 5) return;

    const date = parseCSVDate(cols[1]);
    if (!date) return;

    const notes = cols[4];
    const author = cols[5] || '';
    const subject = cols[7] || 'Altro';

    const n = notes.toLowerCase();
    const isVerifica = ['verifica', 'test', 'interrogazione', 'prova', 'compito in classe']
      .some(k => n.includes(k));

    events.push({
      id: Date.now() + index,
      type: isVerifica ? 'verifica' : 'compito',
      subject,
      date,
      desc: author ? `${notes} (${author})` : notes
    });
  });

  return events;
}