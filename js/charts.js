/* SalesControl Dashboard — charts.js
   Инициализация всех Chart.js графиков */

// ============================================================
// Общие настройки Chart.js
// ============================================================
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#1e1e3f';
Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";

// ============================================================
// Задача 7.1: Мини-графики KPI
// ============================================================

/**
 * Инициализирует мини-графики для 3 KPI-карточек
 */
function initKPICharts() {
  kpiData.forEach((kpi, index) => {
    const canvas = document.getElementById(`kpi-chart-${index}`);
    if (!canvas) return;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: kpi.chartData.map((_, i) => i),
        datasets: [{
          data: kpi.chartData,
          borderColor: kpi.color,
          backgroundColor: kpi.colorAlpha,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        animation: { duration: 800 }
      }
    });
  });
}

// ============================================================
// Задача 7.2: Doughnut-график активности топ-менеджера
// ============================================================

/**
 * Инициализирует круговой прогресс-индикатор активности менеджера
 */
function initManagerProgressChart() {
  const canvas = document.getElementById('manager-progress');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [topManager.activity, 100 - topManager.activity],
        backgroundColor: ['#7c3aed', '#1e1e3f'],
        borderWidth: 0,
        hoverOffset: 0
      }]
    },
    options: {
      responsive: false,
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: { duration: 1000 }
    }
  });
}

// ============================================================
// Задача 8.1: График динамики выручки
// ============================================================

/**
 * Инициализирует большой area chart динамики выручки
 */
function initRevenueChart() {
  const canvas = document.getElementById('revenue-chart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'line',
    data: revenueChartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'start',
          labels: {
            color: '#94a3b8',
            font: { size: 12 },
            usePointStyle: true,
            pointStyleWidth: 20,
            boxHeight: 2
          }
        },
        tooltip: {
          backgroundColor: '#1a1a35',
          borderColor: '#1e1e3f',
          borderWidth: 1,
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}M ₽`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(30,30,63,0.5)' },
          ticks: { color: '#94a3b8', font: { size: 11 } }
        },
        y: {
          min: 0,
          max: 6,
          grid: { color: 'rgba(30,30,63,0.5)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 11 },
            callback: v => v + 'M'
          }
        }
      }
    }
  });
}

// ============================================================
// Задача 8.2: Donut-график способов оплаты
// ============================================================

/**
 * Плагин для центрального текста в donut-графике
 */
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    if (chart.config.options.plugins.centerText) {
      const { ctx, chartArea: { width, height, left, top } } = chart;
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      ctx.save();

      // Основной текст
      ctx.font = 'bold 14px Inter, Segoe UI, sans-serif';
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('4 820 000 ₽', centerX, centerY - 8);

      // Подпись
      ctx.font = '11px Inter, Segoe UI, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Всего', centerX, centerY + 10);

      ctx.restore();
    }
  }
};

Chart.register(centerTextPlugin);

/**
 * Инициализирует donut-график способов оплаты
 */
function initPaymentChart() {
  const canvas = document.getElementById('payment-chart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'doughnut',
    data: paymentData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a35',
          borderColor: '#1e1e3f',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
          }
        },
        centerText: true
      }
    }
  });

  // Рендер HTML-легенды
  renderPaymentLegend();
}

/**
 * Рендерит HTML-легенду для графика оплаты
 */
function renderPaymentLegend() {
  const container = document.getElementById('payment-legend');
  if (!container) return;

  const colors = ['#10b981', '#2563eb', '#7c3aed', '#f59e0b'];

  paymentData.labels.forEach((label, i) => {
    const item = document.createElement('div');
    item.className = 'payment-legend-item';
    item.innerHTML = `
      <div class="payment-legend-dot" style="background:${colors[i]}"></div>
      <div class="payment-legend-info">
        <div class="payment-legend-label">${label}</div>
        <div class="payment-legend-value">${paymentData.percentages[i]}%</div>
        <div class="payment-legend-amount">${paymentData.amounts[i]}</div>
      </div>
    `;
    container.appendChild(item);
  });
}

// ============================================================
// Задача 10.1: График среднего чека
// ============================================================

/**
 * Инициализирует line chart среднего чека
 */
function initAvgCheckChart() {
  const canvas = document.getElementById('avg-check-chart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'line',
    data: avgCheckData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a35',
          borderColor: '#1e1e3f',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.parsed.y.toLocaleString('ru-RU')} ₽`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(30,30,63,0.5)' },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(30,30,63,0.5)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 10 },
            callback: v => v.toLocaleString('ru-RU')
          }
        }
      }
    }
  });
}

// ============================================================
// Задача 12.5: График прогноза выручки
// ============================================================

/**
 * Инициализирует line chart прогноза выручки
 */
function initForecastChart() {
  const canvas = document.getElementById('forecast-chart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'line',
    data: forecastData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#94a3b8',
            font: { size: 10 },
            usePointStyle: true,
            boxHeight: 2
          }
        },
        tooltip: {
          backgroundColor: '#1a1a35',
          borderColor: '#1e1e3f',
          borderWidth: 1,
          callbacks: {
            label: ctx => ctx.parsed.y !== null ? ` ${ctx.dataset.label}: ${ctx.parsed.y}M ₽` : ''
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(30,30,63,0.5)' },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(30,30,63,0.5)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 10 },
            callback: v => v + 'M'
          }
        }
      }
    }
  });
}

// ============================================================
// Задача 12.6: График сезонности
// ============================================================

/**
 * Инициализирует multi-line chart сезонности
 */
function initSeasonalityChart() {
  const canvas = document.getElementById('seasonality-chart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'line',
    data: seasonalityData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#94a3b8',
            font: { size: 10 },
            usePointStyle: true,
            boxHeight: 2
          }
        },
        tooltip: {
          backgroundColor: '#1a1a35',
          borderColor: '#1e1e3f',
          borderWidth: 1,
          callbacks: {
            label: ctx => ctx.parsed.y !== null ? ` ${ctx.dataset.label}: ${ctx.parsed.y}M ₽` : ''
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(30,30,63,0.5)' },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(30,30,63,0.5)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 10 },
            callback: v => v + 'M'
          }
        }
      }
    }
  });
}
