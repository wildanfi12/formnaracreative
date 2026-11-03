/**
 * NARA CREATIVE STUDIO — CLIENT APPLICATION & BRIEF SYSTEM
 * Official Website Script | V3 Clean Architecture
 * 
 * Features:
 * - 5-Step Interactive Brief Wizard with subcategory pills & "Lainnya" free input
 * - Persistent state management (In-memory + localStorage)
 * - User-friendly validation & clear error feedback
 * - Review / Summary screen with per-step edit triggers
 * - Secure Google Apps Script Web App submission
 * - Instant WhatsApp fallback with pre-filled brief details
 * - Accessible modals (ESC key, focus management, ARIA)
 * - Smooth navigation & scroll animations
 */

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  // Masukkan URL Deployment Google Apps Script setelah deploy Web App.
  // Contoh: 'https://script.google.com/macros/s/AKfycbw.../exec'
  APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_WEB_APP_URL',
  
  // ID Spreadsheet Google resmi Nara Creative
  SPREADSHEET_ID: '1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo',
  
  // Kontak Resmi Nara Creative
  OFFICIAL_WHATSAPP: '6281281886198',
  OFFICIAL_EMAIL: 'naracreativestudio.id@gmail.com',
  OFFICIAL_INSTAGRAM: '@naracreativestudio',
  
  // Storage key
  STORAGE_KEY: 'nara_creative_brief_v3'
};

// ============================================================================
// SERVICE TAXONOMY (6 Core Services A - F)
// ============================================================================
const SERVICE_CATEGORIES = {
  photo: {
    letter: 'A',
    label: 'Foto Produk & Lifestyle',
    subcategories: [
      'AI Product Photography',
      'Foto produk e-commerce & marketplace',
      'Visual katalog produk & lookbook',
      'Fashion & Apparel Lifestyle',
      'Fotografi makanan & minuman (F&B)'
    ]
  },
  video: {
    letter: 'B',
    label: 'Video & Campaign',
    subcategories: [
      'Video komersial & iklan digital',
      'Video showcase produk',
      'Kampanye peluncuran brand/produk',
      'Konten pendek TikTok & Reels high-engagement',
      'Video dokumentasi & event branding'
    ]
  },
  content: {
    letter: 'C',
    label: 'Konten & Media Sosial',
    subcategories: [
      'Strategi konten & editorial calendar',
      'Desain feed Instagram & carousels aesthetic',
      'Produksi short-form video harian',
      'Copywriting & caption storytelling',
      'Pengelolaan media sosial (end-to-end management)'
    ]
  },
  brand: {
    letter: 'D',
    label: 'Brand Strategy & Storytelling',
    subcategories: [
      'Brand positioning & market differentiation',
      'Purpose, visi, & brand narrative story',
      'Brand messaging & key communicative pillars',
      'Konsep ide kampanye kreatif',
      'Brand voice, tone, & customer journey mapping'
    ]
  },
  visual: {
    letter: 'E',
    label: 'Identitas Visual & Website',
    subcategories: [
      'Pengembangan logo & simbol brand',
      'Sistem identitas visual & brand guidelines',
      'Desain kemasan produk (packaging design)',
      'Desain website & landing page yang convert',
      'Company profile & collateral marketing'
    ]
  },
  marketing: {
    letter: 'F',
    label: 'Digital Marketing & Growth',
    subcategories: [
      'Strategi Meta Ads (Instagram & Facebook)',
      'TikTok Ads & creator amplification',
      'Google Ads (Search & Performance Max)',
      'Marketplace Ads (Shopee & Tokopedia)',
      'Analitik, CRO landing page, & laporan performa'
    ]
  }
};

// ============================================================================
// CASE STUDIES DATA (Authentic Deliverables - No Unsupported Numbers)
// ============================================================================
const CASE_STUDIES = {
  belayang: {
    title: 'Belayang Food Bali — Visual Culinary & Packaging',
    client: 'Belayang Food Bali',
    category: 'Foto Produk & Visual Branding',
    desc: 'Pengembangan visual lookbook kuliner khas Bali, fotografi makanan berselera tinggi, dan redesain kemasan produk untuk memperkuat identitas premium.',
    deliverables: ['Food Photography', 'Packaging Design', 'Social Media Templates', 'Visual Guidelines'],
    quote: 'Menciptakan daya tarik visual yang menggugah selera sekaligus mempertahankan autentisitas cita rasa lokal.'
  },
  howell: {
    title: 'Howell Flash Sale — Creative Campaign & Motion Asset',
    client: 'Howell Lifestyle',
    category: 'Video & Campaign Digital',
    desc: 'Produksi aset promosi digital dan video reels dengan pacing dinamis untuk kampanye penjualan khusus produk fashion & accessories.',
    deliverables: ['Promotional Video', 'Motion Graphics', 'Digital Advertising Creatives', 'Stories Assets'],
    quote: 'Visual dinamis yang dirancang khusus untuk memikat audiens muda dalam durasi 15 detik pertama.'
  },
  kalceri: {
    title: 'Kalceri Cafe — Brand Storytelling & Atmospheric Identity',
    client: 'Kalceri Coffee & Space',
    category: 'Brand Strategy & Lifestyle Visual',
    desc: 'Perumusan narasi brand berbasis kultur tempat berkumpul yang hangat, dilengkapi dokumentasi visual interior, produk kopi, dan aktivasi media sosial.',
    deliverables: ['Brand Story Guide', 'Interior & Menu Photography', 'Instagram Feed Architecture', 'Coffee Packaging Label'],
    quote: 'Menerjemahkan kenyamanan ruang dan aroma kopi menjadi identitas visual yang konsisten di dunia digital.'
  }
};

// ============================================================================
// APPLICATION STATE
// ============================================================================
let formData = {
  serviceCategory: [],
  serviceSubcategories: [],
  serviceOther: {},
  brandName: '',
  businessField: '',
  websiteSocial: '',
  brandDescription: '',
  hasVisualIdentity: '',
  projectGoal: '',
  targetAudience: '',
  challenges: '',
  expectedResults: '',
  references: '',
  projectStart: '',
  deadline: '',
  budget: '',
  existingAssets: [],
  additionalNotes: '',
  fullName: '',
  role: '',
  email: '',
  whatsapp: '',
  preferredContact: '',
  contactConsent: false
};

let currentStep = 1;
const TOTAL_STEPS = 5;

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initBriefSystem();
  initModals();
  restoreSavedState();
});

// ============================================================================
// NAVIGATION & HEADER
// ============================================================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky header class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    mobileNav?.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Smooth scroll and auto-close mobile drawer
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        
        // Close mobile drawer if open
        if (mobileNav?.classList.contains('open')) {
          navToggle?.classList.remove('open');
          mobileNav.classList.remove('open');
          navToggle?.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }

        scrollToTarget(targetId);
      }
    });
  });
}

function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  const navHeight = document.getElementById('navbar')?.offsetHeight || 70;
  const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - navHeight - 16;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.pageYOffset + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    }
  });
}

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-up-element').forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-up-element').forEach(el => observer.observe(el));
}

// ============================================================================
// MULTI-STEP BRIEF WIZARD
// ============================================================================
function initBriefSystem() {
  // Category checkbox changes (Step 1)
  const categoryCheckboxes = document.querySelectorAll('input[name="serviceCategory"]');
  categoryCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      handleCategoryChange();
    });
  });

  // Global inputs listening for reactive state preservation
  const briefContainer = document.getElementById('briefForm');
  if (briefContainer) {
    briefContainer.addEventListener('input', handleFormInput);
    briefContainer.addEventListener('change', handleFormInput);
  }

  // Next / Previous step buttons
  document.querySelectorAll('[data-action="next-step"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step') || currentStep, 10);
      nextStep(step);
    });
  });

  document.querySelectorAll('[data-action="prev-step"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step') || currentStep, 10);
      prevStep(step);
    });
  });

  // Form submit handler
  briefContainer?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit();
  });
}

function handleCategoryChange() {
  const checked = Array.from(document.querySelectorAll('input[name="serviceCategory"]:checked'))
    .map(cb => cb.value);
  
  formData.serviceCategory = checked;
  
  // Highlight parent card
  document.querySelectorAll('.category-choice-card').forEach(card => {
    const input = card.querySelector('input[name="serviceCategory"]');
    card.classList.toggle('selected', !!input && input.checked);
  });

  renderSubcategories();
  saveState();
}

function renderSubcategories() {
  const container = document.getElementById('subcategoriesContainer');
  if (!container) return;

  if (formData.serviceCategory.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-tertiary); font-size: 0.9rem; padding: 1rem 0;">
        Pilih minimal satu kategori layanan di atas untuk melihat rincian kebutuhan spesifik.
      </div>
    `;
    return;
  }

  let html = '';
  formData.serviceCategory.forEach(catKey => {
    const category = SERVICE_CATEGORIES[catKey];
    if (!category) return;

    const savedOtherVal = (formData.serviceOther && formData.serviceOther[catKey]) || '';

    html += `
      <div class="subcategory-group" data-cat="${catKey}">
        <div class="subcategory-title">${category.letter}. ${category.label}</div>
        <div class="subcategories-tags">
          ${category.subcategories.map(sub => {
            const isChecked = formData.serviceSubcategories.includes(sub);
            return `
              <label class="subcat-pill-label ${isChecked ? 'checked' : ''}">
                <input type="checkbox" name="serviceSubcategory" value="${escapeHtml(sub)}" ${isChecked ? 'checked' : ''} onchange="handleSubcatCheck(this)">
                <span>${escapeHtml(sub)}</span>
              </label>
            `;
          }).join('')}
          
          <label class="subcat-pill-label ${savedOtherVal ? 'checked' : ''}">
            <input type="checkbox" name="serviceOtherCheck_${catKey}" value="other" ${savedOtherVal ? 'checked' : ''} onchange="toggleOtherInput('${catKey}', this.checked)">
            <span>Kebutuhan Lainnya...</span>
          </label>
        </div>
        <div class="other-input-wrap ${savedOtherVal ? 'show' : ''}" id="otherWrap_${catKey}">
          <input type="text" class="form-control" style="font-size: 0.875rem;" placeholder="Jelaskan kebutuhan spesifik lainnya untuk ${category.label}..." value="${escapeHtml(savedOtherVal)}" oninput="handleOtherText('${catKey}', this.value)">
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.handleSubcatCheck = function(checkbox) {
  const label = checkbox.closest('.subcat-pill-label');
  if (label) {
    label.classList.toggle('checked', checkbox.checked);
  }
  
  formData.serviceSubcategories = Array.from(document.querySelectorAll('input[name="serviceSubcategory"]:checked'))
    .map(cb => cb.value);
  
  saveState();
};

window.toggleOtherInput = function(catKey, isChecked) {
  const wrap = document.getElementById(`otherWrap_${catKey}`);
  if (wrap) {
    wrap.classList.toggle('show', isChecked);
    if (!isChecked) {
      if (formData.serviceOther) delete formData.serviceOther[catKey];
      const input = wrap.querySelector('input');
      if (input) input.value = '';
    }
  }
  saveState();
};

window.handleOtherText = function(catKey, value) {
  if (!formData.serviceOther) formData.serviceOther = {};
  formData.serviceOther[catKey] = value;
  saveState();
};

// Open brief and pre-select a specific service from Service Cards
window.openBriefWithService = function(serviceKey) {
  const checkbox = document.querySelector(`input[name="serviceCategory"][value="${serviceKey}"]`);
  if (checkbox) {
    checkbox.checked = true;
    handleCategoryChange();
  }
  
  // Show brief modal if in modal mode, or scroll to brief
  const briefModal = document.getElementById('briefModal');
  if (briefModal) {
    openModal('briefModal');
  } else {
    scrollToTarget('#brief');
  }

  showStep(1);
};

// ============================================================================
// STEP TRANSITIONS & PROGRESS
// ============================================================================
function showStep(step) {
  currentStep = step;

  // Toggle active step DOM
  document.querySelectorAll('.form-step').forEach(el => {
    el.classList.remove('active');
  });

  const targetStepEl = document.getElementById(`step${step}`);
  if (targetStepEl) {
    targetStepEl.classList.add('active');
  }

  // Update progress indicators
  updateProgress(step);

  // If entering review summary step, generate review DOM
  if (step === 'Summary' || step === 6) {
    generateSummary();
  }

  // Scroll to brief header smoothly
  const briefCard = document.getElementById('briefCardContainer');
  if (briefCard && currentStep !== 1) {
    const rect = briefCard.getBoundingClientRect();
    if (rect.top < 0 || rect.top > 250) {
      briefCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function updateProgress(step) {
  const progressFill = document.getElementById('progressFill');
  const progressStepLabel = document.getElementById('progressStepLabel');
  const progressPercentLabel = document.getElementById('progressPercentLabel');

  const stepNumber = typeof step === 'number' ? step : 5;
  const percentage = Math.min(100, Math.round((stepNumber / TOTAL_STEPS) * 100));

  if (progressFill) progressFill.style.width = `${percentage}%`;
  
  if (progressStepLabel) {
    if (step === 'Summary' || step === 6) {
      progressStepLabel.textContent = 'Review & Kirim Brief';
    } else {
      progressStepLabel.textContent = `Langkah ${step} dari ${TOTAL_STEPS}`;
    }
  }

  if (progressPercentLabel) {
    progressPercentLabel.textContent = `${percentage}% Selesai`;
  }

  // Update step pills
  document.querySelectorAll('.step-pill').forEach(pill => {
    const pillStep = parseInt(pill.getAttribute('data-step-pill'), 10);
    pill.classList.remove('active', 'completed');
    if (pillStep === stepNumber) {
      pill.classList.add('active');
    } else if (pillStep < stepNumber) {
      pill.classList.add('completed');
    }
  });
}

function nextStep(stepNum) {
  if (validateStep(stepNum)) {
    saveCurrentStepInputs();
    if (stepNum === 5) {
      showStep('Summary');
    } else {
      showStep(stepNum + 1);
    }
  }
}

function prevStep(stepNum) {
  saveCurrentStepInputs();
  if (stepNum === 'Summary' || stepNum === 6) {
    showStep(5);
  } else if (stepNum > 1) {
    showStep(stepNum - 1);
  }
}

window.editStep = function(stepNum) {
  showStep(stepNum);
};

// ============================================================================
// VALIDATION & FIELD CHECKS
// ============================================================================
function validateStep(stepNum) {
  let isValid = true;
  clearErrors();

  switch (stepNum) {
    case 1:
      if (!formData.serviceCategory || formData.serviceCategory.length === 0) {
        showError('serviceCategoryError', 'Mohon pilih minimal satu kategori layanan yang Anda butuhkan.');
        isValid = false;
      }
      break;

    case 2:
      if (!formData.brandName.trim()) {
        showError('brandNameError', 'Nama brand wajib diisi.');
        markInvalid('brandName');
        isValid = false;
      }
      if (!formData.businessField.trim()) {
        showError('businessFieldError', 'Bidang bisnis/industri wajib diisi.');
        markInvalid('businessField');
        isValid = false;
      }
      if (!formData.brandDescription.trim()) {
        showError('brandDescriptionError', 'Ceritakan sedikit tentang brand atau produk Anda.');
        markInvalid('brandDescription');
        isValid = false;
      }
      if (!formData.hasVisualIdentity) {
        showError('hasVisualIdentityError', 'Pilih salah satu status identitas visual brand Anda.');
        isValid = false;
      }
      break;

    case 3:
      if (!formData.projectGoal.trim()) {
        showError('projectGoalError', 'Mohon jelaskan tujuan utama dari proyek kreatif ini.');
        markInvalid('projectGoal');
        isValid = false;
      }
      break;

    case 4:
      if (!formData.projectStart) {
        showError('projectStartError', 'Pilih perkiraan waktu mulai proyek.');
        isValid = false;
      }
      break;

    case 5:
      if (!formData.fullName.trim()) {
        showError('fullNameError', 'Nama lengkap wajib diisi.');
        markInvalid('fullName');
        isValid = false;
      }
      if (!formData.email.trim() || !isValidEmail(formData.email)) {
        showError('emailError', 'Masukkan format email aktif yang valid (contoh: nama@domain.com).');
        markInvalid('email');
        isValid = false;
      }
      if (!formData.whatsapp.trim() || formData.whatsapp.length < 8) {
        showError('whatsappError', 'Masukkan nomor WhatsApp aktif yang bisa dihubungi.');
        markInvalid('whatsapp');
        isValid = false;
      }
      if (!formData.preferredContact) {
        showError('preferredContactError', 'Pilih cara terbaik bagi tim Nara untuk menghubungi Anda.');
        isValid = false;
      }
      if (!formData.contactConsent) {
        showError('contactConsentError', 'Persetujuan untuk dihubungi wajib dicentang sebelum mengirim brief.');
        isValid = false;
      }
      break;
  }

  if (!isValid) {
    // Focus first invalid element
    const firstInvalid = document.querySelector('.is-invalid, .form-error-msg.show');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return isValid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.classList.add('show');
  }
}

function markInvalid(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.add('is-invalid');
  }
}

function clearErrors() {
  document.querySelectorAll('.form-error-msg').forEach(el => {
    el.textContent = '';
    el.classList.remove('show');
  });
  document.querySelectorAll('.is-invalid').forEach(el => {
    el.classList.remove('is-invalid');
  });
}

// ============================================================================
// DATA PERSISTENCE & STATE SYNC
// ============================================================================
function handleFormInput(e) {
  saveCurrentStepInputs();
  // Clear error on active input
  if (e.target && e.target.classList.contains('is-invalid')) {
    e.target.classList.remove('is-invalid');
  }
}

function saveCurrentStepInputs() {
  formData.brandName = document.getElementById('brandName')?.value || '';
  formData.businessField = document.getElementById('businessField')?.value || '';
  formData.websiteSocial = document.getElementById('websiteSocial')?.value || '';
  formData.brandDescription = document.getElementById('brandDescription')?.value || '';
  formData.hasVisualIdentity = document.querySelector('input[name="hasVisualIdentity"]:checked')?.value || '';

  formData.projectGoal = document.getElementById('projectGoal')?.value || '';
  formData.targetAudience = document.getElementById('targetAudience')?.value || '';
  formData.challenges = document.getElementById('challenges')?.value || '';
  formData.expectedResults = document.getElementById('expectedResults')?.value || '';
  formData.references = document.getElementById('references')?.value || '';

  formData.projectStart = document.querySelector('input[name="projectStart"]:checked')?.value || '';
  formData.deadline = document.getElementById('deadline')?.value || '';
  formData.budget = document.getElementById('budget')?.value || '';
  formData.existingAssets = Array.from(document.querySelectorAll('input[name="existingAssets"]:checked')).map(el => el.value);
  formData.additionalNotes = document.getElementById('additionalNotes')?.value || '';

  formData.fullName = document.getElementById('fullName')?.value || '';
  formData.role = document.getElementById('role')?.value || '';
  formData.email = document.getElementById('email')?.value || '';
  formData.whatsapp = document.getElementById('whatsapp')?.value || '';
  formData.preferredContact = document.querySelector('input[name="preferredContact"]:checked')?.value || '';
  formData.contactConsent = document.getElementById('contactConsent')?.checked || false;

  saveState();
}

function saveState() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(formData));
  } catch (err) {
    console.warn('Unable to save state to localStorage:', err);
  }
}

function restoreSavedState() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && typeof saved === 'object') {
      formData = Object.assign(formData, saved);
      populateFormFromState();
    }
  } catch (err) {
    console.warn('Unable to parse saved state:', err);
  }
}

function populateFormFromState() {
  // Step 1 Checkboxes
  if (Array.isArray(formData.serviceCategory)) {
    formData.serviceCategory.forEach(cat => {
      const cb = document.querySelector(`input[name="serviceCategory"][value="${cat}"]`);
      if (cb) {
        cb.checked = true;
        cb.closest('.category-choice-card')?.classList.add('selected');
      }
    });
    renderSubcategories();
  }

  // Populate standard inputs
  const fields = [
    'brandName', 'businessField', 'websiteSocial', 'brandDescription',
    'projectGoal', 'targetAudience', 'challenges', 'expectedResults', 'references',
    'deadline', 'budget', 'additionalNotes', 'fullName', 'role', 'email', 'whatsapp'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && formData[id] !== undefined) {
      el.value = formData[id];
    }
  });

  // Radios
  if (formData.hasVisualIdentity) {
    const r = document.querySelector(`input[name="hasVisualIdentity"][value="${formData.hasVisualIdentity}"]`);
    if (r) {
      r.checked = true;
      r.closest('.radio-card')?.classList.add('selected');
    }
  }

  if (formData.projectStart) {
    const r = document.querySelector(`input[name="projectStart"][value="${formData.projectStart}"]`);
    if (r) {
      r.checked = true;
      r.closest('.radio-card')?.classList.add('selected');
    }
  }

  if (formData.preferredContact) {
    const r = document.querySelector(`input[name="preferredContact"][value="${formData.preferredContact}"]`);
    if (r) {
      r.checked = true;
      r.closest('.radio-card')?.classList.add('selected');
    }
  }

  // Checkboxes
  if (Array.isArray(formData.existingAssets)) {
    formData.existingAssets.forEach(asset => {
      const cb = document.querySelector(`input[name="existingAssets"][value="${asset}"]`);
      if (cb) cb.checked = true;
    });
  }

  const consentCb = document.getElementById('contactConsent');
  if (consentCb && formData.contactConsent) {
    consentCb.checked = true;
  }
}

// Reset Form
window.resetBriefForm = function() {
  if (confirm('Apakah Anda yakin ingin mengulang pengisian brief dari awal?')) {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    window.location.reload();
  }
};

// ============================================================================
// SUMMARY GENERATOR
// ============================================================================
function generateSummary() {
  const container = document.getElementById('summaryCardsContainer');
  if (!container) return;

  const categoryLabels = formData.serviceCategory.map(key => {
    const cat = SERVICE_CATEGORIES[key];
    return cat ? `${cat.letter}. ${cat.label}` : key;
  }).join('<br>• ');

  const otherEntries = formData.serviceOther && typeof formData.serviceOther === 'object'
    ? Object.entries(formData.serviceOther).map(([k, v]) => `• ${SERVICE_CATEGORIES[k]?.label || k}: ${v}`).join('<br>')
    : '';

  const summaryHTML = `
    <!-- Section 1 -->
    <div class="summary-card">
      <div class="summary-card-header">
        <h4>1. Kebutuhan Layanan</h4>
        <button type="button" class="btn-edit-step" onclick="editStep(1)">Ubah</button>
      </div>
      <div class="summary-row">
        <span class="summary-key">Kategori:</span>
        <span class="summary-val">• ${categoryLabels || '-'}</span>
      </div>
      ${formData.serviceSubcategories.length > 0 ? `
      <div class="summary-row">
        <span class="summary-key">Detail Layanan:</span>
        <span class="summary-val">${formData.serviceSubcategories.join(', ')}</span>
      </div>
      ` : ''}
      ${otherEntries ? `
      <div class="summary-row">
        <span class="summary-key">Layanan Lainnya:</span>
        <span class="summary-val">${otherEntries}</span>
      </div>
      ` : ''}
    </div>

    <!-- Section 2 -->
    <div class="summary-card">
      <div class="summary-card-header">
        <h4>2. Tentang Brand</h4>
        <button type="button" class="btn-edit-step" onclick="editStep(2)">Ubah</button>
      </div>
      <div class="summary-row">
        <span class="summary-key">Nama Brand:</span>
        <span class="summary-val">${escapeHtml(formData.brandName)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">Bidang Bisnis:</span>
        <span class="summary-val">${escapeHtml(formData.businessField)}</span>
      </div>
      ${formData.websiteSocial ? `
      <div class="summary-row">
        <span class="summary-key">Web / Sosmed:</span>
        <span class="summary-val">${escapeHtml(formData.websiteSocial)}</span>
      </div>
      ` : ''}
      <div class="summary-row">
        <span class="summary-key">Deskripsi Brand:</span>
        <span class="summary-val">${escapeHtml(formData.brandDescription)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">Status Visual:</span>
        <span class="summary-val">${escapeHtml(formData.hasVisualIdentity)}</span>
      </div>
    </div>

    <!-- Section 3 -->
    <div class="summary-card">
      <div class="summary-card-header">
        <h4>3. Tujuan Proyek</h4>
        <button type="button" class="btn-edit-step" onclick="editStep(3)">Ubah</button>
      </div>
      <div class="summary-row">
        <span class="summary-key">Tujuan Utama:</span>
        <span class="summary-val">${escapeHtml(formData.projectGoal)}</span>
      </div>
      ${formData.targetAudience ? `
      <div class="summary-row">
        <span class="summary-key">Target Audiens:</span>
        <span class="summary-val">${escapeHtml(formData.targetAudience)}</span>
      </div>
      ` : ''}
      ${formData.challenges ? `
      <div class="summary-row">
        <span class="summary-key">Tantangan:</span>
        <span class="summary-val">${escapeHtml(formData.challenges)}</span>
      </div>
      ` : ''}
      ${formData.expectedResults ? `
      <div class="summary-row">
        <span class="summary-key">Hasil Diharapkan:</span>
        <span class="summary-val">${escapeHtml(formData.expectedResults)}</span>
      </div>
      ` : ''}
      ${formData.references ? `
      <div class="summary-row">
        <span class="summary-key">Referensi:</span>
        <span class="summary-val">${escapeHtml(formData.references)}</span>
      </div>
      ` : ''}
    </div>

    <!-- Section 4 -->
    <div class="summary-card">
      <div class="summary-card-header">
        <h4>4. Rencana Proyek</h4>
        <button type="button" class="btn-edit-step" onclick="editStep(4)">Ubah</button>
      </div>
      <div class="summary-row">
        <span class="summary-key">Waktu Mulai:</span>
        <span class="summary-val">${escapeHtml(formData.projectStart)}</span>
      </div>
      ${formData.deadline ? `
      <div class="summary-row">
        <span class="summary-key">Tenggat Waktu:</span>
        <span class="summary-val">${escapeHtml(formData.deadline)}</span>
      </div>
      ` : ''}
      ${formData.budget ? `
      <div class="summary-row">
        <span class="summary-key">Anggaran:</span>
        <span class="summary-val">${escapeHtml(formData.budget)}</span>
      </div>
      ` : ''}
      ${formData.existingAssets.length > 0 ? `
      <div class="summary-row">
        <span class="summary-key">Aset Tersedia:</span>
        <span class="summary-val">${formData.existingAssets.join(', ')}</span>
      </div>
      ` : ''}
      ${formData.additionalNotes ? `
      <div class="summary-row">
        <span class="summary-key">Catatan:</span>
        <span class="summary-val">${escapeHtml(formData.additionalNotes)}</span>
      </div>
      ` : ''}
    </div>

    <!-- Section 5 -->
    <div class="summary-card">
      <div class="summary-card-header">
        <h4>5. Informasi Kontak</h4>
        <button type="button" class="btn-edit-step" onclick="editStep(5)">Ubah</button>
      </div>
      <div class="summary-row">
        <span class="summary-key">Nama:</span>
        <span class="summary-val">${escapeHtml(formData.fullName)} ${formData.role ? `(${escapeHtml(formData.role)})` : ''}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">Email:</span>
        <span class="summary-val">${escapeHtml(formData.email)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">WhatsApp:</span>
        <span class="summary-val">${escapeHtml(formData.whatsapp)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">Preferensi Kontak:</span>
        <span class="summary-val">${escapeHtml(formData.preferredContact)}</span>
      </div>
    </div>
  `;

  container.innerHTML = summaryHTML;
}

// ============================================================================
// GOOGLE SHEETS & APPS SCRIPT SUBMISSION
// ============================================================================
async function handleFormSubmit() {
  saveCurrentStepInputs();

  const submitBtn = document.getElementById('submitBriefBtn');
  const errorAlert = document.getElementById('briefFormErrorAlert');
  if (errorAlert) {
    errorAlert.classList.remove('show');
    errorAlert.innerHTML = '';
  }

  // Set loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Mengirim Brief ke Nara Creative...';
  }

  const briefId = generateBriefId();
  const timestamp = new Date().toISOString();

  // Prepare payload matching Apps Script structure
  const serviceOtherCombined = formData.serviceOther && typeof formData.serviceOther === 'object'
    ? Object.entries(formData.serviceOther).map(([k, v]) => `${SERVICE_CATEGORIES[k]?.label || k}: ${v}`).join('; ')
    : '';

  const payload = {
    timestamp: timestamp,
    briefId: briefId,
    status: 'Baru',
    fullName: formData.fullName,
    email: formData.email,
    whatsapp: formData.whatsapp,
    role: formData.role,
    preferredContact: formData.preferredContact,
    brandName: formData.brandName,
    businessField: formData.businessField,
    websiteSocial: formData.websiteSocial,
    brandDescription: formData.brandDescription,
    hasVisualIdentity: formData.hasVisualIdentity,
    serviceCategory: formData.serviceCategory.map(k => SERVICE_CATEGORIES[k]?.label || k).join(', '),
    serviceSubcategories: formData.serviceSubcategories.join(', '),
    serviceOther: serviceOtherCombined,
    projectGoal: formData.projectGoal,
    targetAudience: formData.targetAudience,
    challenges: formData.challenges,
    expectedResults: formData.expectedResults,
    references: formData.references,
    projectStart: formData.projectStart,
    deadline: formData.deadline,
    budget: formData.budget,
    existingAssets: formData.existingAssets.join(', '),
    additionalNotes: formData.additionalNotes,
    contactConsent: formData.contactConsent
  };

  // Check if Web App is configured
  const isDefaultUrl = !CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT_WEB_APP_URL');

  if (isDefaultUrl) {
    // Web App URL is not yet connected by user
    setTimeout(() => {
      handleDeploymentNotConnected(briefId, payload);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Kirim Brief Sekarang →';
      }
    }, 700);
    return;
  }

  try {
    // Attempt POST to Google Apps Script
    const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // In cases where Apps Script redirects with 302/HTML
      result = { success: response.ok };
    }

    if (result && result.success) {
      handleSubmissionSuccess(briefId);
    } else {
      throw new Error(result?.message || 'Server Google Sheets mengembalikan status kegagalan.');
    }
  } catch (err) {
    console.error('Submission error:', err);
    handleSubmissionError(err, briefId, payload);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Coba Kirim Ulang →';
    }
  }
}

function handleSubmissionSuccess(briefId) {
  // Hide form steps & indicator
  const formElement = document.getElementById('briefForm');
  const progressHeader = document.querySelector('.brief-progress-header');
  const successView = document.getElementById('briefSuccessView');
  const displayId = document.getElementById('successBriefIdDisplay');

  if (formElement) formElement.style.display = 'none';
  if (progressHeader) progressHeader.style.display = 'none';
  if (successView) successView.style.display = 'block';
  if (displayId) displayId.textContent = briefId;

  // Set WhatsApp notification button
  const waBtn = document.getElementById('btnNotifyWhatsapp');
  if (waBtn) {
    const waText = encodeURIComponent(
      `Halo Nara Creative Studio, saya baru saja mengirimkan brief proyek melalui website!\n\n` +
      `• Brief ID: ${briefId}\n` +
      `• Brand: ${formData.brandName}\n` +
      `• Nama: ${formData.fullName}\n` +
      `• Layanan: ${formData.serviceCategory.map(k => SERVICE_CATEGORIES[k]?.label || k).join(', ')}\n\n` +
      `Mohon dicek ya, terima kasih!`
    );
    waBtn.href = `https://wa.me/${CONFIG.OFFICIAL_WHATSAPP}?text=${waText}`;
  }

  // Clear local storage
  localStorage.removeItem(CONFIG.STORAGE_KEY);

  // Scroll to success view
  successView?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleDeploymentNotConnected(briefId, payload) {
  const errorAlert = document.getElementById('briefFormErrorAlert');
  if (!errorAlert) return;

  const waText = encodeURIComponent(
    `Halo Nara Creative Studio, saya ingin mengirimkan brief proyek:\n\n` +
    `• Brief ID: ${briefId}\n` +
    `• Brand: ${payload.brandName} (${payload.businessField})\n` +
    `• Klien: ${payload.fullName} (${payload.whatsapp})\n` +
    `• Layanan: ${payload.serviceCategory}\n` +
    `• Rincian: ${payload.serviceSubcategories || '-'}\n` +
    `• Tujuan: ${payload.projectGoal}\n` +
    `• Waktu Mulai: ${payload.projectStart}\n` +
    `• Budget: ${payload.budget || 'Fleksibel'}\n\n` +
    `Catatan: Brief ini dikirimkan via WhatsApp resmi karena URL Apps Script spreadsheet sedang dalam proses deployment.`
  );

  errorAlert.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1rem;">
      Informasi: Spreadsheet Web App Belum Terhubung
    </div>
    <p style="margin-bottom: 1rem; color: var(--text-secondary);">
      URL Google Apps Script Web App masih menggunakan placeholder default. Data brief Anda <strong>TETAP AMAN</strong> dan tidak hilang.
    </p>
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
      <a href="https://wa.me/${CONFIG.OFFICIAL_WHATSAPP}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        Kirim Brief Langsung via WhatsApp (+62 812-8188-6198)
      </a>
      <button type="button" class="btn btn-secondary btn-sm" onclick="showDeploymentHelp()">
        Panduan Setup Apps Script
      </button>
    </div>
  `;
  errorAlert.classList.add('show');
  errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleSubmissionError(err, briefId, payload) {
  const errorAlert = document.getElementById('briefFormErrorAlert');
  if (!errorAlert) return;

  const waText = encodeURIComponent(
    `Halo Nara Creative Studio, saya mengisi brief di website namun mengalami kendala jaringan saat pengiriman ke Sheets.\n\n` +
    `• Brief ID: ${briefId}\n` +
    `• Brand: ${payload.brandName}\n` +
    `• Kontak: ${payload.fullName} (${payload.whatsapp})\n` +
    `• Layanan: ${payload.serviceCategory}\n` +
    `• Tujuan Proyek: ${payload.projectGoal}\n\n` +
    `Mohon dibantu koordinasi via WhatsApp ya!`
  );

  errorAlert.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 0.5rem;">
      Pengiriman Mengalami Kendala Jaringan
    </div>
    <p style="margin-bottom: 1rem; color: var(--text-secondary);">
      Koneksi ke server Google Sheets terhambat (${escapeHtml(err.message)}). Anda dapat mencoba kembali atau langsung mengirimkan ringkasan brief ini ke WhatsApp resmi Nara Creative.
    </p>
    <a href="https://wa.me/${CONFIG.OFFICIAL_WHATSAPP}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
      Kirim via WhatsApp Resmi (+62 812-8188-6198)
    </a>
  `;
  errorAlert.classList.add('show');
  errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function generateBriefId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `NARA-${dateStr}-${rand}`;
}

window.copyBriefId = function() {
  const idEl = document.getElementById('successBriefIdDisplay');
  if (idEl) {
    navigator.clipboard.writeText(idEl.textContent.trim()).then(() => {
      alert('Brief ID berhasil disalin ke clipboard!');
    }).catch(() => {
      prompt('Salin Brief ID:', idEl.textContent.trim());
    });
  }
};

// ============================================================================
// MODAL MANAGEMENT & ACCESSIBILITY
// ============================================================================
function initModals() {
  // ESC key closes all open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Background backdrop click dismiss
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // Modal close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal.id);
    });
  });
}

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus close button for accessibility
    modal.querySelector('.modal-close-btn')?.focus();
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

window.closeAllModals = function() {
  document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
    closeModal(modal.id);
  });
};

// Case Study Modal Viewer
window.openCaseStudy = function(caseKey) {
  const data = CASE_STUDIES[caseKey];
  if (!data) return;

  const contentArea = document.getElementById('caseStudyContent');
  if (contentArea) {
    contentArea.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span class="section-tag" style="margin-bottom: 0.75rem;">${escapeHtml(data.category)}</span>
        <h3 style="font-size: 1.65rem; margin-bottom: 0.5rem;">${escapeHtml(data.title)}</h3>
        <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6;">${escapeHtml(data.desc)}</p>
      </div>

      <div style="background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border-light);">
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">Lingkup Pekerjaan & Deliverables:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.deliverables.map(d => `<span class="work-pill" style="font-size: 0.8125rem; padding: 0.35rem 0.75rem; background: var(--bg-surface); border: 1px solid var(--border-medium);">${escapeHtml(d)}</span>`).join('')}
        </div>
      </div>

      <blockquote style="border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--text-secondary); font-style: italic; margin-bottom: 2rem;">
        "${escapeHtml(data.quote)}"
      </blockquote>

      <div style="display: flex; justify-content: flex-end; gap: 1rem;">
        <button type="button" class="btn btn-secondary" onclick="closeModal('caseStudyModal')">Tutup</button>
        <button type="button" class="btn btn-primary" onclick="closeModal('caseStudyModal'); openBriefWithService('photo');">Mulai Brief Serupa →</button>
      </div>
    `;
  }

  openModal('caseStudyModal');
};

// Quick Contact Form (Split section in footer/contact)
window.handleQuickInquiry = function(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.elements['quickName']?.value.trim() || '';
  const contact = form.elements['quickContact']?.value.trim() || '';
  const message = form.elements['quickMessage']?.value.trim() || '';

  if (!name || !contact) {
    alert('Mohon isi nama dan kontak Anda.');
    return;
  }

  const waText = encodeURIComponent(
    `Halo Nara Creative Studio, saya ${name} (${contact}).\n\n` +
    `Pertanyaan: ${message || 'Saya ingin konsultasi proyek kreatif untuk brand saya.'}`
  );

  window.open(`https://wa.me/${CONFIG.OFFICIAL_WHATSAPP}?text=${waText}`, '_blank');
  form.reset();
};

window.showDeploymentHelp = function() {
  alert(
    'PANDUAN SINGKAT SETUP APPS SCRIPT:\n\n' +
    '1. Buka Google Sheets:\nhttps://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit\n\n' +
    '2. Klik Extensions > Apps Script.\n' +
    '3. Paste kode dari file apps-script-backend.gs.\n' +
    '4. Klik Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).\n' +
    '5. Salin Web App URL dan masukkan ke CONFIG.APPS_SCRIPT_URL di app.js.'
  );
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
