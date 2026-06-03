/* ─────────────────────────────────────────────────────────────────
   Secumind — interactive hero smoke
   Soft, glowing wisps that billow upward through a turbulent flow
   field and trail the cursor as it moves. Dependency-free, canvas 2D.
───────────────────────────────────────────────────────────────── */
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Muted, smoky brand tints — desaturated so overlaps read as lit
    // haze rather than neon light.
    const COLORS = [
        [138, 120, 190],  // dusty violet
        [120, 130, 180],  // periwinkle grey
        [104, 138, 178],  // smoky blue
        [134, 184, 168],  // muted mint
    ];

    let width = 0, height = 0, dpr = 1, MAX = 0;
    let pool = [];

    // Pointer in hero-pixel space; `e*` = last emit point (for trails).
    const ptr = { x: 0, y: 0, ex: 0, ey: 0, inside: false };

    function resize() {
        const rect = hero.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Particle budget scales with area (capped for performance).
        // Kept generously above the ambient equilibrium so wisps die of
        // old age (smooth fade) instead of being recycled mid-life.
        MAX = Math.min(360, Math.round((width * height) / 4200));
        pool = new Array(MAX).fill(null).map(() => ({ alive: false }));
        ptr.x = ptr.ex = width / 2;
        ptr.y = ptr.ey = height / 2;
    }

    function spawn(x, y, vx, vy, size, life, color) {
        // Prefer a free slot; if the pool is full, recycle the most-spent
        // particle so fresh wisps (e.g. the cursor trail) always appear.
        let slot = -1, mostSpent = -1;
        for (let i = 0; i < MAX; i++) {
            const p = pool[i];
            if (!p.alive) { slot = i; break; }
            const spent = p.age / p.life;
            if (spent > mostSpent) { mostSpent = spent; slot = i; }
        }
        const p = pool[slot];
        p.alive = true;
        p.x = x; p.y = y;
        p.vx = vx; p.vy = vy;
        p.age = 0;
        p.life = life;
        p.r0 = size;
        p.r1 = size * (2.4 + Math.random() * 1.6); // grows as it dissipates
        p.color = color || COLORS[(Math.random() * COLORS.length) | 0];
        p.alpha = 0.10 + Math.random() * 0.08;
    }

    // Cheap pseudo-curl flow field — sums of sines give a swirling,
    // non-repeating direction at any point/time.
    function flowAngle(x, y, t) {
        return (
            Math.sin(x * 0.0024 + t * 0.6) +
            Math.cos(y * 0.0030 - t * 0.5) +
            Math.sin((x + y) * 0.0016 + t * 0.35)
        ) * 1.4;
    }

    function update(dt, t) {
        for (let i = 0; i < MAX; i++) {
            const p = pool[i];
            if (!p.alive) continue;

            p.age += dt;
            if (p.age >= p.life) { p.alive = false; continue; }

            // Turbulence from the flow field.
            const ang = flowAngle(p.x, p.y, t);
            p.vx += Math.cos(ang) * 6 * dt;
            p.vy += Math.sin(ang) * 6 * dt;

            // Buoyancy — smoke rises.
            p.vy -= 14 * dt;

            // Cursor pushes wisps outward so they swirl around it.
            const dx = p.x - ptr.x;
            const dy = p.y - ptr.y;
            const d2 = dx * dx + dy * dy;
            const R = 150;
            if (d2 < R * R) {
                const d = Math.sqrt(d2) || 1;
                const f = (1 - d / R) * 90;
                p.vx += (dx / d) * f * dt;
                p.vy += (dy / d) * f * dt;
            }

            // Drag, then integrate.
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < MAX; i++) {
            const p = pool[i];
            if (!p.alive) continue;
            const lt = p.age / p.life;
            // Quick ease-in, long effortless ease-out: smoothstep on the
            // remaining life gives a vanishing tail with zero slope.
            const fadeIn = Math.min(1, lt / 0.18);
            const tail = 1 - lt;
            const fadeOut = tail * tail * (3 - 2 * tail);
            const a = fadeIn * fadeOut * p.alpha;
            const r = p.r0 + (p.r1 - p.r0) * lt;
            const [cr, cg, cb] = p.color;
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
            g.addColorStop(0, `rgba(${cr},${cg},${cb},${a * 0.8})`);
            g.addColorStop(0.45, `rgba(${cr},${cg},${cb},${a * 0.5})`);
            g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    // Ambient plumes rising from the bottom edge for atmosphere.
    function emitAmbient() {
        // Modest rate so the alive count settles well below MAX, leaving
        // headroom for the cursor trail without forcing recycles.
        if (Math.random() < 0.35) {
            const x = Math.random() * width;
            spawn(
                x,
                // Staggered well below the edge over a wide band so wisps
                // don't form a glowing line along the bottom.
                height + 30 + Math.random() * 130,
                (Math.random() - 0.5) * 14,
                -38 - Math.random() * 36,            // stronger rise
                30 + Math.random() * 40,
                3.5 + Math.random() * 2.5,
                null
            );
        }
    }

    // Emit a wisp trail along the cursor's path.
    function emitTrail() {
        const dx = ptr.x - ptr.ex;
        const dy = ptr.y - ptr.ey;
        const dist = Math.hypot(dx, dy);
        const step = 14;
        if (dist < step) return;
        const n = Math.min(Math.floor(dist / step), 6);
        for (let i = 1; i <= n; i++) {
            const f = i / n;
            spawn(
                ptr.ex + dx * f, ptr.ey + dy * f,
                dx * 0.18 + (Math.random() - 0.5) * 16,
                dy * 0.18 + (Math.random() - 0.5) * 16 - 8,
                26 + Math.random() * 26,
                2.6 + Math.random() * 2,
                null
            );
        }
        ptr.ex = ptr.x;
        ptr.ey = ptr.y;
    }

    // ── Main loop ───────────────────────────────────────────────────
    let running = false, lastT = 0;
    function render(now) {
        const ts = now * 0.001;
        let dt = lastT ? ts - lastT : 0.016;
        lastT = ts;
        if (dt > 0.05) dt = 0.05; // clamp after tab-switches

        emitAmbient();
        if (ptr.inside) emitTrail();
        update(dt, ts);
        draw();
        if (running) requestAnimationFrame(render);
    }

    // ── Pointer tracking ────────────────────────────────────────────
    function onPointerMove(e) {
        const rect = hero.getBoundingClientRect();
        ptr.x = e.clientX - rect.left;
        ptr.y = e.clientY - rect.top;
        if (!ptr.inside) { ptr.ex = ptr.x; ptr.ey = ptr.y; }
        ptr.inside = true;
    }
    function onLeave() { ptr.inside = false; }

    // ── Lifecycle ───────────────────────────────────────────────────
    function start() {
        if (running || reduceMotion) return;
        running = true;
        lastT = 0;
        requestAnimationFrame(render);
    }
    function stop() { running = false; }

    function init() {
        resize();
        canvas.classList.add('is-ready');

        if (reduceMotion) {
            for (let i = 0; i < 14; i++) {
                spawn(Math.random() * width, height * (0.4 + Math.random() * 0.6),
                    0, 0, 50 + Math.random() * 60, 1, null);
            }
            // Render one static frame.
            for (const p of pool) { if (p.alive) p.age = p.life * 0.5; }
            draw();
            return;
        }

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        hero.addEventListener('pointerleave', onLeave, { passive: true });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                entries[0].isIntersecting ? start() : stop();
            }, { threshold: 0 }).observe(hero);
        }
        start();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
