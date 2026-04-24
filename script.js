const STORAGE_KEYS = {
  expenses: 'landlordpulse_expenses',
  rra: 'landlordpulse_rra_checklist'
};

const DEADLINE = new Date('2026-05-01T00:00:00Z');

const rraTasks = [
  'Transition active ASTs to Assured Periodic (Rolling) Tenancies',
  'Review Section 8 grounds for possession',
  'Update contracts to remove rental bidding clauses',
  'Gas Safety & EICR valid for May 1 transition'
];

const tabs = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.tab-panel');
const toast = document.getElementById('toast');
const countdownPill = document.getElementById('countdown-pill');
const dashboardExpenses = document.getElementById('dashboard-expenses');

const checklistContainer = document.getElementById('rra-checklist');
const progressBar = document.getElementById('compliance-progress');
const complianceLabel = document.getElementById('compliance-label');
const riskBadge = document.getElementById('risk-badge');

const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const q1TotalEl = document.getElementById('q1-total');
const categorySummary = document.getElementById('category-summary');

const savedChecklist = JSON.parse(localStorage.getItem(STORAGE_KEYS.rra) || '{}');
let expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.expenses) || '[]');

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 1800);
}

function formatGBP(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(value);
}

function switchTab(tabName) {
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  panels.forEach((panel) => {
    const isTarget = panel.id === `tab-${tabName}`;
    panel.classList.toggle('hidden', !isTarget);
  });
}

function applyHashRoute() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (['dashboard', 'rra', 'mtd'].includes(hash)) {
    switchTab(hash);
  }
}

function renderDeadlineCountdown() {
  const now = new Date();
  const diffMs = DEADLINE.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days > 0) {
    countdownPill.textContent = `${days} days left`;
  } else if (days === 0) {
    countdownPill.textContent = 'Deadline day';
  } else {
    countdownPill.textContent = `${Math.abs(days)} days since`;
  }
}

function renderChecklist() {
  checklistContainer.innerHTML = '';

  rraTasks.forEach((task, index) => {
    const id = `rra-task-${index}`;
    const checked = Boolean(savedChecklist[id]);

    const wrapper = document.createElement('label');
    wrapper.className = 'flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3';
    wrapper.innerHTML = `
      <span class="text-sm font-medium text-slate-700">${task}</span>
      <span class="relative inline-flex items-center">
        <input id="${id}" type="checkbox" class="sr-only rra-checkbox" ${checked ? 'checked' : ''} />
        <span class="toggle"></span>
      </span>
    `;

    checklistContainer.appendChild(wrapper);
  });

  document.querySelectorAll('.rra-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      savedChecklist[e.target.id] = e.target.checked;
      localStorage.setItem(STORAGE_KEYS.rra, JSON.stringify(savedChecklist));
      updateCompliance();
    });
  });

  updateCompliance();
}

function updateCompliance() {
  const completed = Object.values(savedChecklist).filter(Boolean).length;
  const percent = Math.round((completed / rraTasks.length) * 100);

  progressBar.style.width = `${percent}%`;
  complianceLabel.textContent = `${percent}% Compliant`;

  if (percent < 50) {
    progressBar.className = 'h-full bg-red-500 transition-all duration-500';
    riskBadge.textContent = 'High Risk of Fines';
    riskBadge.className = 'rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700';
  } else if (percent < 100) {
    progressBar.className = 'h-full bg-amber-500 transition-all duration-500';
    riskBadge.textContent = 'Medium Risk';
    riskBadge.className = 'rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700';
  } else {
    progressBar.className = 'h-full bg-emerald-500 transition-all duration-500';
    riskBadge.textContent = 'Transition Ready';
    riskBadge.className = 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700';
  }
}

function isQ1(dateString) {
  const date = new Date(dateString);
  const month = date.getUTCMonth() + 1;
  return month >= 1 && month <= 3;
}

function totalQ1() {
  return expenses.filter((item) => isQ1(item.date)).reduce((sum, item) => sum + item.amount, 0);
}

function renderCategorySummary() {
  if (!expenses.length) {
    categorySummary.innerHTML = '<p class="text-xs text-slate-500">No category trends yet.</p>';
    return;
  }

  const totals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const max = Math.max(...Object.values(totals));
  categorySummary.innerHTML = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => `
      <div class="summary-row">
        <div>
          <p class="text-xs font-semibold text-slate-700">${category}</p>
          <div class="summary-track"><div class="summary-bar" style="width:${Math.round((amount / max) * 100)}%"></div></div>
        </div>
        <span class="text-xs font-bold text-slate-700">${formatGBP(amount)}</span>
      </div>
    `)
    .join('');
}

function renderExpenses() {
  if (!expenses.length) {
    expenseList.innerHTML = '<li class="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-center text-sm text-slate-500">No expenses logged yet.</li>';
    q1TotalEl.textContent = 'Total Q1 Expenses: £0.00';
    dashboardExpenses.textContent = '£0.00';
    renderCategorySummary();
    return;
  }

  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  expenseList.innerHTML = sorted
    .map((item) => `
      <li class="expense-item">
        <div>
          <p class="text-sm font-semibold text-slate-800">${item.category}</p>
          <p class="text-xs text-slate-500">${item.date}</p>
        </div>
        <div class="flex items-center gap-2">
          <p class="text-sm font-bold text-slate-900">${formatGBP(item.amount)}</p>
          <button data-delete-id="${item.id}" class="expense-delete" aria-label="Delete expense"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </li>
    `)
    .join('');

  const q1 = totalQ1();
  q1TotalEl.textContent = `Total Q1 Expenses: ${formatGBP(q1)}`;
  dashboardExpenses.textContent = formatGBP(q1);
  renderCategorySummary();

  document.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => {
      expenses = expenses.filter((item) => item.id !== button.dataset.deleteId);
      localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
      renderExpenses();
      showToast('Expense removed.');
    });
  });
}

expenseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = document.getElementById('expense-date').value;
  const amount = Number(document.getElementById('expense-amount').value);
  const category = document.getElementById('expense-category').value;

  if (!date || !amount || amount <= 0 || !category) {
    showToast('Please complete all expense fields.');
    return;
  }

  expenses.push({ id: crypto.randomUUID(), date, amount, category });
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
  expenseForm.reset();
  renderExpenses();
  showToast('Expense saved to MTD log.');
});

document.getElementById('export-expenses').addEventListener('click', () => {
  const payload = JSON.stringify(expenses, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `landlordpulse-expenses-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Expense export downloaded.');
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

document.querySelectorAll('[data-coming-soon]').forEach((button) => {
  button.addEventListener('click', () => showToast(`${button.dataset.comingSoon} coming soon.`));
});

document.getElementById('go-expense').addEventListener('click', () => switchTab('mtd'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      showToast('Offline mode unavailable.');
    });
  });
}

renderDeadlineCountdown();
renderChecklist();
renderExpenses();
switchTab('dashboard');
applyHashRoute();
