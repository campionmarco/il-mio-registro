// Autenticazione + persistenza dati su Supabase
const SESSION_KEY = 'registro-session';
let SESSION = null;
let DATA_LOADED = false;

function readSession() {
  try { SESSION = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { SESSION = null; }
}

function setSession(s) {
  SESSION = s;
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}

async function authRequest(grantType, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=${grantType}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error_description || json.msg || 'Accesso non riuscito');
  return {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_at: json.expires_at || Math.floor(Date.now() / 1000) + json.expires_in
  };
}

// Restituisce un token valido (lo rinnova se sta per scadere)
async function getToken() {
  if (!SESSION) return null;
  const now = Math.floor(Date.now() / 1000);
  if (SESSION.expires_at - now < 60) {
    try {
      setSession(await authRequest('refresh_token', { refresh_token: SESSION.refresh_token }));
    } catch (e) {
      setSession(null);
      return null;
    }
  }
  return SESSION.access_token;
}

async function authHeaders(extra = {}) {
  const token = await getToken();
  if (!token) throw new Error('NO_SESSION');
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, ...extra };
}

function showLogin() { document.getElementById('login-overlay').classList.add('active'); }
function hideLogin() { document.getElementById('login-overlay').classList.remove('active'); }

async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');
  err.style.display = 'none';
  try {
    setSession(await authRequest('password', { email, password }));
    document.getElementById('login-password').value = '';
    hideLogin();
    await loadData();
  } catch (e) {
    err.textContent = 'Email o password non corretti.';
    err.style.display = 'block';
  }
}

function logout() {
  setSession(null);
  DATA_LOADED = false;
  DATA = { grades: [], events: [], subjects: [] };
  showLogin();
}

async function initAuth() {
  readSession();
  if (await getToken()) {
    hideLogin();
    loadData();
  } else {
    showLogin();
  }
}

async function loadData() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/registro?id=eq.1&select=data`, {
      headers: await authHeaders()
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rows = await res.json();
    if (!rows.length) throw new Error('Riga id=1 non trovata');
    DATA = rows[0].data || {};
    DATA_LOADED = true;
  } catch (e) {
    console.error('load failed', e);
    if (e.message === 'NO_SESSION') showLogin();
    else alert('Impossibile caricare i dati. Riprova più tardi.');
  }
  if (!DATA.grades) DATA.grades = [];
  if (!DATA.events) DATA.events = [];
  if (!DATA.subjects) DATA.subjects = [];
  render();
}

async function saveData() {
  // Se i dati non sono stati caricati, salvare sovrascriverebbe il registro con dati vuoti
  if (!DATA_LOADED) {
    alert('Dati non caricati: salvataggio bloccato per non sovrascrivere il registro.');
    return;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/registro?id=eq.1`, {
      method: 'PATCH',
      headers: await authHeaders({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
      body: JSON.stringify({ data: DATA })
    });
    const rows = res.ok ? await res.json() : [];
    if (!rows.length) throw new Error('save rejected');
  } catch (e) {
    console.error('save failed', e);
    if (e.message === 'NO_SESSION') showLogin();
    else alert('Salvataggio non riuscito. Controlla la connessione e riprova.');
  }
}