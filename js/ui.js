/* SalesControl Dashboard — ui.js
   Функции рендеринга UI-компонентов */

// ============================================================
// Утилиты
// ============================================================

/**
 * Возвращает инициалы из имени (первые буквы первых двух слов)
 */
function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ============================================================
// KPI карточки
// ============================================================

/**
 * Рендерит 3 KPI-карточки и карточку топ-менеджера в .kpi-row
 */
function renderKPICards() {
  const container = document.querySelector('.kpi-row');
  if (!container) return;

  // 3 KPI карточки
  kpiData.forEach((kpi, index) => {
    const isUp = kpi.trend === 'up';
    const changeClass = isUp ? 'change--up' : 'change--down';
    const changeArrow = isUp ? '▲' : '▼';

    const card = document.createElement('div');
    card.className = 'card kpi-card';
    card.innerHTML = `
      <div class="kpi-card__header">
        <div class="kpi-card__icon" style="background:${kpi.colorAlpha};color:${kpi.color}">${kpi.icon}</div>
        <span class="kpi-card__change ${changeClass}">${changeArrow} ${kpi.change}</span>
      </div>
      <div class="kpi-card__value">${kpi.value}</div>
      <div class="kpi-card__title">${kpi.title}</div>
      <div class="kpi-card__chart-wrap">
        <canvas id="kpi-chart-${index}" height="50"></canvas>
      </div>
    `;
    container.appendChild(card);
  });

  // Карточка топ-менеджера
  renderTopManagerCard(container);
}

/**
 * Рендерит карточку топ-менеджера дня
 */
function renderTopManagerCard(container) {
  const card = document.createElement('div');
  card.className = 'card kpi-card kpi-card--manager';
  card.innerHTML = `
    <div class="manager-card__header">
      <span class="manager-card__label">👑 Топ менеджер дня</span>
    </div>
    <div class="manager-card__body">
      <div class="manager-card__left">
        <div class="avatar avatar--lg" style="background:${topManager.avatarColor}">${topManager.initials}</div>
        <div class="manager-card__name">${topManager.name}</div>
        <div class="manager-card__stats">
          <div class="manager-stat">
            <span class="manager-stat__label">Выручка</span>
            <span class="manager-stat__value">${topManager.revenue}</span>
          </div>
          <div class="manager-stat">
            <span class="manager-stat__label">Продажи</span>
            <span class="manager-stat__value">${topManager.sales}</span>
          </div>
        </div>
      </div>
      <div class="manager-card__right">
        <div class="manager-activity">
          <canvas id="manager-progress" width="80" height="80"></canvas>
          <div class="manager-activity__value">${topManager.activity}</div>
          <div class="manager-activity__label">Активность</div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(card);
}

// ============================================================
// Лента активности
// ============================================================

/**
 * Рендерит ленту активности
 */
function renderActivityFeed() {
  const container = document.getElementById('activity-feed');
  if (!container) return;

  activityData.forEach(event => {
    const iconColor = event.type === 'success' ? 'var(--accent-green)'
                    : event.type === 'error'   ? 'var(--accent-red)'
                    : 'var(--accent-yellow)';
    const iconSymbol = event.type === 'success' ? '✓'
                     : event.type === 'error'   ? '✗'
                     : '!';

    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-icon" style="background:${iconColor}20;color:${iconColor}">${iconSymbol}</div>
      <div class="activity-content">
        <div class="activity-text">${event.text}</div>
        <div class="activity-meta">
          <span class="activity-manager">${event.manager}</span>
          ${event.amount ? `<span class="activity-amount" style="color:${event.type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)'}">${event.amount}</span>` : ''}
        </div>
      </div>
      <div class="activity-time">${event.time}</div>
    `;
    container.appendChild(item);
  });
}

// ============================================================
// Таблица живых продаж
// ============================================================

/**
 * Рендерит таблицу живых продаж
 */
function renderLiveTable() {
  const tbody = document.getElementById('live-table-body');
  if (!tbody) return;

  liveSalesData.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.style.background = index % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)';
    tr.innerHTML = `
      <td>${row.terminal}</td>
      <td>${row.manager}</td>
      <td>${row.city}</td>
      <td style="color:var(--accent-green);font-weight:600">${row.amount}</td>
      <td>${row.payment}</td>
      <td>${row.receipt}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================================
// Критические оповещения
// ============================================================

/**
 * Рендерит блок критических оповещений
 */
function renderAlerts() {
  const container = document.getElementById('alerts-list');
  if (!container) return;

  alertsData.forEach(alert => {
    const iconColor = alert.type === 'error' ? 'var(--accent-red)' : 'var(--accent-yellow)';

    const item = document.createElement('div');
    item.className = 'alert-item';
    item.innerHTML = `
      <div class="alert-icon" style="color:${iconColor}">⚠</div>
      <div class="alert-text">${alert.text}</div>
      <div class="alert-count" style="background:${iconColor}20;color:${iconColor}">${alert.count}</div>
    `;
    container.appendChild(item);
  });
}

// ============================================================
// Топ менеджеры
// ============================================================

/**
 * Рендерит список топ-менеджеров
 */
function renderTopManagers() {
  const container = document.getElementById('top-managers-list');
  if (!container) return;

  topManagersData.forEach(manager => {
    const item = document.createElement('div');
    item.className = 'top-manager-item';
    item.innerHTML = `
      <div class="top-manager-rank">${manager.rank}</div>
      <div class="top-manager-info">
        <div class="top-manager-name">${manager.name}</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${manager.progress}%;background:${manager.color}"></div>
        </div>
      </div>
      <div class="top-manager-revenue">${manager.revenue}</div>
    `;
    container.appendChild(item);
  });
}

// ============================================================
// Топ продукты
// ============================================================

/**
 * Рендерит список топ-продуктов
 */
function renderTopProducts() {
  const container = document.getElementById('top-products-list');
  if (!container) return;

  topProductsData.forEach(product => {
    const item = document.createElement('div');
    item.className = 'top-product-item';
    item.innerHTML = `
      <div class="top-product-rank">${product.rank}</div>
      <div class="top-product-info">
        <div class="top-product-name">${product.name}</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${product.share}%"></div>
        </div>
      </div>
      <div class="top-product-revenue">${product.revenue}</div>
    `;
    container.appendChild(item);
  });
}

// ============================================================
// Инициализация дашборда
// ============================================================

/**
 * Главная функция инициализации — вызывается при DOMContentLoaded
 */
function initDashboard() {
  renderKPICards();
  renderActivityFeed();
  renderLiveTable();
  renderAlerts();
  renderTopManagers();
  renderTopProducts();

  // Инициализация графиков (из charts.js)
  if (typeof initKPICharts === 'function') initKPICharts();
  if (typeof initManagerProgressChart === 'function') initManagerProgressChart();
  if (typeof initRevenueChart === 'function') initRevenueChart();
  if (typeof initPaymentChart === 'function') initPaymentChart();
  if (typeof initAvgCheckChart === 'function') initAvgCheckChart();
  if (typeof initForecastChart === 'function') initForecastChart();
  if (typeof initSeasonalityChart === 'function') initSeasonalityChart();
}

document.addEventListener('DOMContentLoaded', initDashboard);
