// =========================================
// CPR Educational Website - Main JavaScript
// =========================================

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

// =========================================
// Emergency Mode
// =========================================
const emergencyBtn = document.getElementById('emergencyBtn');
const emergencyMode = document.getElementById('emergency-mode');
const closeEmergency = document.getElementById('closeEmergency');
const beatIndicator = document.getElementById('beatIndicator');
const compressionCount = document.getElementById('compressionCount');

let audioContext;
let metronomeInterval;
let compressionCounter = 0;
let isEmergencyActive = false;

// Initialize Audio Context (for metronome)
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play beep sound at specified frequency
function playBeep(frequency = 800, duration = 0.05) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Start Emergency Mode
function startEmergencyMode() {
    initAudioContext();
    
    emergencyMode.classList.add('active');
    document.body.style.overflow = 'hidden';
    isEmergencyActive = true;
    compressionCounter = 0;
    compressionCount.textContent = compressionCounter;
    
    // Start metronome at 110 BPM (middle of 100-120 range)
    const bpm = 110;
    const interval = (60 / bpm) * 1000; // Convert to milliseconds
    
    metronomeInterval = setInterval(() => {
        if (isEmergencyActive) {
            // Play beep
            playBeep(800, 0.05);
            
            // Visual pulse
            beatIndicator.classList.add('pulse');
            setTimeout(() => {
                beatIndicator.classList.remove('pulse');
            }, 150);
            
            // Increment counter
            compressionCounter++;
            if (compressionCounter > 30) {
                compressionCounter = 1;
            }
            compressionCount.textContent = compressionCounter;
            
            // Change instruction at 30
            const emergencyStep = document.getElementById('emergencyStep');
            if (compressionCounter === 30) {
                emergencyStep.innerHTML = '✅ ครบ 30 ครั้ง!<br>ผายปอด 2 ครั้ง (ถ้าทำได้)<br>จากนั้นกดต่อ';
                setTimeout(() => {
                    emergencyStep.innerHTML = 'กดหน้าอกลึก 5-6 ซม.<br>ตามจังหวะเสียง 100-120 ครั้ง/นาที';
                }, 3000);
            }
        }
    }, interval);
}

// Stop Emergency Mode
function stopEmergencyMode() {
    emergencyMode.classList.remove('active');
    document.body.style.overflow = 'auto';
    isEmergencyActive = false;
    
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
    }
    
    compressionCounter = 0;
    compressionCount.textContent = compressionCounter;
}

// Event Listeners for Emergency Mode
if (emergencyBtn) {
    emergencyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        startEmergencyMode();
    });
}

if (closeEmergency) {
    closeEmergency.addEventListener('click', () => {
        stopEmergencyMode();
    });
}

// Close emergency mode with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isEmergencyActive) {
        stopEmergencyMode();
    }
});

// =========================================
// Smooth Scroll
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// Scroll Animations
// =========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// =========================================
// Active Navigation Link
// =========================================
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Set active nav on load
document.addEventListener('DOMContentLoaded', setActiveNav);

// =========================================
// Form Validation (for quiz pages)
// =========================================
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// =========================================
// Print Function
// =========================================
function printPage() {
    window.print();
}

// =========================================
// Share Function
// =========================================
async function sharePage() {
    const shareData = {
        title: document.title,
        text: 'เรียนรู้วิธีทำ CPR ที่ถูกต้อง - ความรู้เล็ก ๆ ที่ช่วยชีวิตคนได้',
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
            alert('ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว!');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
}

// =========================================
// Utility Functions
// =========================================

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Get element by ID safely
function getEl(id) {
    return document.getElementById(id);
}

// Add event listener safely
function addEvent(elementId, event, handler) {
    const element = getEl(elementId);
    if (element) {
        element.addEventListener(event, handler);
    }
}

// Console welcome message
console.log('%c🫀 CPR Education Website', 'color: #E31B23; font-size: 20px; font-weight: bold;');
console.log('%cความรู้เล็ก ๆ ที่ช่วยชีวิตคนได้', 'color: #4A90E2; font-size: 14px;');
console.log('%cWebsite by CPR Education Thailand', 'color: #666; font-size: 12px;');
