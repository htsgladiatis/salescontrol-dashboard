/* SalesControl Dashboard — data.js
   Все данные захардкожены. Никаких сетевых запросов. */

// ============================================================
// KPI карточки
// ============================================================
const kpiData = [
  {
    id: 'revenue',
    title: 'Выручка сегодня',
    value: '4 820 000 ₽',
    change: '+12.4%',
    trend: 'up',
    color: '#7c3aed',
    colorAlpha: 'rgba(124,58,237,0.15)',
    icon: '💳',
    chartData: [2.1, 2.8, 2.4, 3.2, 2.9, 3.8, 4.2, 3.9, 4.5, 4.8]
  },
  {
    id: 'sales',
    title: 'Продажи сегодня',
    value: '1 248',
    change: '+8.7%',
    trend: 'up',
    color: '#2563eb',
    colorAlpha: 'rgba(37,99,235,0.15)',
    icon: '🛒',
    chartData: [800, 920, 870, 1050, 980, 1100, 1150, 1080, 1200, 1248]
  },
  {
    id: 'avgcheck',
    title: 'Средний чек',
    value: '3 861 ₽',
    change: '+5.6%',
    trend: 'up',
    color: '#10b981',
    colorAlpha: 'rgba(16,185,129,0.15)',
    icon: '📋',
    chartData: [3200, 3400, 3300, 3500, 3450, 3600, 3700, 3650, 3800, 3861]
  }
];

// ============================================================
// Топ менеджер дня
// ============================================================
const topManager = {
  name: 'Алексей Смирнов',
  initials: 'АС',
  revenue: '612 300 ₽',
  sales: 156,
  activity: 92,
  avatarColor: '#7c3aed'
};

// ============================================================
// График динамики выручки
// ============================================================
const revenueChartData = {
  labels: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
  datasets: [
    {
      label: 'Выручка',
      data: [0, 0.2, 0.1, 0.5, 1.2, 2.1, 3.0, 3.8, 4.2, 4.5, 4.7, 4.82, 4.82],
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124,58,237,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2
    },
    {
      label: 'Вчера',
      data: [0, 0.1, 0.1, 0.4, 1.0, 1.9, 2.7, 3.3, 3.8, 4.0, 4.1, 4.2, 4.2],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.08)',
      borderDash: [5, 5],
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2
    }
  ]
};

// ============================================================
// Способы оплаты
// ============================================================
const paymentData = {
  labels: ['Наличные', 'Безналичные', 'Кредит/Рассрочка', 'Инкассация'],
  percentages: [42, 38, 13, 7],
  amounts: ['2 024 400 ₽', '1 833 600 ₽', '626 600 ₽', '335 400 ₽'],
  datasets: [{
    data: [42, 38, 13, 7],
    backgroundColor: ['#10b981', '#2563eb', '#7c3aed', '#f59e0b'],
    borderWidth: 0,
    hoverOffset: 8
  }]
};

// ============================================================
// Лента активности
// ============================================================
const activityData = [
  { time: '12:45', type: 'success', text: 'Новый рекорд выручки', amount: '812 300 ₽', manager: 'Алексей Смирнов' },
  { time: '12:31', type: 'success', text: 'Отчёт отправлен', amount: null, manager: 'Мария Иванова' },
  { time: '12:21', type: 'error',   text: 'Отсутствует фото чека', amount: null, manager: 'Терминал Т-247' },
  { time: '12:15', type: 'warning', text: 'Подозрительная транзакция', amount: null, manager: 'Терминал Т-102' },
  { time: '12:07', type: 'error',   text: 'Дубликат транзакции', amount: null, manager: 'Терминал Т-331' },
  { time: '12:03', type: 'success', text: 'Новый менеджер в сети', amount: null, manager: 'Дмитрий Кузнецов' }
];

// ============================================================
// График среднего чека
// ============================================================
const avgCheckData = {
  labels: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
  datasets: [{
    label: 'Средний чек',
    data: [0, 2200, 2800, 3100, 3300, 3500, 3600, 3700, 3750, 3800, 3850, 3861, 3861],
    borderColor: '#10b981',
    backgroundColor: 'rgba(16,185,129,0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    borderWidth: 2
  }]
};

// ============================================================
// Таблица живых продаж
// ============================================================
const liveSalesData = [
  { terminal: 'Т-247', manager: 'А. Смирнов',  city: 'Москва',       amount: '12 800 ₽',  payment: '💳', receipt: '📄' },
  { terminal: 'Т-331', manager: 'М. Иванова',  city: 'Санкт-Петербург', amount: '8 450 ₽', payment: '💵', receipt: '📄' },
  { terminal: 'Т-102', manager: 'Д. Кузнецов', city: 'Казань',       amount: '16 300 ₽',  payment: '💳', receipt: '📄' },
  { terminal: 'Т-415', manager: 'Е. Петрова',  city: 'Екатеринбург', amount: '6 120 ₽',   payment: '💵', receipt: '📄' },
  { terminal: 'Т-205', manager: 'С. Николаев', city: 'Новосибирск',  amount: '9 990 ₽',   payment: '💳', receipt: '📄' }
];

// ============================================================
// Критические оповещения
// ============================================================
const alertsData = [
  { type: 'error',   text: 'Отсутствуют отчёты',       count: 12, icon: '⚠' },
  { type: 'warning', text: 'Расхождение по продажам',   count: 5,  icon: '⚠' },
  { type: 'error',   text: 'Отсутствует фото чека',     count: 23, icon: '⚠' },
  { type: 'warning', text: 'Аномально высокий чек',     count: 7,  icon: '⚠' },
  { type: 'error',   text: 'Дублирующиеся транзакции',  count: 3,  icon: '⚠' }
];

// ============================================================
// Топ менеджеры
// ============================================================
const topManagersData = [
  { rank: 1, name: 'Алексей Смирнов',  revenue: '612 300 ₽', progress: 100, color: '#7c3aed' },
  { rank: 2, name: 'Мария Иванова',    revenue: '532 000 ₽', progress: 87,  color: '#2563eb' },
  { rank: 3, name: 'Дмитрий Кузнецов', revenue: '498 100 ₽', progress: 81,  color: '#10b981' },
  { rank: 4, name: 'Елена Петрова',    revenue: '412 700 ₽', progress: 67,  color: '#f59e0b' },
  { rank: 5, name: 'Сергей Николаев',  revenue: '368 500 ₽', progress: 60,  color: '#7c3aed' }
];

// ============================================================
// Города на карте России
// ============================================================
const citiesData = [
  { name: 'Москва',         x: 420, y: 280, revenue: 1820000, label: '1.8M' },
  { name: 'Санкт-Петербург', x: 370, y: 220, revenue: 980000,  label: '980K' },
  { name: 'Казань',         x: 510, y: 290, revenue: 650000,  label: '650K' },
  { name: 'Новосибирск',    x: 680, y: 310, revenue: 520000,  label: '520K' },
  { name: 'Екатеринбург',   x: 580, y: 270, revenue: 480000,  label: '480K' },
  { name: 'Краснодар',      x: 430, y: 360, revenue: 370000,  label: '370K' }
];

// ============================================================
// Топ продукты
// ============================================================
const topProductsData = [
  { rank: 1, name: 'Смартфон X',    revenue: '1 320 000 ₽', share: 27 },
  { rank: 2, name: 'Наушники Pro',  revenue: '980 000 ₽',   share: 20 },
  { rank: 3, name: 'Смарт-часы',    revenue: '760 000 ₽',   share: 16 },
  { rank: 4, name: 'Power Bank',    revenue: '430 000 ₽',   share: 9  },
  { rank: 5, name: 'Чехол Premium', revenue: '310 000 ₽',   share: 6  }
];

// ============================================================
// Прогноз выручки
// ============================================================
const forecastData = {
  labels: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
  datasets: [
    {
      label: 'Факт',
      data: [3.2, 3.5, 3.8, 4.1, 4.5, 4.82, null, null, null, null, null, null],
      borderColor: '#7c3aed',
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2
    },
    {
      label: 'Прогноз',
      data: [null, null, null, null, null, 4.82, 5.1, 5.4, 5.7, 6.0, 6.3, 6.8],
      borderColor: '#2563eb',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2
    },
    {
      label: 'Диапазон',
      data: [null, null, null, null, null, 4.82, 4.8, 5.0, 5.2, 5.5, 5.8, 6.2],
      borderColor: 'rgba(37,99,235,0.3)',
      backgroundColor: 'rgba(37,99,235,0.08)',
      fill: '+1',
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 1
    }
  ]
};

// ============================================================
// Сезонность
// ============================================================
const seasonalityData = {
  labels: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
  datasets: [
    {
      label: '2024',
      data: [3.2, 3.5, 3.8, 4.1, 4.5, 4.82, null, null, null, null, null, null],
      borderColor: '#7c3aed',
      backgroundColor: 'transparent',
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2,
      fill: false
    },
    {
      label: '2023',
      data: [2.8, 3.0, 3.3, 3.6, 3.9, 4.1, 4.3, 4.0, 3.8, 4.2, 4.5, 4.8],
      borderColor: '#2563eb',
      backgroundColor: 'transparent',
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2,
      fill: false
    },
    {
      label: '2022',
      data: [2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.5, 3.2, 3.0, 3.4, 3.7, 4.0],
      borderColor: '#10b981',
      backgroundColor: 'transparent',
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2,
      fill: false
    }
  ]
};
