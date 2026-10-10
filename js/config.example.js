// Configurazione globale e stato — COPIA QUESTO FILE IN js/config.js E INSERISCI LE TUE CREDENZIALI SUPABASE
let DATA = { grades: [], events: [], subjects: [] };
let currentSubject = null;
let calDate = new Date();
let selectedDay = null;

// ⚠️ SOSTITUISCI CON LE TUE CREDENZIALI (trovi in Supabase → Settings → API)
const SUPABASE_URL = 'https://TUO-PROGETTO.supabase.co';
const SUPABASE_KEY = 'TUA_ANON_KEY_PUBLISHABLE';

// Funzioni helper di utilità
const GRADE_COLOR = v => v >= 6 ? '#3fbf60' : (v >= 5 ? '#e0a52c' : '#e6483a');
const fmt = v => (Math.round(v * 100) / 100).toString().replace('.', ',');

function avg(arr) {
  if (!arr || !arr.length) return null;
  return arr.reduce((a, b) => a + b.value, 0) / arr.length;
}

function gradesForPeriod(p) {
  if (p === 'all') return DATA.grades;
  return DATA.grades.filter(g => g.period === p);
}