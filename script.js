// Service categories and subcategories
const serviceCategories = {
    photo: {
        label: 'Foto Produk & Lifestyle',
        subcategories: [
            'AI Product Photography',
            'Foto produk e-commerce/marketplace',
            'Visual katalog produk',
            'Fashion/lookbook',
            'Foto makanan dan minuman'
        ]
    },
    video: {
        label: 'Video & Campaign',
        subcategories: [
            'Video komersial/iklan',
            'Video produk',
            'Kampanye peluncuran produk',
            'Video kampanye digital',
            'Konten media sosial',
            'TikTok/Reels/video pendek'
        ]
    },
    content: {
        label: 'Konten & Media Sosial',
        subcategories: [
            'Strategi media sosial',
            'Strategi konten',
            'Perencanaan konten bulanan',
            'Konten Instagram',
            'Konten TikTok',
            'Reels/video pendek',
            'Desain feed statis',
            'Carousel',
            'Copywriting/caption',
            'Pengelolaan media sosial'
        ]
    },
    brand: {
        label: 'Brand Strategy & Storytelling',
        subcategories: [
            'Strategi brand',
            'Brand positioning',
            'Purpose dan visi brand',
            'Brand story',
            'Brand messaging',
            'Key message',
            'Konsep kampanye',
            'Konsep kreatif',
            'Brand voice dan tone',
            'Customer journey storytelling'
        ]
    },
    visual: {
        label: 'Identitas Visual & Website',
        subcategories: [
            'Pengembangan logo',
            'Identitas visual',
            'Sistem identitas visual',
            'Brand guidelines',
            'Sistem warna dan tipografi',
            'Desain kemasan',
            'Website',
            'Landing page',
            'Kebutuhan web lainnya'
        ]
    },
    marketing: {
        label: 'Digital Marketing & Growth',
        subcategories: [
            'Strategi digital marketing',
            'Meta Ads',
            'TikTok Ads',
            'Google Ads',
            'Marketplace Ads',
            'Strategi landing page',
            'Analitik dan laporan performa'
        ]
    }
};

// Form state
let formData = {
    serviceCategory: [],
    serviceSubcategories: [],
    serviceOther: '',
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
    email: '',
    whatsapp: '',
    role: '',
    preferredContact: '',
    contactConsent: false
};

let currentStep = 1;

// Navigation
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    setupNavigation();
});

function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }
}

function initializeForm() {
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateFormData('serviceCategory', getAllCheckedValues('.category-checkbox'));
            updateSubcategories();
        });
    });

    // Restore saved form data if available
    const savedData = localStorage.getItem('briefFormData');
    if (savedData) {
        formData = JSON.parse(savedData);
        loadFormData();
    }

    showStep(1);
}

function updateSubcategories() {
    const selectedCategories = formData.serviceCategory;
    const container = document.getElementById('subcategoriesContainer');
    container.innerHTML = '';

    if (selectedCategories.length === 0) {
        return;
    }

    selectedCategories.forEach(categoryKey => {
        const category = serviceCategories[categoryKey];
        if (!category) return;

        const html = `
            <div class="subcategories">
                <div class="subcategories-title">${category.label}</div>
                <div class="checkbox-group">
                    ${category.subcategories.map(sub => `
                        <label class="checkbox-label">
                            <input type="checkbox" name="subcategory" value="${sub}" class="subcategory-checkbox" ${formData.serviceSubcategories.includes(sub) ? 'checked' : ''}>
                            <span>${sub}</span>
                        </label>
                    `).join('')}
                    <label class="checkbox-label">
                        <input type="checkbox" name="subcategory" value="${categoryKey}-other" class="subcategory-other-checkbox" data-category="${categoryKey}">
                        <span>Lainnya</span>
                    </label>
                </div>
                <div class="subcategory-other-input" id="other-input-${categoryKey}">
                    <input type="text" name="subcategory-other-${categoryKey}" class="form-input" placeholder="Jelaskan kebutuhan lainnya...">
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });

    // Add event listeners to subcategory checkboxes
    document.querySelectorAll('.subcategory-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateFormData('serviceSubcategories', getAllCheckedValues('.subcategory-checkbox'));
        });
    });

    // Add event listeners to "Lainnya" checkboxes
    document.querySelectorAll('.subcategory-other-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const categoryKey = e.target.dataset.category;
            const inputElement = document.getElementById(`other-input-${categoryKey}`);
            if (e.target.checked) {
                inputElement.classList.add('show');
            } else {
                inputElement.classList.remove('show');
            }
        });
    });
}

function openBriefWithService(serviceKey) {
    formData.serviceCategory = [serviceKey];
    formData.serviceSubcategories = [];
    loadFormData();
    updateSubcategories();
    document.getElementById('brief').scrollIntoView({ behavior: 'smooth' });
    showStep(1);
}

function nextStep(stepNum) {
    if (validateStep(stepNum)) {
        currentStep = stepNum + 1;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function previousStep(stepNum) {
    currentStep = stepNum - 1;
    showStep(currentStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function editStep(stepNum) {
    currentStep = stepNum;
    showStep(currentStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });

    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    // Update progress indicator
    updateProgressIndicator(step);
}

function updateProgressIndicator(step) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const totalSteps = 5;

    const percentage = (step / totalSteps) * 100;
    progressFill.style.width = percentage + '%';
    progressText.textContent = `Langkah ${step} dari ${totalSteps}`;
}

function validateStep(stepNum) {
    let isValid = true;
    const errors = {};

    // Clear all errors first
    document.querySelectorAll('.form-error').forEach(el => {
        el.classList.remove('show');
    });

    switch (stepNum) {
        case 1:
            if (formData.serviceCategory.length === 0) {
                errors.serviceCategory = 'Pilih minimal satu kebutuhan';
                isValid = false;
            }
            break;

        case 2:
            if (!formData.brandName.trim()) {
                errors.brandName = 'Nama brand diperlukan';
                isValid = false;
            }
            if (!formData.brandDescription.trim()) {
                errors.brandDescription = 'Deskripsi brand diperlukan';
                isValid = false;
            }
            if (!formData.hasVisualIdentity) {
                errors.hasVisualIdentity = 'Pilih salah satu opsi';
                isValid = false;
            }
            break;

        case 3:
            if (!formData.projectGoal.trim()) {
                errors.projectGoal = 'Tujuan proyek diperlukan';
                isValid = false;
            }
            break;

        case 4:
            if (!formData.projectStart) {
                errors.projectStart = 'Pilih waktu mulai proyek';
                isValid = false;
            }
            break;

        case 5:
            if (!formData.fullName.trim()) {
                errors.fullName = 'Nama lengkap diperlukan';
                isValid = false;
            }
            if (!validateEmail(formData.email)) {
                errors.email = 'Email tidak valid';
                isValid = false;
            }
            if (!formData.whatsapp.trim()) {
                errors.whatsapp = 'Nomor WhatsApp diperlukan';
                isValid = false;
            }
            if (!formData.preferredContact) {
                errors.preferredContact = 'Pilih cara terbaik dihubungi';
                isValid = false;
            }
            if (!formData.contactConsent) {
                errors.contactConsent = 'Anda harus setuju untuk dihubungi';
                isValid = false;
            }
            break;
    }

    // Display errors
    Object.entries(errors).forEach(([field, message]) => {
        const errorEl = document.getElementById(`${field}Error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    });

    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function updateFormData(field, value) {
    if (Array.isArray(value)) {
        formData[field] = value;
    } else {
        formData[field] = value;
    }
    saveFormData();
}

function saveFormData() {
    // Collect all form values
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
    formData.existingAssets = getAllCheckedValues('input[name="existingAssets"]');
    formData.additionalNotes = document.getElementById('additionalNotes')?.value || '';
    formData.fullName = document.getElementById('fullName')?.value || '';
    formData.email = document.getElementById('email')?.value || '';
    formData.whatsapp = document.getElementById('whatsapp')?.value || '';
    formData.role = document.getElementById('role')?.value || '';
    formData.preferredContact = document.querySelector('input[name="preferredContact"]:checked')?.value || '';
    formData.contactConsent = document.getElementById('contactConsent')?.checked || false;

    // Collect "Lainnya" inputs
    document.querySelectorAll('.subcategory-other-input input').forEach(input => {
        if (input.value.trim()) {
            const categoryKey = input.name.replace('subcategory-other-', '');
            if (!formData.serviceOther) formData.serviceOther = {};
            if (typeof formData.serviceOther !== 'object') {
                formData.serviceOther = {};
            }
            formData.serviceOther[categoryKey] = input.value;
        }
    });

    localStorage.setItem('briefFormData', JSON.stringify(formData));
}

function loadFormData() {
    // Load form data into fields
    if (document.getElementById('brandName')) document.getElementById('brandName').value = formData.brandName;
    if (document.getElementById('businessField')) document.getElementById('businessField').value = formData.businessField;
    if (document.getElementById('websiteSocial')) document.getElementById('websiteSocial').value = formData.websiteSocial;
    if (document.getElementById('brandDescription')) document.getElementById('brandDescription').value = formData.brandDescription;
    if (document.getElementById('projectGoal')) document.getElementById('projectGoal').value = formData.projectGoal;
    if (document.getElementById('targetAudience')) document.getElementById('targetAudience').value = formData.targetAudience;
    if (document.getElementById('challenges')) document.getElementById('challenges').value = formData.challenges;
    if (document.getElementById('expectedResults')) document.getElementById('expectedResults').value = formData.expectedResults;
    if (document.getElementById('references')) document.getElementById('references').value = formData.references;
    if (document.getElementById('deadline')) document.getElementById('deadline').value = formData.deadline;
    if (document.getElementById('budget')) document.getElementById('budget').value = formData.budget;
    if (document.getElementById('additionalNotes')) document.getElementById('additionalNotes').value = formData.additionalNotes;
    if (document.getElementById('fullName')) document.getElementById('fullName').value = formData.fullName;
    if (document.getElementById('email')) document.getElementById('email').value = formData.email;
    if (document.getElementById('whatsapp')) document.getElementById('whatsapp').value = formData.whatsapp;
    if (document.getElementById('role')) document.getElementById('role').value = formData.role;

    // Load checked values
    formData.serviceCategory.forEach(category => {
        const checkbox = document.querySelector(`input[name="serviceCategory"][value="${category}"]`);
        if (checkbox) checkbox.checked = true;
    });

    formData.serviceSubcategories.forEach(subcategory => {
        const checkbox = document.querySelector(`input[name="subcategory"][value="${subcategory}"]`);
        if (checkbox) checkbox.checked = true;
    });

    const hasVisualIdentityRadio = document.querySelector(`input[name="hasVisualIdentity"][value="${formData.hasVisualIdentity}"]`);
    if (hasVisualIdentityRadio) hasVisualIdentityRadio.checked = true;

    const projectStartRadio = document.querySelector(`input[name="projectStart"][value="${formData.projectStart}"]`);
    if (projectStartRadio) projectStartRadio.checked = true;

    formData.existingAssets.forEach(asset => {
        const checkbox = document.querySelector(`input[name="existingAssets"][value="${asset}"]`);
        if (checkbox) checkbox.checked = true;
    });

    const preferredContactRadio = document.querySelector(`input[name="preferredContact"][value="${formData.preferredContact}"]`);
    if (preferredContactRadio) preferredContactRadio.checked = true;

    if (document.getElementById('contactConsent')) {
        document.getElementById('contactConsent').checked = formData.contactConsent;
    }
}

function getAllCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector))
        .filter(el => el.checked)
        .map(el => el.value);
}

function showSummary() {
    if (validateStep(5)) {
        saveFormData();
        generateSummary();
        showStep('Summary');
    }
}

function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    const categoryLabels = formData.serviceCategory.map(cat => serviceCategories[cat]?.label || cat).join(', ');

    const summaryHTML = `
        <div class="summary-section">
            <div class="summary-section-title">
                Kebutuhan Layanan
                <button class="summary-edit-btn" onclick="editStep(1)">Edit</button>
            </div>
            <div class="summary-item">
                <div class="summary-value">${categoryLabels}</div>
            </div>
            ${formData.serviceSubcategories.length > 0 ? `
            <div class="summary-item">
                <div class="summary-label">Detail Layanan:</div>
                <div class="summary-value">${formData.serviceSubcategories.join(', ')}</div>
            </div>
            ` : ''}
        </div>

        <div class="summary-section">
            <div class="summary-section-title">
                Tentang Brand
                <button class="summary-edit-btn" onclick="editStep(2)">Edit</button>
            </div>
            <div class="summary-item">
                <div class="summary-label">Nama Brand:</div>
                <div class="summary-value">${formData.brandName}</div>
            </div>
            ${formData.businessField ? `
            <div class="summary-item">
                <div class="summary-label">Bidang Bisnis:</div>
                <div class="summary-value">${formData.businessField}</div>
            </div>
            ` : ''}
            ${formData.websiteSocial ? `
            <div class="summary-item">
                <div class="summary-label">Website/Media Sosial:</div>
                <div class="summary-value">${formData.websiteSocial}</div>
            </div>
            ` : ''}
            <div class="summary-item">
                <div class="summary-label">Deskripsi:</div>
                <div class="summary-value">${formData.brandDescription}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Status Logo/Panduan Visual:</div>
                <div class="summary-value">${formData.hasVisualIdentity}</div>
            </div>
        </div>

        <div class="summary-section">
            <div class="summary-section-title">
                Tujuan Proyek
                <button class="summary-edit-btn" onclick="editStep(3)">Edit</button>
            </div>
            <div class="summary-item">
                <div class="summary-label">Tujuan Utama:</div>
                <div class="summary-value">${formData.projectGoal}</div>
            </div>
            ${formData.targetAudience ? `
            <div class="summary-item">
                <div class="summary-label">Target Audiens:</div>
                <div class="summary-value">${formData.targetAudience}</div>
            </div>
            ` : ''}
            ${formData.challenges ? `
            <div class="summary-item">
                <div class="summary-label">Tantangan:</div>
                <div class="summary-value">${formData.challenges}</div>
            </div>
            ` : ''}
            ${formData.expectedResults ? `
            <div class="summary-item">
                <div class="summary-label">Hasil yang Diharapkan:</div>
                <div class="summary-value">${formData.expectedResults}</div>
            </div>
            ` : ''}
            ${formData.references ? `
            <div class="summary-item">
                <div class="summary-label">Referensi:</div>
                <div class="summary-value">${formData.references}</div>
            </div>
            ` : ''}
        </div>

        <div class="summary-section">
            <div class="summary-section-title">
                Rencana Proyek
                <button class="summary-edit-btn" onclick="editStep(4)">Edit</button>
            </div>
            <div class="summary-item">
                <div class="summary-label">Waktu Mulai:</div>
                <div class="summary-value">${formData.projectStart}</div>
            </div>
            ${formData.deadline ? `
            <div class="summary-item">
                <div class="summary-label">Tenggat Waktu:</div>
                <div class="summary-value">${formData.deadline}</div>
            </div>
            ` : ''}
            ${formData.budget ? `
            <div class="summary-item">
                <div class="summary-label">Anggaran:</div>
                <div class="summary-value">${formData.budget}</div>
            </div>
            ` : ''}
            ${formData.existingAssets.length > 0 ? `
            <div class="summary-item">
                <div class="summary-label">Aset yang Tersedia:</div>
                <div class="summary-value">${formData.existingAssets.join(', ')}</div>
            </div>
            ` : ''}
            ${formData.additionalNotes ? `
            <div class="summary-item">
                <div class="summary-label">Catatan Tambahan:</div>
                <div class="summary-value">${formData.additionalNotes}</div>
            </div>
            ` : ''}
        </div>

        <div class="summary-section">
            <div class="summary-section-title">
                Informasi Kontak
                <button class="summary-edit-btn" onclick="editStep(5)">Edit</button>
            </div>
            <div class="summary-item">
                <div class="summary-label">Nama Lengkap:</div>
                <div class="summary-value">${formData.fullName}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Email:</div>
                <div class="summary-value">${formData.email}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">WhatsApp:</div>
                <div class="summary-value">${formData.whatsapp}</div>
            </div>
            ${formData.role ? `
            <div class="summary-item">
                <div class="summary-label">Jabatan/Peran:</div>
                <div class="summary-value">${formData.role}</div>
            </div>
            ` : ''}
            <div class="summary-item">
                <div class="summary-label">Cara Terbaik Dihubungi:</div>
                <div class="summary-value">${formData.preferredContact}</div>
            </div>
        </div>
    `;

    summaryContent.innerHTML = summaryHTML;
    document.getElementById('stepSummary').classList.add('active');
    document.getElementById('progressIndicator').style.display = 'none';
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });

    if (step === 'Summary') {
        document.getElementById('stepSummary').classList.add('active');
        document.getElementById('progressIndicator').style.display = 'none';
        return;
    }

    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    document.getElementById('progressIndicator').style.display = 'block';
    updateProgressIndicator(step);
}

// Form submission
document.getElementById('briefForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitForm();
});

async function submitForm() {
    saveFormData();

    const submitButton = document.getElementById('submitButton');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoader = submitButton.querySelector('.btn-loader');

    submitButton.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';

    try {
        // Call the Google Apps Script endpoint
        const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                briefId: generateBriefId(),
                status: 'Baru',
                ...formData,
                serviceCategory: formData.serviceCategory.join(', '),
                serviceSubcategories: formData.serviceSubcategories.join(', '),
                existingAssets: formData.existingAssets.join(', ')
            })
        });

        if (!response.ok) {
            throw new Error('Pengiriman gagal. Silakan coba lagi.');
        }

        // Success
        document.getElementById('briefForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('progressIndicator').style.display = 'none';

        // Clear local storage
        localStorage.removeItem('briefFormData');

    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengirim brief. Silakan coba lagi: ' + error.message);
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitButton.disabled = false;
    }
}

function generateBriefId() {
    return 'BRIEF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Auto-save form data as user types
document.addEventListener('change', saveFormData);
document.addEventListener('input', (e) => {
    if (e.target.matches('input[type="text"], input[type="email"], input[type="tel"], textarea, select')) {
        saveFormData();
    }
});
