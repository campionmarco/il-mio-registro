// Render generali e avvio applicazione
function render() {
  // Ottiene lo schermo attivo selezionando l'elemento con la classe 'screen.active' e prendendo l'id di questo elemento.
  const active = document.querySelector(".screen.active").id;

  // Chiamate a funzioni di rendering basate sullo schermo attivo.
  if (active === "screen-home") renderHome();
  if (active === "screen-voti") renderVoti();
  if (active === "screen-subject") renderSubject();
  if (active === "screen-agenda") renderAgenda();
  if (active === "screen-stats") renderStats();
}

// Funzione per il rendering dello schermo home
function renderHome() {
  // Ottiene l'ora corrente e imposta il saluto e la data corrente nel DOM.
  const h = new Date().getHours();
  document.getElementById("greeting").textContent =
    h < 12 ? "Buongiorno" : h < 18 ? "Buon pomeriggio" : "Buonasera";
  document.getElementById("today-date").textContent =
    new Date().toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  // Ordina gli ultimi 10 voti e li utilizza per creare un grafico a linea.
  const sorted = [...DATA.grades].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  const last10 = sorted.slice(-10);
  lineChart(
    "trendChart",
    last10.map((g) =>
      new Date(g.date).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
      }),
    ),
    last10.map((g) => g.value),
  );

  // Calcola e visualizza la media globale e il conteggio dei voti.
  const overall = avg(DATA.grades);
  document.getElementById("home-avg").textContent =
    overall !== null ? fmt(overall) : "-";
  document.getElementById("home-count").textContent = DATA.grades.length;

  // Visualizza i 5 ultimi voti.
  const recent = [...DATA.grades]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  document.getElementById("home-grades").innerHTML = recent.length
    ? recent
        .map(
          (g) => `

      <div class="grade-row">
        <div class="grade-left">
          <div class="dot ${g.value >= 6 ? "green" : g.value >= 5 ? "amber" : "red"}"></div>
          <div class="grade-info"><b>${g.subject}</b><span>${new Date(g.date).toLocaleDateString("it-IT")} · ${g.type}</span></div>
        </div>
        <div class="grade-val" style="color:${GRADE_COLOR(g.value)}">${fmt(g.value)}</div>
      </div>`,
        )
        .join("")
    : '<div class="empty">Nessun voto inserito</div>';

  // Visualizza gli eventi futuri.
  const upcoming = [...DATA.events]
    .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);
  document.getElementById("home-events").innerHTML = upcoming.length
    ? upcoming
        .map(
          (e) => `

      <div class="event-item ${e.type}">
        <div><b style="font-size:13px;">${e.subject}</b><div style="font-size:12px; color:var(--text-dim); margin-top:2px;">${new Date(e.date).toLocaleDateString("it-IT")} · ${e.desc || (e.type === "compito" ? "Compito" : "Verifica")}</div></div>
      </div>`,
        )
        .join("")
    : '<div class="empty">Nessun evento in programma</div>';
}

// Funzione per il rendering dello schermo voti
function renderVoti() {
  // Ottiene il periodo attivo e filtra i voti di quel periodo.
  const period = document.querySelector("#period-chips .chip.active").dataset.p;
  const grades = gradesForPeriod(period);

  // Mostra/nasconde i grafici in base al periodo selezionato
  document.getElementById("voti-chart-all").style.display =
    period === "all" ? "block" : "none";
  document.getElementById("voti-chart-q1").style.display =
    period === "q1" ? "block" : "none";
  document.getElementById("voti-chart-q2").style.display =
    period === "q2" ? "block" : "none";

  // Renderizza i 3 grafici (uno per periodo)
  renderVotiCharts();

  // Raggruppa i voti per materia.
  const bySubject = {};
  grades.forEach((g) => {
    (bySubject[g.subject] = bySubject[g.subject] || []).push(g);
  });

  // Ordina le materie alfabeticamente e le visualizza.
  const subjects = Object.keys(bySubject).sort();
  document.getElementById("subj-list").innerHTML = subjects.length
    ? subjects
        .map((s) => {
          const a = avg(bySubject[s]);
          const col = GRADE_COLOR(a);
          return `<div class="subj-item" onclick="openSubject('${s.replace(/'/g, "\\'")}')">
        <div class="circle" style="border-color:${col}; color:${col};">${fmt(a)}</div>
        <div><div class="subj-name">${s}</div><div class="subj-sub">${bySubject[s].length} voti</div></div>
        <div class="chevron">&#8250;</div>
      </div>`;
        })
        .join("")
    : '<div class="empty">Nessun voto in questo periodo.<br>Tocca + per aggiungerne uno.</div>';
}

// Renderizza i 3 grafici per la sezione Voti (uno per ogni periodo)
function renderVotiCharts() {
  const periods = ["all", "q1", "q2"];
  periods.forEach((p) => {
    const grades = gradesForPeriod(p);
    const sorted = [...grades].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    const labels = sorted.map((g) =>
      new Date(g.date).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
      }),
    );
    const data = sorted.map((g) => g.value);
    const canvasId =
      p === "all" ? "votiChartAll" : p === "q1" ? "votiChartQ1" : "votiChartQ2";
    lineChart(canvasId, labels, data);
  });
}

// Funzione per il rendering dello schermo materia
function renderSubject() {
  // Se non è impostata la materia attiva, esce dalla funzione.
  if (!currentSubject) return;

  // Filtra i voti per la materia corrente
  const all = DATA.grades.filter((g) => g.subject === currentSubject);

  // Imposta il titolo della materia e calcola la media per tipo di voto.
  document.getElementById("subj-title").textContent = currentSubject;
  const sorted = [...all].sort((a, b) => new Date(a.date) - new Date(b.date));
  const byType = (t) => all.filter((g) => g.type === t);
  const scritto = avg(byType("Scritto")),
    orale = avg(byType("Orale")),
    pratico = avg(byType("Pratico"));
  document.getElementById("s-scritto").textContent =
    scritto !== null ? fmt(scritto) : "-";
  document.getElementById("s-orale").textContent =
    orale !== null ? fmt(orale) : "-";
  document.getElementById("s-pratico").textContent =
    pratico !== null ? fmt(pratico) : "-";
  const tot = avg(all);
  document.getElementById("s-tot").textContent = tot !== null ? fmt(tot) : "-";

  // Crea un grafico a linea per la storia dei voti.
  lineChart(
    "subjChart",
    sorted.map((g) =>
      new Date(g.date).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
      }),
    ),
    sorted.map((g) => g.value),
  );

  // Nasconde il risultato della simulazione.
  document.getElementById("sim-input").value = "";
  document.getElementById("sim-result").style.display = "none";

  // Visualizza i voti per la materia attiva.
  document.getElementById("subj-grades").innerHTML = sorted.length
    ? [...sorted]
        .reverse()
        .map(
          (g) => `

      <div class="grade-row">
        <div class="grade-left">
          <div class="dot ${g.value >= 6 ? "green" : g.value >= 5 ? "amber" : "red"}"></div>
          <div class="grade-info"><b>${g.type}${g.note ? " · " + g.note : ""}</b><span>${new Date(g.date).toLocaleDateString("it-IT")} · ${g.period === "q1" ? "1° periodo" : "2° periodo"}</span></div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="grade-val" style="color:${GRADE_COLOR(g.value)}">${fmt(g.value)}</div>
          <button class="del" onclick="deleteGrade(${g.id})">&#10005;</button>
        </div>
      </div>`,
        )
        .join("")
    : '<div class="empty">Nessun voto per questa materia</div>';
}

// Funzione per il rendering dello schermo agenda
function renderAgenda() {
  // Imposta il mese e l'anno attuali nel calendario.
  const label = calDate.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });
  document.getElementById("cal-month-label").textContent = label;
  const year = calDate.getFullYear(),
    month = calDate.getMonth();
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);

  // Raggruppa gli eventi per data.
  const eventsByDate = {};
  DATA.events.forEach((e) => {
    (eventsByDate[e.date] = eventsByDate[e.date] || []).push(e);
  });

  // Crea il calendario.
  let html = ["L", "M", "M", "G", "V", "S", "D"]
    .map((d) => `<div class="cal-head">${d}</div>`)
    .join("");
  for (let i = 0; i < startOffset; i++)
    html += `<div class="cal-day other"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const evs = eventsByDate[dateStr] || [];
    const hasCompito = evs.some((e) => e.type === "compito");
    const hasVerifica = evs.some((e) => e.type === "verifica");
    let dots = "";
    if (hasCompito) dots += `<span style="background:#3fbf60"></span>`;
    if (hasVerifica) dots += `<span style="background:#e6483a"></span>`;
    const cls = ["cal-day"];
    if (dateStr === todayStr) cls.push("today");
    if (dateStr === selectedDay) cls.push("selected");
    html += `<div class="${cls.join(" ")}" onclick="selectDay('${dateStr}')">${d}<div class="cal-dots">${dots}</div></div>`;
  }
  document.getElementById("cal-grid").innerHTML = html;

  // Visualizza gli eventi del giorno selezionato o oggi.
  const dayToShow = selectedDay || todayStr;
  const dayEvents = (eventsByDate[dayToShow] || []).sort((a, b) =>
    a.type.localeCompare(b.type),
  );
  document.getElementById("agenda-day-label").textContent = selectedDay
    ? new Date(selectedDay + "T00:00").toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "Eventi di oggi";
  document.getElementById("agenda-events").innerHTML = dayEvents.length
    ? dayEvents
        .map(
          (e) => `

      <div class="event-item ${e.type}">
        <div><b style="font-size:13px;">${e.subject}</b><div style="font-size:12px; color:var(--text-dim); margin-top:2px;">${e.type === "compito" ? "Compito" : "Verifica"}${e.desc ? " · " + e.desc : ""}</div></div>
        <button class="del" onclick="deleteEvent(${e.id})">&#10005;</button>
      </div>`,
        )
        .join("")
    : '<div class="empty">Nessun evento</div>';
}

// Funzione per il rendering dello schermo statistica
function renderStats() {
  // Calcola e visualizza la media globale.
  const overall = avg(DATA.grades);
  document.getElementById("st-avg").textContent =
    overall !== null ? fmt(overall) : "-";

  // Raggruppa i voti per materia e calcola la media per ogni materia.
  const bySubject = {};
  DATA.grades.forEach((g) => {
    (bySubject[g.subject] = bySubject[g.subject] || []).push(g);
  });
  const subjAvgs = Object.entries(bySubject).map(([s, arr]) => ({
    s,
    a: avg(arr),
  }));
  if (subjAvgs.length) {
    subjAvgs.sort((a, b) => b.a - a.a);
    document.getElementById("st-best").textContent =
      subjAvgs[0].s + " (" + fmt(subjAvgs[0].a) + ")";
    document.getElementById("st-worst").textContent =
      subjAvgs[subjAvgs.length - 1].s +
      " (" +
      fmt(subjAvgs[subjAvgs.length - 1].a) +
      ")";
    document.getElementById("st-insuff").textContent = subjAvgs.filter(
      (x) => x.a < 6,
    ).length;
  } else {
    document.getElementById("st-best").textContent = "-";
    document.getElementById("st-worst").textContent = "-";
    document.getElementById("st-insuff").textContent = "0";
  }

  // Crea un grafico a torta per la distribuzione dei voti.
  const buckets = { insuff: 0, suff: 0, buono: 0 };
  DATA.grades.forEach((g) => {
    if (g.value < 6) buckets.insuff++;
    else if (g.value < 7.5) buckets.suff++;
    else buckets.buono++;
  });
  destroyChart("distChart");
  const ctx = document.getElementById("distChart");
  if (ctx) {
    charts["distChart"] = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Insufficienti", "Sufficienti", "Buoni/Ottimi"],
        datasets: [
          {
            data: [buckets.insuff, buckets.suff, buckets.buono],
            backgroundColor: ["#e6483a", "#e0a52c", "#3fbf60"],
            borderColor: "#1e1e1e",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#9a9a9a", font: { size: 11 }, padding: 12 },
          },
        },
      },
    });
  }

  // Calcola e visualizza la media per il primo e il secondo semestre.
  const q1 = avg(DATA.grades.filter((g) => g.period === "q1"));
  const q2 = avg(DATA.grades.filter((g) => g.period === "q2"));
  document.getElementById("st-q1").textContent = q1 !== null ? fmt(q1) : "-";
  document.getElementById("st-q2").textContent = q2 !== null ? fmt(q2) : "-";
}

// Event Listeners
document.getElementById("period-chips").addEventListener("click", (e) => {
  // Aggiorna il periodo attivo e ricalcola i voti.
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document
    .querySelectorAll("#period-chips .chip")
    .forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  renderVoti();
});

// Avvio
loadData();
