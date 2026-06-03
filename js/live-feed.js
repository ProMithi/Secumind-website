// ─────────────────────────────────────────────────────────────────
//  Secumind Live — threat intelligence feed
//  Same OTX key as threat-ticker.js. URLhaus needs no key.
// ─────────────────────────────────────────────────────────────────

(function () {
    const OTX_KEY    = 'bb4dfbc4bc2726bd39f722d5ee655fe7e236ccec2ee0114d670f609a21e3bec8';
    const REFRESH_MS = 90 * 1000;

    let allEvents    = [];
    let activeFilter = 'all';
    let totalLoaded  = 0;

    const RANSOMWARE_TAGS = ['ransomware','ryuk','revil','conti','lockbit','blackcat','maze','alphv','blackmatter'];

    // ── Severity helpers ──────────────────────────────────────────────
    function severityURLhaus(u) {
        const tags = (u.tags || []).map(t => t.toLowerCase());
        return tags.some(t => RANSOMWARE_TAGS.includes(t)) ? 'critical' : 'high';
    }

    function severityOTX(p) {
        const name = (p.name || '').toLowerCase();
        if (/cve-|zero.?day|0.?day|\brce\b|critical exploit/.test(name)) return 'critical';
        if (p.adversary) return 'high';
        return 'medium';
    }

    // ── Formatters ────────────────────────────────────────────────────
    function fmtTime(d) {
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function fmtDate(d) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }

    function fromURLhaus(u) {
        const host = u.host || u.url.replace(/https?:\/\//, '').split('/')[0];
        const tags = (u.tags || []).slice(0, 5);
        const sev  = severityURLhaus(u);
        let   date = new Date(u.date_added + (u.date_added.endsWith('UTC') ? '' : ' UTC'));
        if (isNaN(date)) date = new Date();
        return {
            id:        `urlhaus-${u.id}`,
            type:      'malware-url',
            typeLabel: 'Malware Distribution',
            severity:  sev,
            title:     `Active malware URL · ${host}`,
            details: [
                tags.length             ? `Family: ${tags[0]}`                     : null,
                'Status: Online',
                tags.length > 1         ? `Tags: ${tags.join(', ')}`               : null,
            ].filter(Boolean),
            tags,
            source:    'URLhaus',
            timestamp: date,
        };
    }

    function fromOTX(p) {
        const sev  = severityOTX(p);
        let   date = new Date(p.modified || p.created);
        if (isNaN(date)) date = new Date();
        return {
            id:        `otx-${p.id}`,
            type:      'threat-pulse',
            typeLabel: 'Threat Intelligence Pulse',
            severity:  sev,
            title:     p.name,
            details: [
                p.adversary                                 ? `Adversary: ${p.adversary}`                                          : null,
                p.targeted_countries && p.targeted_countries.length ? `Targets: ${p.targeted_countries.slice(0, 4).join(', ')}`   : null,
                p.malware_families   && p.malware_families.length   ? `Malware: ${p.malware_families.slice(0, 3).join(', ')}`     : null,
                p.attack_ids         && p.attack_ids.length         ? `MITRE: ${p.attack_ids.slice(0, 3).map(a => a.id).join(', ')}` : null,
                p.indicators_count                          ? `IOCs: ${p.indicators_count}`                                        : null,
            ].filter(Boolean),
            tags: [...(p.tags || []), ...(p.malware_families || [])].slice(0, 6),
            source:    'AlienVault OTX',
            timestamp: date,
        };
    }

    // ── Fetchers ──────────────────────────────────────────────────────
    async function fetchURLhaus() {
        const resp = await fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/', {
            method:  'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body:    'limit=40',
        });
        const data = await resp.json();
        return (data.urls || []).filter(u => u.url_status === 'online').map(fromURLhaus);
    }

    async function fetchOTX() {
        if (!OTX_KEY) return [];
        const resp = await fetch(
            'https://otx.alienvault.com/api/v1/pulses/activity?limit=30',
            { headers: { 'X-OTX-API-KEY': OTX_KEY } }
        );
        if (!resp.ok) return [];
        const { results = [] } = await resp.json();
        return results.map(fromOTX);
    }

    // ── Render helpers ────────────────────────────────────────────────
    function itemHTML(ev) {
        const detailsHTML = ev.details
            .map(d => `<span class="feed-detail">${d}</span>`)
            .join('');
        const tagsHTML = ev.tags.length
            ? `<div class="feed-tags">${ev.tags.map(t => `<span class="feed-tag">${t}</span>`).join('')}</div>`
            : '';
        const srcClass = ev.source === 'URLhaus' ? 'source-badge--urlhaus' : 'source-badge--otx';

        return `<div class="feed-item feed-item--${ev.severity}" data-type="${ev.type}" data-severity="${ev.severity}" data-id="${ev.id}">
    <div class="feed-time">
        <div class="feed-time-hms">${fmtTime(ev.timestamp)}</div>
        <div class="feed-time-date">${fmtDate(ev.timestamp)}</div>
    </div>
    <div class="feed-main">
        <div class="feed-header">
            <span class="feed-badge feed-badge--${ev.severity}">${ev.severity.toUpperCase()}</span>
            <span class="feed-type">${ev.typeLabel}</span>
        </div>
        <div class="feed-title">${ev.title}</div>
        <div class="feed-details">${detailsHTML}</div>
        ${tagsHTML}
    </div>
    <div class="feed-source">
        <span class="source-badge ${srcClass}">${ev.source}</span>
    </div>
</div>`;
    }

    function applyFilter(events) {
        return events.filter(ev => {
            if (activeFilter === 'all')      return true;
            if (activeFilter === 'malware')  return ev.type === 'malware-url';
            if (activeFilter === 'apt')      return ev.type === 'threat-pulse';
            if (activeFilter === 'critical') return ev.severity === 'critical';
            if (activeFilter === 'high')     return ev.severity === 'high';
            return true;
        });
    }

    function renderFeed(flash = false) {
        const feed = document.getElementById('liveFeed');
        if (!feed) return;
        const visible = applyFilter(allEvents);
        if (!visible.length) {
            feed.innerHTML = '<div class="live-empty">No events match this filter.</div>';
            return;
        }
        feed.innerHTML = visible.map(itemHTML).join('');
        if (flash) {
            feed.querySelectorAll('.feed-item').forEach((el, i) => {
                if (i < 6) el.classList.add('feed-item--new');
            });
        }
    }

    function updateStats() {
        const countEl  = document.getElementById('totalCount');
        const updateEl = document.getElementById('lastUpdate');
        if (countEl)  countEl.textContent  = totalLoaded;
        if (updateEl) updateEl.textContent = fmtTime(new Date());

        const critical = allEvents.filter(e => e.severity === 'critical').length;
        const high     = allEvents.filter(e => e.severity === 'high').length;
        const medium   = allEvents.filter(e => e.severity === 'medium').length;
        const bd = document.getElementById('severityBreakdown');
        if (bd) {
            bd.innerHTML = [
                critical ? `<span class="sev-count sev-count--critical">${critical} Critical</span>` : '',
                high     ? `<span class="sev-count sev-count--high">${high} High</span>`             : '',
                medium   ? `<span class="sev-count sev-count--medium">${medium} Medium</span>`       : '',
            ].join('');
        }
    }

    // ── Refresh ───────────────────────────────────────────────────────
    async function refresh(flash = false) {
        const [a, b] = await Promise.allSettled([fetchURLhaus(), fetchOTX()]);
        const fresh = [
            ...(a.status === 'fulfilled' ? a.value : []),
            ...(b.status === 'fulfilled' ? b.value : []),
        ];
        if (!fresh.length) return;

        const seen = new Set();
        allEvents = fresh
            .filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; })
            .sort((a, b) => b.timestamp - a.timestamp);

        totalLoaded += fresh.length;
        renderFeed(flash);
        updateStats();
    }

    // ── Filter pills ──────────────────────────────────────────────────
    function initFilters() {
        const pills = document.getElementById('filterPills');
        if (!pills) return;
        pills.addEventListener('click', e => {
            const pill = e.target.closest('.filter-pill');
            if (!pill) return;
            pills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.dataset.filter;
            renderFeed(false);
        });
    }

    // ── Init ──────────────────────────────────────────────────────────
    async function init() {
        initFilters();
        const feed = document.getElementById('liveFeed');
        if (feed) {
            feed.innerHTML = `<div class="live-loading"><div class="live-loading-dot"></div><span>Fetching live threat data…</span></div>`;
        }
        await refresh(false);
        setInterval(() => refresh(true), REFRESH_MS);
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
