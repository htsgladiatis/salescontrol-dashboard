/* SalesControl live data layer. Google Sheets is the source of truth. */
(function () {
  'use strict';

  const CONFIG = {
    spreadsheetId: '17Sw8CIV1CUlmbSkdyKH4Kc7s8Bk7uJGhTIXOxd9AzUk',
    headersGid: 0,
    itemsGid: 211792679,
    refreshMs: 30000,
    timeoutMs: 15000,
  };

  const MASTER_MANAGERS = [
    'Аксененко Е.', 'Алейников В.', 'Богданчикова М.',
    'Гаранина Н.', 'Гнездилова Е.', 'Гузеева Н.', 'Дадилова И.',
    'Дашивец П.', 'Долгина М.', 'Иванова Т.',
    'Кичева В.', 'Кияева Н.', 'Котова В.',
    'Лунга Т.', 'Прохорова А.',
    'Репина Б.', 'Рупосова Ю.', 'Седова И.', 'Шевердина А.', 'Шпетная А.'
  ];

  // Бывшие менеджеры (больше не работают) — их записи исключаются из всех
  // данных дашборда: фильтр, топы, live-таблица, счётчики, сайдбар.
  const EXCLUDED_MANAGERS = new Set([
    'Игнатьева О.', 'Демиденко А.', 'Переверзев О.', 'Нагиева Э.', 'Битнерова С.',
    'Арсланова Л.', 'Рябков Н.'
  ]);

  const state = window.dashboardState = {
    rows: [],
    items: [],
    filters: { period: 'month', city: 'all', channel: 'all', manager: 'all', terminal: 'all' },
    ratingPeriod: 'week',
    loaded: false,
    loading: false,
    error: null,
    lastFetchAt: 0,
    refreshTimer: null,
  };

  function csvUrl(gid) {
    return `https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}/export?format=csv&gid=${gid}`;
  }

  function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n') { row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = ''; }
      else if (ch !== '\r') cell += ch;
    }
    if (cell || row.length) { row.push(cell); if (row.some(Boolean)) rows.push(row); }
    return rows;
  }

  function parseAmount(value) {
    const normalized = String(value == null ? '' : value)
      .replace(/[\s\u00a0]/g, '')
      .replace(',', '.')
      .replace(/[^0-9.-]/g, '');
    const number = Number(normalized);
    return Number.isFinite(number) ? number : 0;
  }

  function parseDateValue(value) {
    const raw = String(value || '').replace(/^'/, '').trim();
    const match = /^(\d{2})\.(\d{2})\.(\d{4})(?:[ ,]+(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(raw);
    if (!match) return { raw, iso: '', timestamp: 0, time: '' };
    const day = match[1], month = match[2], year = match[3];
    const time = `${match[4] || '00'}:${match[5] || '00'}:${match[6] || '00'}`;
    const timestamp = new Date(`${year}-${month}-${day}T${time}`).getTime();
    return { raw, iso: `${year}-${month}-${day}`, timestamp: Number.isFinite(timestamp) ? timestamp : 0, time };
  }

  function normalizeHeaderRow(cells) {
    const date = parseDateValue(cells[0]);
    return {
      datetime: date.raw,
      dateISO: date.iso,
      timestamp: date.timestamp,
      time: date.time,
      terminalNumber: String(cells[1] || '').trim(),
      manager: String(cells[2] || '').trim(),
      channel: String(cells[3] || '').trim(),
      city: String(cells[4] || '').trim(),
      terminal: String(cells[5] || '').trim(),
      cash: parseAmount(cells[6]),
      cashless: parseAmount(cells[7]),
      credit: parseAmount(cells[8]),
      encashment: parseAmount(cells[9]),
      amount: parseAmount(cells[10]),
      receipt: String(cells[11] || '').trim(),
      allowance: parseAmount(cells[12]),
      comment: String(cells[13] || '').trim(),
      txid: String(cells[14] || '').trim(),
    };
  }

  function normalizeItemRow(cells) {
    return {
      itemId: String(cells[0] || '').trim(),
      txid: String(cells[1] || '').trim(),
      datetime: String(cells[2] || '').trim(),
      manager: String(cells[3] || '').trim(),
      product: String(cells[4] || '').trim(),
      quantity: parseAmount(cells[5]),
      unitPrice: parseAmount(cells[6]),
      lineTotal: parseAmount(cells[7]),
      comment: String(cells[8] || '').trim(),
    };
  }

  function dateOnly(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function shiftDate(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function getPeriodRange(period) {
    const now = new Date();
    const today = dateOnly(now);
    if (period === 'today') return { start: today, end: today, label: 'Сегодня' };
    if (period === 'yesterday') { const d = dateOnly(shiftDate(now, -1)); return { start: d, end: d, label: 'Вчера' }; }
    if (period === 'week') return { start: dateOnly(shiftDate(now, -6)), end: today, label: 'Последние 7 дней' };
    if (period === 'prev-month') {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: dateOnly(first), end: dateOnly(last), label: first.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) };
    }
    if (period === 'all') return { start: '', end: '', label: 'Весь период' };
    return { start: dateOnly(new Date(now.getFullYear(), now.getMonth(), 1)), end: today, label: now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) };
  }

  function getPeriodLabel(period) { return getPeriodRange(period).label; }

  function rowMatchesFilters(row, periodOverride) {
    const period = periodOverride || state.filters.period;
    const range = getPeriodRange(period);
    return (!range.start || (row.dateISO >= range.start && row.dateISO <= range.end))
      && (state.filters.city === 'all' || row.city === state.filters.city)
      && (state.filters.channel === 'all' || row.channel === state.filters.channel)
      && (state.filters.manager === 'all' || row.manager === state.filters.manager)
      && (state.filters.terminal === 'all' || row.terminalNumber === state.filters.terminal);
  }

  function filteredRows(periodOverride) {
    return state.rows.filter(row => row.dateISO && row.manager && rowMatchesFilters(row, periodOverride));
  }

  function aggregate(rows) {
    const total = rows.reduce((sum, row) => sum + row.amount, 0);
    const payments = {
      cash: rows.reduce((sum, row) => sum + row.cash, 0),
      cashless: rows.reduce((sum, row) => sum + row.cashless, 0),
      credit: rows.reduce((sum, row) => sum + row.credit, 0),
      encashment: rows.reduce((sum, row) => sum + row.encashment, 0),
    };
    const managers = {};
    const cities = {};
    const byDate = {};
    rows.forEach(row => {
      const manager = managers[row.manager] ||= { name: row.manager, revenue: 0, reports: 0 };
      manager.revenue += row.amount; manager.reports += 1;
      cities[row.city] = (cities[row.city] || 0) + row.amount;
      const day = byDate[row.dateISO] ||= { date: row.dateISO, revenue: 0, reports: 0, average: 0 };
      day.revenue += row.amount; day.reports += 1;
    });
    Object.values(byDate).forEach(day => { day.average = day.reports ? day.revenue / day.reports : 0; });
    const managersList = Object.values(managers).sort((a, b) => b.revenue - a.revenue);
    return {
      rows,
      reports: rows.length,
      revenue: total,
      average: rows.length ? total / rows.length : 0,
      payments,
      paymentTotal: Object.values(payments).reduce((sum, value) => sum + value, 0),
      managers: managersList,
      cities: Object.entries(cities).map(([name, revenue]) => ({ name, revenue })).sort((a, b) => b.revenue - a.revenue),
      byDate: Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)),
      recent: rows.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 8),
    };
  }

  function buildSnapshot(periodOverride) {
    const rows = filteredRows(periodOverride);
    const result = aggregate(rows);
    const txCounts = {};
    rows.forEach(row => { if (row.txid) txCounts[row.txid] = (txCounts[row.txid] || 0) + 1; });
    const duplicateCount = Object.values(txCounts).filter(count => count > 1).reduce((sum, count) => sum + count - 1, 0);
    const missingReceipt = rows.filter(row => !row.receipt).length;
    const zeroReports = rows.filter(row => row.amount === 0).length;
    const noId = rows.filter(row => !row.txid).length;
    const todayRows = filteredRows('today');
    const todayManagers = new Set(todayRows.map(row => row.manager));
    const missingToday = state.filters.period === 'today' ? MASTER_MANAGERS.filter(manager => !todayManagers.has(manager)).length : 0;
    result.alerts = [
      ...(missingToday ? [{ type: 'error', text: 'Отсутствуют отчёты сегодня', count: missingToday }] : []),
      ...(missingReceipt ? [{ type: 'error', text: 'Отсутствует фото чека', count: missingReceipt }] : []),
      ...(duplicateCount ? [{ type: 'warning', text: 'Дублирующиеся транзакции', count: duplicateCount }] : []),
      ...(zeroReports ? [{ type: 'warning', text: 'Нулевые отчёты', count: zeroReports }] : []),
      ...(noId ? [{ type: 'warning', text: 'Записи без ID', count: noId }] : []),
    ];
    result.items = state.items.filter(item => rows.some(row => row.txid && row.txid === item.txid));
    return result;
  }

  function formatCurrency(value, compact) {
    const number = Math.round(Number(value) || 0);
    if (compact && Math.abs(number) >= 1000000) return `${(number / 1000000).toFixed(1).replace('.', ',')}M ₽`;
    if (compact && Math.abs(number) >= 1000) return `${Math.round(number / 1000)}K ₽`;
    return `${number.toLocaleString('ru-RU')} ₽`;
  }

  function formatDateTime(row) { return row.datetime || '—'; }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch])); }
  function getInitials(name) { return String(name || '?').trim().split(/\s+/).slice(0, 2).map(word => word[0] || '').join('').toUpperCase() || '?'; }
  function colorFor(name) { let hash = 0; for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) | 0; return ['#8b5cff', '#3d7dff', '#26d07c', '#ffb020', '#ff5a6e'][Math.abs(hash) % 5]; }

  async function fetchText(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.timeoutMs);
    try {
      const response = await fetch(`${url}&_=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } finally { clearTimeout(timer); }
  }

  async function loadData() {
    if (state.loading) return false;
    state.loading = true;
    try {
      const [headersText, itemsText] = await Promise.all([fetchText(csvUrl(CONFIG.headersGid)), fetchText(csvUrl(CONFIG.itemsGid))]);
      const headerRows = parseCSV(headersText);
      const itemRows = parseCSV(itemsText);
      if (headerRows.length < 2) throw new Error('Google Sheets вернул пустой лист заголовков');
      const expected = ['Дата и время', 'Номер терминала', 'Менеджер'];
      expected.forEach((name, index) => { if (headerRows[0][index] !== name) throw new Error(`Изменилась схема: колонка ${index + 1}`); });
      state.rows = headerRows.slice(1).map(normalizeHeaderRow).filter(row => row.dateISO && row.manager && !EXCLUDED_MANAGERS.has(row.manager));
      state.items = itemRows.slice(1).map(normalizeItemRow).filter(item => item.txid && item.product && !EXCLUDED_MANAGERS.has(item.manager));
      state.loaded = true;
      state.error = null;
      state.lastFetchAt = Date.now();
      return true;
    } catch (error) {
      state.error = error.name === 'AbortError' ? 'Таймаут загрузки данных' : error.message;
      return false;
    } finally { state.loading = false; }
  }

  function scheduleRefresh() {
    if (state.refreshTimer) clearTimeout(state.refreshTimer);
    state.refreshTimer = setTimeout(async () => {
      if (document.visibilityState === 'visible') {
        await loadData();
        if (window.renderDashboard) window.renderDashboard();
      }
      scheduleRefresh();
    }, CONFIG.refreshMs);
  }

  window.dashboardData = {
    CONFIG, MASTER_MANAGERS, state, loadData, scheduleRefresh, buildSnapshot, filteredRows,
    getPeriodRange, getPeriodLabel, formatCurrency, formatDateTime, escapeHtml, getInitials, colorFor,
    setFilter(name, value) { state.filters[name] = value; },
    setRatingPeriod(value) { state.ratingPeriod = value; },
  };
}());
