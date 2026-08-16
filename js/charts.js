/* SalesControl live charts. */
(function () {
  'use strict';
  const charts = window.dashboardCharts = {};
  const COLORS = { purple: '#8b5cff', blue: '#3d7dff', green: '#26d07c', yellow: '#ffb020', red: '#ff5a6e', grid: 'rgba(28,36,51,.65)', text: '#94a2bb' };

  if (window.Chart) {
    Chart.defaults.color = COLORS.text;
    Chart.defaults.borderColor = '#1c2433';
    Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
  }

  function destroy(name) { if (charts[name]) { charts[name].destroy(); delete charts[name]; } }
  function compact(value) { const n = Number(value) || 0; if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1).replace('.', ',')}M`; if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}K`; return String(Math.round(n)); }
  function noChart(canvasId, message) { const canvas = document.getElementById(canvasId); if (!canvas) return; const parent = canvas.parentElement; canvas.style.display = 'none'; parent.classList.add('chart-empty'); let empty = parent.querySelector('.chart-empty-message'); if (!empty) { empty = document.createElement('div'); empty.className = 'chart-empty-message'; parent.appendChild(empty); } empty.innerHTML = `<div class="empty-state">${message}</div>`; }
  function showChart(canvasId) { const canvas = document.getElementById(canvasId); if (!canvas) return; canvas.style.display = 'block'; const parent = canvas.parentElement; parent.classList.remove('chart-empty'); const empty = parent.querySelector('.chart-empty-message'); if (empty) empty.remove(); }

  const centerTextPlugin = {
    id: 'dashboardCenterText',
    afterDraw(chart) {
      const options = chart.options.plugins && chart.options.plugins.dashboardCenterText;
      if (!options || !chart.chartArea) return;
      const { ctx, chartArea } = chart;
      ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#eaf0fa'; ctx.font = "700 14px 'Inter', sans-serif";
      ctx.fillText(options.value, (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2 - 8);
      ctx.fillStyle = COLORS.text; ctx.font = "11px 'Inter', sans-serif";
      ctx.fillText(options.label || 'Всего', (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2 + 10);
      ctx.restore();
    },
  };
  if (window.Chart) Chart.register(centerTextPlugin);

  function renderKpiSparkline(canvasId, values, color) {
    destroy(canvasId);
    if (!window.Chart) return;
    const canvas = document.getElementById(canvasId);
    if (!canvas || !values.length) return;
    charts[canvasId] = new Chart(canvas, { type: 'line', data: { labels: values.map((_, i) => i), datasets: [{ data: values, borderColor: color, backgroundColor: `${color}22`, fill: true, tension: .4, pointRadius: 0, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: { duration: 500 } } });
  }

  function renderManagerProgress(value) {
    destroy('manager-progress');
    if (!window.Chart) return;
    const canvas = document.getElementById('manager-progress');
    if (!canvas) return;
    charts['manager-progress'] = new Chart(canvas, { type: 'doughnut', data: { datasets: [{ data: [value, Math.max(0, 100 - value)], backgroundColor: [COLORS.purple, '#1c2433'], borderWidth: 0 }] }, options: { responsive: false, cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { duration: 500 } } });
  }

  function renderRevenue(snapshot) {
    destroy('revenue');
    const canvas = document.getElementById('revenue-chart');
    if (!canvas || !window.Chart) return;
    showChart('revenue-chart');
    if (!snapshot.byDate.length) { noChart('revenue-chart', 'Нет продаж за выбранный период'); return; }
    charts.revenue = new Chart(canvas, { data: { labels: snapshot.byDate.map(item => item.date.slice(8, 10) + '.' + item.date.slice(5, 7)), datasets: [{ type: 'bar', label: 'Выручка за день', data: snapshot.byDate.map(item => item.revenue), backgroundColor: 'rgba(139,92,255,.55)', borderColor: COLORS.purple, borderWidth: 1, borderRadius: 4, maxBarThickness: 26 }, { type: 'line', label: 'Накопительно', data: snapshot.byDate.map((_, index, values) => values.slice(0, index + 1).reduce((sum, item) => sum + item.revenue, 0)), borderColor: COLORS.green, backgroundColor: 'rgba(38,208,124,.12)', fill: true, tension: .35, pointRadius: 0, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: true, position: 'top', align: 'start', labels: { color: COLORS.text, font: { size: 11 }, usePointStyle: true, pointStyleWidth: 14, boxHeight: 4 } }, tooltip: { backgroundColor: '#0f131d', borderColor: '#1c2433', borderWidth: 1, callbacks: { label: context => ` ${context.dataset.label}: ${Math.round(context.parsed.y).toLocaleString('ru-RU')} ₽` } } }, scales: { x: { grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10, family: "'JetBrains Mono', monospace" } } }, y: { beginAtZero: true, grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10 }, callback: value => compact(value) + ' ₽' } } } } });
  }

  function renderPayment(snapshot) {
    destroy('payment');
    const canvas = document.getElementById('payment-chart');
    if (!canvas || !window.Chart) return;
    showChart('payment-chart');
    const labels = ['Наличные', 'Безналичные', 'Кредит/Рассрочка', 'Инкассация'];
    const values = [snapshot.payments.cash, snapshot.payments.cashless, snapshot.payments.credit, snapshot.payments.encashment];
    if (!values.some(Boolean)) { noChart('payment-chart', 'Нет данных'); return; }
    charts.payment = new Chart(canvas, { type: 'doughnut', data: { labels, datasets: [{ data: values, backgroundColor: [COLORS.green, COLORS.blue, COLORS.purple, COLORS.yellow], borderWidth: 0, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f131d', borderColor: '#1c2433', borderWidth: 1, callbacks: { label: context => ` ${context.label}: ${Math.round(context.parsed).toLocaleString('ru-RU')} ₽` } }, dashboardCenterText: { value: window.dashboardData.formatCurrency(snapshot.paymentTotal, true), label: 'Оплаты' } } } });
    const legend = document.getElementById('payment-legend');
    if (legend) legend.innerHTML = labels.map((label, index) => `<div class="payment-legend-item"><div class="payment-legend-dot" style="background:${[COLORS.green, COLORS.blue, COLORS.purple, COLORS.yellow][index]}"></div><div class="payment-legend-info"><div class="payment-legend-label">${label}</div><div class="payment-legend-value">${snapshot.paymentTotal ? Math.round(values[index] / snapshot.paymentTotal * 100) : 0}%</div><div class="payment-legend-amount">${window.dashboardData.formatCurrency(values[index])}</div></div></div>`).join('');
  }

  function renderAverage(snapshot) {
    destroy('average');
    const canvas = document.getElementById('avg-check-chart');
    if (!canvas || !window.Chart) return;
    showChart('avg-check-chart');
    if (!snapshot.byDate.length) { noChart('avg-check-chart', 'Нет данных'); return; }
    charts.average = new Chart(canvas, { type: 'line', data: { labels: snapshot.byDate.map(item => item.date.slice(8, 10) + '.' + item.date.slice(5, 7)), datasets: [{ label: 'Средний чек', data: snapshot.byDate.map(item => item.average), borderColor: COLORS.green, backgroundColor: 'rgba(38,208,124,.1)', fill: true, tension: .4, pointRadius: 0, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f131d', borderColor: '#1c2433', borderWidth: 1, callbacks: { label: context => ` ${Math.round(context.parsed.y).toLocaleString('ru-RU')} ₽` } } }, scales: { x: { grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10, family: "'JetBrains Mono', monospace" } } }, y: { beginAtZero: true, grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10 }, callback: value => compact(value) } } } } });
  }

  window.renderCharts = function (snapshot) {
    renderRevenue(snapshot); renderPayment(snapshot); renderAverage(snapshot);
    renderKpiSparkline('kpi-revenue-chart', snapshot.byDate.map(item => item.revenue), COLORS.purple);
    renderKpiSparkline('kpi-average-chart', snapshot.byDate.map(item => item.average), COLORS.green);
    renderManagerProgress(snapshot.managers.length ? Math.min(100, Math.round(snapshot.managers[0].revenue / Math.max(snapshot.revenue, 1) * 100)) : 0);
  };
}());
