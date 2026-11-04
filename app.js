// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL',
    SPREADSHEET_ID: '1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo',
    WHATSAPP: '6281281886198',
    EMAIL: 'naracreativestudio.id@gmail.com',
    INSTAGRAM: '@naracreativestudio'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // initCursor(); - native OS cursor used per user instruction
    initNavigation();
    initScrollAnimations();
    initStatCounters();
    initServiceCards();
    setupModals();
});

// Custom Cursor
function initCursor() {
    // Disabled: native OS cursor active per user instruction
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth Scroll
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .timeline-item, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Stat Counters
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    let count = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    
                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            stat.textContent = Math.floor(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.textContent = target;
                        }
                    };
                    
                    updateCount();
                });
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Service Cards Interaction
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.getAttribute('data-service');
            openModal('brief');
            
            // Pre-select the service in modal
            setTimeout(() => {
                const checkboxes = document.querySelectorAll('#briefModal input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    if (checkbox.parentElement.textContent.toLowerCase().includes(service)) {
                        checkbox.checked = true;
                    }
                });
            }, 100);
        });
        
        // Tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Modal System
function setupModals() {
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(modalType) {
    let modalId;
    
    switch(modalType) {
        case 'brief':
            modalId = 'briefModal';
            break;
        case 'chat':
            // Open WhatsApp in new tab
            window.open('https://wa.me/6281281886198?text=Halo%20Nara%20Creative!%20Saya%20ingin%20berdiskusi%20tentang%20proyek.', '_blank');
            return;
        case 'caseStudy':
            // Could open a dedicated case study modal
            alert('Case study details akan segera tersedia. Untuk informasi lebih lanjut, hubungi kami via WhatsApp!');
            return;
        case 'success':
            modalId = 'successModal';
            break;
        default:
            return;
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Form Handlers
function handleQuickContact(e) {
    e.preventDefault();
    
    const form = e.target;
    const name = form.querySelector('input[type="text"]')?.value || '';
    const email = form.querySelector('input[type="email"]')?.value || '';
    const phone = form.querySelector('input[type="tel"]')?.value || '';
    const message = form.querySelector('textarea')?.value || '';
    
    const waMessage = encodeURIComponent(
        'Halo Nara Creative Studio!\n\n' +
        '*Nama:* ' + name + '\n' +
        '*Email:* ' + email + '\n' +
        '*WhatsApp:* ' + phone + '\n' +
        '*Pesan/Kebutuhan:* ' + message
    );
    
    window.open('https://wa.me/' + CONFIG.WHATSAPP + '?text=' + waMessage, '_blank');
    form.reset();
    showNotification('Pesan siap diteruskan ke WhatsApp Studio Nara Creative.', 'success');
}

async function handleBriefSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Mengirim Brief...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Get selected services
    const services = [];
    form.querySelectorAll('input[name="service"]:checked').forEach(checkbox => {
        services.push(checkbox.parentElement.textContent.trim());
    });
    data.services = services.join(', ');
    
    const briefId = 'BRIEF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    // Prepare data for Google Sheets
    const briefData = {
        briefId: briefId,
        timestamp: new Date().toISOString(),
        brandName: form.querySelector('input[placeholder*="Brand"]')?.value || form.elements[0]?.value || '',
        industry: form.querySelector('input[placeholder*="Fashion"]')?.value || '',
        services: data.services,
        projectDetails: form.querySelector('textarea')?.value || '',
        timeline: form.querySelectorAll('select')[0]?.value || '',
        budget: form.querySelectorAll('select')[1]?.value || '',
        fullName: form.querySelector('input[type="text"]:not([placeholder*="Brand"]):not([placeholder*="Fashion"])')?.value || '',
        email: form.querySelector('input[type="email"]')?.value || '',
        whatsapp: form.querySelector('input[type="tel"]')?.value || '',
        status: 'Baru'
    };
    
    // Always backup to localStorage
    try {
        localStorage.setItem('nara_last_brief', JSON.stringify(briefData));
    } catch(err) {}

    // Check if Google Apps Script URL is configured
    if (CONFIG.APPS_SCRIPT_URL && CONFIG.APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL' && !CONFIG.APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT')) {
        try {
            await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(briefData)
            });
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            closeModal();
            openModal('success');
            form.reset();
            return;
        } catch(error) {
            console.error('Submission error:', error);
        }
    }

    // Success state fallback with WhatsApp direct confirmation
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    closeModal();
    openModal('success');
    
    const waText = encodeURIComponent('Halo Nara Creative! Saya telah mengirim brief proyek:\n\n' +
        '*Brand:* ' + (briefData.brandName || '-') + '\n' +
        '*Layanan:* ' + (briefData.services || '-') + '\n' +
        '*ID Brief:* ' + briefId);
    
    const successModal = document.getElementById('successModal');
    if (successModal) {
        const p = successModal.querySelector('p');
        if (p) {
            p.innerHTML = 'Brief Anda (<strong>' + briefId + '</strong>) telah dicatat. Tim kami akan menghubungi Anda maksimal dalam 24 jam kerja.<br><br>' +
                '<a href="https://wa.me/' + CONFIG.WHATSAPP + '?text=' + waText + '" target="_blank" class="btn btn-primary" style="display:inline-block; margin-top:10px; text-decoration:none; padding: 0.65rem 1.25rem; font-size: 0.9rem;">Konfirmasi via WhatsApp</a>';
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#FF6B35'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.animated-gradient, .floating-card');
    
    parallaxElements.forEach(el => {
        const speed = el.classList.contains('animated-gradient') ? 0.5 : 0.3;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Image Lazy Loading (for future use)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing Effect for Hero (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Easter egg: Konami code for fun
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 Easter egg found! You\'re awesome!', 'success');
        document.body.style.animation = 'rainbow 5s linear infinite';
    }
});

// Add rainbow animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

// Performance: Debounce scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

window.addEventListener('scroll', debounce(() => {
    // Your scroll-heavy operations here
}));

// Log for debugging
console.log('%c🎨 Nara Creative Studio', 'color: #FF6B35; font-size: 24px; font-weight: bold;');
console.log('%cWebsite by Nara Creative Team', 'color: #b0b0b0; font-size: 12px;');
console.log('%cInterested in working with us? naracreativestudio.id@gmail.com', 'color: #FF6B35; font-size: 14px;');
