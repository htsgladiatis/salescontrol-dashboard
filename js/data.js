/* SalesControl. Сгенерировано: 31.07.2026, 00:14:56 */
const kpiData = [
  {
    "id": "revenue",
    "title": "Выручка за июль",
    "value": "6 819 658 ₽",
    "change": "",
    "trend": "up",
    "color": "#7c3aed",
    "colorAlpha": "rgba(124,58,237,0.15)",
    "icon": "💳",
    "chartData": [
      0.12,
      0.17,
      0.08,
      0.15,
      0,
      0.23,
      0.14,
      0.19,
      0.33,
      0.21,
      0.11,
      0,
      0.25,
      0.06,
      0.21,
      0.21,
      0.27,
      0.24,
      0.07,
      0.23,
      0.29,
      0.24,
      0.3,
      0.54,
      0.46,
      0.14,
      0.56,
      0.5,
      0.19,
      0.34
    ]
  },
  {
    "id": "sales",
    "title": "Отчётов за июль",
    "value": "309",
    "change": "",
    "trend": "up",
    "color": "#2563eb",
    "colorAlpha": "rgba(37,99,235,0.15)",
    "icon": "🛒",
    "chartData": [
      10,
      10,
      6,
      6,
      2,
      11,
      10,
      13,
      16,
      12,
      10,
      1,
      15,
      12,
      13,
      11,
      12,
      6,
      3,
      10,
      13,
      13,
      10,
      13,
      10,
      7,
      15,
      16,
      10,
      13
    ]
  },
  {
    "id": "avgcheck",
    "title": "Средний чек",
    "value": "42 891 ₽",
    "change": "",
    "trend": "up",
    "color": "#10b981",
    "colorAlpha": "rgba(16,185,129,0.15)",
    "icon": "📋",
    "chartData": [
      24880,
      55001,
      39701,
      37750,
      0,
      46861,
      46602,
      37021,
      47358,
      41500,
      22941,
      0,
      50361,
      31302,
      52845,
      42945,
      67702,
      78903,
      32800,
      38384,
      47684,
      26222,
      37526,
      45135,
      65044,
      45002,
      56269,
      49534,
      27287,
      28310
    ]
  }
];

const topManager = {
  "name": "Репина Б.",
  "initials": "РБ",
  "revenue": "1 098 302 ₽",
  "sales": 23,
  "activity": 100,
  "avatarColor": "#7c3aed"
};

const revenueChartData = {
  "labels": [
    "01.07",
    "02.07",
    "03.07",
    "04.07",
    "05.07",
    "06.07",
    "07.07",
    "08.07",
    "09.07",
    "10.07",
    "11.07",
    "12.07",
    "13.07",
    "14.07",
    "15.07",
    "16.07",
    "17.07",
    "18.07",
    "19.07",
    "20.07",
    "21.07",
    "22.07",
    "23.07",
    "24.07",
    "25.07",
    "26.07",
    "27.07",
    "28.07",
    "29.07",
    "30.07"
  ],
  "datasets": [
    {
      "type": "bar",
      "label": "Выручка за день",
      "data": [
        0.12,
        0.17,
        0.08,
        0.15,
        0,
        0.23,
        0.14,
        0.19,
        0.33,
        0.21,
        0.11,
        0,
        0.25,
        0.06,
        0.21,
        0.21,
        0.27,
        0.24,
        0.07,
        0.23,
        0.29,
        0.24,
        0.3,
        0.54,
        0.46,
        0.14,
        0.56,
        0.5,
        0.19,
        0.34
      ],
      "backgroundColor": "rgba(124,58,237,0.55)",
      "borderColor": "rgba(124,58,237,0.95)",
      "borderWidth": 1,
      "borderRadius": 4,
      "maxBarThickness": 26,
      "yAxisID": "y"
    },
    {
      "type": "line",
      "label": "Накопительно",
      "borderColor": "#10b981",
      "backgroundColor": "rgba(16,185,129,0.18)",
      "fill": true,
      "tension": 0.35,
      "pointRadius": 0,
      "borderWidth": 2,
      "yAxisID": "y"
    }
  ]
};

const paymentData = {
  "labels": [
    "Наличные",
    "Безналичные",
    "Кредит/Рассрочка",
    "Инкассация"
  ],
  "percentages": [
    8,
    79,
    3,
    11
  ],
  "amounts": [
    "578 172 ₽",
    "6 016 679 ₽",
    "224 807 ₽",
    "838 371 ₽"
  ],
  "datasets": [
    {
      "data": [
        8,
        79,
        3,
        11
      ],
      "backgroundColor": [
        "#10b981",
        "#2563eb",
        "#7c3aed",
        "#f59e0b"
      ],
      "borderWidth": 0,
      "hoverOffset": 8
    }
  ]
};

const activityData = [
  {
    "time": "21:49:38",
    "type": "success",
    "text": "Продажа",
    "amount": "46 403 ₽",
    "manager": "Седова И."
  },
  {
    "time": "21:44:51",
    "type": "success",
    "text": "Отчёт отправлен",
    "amount": "0 ₽",
    "manager": "Кичева В."
  },
  {
    "time": "21:40:49",
    "type": "success",
    "text": "Продажа",
    "amount": "89 502 ₽",
    "manager": "Репина Б."
  },
  {
    "time": "21:38:31",
    "type": "success",
    "text": "Продажа",
    "amount": "13 500 ₽",
    "manager": "Иванова Т."
  },
  {
    "time": "16:23:20",
    "type": "success",
    "text": "Продажа",
    "amount": "69 602 ₽",
    "manager": "Алейников В."
  },
  {
    "time": "14:53:48",
    "type": "success",
    "text": "Продажа",
    "amount": "1 ₽",
    "manager": "Дашивец П."
  }
];

const avgCheckData = {
  "labels": [
    "01.07",
    "02.07",
    "03.07",
    "04.07",
    "05.07",
    "06.07",
    "07.07",
    "08.07",
    "09.07",
    "10.07",
    "11.07",
    "12.07",
    "13.07",
    "14.07",
    "15.07",
    "16.07",
    "17.07",
    "18.07",
    "19.07",
    "20.07",
    "21.07",
    "22.07",
    "23.07",
    "24.07",
    "25.07",
    "26.07",
    "27.07",
    "28.07",
    "29.07",
    "30.07"
  ],
  "datasets": [
    {
      "label": "Средний чек",
      "data": [
        24880,
        55001,
        39701,
        37750,
        0,
        46861,
        46602,
        37021,
        47358,
        41500,
        22941,
        0,
        50361,
        31302,
        52845,
        42945,
        67702,
        78903,
        32800,
        38384,
        47684,
        26222,
        37526,
        45135,
        65044,
        45002,
        56269,
        49534,
        27287,
        28310
      ],
      "borderColor": "#10b981",
      "backgroundColor": "rgba(16,185,129,0.1)",
      "fill": true,
      "tension": 0.4,
      "pointRadius": 0,
      "borderWidth": 2
    }
  ]
};

const liveSalesData = [
  {
    "terminal": "7222-7978",
    "manager": "Седова И.",
    "city": "Сочи",
    "amount": "46 403 ₽",
    "payment": "💳",
    "receipt": ""
  },
  {
    "terminal": "7222-7978",
    "manager": "Кичева В.",
    "city": "Сочи",
    "amount": "0 ₽",
    "payment": "💵",
    "receipt": ""
  },
  {
    "terminal": "1380-7978",
    "manager": "Репина Б.",
    "city": "Сочи",
    "amount": "89 502 ₽",
    "payment": "💳",
    "receipt": ""
  },
  {
    "terminal": "7222",
    "manager": "Иванова Т.",
    "city": "Сочи",
    "amount": "13 500 ₽",
    "payment": "💳",
    "receipt": ""
  },
  {
    "terminal": "4350",
    "manager": "Алейников В.",
    "city": "Анапа",
    "amount": "69 602 ₽",
    "payment": "💳",
    "receipt": ""
  }
];

const topManagersData = [
  {
    "rank": 1,
    "name": "Репина Б.",
    "revenue": "1 098 302 ₽",
    "progress": 100,
    "color": "#7c3aed"
  },
  {
    "rank": 2,
    "name": "Рупосова Ю.",
    "revenue": "829 515 ₽",
    "progress": 76,
    "color": "#2563eb"
  },
  {
    "rank": 3,
    "name": "Алейников В.",
    "revenue": "725 304 ₽",
    "progress": 66,
    "color": "#10b981"
  },
  {
    "rank": 4,
    "name": "Кичева В.",
    "revenue": "719 316 ₽",
    "progress": 65,
    "color": "#f59e0b"
  },
  {
    "rank": 5,
    "name": "Седова И.",
    "revenue": "547 556 ₽",
    "progress": 50,
    "color": "#ef4444"
  },
  {
    "rank": 6,
    "name": "Дашивец П.",
    "revenue": "469 314 ₽",
    "progress": 43
  },
  {
    "rank": 7,
    "name": "Прохорова А.",
    "revenue": "443 306 ₽",
    "progress": 40
  },
  {
    "rank": 8,
    "name": "Дадилова И.",
    "revenue": "391 514 ₽",
    "progress": 36
  },
  {
    "rank": 9,
    "name": "Иванова Т.",
    "revenue": "337 710 ₽",
    "progress": 31
  },
  {
    "rank": 10,
    "name": "Богданчикова М.",
    "revenue": "319 810 ₽",
    "progress": 29
  },
  {
    "rank": 11,
    "name": "Гнездилова Е.",
    "revenue": "204 000 ₽",
    "progress": 19
  },
  {
    "rank": 12,
    "name": "Нагиева Э.",
    "revenue": "131 604 ₽",
    "progress": 12
  },
  {
    "rank": 13,
    "name": "Шевердина А.",
    "revenue": "130 901 ₽",
    "progress": 12
  },
  {
    "rank": 14,
    "name": "Демиденко А.",
    "revenue": "116 202 ₽",
    "progress": 11
  },
  {
    "rank": 15,
    "name": "Аксененко Е.",
    "revenue": "95 501 ₽",
    "progress": 9
  },
  {
    "rank": 16,
    "name": "Долгина М.",
    "revenue": "88 500 ₽",
    "progress": 8
  },
  {
    "rank": 17,
    "name": "Шпетная А.",
    "revenue": "53 302 ₽",
    "progress": 5
  },
  {
    "rank": 18,
    "name": "Лунга Т.",
    "revenue": "48 700 ₽",
    "progress": 4
  },
  {
    "rank": 19,
    "name": "Кияева Н.",
    "revenue": "27 600 ₽",
    "progress": 3
  },
  {
    "rank": 20,
    "name": "Гузеева Н.",
    "revenue": "24 500 ₽",
    "progress": 2
  },
  {
    "rank": 21,
    "name": "Игнатьева О.",
    "revenue": "17 200 ₽",
    "progress": 2
  },
  {
    "rank": 22,
    "name": "Гаранина Н.",
    "revenue": "1 ₽",
    "progress": 0
  },
  {
    "rank": 23,
    "name": "Переверзев О.",
    "revenue": "0 ₽",
    "progress": 0
  }
];

const citiesData = [
  {
    "name": "Сочи",
    "revenue": 3307395,
    "label": "3,3M"
  },
  {
    "name": "КМВ",
    "revenue": 2015034,
    "label": "2,0M"
  },
  {
    "name": "Анапа",
    "revenue": 572700,
    "label": "573K"
  },
  {
    "name": "Москва",
    "revenue": 533015,
    "label": "533K"
  },
  {
    "name": "Белокуриха",
    "revenue": 391514,
    "label": "392K"
  }
];

const topProductsData = [
  {
    "rank": 1,
    "name": "Neuro",
    "revenue": "2 546 100 ₽",
    "share": 44
  },
  {
    "rank": 2,
    "name": "Step L",
    "revenue": "675 540 ₽",
    "share": 12
  },
  {
    "rank": 3,
    "name": "Derma Pro",
    "revenue": "454 900 ₽",
    "share": 8
  },
  {
    "rank": 4,
    "name": "Kegel",
    "revenue": "422 000 ₽",
    "share": 7
  },
  {
    "rank": 5,
    "name": "Lift",
    "revenue": "372 620 ₽",
    "share": 6
  },
  {
    "rank": 6,
    "name": "Hot & Cold",
    "revenue": "293 100 ₽",
    "share": 5
  },
  {
    "rank": 7,
    "name": "Dent",
    "revenue": "238 000 ₽",
    "share": 4
  },
  {
    "rank": 8,
    "name": "Pneumo",
    "revenue": "159 400 ₽",
    "share": 3
  },
  {
    "rank": 9,
    "name": "Sport mini",
    "revenue": "97 700 ₽",
    "share": 2
  },
  {
    "rank": 10,
    "name": "Recovery",
    "revenue": "82 800 ₽",
    "share": 1
  },
  {
    "rank": 11,
    "name": "Гель контактный",
    "revenue": "71 250 ₽",
    "share": 1
  },
  {
    "rank": 12,
    "name": "Sport",
    "revenue": "59 800 ₽",
    "share": 1
  },
  {
    "rank": 13,
    "name": "Flow",
    "revenue": "55 500 ₽",
    "share": 1
  },
  {
    "rank": 14,
    "name": "Носки",
    "revenue": "42 400 ₽",
    "share": 1
  },
  {
    "rank": 15,
    "name": "Flow mini",
    "revenue": "34 380 ₽",
    "share": 1
  },
  {
    "rank": 16,
    "name": "Step M",
    "revenue": "32 100 ₽",
    "share": 1
  },
  {
    "rank": 17,
    "name": "Shape",
    "revenue": "28 700 ₽",
    "share": 0
  },
  {
    "rank": 18,
    "name": "Перчатки",
    "revenue": "21 144 ₽",
    "share": 0
  },
  {
    "rank": 19,
    "name": "Насадки Dent",
    "revenue": "19 200 ₽",
    "share": 0
  },
  {
    "rank": 20,
    "name": "Орион",
    "revenue": "18 900 ₽",
    "share": 0
  },
  {
    "rank": 21,
    "name": "Электроды силиконовые",
    "revenue": "9 800 ₽",
    "share": 0
  },
  {
    "rank": 22,
    "name": "Электроды хлопковые",
    "revenue": "6 300 ₽",
    "share": 0
  },
  {
    "rank": 23,
    "name": "Зонд ректальный",
    "revenue": "4 900 ₽",
    "share": 0
  },
  {
    "rank": 24,
    "name": "Клипсы электроды",
    "revenue": "83 ₽",
    "share": 0
  }
];

const alertsData = [
  {
    "type": "error",
    "text": "Отсутствуют отчёты",
    "count": 12,
    "icon": "⚠"
  },
  {
    "type": "warning",
    "text": "Расхождение по продажам",
    "count": 5,
    "icon": "⚠"
  },
  {
    "type": "error",
    "text": "Отсутствует фото чека",
    "count": 23,
    "icon": "⚠"
  },
  {
    "type": "warning",
    "text": "Аномально высокий чек",
    "count": 7,
    "icon": ""
  },
  {
    "type": "error",
    "text": "Дублирующиеся транзакции",
    "count": 3,
    "icon": "⚠"
  }
];
