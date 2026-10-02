// Configurazione globale e stato
let DATA = { grades: [], events: [], subjects: [] };
let currentSubject = null;
let calDate = new Date();
let selectedDay = null;

const SUPABASE_URL = 'https://adwdygozprljpwwysozf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1map06S6SkkwVclGBfQ1Vg_O5CEcjct';

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