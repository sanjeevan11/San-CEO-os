const STORAGE = {
  tasks: 'lp_pro_tasks',
  docs: 'lp_pro_docs',
  repairs: 'lp_pro_repairs',
  expenses: 'lp_pro_expenses',
  apiKey: 'lp_pro_openrouter_key'
};

const monthlyRent = 6200;
const tabs = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.tab-panel');
const toast = document.getElementById('toast');
const riskProgress = document.getElementById('risk-progress');
const riskLabel = document.getElementById('risk-label');
const deadlineBanner = document.getElementById('deadline-banner');

let taskState = JSON.parse(localStorage.getItem(STORAGE.tasks) || '{"rra":false,"docs":false,"repairs":false,"tax":false}');
let docs = JSON.parse(localStorage.getItem(STORAGE.docs) || '[]');
let repairs = JSON.parse(localStorage.getItem(STORAGE.repairs) || '[]');
let expenses = JSON.parse(localStorage.getItem(STORAGE.expenses) || '[]');

function saveAll() {
  localStorage.setItem(STORAGE.tasks, JSON.stringify(taskState));
  localStorage.setItem(STORAGE.docs, JSON.stringify(docs));
  localStorage.setItem(STORAGE.repairs, JSON.stringify(repairs));
  localStorage.setItem(STORAGE.expenses, JSON.stringify(expenses));
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 1700);
}

function switchTab(tabName) {
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabName));
  panels.forEach((panel) => panel.classList.toggle('hidden', panel.id !== `tab-${tabName}`));
}

function formatGBP(n) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);
}

function updateDeadlineBanner() {
  const deadline = new Date('2026-05-01T00:00:00Z');
  const now = new Date();
  const days = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days > 0) {
    deadlineBanner.textContent = `${days} DAYS TO RRA MAY 1 DEADLINE`;
  } else if (days === 0) {
    deadlineBanner.textContent = 'RRA DEADLINE IS TODAY';
  } else {
    deadlineBanner.textContent = `${Math.abs(days)} DAYS SINCE RRA MAY 1 DEADLINE`;
  }
}

function updateRiskScore() {
  const total = Object.keys(taskState).length;
  const completed = Object.values(taskState).filter(Boolean).length;
  const score = Math.round((completed / total) * 100);
  riskProgress.style.width = `${score}%`;

  if (score < 50) {
    riskLabel.textContent = `${score}% - High Risk`;
    riskLabel.className = 'rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700';
    riskProgress.className = 'h-3 rounded-full bg-red-500 transition-all duration-500';
  } else if (score < 90) {
    riskLabel.textContent = `${score}% - Medium Risk`;
    riskLabel.className = 'rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700';
    riskProgress.className = 'h-3 rounded-full bg-amber-500 transition-all duration-500';
  } else {
    riskLabel.textContent = `${score}% - Low Risk`;
    riskLabel.className = 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700';
    riskProgress.className = 'h-3 rounded-full bg-emerald-500 transition-all duration-500';
  }
}

function updateNetIncome() {
  const expenseTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  document.getElementById('net-income').textContent = formatGBP(monthlyRent - expenseTotal);
}

function getInstrumentPrompt(instrument, tenantName, address) {
  return `Act as a UK Property Solicitor. Draft a ${instrument} for ${tenantName} at ${address} considering the strict May 2026 RRA rules. Use professional, legally binding language.`;
}

async function callOpenRouter(prompt) {
  const apiKeyInput = document.getElementById('api-key');
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    throw new Error('OpenRouter API key missing.');
  }

  localStorage.setItem(STORAGE.apiKey, apiKey);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'LandlordPulse PRO'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a UK property-law specialist solicitor. Keep output formal and legally precise.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenRouter request failed: ${details}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No draft returned.';
}

function renderRepairList() {
  const list = document.getElementById('repair-list');
  if (!repairs.length) {
    list.innerHTML = '<li class="log-item">No repairs logged.</li>';
    return;
  }
  list.innerHTML = repairs
    .slice()
    .reverse()
    .map((r) => `<li class="log-item"><p class="font-bold">${r.desc}</p><p>${r.priority} | ${r.priceHint}</p></li>`)
    .join('');
}

function renderExpenseList() {
  const list = document.getElementById('expense-list');
  if (!expenses.length) {
    list.innerHTML = '<li class="log-item">No expenses logged.</li>';
    return;
  }
  list.innerHTML = expenses
    .slice()
    .reverse()
    .map((e) => `<li class="log-item"><p class="font-bold">${e.category}</p><p>${e.date} | ${formatGBP(Number(e.amount))}</p></li>`)
    .join('');
}

function estimateRepairPrice(desc) {
  const d = desc.toLowerCase();
  if (d.includes('boiler')) return { label: 'Boiler Repair: Birmingham Avg £90-£140', budget: 115 };
  if (d.includes('plumb') || d.includes('leak')) return { label: 'Plumbing Callout: Birmingham Avg £70-£120', budget: 95 };
  if (d.includes('elect')) return { label: 'Electrical Repair: Birmingham Avg £85-£160', budget: 120 };
  return { label: 'General Repair: Birmingham Avg £60-£110', budget: 85 };
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows) {
  const header = 'amount,date,category';
  const body = rows.map((r) => `${r.amount},${r.date},${r.category}`).join('\n');
  return `${header}\n${body}`;
}

// Tab navigation
tabs.forEach((btn) => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// AI Legal Factory
document.getElementById('generate-legal').addEventListener('click', async () => {
  const instrument = document.getElementById('legal-instrument').value;
  const tenantName = document.getElementById('tenant-name').value.trim() || 'Tenant';
  const address = document.getElementById('tenant-address').value.trim() || 'Property Address';
  const prompt = getInstrumentPrompt(instrument, tenantName, address);
  const paper = document.getElementById('draft-paper');
  paper.textContent = 'Generating legal draft...';

  try {
    const draft = await callOpenRouter(prompt);
    paper.textContent = draft;
    docs.push({ instrument, tenantName, address, draft, createdAt: new Date().toISOString() });
    taskState.docs = true;
    saveAll();
    updateRiskScore();
    showToast('Legal draft generated and stored.');
  } catch (err) {
    paper.textContent = `Error: ${err.message}`;
    showToast('Draft generation failed.');
  }
});

document.getElementById('copy-draft').addEventListener('click', async () => {
  const text = document.getElementById('draft-paper').textContent;
  await navigator.clipboard.writeText(text);
  showToast('Draft copied.');
});

document.getElementById('wa-draft').addEventListener('click', () => {
  const tenantName = document.getElementById('tenant-name').value.trim() || 'Tenant';
  const text = document.getElementById('draft-paper').textContent;
  window.open(`https://wa.me/?text=${encodeURIComponent(`Hi ${tenantName}, please review this draft:\n\n${text}`)}`, '_blank');
});

// Repairs
document.getElementById('repair-desc').addEventListener('input', (e) => {
  const hint = estimateRepairPrice(e.target.value || '');
  document.getElementById('price-benchmark').textContent = `AI Price Benchmarker: ${hint.label}`;
});

document.getElementById('save-repair').addEventListener('click', () => {
  const desc = document.getElementById('repair-desc').value.trim();
  const priority = document.getElementById('repair-priority').value;
  if (!desc) {
    showToast('Add a repair description.');
    return;
  }
  const bench = estimateRepairPrice(desc);
  repairs.push({ desc, priority, priceHint: bench.label, budget: bench.budget, createdAt: new Date().toISOString() });
  taskState.repairs = true;
  saveAll();
  renderRepairList();
  updateRiskScore();
  showToast('Repair logged.');
});

document.getElementById('call-trade').addEventListener('click', () => {
  const desc = document.getElementById('repair-desc').value.trim() || 'repair job';
  const postcode = document.getElementById('repair-postcode').value.trim() || 'B1';
  const bench = estimateRepairPrice(desc);
  const text = `Hi, I'm a landlord with a ${desc} in ${postcode}. My budget is £${bench.budget}. Are you available?`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
});

// Tax
document.getElementById('save-expense').addEventListener('click', () => {
  const amount = Number(document.getElementById('expense-amount').value);
  const date = document.getElementById('expense-date').value;
  const category = document.getElementById('expense-category').value;

  if (!amount || !date || !category) {
    showToast('Complete tax fields first.');
    return;
  }

  expenses.push({ amount, date, category });
  taskState.tax = true;
  saveAll();
  renderExpenseList();
  updateRiskScore();
  updateNetIncome();
  showToast('Expense saved.');
});

document.getElementById('export-csv').addEventListener('click', () => {
  if (!expenses.length) {
    showToast('No expenses to export.');
    return;
  }
  const csv = toCsv(expenses);
  downloadFile(`mtd-expenses-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8;');
  showToast('MTD CSV exported.');
});

// Init
const savedApiKey = localStorage.getItem(STORAGE.apiKey);
if (savedApiKey) document.getElementById('api-key').value = savedApiKey;
if (docs.length) {
  document.getElementById('draft-paper').textContent = docs[docs.length - 1].draft;
}
if (repairs.length) taskState.repairs = true;
if (expenses.length) taskState.tax = true;
if (docs.length) taskState.docs = true;
taskState.rra = true;
saveAll();
updateDeadlineBanner();
updateRiskScore();
renderRepairList();
renderExpenseList();
updateNetIncome();
switchTab('home');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}
