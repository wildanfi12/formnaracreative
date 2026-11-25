/* ==========================================================================
   NARA Creative - Interactive Project Brief Form
   - 4 kapabilitas NARA dengan accordion output spesifik
   - Live Brief Dossier real-time di panel pengantar
   - Stepper interaktif, template cepat, auto-save (localStorage)
   - Sukses HANYA ditampilkan jika backend Apps Script mengonfirmasi
   ========================================================================== */

const CONFIG = {
  // Tempel URL Web App Apps Script (berakhiran /exec) di sini.
  // Tidak ada kredensial di frontend; URL ini hanya endpoint publik.
  APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_WEB_APP_URL',
  WHATSAPP: '6281281886198',
  EMAIL: 'naracreativestudio.id@gmail.com',
  STORAGE_KEY: 'nara_brief_v6',
  TIMEOUT_MS: 20000
};

const TOTAL_INPUT_STEPS = 3;
const NEXT_LABELS = {
  1: 'Lanjut ke Rencana',
  2: 'Lanjut ke Kontak',
  3: 'Lihat Rekap Brief'
};

const form = document.getElementById('briefForm');
const steps = Array.from(form.querySelectorAll('.step'));
const btnBack = document.getElementById('btnBack');
const btnNext = document.getElementById('btnNext');
const btnSubmit = document.getElementById('btnSubmit');
const statusBox = document.getElementById('formStatus');
const progressBar = document.getElementById('progressBar');
const stepperItems = Array.from(document.querySelectorAll('.stepper-item'));
const capCards = Array.from(document.querySelectorAll('.cap-card'));

let currentStep = 1;
let isSubmitting = false;

/* ---------- Helpers ---------- */

const isConfigured = () =>
  /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(CONFIG.APPS_SCRIPT_URL.trim());

const clean = (v) => String(v == null ? '' : v).trim();

function normalizePhone(raw) {
  let p = clean(raw).replace(/[\s\-().]/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('0')) p = '62' + p.slice(1);
  return p;
}

function getData() {
  const fd = new FormData(form);
  return {
    services: fd.getAll('services'),
    deliverables: fd.getAll('deliverables'),
    projectSummary: clean(fd.get('projectSummary')),
    brandName: clean(fd.get('brandName')),
    brandLink: clean(fd.get('brandLink')),
    budget: clean(fd.get('budget')),
    timeline: clean(fd.get('timeline')),
    fullName: clean(fd.get('fullName')),
    whatsapp: clean(fd.get('whatsapp')),
    email: clean(fd.get('email')),
    company_site: clean(fd.get('company_site'))
  };
}

/* ---------- Capability Cards & Accordion ---------- */

function setCardOpen(card, open) {
  card.classList.toggle('is-open', open);
  const btn = card.querySelector('.cap-expand-btn');
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function syncCapCardUI(card) {
  const capId = card.dataset.cap;
  const parentCb = card.querySelector('input[name="services"]');
  const childCbs = Array.from(card.querySelectorAll('input[name="deliverables"]'));
  const checkedCount = childCbs.filter((cb) => cb.checked).length;

  card.classList.toggle('is-selected', Boolean(parentCb && parentCb.checked));

  const badge = card.querySelector(`[data-count-for="${capId}"]`);
  if (badge) {
    badge.textContent = checkedCount > 0 ? `${checkedCount} output` : '';
  }
}

function syncAllCapCards(autoOpenSelected = false) {
  capCards.forEach((card) => {
    syncCapCardUI(card);
    const parentCb = card.querySelector('input[name="services"]');
    if (autoOpenSelected && parentCb && parentCb.checked) {
      setCardOpen(card, true);
    }
  });
}

/* ---------- Live Brief Dossier ---------- */

function renderTagList(container, items, emptyText) {
  container.textContent = '';
  if (!items.length) {
    if (emptyText) {
      const span = document.createElement('span');
      span.className = 'dossier-empty';
      span.textContent = emptyText;
      container.appendChild(span);
    }
    return;
  }
  items.forEach((label) => {
    const pill = document.createElement('span');
    pill.className = 'dossier-tag-pill';
    pill.textContent = label;
    container.appendChild(pill);
  });
}

function getEstimateText(d) {
  if (!d.services.length) {
    return 'Estimasi alur kerja akan menyesuaikan pilihan layanan Anda.';
  }
  const hasWebOrBrand =
    d.services.includes('Website Development') ||
    d.services.includes('Visual Branding & Strategy');
  if (hasWebOrBrand) {
    return 'Proyek branding atau website umumnya membutuhkan 5-10 hari kerja sesuai cakupan.';
  }
  const hasLongProd =
    d.services.length > 1 ||
    d.deliverables.includes('Video Komersial & Campaign') ||
    d.deliverables.includes('Motion Graphics & Editing');
  if (hasLongProd) {
    return 'Paket video komersial, motion graphics, atau multi-layanan umumnya 5-10 hari kerja.';
  }
  return 'Produksi short-form Reels, foto produk, dan materi iklan umumnya 24-48 jam setelah materi siap.';
}

function updateDossier() {
  const d = getData();

  const stepEl = document.getElementById('dossierStep');
  if (stepEl) {
    stepEl.textContent = currentStep === 4 ? 'REKAP' : `0${currentStep} / 0${TOTAL_INPUT_STEPS}`;
  }

  const brandEl = document.getElementById('liveBrand');
  if (brandEl) {
    brandEl.textContent = d.brandName || 'Belum diisi';
    brandEl.classList.toggle('is-placeholder', !d.brandName);
  }

  const pillarsEl = document.getElementById('livePillars');
  if (pillarsEl) {
    renderTagList(pillarsEl, d.services, 'Belum ada layanan dipilih');
  }

  const delivRow = document.getElementById('liveDeliverablesRow');
  const delivEl = document.getElementById('liveDeliverables');
  if (delivRow && delivEl) {
    delivRow.hidden = d.deliverables.length === 0;
    renderTagList(delivEl, d.deliverables, '');
  }

  const budgetEl = document.getElementById('liveBudget');
  if (budgetEl) {
    budgetEl.textContent = d.budget || 'Belum dipilih';
    budgetEl.classList.toggle('is-placeholder', !d.budget);
  }

  const timelineEl = document.getElementById('liveTimeline');
  if (timelineEl) {
    timelineEl.textContent = d.timeline || 'Belum dipilih';
    timelineEl.classList.toggle('is-placeholder', !d.timeline);
  }

  const estimateEl = document.getElementById('liveEstimate');
  if (estimateEl) {
    estimateEl.textContent = getEstimateText(d);
  }
}

/* ---------- Persistence ---------- */

function saveDraft() {
  try {
    const { company_site, ...data } = getData();
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ data, step: currentStep }));
  } catch (_) { /* storage penuh / diblokir: abaikan */ }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return;
    const { data, step } = JSON.parse(raw);
    if (!data) return;

    form.querySelectorAll('input[name="services"]').forEach((el) => {
      el.checked = Array.isArray(data.services) && data.services.includes(el.value);
    });
    form.querySelectorAll('input[name="deliverables"]').forEach((el) => {
      el.checked = Array.isArray(data.deliverables) && data.deliverables.includes(el.value);
    });
    ['budget', 'timeline'].forEach((name) => {
      form.querySelectorAll(`input[name="${name}"]`).forEach((el) => {
        el.checked = el.value === data[name];
      });
    });
    ['projectSummary', 'brandName', 'brandLink', 'fullName', 'whatsapp', 'email'].forEach((name) => {
      if (form.elements[name] && typeof data[name] === 'string') {
        form.elements[name].value = data[name];
      }
    });

    syncAllCapCards(true);
    updateCounter();

    // Kembali ke langkah terakhir hanya jika langkah sebelumnya valid
    const target = Math.min(Math.max(parseInt(step, 10) || 1, 1), 4);
    for (let s = 1; s < target; s++) {
      if (!validateStep(s, false)) {
        showStep(s, false);
        return;
      }
    }
    showStep(target, false);
  } catch (_) {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
  }
}

function clearDraft() {
  try { localStorage.removeItem(CONFIG.STORAGE_KEY); } catch (_) {}
}

/* ---------- Validation ---------- */

function setError(fieldName, message) {
  const err = document.getElementById(`err-${fieldName}`);
  if (err) err.textContent = message || '';
  const wrapper = err ? err.closest('.field') : null;
  if (wrapper) wrapper.classList.toggle('is-invalid', Boolean(message));
  const input = form.elements[fieldName];
  if (input && input.setAttribute && !(input instanceof RadioNodeList)) {
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
}

const RULES = {
  1: (d) => ({
    services: d.services.length ? '' : 'Pilih minimal satu pilar layanan.',
    projectSummary: d.projectSummary.length >= 15 ? '' :
      (d.projectSummary ? 'Ceritakan sedikit lebih detail (minimal 15 karakter).' : 'Ceritakan singkat kebutuhan proyek Anda.')
  }),
  2: (d) => ({
    brandName: d.brandName.length >= 2 ? '' : 'Isi nama brand atau bisnis Anda.',
    budget: d.budget ? '' : 'Pilih perkiraan anggaran.',
    timeline: d.timeline ? '' : 'Pilih waktu mulai proyek.'
  }),
  3: (d) => {
    const phone = normalizePhone(d.whatsapp);
    return {
      fullName: d.fullName.length >= 2 ? '' : 'Isi nama lengkap Anda.',
      whatsapp: !d.whatsapp ? 'Isi nomor WhatsApp aktif.' :
        (/^62\d{8,13}$/.test(phone) ? '' : 'Format nomor belum sesuai. Contoh: 0812xxxxxxx atau +62812xxxxxxx.'),
      email: !d.email ? 'Isi alamat email Anda.' :
        (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) ? '' : 'Format email belum sesuai. Contoh: nama@email.com.')
    };
  }
};

function validateStep(step, showErrors = true) {
  const rule = RULES[step];
  if (!rule) return true;
  const errors = rule(getData());
  let firstInvalid = null;

  Object.entries(errors).forEach(([field, msg]) => {
    if (showErrors) setError(field, msg);
    if (msg && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid && showErrors) {
    const el = form.querySelector(`[name="${firstInvalid}"]`);
    if (el) el.focus({ preventScroll: false });
  }
  return !firstInvalid;
}

/* ---------- Step Navigation ---------- */

function showStep(step, focus = true) {
  currentStep = step;
  steps.forEach((el) => {
    const active = Number(el.dataset.step) === step;
    el.hidden = !active;
    el.classList.toggle('is-active', active);
  });

  const isReview = step === 4;
  btnBack.hidden = step === 1;
  btnNext.hidden = isReview;
  btnSubmit.hidden = !isReview;
  btnNext.textContent = NEXT_LABELS[step] || 'Lanjut';

  progressBar.style.width = `${(Math.min(step, 4) / 4) * 100}%`;

  stepperItems.forEach((li) => {
    const n = Number(li.dataset.stepper);
    li.classList.toggle('is-current', n === step);
    li.classList.toggle('is-done', n < step);
  });

  if (isReview) renderReview();
  hideStatus();
  updateDossier();

  if (focus) {
    const title = steps.find((el) => Number(el.dataset.step) === step)?.querySelector('.step-title');
    if (title) {
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    }
    const top = document.getElementById('brief').getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  }
  saveDraft();
}

function goNext() {
  if (!validateStep(currentStep)) return;
  showStep(currentStep + 1);
}

function goBack() {
  if (currentStep > 1) showStep(currentStep - 1);
}

function goToStep(targetStep) {
  if (targetStep === currentStep || isSubmitting) return;
  if (targetStep < currentStep) {
    showStep(targetStep);
    return;
  }
  for (let s = currentStep; s < targetStep; s++) {
    if (!validateStep(s, false)) {
      showStep(s);
      validateStep(s, true);
      return;
    }
  }
  showStep(targetStep);
}

/* ---------- Review ---------- */

function renderReview() {
  const d = getData();
  const rows = [
    ['Pilar Layanan', d.services.join(', '), 1]
  ];
  if (d.deliverables.length) {
    rows.push(['Output Spesifik', d.deliverables.join(', '), 1]);
  }
  rows.push(
    ['Ringkasan', d.projectSummary, 1],
    ['Brand', d.brandName + (d.brandLink ? `\n${d.brandLink}` : ''), 2],
    ['Anggaran', d.budget, 2],
    ['Mulai', d.timeline, 2],
    ['Nama', d.fullName, 3],
    ['WhatsApp', d.whatsapp, 3],
    ['Email', d.email, 3]
  );

  const list = document.getElementById('reviewList');
  list.textContent = '';
  rows.forEach(([key, val, step]) => {
    const item = document.createElement('div');
    item.className = 'review-item';

    const k = document.createElement('span');
    k.className = 'review-key';
    k.textContent = key;

    const v = document.createElement('span');
    v.className = 'review-val' + (val ? '' : ' is-empty');
    v.textContent = val || '-';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'review-edit';
    btn.textContent = 'Ubah';
    btn.setAttribute('aria-label', `Ubah ${key}`);
    btn.addEventListener('click', () => showStep(step));

    item.append(k, v, btn);
    list.appendChild(item);
  });
}

/* ---------- Status ---------- */

function hideStatus() {
  statusBox.hidden = true;
  statusBox.className = 'status';
  statusBox.textContent = '';
}

function buildWaText(d, briefId) {
  return [
    'Halo NARA Creative, saya ingin mengirim brief proyek:',
    '',
    briefId ? `ID Brief: ${briefId}` : null,
    `Nama: ${d.fullName}`,
    `Brand: ${d.brandName}${d.brandLink ? ` (${d.brandLink})` : ''}`,
    `Layanan: ${d.services.join(', ')}`,
    d.deliverables.length ? `Output Spesifik: ${d.deliverables.join(', ')}` : null,
    `Anggaran: ${d.budget}`,
    `Mulai: ${d.timeline}`,
    `Ringkasan: ${d.projectSummary}`
  ].filter((l) => l !== null).join('\n');
}

function showError(message, d) {
  statusBox.hidden = false;
  statusBox.className = 'status is-error';
  statusBox.textContent = '';

  const p1 = document.createElement('p');
  p1.textContent = message;

  const p2 = document.createElement('p');
  p2.append('Jawaban Anda tetap tersimpan. Coba kirim ulang, atau kirim rekap ini langsung lewat ');
  const wa = document.createElement('a');
  wa.href = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(buildWaText(d))}`;
  wa.target = '_blank';
  wa.rel = 'noopener noreferrer';
  wa.textContent = 'WhatsApp';
  p2.append(wa, ' atau ');
  const mail = document.createElement('a');
  mail.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent('Brief Proyek - ' + d.brandName)}&body=${encodeURIComponent(buildWaText(d))}`;
  mail.textContent = 'email';
  p2.append(mail, '.');

  statusBox.append(p1, p2);
  statusBox.focus?.();
}

/* ---------- Submit ---------- */

function makeBriefId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NARA-${ymd}-${rand}`;
}

function setLoading(on) {
  isSubmitting = on;
  btnSubmit.disabled = on;
  btnBack.disabled = on;
  btnSubmit.classList.toggle('is-loading', on);
  btnSubmit.querySelector('.btn-label').textContent = on ? 'Mengirim...' : 'Kirim Brief Sekarang';
}

async function handleSubmit(e) {
  e.preventDefault();
  if (isSubmitting) return;

  for (let s = 1; s <= TOTAL_INPUT_STEPS; s++) {
    if (!validateStep(s, false)) {
      showStep(s);
      validateStep(s);
      return;
    }
  }

  const d = getData();

  // Honeypot terisi = bot. Diam-diam abaikan.
  if (d.company_site) return;

  if (!isConfigured()) {
    showError('Pengiriman online belum aktif (endpoint Google Sheets belum dikonfigurasi).', d);
    return;
  }

  const briefId = makeBriefId();
  const payload = {
    briefId,
    timestamp: new Date().toISOString(),
    services: d.services.join(', '),
    deliverables: d.deliverables.join(', '),
    projectSummary: d.projectSummary,
    brandName: d.brandName,
    brandLink: d.brandLink,
    budget: d.budget,
    timeline: d.timeline,
    fullName: d.fullName,
    whatsapp: normalizePhone(d.whatsapp),
    email: d.email,
    source: location.hostname || 'local',
    company_site: d.company_site
  };

  setLoading(true);
  hideStatus();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

  try {
    // text/plain = CORS simple request sehingga respons Apps Script dapat dibaca
    const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal
    });

    let result = null;
    try { result = await res.json(); } catch (_) { /* bukan JSON */ }

    if (!res.ok || !result || result.success !== true) {
      const msg = (result && result.message) ? result.message : `Server tidak memberikan konfirmasi (HTTP ${res.status}).`;
      throw new Error(msg);
    }

    clearDraft();
    showSuccess(d, result.briefId || briefId);
  } catch (err) {
    const msg = err.name === 'AbortError'
      ? 'Koneksi terlalu lama. Brief belum terkirim.'
      : `Brief belum terkirim. ${err.message || 'Periksa koneksi internet Anda.'}`;
    showError(msg, d);
  } finally {
    clearTimeout(timer);
    setLoading(false);
  }
}

function showSuccess(d, briefId) {
  form.hidden = true;
  document.getElementById('progress').hidden = true;

  document.getElementById('successName').textContent = d.fullName.split(' ')[0] || d.fullName;
  document.getElementById('successId').textContent = briefId;
  document.getElementById('successWa').href =
    `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(buildWaText(d, briefId))}`;

  stepperItems.forEach((li) => {
    li.classList.remove('is-current');
    li.classList.add('is-done');
  });
  const stepEl = document.getElementById('dossierStep');
  if (stepEl) stepEl.textContent = 'TERKIRIM';

  const view = document.getElementById('successView');
  view.hidden = false;
  view.focus({ preventScroll: true });
  const top = document.getElementById('brief').getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
}

function resetForNewBrief() {
  form.reset();
  ['services', 'projectSummary', 'brandName', 'budget', 'timeline', 'fullName', 'whatsapp', 'email']
    .forEach((f) => setError(f, ''));
  capCards.forEach((card) => {
    setCardOpen(card, false);
    syncCapCardUI(card);
  });
  updateCounter();
  document.getElementById('successView').hidden = true;
  document.getElementById('progress').hidden = false;
  form.hidden = false;
  clearDraft();
  showStep(1);
}

/* ---------- Misc ---------- */

function updateCounter() {
  const ta = form.elements.projectSummary;
  document.getElementById('summaryCount').textContent = ta.value.length;
}

/* ---------- Events ---------- */

btnNext.addEventListener('click', goNext);
btnBack.addEventListener('click', goBack);
form.addEventListener('submit', handleSubmit);
document.getElementById('btnNewBrief').addEventListener('click', resetForNewBrief);

// Interactive Stepper click
document.querySelectorAll('.stepper-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = Number(btn.dataset.goto);
    if (target) goToStep(target);
  });
});

// Capability accordion toggle buttons
capCards.forEach((card) => {
  const expandBtn = card.querySelector('.cap-expand-btn');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      setCardOpen(card, !card.classList.contains('is-open'));
    });
  }
});

// Capability parent & child sync
form.addEventListener('change', (e) => {
  const target = e.target;
  const name = target.name;

  if (name === 'services') {
    const card = target.closest('.cap-card');
    if (card) {
      if (target.checked) {
        setCardOpen(card, true);
      } else {
        card.querySelectorAll('input[name="deliverables"]').forEach((cb) => {
          cb.checked = false;
        });
        setCardOpen(card, false);
      }
      syncCapCardUI(card);
    }
    const errors = RULES[1](getData());
    if (!errors.services) setError('services', '');
  }

  if (name === 'deliverables') {
    const card = target.closest('.cap-card');
    if (card) {
      if (target.checked) {
        const parentCb = card.querySelector('input[name="services"]');
        if (parentCb && !parentCb.checked) {
          parentCb.checked = true;
        }
        setCardOpen(card, true);
      }
      syncCapCardUI(card);
      const errors = RULES[1](getData());
      if (!errors.services) setError('services', '');
    }
  }

  if (['budget', 'timeline'].includes(name)) {
    const errors = RULES[currentStep] ? RULES[currentStep](getData()) : {};
    if (!errors[name]) setError(name, '');
  }

  updateDossier();
  saveDraft();
});

// Quick Prompt helpers
document.querySelectorAll('.prompt-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const promptText = btn.dataset.prompt || '';
    const ta = form.elements.projectSummary;
    ta.value = promptText;
    updateCounter();
    const errors = RULES[1](getData());
    if (!errors.projectSummary) setError('projectSummary', '');
    ta.focus();
    ta.setSelectionRange(promptText.length, promptText.length);
    updateDossier();
    saveDraft();
  });
});

// Enter di input teks = lanjut (bukan submit prematur). Textarea tetap baris baru.
form.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || e.isComposing) return;
  const t = e.target;
  if (t.tagName === 'TEXTAREA' || t.tagName === 'BUTTON') return;
  if (currentStep < 4) {
    e.preventDefault();
    goNext();
  }
});

// Live update on typing (brandName, projectSummary, etc.)
form.addEventListener('input', (e) => {
  const name = e.target.name;
  if (name === 'projectSummary') updateCounter();
  if (name && document.getElementById(`err-${name}`)?.textContent) {
    const errors = RULES[currentStep] ? RULES[currentStep](getData()) : {};
    if (!errors[name]) setError(name, '');
  }
  updateDossier();
  saveDraft();
});

document.getElementById('year').textContent = new Date().getFullYear();
statusBox.setAttribute('tabindex', '-1');

loadDraft();
if (currentStep === 1) {
  syncAllCapCards(false);
  showStep(1, false);
}
updateDossier();
