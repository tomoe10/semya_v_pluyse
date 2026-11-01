(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const money = new Intl.NumberFormat("ru-RU");

  const fmt = (value) => money.format(Math.round(value)).replace(/\u00A0/g, " ");
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));

  const members = {
    anna: { name: "Анна", genitive: "Анны", initial: "А", cls: "avatar--anna", role: "Владелец" },
    dmitry: { name: "Дмитрий", genitive: "Дмитрия", initial: "Д", cls: "avatar--dmitry", role: "Совладелец" },
    milana: { name: "Милана", genitive: "Миланы", initial: "М", cls: "avatar--milana", role: "14+" },
    lev: { name: "Лев", genitive: "Льва", initial: "Л", cls: "avatar--lev", role: "Ребёнок" }
  };

  const pageMeta = {
    dashboard: { title: "Обзор семьи", kicker: "Семейный банк" },
    subscriptions: { title: "Подписки семьи", kicker: "Экономия семьи" },
    calendar: { title: "Календарь платежей", kicker: "Платежи и прогноз" },
    pet: { title: "Питомец ВэТэБэШ", kicker: "Семейная привычка" },
    roles: { title: "Роли и контроль", kicker: "Безопасность семьи" },
    goal: { title: "Общая цель", kicker: "Копим вместе" }
  };

  const subscriptions = [
    { id: "yandex-anna", name: "Яндекс Плюс", category: "music", categoryLabel: "Музыка и кино", price: 299, owner: "anna", color: "#FFCC00", text: "#1B1B1B", letter: "Я", duplicate: "yandex", next: "7 ноября", method: "Карта Анны •• 2210", status: "Активна" },
    { id: "yandex-dmitry", name: "Яндекс Плюс", category: "music", categoryLabel: "Музыка и кино", price: 299, owner: "dmitry", color: "#FFCC00", text: "#1B1B1B", letter: "Я", duplicate: "yandex", next: "9 ноября", method: "Карта Дмитрия •• 8843", status: "Активна" },
    { id: "kinopoisk-anna", name: "Кинопоиск", category: "video", categoryLabel: "Кино и сериалы", price: 349, owner: "anna", color: "#F04D23", letter: "К", duplicate: "kinopoisk", next: "7 ноября", method: "Карта Анны •• 2210", status: "Активна" },
    { id: "kinopoisk-dmitry", name: "Кинопоиск", category: "video", categoryLabel: "Кино и сериалы", price: 349, owner: "dmitry", color: "#F04D23", letter: "К", duplicate: "kinopoisk", next: "9 ноября", method: "Карта Дмитрия •• 8843", status: "Активна" },
    { id: "vk-music", name: "VK Музыка", category: "music", categoryLabel: "Музыка", price: 199, owner: "milana", color: "#2B7BE8", letter: "VK", next: "12 ноября", method: "Карта Миланы •• 4417", status: "Активна" },
    { id: "ivi", name: "Иви", category: "video", categoryLabel: "Кино и сериалы", price: 299, owner: "anna", color: "#EA2A5A", letter: "И", next: "14 ноября", method: "Карта Анны •• 2210", status: "Активна" },
    { id: "litres", name: "Литрес", category: "other", categoryLabel: "Книги и аудио", price: 299, owner: "dmitry", color: "#374151", letter: "Л", next: "18 ноября", method: "Карта Дмитрия •• 8843", status: "Активна" },
    { id: "skysmart", name: "Skysmart", category: "kids", categoryLabel: "Обучение детей", price: 990, owner: "lev", color: "#16A874", letter: "S", next: "21 ноября", method: "Семейный счёт", status: "Активна" },
    { id: "netology-kids", name: "Нетология Дети", category: "kids", categoryLabel: "Обучение детей", price: 690, owner: "milana", color: "#6F4BE8", letter: "Н", next: "23 ноября", method: "Карта Анны •• 2210", status: "Активна" },
    { id: "okko-sport", name: "Okko Спорт", category: "video", categoryLabel: "Спорт и кино", price: 399, owner: "dmitry", color: "#111827", letter: "O", next: "28 ноября", method: "Карта Дмитрия •• 8843", status: "Активна" }
  ];

  const duplicateCancellation = { yandex: "yandex-dmitry", kinopoisk: "kinopoisk-dmitry" };

  const payments = [
    { id: "zhkh", day: 3, title: "ЖКХ", amount: 8740, member: "anna", category: "home", icon: "home", status: "Запланирован", note: "Автоплатёж по квитанции за октябрь. Ответственный получит напоминание 1 ноября." },
    { id: "mortgage", day: 5, title: "Ипотека ВТБ", amount: 42300, member: "dmitry", category: "home", icon: "home", status: "Запланирован", note: "Ежемесячный платёж по ипотеке. Подтверждение и чек придут Дмитрию." },
    { id: "subscriptions", day: 7, title: "Подписки семьи", amount: 4172, member: "anna", category: "sub", icon: "repeat", status: "Запланирован", note: "10 сервисов. Два дубля можно отключить и сэкономить 648 ₽ в месяц." },
    { id: "kasko", day: 8, title: "КАСКО", amount: 21376, member: "anna", category: "auto", icon: "shield", status: "Запланирован", note: "Страховая премия. Из-за платежа остаток опустится до 7 972 ₽ — это ниже комфортного запаса." },
    { id: "salary", day: 10, title: "Зарплата", amount: 95000, member: "dmitry", category: "income", icon: "trend-up", kind: "income", status: "Ожидается", note: "Поступление на семейный счёт. Прогноз обновится автоматически." },
    { id: "music-school", day: 12, title: "Музыкальная школа", amount: 6500, member: "anna", category: "kids", icon: "music", status: "Запланирован", note: "Занятия Миланы. Оплата за ноябрь." },
    { id: "osago", day: 15, title: "ОСАГО", amount: 12400, member: "dmitry", category: "auto", icon: "shield", status: "Запланирован", note: "Полис на семейный автомобиль. Продление на 12 месяцев." },
    { id: "tax", day: 20, title: "Налог на имущество", amount: 3800, member: "anna", category: "home", icon: "home", status: "Запланирован", note: "Начисление ФНС. Квитанция уже загружена в семейный архив." },
    { id: "robotics", day: 25, title: "Робототехника", amount: 4900, member: "dmitry", category: "kids", icon: "cap", status: "Запланирован", note: "Кружок Льва. Следующее занятие — 26 ноября." },
    { id: "life-insurance", day: 28, title: "Страхование жизни", amount: 2900, member: "anna", category: "auto", icon: "shield", status: "Запланирован", note: "Ежемесячный взнос по семейному полису." }
  ];

  const state = {
    currentView: "dashboard",
    subFilter: "all",
    openSub: null,
    memberFilter: "all",
    selectedDay: null,
    resolvedGroups: new Set(),
    cancelledSubs: new Set(),
    contributionMember: "anna",
    goalCollected: 156800,
    goalTarget: 240000,
    contributions: { anna: 62000, dmitry: 54800, milana: 28000, lev: 12000 },
    monthlyRate: 12000,
    petXp: 680,
    petLevel: 4,
    petStreak: 12,
    petAsleep: false,
    freeBalance: 84560,
    transferDone: false,
    paid: new Set(),
    holidays: false,
    planConnected: false,
    fraudResolved: null
  };

  const $dialog = $("#appDialog");
  const $dialogTitle = $("#dialogTitle");
  const $dialogKicker = $("#dialogKicker");
  const $dialogIcon = $("#dialogIcon");
  const $dialogContent = $("#dialogContent");
  const $dialogActions = $("#dialogActions");
  const $toastRegion = $("#toastRegion");

  function init() {
    renderSubscriptions();
    renderCalendar();
    renderPaymentFeed();
    renderForecastChart();
    renderGoal();
    updatePet();
    syncRoute(true);
    window.setTimeout(() => runCounters($(".view.is-active")), 80);
  }

  function syncRoute(initial = false) {
    const raw = (window.location.hash || "#dashboard").replace("#", "");
    const view = pageMeta[raw] ? raw : "dashboard";
    if (!pageMeta[raw]) history.replaceState(null, "", "#dashboard");

    if (view !== state.currentView || initial) {
      $$(".view").forEach((section) => {
        const active = section.dataset.view === view;
        section.classList.toggle("is-active", active);
        section.hidden = !active;
      });

      state.currentView = view;
      const meta = pageMeta[view];
      $("#pageTitle").textContent = meta.title;
      $("#pageKicker").textContent = meta.kicker;
      document.title = `${meta.title} — Семья в плюсе · ВТБ`;

      $$("[data-nav]").forEach((item) => {
        const active = item.dataset.nav === view;
        item.classList.toggle("is-active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });

      if ($dialog.open) $dialog.close();
      window.scrollTo({ top: 0, behavior: initial || reducedMotion ? "auto" : "smooth" });
      playViewEntrance(view);
    }
  }

  function playViewEntrance(view) {
    const section = $(`.view[data-view="${view}"]`);
    if (!section) return;
    section.classList.remove("is-entering");
    void section.offsetWidth;
    section.classList.add("is-entering");
    window.setTimeout(() => section.classList.remove("is-entering"), 800);
    runCounters(section);
    if (view === "calendar") window.setTimeout(drawCalendarChart, 80);
  }

  function runCounters(root) {
    if (!root) return;
    $$("[data-counter]", root).forEach((el) => {
      if (el.dataset.counted === "1") return;
      const target = Number(el.dataset.counter || 0);
      if (reducedMotion || !window.anime) {
        el.textContent = fmt(target);
        el.dataset.counted = "1";
        return;
      }
      const proxy = { value: 0 };
      el._counterProxy = proxy;
      window.anime({
        targets: proxy,
        value: target,
        duration: 950,
        easing: "easeOutExpo",
        round: 1,
        update() { el.textContent = fmt(proxy.value); },
        complete() { el.textContent = fmt(target); el.dataset.counted = "1"; el._counterProxy = null; }
      });
    });
  }

  function setCounter(selector, value) {
    const el = $(selector);
    if (!el) return;
    if (el._counterProxy && window.anime) {
      window.anime.remove(el._counterProxy);
      el._counterProxy = null;
    }
    el.dataset.counter = String(value);
    el.dataset.counted = "1";
    el.textContent = fmt(value);
  }

  function renderSubscriptions() {
    const list = $("#subscriptionList");
    if (!list) return;
    const visible = subscriptions.filter((item) => state.subFilter === "all" || item.category === state.subFilter);
    list.innerHTML = visible.map((item) => {
      const owner = members[item.owner];
      const isOpen = state.openSub === item.id;
      const isCancelled = state.cancelledSubs.has(item.id);
      const isDuplicate = Boolean(item.duplicate) && !state.resolvedGroups.has(item.duplicate) && !isCancelled;
      const statusLine = isCancelled
        ? `Отключена · экономия ${fmt(item.price)} ₽/мес`
        : `${esc(item.categoryLabel)} · следующее списание ${esc(item.next)}`;
      return `
        <article class="sub-row ${isDuplicate ? "is-duplicate" : ""} ${isCancelled ? "is-cancelled" : ""} ${isOpen ? "is-open" : ""}" data-sub-row="${item.id}">
          <button class="sub-row__main" type="button" data-sub-toggle="${item.id}" aria-expanded="${isOpen}">
            <span class="sub-logo" style="background:${item.color};color:${item.text || "#fff"}">${esc(item.letter)}</span>
            <span class="sub-row__copy">
              <span class="sub-row__title"><strong>${esc(item.name)}</strong>${isDuplicate ? '<span class="dup-tag">дубль</span>' : ""}${isCancelled ? '<span class="dup-tag dup-tag--cancelled">отключена</span>' : ""}</span>
              <span>${statusLine}</span>
            </span>
            <span class="sub-row__owner"><span class="avatar ${owner.cls} avatar--tiny">${owner.initial}</span>${esc(owner.name)}</span>
            <span class="sub-row__price">${isCancelled ? `<s>${fmt(item.price)} ₽</s><span>отключена</span>` : `${fmt(item.price)} ₽<span>в месяц</span>`}</span>
            <svg class="icon sub-row__chevron" aria-hidden="true"><use href="#i-chevron-down"></use></svg>
          </button>
          <div class="sub-row__details">
            <div class="sub-details-inner">
              <div class="sub-details-body">
                <div><span>Оплачивает</span><strong>${esc(owner.name)}</strong></div>
                <div><span>Способ</span><strong>${esc(item.method)}</strong></div>
                <div><span>Статус</span><strong>${esc(item.status)}</strong></div>
              </div>
              <div class="sub-details-actions">
                <button class="btn btn-tiny btn-ghost" type="button" data-open="subscription-details">Детали</button>
                <button class="btn btn-tiny btn-soft" type="button" data-open="subscription-change">Сменить ответственного</button>
              </div>
            </div>
          </div>
        </article>`;
    }).join("");
  }

  function renderCalendar() {
    const grid = $("#calendarGrid");
    if (!grid) return;
    const offset = 6;
    const daysInMonth = 30;
    const cells = [];
    const eventMap = new Map();
    payments.forEach((payment) => {
      if (!eventMap.has(payment.day)) eventMap.set(payment.day, []);
      eventMap.get(payment.day).push(payment);
    });

    for (let index = 0; index < 42; index += 1) {
      const dayNumber = index - offset + 1;
      const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
      const display = inMonth ? dayNumber : (dayNumber < 1 ? 31 + dayNumber : dayNumber - daysInMonth);
      const weekday = index % 7;
      const isWeekend = weekday >= 5;
      const events = inMonth ? (eventMap.get(dayNumber) || []) : [];
      const hasRisk = dayNumber === 8;
      const hasIncome = dayNumber === 10;
      const selected = state.selectedDay === dayNumber;
      const classes = [
        "calendar-day",
        inMonth ? "" : "is-outside",
        dayNumber === 1 && inMonth ? "is-today" : "",
        isWeekend && inMonth ? "is-weekend" : "",
        hasRisk && inMonth ? "has-risk" : "",
        hasIncome && inMonth ? "has-income" : "",
        inMonth && selected ? "is-selected" : ""
      ].filter(Boolean).join(" ");

      const eventHtml = events.slice(0, 2).map((event) => {
        let cls = "cal-event--" + event.category;
        let label = event.title;
        if (event.kind === "income") cls = "cal-event--income";
        if (event.category === "sub") cls = "cal-event--sub";
        return `<span class="cal-event ${cls}"><span>${esc(label)}</span></span>`;
      }).join("");

      const extra = events.length > 2 ? `<span class="cal-event cal-event--more"><span>+${events.length - 2}</span></span>` : "";
      cells.push(`
        <button class="${classes}" type="button" role="gridcell" ${inMonth ? `data-day="${dayNumber}"` : "disabled"} aria-selected="${selected}" aria-label="${inMonth ? `${dayNumber} ноября, ${events.length} событий` : "Другой месяц"}">
          <span class="calendar-day__num">${display}</span>
          <span class="cal-day-events">${eventHtml}${extra}</span>
        </button>`);
    }
    grid.innerHTML = cells.join("");
  }

  function renderPaymentFeed() {
    const feed = $("#paymentFeed");
    if (!feed) return;
    let items = payments.filter((item) => state.memberFilter === "all" || item.member === state.memberFilter);
    if (state.selectedDay) items = items.filter((item) => item.day === state.selectedDay);
    items.sort((a, b) => a.day - b.day);

    if (!items.length) {
      feed.innerHTML = `<div class="empty-state"><span class="empty-state__icon"><svg class="icon" aria-hidden="true"><use href="#i-calendar"></use></svg></span><strong>На этот день платежей нет</strong><span>Выберите другой день или сбросьте фильтр по ответственного.</span></div>`;
    } else {
      feed.innerHTML = items.map((item) => {
        const owner = members[item.member];
        const isIncome = item.kind === "income";
        const isPaid = state.paid.has(item.id);
        const primaryIcon = item.icon || "card";
        return `
          <article class="feed-item" data-payment-row="${item.id}">
            <button class="feed-item__main" type="button" data-payment-toggle="${item.id}" aria-expanded="false">
              <span class="feed-date ${isIncome ? "is-income" : ""}"><strong>${item.day}</strong><span>ноя</span></span>
              <span class="feed-icon feed-icon--${item.category === "sub" ? "sub" : item.category === "kids" ? "kids" : item.category === "auto" ? "auto" : item.category === "income" ? "income" : "home"}"><svg class="icon" aria-hidden="true"><use href="#i-${primaryIcon}"></use></svg></span>
              <span class="feed-item__copy">
                <strong>${esc(item.title)}${isPaid ? " · оплачено" : ""}</strong>
                <span>${isIncome ? "Поступление" : esc(item.status)} · ${esc(owner.name)}${isPaid ? " · чек в архиве" : ""}</span>
              </span>
              <span class="feed-item__owner"><span class="avatar ${owner.cls} avatar--tiny">${owner.initial}</span></span>
              <span class="feed-item__amount ${isIncome ? "feed-item__amount--income" : ""}">${isIncome ? "+" : ""}${fmt(item.amount)} ₽</span>
              <svg class="icon feed-item__chevron" aria-hidden="true"><use href="#i-chevron-down"></use></svg>
            </button>
            <div class="feed-item__details">
              <div>
                <div class="feed-detail-inner">
                  <p>${esc(item.note)}</p>
                  ${isIncome ? "" : `<button class="btn btn-tiny ${isPaid ? "btn-ghost" : "btn-soft"}" type="button" data-pay="${item.id}" ${isPaid ? "disabled" : ""}>${isPaid ? "Оплачено" : "Оплатить"}</button>`}
                </div>
              </div>
            </div>
          </article>`;
      }).join("");
    }

    const expenses = payments.filter((item) => item.kind !== "income");
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const count = expenses.length;
    const countEl = $("#feedCount");
    const totalEl = $("#feedTotal");
    if (countEl) countEl.textContent = String(state.selectedDay ? expenses.filter((p) => p.day === state.selectedDay).length : count);
    if (totalEl) totalEl.textContent = fmt(total) + " ₽";
  }

  function renderGoal() {
    const collected = state.goalCollected;
    const target = state.goalTarget;
    const percent = Math.min(100, (collected / target) * 100);
    const remaining = Math.max(0, target - collected);
    const forecast = getForecastDate(remaining, state.monthlyRate);
    const delta = Math.round((new Date(2027, 6, 1) - forecast) / 86400000);

    if ($("#goalCollectedHero")) $("#goalCollectedHero").textContent = fmt(collected);
    if ($("#goalRemainingHero")) $("#goalRemainingHero").textContent = fmt(remaining) + " ₽";
    if ($("#goalPercentHero")) $("#goalPercentHero").textContent = Math.round(percent) + "%";
    if ($("#goalForecastHero")) $("#goalForecastHero").textContent = formatDate(forecast);
    const bar = $("#goalBar");
    const marker = $(".goal-progress__marker");
    if (bar) bar.style.width = percent + "%";
    if (marker) marker.style.left = percent + "%";
    const progress = $(".goal-progress");
    if (progress) progress.setAttribute("aria-valuenow", String(Math.round(percent)));

    const memberValues = state.contributions;
    const memberTotal = Object.values(memberValues).reduce((sum, value) => sum + value, 0);
    $$(".contribution-list li").forEach((row) => {
      const id = row.dataset.member;
      const value = memberValues[id] || 0;
      const rowPercent = memberTotal ? (value / memberTotal) * 100 : 0;
      const barEl = $(".contribution-bar span", row);
      const sumEl = $(".contribution-sum strong", row);
      const pctEl = $(".contribution-sum span", row);
      if (barEl) barEl.style.width = rowPercent + "%";
      if (sumEl) sumEl.textContent = fmt(value) + " ₽";
      if (pctEl) pctEl.textContent = rowPercent.toFixed(1).replace(".", ",") + "%";
    });

    if ($("#projectionDate")) $("#projectionDate").textContent = formatDate(forecast);
    if ($("#projectionDelta")) {
      if (delta === 0) $("#projectionDelta").innerHTML = "точно в плановую дату";
      else if (delta > 0) {
        const text = delta > 45 ? `${Math.ceil(delta / 30)} мес. раньше` : `${delta} ${plural(delta, "день", "дня", "дней")} раньше`;
        $("#projectionDelta").innerHTML = `<span class="positive">на ${text}</span> плановой даты`;
      } else {
        const abs = Math.abs(delta);
        const text = abs > 45 ? `${Math.ceil(abs / 30)} мес. позже` : `${abs} ${plural(abs, "день", "дня", "дней")} позже`;
        $("#projectionDelta").innerHTML = `<span class="negative">на ${text}</span> плановой даты`;
      }
    }
    if ($("#monthlyRateValue")) $("#monthlyRateValue").textContent = fmt(state.monthlyRate);
    if ($("#monthlyRate")) $("#monthlyRate").value = String(state.monthlyRate);
    if ($("#projectionHint")) {
      const baseText = state.monthlyRate >= 12000
        ? "Если вся семья сохранит текущий темп, отпуск можно бронировать уже в конце мая."
        : "При меньшем взносе дата сдвигается — это видно сразу, без ручных расчётов.";
      $("#projectionHint").textContent = remaining === 0 ? "Цель уже достигнута — можно бронировать отпуск." : baseText;
    }
  }

  function getForecastDate(remaining, rate) {
    if (remaining <= 0) return new Date(2026, 10, 1);
    const months = remaining / Math.max(rate, 1);
    const date = new Date(2026, 10, 1);
    date.setDate(date.getDate() + Math.round(months * 30.4375));
    return date;
  }

  function formatDate(date) {
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function plural(number, one, few, many) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }

  function updatePet() {
    if ($("#petXpText")) $("#petXpText").textContent = fmt(state.petXp);
    if ($("#petXpBar")) $("#petXpBar").style.width = Math.min(100, state.petXp / 10) + "%";
    if ($("#petToNext")) $("#petToNext").textContent = fmt(Math.max(0, 1000 - state.petXp)) + " XP";
    ["#petLevel", "#petLevelCard"].forEach((selector) => { if ($(selector)) $(selector).textContent = String(state.petLevel); });
    ["#petStreak", "#petStreakCard"].forEach((selector) => { if ($(selector)) $(selector).textContent = String(state.petStreak); });
    $$(".level-dots i").forEach((dot, index) => dot.classList.toggle("is-on", index < state.petLevel));
  }

  function renderForecastChart() {
    const svg = $("#forecastBigChart");
    if (!svg) return;
    const w = 920;
    const h = 270;
    const left = 14;
    const right = 10;
    const top = 16;
    const bottom = 25;
    const maxBalance = 120000;
    const balances = [];
    let balance = state.freeBalance;
    for (let day = 1; day <= 30; day += 1) {
      const dayEvents = payments.filter((p) => p.day === day);
      dayEvents.forEach((p) => {
        balance += p.kind === "income" ? p.amount : -p.amount;
      });
      balances.push({ day, value: balance });
    }
    const x = (day) => left + ((day - 1) / 29) * (w - left - right);
    const y = (value) => h - bottom - (Math.max(0, value) / maxBalance) * (h - top - bottom);
    const line = balances.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.day).toFixed(1)} ${y(point.value).toFixed(1)}`).join(" ");
    const area = `${line} L${x(30)} ${h - bottom} L${x(1)} ${h - bottom} Z`;
    const linePath = $("#bigLinePath");
    const areaPath = $("#bigAreaPath");
    if (linePath) linePath.setAttribute("d", line);
    if (areaPath) areaPath.setAttribute("d", area);
    const grid = $("#chartGrid");
    if (grid) {
      grid.innerHTML = [0, 30000, 60000, 90000, 120000].map((value) => {
        const yy = y(value);
        return `<line x1="${left}" y1="${yy}" x2="${w - right}" y2="${yy}"></line><text x="${left + 3}" y="${yy - 4}">${value === 0 ? "0" : Math.round(value / 1000) + " тыс."}</text>`;
      }).join("");
    }
    const markers = $("#chartMarkers");
    if (markers) {
      const low = balances.find((point) => point.day === 8);
      const salary = balances.find((point) => point.day === 10);
      markers.innerHTML = `
        <circle cx="${x(8)}" cy="${y(low.value)}" r="7" fill="#fff" stroke="#E7A11B" stroke-width="3.5"></circle>
        <rect x="${x(8) - 64}" y="${y(low.value) - 38}" width="126" height="25" rx="7" fill="#FFFBEE" stroke="#F1DFA8"></rect>
        <text x="${x(8) - 57}" y="${y(low.value) - 21}" fill="#8B5A00" font-family="Manrope, sans-serif" font-size="9" font-weight="700">8 ноя · ${fmt(low.value)} ₽</text>
        <circle cx="${x(10)}" cy="${y(salary.value)}" r="6" fill="#0F9F5F" stroke="#fff" stroke-width="3"></circle>
        <text x="${x(10) + 10}" y="${y(salary.value) - 10}" fill="#0F9F5F" font-family="Manrope, sans-serif" font-size="9" font-weight="700">зарплата +95 тыс.</text>
        <circle cx="${x(1)}" cy="${y(balances[0].value)}" r="5" fill="#155EEF" stroke="#fff" stroke-width="3"></circle>`;
    }
    const axis = $("#chartAxis");
    if (axis) {
      axis.innerHTML = [1, 3, 5, 8, 10, 12, 15, 20, 25, 30].map((day) => `<span>${day} ноя</span>`).join("");
    }
  }

  function drawCalendarChart() {
    if (reducedMotion || !window.anime) return;
    const path = $("#bigLinePath");
    if (!path) return;
    window.anime({
      targets: path,
      strokeDashoffset: [window.anime.setDashoffset, 0],
      duration: 1200,
      easing: "easeInOutQuart"
    });
  }

  // Expose internal helpers to the event module below.
  window.FamilyPlus = { state, subscriptions, payments, members, fmt, esc, $, $$, init, renderSubscriptions, renderCalendar, renderPaymentFeed, renderGoal, updatePet, renderForecastChart, drawCalendarChart, runCounters, setCounter, syncRoute, formatDate, plural, getForecastDate, duplicateCancellation };
})();

(() => {
  "use strict";

  const F = window.FamilyPlus;
  if (!F) return;

  const { state, subscriptions, payments, members, fmt, esc, $, $$, plural, duplicateCancellation } = F;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dialog = $("#appDialog");
  const dialogTitle = $("#dialogTitle");
  const dialogKicker = $("#dialogKicker");
  const dialogIcon = $("#dialogIcon");
  const dialogContent = $("#dialogContent");
  const dialogActions = $("#dialogActions");
  const toastRegion = $("#toastRegion");
  const confettiLayer = $("#confettiLayer");

  const searchIndex = [
    { view: "dashboard", title: "Обзор семьи", desc: "Баланс, прогноз до зарплаты, события семьи", icon: "i-grid" },
    { view: "subscriptions", title: "Подписки семьи", desc: "Дубли, потери и семейный тариф", icon: "i-repeat" },
    { view: "calendar", title: "Календарь платежей", desc: "Ответственные и прогноз остатка", icon: "i-calendar" },
    { view: "pet", title: "Питомец ВэТэБэШ", desc: "Уровень, серия и задания недели", icon: "i-paw" },
    { view: "roles", title: "Роли и контроль", desc: "Доступы, лимиты и антифрод", icon: "i-shield" },
    { view: "goal", title: "Общая цель", desc: "Отпуск в Сочи и вклад каждого", icon: "i-target" }
  ];

  function svgIcon(id) {
    return `<svg class="icon" aria-hidden="true"><use href="#${id}"></use></svg>`;
  }

  function showDialog({ title, kicker = "ВТБ · Семья в плюсе", icon = "i-sparkles", tone = "", body = "", actions = "" }) {
    dialogTitle.textContent = title;
    dialogKicker.textContent = kicker;
    dialogIcon.className = "dialog__icon" + (tone ? " dialog__icon--" + tone : "");
    dialogIcon.innerHTML = svgIcon(icon);
    dialogContent.innerHTML = body;
    dialogActions.innerHTML = actions;
    if (dialog.open) dialog.close();
    dialog.showModal();
    const panel = $(".dialog__panel", dialog);
    if (panel) panel.scrollTop = 0;
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  function toast(title, message = "", tone = "success") {
    if (!toastRegion) return;
    const icon = tone === "danger" ? "i-alert" : tone === "warning" ? "i-alert" : "i-check";
    const el = document.createElement("div");
    el.className = `toast toast--${tone}`;
    el.innerHTML = `<span class="toast__icon">${svgIcon(icon)}</span><div><strong>${esc(title)}</strong>${message ? `<span>${esc(message)}</span>` : ""}</div>`;
    toastRegion.appendChild(el);
    while (toastRegion.children.length > 3) toastRegion.firstElementChild.remove();
    window.setTimeout(() => {
      el.classList.add("is-out");
      window.setTimeout(() => el.remove(), 320);
    }, 4200);
  }

  function confetti(amount = 48) {
    if (reducedMotion || !confettiLayer) return;
    const colors = ["#155EEF", "#2CBDF0", "#7DE7FF", "#0F9F5F", "#FFD270", "#FFB7C8"];
    for (let index = 0; index < amount; index += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = 38 + Math.random() * 44 + "%";
      piece.style.top = 12 + Math.random() * 18 + "%";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty("--drift", (Math.random() - 0.5) * 330 + "px");
      piece.style.setProperty("--rotate", 260 + Math.random() * 700 + "deg");
      piece.style.animationDelay = Math.random() * 0.22 + "s";
      if (Math.random() > 0.55) piece.style.width = "5px";
      confettiLayer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 2300);
    }
  }

  function addXP(amount, label, element = null) {
    if (element && element.classList.contains("is-claimed")) {
      toast("Уже учтено", "Это действие уже принесло опыт сегодня.", "warning");
      return;
    }
    if (state.petAsleep) wakePet(true);
    state.petXp += amount;
    let leveledUp = false;
    while (state.petXp >= 1000 && state.petLevel < 10) {
      state.petXp -= 1000;
      state.petLevel += 1;
      leveledUp = true;
    }
    if (state.petLevel >= 10) state.petXp = Math.min(state.petXp, 1000);
    F.updatePet();
    const stage = $("#petStage");
    if (stage && !reducedMotion) {
      stage.classList.remove("is-happy");
      void stage.offsetWidth;
      stage.classList.add("is-happy");
      window.setTimeout(() => stage.classList.remove("is-happy"), 1800);
    }
    if (element) element.classList.add("is-claimed");
    if (leveledUp) {
      toast("ВэТэБэШ вырос!", `Новый уровень ${state.petLevel}. Бонус семьи увеличен.`);
      confetti(70);
    } else {
      toast("Опыт начислен", `+${amount} XP · ${label}`);
    }
  }

  function sleepPet() {
    if (state.petAsleep) {
      toast("Питомец уже спит", "Первое полезное действие вернёт его и серию.", "warning");
      return;
    }
    state.petAsleep = true;
    const stage = $("#petStage");
    if (stage) stage.classList.add("is-asleep");
    const wake = $("#wakePet");
    if (wake) wake.hidden = false;
    toast("Неделя пропущена", "ВэТэБэШ заснул, но серия не сгорела. Разбудите его добрым делом.", "warning");
  }

  function wakePet(silent = false) {
    if (!state.petAsleep) return;
    state.petAsleep = false;
    const stage = $("#petStage");
    if (stage) stage.classList.remove("is-asleep");
    const wake = $("#wakePet");
    if (wake) wake.hidden = true;
    if (!silent) toast("ВэТэБэШ проснулся", "Серия 12 дней сохранена. Первое полезное действие засчитано.");
  }

  function resolveFraud(decision) {
    const card = $("#fraudAlert");
    if (!card || state.fraudResolved) {
      toast("Решение уже принято", "Операция обработана.", "warning");
      return;
    }
    state.fraudResolved = decision;
    card.classList.add("is-resolved");
    const rejected = decision === "reject";
    const title = $("h2", card);
    const text = $(".fraud-alert__main > p", card);
    const risk = $(".risk-badge", card);
    const meta = $(".fraud-meta", card);
    const actions = $(".fraud-alert__actions", card);
    if (title) title.textContent = rejected ? "Перевод отклонён — Милана в безопасности" : "Перевод подтверждён родителем";
    if (text) text.textContent = rejected
      ? "Деньги не поступили на карту. Случай передан в антифрод-мониторинг, Милана и родители получили уведомление."
      : "Родитель подтвердил операцию после проверки отправителя. Запись добавлена в журнал доступа.";
    if (risk) {
      risk.className = "status-chip status-chip--success";
      risk.innerHTML = "<span></span> Проверено";
    }
    if (meta) meta.innerHTML = `<span>${svgIcon("i-shield")} Решение родителя · 12:44</span><span>Карта •• 4417</span><span>${svgIcon("i-clock")} Сохранено в журнале</span>`;
    if (actions) actions.innerHTML = `<span class="status-chip status-chip--success"><span></span> ${rejected ? "Операция отклонена" : "Операция подтверждена"}</span><button class="text-link" type="button" data-open="fraud-details">Детали операции</button>`;
    toast(rejected ? "Операция приостановлена" : "Перевод подтверждён", rejected ? "Перевод отклонён, родитель уведомлён. Деньги остались на счёте." : "Отправитель проверен. Запись добавлена в журнал.", rejected ? "warning" : "success");
  }

  function applyTransfer() {
    if (state.transferDone) {
      toast("Перевод уже запланирован", "15 000 ₽ поступят на расчётный счёт 2 ноября.", "warning");
      return;
    }
    state.transferDone = true;
    state.freeBalance += 15000;
    F.renderForecastChart();
    window.setTimeout(F.drawCalendarChart, 40);
    const newMin = 22972;
    F.setCounter("#view-calendar .cashflow-amount [data-counter]", newMin);
    F.setCounter("#view-dashboard .forecast-amount [data-counter]", newMin);
    const dashChip = $("#view-dashboard .forecast-card .status-chip");
    if (dashChip) {
      dashChip.className = "status-chip status-chip--success";
      dashChip.innerHTML = "<span></span> Запас";
    }
    const dashTitle = $("#view-dashboard .forecast-card h2");
    if (dashTitle) dashTitle.textContent = "До зарплаты хватит";
    const calendarAmount = $("#view-calendar .cashflow-amount > span");
    if (calendarAmount) calendarAmount.textContent = "минимум 8 ноября после перевода";
    const notice = $("#view-dashboard .payments-card__notice");
    if (notice) {
      notice.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg><p><strong>Перевод запланирован.</strong> Запас до зарплаты — 22 972 ₽. Риск кассового разрыва снят.</p>`;
    }
    const insight = $("#cashflowInsight");
    if (insight) {
      insight.classList.add("is-resolved");
      insight.innerHTML = `<span class="cashflow-insight__icon">${svgIcon("i-check")}</span><div><strong>Разрыв закрыт заранее</strong><p>15 000 ₽ переведены из накоплений. Минимальный остаток 8 ноября — 22 972 ₽, выше комфортного запаса.</p></div>`;
    }
    const riskNote = $("#view-calendar .chart-risk-note");
    if (riskNote) riskNote.innerHTML = `<span class="pulse-dot"></span><strong>8 ноября</strong> запас 22 972 ₽ — риск снят`;
    const tooltip = $("#view-dashboard .chart-tooltip");
    if (tooltip) tooltip.textContent = "8 ноя · 22 972 ₽";
    const savings = $("#view-dashboard .hero-bottom-stat strong");
    if (savings) savings.textContent = "85 000 ₽";
    closeDialog();
    toast("Перевод запланирован", "15 000 ₽ из накоплений поступят 2 ноября. Прогноз обновлён.");
    confetti(24);
  }

  function updateDuplicateUI(group) {
    const savedByGroup = { yandex: 3588, kinopoisk: 4188 };
    const card = document.querySelector(`[data-dup-group="${group}"]`);
    if (card) {
      card.classList.add("is-resolved");
      const button = $(".btn", card);
      if (button) {
        button.textContent = "Дубль отключён";
        button.disabled = true;
      }
      const note = $(".duplicate-group__copy small", card);
      if (note) note.innerHTML = `${svgIcon("i-check")} Экономия уже в бюджете семьи`;
    }
    const resolvedSavings = Array.from(state.resolvedGroups).reduce((sum, key) => sum + (savedByGroup[key] || 0), 0);
    const remaining = Math.max(0, 7776 - resolvedSavings);
    const groupsLeft = Math.max(0, 2 - state.resolvedGroups.size);
    F.setCounter("#dupCount", groupsLeft);
    F.setCounter("#dupSaving", groupsLeft === 0 ? 7776 : remaining);
    const countLabel = $("#dupCountLabel");
    if (countLabel) countLabel.textContent = plural(groupsLeft, "группа", "группы", "групп");
    const savingLabel = $("#dupSavingLabel");
    if (savingLabel) savingLabel.textContent = groupsLeft === 0 ? "Сэкономлено" : "Можно сэкономить";
    const savingHint = $("#dupSavingHint");
    if (savingHint) savingHint.textContent = groupsLeft === 0 ? "экономия уже в бюджете" : "за год · 648 ₽/мес";
    const title = $("#duplicateTitle");
    if (title && groupsLeft === 0) title.textContent = "Дубли устранены — семья экономит";
    const pill = $("#duplicatePanel .saving-pill");
    if (pill) pill.textContent = groupsLeft === 0 ? "−7 776 ₽ / год" : `−${fmt(remaining)} ₽ / год`;
    const footSpan = $("#duplicatePanel .duplicate-panel__foot > span");
    if (footSpan && groupsLeft === 0) footSpan.innerHTML = `${svgIcon("i-check")} Все дубли отключены. Экономия 7 776 ₽ в год уже учтена в семейном бюджете.`;
    F.renderSubscriptions();
    updateSubscriptionTotals();
  }

  function updateSubscriptionTotals() {
    const active = subscriptions.filter((item) => !state.cancelledSubs.has(item.id));
    const total = active.reduce((sum, item) => sum + item.price, 0);
    F.setCounter("#subCount", active.length);
    F.setCounter("#subMonthlyTotal", total);
    const annual = $("#subAnnualTotal");
    if (annual) annual.textContent = `≈ ${fmt(total * 12)} ₽ в год`;
    const title = $("#subsListTitle");
    if (title) {
      title.textContent = active.length === subscriptions.length
        ? subscriptions.length + " подписок"
        : active.length + " активных · " + subscriptions.length + " всего";
    }
    const filterCount = $('[data-sub-filter="all"] span');
    if (filterCount) filterCount.textContent = String(subscriptions.length);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Ссылка скопирована", "Отправьте её участнику семьи. Ссылка действует 7 дней.");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy"); toast("Ссылка скопирована", "Отправьте её участнику семьи."); }
      catch (fallbackError) { toast("Не удалось скопировать", "Выделите ссылку вручную.", "warning"); }
      area.remove();
    }
  }

  function navigateTo(view) {
    closeDialog();
    window.location.hash = view;
  }

  function applyGoalSettings() {
    const targetInput = $("#goalTargetInput");
    const rateInput = $("#goalRateInput");
    const target = Number(targetInput?.value);
    const rate = Number(rateInput?.value);
    if (!Number.isFinite(target) || target < state.goalCollected || target < 10000) {
      toast("Проверьте сумму цели", "Цель не может быть меньше уже собранной суммы.", "warning");
      return;
    }
    if (!Number.isFinite(rate) || rate < 1000 || rate > 100000) {
      toast("Проверьте взнос", "Ежемесячный взнос должен быть от 1 000 до 100 000 ₽.", "warning");
      return;
    }
    state.goalTarget = target;
    state.monthlyRate = rate;
    F.renderGoal();
    closeDialog();
    toast("Цель обновлена", `Новая цель — ${fmt(target)} ₽. Дата пересчитана автоматически.`);
  }

  function startHolidays() {
    const days = Number($("#holidayDays")?.value || 7);
    state.holidays = true;
    closeDialog();
    toast("Каникулы активны", `${days} дней без потери серии. Прогресс семьи сохранён.`, "warning");
    const buttons = $$('[data-open="holidays"]');
    buttons.forEach((button) => {
      if (button.classList.contains("btn")) button.innerHTML = `${svgIcon("i-sun")} Каникулы активны`;
    });
  }

  function submitContribution() {
    const input = $("#contributionAmount");
    const amount = Number(input?.value);
    const memberId = state.contributionMember || "anna";
    if (!Number.isFinite(amount) || amount < 100) {
      toast("Минимальный вклад — 100 ₽", "Введите сумму больше или равную 100 ₽.", "warning");
      input?.focus();
      return;
    }
    if (state.goalCollected >= state.goalTarget) {
      toast("Цель уже достигнута", "Можно создать новую цель или увеличить текущую.", "warning");
      return;
    }
    const actual = Math.min(amount, state.goalTarget - state.goalCollected);
    state.goalCollected += actual;
    state.contributions[memberId] += actual;
    F.renderGoal();
    closeDialog();
    toast("Вклад принят", `${fmt(actual)} ₽ от ${members[memberId].genitive} · цель пересчитана.`);
    confetti(42);
    addXP(40, "Цель пополнена");
  }

  function submitPayment() {
    const title = $("#paymentTitle")?.value.trim();
    const amount = Number($("#paymentAmount")?.value);
    const day = Number($("#paymentDay")?.value);
    const memberId = $("#paymentMember")?.value || "anna";
    if (!title || title.length < 2) {
      toast("Введите название", "Название платежа должно содержать хотя бы 2 символа.", "warning");
      return;
    }
    if (!Number.isFinite(amount) || amount < 50) {
      toast("Проверьте сумму", "Сумма платежа должна быть не меньше 50 ₽.", "warning");
      return;
    }
    payments.push({
      id: "custom-" + Date.now(),
      day: Math.min(30, Math.max(1, day)),
      title,
      amount,
      member: memberId,
      category: "home",
      icon: "card",
      status: "Запланирован",
      note: "Добавлено вручную в семейный календарь. Напоминание получат все участники."
    });
    F.renderCalendar();
    F.renderPaymentFeed();
    F.renderForecastChart();
    closeDialog();
    toast("Платёж добавлен", `${esc(title)} · ${fmt(amount)} ₽ · ответственный — ${members[memberId].name}.`);
  }

  function submitSubscription() {
    const name = $("#subName")?.value.trim();
    const price = Number($("#subPrice")?.value);
    const category = $("#subCategory")?.value || "other";
    const ownerId = $("#subOwner")?.value || "anna";
    if (!name || name.length < 2 || !Number.isFinite(price) || price < 1) {
      toast("Заполните поля", "Нужны название и корректная цена подписки.", "warning");
      return;
    }
    subscriptions.push({
      id: "custom-sub-" + Date.now(),
      name,
      category,
      categoryLabel: category === "video" ? "Кино и сериалы" : category === "music" ? "Музыка" : category === "kids" ? "Детям" : "Другое",
      price,
      owner: ownerId,
      color: "#155EEF",
      letter: name.slice(0, 1).toUpperCase(),
      next: "1 декабря",
      method: "Семейный счёт",
      status: "Активна"
    });
    updateSubscriptionTotals();
    F.renderSubscriptions();
    closeDialog();
    toast("Подписка добавлена", `${esc(name)} · ${fmt(price)} ₽/мес.`);
  }

  function changeSubscriptionOwner() {
    const sub = subscriptions.find((item) => item.id === state.selectedSubscriptionId);
    if (!sub) return;
    const ownerId = state.subscriptionOwner || sub.owner;
    sub.owner = ownerId;
    F.renderSubscriptions();
    closeDialog();
    toast("Ответственный изменён", `${esc(sub.name)} теперь оплачивает ${members[ownerId].name}.`);
  }

  function openModal(name) {
    switch (name) {
      case "invite":
        showDialog({
          title: "Пригласить в семью",
          kicker: "Семейный доступ",
          icon: "i-users",
          body: `
            <div class="dialog-hero"><span class="dialog-hero__icon">${svgIcon("i-users")}</span><div><strong>Семья Петровых</strong><span>4 из 6 участников · свободно 2 места</span></div></div>
            <p style="margin-top:12px">Участник получит доступ к общему счёту, целям и календарю. Роль и лимиты можно изменить в любой момент.</p>
            <div class="form-field" style="margin-top:13px"><label for="inviteLink">Ссылка-приглашение</label><input id="inviteLink" readonly value="https://vtb.ru/family/petrov?invite=7F2K-9M4A" /></div>
            <div class="notice-box">${svgIcon("i-shield")} Ссылка действует 7 дней. Приглашённый проходит подтверждение личности и принимает условия 152-ФЗ.</div>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Закрыть</button><button class="btn btn-primary" type="button" data-action="copy-invite">Скопировать ссылку</button>`
        });
        break;

      case "contribute":
        showDialog({
          title: "Пополнить общую цель",
          kicker: "Отпуск в Сочи · июль 2027",
          icon: "i-target",
          body: `
            <div class="dialog-hero"><span class="dialog-hero__icon">${svgIcon("i-target")}</span><div><strong>${fmt(state.goalCollected)} ₽ из ${fmt(state.goalTarget)} ₽</strong><span>Осталось собрать ${fmt(Math.max(0, state.goalTarget - state.goalCollected))} ₽</span></div><span class="goal-percent">${Math.round(state.goalCollected / state.goalTarget * 100)}%</span></div>
            <div class="form-grid">
              <div class="form-field form-field--full"><label for="contributionAmount">Сумма вклада, ₽</label><input id="contributionAmount" type="number" min="100" max="100000" step="100" value="3000" inputmode="numeric" /><div class="amount-presets">${[500, 1000, 3000, 5000].map((value) => `<button class="amount-preset" type="button" data-amount="${value}">${fmt(value)} ₽</button>`).join("")}</div></div>
              <div class="form-field form-field--full"><label>Кто вносит</label><div class="member-picker" id="contributionMembers">${Object.entries(members).map(([id, member]) => `<button class="member-pick ${state.contributionMember === id ? "is-active" : ""}" type="button" data-member-pick="${id}"><span class="avatar ${member.cls}">${member.initial}</span><span>${member.name}</span></button>`).join("")}</div></div>
            </div>
            <p class="legal-note">Вклад сразу отразится в общей цели и пересчитает прогноз даты. Деньги списываются с карты выбранного участника после подтверждения.</p>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Отмена</button><button class="btn btn-primary" type="button" data-action="submit-contribution">${svgIcon("i-plus")} Внести вклад</button>`
        });
        break;

      case "family-plan":
        showDialog({
          title: "Семейный тариф ВТБ",
          kicker: "Один пакет вместо зоопарка",
          icon: "i-sparkles",
          body: `
            <div class="plan-preview"><span class="plan-preview__logo">ВТБ</span><div><strong>Семейный</strong><span>4 профиля · музыка, кино, книги</span></div><strong>399<small> ₽/мес</small></strong></div>
            <div class="dialog-summary"><div class="dialog-summary__row"><span>Сейчас 10 подписок</span><strong>4 172 ₽/мес</strong></div><div class="dialog-summary__row"><span>Дубли, которые отключим</span><strong>−648 ₽/мес</strong></div><div class="dialog-summary__row"><span>Семейный пакет ВТБ</span><strong>399 ₽/мес</strong></div><div class="dialog-summary__row dialog-summary__row--total"><span>Экономия на дублях</span><strong>7 776 ₽/год</strong></div></div>
            <ul class="benefit-list"><li>${svgIcon("i-check")} Музыка, кино и книги для всех четырёх участников</li><li>${svgIcon("i-check")} Детский режим и лимиты для Миланы и Льва</li><li>${svgIcon("i-check")} Один счёт и прозрачная история платежей</li><li>${svgIcon("i-check")} Отключение дублей без потери доступа к сервисам</li></ul>
            <div class="notice-box">${svgIcon("i-info")} Образовательные сервисы Skysmart и Нетология остаются отдельно — это осознанный выбор родителей.</div>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Не сейчас</button><button class="btn btn-primary" type="button" data-action="connect-plan">${svgIcon("i-sparkles")} Подключить за 399 ₽</button>`
        });
        break;

      case "transfer":
        showDialog({
          title: "Перевести из накоплений",
          kicker: "Закрываем кассовый разрыв",
          icon: "i-shield",
          body: `
            <div class="dialog-hero"><span class="dialog-hero__icon">${svgIcon("i-shield")}</span><div><strong>15 000 ₽ на расчётный счёт</strong><span>Накопления: 100 000 ₽ · комфортный запас сохранится</span></div></div>
            <div class="dialog-summary"><div class="dialog-summary__row"><span>Остаток до зарплаты сейчас</span><strong>7 972 ₽</strong></div><div class="dialog-summary__row"><span>После перевода</span><strong>22 972 ₽</strong></div><div class="dialog-summary__row"><span>Дата зачисления</span><strong>2 ноября</strong></div><div class="dialog-summary__row dialog-summary__row--total"><span>Риск разрыва</span><strong>снят</strong></div></div>
            <p class="legal-note">Перевод между собственными счетами внутри ВТБ — без комиссии. Средства остаются в семье, меняется только их назначение.</p>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Отмена</button><button class="btn btn-primary" type="button" data-action="transfer">Перевести 15 000 ₽</button>`
        });
        break;

      case "add-payment":
        showDialog({
          title: "Новый платёж",
          kicker: "Единый календарь",
          icon: "i-calendar",
          body: `
            <div class="form-grid">
              <div class="form-field form-field--full"><label for="paymentTitle">Название</label><input id="paymentTitle" type="text" maxlength="40" value="Секция плавания" /></div>
              <div class="form-field"><label for="paymentAmount">Сумма, ₽</label><input id="paymentAmount" type="number" min="50" step="50" value="3500" /></div>
              <div class="form-field"><label for="paymentDay">Дата, ноябрь</label><select id="paymentDay">${Array.from({ length: 30 }, (_, index) => index + 1).map((day) => `<option value="${day}" ${day === 9 ? "selected" : ""}>${day} ноября</option>`).join("")}</select></div>
              <div class="form-field form-field--full"><label for="paymentMember">Ответственный</label><select id="paymentMember">${Object.entries(members).map(([id, member]) => `<option value="${id}" ${id === "anna" ? "selected" : ""}>${member.name} · ${member.role}</option>`).join("")}</select></div>
            </div>
            <p class="legal-note">Напоминание придёт ответственному за 2 дня и в день списания. Платёж появится в прогнозе остатка.</p>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Отмена</button><button class="btn btn-primary" type="button" data-action="submit-payment">${svgIcon("i-plus")} Добавить в календарь</button>`
        });
        break;

      case "duplicate-yandex":
        openDuplicateModal("yandex");
        break;
      case "duplicate-kinopoisk":
        openDuplicateModal("kinopoisk");
        break;

      case "subscription-add":
        showDialog({
          title: "Добавить подписку",
          kicker: "Все подписки семьи",
          icon: "i-plus",
          body: `
            <div class="form-grid">
              <div class="form-field form-field--full"><label for="subName">Название сервиса</label><input id="subName" type="text" maxlength="36" placeholder="Например, Wink" /></div>
              <div class="form-field"><label for="subPrice">Цена, ₽/мес</label><input id="subPrice" type="number" min="1" step="1" value="299" /></div>
              <div class="form-field"><label for="subCategory">Категория</label><select id="subCategory"><option value="video">Кино</option><option value="music">Музыка</option><option value="kids">Детям</option><option value="other">Другое</option></select></div>
              <div class="form-field form-field--full"><label for="subOwner">Оплачивает</label><select id="subOwner">${Object.entries(members).map(([id, member]) => `<option value="${id}">${member.name}</option>`).join("")}</select></div>
            </div>
            <div class="notice-box">${svgIcon("i-sparkles")} После добавления проверим совпадения с уже подключёнными сервисами.</div>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Отмена</button><button class="btn btn-primary" type="button" data-action="submit-subscription">Добавить</button>`
        });
        break;

      case "subscription-import":
        showDialog({
          title: "Импорт из почты",
          kicker: "Без доступа к паролям",
          icon: "i-download",
          body: `<p>Мы можем найти подтверждения подписок в почте и добавить их на экран. Пароли и содержимое писем не передаются — используются только название сервиса, сумма и дата списания.</p><div class="notice-box">${svgIcon("i-shield")} В прототипе импорт не подключён: функция показана как часть продуктового сценария.</div>`,
          actions: `<button class="btn btn-primary" type="button" data-dialog-close>Понятно</button>`
        });
        break;

      case "subscription-details":
      case "subscription-change": {
        const sub = subscriptions.find((item) => item.id === state.selectedSubscriptionId) || subscriptions[0];
        const changeMode = name === "subscription-change";
        showDialog({
          title: changeMode ? "Сменить ответственного" : esc(sub.name),
          kicker: changeMode ? "Подписка семьи" : "Детали подписки",
          icon: changeMode ? "i-users" : "i-repeat",
          body: changeMode
            ? `<p>Кто будет оплачивать подписку «${esc(sub.name)}»?</p><div class="member-picker" id="subOwnerPicker">${Object.entries(members).map(([id, member]) => `<button class="member-pick ${sub.owner === id ? "is-active" : ""}" type="button" data-sub-owner="${id}"><span class="avatar ${member.cls}">${member.initial}</span><span>${member.name}</span></button>`).join("")}</div>`
            : `<div class="dialog-hero"><span class="dialog-hero__icon">${svgIcon("i-repeat")}</span><div><strong>${esc(sub.name)}</strong><span>${esc(sub.categoryLabel)} · ${fmt(sub.price)} ₽/мес</span></div></div><div class="dialog-summary"><div class="dialog-summary__row"><span>Оплачивает</span><strong>${members[sub.owner].name}</strong></div><div class="dialog-summary__row"><span>Следующее списание</span><strong>${esc(sub.next)}</strong></div><div class="dialog-summary__row"><span>Способ оплаты</span><strong>${esc(sub.method)}</strong></div><div class="dialog-summary__row"><span>Статус</span><strong>${esc(sub.status)}</strong></div></div><div class="notice-box">${svgIcon("i-shield")} Отключение произойдёт только после подтверждения владельца. Доступ сохранится до конца оплаченного периода.</div>`,
          actions: changeMode
            ? `<button class="btn btn-ghost" type="button" data-dialog-close>Отмена</button><button class="btn btn-primary" type="button" data-action="change-sub-owner">Сохранить</button>`
            : `<button class="btn btn-ghost" type="button" data-dialog-close>Закрыть</button><button class="btn btn-soft" type="button" data-open="subscription-change">Сменить ответственного</button>`
        });
        break;
      }

      case "profile":
        showDialog({
          title: "Анна Петрова",
          kicker: "Владелец семьи",
          icon: "i-shield",
          body: `
            <div class="dialog-hero"><span class="avatar avatar--anna avatar--lg">А</span><div><strong>Анна Петрова</strong><span>+7 999 •••-42-18 · анна@example.ru</span></div></div>
            <div class="dialog-summary"><div class="dialog-summary__row"><span>Роль</span><strong>Владелец семейного счёта</strong></div><div class="dialog-summary__row"><span>Участники</span><strong>4 из 6</strong></div><div class="dialog-summary__row"><span>Вход</span><strong>Биометрия + ВТБ Онлайн</strong></div><div class="dialog-summary__row"><span>Согласие 152-ФЗ</span><strong>Активно</strong></div></div>
            <div class="notice-box">${svgIcon("i-shield")} Чувствительные действия подтверждаются биометрией. История доступов хранится 12 месяцев.</div>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Закрыть</button><button class="btn btn-primary" type="button" data-open="access-log">Журнал доступа</button>`
        });
        break;

      case "notifications":
        showDialog({
          title: "Уведомления",
          kicker: "2 новых события",
          icon: "i-bell",
          body: `
            <div class="notif-list">
              <div class="notif-item"><span class="notif-item__icon notif-item__icon--warning">${svgIcon("i-shield")}</span><div><strong>Подозрительный перевод</strong><span>Милане пытаются перевести 12 500 ₽ от нового отправителя. Операция приостановлена.</span><small>Сегодня, 12:42</small></div></div>
              <div class="notif-item"><span class="notif-item__icon notif-item__icon--success">${svgIcon("i-paw")}</span><div><strong>Серия 12 дней</strong><span>ВэТэБэШ получил +40 XP за пополнение цели. Семья в топе недели.</span><small>Сегодня, 09:15</small></div></div>
              <div class="notif-item"><span class="notif-item__icon notif-item__icon--blue">${svgIcon("i-calendar")}</span><div><strong>Платёж через 2 дня</strong><span>5 ноября спишется ипотека 42 300 ₽. Ответственный — Дмитрий.</span><small>Вчера, 18:00</small></div></div>
              <div class="notif-item"><span class="notif-item__icon notif-item__icon--blue">${svgIcon("i-sparkles")}</span><div><strong>Найдены дубли подписок</strong><span>Можно сэкономить 7 776 ₽ в год. Проверьте предложение семейного тарифа.</span><small>Вчера, 10:20</small></div></div>
            </div>`,
          actions: `<button class="btn btn-ghost" type="button" data-action="mark-read">Отметить прочитанным</button><button class="btn btn-primary" type="button" data-dialog-close>Готово</button>`
        });
        break;

      case "search":
        showDialog({
          title: "Поиск по семье",
          kicker: "Быстрый переход",
          icon: "i-search",
          body: `<div class="search-field">${svgIcon("i-search")}<input id="globalSearch" type="search" placeholder="Платежи, подписки, цель, питомец…" autocomplete="off" /></div><div class="search-results" id="searchResults">${searchResultsHtml("")}</div>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Закрыть</button>`
        });
        window.setTimeout(() => $("#globalSearch")?.focus(), 60);
        break;

      case "pet-rules":
        showDialog({
          title: "Правила ВэТэБэШ",
          kicker: "Без азарта и давления",
          icon: "i-paw",
          tone: "pet",
          body: `
            <ul class="benefit-list"><li>${svgIcon("i-check")} Опыт начисляется только за полезные финансовые действия, а не за траты.</li><li>${svgIcon("i-check")} Питомец не влияет на доступ к деньгам, лимитам и платежам.</li><li>${svgIcon("i-check")} Если неделя пропущена, питомец засыпает. Серия возвращается после первого полезного действия.</li><li>${svgIcon("i-check")} Каникулы до 14 дней сохраняют прогресс без штрафов.</li><li>${svgIcon("i-check")} Нет ставок, лотерей, покупки опыта и соревнования на деньги.</li></ul>
            <div class="notice-box notice-box--success">${svgIcon("i-shield")} Бонусы уровня — скидки и кэшбэк от банка. Их нельзя обменять на деньги или передать другому человеку.</div>`,
          actions: `<button class="btn btn-primary" type="button" data-dialog-close>Всё понятно</button>`
        });
        break;

      case "holidays":
        showDialog({
          title: "Взять каникулы",
          kicker: "Сохраняем прогресс",
          icon: "i-sun",
          tone: "warning",
          body: `
            <p>Перед трудным месяцем можно поставить серию на паузу. ВэТэБэШ не заснёт, опыт и уровень сохранятся.</p>
            <div class="form-field" style="margin-top:13px"><label for="holidayDays">Длительность</label><select id="holidayDays"><option value="7">7 дней</option><option value="14">14 дней</option></select></div>
            <div class="notice-box">${svgIcon("i-sun")} На время каникул задания недели не начисляются, но семейный доступ и платежи работают как обычно.</div>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Отмена</button><button class="btn btn-primary" type="button" data-action="start-holidays">Включить каникулы</button>`
        });
        break;

      case "fraud-details":
        showDialog({
          title: "Детали операции",
          kicker: "Антифрод-мониторинг",
          icon: "i-shield",
          tone: "danger",
          body: `
            <div class="dialog-summary"><div class="dialog-summary__row"><span>Получатель</span><strong>Милана Петрова, 15 лет</strong></div><div class="dialog-summary__row"><span>Сумма</span><strong>12 500 ₽</strong></div><div class="dialog-summary__row"><span>Отправитель</span><strong>Неизвестен · карта 3 дня</strong></div><div class="dialog-summary__row"><span>Риск</span><strong>87% · высокий</strong></div><div class="dialog-summary__row"><span>Статус</span><strong>${state.fraudResolved ? "Обработано родителем" : "Приостановлено"}</strong></div></div>
            <h3>Почему сработала модель</h3><ul class="benefit-list"><li>${svgIcon("i-alert")} Новый отправитель, нет истории операций с семьёй.</li><li>${svgIcon("i-alert")} Карта зарегистрирована 3 дня назад.</li><li>${svgIcon("i-alert")} Сумма в 5 раз выше обычного перевода Милане.</li><li>${svgIcon("i-alert")} Нетипичное время и устройство инициатора.</li></ul>
            <p class="legal-note">Решение принимает родитель. Банк не блокирует счёт автоматически и не заменяет процедуры 115-ФЗ.</p>`,
          actions: `<button class="btn btn-primary" type="button" data-dialog-close>Понятно</button>`
        });
        break;

      case "access-log":
        showDialog({
          title: "Журнал доступа",
          kicker: "Последние 7 дней",
          icon: "i-clock",
          body: `<div class="dialog-list">
            <div class="dialog-list__item"><span class="avatar avatar--anna avatar--tiny">А</span><div><strong>Анна · изменение лимита Миланы</strong><span>Сегодня, 09:14 · биометрия подтверждена</span></div><span class="status-chip status-chip--success"><span></span> OK</span></div>
            <div class="dialog-list__item"><span class="avatar avatar--dmitry avatar--tiny">Д</span><div><strong>Дмитрий · оплата ипотеки</strong><span>Вчера, 18:22 · ВТБ Онлайн</span></div><span class="status-chip status-chip--success"><span></span> OK</span></div>
            <div class="dialog-list__item"><span class="avatar avatar--milana avatar--tiny">М</span><div><strong>Милана · вход в приложение</strong><span>Вчера, 16:05 · новое устройство</span></div><span class="status-chip status-chip--warning"><span></span> Проверено</span></div>
            <div class="dialog-list__item"><span class="avatar avatar--lev avatar--tiny">Л</span><div><strong>Лев · пополнение копилки</strong><span>1 ноября, 10:12 · 500 ₽</span></div><span class="status-chip status-chip--success"><span></span> OK</span></div>
          </div>`,
          actions: `<button class="btn btn-primary" type="button" data-dialog-close>Закрыть</button>`
        });
        break;

      case "member-milana":
      case "member-lev":
      case "member-dmitry": {
        const id = name.replace("member-", "");
        const member = members[id];
        const isMilana = id === "milana";
        showDialog({
          title: `${member.name} · ${member.role}`,
          kicker: "Права и лимиты",
          icon: "i-shield",
          body: `
            <div class="dialog-hero"><span class="avatar ${member.cls} avatar--lg">${member.initial}</span><div><strong>${member.name}</strong><span>${isMilana ? "15 лет · карта •• 4417" : id === "lev" ? "9 лет · детская карта •• 9062" : "41 год · совладелец"}</span></div></div>
            <div class="dialog-summary"><div class="dialog-summary__row"><span>Лимит в месяц</span><strong>${isMilana ? "15 000 ₽" : id === "lev" ? "2 000 ₽" : "Без ограничений"}</strong></div><div class="dialog-summary__row"><span>Онлайн-покупки</span><strong>${id === "lev" ? "Закрыты" : "Разрешены"}</strong></div><div class="dialog-summary__row"><span>Переводы незнакомцам</span><strong>${isMilana ? "С подтверждением" : id === "lev" ? "Запрещены" : "Разрешены"}</strong></div><div class="dialog-summary__row"><span>Push родителям</span><strong>Включены</strong></div></div>
            <p class="legal-note">Изменение лимита потребует подтверждения владельца. Данные ребёнка не передаются третьим лицам.</p>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Закрыть</button><button class="btn btn-primary" type="button" data-action="save-limits">Сохранить настройки</button>`
        });
        break;
      }

      case "roles-help":
        showDialog({
          title: "Как работают роли",
          kicker: "Прозрачные правила",
          icon: "i-users",
          body: `<p>Владелец управляет составом семьи и ролями. Совладелец видит всё и оплачивает обязательные платежи. Роль 14+ даёт подростку самостоятельность внутри лимитов. Роль «Ребёнок» оставляет покупки под контролем родителей.</p><div class="notice-box">${svgIcon("i-shield")} Любое изменение роли фиксируется в журнале и требует подтверждения биометрией.</div><ul class="benefit-list"><li>${svgIcon("i-check")} Принцип минимальных прав: каждый видит только необходимое.</li><li>${svgIcon("i-check")} Антифрод-уведомления приходят владельцу и второму родителю.</li><li>${svgIcon("i-check")} Спорные операции можно приостановить до подтверждения.</li></ul>`,
          actions: `<button class="btn btn-primary" type="button" data-dialog-close>Понятно</button>`
        });
        break;

      case "goal-settings":
        showDialog({
          title: "Настроить цель",
          kicker: "Отпуск в Сочи",
          icon: "i-target",
          body: `
            <div class="form-grid">
              <div class="form-field"><label for="goalTargetInput">Цель, ₽</label><input id="goalTargetInput" type="number" min="${state.goalCollected}" step="1000" value="${state.goalTarget}" /></div>
              <div class="form-field"><label for="goalRateInput">Взнос семьи, ₽/мес</label><input id="goalRateInput" type="number" min="1000" max="100000" step="500" value="${state.monthlyRate}" /></div>
            </div>
            <p class="legal-note">Дата достижения пересчитается по текущему балансу цели и выбранному темпу. Изменение увидят все участники.</p>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Отмена</button><button class="btn btn-primary" type="button" data-action="save-goal">Пересчитать</button>`
        });
        break;

      case "support":
        showDialog({
          title: "Семейный менеджер",
          kicker: "Помощь ВТБ",
          icon: "i-users",
          body: `<div class="dialog-hero"><span class="dialog-hero__icon">${svgIcon("i-users")}</span><div><strong>Мария Соколова</strong><span>Ответит в чате ежедневно с 9:00 до 21:00</span></div></div><p style="margin-top:12px">Поможет собрать семейный тариф, настроить лимиты и разобраться с антифрод-уведомлениями.</p><div class="notice-box">${svgIcon("i-shield")} В демо чат не подключён. В пилоте — защищённый чат внутри ВТБ Онлайн.</div>`,
          actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Закрыть</button><button class="btn btn-primary" type="button" data-action="support-chat">Написать менеджеру</button>`
        });
        break;

      default:
        toast("Раздел в разработке", "Этот сценарий появится в следующем спринте.", "warning");
    }
  }

  function openDuplicateModal(group) {
    if (state.resolvedGroups.has(group)) {
      toast("Дубль уже отключён", "Экономия учтена в семейном бюджете.", "warning");
      return;
    }
    const isYandex = group === "yandex";
    const name = isYandex ? "Яндекс Плюс" : "Кинопоиск";
    const price = isYandex ? 299 : 349;
    const yearly = isYandex ? 3588 : 4188;
    showDialog({
      title: "Найден дубль: " + name,
      kicker: "Экономия без потери доступа",
      icon: "i-sparkles",
      tone: "warning",
      body: `
        <p>Две подписки «${name}» оплачиваются с карт Анны и Дмитрия. Контент одинаковый — семья платит дважды.</p>
        <div class="dialog-list"><div class="dialog-list__item"><span class="avatar avatar--anna avatar--tiny">А</span><div><strong>Анна · ${fmt(price)} ₽/мес</strong><span>Оставим активной</span></div><span class="status-chip status-chip--success"><span></span> Основная</span></div><div class="dialog-list__item"><span class="avatar avatar--dmitry avatar--tiny">Д</span><div><strong>Дмитрий · ${fmt(price)} ₽/мес</strong><span>Отключим после подтверждения</span></div><span class="status-chip status-chip--warning"><span></span> Дубль</span></div></div>
        <div class="dialog-summary"><div class="dialog-summary__row"><span>Экономия в месяц</span><strong>${fmt(price)} ₽</strong></div><div class="dialog-summary__row dialog-summary__row--total"><span>Экономия за год</span><strong>${fmt(yearly)} ₽</strong></div></div>
        <div class="notice-box">${svgIcon("i-shield")} Доступ Анны и всех профилей сохранится. Отключение вступит в силу после оплаченного периода.</div>`,
      actions: `<button class="btn btn-ghost" type="button" data-dialog-close>Оставить как есть</button><button class="btn btn-primary" type="button" data-action="resolve-duplicate" data-group="${group}">Отключить дубль</button>`
    });
  }

  function searchResultsHtml(query) {
    const normalized = query.trim().toLowerCase();
    const items = searchIndex.filter((item) => !normalized || (item.title + " " + item.desc).toLowerCase().includes(normalized));
    if (!items.length) return `<div class="empty-state" style="padding:20px 10px"><strong>Ничего не найдено</strong><span>Попробуйте «подписки», «платёж» или «цель».</span></div>`;
    return items.map((item) => `<button class="search-result" type="button" data-search-view="${item.view}"><span class="search-result__icon">${svgIcon(item.icon)}</span><div><strong>${item.title}</strong><span>${item.desc}</span></div></button>`).join("");
  }

  function bindEvents() {
    document.addEventListener("click", handleClick);
    document.addEventListener("change", handleChange);
    document.addEventListener("input", handleInput);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("hashchange", () => {
      if (dialog.open) closeDialog();
      F.syncRoute();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });
  }

  function handleClick(event) {
    const closeButton = event.target.closest("[data-dialog-close]");
    if (closeButton) {
      closeDialog();
      return;
    }

    const searchView = event.target.closest("[data-search-view]");
    if (searchView) {
      navigateTo(searchView.dataset.searchView);
      return;
    }

    const navLink = event.target.closest("[data-nav-link]");
    if (navLink) {
      navigateTo(navLink.dataset.navLink);
      return;
    }

    const opener = event.target.closest("[data-open]");
    if (opener) {
      event.preventDefault();
      openModal(opener.dataset.open);
      return;
    }

    const nav = event.target.closest("[data-nav]");
    if (nav && nav.tagName === "A") {
      return;
    }

    const monthPrev = event.target.closest("[data-month-prev]");
    const monthNext = event.target.closest("[data-month-next]");
    if (monthPrev || monthNext) {
      toast("В прототипе — ноябрь 2026", "Переключение месяцев появится в следующей версии.", "warning");
      return;
    }

    const filter = event.target.closest("[data-sub-filter]");
    if (filter) {
      state.subFilter = filter.dataset.subFilter;
      $$("[data-sub-filter]").forEach((tab) => {
        const active = tab === filter;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      F.renderSubscriptions();
      return;
    }

    const subToggle = event.target.closest("[data-sub-toggle]");
    if (subToggle) {
      state.selectedSubscriptionId = subToggle.dataset.subToggle;
      state.openSub = state.openSub === subToggle.dataset.subToggle ? null : subToggle.dataset.subToggle;
      F.renderSubscriptions();
      return;
    }

    const memberFilter = event.target.closest("[data-member-filter]");
    if (memberFilter) {
      state.memberFilter = memberFilter.dataset.memberFilter;
      state.selectedDay = null;
      $$("[data-member-filter]").forEach((button) => button.classList.toggle("is-active", button === memberFilter));
      F.renderCalendar();
      F.renderPaymentFeed();
      return;
    }

    const day = event.target.closest("[data-day]");
    if (day) {
      const value = Number(day.dataset.day);
      state.selectedDay = state.selectedDay === value ? null : value;
      F.renderCalendar();
      F.renderPaymentFeed();
      return;
    }

    const paymentToggle = event.target.closest("[data-payment-toggle]");
    if (paymentToggle) {
      const row = paymentToggle.closest(".feed-item");
      const opening = !row.classList.contains("is-open");
      row.classList.toggle("is-open", opening);
      paymentToggle.setAttribute("aria-expanded", String(opening));
      return;
    }

    const payButton = event.target.closest("[data-pay]");
    if (payButton) {
      const payment = payments.find((item) => item.id === payButton.dataset.pay);
      if (!payment || state.paid.has(payment.id)) return;
      state.paid.add(payment.id);
      F.renderPaymentFeed();
      toast("Платёж оплачен", `${payment.title} · ${fmt(payment.amount)} ₽. Чек добавлен в семейный архив.`);
      addXP(25, "Платёж вовремя");
      return;
    }

    const petAction = event.target.closest("[data-pet-xp]");
    if (petAction) {
      addXP(Number(petAction.dataset.petXp), petAction.dataset.xpLabel || "Полезное действие", petAction);
      return;
    }

    const sleepDemo = event.target.closest("#sleepDemo");
    if (sleepDemo) {
      sleepPet();
      return;
    }

    const wake = event.target.closest("#wakePet");
    if (wake) {
      wakePet(false);
      return;
    }

    const fraud = event.target.closest("[data-fraud]");
    if (fraud) {
      resolveFraud(fraud.dataset.fraud);
      return;
    }

    const amountPreset = event.target.closest("[data-amount]");
    if (amountPreset) {
      const input = $("#contributionAmount");
      if (input) {
        input.value = amountPreset.dataset.amount;
        $$("[data-amount]").forEach((button) => button.classList.toggle("is-active", button === amountPreset));
      }
      return;
    }

    const memberPick = event.target.closest("[data-member-pick]");
    if (memberPick) {
      state.contributionMember = memberPick.dataset.memberPick;
      $$("[data-member-pick]").forEach((button) => button.classList.toggle("is-active", button === memberPick));
      return;
    }

    const subOwner = event.target.closest("[data-sub-owner]");
    if (subOwner) {
      state.subscriptionOwner = subOwner.dataset.subOwner;
      $$("[data-sub-owner]").forEach((button) => button.classList.toggle("is-active", button === subOwner));
      return;
    }

    const action = event.target.closest("[data-action]");
    if (action) {
      handleAction(action);
      return;
    }
  }

  function handleAction(action) {
    switch (action.dataset.action) {
      case "copy-invite":
        copyText("https://vtb.ru/family/petrov?invite=7F2K-9M4A");
        break;
      case "submit-contribution":
        submitContribution();
        break;
      case "resolve-duplicate": {
        const group = action.dataset.group;
        if (!group || state.resolvedGroups.has(group)) return;
        state.resolvedGroups.add(group);
        const cancelId = duplicateCancellation[group];
        if (cancelId) state.cancelledSubs.add(cancelId);
        updateDuplicateUI(group);
        closeDialog();
        toast("Дубль отключён", "Одна из двух подписок остановлена. Семейный бюджет обновлён.");
        confetti(52);
        addXP(50, "Лишняя подписка отменена");
        break;
      }
      case "connect-plan":
        state.planConnected = true;
        state.resolvedGroups.add("yandex");
        state.resolvedGroups.add("kinopoisk");
        state.cancelledSubs.add("yandex-dmitry");
        state.cancelledSubs.add("kinopoisk-dmitry");
        updateDuplicateUI("yandex");
        updateDuplicateUI("kinopoisk");
        closeDialog();
        $$('#view-subscriptions [data-open="family-plan"]').forEach((button) => {
          if (button.classList.contains("btn")) {
            button.innerHTML = `${svgIcon("i-check")} Тариф активен`;
            button.classList.add("is-active-plan");
          }
        });
        toast("Семейный тариф подключён", "399 ₽/мес · музыка, кино и книги для всех. Дубли отключены.");
        confetti(64);
        addXP(50, "Семейный тариф подключён");
        break;
      case "transfer":
        applyTransfer();
        break;
      case "submit-payment":
        submitPayment();
        break;
      case "submit-subscription":
        submitSubscription();
        break;
      case "start-holidays":
        startHolidays();
        break;
      case "save-goal":
        applyGoalSettings();
        break;
      case "save-limits":
        closeDialog();
        toast("Настройки сохранены", "Изменения вступят в силу после подтверждения владельца.");
        break;
      case "mark-read":
        closeDialog();
        const dot = $(".has-notice .notice-dot");
        if (dot) dot.style.display = "none";
        toast("Уведомления прочитаны", "Все события семьи отмечены как просмотренные.");
        break;
      case "support-chat":
        closeDialog();
        toast("Чат с менеджером", "В демо чат не подключён. В пилоте — защищённый чат ВТБ Онлайн.", "warning");
        break;
      case "change-sub-owner":
        changeSubscriptionOwner();
        break;
      default:
        toast("Действие в разработке", "Этот сценарий появится в следующей версии.", "warning");
    }
  }

  function handleChange(event) {
    const toggle = event.target.closest(".switch");
    if (toggle) {
      const row = toggle.closest(".toggle-row");
      const label = row ? $("strong", row)?.textContent : "Настройка";
      const risky = !toggle.checked && toggle.dataset.toggle === "strangers";
      toast(
        toggle.checked ? "Контроль включён" : "Контроль изменён",
        risky ? "Переводы от незнакомцев теперь без автоподтверждения. Рекомендуем вернуть защиту." : `${label}: ${toggle.checked ? "разрешено" : "ограничено"}.`,
        risky ? "warning" : "success"
      );
    }
  }

  function handleInput(event) {
    if (event.target.id === "globalSearch") {
      const results = $("#searchResults");
      if (results) results.innerHTML = searchResultsHtml(event.target.value);
      return;
    }
    if (event.target.id === "monthlyRate") {
      state.monthlyRate = Number(event.target.value);
      F.renderGoal();
    }
  }

  function handleKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openModal("search");
    }
    if (event.key === "Enter" && event.target.id === "contributionAmount" && dialog.open) {
      event.preventDefault();
      submitContribution();
    }
  }

  bindEvents();
  F.init();
})();
