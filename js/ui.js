/* SalesControl live UI layer. */
(function () {
  'use strict';
  const data = window.dashboardData;
  const state = data.state;

  function qs(selector) { return document.querySelector(selector); }
  function setHtml(id, html) { const element = document.getElementById(id); if (element) element.innerHTML = html; }
  function setText(id, text) { const element = document.getElementById(id); if (element) element.textContent = text; }
  function periodLabel(period) { return data.getPeriodLabel(period); }
  function empty(message) { return `<div class="empty-state">${data.escapeHtml(message)}</div>`; }

  function formatDelta(snapshot) {
    if (!snapshot.rows.length) return '';
    return `<span class="kpi-card__change change--up">${snapshot.reports} записей</span>`;
  }

  function renderKpis(snapshot) {
    const revenueCard = document.getElementById('kpiRevenue');
    const averageCard = document.getElementById('kpiAverage');
    if (revenueCard) revenueCard.innerHTML = `<div class="kpi-card__header"><div class="kpi-card__icon" style="background:rgba(139,92,255,.15);color:var(--accent-purple)">💳</div>${formatDelta(snapshot)}</div><div class="kpi-card__value">${data.formatCurrency(snapshot.revenue)}</div><div class="kpi-card__title">Выручка за ${data.escapeHtml(periodLabel(state.filters.period).toLowerCase())}</div><div class="kpi-card__chart-wrap"><canvas id="kpi-revenue-chart"></canvas></div>`;
    if (averageCard) averageCard.innerHTML = `<div class="kpi-card__header"><div class="kpi-card__icon" style="background:rgba(38,208,124,.15);color:var(--accent-green)">📋</div><span class="kpi-card__change change--up">${snapshot.reports ? 'расчёт' : 'нет данных'}</span></div><div class="kpi-card__value">${snapshot.reports ? data.formatCurrency(snapshot.average) : '—'}</div><div class="kpi-card__title">Средний чек за период</div><div class="kpi-card__chart-wrap"><canvas id="kpi-average-chart"></canvas></div>`;

    const day = data.buildSnapshot('today');
    const top = day.managers[0];
    const managerCard = document.getElementById('topManagerCard');
    if (managerCard) {
      if (!top) managerCard.innerHTML = `<div class="manager-card__header"><span class="manager-card__label">👑 Топ менеджер дня</span></div>${empty('Сегодня ещё нет отчётов')}`;
      else managerCard.innerHTML = `<div class="manager-card__header"><span class="manager-card__label">👑 Топ менеджер дня</span></div><div class="manager-card__body"><div class="manager-card__left"><div class="avatar avatar--lg" style="background:${data.colorFor(top.name)}">${data.getInitials(top.name)}</div><div class="manager-card__name">${data.escapeHtml(top.name)}</div><div class="manager-card__stats"><div class="manager-stat"><span class="manager-stat__label">Выручка:</span><span class="manager-stat__value">${data.formatCurrency(top.revenue)}</span></div><div class="manager-stat"><span class="manager-stat__label">Отчёты:</span><span class="manager-stat__value">${top.reports}</span></div></div></div><div class="manager-card__right"><div class="manager-activity"><canvas id="manager-progress" width="80" height="80"></canvas><div class="manager-activity__value">${Math.min(100, Math.round(top.revenue / Math.max(day.revenue, 1) * 100))}</div><div class="manager-activity__label">Доля дня</div></div></div></div>`;
    }

    const reportsCard = document.getElementById('reportsCard');
    if (reportsCard) reportsCard.innerHTML = `<div class="secondary-card__header"><div><div class="card__title">Отчёты за период</div><div class="secondary-card__value">${snapshot.reports}</div></div><div class="kpi-card__icon" style="background:rgba(61,125,255,.15);color:var(--accent-blue)">🛒</div></div><div class="secondary-card__meta">${data.escapeHtml(periodLabel(state.filters.period))} · ${snapshot.managers.length} менеджеров</div>`;
  }

  function renderRecent(snapshot) {
    const rows = snapshot.recent;
    setText('salesFreshness', rows.length ? `последняя: ${rows[0].time}` : 'нет данных');
    if (!rows.length) { setHtml('live-table-body', `<tr><td colspan="6">${empty('Нет продаж за выбранный период')}</td></tr>`); return; }
    setHtml('live-table-body', rows.map(row => `<tr><td>${data.escapeHtml(row.terminalNumber || '—')}</td><td>${data.escapeHtml(row.manager)}</td><td>${data.escapeHtml(row.city)}</td><td style="color:var(--accent-green);font-weight:600">${data.formatCurrency(row.amount)}</td><td>${row.cashless > 0 ? '💳' : row.cash > 0 ? '💵' : row.credit > 0 ? '🏦' : '—'}</td><td>${row.receipt ? '✅' : '—'}</td></tr>`).join(''));
  }

  function renderAlerts(snapshot) {
    setText('paymentTotal', data.formatCurrency(snapshot.paymentTotal, true));
    const total = snapshot.alerts.reduce((sum, alert) => sum + alert.count, 0);
    setText('alertSummary', total ? `${total}` : 'нет');
    setText('navAlertCount', total ? String(total) : '0');
    setHtml('alerts-list', snapshot.alerts.length ? snapshot.alerts.map(alert => { const color = alert.type === 'error' ? 'var(--accent-red)' : 'var(--accent-yellow)'; return `<div class="alert-item"><div class="alert-icon" style="color:${color}">⚠</div><div class="alert-text">${data.escapeHtml(alert.text)}</div><div class="alert-count" style="background:${color}20;color:${color}">${alert.count}</div></div>`; }).join('') : empty('Нарушений не найдено'));
  }

  function renderRating(period) {
    const snapshot = data.buildSnapshot(period);
    setText('ratingCaption', periodLabel(period));
    const list = snapshot.managers;
    setHtml('top-managers-list', list.length ? list.map((manager, index) => { const progress = snapshot.revenue ? Math.max(2, Math.round(manager.revenue / list[0].revenue * 100)) : 0; return `<div class="top-manager-item"><div class="top-manager-rank">${index + 1}</div><div class="top-manager-info"><div class="top-manager-name">${data.escapeHtml(manager.name)} <span class="rating-reports">${manager.reports}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${progress}%;background:${data.colorFor(manager.name)}"></div></div></div><div class="top-manager-revenue">${data.formatCurrency(manager.revenue)}</div></div>`; }).join('') : empty('Нет данных за этот период'));
  }

  function renderCities(snapshot) {
    const max = snapshot.cities[0] ? snapshot.cities[0].revenue : 1;
    setHtml('city-rankings', snapshot.cities.length ? snapshot.cities.map((city, index) => `<div class="city-ranking-item"><div class="city-ranking-rank">${index + 1}</div><div class="city-ranking-name">${data.escapeHtml(city.name)}</div><div class="city-ranking-bar"><div class="city-ranking-fill" style="width:${Math.max(3, Math.round(city.revenue / max * 100))}%"></div></div><div class="city-ranking-amount">${data.formatCurrency(city.revenue, true)}</div></div>`).join('') : empty('Нет данных'));
  }

  function renderProducts(snapshot) {
    const products = {};
    snapshot.items.forEach(item => { const product = products[item.product] ||= { name: item.product, revenue: 0, quantity: 0 }; product.revenue += item.lineTotal; product.quantity += item.quantity; });
    const list = Object.values(products).sort((a, b) => b.revenue - a.revenue).slice(0, 24);
    const max = list[0] ? list[0].revenue : 1;
    setHtml('top-products-list', list.length ? list.map((product, index) => `<div class="top-product-item"><div class="top-product-rank">${index + 1}</div><div class="top-product-info"><div class="top-product-name">${data.escapeHtml(product.name)} <span class="rating-reports">×${product.quantity}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${Math.max(2, Math.round(product.revenue / max * 100))}%"></div></div></div><div class="top-product-revenue">${data.formatCurrency(product.revenue)}</div></div>`).join('') : empty('Нет товарных данных'));
  }

  function renderActivity(snapshot) {
    const rows = snapshot.recent.slice(0, 6);
    setText('activityFreshness', rows.length ? `обновлено ${rows[0].time}` : 'нет данных');
    setHtml('activity-feed', rows.length ? rows.map(row => `<div class="activity-item"><div class="activity-icon" style="background:var(--accent-green)20;color:var(--accent-green)">✓</div><div class="activity-content"><div class="activity-text">Продажа</div><div class="activity-meta"><span class="activity-manager">${data.escapeHtml(row.manager)}</span><span class="activity-amount" style="color:var(--accent-green)">${data.formatCurrency(row.amount)}</span></div></div><div class="activity-time">${data.escapeHtml(row.time)}</div></div>`).join('') : empty('Нет событий'));
  }

  function renderSidebar(snapshot) {
    const managers = snapshot.managers.slice(0, 8);
    setText('sidebarManagerCount', `${snapshot.managers.length}/${data.MASTER_MANAGERS.length}`);
    setHtml('sidebarManagerAvatars', managers.length ? managers.map(manager => `<div class="avatar avatar--sm" title="${data.escapeHtml(manager.name)}" style="background:${data.colorFor(manager.name)}">${data.getInitials(manager.name)}</div>`).join('') : '<span class="sidebar-muted">Нет данных</span>');
  }

  function renderStatus() {
    const status = document.getElementById('dataStatus');
    if (!status) return;
    if (state.loading) { status.textContent = 'Обновление…'; status.className = 'data-status data-status--loading'; return; }
    if (state.error && !state.loaded) { status.textContent = 'Данные недоступны'; status.className = 'data-status data-status--error'; return; }
    const age = state.lastFetchAt ? Math.max(0, Math.floor((Date.now() - state.lastFetchAt) / 1000)) : 0;
    status.textContent = age < 5 ? 'Обновлено только что' : `Обновлено ${age < 60 ? `${age} сек` : `${Math.floor(age / 60)} мин`} назад`;
    status.className = state.error ? 'data-status data-status--stale' : 'data-status';
  }

  function renderDashboard() {
    const snapshot = data.buildSnapshot();
    renderStatus();
    renderKpis(snapshot); renderRecent(snapshot); renderAlerts(snapshot); renderRating(state.ratingPeriod); renderCities(snapshot); renderProducts(snapshot); renderActivity(snapshot); renderSidebar(snapshot);
    setText('chartPeriodLabel', periodLabel(state.filters.period));
    if (window.renderCharts) window.renderCharts(snapshot);
    const error = document.getElementById('loadError');
    if (error) { error.hidden = !state.error; error.textContent = state.error ? `Не удалось обновить данные: ${state.error}. ${state.loaded ? 'Показаны данные последней успешной загрузки.' : ''}` : ''; }
    document.querySelectorAll('.card').forEach(card => card.classList.add('in'));
  }
  window.renderDashboard = renderDashboard;

  function populateSelect(id, values, allLabel) {
    const select = document.getElementById(id); if (!select) return;
    const current = select.value || 'all';
    select.innerHTML = `<option value="all">${allLabel}</option>` + values.sort((a, b) => a.localeCompare(b, 'ru')).map(value => `<option value="${data.escapeHtml(value)}">${data.escapeHtml(value)}</option>`).join('');
    select.value = values.includes(current) ? current : 'all';
  }

  function populateFilters() {
    populateSelect('cityFilter', [...new Set(state.rows.map(row => row.city).filter(Boolean))], 'Все города');
    populateSelect('channelFilter', [...new Set(state.rows.map(row => row.channel).filter(Boolean))], 'Все каналы');
    populateSelect('managerFilter', [...new Set(state.rows.map(row => row.manager).filter(Boolean))], 'Все менеджеры');
    populateSelect('terminalFilter', [...new Set(state.rows.map(row => row.terminalNumber).filter(Boolean))], 'Все терминалы');
  }

  function exportCSV() {
    const rows = data.filteredRows().map(row => [row.datetime, row.terminalNumber, row.manager, row.channel, row.city, row.terminal, row.amount, row.receipt, row.txid]);
    const csv = [['Дата и время', 'Номер терминала', 'Менеджер', 'Канал', 'Город', 'Точка', 'Итого', 'Фото чека', 'ID транзакции'], ...rows].map(row => row.map(value => `"${String(value == null ? '' : value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); link.download = `salescontrol-${state.filters.period}-${Date.now()}.csv`; link.click(); URL.revokeObjectURL(link.href);
  }

  function bind() {
    ['periodFilter', 'cityFilter', 'channelFilter', 'managerFilter', 'terminalFilter'].forEach(id => { const element = document.getElementById(id); if (!element) return; element.addEventListener('change', event => { const map = { periodFilter: 'period', cityFilter: 'city', channelFilter: 'channel', managerFilter: 'manager', terminalFilter: 'terminal' }; data.setFilter(map[id], event.target.value); renderDashboard(); }); });
    const rating = document.getElementById('ratingPeriod'); if (rating) rating.addEventListener('change', event => { data.setRatingPeriod(event.target.value); renderRating(state.ratingPeriod); });
    const refresh = document.getElementById('refreshButton'); if (refresh) refresh.addEventListener('click', async () => { await data.loadData(); populateFilters(); renderDashboard(); });
    const exportButton = document.getElementById('exportButton'); if (exportButton) exportButton.addEventListener('click', exportCSV);
  }

  async function init() { bind(); await data.loadData(); populateFilters(); renderDashboard(); data.scheduleRefresh(); setInterval(renderStatus, 10000); }
  document.addEventListener('DOMContentLoaded', init);
}());
