javascript:(async function(){
    // --- CONFIGURAZIONE SUPABASE ---
    const SUPABASE_URL = "https://adwdygozprljpwwysozf.supabase.co/rest/v1/registro?id=eq.1";
    const SUPABASE_KEY = "sb_publishable_1map06S6SkkwVclGBfQ1Vg_O5CEcjct";
  
    try {
      // 1. Scarica i dati attuali da Supabase
      const res = await fetch(SUPABASE_URL, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        }
      });
      const records = await res.json();
      if (!records || records.length === 0) throw new Error("Registro non trovato su Supabase");
      
      let currentData = records[0].data || { grades: [], events: [], subjects: [] };
      if (!currentData.grades) currentData.grades = [];
      if (!currentData.events) currentData.events = [];
      if (!currentData.subjects) currentData.subjects = [];
  
      // 2. Estrazione dati dal DOM di ClasseViva
      const righeVoti = document.querySelectorAll('tr.riga_voto, .grid_voti .voto_item, table tbody tr'); 
      let votiAggiunti = 0;
  
      righeVoti.forEach(riga => {
        const materiaEl = riga.querySelector('.materia, td:nth-child(1)');
        const votoEl = riga.querySelector('.voto, .voto_valore, td:nth-child(2)');
        const tipoEl = riga.querySelector('.tipo, td:nth-child(3)');
        const dataEl = riga.querySelector('.data, td:nth-child(4)');
  
        if (materiaEl && votoEl) {
          const nomeMateria = materiaEl.textContent.trim();
          const valoreVoto = parseFloat(votoEl.textContent.trim().replace(',', '.'));
          const tipoValutazione = tipoEl ? tipoEl.textContent.trim().toLowerCase() : 'scritto';
          const dataVoto = dataEl ? dataEl.textContent.trim() : new Date().toISOString().split('T')[0];
  
          if (!isNaN(valoreVoto)) {
            // Mappa il tipo di valutazione sulle categorie supportate dal progetto ('scritto', 'orale', 'pratico')
            let tipoNorm = 'scritto';
            if (tipoValutazione.includes('orale')) tipoNorm = 'orale';
            else if (tipoValutazione.includes('pratic')) tipoNorm = 'pratico';

            // Verifica se il voto esiste già per evitare duplicati
            const giaPresente = currentData.grades.some(v => v.subject === nomeMateria && v.value === valoreVoto && v.date === dataVoto);
  
            if (!giaPresente) {
              currentData.grades.push({
                id: 'g_' + Date.now().toString() + Math.random().toString(36).substr(2, 4),
                subject: nomeMateria,
                value: valoreVoto,
                type: tipoNorm,
                period: 'q1',
                date: dataVoto,
                note: 'Importato da ClasseViva'
              });
              votiAggiunti++;
            }
          }
        }
      });
  
      if (votiAggiunti === 0) {
        alert("Nessun nuovo voto trovato da importare.");
        return;
      }
  
      // 3. Salvataggio su Supabase
      const patchRes = await fetch(SUPABASE_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ data: currentData })
      });
  
      if (patchRes.ok) {
        alert(`✅ Sincronizzazione completata! Aggiunti ${votiAggiunti} nuovi voti su Supabase.`);
      } else {
        throw new Error("Errore durante il salvataggio su Supabase");
      }
  
    } catch (err) {
      alert("❌ Errore durante l'importazione: " + err.message);
      console.error(err);
    }
  })();