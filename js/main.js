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
