// Gestione chiamata REST verso Supabase
async function loadData() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/registro?id=eq.1&select=data`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const rows = await res.json();
      if (rows && rows[0] && rows[0].data) DATA = rows[0].data;
    } catch(e) {
      console.error('load failed', e);
      DATA = { grades: [], events: [], subjects: [] };
    }
    if (!DATA.grades) DATA.grades = [];
    if (!DATA.events) DATA.events = [];
    if (!DATA.subjects) DATA.subjects = [];
    render();
  }
  
  async function saveData() {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/registro?id=eq.1`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ data: DATA })
      });
    } catch(e) {
      console.error('save failed', e);
    }
  }