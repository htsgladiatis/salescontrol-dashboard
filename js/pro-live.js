/* SalesControl Pro — live data renderer. Keeps the original fintech OS visual shell. */
(function () {
  'use strict';

  const data = window.dashboardData;
  if (!data) return;
  const state = data.state;
  const $ = selector => document.querySelector(selector);
  const e = (value) => data.escapeHtml(value == null ? '' : value);
  const money = value => data.formatCurrency(value);
  const compact = value => data.formatCurrency(value, true);
  const nf = value => Math.round(Number(value) || 0).toLocaleString('ru-RU');
  const colors = ['var(--violet)', 'var(--blue)', 'var(--mint)', 'var(--amber)', 'var(--down)', 'var(--cyan)'];

  const extraStyle = document.createElement('style');
  extraStyle.textContent = `
    .pro-kpi-three{grid-template-columns:repeat(3,1fr)}
    .pro-charts-two{grid-template-columns:2fr 1fr}
    .pro-structural-row{display:grid;grid-template-columns:1.35fr .85fr;gap:14px}
    .pro-rating-chip{cursor:pointer;user-select:none}
    .pro-empty{padding:18px 8px;text-align:center;color:var(--txt-3);font-size:12px}
    .pro-muted{color:var(--txt-3)}
    .pro-filter-error{position:fixed;right:18px;bottom:18px;z-index:100;background:var(--panel);border:1px solid var(--down);color:var(--txt);padding:11px 14px;border-radius:10px;box-shadow:var(--elev-2);font-size:12px}
    @media(max-width:900px){.pro-kpi-three,.pro-charts-two,.pro-structural-row{grid-template-columns:1fr}}
  `;
  document.head.appendChild(extraStyle);

  function clear(host) { if (host) host.innerHTML = ''; }
  function empty(message) { return '<div class="pro-empty">' + e(message) + '</div>'; }
  function initials(name) { return data.getInitials(name); }
  function color(name) { return data.colorFor(name); }
  function dateLabel(iso) { return iso ? iso.slice(8, 10) + '.' + iso.slice(5, 7) : '—'; }
  function periodLabel(period) { return data.getPeriodLabel(period); }
  function maxOf(values) { return Math.max.apply(null, values.concat([1])); }

  function sparkline(values, stroke) {
    const nums = values.length ? values : [0];
    const W = 280, H = 46, pad = 3, max = maxOf(nums), min = Math.min.apply(null, nums), span = max - min || 1;
    const points = nums.map((value, index) => [nums.length === 1 ? W / 2 : index / (nums.length - 1) * W, H - pad - (value - min) / span * (H - pad * 2)]);
    const s = window.svg(W, H);
    const id = 'pro-sg-' + Math.random().toString(36).slice(2, 8);
    const defs = window.node('defs', {});
    const gradient = window.node('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 });
    gradient.appendChild(window.node('stop', { offset: 0, 'stop-color': stroke, 'stop-opacity': '.34' }));
    gradient.appendChild(window.node('stop', { offset: 1, 'stop-color': stroke, 'stop-opacity': '0' }));
    defs.appendChild(gradient); s.appendChild(defs);
    const path = window.smooth(points);
    s.appendChild(window.node('path', { d: path + ' L' + W + ' ' + H + ' L0 ' + H + ' Z', fill: 'url(#' + id + ')' }));
    s.appendChild(window.node('path', { d: path, fill: 'none', stroke, 'stroke-width': 1.8, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }));
    const last = points[points.length - 1];
    s.appendChild(window.node('circle', { cx: last[0], cy: last[1], r: 2.6, fill: stroke }));
    return s;
  }

  function ring(value) {
    const radius = 22, circumference = 2 * Math.PI * radius;
    const percent = Math.max(0, Math.min(100, value));
    return '<div class="ring"><svg viewBox="0 0 52 52" width="52" height="52">' +
      '<circle cx="26" cy="26" r="' + radius + '" fill="none" stroke="var(--line-2)" stroke-width="4"/>' +
      '<circle cx="26" cy="26" r="' + radius + '" fill="none" stroke="var(--lime)" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + circumference.toFixed(1) + '" stroke-dashoffset="' + (circumference * (1 - percent / 100)).toFixed(1) + '"/></svg>' +
      '<i>' + Math.round(percent) + '</i></div>';
  }

  function renderChrome(snapshot) {
    const period = periodLabel(state.filters.period);
    document.title = 'SalesControl — ' + period;
    const logoPeriod = document.querySelector('.logo-text span');
    if (logoPeriod) logoPeriod.textContent = 'SALES · ' + period.toUpperCase();
    const status = document.getElementById('proDataStatus');
    if (status) {
      if (state.loading) { status.textContent = 'Обновление…'; status.className = 'pro-status'; }
      else if (state.error && !state.loaded) { status.textContent = 'Данные недоступны'; status.className = 'pro-status pro-status--error'; }
      else {
        const age = state.lastFetchAt ? Math.max(0, Math.floor((Date.now() - state.lastFetchAt) / 1000)) : 0;
        status.textContent = state.error ? 'Старые данные · ' + (age < 60 ? age + ' сек' : Math.floor(age / 60) + ' мин') : 'Обновлено ' + (age < 5 ? 'только что' : age + ' сек назад');
        status.className = 'pro-status' + (state.error ? ' pro-status--stale' : '');
      }
    }
    const ticker = document.getElementById('tickerTrack');
    if (ticker) {
      const topCity = snapshot.cities[0];
      const topProduct = topProductRows(snapshot)[0];
      const ticks = [
        ['ВЫРУЧКА', money(snapshot.revenue), 'up'],
        ['ОТЧЁТОВ', String(snapshot.reports), 'up'],
        ['СРЕДНИЙ ЧЕК', money(snapshot.average), 'up'],
        [topCity ? topCity.name.toUpperCase() : 'ГОРОДА', topCity ? compact(topCity.revenue) : '—', 'up'],
        [topProduct ? topProduct.name.toUpperCase() : 'ТОВАРЫ', topProduct ? compact(topProduct.revenue) : '—', 'up'],
        ['БЕЗНАЛ', snapshot.paymentTotal ? Math.round(snapshot.payments.cashless / snapshot.paymentTotal * 100) + '%' : '0%', 'up'],
        ['БЕЗ ФОТО', String(snapshot.rows.filter(row => !row.receipt).length), 'down']
      ];
      let html = '';
      for (let repeat = 0; repeat < 2; repeat += 1) ticks.forEach(item => { html += '<span class="tick"><b>' + e(item[0]) + '</b> ' + e(item[1]) + ' <span class="' + item[2] + '">' + (item[2] === 'up' ? '▲' : '▼') + '</span></span><span class="tick-dot"></span>'; });
      ticker.innerHTML = html;
    }
  }

  function topProductRows(snapshot) {
    const products = {};
    snapshot.items.forEach(item => {
      const product = products[item.product] || (products[item.product] = { name: item.product, revenue: 0, quantity: 0 });
      product.revenue += item.lineTotal; product.quantity += item.quantity;
    });
    return Object.values(products).sort((a, b) => b.revenue - a.revenue);
  }

  function renderKpis(snapshot) {
    const row = $('#kpiRow'); if (!row) return;
    const daily = data.buildSnapshot('today');
    const manager = daily.managers[0] || snapshot.managers[0];
    const managerPeriod = daily.managers.length ? 'Топ менеджер дня' : 'Топ менеджер периода';
    const revenueSeries = snapshot.byDate.map(item => item.revenue);
    const averageSeries = snapshot.byDate.map(item => item.average);
    row.classList.add('pro-kpi-three');
    row.innerHTML = '';
    const cards = [
      { icon: '💳', value: money(snapshot.revenue), label: 'Выручка за ' + periodLabel(state.filters.period).toLowerCase(), color: 'var(--lime)', series: revenueSeries },
      { icon: '📋', value: snapshot.reports ? money(snapshot.average) : '—', label: 'Средний чек', color: 'var(--blue)', series: averageSeries }
    ];
    cards.forEach(card => {
      const node = document.createElement('div'); node.className = 'card kpi'; node.style.setProperty('--acc', card.color);
      node.innerHTML = '<div class="kpi-top"><div class="kpi-ic">' + card.icon + '</div><span class="kpi-dl dl-up">данные</span></div><div class="kpi-val">' + e(card.value) + '</div><div class="kpi-lab">' + e(card.label) + '</div>';
      const spark = document.createElement('div'); spark.className = 'kpi-spark'; spark.appendChild(sparkline(card.series, card.color)); node.appendChild(spark); row.appendChild(node);
    });
    const tm = document.createElement('div'); tm.className = 'card kpi tm'; tm.style.setProperty('--acc', 'var(--lime)');
    if (!manager) {
      tm.innerHTML = '<div class="kpi-lab">🏆 Топ менеджер дня</div>' + empty('Нет продаж за выбранный период'); row.appendChild(tm); return;
    }
    const share = snapshot.revenue ? Math.round(manager.revenue / snapshot.revenue * 100) : 0;
    tm.innerHTML = '<div class="tm-crown">👑</div><div class="kpi-lab" style="margin:0 0 10px">🏆 ' + managerPeriod + '</div>' +
      '<div class="tm-body"><div class="avatar avatar--lg" style="background:' + color(manager.name) + '">' + e(initials(manager.name)) + '</div><div style="flex:1;min-width:0"><div class="tm-name">' + e(manager.name) + '</div><div class="tm-rev">' + e(money(manager.revenue)) + '</div></div>' + ring(share) + '</div>' +
      '<div class="tm-stats"><div class="tm-stat"><span>Продажи</span><b>' + manager.reports + '</b></div><div class="tm-stat"><span>Доля</span><b style="color:var(--lime)">' + share + '%</b></div><div class="tm-stat"><span>Период</span><b>' + e(daily.managers.length ? 'сегодня' : periodLabel(state.filters.period).toLowerCase()) + '</b></div></div>';
    row.appendChild(tm);
  }

  function renderRevenue(snapshot) {
    const host = $('#revChart'), axis = $('#revAxis'); if (!host) return;
    clear(host); const rows = snapshot.byDate;
    if (!rows.length) { host.innerHTML = empty('Нет продаж за выбранный период'); if (axis) axis.innerHTML = ''; return; }
    const W = 680, H = 210, pad = 5, top = 10, bottom = 4, max = maxOf(rows.map(row => row.revenue));
    const width = W - pad * 2, height = H - top - bottom, barWidth = width / rows.length;
    const s = window.svg(W, H); s.style.height = '210px';
    for (let i = 0; i <= 3; i += 1) { const y = top + height * i / 3; s.appendChild(window.node('line', { x1: 0, y1: y, x2: W, y2: y, stroke: 'var(--line)', 'stroke-width': 1 })); }
    rows.forEach((row, index) => { const h = row.revenue / max * height * .88; const x = pad + index * barWidth + barWidth * .16; const rect = window.node('rect', { x, y: top + height - h, width: barWidth * .68, height: Math.max(1, h), rx: 3, fill: 'var(--violet)', 'fill-opacity': .62 }); s.appendChild(rect); });
    const cumulative = []; rows.reduce((sum, row, index) => { cumulative[index] = sum + row.revenue; return cumulative[index]; }, 0);
    const points = cumulative.map((value, index) => [pad + index * barWidth + barWidth / 2, top + height - value / maxOf(cumulative) * height * .88]);
    const line = window.node('path', { d: window.smooth(points), fill: 'none', stroke: 'var(--lime)', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }); s.appendChild(line);
    const hitLayer = window.node('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }); hitLayer.style.cursor = 'crosshair';
    hitLayer.addEventListener('mousemove', event => { const box = s.getBoundingClientRect(); const index = Math.max(0, Math.min(rows.length - 1, Math.round((event.clientX - box.left) / box.width * (rows.length - 1)))); window.showTip(event.clientX, event.clientY, '<b>' + dateLabel(rows[index].date) + '</b><div class="r"><span>За день</span><i>' + money(rows[index].revenue) + '</i></div><div class="r"><span>Накопительно</span><i>' + money(cumulative[index]) + '</i></div>'); });
    hitLayer.addEventListener('mouseleave', window.hideTip); s.appendChild(hitLayer); host.appendChild(s);
    if (axis) axis.innerHTML = rows.length > 1 ? '<span>' + dateLabel(rows[0].date) + '</span><span>' + dateLabel(rows[Math.floor(rows.length / 2)].date) + '</span><span>' + dateLabel(rows[rows.length - 1].date) + '</span>' : '<span>' + dateLabel(rows[0].date) + '</span>';
  }

  function renderDonut(snapshot) {
    const host = $('#donut'), legend = $('#payLegend'); if (!host || !legend) return;
    clear(host); clear(legend);
    const values = [snapshot.payments.cash, snapshot.payments.cashless, snapshot.payments.credit, snapshot.payments.encashment];
    const labels = ['Наличные', 'Безналичные', 'Кредит/Рассрочка', 'Инкассация'];
    const swatches = ['var(--mint)', 'var(--blue)', 'var(--violet)', 'var(--amber)'];
    const total = values.reduce((sum, value) => sum + value, 0);
    const size = 150, radius = 58, circumference = 2 * Math.PI * radius;
    const s = window.svg(size, size, 'xMidYMid meet'); s.setAttribute('width', size); s.setAttribute('height', size); s.style.transform = 'rotate(-90deg)';
    s.appendChild(window.node('circle', { cx: 75, cy: 75, r: radius, fill: 'none', stroke: 'var(--line)', 'stroke-width': 17 }));
    let offset = 0;
    values.forEach((value, index) => { const length = total ? circumference * value / total : 0; const arc = window.node('circle', { cx: 75, cy: 75, r: radius, fill: 'none', stroke: swatches[index], 'stroke-width': 17, 'stroke-dasharray': Math.max(0, length - 1.5) + ' ' + circumference, 'stroke-dashoffset': -circumference * offset / 100 }); s.appendChild(arc); offset += total ? value / total * 100 : 0; });
    host.appendChild(s);
    const donutTotal = $('#donutTotal'); if (donutTotal) donutTotal.textContent = compact(total);
    labels.forEach((label, index) => { const percent = total ? Math.round(values[index] / total * 100) : 0; const item = document.createElement('div'); item.className = 'leg'; item.innerHTML = '<span class="leg-dot" style="background:' + swatches[index] + '"></span><span class="leg-l">' + label + '</span><span class="leg-v">' + percent + '%</span><span class="leg-a">' + money(values[index]) + '</span>'; legend.appendChild(item); });
  }

  function renderAverage(snapshot) {
    const host = $('#avgChart'), axis = $('#avgAxis'); if (!host) return;
    clear(host); const rows = snapshot.byDate; if (!rows.length) { host.innerHTML = empty('Нет данных'); if (axis) axis.innerHTML = ''; return; }
    const W = 420, H = 150, top = 8, bottom = 4, max = maxOf(rows.map(row => row.average)), height = H - top - bottom;
    const points = rows.map((row, index) => [rows.length === 1 ? W / 2 : index / (rows.length - 1) * W, top + height - row.average / max * height * .9]);
    const s = window.svg(W, H); s.style.height = '150px';
    for (let i = 0; i <= 3; i += 1) { const y = top + height * i / 3; s.appendChild(window.node('line', { x1: 0, y1: y, x2: W, y2: y, stroke: 'var(--line)' })); }
    const path = window.smooth(points); s.appendChild(window.node('path', { d: path + ' L' + W + ' ' + (top + height) + ' L0 ' + (top + height) + ' Z', fill: 'var(--up-soft)' })); s.appendChild(window.node('path', { d: path, fill: 'none', stroke: 'var(--mint)', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }));
    host.appendChild(s); if (axis) axis.innerHTML = '<span>' + dateLabel(rows[0].date) + '</span><span>' + dateLabel(rows[Math.floor(rows.length / 2)].date) + '</span><span>' + dateLabel(rows[rows.length - 1].date) + '</span>';
    const inline = host.closest('.card') && host.closest('.card').querySelector('.kpi-dl'); if (inline) inline.textContent = money(snapshot.average);
  }

  function renderFeed(snapshot) {
    const host = $('#feed'); if (!host) return; const rows = snapshot.recent.slice(0, 8); clear(host);
    if (!rows.length) { host.innerHTML = empty('Нет событий за период'); return; }
    rows.forEach(row => { const item = document.createElement('div'); item.className = 'feed-i'; item.innerHTML = '<div class="feed-ic">✓</div><div class="feed-b"><div class="feed-t">Продажа<em>' + money(row.amount) + '</em></div><div class="feed-m">' + e(row.manager) + (row.city ? ' · ' + e(row.city) : '') + '</div></div><div class="feed-time">' + e(row.time) + '</div>'; host.appendChild(item); });
    const period = $('#activityPeriod'); if (period) period.textContent = periodLabel(state.filters.period);
  }

  function renderSales(snapshot) {
    const body = $('#liveBody'); if (!body) return; clear(body); const rows = snapshot.recent.slice(0, 8); const freshness = $('#salesFreshness'); if (freshness) freshness.textContent = rows.length ? 'обновлено ' + e(rows[0].time) : 'нет данных';
    if (!rows.length) { body.innerHTML = '<tr><td colspan="5">' + empty('Нет продаж за выбранный период') + '</td></tr>'; return; }
    rows.forEach(row => { const tr = document.createElement('tr'); const payment = row.cashless > 0 ? '💳 карта' : row.cash > 0 ? '💵 нал' : row.credit > 0 ? '🏦 кредит' : '—'; tr.innerHTML = '<td>' + e(row.terminalNumber || '—') + '</td><td class="nm">' + e(row.manager) + '</td><td>' + e(row.city) + '</td><td class="amt">' + money(row.amount) + '</td><td><span class="tag tag--' + (row.cashless > 0 ? 'card' : 'cash') + '">' + payment + '</span></td>'; body.appendChild(tr); });
  }

  function renderAlerts(snapshot) {
    const host = $('#alerts'); if (!host) return; clear(host); const total = snapshot.alerts.reduce((sum, alert) => sum + alert.count, 0); const badge = host.closest('.card') && host.closest('.card').querySelector('.badge'); if (badge) badge.textContent = String(total);
    if (!snapshot.alerts.length) { host.innerHTML = empty('Нарушений не найдено'); return; }
    snapshot.alerts.forEach(alert => { const type = alert.type === 'error' ? 'err' : 'warn'; const item = document.createElement('div'); item.className = 'alert alert--' + type; item.innerHTML = '<div class="alert-ic">' + (type === 'err' ? '⚠' : '!') + '</div><div class="alert-t">' + e(alert.text) + '</div><div class="alert-n">' + alert.count + '</div>'; host.appendChild(item); });
  }

  function renderRanks(snapshot) {
    const managerCard = $('#mgrList')?.closest('.card'); if (managerCard) {
      const list = snapshot.managers;
      const host = managerCard.querySelector('#mgrList'); if (host) { clear(host); if (!list.length) host.innerHTML = empty('Нет данных за период'); else { const max = list[0].revenue || 1; list.forEach((manager, index) => { const item = document.createElement('div'); item.className = 'rank' + (index < 3 ? ' rank--top' : ''); const pct = Math.max(1, Math.round(manager.revenue / max * 100)); item.innerHTML = '<div class="rank-n">' + (index + 1) + '</div><div class="rank-b"><div class="rank-nm">' + e(manager.name) + ' <span class="pro-muted">' + manager.reports + '</span></div><div class="track"><div class="fill" style="width:' + pct + '%;background:' + (index === 0 ? 'var(--grad-lime)' : index < 3 ? 'var(--grad-violet)' : 'var(--blue)') + '"></div></div></div><div class="rank-v">' + money(manager.revenue) + '</div>'; host.appendChild(item); }); } }
      const chip = managerCard.querySelector('.card-h .chip'); if (chip) chip.textContent = periodLabel(state.ratingPeriod);
    }
    const cityHost = $('#cityList'); if (cityHost) { clear(cityHost); const max = snapshot.cities[0] ? snapshot.cities[0].revenue : 1; snapshot.cities.slice(0, 8).forEach((city, index) => { const item = document.createElement('div'); item.className = 'rank' + (index < 3 ? ' rank--top' : ''); item.style.padding = '10px 6px'; const pct = Math.max(2, Math.round(city.revenue / max * 100)); item.innerHTML = '<div class="rank-n">' + (index + 1) + '</div><div class="rank-b"><div class="rank-nm">' + e(city.name) + '</div><div class="track" style="height:8px"><div class="fill" style="width:' + pct + '%;background:' + (index === 0 ? 'var(--grad-lime)' : index === 1 ? 'var(--grad-violet)' : 'var(--blue)') + '"></div></div></div><div class="rank-v">' + compact(city.revenue) + '</div>'; cityHost.appendChild(item); }); if (!snapshot.cities.length) cityHost.innerHTML = empty('Нет данных'); }
    const productHost = $('#prodList'); if (productHost) { clear(productHost); const products = topProductRows(snapshot).slice(0, 24); const max = products[0] ? products[0].revenue : 1; if (!products.length) productHost.innerHTML = empty('Нет товарных данных'); products.forEach((product, index) => { const item = document.createElement('div'); item.className = 'rank' + (index < 3 ? ' rank--top' : ''); const pct = Math.max(1, Math.round(product.revenue / max * 100)); item.innerHTML = '<div class="rank-n">' + (index + 1) + '</div><div class="rank-b"><div class="rank-nm">' + e(product.name) + ' <span class="pro-muted">×' + product.quantity + '</span></div><div class="track"><div class="fill" style="width:' + pct + '%;background:' + (index === 0 ? 'var(--grad-lime)' : 'var(--cyan)') + '"></div></div></div><div class="rank-v">' + money(product.revenue) + '</div>'; productHost.appendChild(item); }); }
  }

  function ensureLayout() {
    const content = $('.content');
    const kpi = $('#kpiRow');
    const charts = $('.row-charts');
    const bottom = $('.row-bot');
    if (!content || !kpi || !charts || !bottom) return;

    /* Structure only: checked blocks keep their original rows and card styling. */
    if (!kpi.classList.contains('pro-kpi-three')) kpi.classList.add('pro-kpi-three');
    charts.classList.add('pro-charts-two');

    let secondary = $('#proSecondary');
    if (!secondary) {
      secondary = document.createElement('div');
      secondary.id = 'proSecondary';
      secondary.className = 'pro-structural-row';
      content.appendChild(secondary);
    }

    const activity = charts.querySelector('#feed')?.closest('.card') || secondary.querySelector('#feed')?.closest('.card');
    if (activity && activity.parentElement !== secondary) secondary.appendChild(activity);

    if (!$('#proReports')) {
      const report = document.createElement('div');
      report.id = 'proReports';
      report.className = 'card kpi';
      report.style.setProperty('--acc', 'var(--violet)');
      report.innerHTML = '<div class="kpi-top"><div class="kpi-ic">🛒</div><span class="kpi-dl dl-up">данные</span></div><div class="kpi-val" id="proReportValue">—</div><div class="kpi-lab" id="proReportLabel">Отчёты за период</div><div class="kpi-spark" id="proReportSpark"></div>';
      secondary.appendChild(report);
    }

    const managerCard = $('#mgrList')?.closest('.card');
    const ratingChip = managerCard?.querySelector('.card-h .chip');
    if (ratingChip) {
      ratingChip.id = 'ratingPeriod';
      ratingChip.classList.add('pro-rating-chip');
      ratingChip.title = 'Нажмите, чтобы сменить период рейтинга';
    }
  }

  function bindFilters() {
    const selects = Array.from(document.querySelectorAll('.fld select'));
    const configs = [
      { key: 'period', label: 'Период', options: [['month', 'Текущий месяц'], ['today', 'Сегодня'], ['yesterday', 'Вчера'], ['week', 'Последние 7 дней'], ['prev-month', 'Предыдущий месяц'], ['all', 'Весь период']] },
      { key: 'city', label: 'Город' }, { key: 'channel', label: 'Канал' }, { key: 'manager', label: 'Менеджер' }, { key: 'terminal', label: 'Терминал' }
    ];
    selects.forEach((select, index) => {
      const config = configs[index]; if (!config) return;
      const current = state.filters[config.key] || 'all';
      let options;
      if (config.options) options = config.options;
      else { const values = [...new Set(state.rows.map(row => row[config.key === 'city' ? 'city' : config.key === 'channel' ? 'channel' : config.key === 'manager' ? 'manager' : 'terminalNumber']).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru')); options = [['all', config.key === 'city' ? 'Все города' : config.key === 'channel' ? 'Все каналы' : config.key === 'manager' ? 'Все менеджеры' : 'Все терминалы'], ...values.map(value => [value, value])]; }
      select.innerHTML = options.map(option => '<option value="' + e(option[0]) + '">' + e(option[1]) + '</option>').join(''); select.value = options.some(option => option[0] === current) ? current : (config.key === 'period' ? 'month' : 'all');
      select.onchange = event => { state.filters[config.key] = event.target.value; render(); };
    });
  }

  function bindRating() {
    const chip = $('#ratingPeriod'); if (!chip || chip.dataset.bound) return;
    chip.dataset.bound = '1';
    chip.onclick = () => {
      const periods = ['today', 'yesterday', 'week', 'month', 'all'];
      const next = (periods.indexOf(state.ratingPeriod) + 1) % periods.length;
      state.ratingPeriod = periods[next];
      renderRanks(data.buildSnapshot(state.ratingPeriod));
    };
  }

  function renderReport(snapshot) {
    const card = $('#proReports'); if (!card) return;
    const value = $('#proReportValue');
    const label = $('#proReportLabel');
    const sparkHost = $('#proReportSpark');
    if (value) value.textContent = nf(snapshot.reports);
    if (label) label.textContent = 'Отчётов за ' + periodLabel(state.filters.period).toLowerCase();
    if (sparkHost) { clear(sparkHost); sparkHost.appendChild(sparkline(snapshot.byDate.map(item => item.reports), 'var(--violet)')); }
  }

  function render() {
    ensureLayout();
    const snapshot = data.buildSnapshot();
    renderChrome(snapshot); renderKpis(snapshot); renderRevenue(snapshot); renderDonut(snapshot); renderAverage(snapshot); renderFeed(snapshot); renderSales(snapshot); renderAlerts(snapshot); renderRanks(data.buildSnapshot(state.ratingPeriod)); renderReport(snapshot);
    const sidebarCount = $('#sidebarManagerCount'); if (sidebarCount) sidebarCount.textContent = snapshot.managers.length + '/' + data.MASTER_MANAGERS.length;
    if (state.error && !state.loaded) { let error = $('#proFilterError'); if (!error) { error = document.createElement('div'); error.id = 'proFilterError'; error.className = 'pro-filter-error'; document.body.appendChild(error); } error.textContent = 'Не удалось загрузить данные: ' + state.error; } else { const error = $('#proFilterError'); if (error) error.remove(); }
    bindRating();
  }

  async function init() {
    ensureLayout(); bindFilters();
    await data.loadData();
    bindFilters(); render(); data.scheduleRefresh();
    setInterval(() => { renderChrome(data.buildSnapshot()); }, 10000);
  }

  window.renderDashboard = render;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
