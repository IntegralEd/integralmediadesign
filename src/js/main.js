// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinkItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Modal helpers
function stopVideoInModal(modal) {
    const iframe = modal.querySelector('iframe[data-video-src]');
    if (iframe) iframe.src = '';
}

// PDF Modal
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Video Modal
function openVideoModal(id, src) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const iframe = modal.querySelector('iframe[data-video-src]');
    if (iframe) iframe.src = src + '?autoplay=1&rel=0';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    stopVideoInModal(modal);
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('pdf-modal')) {
        stopVideoInModal(e.target);
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.pdf-modal.active').forEach(m => {
            stopVideoInModal(m);
            m.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// ImagePlaceholder Component
function createImagePlaceholder(label) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.textContent = label;
    return placeholder;
}

// Initialize all image placeholders on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-image-placeholder]').forEach(element => {
        const label = element.getAttribute('data-image-placeholder');
        const placeholder = createImagePlaceholder(label);
        element.appendChild(placeholder);
    });
});
