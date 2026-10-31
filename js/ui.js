// Navigazione e gestione interfacce/modali
function showScreen(name) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("screen-" + name).classList.add("active");
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.screen === name));
  document.getElementById("fab").style.display =
    name === "subject" ? "none" : "flex";
  render();
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

function openModalHTML(html) {
  document.getElementById("modal-content").innerHTML = html;
  document.getElementById("modal-overlay").classList.add("active");
}

function openFab() {
  const active = document.querySelector(".screen.active").id;
  if (active === "screen-agenda") openEventModal();
  else openGradeModal();
}

function subjectDatalist() {
  return DATA.subjects.map((s) => `<option value="${s}">`).join("");
}

function openGradeModal(prefillSubject) {
  const today = new Date().toISOString().slice(0, 10);
  const fixedSubjects = [
    "INGLESE",
    "ITALIANO",
    "MOTORIA",
    "MATEMATICA",
    "GPOI",
    "SISTEMI",
    "STORIA",
    "INFORMATICA",
    "RELIGIONE",
    "TPSIT",
    "ED. CIVICA",
  ];
  const options = fixedSubjects
    .map(
      (s) =>
        `<option value="${s}" ${s === prefillSubject ? "selected" : ""}>${s}</option>`,
    )
    .join("");
  openModalHTML(`
          <h2>Aggiungi voto</h2>
          <div class="field">
            <label>Materia</label>
            <select id="g-subject" required>
              <option value="" disabled ${prefillSubject ? "" : "selected"}>Seleziona una materia</option>
              ${options}
            </select>
          </div>
          <div class="field">
            <label>Voto</label>
            <input type="number" id="g-value" step="0.25" placeholder="Es. 7.5">
          </div>
          <div class="field">
            <label>Tipo</label>
            <div class="type-row">
              <div class="type-btn active" data-t="Orale">Orale</div>
              <div class="type-btn" data-t="Scritto">Scritto</div>
              <div class="type-btn" data-t="Pratico">Pratico</div>
            </div>
          </div>
          <div class="field">
            <label>Periodo</label>
            <div class="type-row">
              <div class="type-btn active" data-q="q1">1° periodo</div>
              <div class="type-btn" data-q="q2">2° periodo</div>
            </div>
          </div>
          <div class="field">
            <label>Data</label>
            <input type="date" id="g-date" value="${today}">
          </div>
          <div class="field">
            <label>Note (opzionale)</label>
            <input type="text" id="g-note" placeholder="Es. Verifica su Pitagora">
          </div>
          <div id="g-error" style="color:var(--red); font-size:13px; display:none; margin-bottom:8px;"></div>
          <div class="btn-row">
            <button class="btn btn-secondary" onclick="closeModal()">Annulla</button>
            <button class="btn btn-primary" onclick="saveGrade()">Salva</button>
          </div>
        `);
  document.querySelectorAll("[data-t]").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll("[data-t]")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      }),
  );
  document.querySelectorAll("[data-q]").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll("[data-q]")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      }),
  );
}

function saveGrade() {
  const subject = document.getElementById("g-subject").value.trim();
  const value = parseFloat(document.getElementById("g-value").value);
  const type = document.querySelector("[data-t].active").dataset.t;
  const period = document.querySelector("[data-q].active").dataset.q;
  const date = document.getElementById("g-date").value;
  const note = document.getElementById("g-note").value.trim();
  const err = document.getElementById("g-error");

  if (!subject || isNaN(value) || value < 1 || value > 10 || !date) {
    err.textContent = "Compila materia, voto (1-10) e data.";
    err.style.display = "block";
    return;
  }
  DATA.grades.push({
    id: Date.now(),
    subject,
    value,
    type,
    period,
    date,
    note,
  });
  if (!DATA.subjects.includes(subject)) DATA.subjects.push(subject);
  saveData();
  closeModal();
  render();
}

function openEventModal() {
  const dateVal = selectedDay
    ? selectedDay
    : new Date().toISOString().slice(0, 10);
  openModalHTML(`
      <h2>Aggiungi evento</h2>
      <div class="field">
        <label>Tipo</label>
        <div class="type-row">
          <div class="type-btn active" data-et="compito">Compito</div>
          <div class="type-btn" data-et="verifica">Verifica</div>
        </div>
      </div>
      <div class="field"><label>Materia</label><input list="subj-options2" id="e-subject" placeholder="Es. Storia"><datalist id="subj-options2">${subjectDatalist()}</datalist></div>
      <div class="field"><label>Data</label><input type="date" id="e-date" value="${dateVal}"></div>
      <div class="field"><label>Descrizione</label><textarea id="e-desc" placeholder="Es. Studiare cap. 5"></textarea></div>
      <div id="e-error" style="color:var(--red); font-size:13px; display:none; margin-bottom:8px;"></div>
      <div class="btn-row">
        <button class="btn btn-secondary" onclick="closeModal()">Annulla</button>
        <button class="btn btn-primary" onclick="saveEvent()">Salva</button>
      </div>
    `);
  document.querySelectorAll("[data-et]").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll("[data-et]")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      }),
  );
}

function saveEvent() {
  const type = document.querySelector("[data-et].active").dataset.et;
  const subject = document.getElementById("e-subject").value.trim();
  const date = document.getElementById("e-date").value;
  const desc = document.getElementById("e-desc").value.trim();
  const err = document.getElementById("e-error");

  if (!subject || !date) {
    err.textContent = "Compila materia e data.";
    err.style.display = "block";
    return;
  }
  DATA.events.push({ id: Date.now(), type, subject, date, desc });
  if (!DATA.subjects.includes(subject)) DATA.subjects.push(subject);
  saveData();
  closeModal();
  render();
}

function deleteEvent(id) {
  DATA.events = DATA.events.filter((e) => e.id !== id);
  saveData();
  render();
}

function deleteGrade(id) {
  DATA.grades = DATA.grades.filter((g) => g.id !== id);
  saveData();
  render();
}

function openSubject(name) {
  currentSubject = name;
  showScreen("subject");
}

// ===== Simulatore: fino a 5 voti =====
const MAX_SIM_GRADES = 5;

function simRowHTML() {
  return `
    <div class="sim-row">
      <div class="field">
        <input type="number" class="sim-input" step="0.25" min="1" max="10" placeholder="Es. 7.5" oninput="simulate()">
      </div>
      <button class="del" onclick="removeSimInput(this)" aria-label="Rimuovi voto">&#10005;</button>
    </div>`;
}

function updateSimAdd() {
  const n = document.querySelectorAll("#sim-inputs .sim-row").length;
  document.getElementById("sim-add").hidden = n >= MAX_SIM_GRADES;
}

// Riporta il simulatore a un solo campo vuoto
function resetSim() {
  document.getElementById("sim-inputs").innerHTML = simRowHTML();
  document.getElementById("sim-result").style.display = "none";
  updateSimAdd();
}

function addSimInput() {
  const box = document.getElementById("sim-inputs");
  if (box.querySelectorAll(".sim-row").length >= MAX_SIM_GRADES) return;
  box.insertAdjacentHTML("beforeend", simRowHTML());
  updateSimAdd();
  box.lastElementChild.querySelector("input").focus();
}

function removeSimInput(btn) {
  const box = document.getElementById("sim-inputs");
  const row = btn.closest(".sim-row");
  if (box.querySelectorAll(".sim-row").length > 1) row.remove();
  else row.querySelector("input").value = "";
  updateSimAdd();
  simulate();
}

function simulate() {
  const vals = [...document.querySelectorAll("#sim-inputs .sim-input")]
    .map((i) => parseFloat(i.value))
    .filter((v) => !isNaN(v) && v >= 1 && v <= 10);
  const box = document.getElementById("sim-result");
  if (!vals.length) {
    box.style.display = "none";
    return;
  }
  const all = DATA.grades.filter((g) => g.subject === currentSubject);
  const curAvg = avg(all);
  const total =
    all.reduce((a, b) => a + b.value, 0) + vals.reduce((a, b) => a + b, 0);
  const newAvg = total / (all.length + vals.length);
  box.style.display = "block";
  document.getElementById("sim-label").textContent =
    vals.length > 1
      ? `Nuova media materia con ${vals.length} voti`
      : "Nuova media materia";
  document.getElementById("sim-avg").textContent = fmt(newAvg);
  document.getElementById("sim-avg").style.color = GRADE_COLOR(newAvg);
  const diff = curAvg === null ? newAvg : newAvg - curAvg;
  const el = document.getElementById("sim-diff");
  if (curAvg === null) {
    el.innerHTML = `Prima media della materia`;
    el.className = "";
  } else {
    el.innerHTML =
      (diff >= 0 ? "&#8593; +" : "&#8595; ") +
      fmt(Math.abs(diff)) +
      " rispetto alla media attuale";
    el.className = diff >= 0 ? "diff-up" : "diff-down";
  }
}

// ===== Obiettivo di media per materia =====
function saveTarget() {
  const value = parseFloat(document.getElementById("target-input").value);
  const err = document.getElementById("target-error");
  if (isNaN(value) || value < 1 || value > 10) {
    err.textContent = "Inserisci un obiettivo tra 1 e 10.";
    err.hidden = false;
    return;
  }
  err.hidden = true;
  setTarget(currentSubject, value);
  saveData();
  renderTarget();
}

function clearTarget() {
  setTarget(currentSubject, null);
  saveData();
  renderTarget();
}

function changeMonth(delta) {
  calDate.setMonth(calDate.getMonth() + delta);
  renderAgenda();
}

function selectDay(d) {
  selectedDay = d;
  renderAgenda();
}

function importAgendaCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const parsed = parseCSVData(e.target.result);

    const exists = (ev) =>
      DATA.events.some(
        (x) =>
          x.date === ev.date && x.subject === ev.subject && x.desc === ev.desc,
      );
    const newEvents = parsed.filter((ev) => !exists(ev));

    if (newEvents.length > 0) {
      DATA.events = DATA.events.concat(newEvents);
      newEvents.forEach((ev) => {
        if (!DATA.subjects.includes(ev.subject)) DATA.subjects.push(ev.subject);
      });
      saveData();
      render();
      alert(
        `Importati ${newEvents.length} eventi (${parsed.length - newEvents.length} già presenti).`,
      );
    } else {
      alert("Nessun evento nuovo trovato nel file CSV.");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}