// Scroll-triggered counter animation for proof metric values
(function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || entry.target.dataset.counted) return;
            entry.target.dataset.counted = '1';
            const target = parseInt(entry.target.dataset.target, 10);
            if (isNaN(target) || target === 0) return;
            const duration = 1200;
            const start = performance.now();
            (function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - t, 3);
                entry.target.textContent = Math.round(ease * target);
                if (t < 1) requestAnimationFrame(tick);
            })(performance.now());
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.proof-value[data-target]').forEach(el => {
        observer.observe(el);
    });
})();

// Mobile nav toggle
function toggleNav() {
    const links = document.getElementById('navLinks');
    if (links) links.classList.toggle('open');
}

// Footer year — keeps the copyright current without yearly edits
(function () {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
})();

// Close mobile nav after a link tap
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        const links = document.getElementById('navLinks');
        if (links) links.classList.remove('open');
    });
});

// ── Light / dark theme toggle ───────────────────────────────────────
// The icon shows a glowing bulb in dark mode (radiating light) and a
// plain, unlit bulb in light mode.
(function () {
    const STORE = 'theme';
    const root = document.documentElement;

    // Shared bulb body; the dark-mode icon adds radiating rays.
    const BULB =
        '<path d="M9.5 18h5"/><path d="M10 21h4"/>' +
        '<path d="M12 3.5a5.5 5.5 0 0 0-3.5 9.75c.7.6.9 1 .95 2.25h5.1c.05-1.25.25-1.65.95-2.25A5.5 5.5 0 0 0 12 3.5Z"/>';
    const RAYS =
        '<line x1="12" y1="1" x2="12" y2="2.4"/>' +
        '<line x1="4.6" y1="5.1" x2="5.7" y2="6.2"/>' +
        '<line x1="19.4" y1="5.1" x2="18.3" y2="6.2"/>' +
        '<line x1="2.2" y1="11" x2="3.7" y2="11"/>' +
        '<line x1="21.8" y1="11" x2="20.3" y2="11"/>';

    function svg(inner) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
            'aria-hidden="true">' + inner + '</svg>';
    }
    const ICONS = {
        dark: svg(RAYS + BULB), // dark active → bulb radiating light
        light: svg(BULB),       // light active → plain bulb, no rays
    };

    const current = () =>
        root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

    let btn;
    function apply(theme) {
        if (theme === 'light') root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
        try { localStorage.setItem(STORE, theme); } catch (e) { /* ignore */ }
        if (btn) {
            btn.innerHTML = ICONS[theme];
            btn.setAttribute('aria-label',
                theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
            btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        }
    }

    function init() {
        const navInner = document.querySelector('.nav-inner');
        if (!navInner) return;
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle';
        navInner.appendChild(btn);
        btn.addEventListener('click', () =>
            apply(current() === 'light' ? 'dark' : 'light'));
        apply(current());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
