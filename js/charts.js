// Gestione istanze Chart.js
let charts = {};

function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

function lineChart(id, labels, data) {
  destroyChart(id);
  const ctx = document.getElementById(id);
  if (!ctx) return;
  charts[id] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#e6483a',
        backgroundColor: 'rgba(230,72,58,0.15)',
        fill: true,
        tension: .3,
        pointRadius: 3,
        pointBackgroundColor: '#e6483a'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 10, ticks: { color: '#9a9a9a', font: { size: 10 } }, grid: { color: '#2c2c2c' } },
        x: { ticks: { color: '#9a9a9a', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}