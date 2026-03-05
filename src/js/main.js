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
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ── Video Modal ──────────────────────────────────────────────────────────────

function stopVideoInModal(modal) {
    const iframe = modal.querySelector('iframe[data-video-src]');
    if (iframe) iframe.src = '';
}

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

// ── PDF Gallery ──────────────────────────────────────────────────────────────

const PdfGallery = (() => {
    let pdf        = null;
    let current    = 1;
    let total      = 0;
    let activeWrap = 'A';
    let busy       = false;

    const wrap   = id => document.getElementById('pdfWrap'   + id);
    const canvas = id => document.getElementById('pdfCanvas' + id);

    async function renderToWrap(pageNum, wrapId) {
        const page  = await pdf.getPage(pageNum);
        const stage = document.getElementById('pdfStage');
        const pad   = 32;
        const availW = stage.clientWidth  - pad * 2;
        const availH = stage.clientHeight - pad * 2;

        const vp1     = page.getViewport({ scale: 1 });
        const scale   = Math.min(availW / vp1.width, availH / vp1.height);
        const dpr     = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale * dpr });

        const c = canvas(wrapId);
        c.width  = viewport.width;
        c.height = viewport.height;
        c.style.width  = (viewport.width  / dpr) + 'px';
        c.style.height = (viewport.height / dpr) + 'px';

        await page.render({ canvasContext: c.getContext('2d'), viewport }).promise;
    }

    function slide(wrapId, x, animate) {
        const el = wrap(wrapId);
        el.style.transition = animate
            ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none';
        el.style.transform = `translateX(${x})`;
    }

    async function goToPage(n, direction) {
        if (busy || n < 1 || n > total) return;
        busy = true;

        const incoming = activeWrap === 'A' ? 'B' : 'A';
        const startX   = direction === 'forward' ? '100%' : '-100%';
        const exitX    = direction === 'forward' ? '-100%' : '100%';

        // Park incoming off-screen instantly, then render
        slide(incoming, startX, false);
        await renderToWrap(n, incoming);

        // Force a paint so the transition fires correctly
        wrap(incoming).getBoundingClientRect();

        // Slide both panels
        slide(activeWrap, exitX, true);
        slide(incoming, '0%', true);

        await new Promise(r => setTimeout(r, 430));

        activeWrap = incoming;
        current    = n;
        updateControls();
        busy = false;
    }

    function updateControls() {
        const info = document.getElementById('pdfPageInfo');
        const prev = document.getElementById('pdfPrev');
        const next = document.getElementById('pdfNext');
        if (info) info.textContent = `${current} / ${total}`;
        if (prev) prev.disabled = current <= 1;
        if (next) next.disabled = current >= total;
    }

    return {
        async open() {
            const modal = document.getElementById('pdf-modal');
            if (!modal) return;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (!pdf) {
                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                const info = document.getElementById('pdfPageInfo');
                if (info) info.textContent = 'Loading…';

                pdf    = await pdfjsLib.getDocument('assets/Media/Sales%20Sheets%20for%20Sub-Brands.pdf').promise;
                total  = pdf.numPages;
                current    = 1;
                activeWrap = 'A';
                slide('B', '100%', false);
            }

            await renderToWrap(current, activeWrap);
            updateControls();
        },

        close() {
            const modal = document.getElementById('pdf-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        next() { goToPage(current + 1, 'forward');  },
        prev() { goToPage(current - 1, 'backward'); }
    };
})();

// ── Global close handlers ────────────────────────────────────────────────────

// Backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('pdf-modal')) {
        if (e.target.classList.contains('video-modal')) {
            closeVideoModal(e.target.id);
        } else {
            PdfGallery.close();
        }
    }
});

// Escape key + arrow key navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.pdf-modal.active').forEach(m => {
            if (m.classList.contains('video-modal')) {
                stopVideoInModal(m);
                m.classList.remove('active');
            } else {
                PdfGallery.close();
            }
        });
        document.body.style.overflow = '';
    }

    const pdfModal = document.getElementById('pdf-modal');
    if (pdfModal?.classList.contains('active')) {
        if (e.key === 'ArrowRight') PdfGallery.next();
        if (e.key === 'ArrowLeft')  PdfGallery.prev();
    }
});

// ── Image placeholders (legacy) ──────────────────────────────────────────────

function createImagePlaceholder(label) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.textContent = label;
    return placeholder;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-image-placeholder]').forEach(element => {
        const label = element.getAttribute('data-image-placeholder');
        element.appendChild(createImagePlaceholder(label));
    });
});
