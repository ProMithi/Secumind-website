// ─────────────────────────────────────────────────────────────────
//  Secumind — live threat ticker
//
//  Sources (both optional, graceful fallback to static ticker):
//    1. URLhaus (abuse.ch) — no key needed, live malware URLs
//    2. AlienVault OTX     — free key from https://otx.alienvault.com
//       adds named threat campaigns, CVEs, MITRE ATT&CK techniques
// ─────────────────────────────────────────────────────────────────

(function () {
    // Paste your free OTX key here. Leave empty to run on URLhaus only.
    const OTX_KEY = 'bb4dfbc4bc2726bd39f722d5ee655fe7e236ccec2ee0114d670f609a21e3bec8';

    const REFRESH_MS = 5 * 60 * 1000; // re-fetch every 5 minutes
    let tickerEl = null;

    function trunc(s, n) {
        return s && s.length > n ? s.slice(0, n - 1) + '…' : s || '';
    }

    // ── URLhaus ───────────────────────────────────────────────────────
    // Returns recent, currently-online malware delivery URLs.
    async function fetchURLhaus() {
        const resp = await fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'limit=40',
        });
        const data = await resp.json();
        return (data.urls || [])
            .filter(u => u.url_status === 'online')
            .slice(0, 15)
            .map(u => {
                const tag  = u.tags && u.tags.length ? u.tags[0] : 'malware';
                const host = u.host || u.url.replace(/https?:\/\//, '').split('/')[0];
                return `Live malware URL · ${trunc(host, 38)} · ${tag} · URLhaus`;
            });
    }

    // ── AlienVault OTX ────────────────────────────────────────────────
    // Returns recent threat pulses: named campaigns, CVEs, MITRE techniques.
    async function fetchOTX() {
        if (!OTX_KEY) return [];
        const resp = await fetch(
            'https://otx.alienvault.com/api/v1/pulses/activity?limit=20',
            { headers: { 'X-OTX-API-KEY': OTX_KEY } }
        );
        if (!resp.ok) return [];
        const { results = [] } = await resp.json();
        return results.map(p => {
            const parts = [trunc(p.name, 52)];
            if (p.targeted_countries && p.targeted_countries.length)
                parts.push(p.targeted_countries.slice(0, 2).join(', ') + ' targeted');
            if (p.attack_ids && p.attack_ids.length)
                parts.push('MITRE ' + p.attack_ids[0].id);
            if (p.malware_families && p.malware_families.length)
                parts.push(p.malware_families[0]);
            return parts.join(' · ');
        }).filter(Boolean);
    }

    // ── Render ────────────────────────────────────────────────────────
    function render(items) {
        if (!items.length || !tickerEl) return;

        // Shuffle so URLhaus and OTX items are interleaved
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        const row = items
            .map(t => `<span>${t}</span><span class="ticker-sep">|</span>`)
            .join('');

        // Duplicate for seamless CSS loop (translateX -50%)
        tickerEl.innerHTML = row + row;

        // Restart animation after DOM update
        tickerEl.style.animation = 'none';
        void tickerEl.offsetWidth;
        tickerEl.style.animation = '';
    }

    // ── Poll ──────────────────────────────────────────────────────────
    async function refresh() {
        const [urlhausResult, otxResult] = await Promise.allSettled([
            fetchURLhaus(),
            fetchOTX(),
        ]);
        const items = [
            ...(urlhausResult.status === 'fulfilled' ? urlhausResult.value : []),
            ...(otxResult.status    === 'fulfilled' ? otxResult.value    : []),
        ];
        if (items.length) render(items);
        // If both fail, the existing static ticker content remains untouched
    }

    function init() {
        tickerEl = document.querySelector('.ticker-inner');
        if (!tickerEl) return;
        refresh();
        setInterval(refresh, REFRESH_MS);
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
