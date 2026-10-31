// Configurazione globale e stato
let DATA = { grades: [], events: [], subjects: [], targets: {} };
let currentSubject = null;
let calDate = new Date();
let selectedDay = null;

const SUPABASE_URL = 'https://adwdygozprljpwwysozf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1ekQ_08TgiFF3GNssIn2xQ_srV9HoiS';

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

// Obiettivi di media per materia (DATA.targets = { MATERIA: voto })
const MIN_GRADE = 1;
const MAX_GRADE = 10;
const EPS = 1e-9;

function getTarget(subject) {
  const t = DATA.targets ? DATA.targets[subject] : undefined;
  return typeof t === 'number' ? t : null;
}

function setTarget(subject, value) {
  if (!DATA.targets) DATA.targets = {};
  if (value === null) delete DATA.targets[subject];
  else DATA.targets[subject] = value;
}

// Arrotonda per eccesso al quarto di voto più vicino (es. 7.1 -> 7.25)
function roundUpQuarter(x) {
  return Math.ceil(x * 4 - EPS) / 4;
}

// Per i prossimi 1, 2 e 3 voti (tutti uguali) calcola il voto necessario
// per avere una media >= target. Stati: any (basta qualsiasi voto),
// impossible (serve più di 10), ok (serve almeno "value").
function targetAdvice(grades, target) {
  const n = grades.length;
  const sum = grades.reduce((a, g) => a + g.value, 0);
  return [1, 2, 3].map((k) => {
    const raw = (target * (n + k) - sum) / k;
    if (raw <= MIN_GRADE + EPS) return { k, status: 'any' };
    if (raw > MAX_GRADE + EPS) return { k, status: 'impossible' };
    return { k, status: 'ok', value: Math.min(MAX_GRADE, roundUpQuarter(raw)) };
  });
}